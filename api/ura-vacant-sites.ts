import type { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { fetchBufferWithRetry, formatExcelDate, getCachedOrFetch } from './utils';

export const URA_VACANT_SITES_URL =
  'https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx';

export interface UraVacantSiteRecord {
  id: string;
  launchDate: string;
  tenderClosingDate: string;
  awardDate: string;
  location: string;
  planningArea: string;
  developmentType: string;
  developmentCode: string;
  leaseYears: number | string;
  siteAreaSqm: number;
  siteAreaSqft: number;
  gpr: number | null;
  gfaSqm: number;
  gfaSqft: number;
  bidsCount: number;
  successfulTenderer: string;
  successfulTenderPrice: number;
  pricePsmGfa: number;
  indicativePsfPpr: number;
}

export async function fetchAndParseVacantSites(): Promise<UraVacantSiteRecord[]> {
  const buffer = await fetchBufferWithRetry(URA_VACANT_SITES_URL);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0] || 'ura-vacant sites';
  const worksheet = workbook.Sheets[sheetName];

  // Raw array of arrays
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: '' });
  if (rawRows.length < 2) return [];

  // Row 0 is headers
  // [Date of Launch, Date of Tender Closing, Date of Award, Location, Type of Development Allowed, Lease (years), Type of Devt Code, Site Area (m2), GPR, GFA (m2), No. of Bids, Name of Successful Tenderer, Successful Tender Price, $psm per GFA or $psm per GPR, Planning Area]
  const records: UraVacantSiteRecord[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const location = String(row[3] || '').trim();
    if (!location) continue; // Skip blank rows

    const siteAreaSqm = Number(row[7]) || 0;
    const gfaSqm = Number(row[9]) || 0;
    const psm = Number(row[13]) || 0;
    const tenderPrice = Number(row[12]) || 0;
    const gpr = row[8] !== '' && row[8] !== undefined && !isNaN(Number(row[8])) ? Number(row[8]) : null;

    // 1 sqm = 10.7639 sqft
    const siteAreaSqft = Math.round(siteAreaSqm * 10.7639);
    const gfaSqft = Math.round(gfaSqm * 10.7639);
    const indicativePsfPpr = psm > 0 ? Math.round((psm / 10.7639) * 10) / 10 : 0;

    records.push({
      id: `vacant-${i}`,
      launchDate: formatExcelDate(row[0]),
      tenderClosingDate: formatExcelDate(row[1]),
      awardDate: formatExcelDate(row[2]),
      location,
      developmentType: String(row[4] || '').trim(),
      leaseYears: typeof row[5] === 'number' || typeof row[5] === 'string' ? row[5] : 99,
      developmentCode: String(row[6] || '').trim(),
      siteAreaSqm,
      siteAreaSqft,
      gpr,
      gfaSqm,
      gfaSqft,
      bidsCount: Number(row[10]) || 0,
      successfulTenderer: String(row[11] || '').trim(),
      successfulTenderPrice: tenderPrice,
      pricePsmGfa: psm,
      indicativePsfPpr,
      planningArea: String(row[14] || '').trim(),
    });
  }

  return records;
}

/**
 * Serverless / Express Handler: GET /api/ura-vacant-sites
 * Supports query parameters:
 *  - search: keyword search in location, tenderer, planningArea
 *  - planningArea: filter by specific planning area (e.g. Bedok, Bishan, Bukit Merah)
 *  - limit: default 50
 *  - offset: default 0
 *  - raw: returns unparsed original excel file if raw=true
 */
export async function uraVacantSitesHandler(req: Request, res: Response) {
  try {
    // If client requested the raw binary file
    if (req.query.raw === 'true' || req.query.download === 'true') {
      const buffer = await fetchBufferWithRetry(URA_VACANT_SITES_URL);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="URA-Vacant-Sites.xlsx"'
      );
      return res.status(200).send(buffer);
    }

    const data = await getCachedOrFetch('ura-vacant-sites', fetchAndParseVacantSites);

    const { search, planningArea, limit = '50', offset = '0' } = req.query;

    let filtered = data;

    if (typeof planningArea === 'string' && planningArea.trim()) {
      const area = planningArea.toLowerCase().trim();
      filtered = filtered.filter((item) => item.planningArea.toLowerCase().includes(area));
    }

    if (typeof search === 'string' && search.trim()) {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.location.toLowerCase().includes(term) ||
          item.successfulTenderer.toLowerCase().includes(term) ||
          item.planningArea.toLowerCase().includes(term) ||
          item.developmentType.toLowerCase().includes(term)
      );
    }

    const start = Math.max(0, parseInt(offset as string, 10) || 0);
    const take = Math.min(200, Math.max(1, parseInt(limit as string, 10) || 50));
    const paginated = filtered.slice(start, start + take);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=900');

    return res.status(200).json({
      success: true,
      source: URA_VACANT_SITES_URL,
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
      error: 'Failed to fetch URA Vacant Sites',
      details: message,
    });
  }
}

export default uraVacantSitesHandler;
