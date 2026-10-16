import type { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { fetchBufferWithRetry, formatExcelDate, getCachedOrFetch } from './utils';

export const URA_LANDED_HOUSING_URL =
  'https://isomer-user-content.by.gov.sg/467/fba83bdf-3004-4233-835f-ce47bccdb3b2/ura-landed-housing-sites.xlsx';

export interface UraLandedSiteRecord {
  id: string;
  launchDate: string;
  tenderClosingDate: string;
  awardDate: string;
  location: string;
  developmentType: string;
  leaseYears: number | string;
  siteAreaSqm: number;
  siteAreaSqft: number;
  bidsCount: number;
  successfulTenderer: string;
  successfulTenderPrice: number;
  pricePsmSiteArea: number;
  indicativePsfSiteArea: number;
  planningArea: string;
}

export async function fetchAndParseLandedSites(): Promise<UraLandedSiteRecord[]> {
  const buffer = await fetchBufferWithRetry(URA_LANDED_HOUSING_URL);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0] || 'ura-landed housing sites';
  const worksheet = workbook.Sheets[sheetName];

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: '' });
  if (rawRows.length < 2) return [];

  // Headers: [Date of Launch, Date of Tender Closing, Date of Award, Location, Type of Development Allowed, Lease (yrs), Site Area (m2), No. of Bids, Name of Successful Tenderer, Successful Tender Price, $psm per Site Area, Planning Area]
  const records: UraLandedSiteRecord[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const location = String(row[3] || '').trim();
    if (!location) continue;

    const siteAreaSqm = Number(row[6]) || 0;
    const psm = Number(row[10]) || 0;
    const tenderPrice = Number(row[9]) || 0;

    const siteAreaSqft = Math.round(siteAreaSqm * 10.7639);
    const indicativePsfSiteArea = psm > 0 ? Math.round((psm / 10.7639) * 10) / 10 : 0;

    records.push({
      id: `landed-${i}`,
      launchDate: formatExcelDate(row[0]),
      tenderClosingDate: formatExcelDate(row[1]),
      awardDate: formatExcelDate(row[2]),
      location,
      developmentType: String(row[4] || '').trim(),
      leaseYears: typeof row[5] === 'number' || typeof row[5] === 'string' ? row[5] : 99,
      siteAreaSqm,
      siteAreaSqft,
      bidsCount: Number(row[7]) || 0,
      successfulTenderer: String(row[8] || '').trim(),
      successfulTenderPrice: tenderPrice,
      pricePsmSiteArea: psm,
      indicativePsfSiteArea,
      planningArea: String(row[11] || '').trim(),
    });
  }

  return records;
}

/**
 * Serverless / Express Handler: GET /api/ura-landed-housing
 * Supports query parameters:
 *  - search: keyword search in location, tenderer, planningArea
 *  - planningArea: filter by planning area (e.g. Bukit Timah, Serangoon, Hougang)
 *  - limit: default 50
 *  - offset: default 0
 *  - raw: returns unparsed original excel file if raw=true
 */
export async function uraLandedHousingHandler(req: Request, res: Response) {
  try {
    if (req.query.raw === 'true' || req.query.download === 'true') {
      const buffer = await fetchBufferWithRetry(URA_LANDED_HOUSING_URL);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="URA-Landed-Housing-Sites.xlsx"'
      );
      return res.status(200).send(buffer);
    }

    const data = await getCachedOrFetch('ura-landed-housing', fetchAndParseLandedSites);

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
          item.planningArea.toLowerCase().includes(term)
      );
    }

    const start = Math.max(0, parseInt(offset as string, 10) || 0);
    const take = Math.min(200, Math.max(1, parseInt(limit as string, 10) || 50));
    const paginated = filtered.slice(start, start + take);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=900');

    return res.status(200).json({
      success: true,
      source: URA_LANDED_HOUSING_URL,
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
      error: 'Failed to fetch URA Landed Housing Sites',
      details: message,
    });
  }
}

export default uraLandedHousingHandler;
