import type { Request, Response } from 'express';
import { fetchAndParseVacantSites } from './ura-vacant-sites';
import { fetchAndParseLandedSites } from './ura-landed-housing';
import { getCachedOrFetch } from './utils';

/**
 * Unified URA Sites Serverless Handler
 * GET /api/ura-sites
 * Parameters:
 *  - type: 'vacant' | 'landed' | 'all' (default: 'all')
 *  - search: keyword search
 *  - planningArea: filter by planning area
 *  - limit: default 50
 *  - offset: default 0
 */
export async function uraSitesHandler(req: Request, res: Response) {
  try {
    const { type = 'all', search, planningArea, limit = '50', offset = '0' } = req.query;

    let items: Array<Record<string, unknown>> = [];

    if (type === 'vacant') {
      const vacant = await getCachedOrFetch('ura-vacant-sites', fetchAndParseVacantSites);
      items = vacant.map((v) => ({ ...v, category: 'Vacant Site (Non-Landed/Commercial)' }));
    } else if (type === 'landed') {
      const landed = await getCachedOrFetch('ura-landed-housing', fetchAndParseLandedSites);
      items = landed.map((l) => ({ ...l, category: 'Landed Housing Site' }));
    } else {
      const [vacant, landed] = await Promise.all([
        getCachedOrFetch('ura-vacant-sites', fetchAndParseVacantSites),
        getCachedOrFetch('ura-landed-housing', fetchAndParseLandedSites),
      ]);
      items = [
        ...vacant.map((v) => ({ ...v, category: 'Vacant Site (Non-Landed/Commercial)' })),
        ...landed.map((l) => ({ ...l, category: 'Landed Housing Site' })),
      ];
    }

    let filtered = items;

    if (typeof planningArea === 'string' && planningArea.trim()) {
      const area = planningArea.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        String(item.planningArea || '').toLowerCase().includes(area)
      );
    }

    if (typeof search === 'string' && search.trim()) {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          String(item.location || '').toLowerCase().includes(term) ||
          String(item.successfulTenderer || '').toLowerCase().includes(term) ||
          String(item.planningArea || '').toLowerCase().includes(term)
      );
    }

    const start = Math.max(0, parseInt(offset as string, 10) || 0);
    const take = Math.min(200, Math.max(1, parseInt(limit as string, 10) || 50));
    const paginated = filtered.slice(start, start + take);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=900');

    return res.status(200).json({
      success: true,
      filterType: type,
      totalCount: filtered.length,
      returnedCount: paginated.length,
      offset: start,
      limit: take,
      data: paginated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch URA sites data',
      details: message,
    });
  }
}

export default uraSitesHandler;
