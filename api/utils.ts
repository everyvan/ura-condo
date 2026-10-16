import * as XLSX from 'xlsx';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory cache with 15-minute TTL to ensure fast responses and protect against CloudFront rate limits
const cacheStore: Map<string, CacheEntry<unknown>> = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Fetch remote file as an ArrayBuffer/Buffer with standard User-Agent header
 */
export async function fetchBufferWithRetry(url: string, retries = 2): Promise<Buffer> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PropLaunch/2.4',
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/octet-stream,*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url} - HTTP status ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Convert Excel serial date number to ISO formatted date string (YYYY-MM-DD)
 */
export function formatExcelDate(val: unknown): string {
  if (val === undefined || val === null || val === '') return '';
  if (typeof val === 'number') {
    // Excel epoch begins Jan 1, 1900 with leap year bug adjustment (25569 days to Unix epoch)
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }
  return String(val).trim();
}

/**
 * Get or set cached data helper
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = CACHE_TTL_MS
): Promise<T> {
  const cached = cacheStore.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  const freshData = await fetcher();
  cacheStore.set(key, { data: freshData, timestamp: now });
  return freshData;
}
