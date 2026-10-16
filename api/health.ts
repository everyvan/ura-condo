import type { Request, Response } from 'express';

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  uptime: number;
  timestamp: string;
  environment: string;
  endpoints: {
    vacantSites: {
      url: string;
      status: string;
      lastChecked?: string;
    };
    landedHousing: {
      url: string;
      status: string;
      lastChecked?: string;
    };
  };
}

const URA_VACANT_SITES_URL =
  'https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx';
const URA_LANDED_HOUSING_URL =
  'https://isomer-user-content.by.gov.sg/467/fba83bdf-3004-4233-835f-ce47bccdb3b2/ura-landed-housing-sites.xlsx';

const startTime = Date.now();

/**
 * Serverless / Express Health Check Handler
 * GET /api/health
 */
export async function healthHandler(req: Request, res: Response) {
  const checkConnectivity = req.query.probe === 'true' || req.query.probe === '1';

  let vacantStatus = 'configured';
  let landedStatus = 'configured';

  if (checkConnectivity) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const [r1, r2] = await Promise.all([
        fetch(URA_VACANT_SITES_URL, {
          method: 'HEAD',
          headers: { 'User-Agent': 'Mozilla/5.0 PropLaunch/1.0' },
          signal: controller.signal,
        }),
        fetch(URA_LANDED_HOUSING_URL, {
          method: 'HEAD',
          headers: { 'User-Agent': 'Mozilla/5.0 PropLaunch/1.0' },
          signal: controller.signal,
        }),
      ]);
      clearTimeout(timeout);
      vacantStatus = r1.ok ? 'healthy (200 OK)' : `HTTP ${r1.status}`;
      landedStatus = r2.ok ? 'healthy (200 OK)' : `HTTP ${r2.status}`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'timeout';
      vacantStatus = `probe failed: ${msg}`;
      landedStatus = `probe failed: ${msg}`;
    }
  }

  const responseData: HealthCheckResponse = {
    status: 'ok',
    service: 'PropLaunch SG - URA Serverless Data API',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      vacantSites: {
        url: URA_VACANT_SITES_URL,
        status: vacantStatus,
        lastChecked: new Date().toISOString(),
      },
      landedHousing: {
        url: URA_LANDED_HOUSING_URL,
        status: landedStatus,
        lastChecked: new Date().toISOString(),
      },
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(responseData);
}

// Default export for Vercel / serverless runtime compatibility
export default healthHandler;
