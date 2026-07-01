/**
 * Gold Rate Scraper - Standalone Script for GitHub Actions
 * 
 * This script scrapes gold rates from GoodReturns and saves them to MongoDB.
 * It runs independently of Next.js/Vercel and can be executed in GitHub Actions.
 * 
 * Usage: npx tsx scrape-gold-rates.ts
 * Required env: MONGODB_URI
 */

import * as cheerio from 'cheerio';
import { appendFileSync } from 'fs';
import { getDatabase, closeConnection } from './lib/mongodb.js';

/**
 * Expose whether rates changed so the GitHub Action can conditionally revalidate
 * the site cache. Writes `changed=<bool>` to $GITHUB_OUTPUT (used by later steps)
 * and prints a stable marker line for logs.
 */
function emitRatesChanged(changed: boolean): void {
  const value = changed ? 'true' : 'false';
  console.log(`::rates-changed::${value}`);
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    try {
      appendFileSync(outputFile, `changed=${value}\n`);
    } catch (e) {
      console.warn('⚠️  [Scraper] Could not write GITHUB_OUTPUT:', e);
    }
  }
}

// ============================================================================
// TYPES
// ============================================================================

type GoldRate = {
  gold22k: number | null;
  gold24k: number | null;
  gold18k: number | null;
  silver1kg: number | null;
  error?: string;
  timestamp: string;
};

type CityRates = {
  [city: string]: GoldRate;
};

type Carat = '24K' | '22K' | '18K';

type InternationalRate = {
  country: string;
  currencyCode: string;
  price: number | null;
  priceInr: number | null;
  carat: Carat;
  timestamp: string;
};

type InternationalRates = {
  gold24k: InternationalRate[];
  gold22k: InternationalRate[];
  gold18k: InternationalRate[];
  lastUpdated: string;
  source: string;
};

type GoldRateDocument = {
  date: Date;
  city: string;
  gold_22k: number;
  gold_24k: number;
  gold_18k: number;
  silver_1kg?: number;
  source: string;
  created_at: Date;
  updated_at: Date;
};

// ============================================================================
// CONFIGURATION
// ============================================================================

const CITIES = [
  { name: 'Ahmedabad', slug: 'ahmedabad' },
  { name: 'Ayodhya', slug: 'ayodhya' },
  { name: 'Bangalore', slug: 'bangalore' },
  { name: 'Bhubaneswar', slug: 'bhubaneswar' },
  { name: 'Chandigarh', slug: 'chandigarh' },
  { name: 'Chennai', slug: 'chennai' },
  { name: 'Coimbatore', slug: 'coimbatore' },
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Hyderabad', slug: 'hyderabad' },
  { name: 'Jaipur', slug: 'jaipur' },
  { name: 'Kerala', slug: 'kerala' },
  { name: 'Kolkata', slug: 'kolkata' },
  { name: 'Lucknow', slug: 'lucknow' },
  { name: 'Madurai', slug: 'madurai' },
  { name: 'Mangalore', slug: 'mangalore' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Mysore', slug: 'mysore' },
  { name: 'Nagpur', slug: 'nagpur' },
  { name: 'Nashik', slug: 'nashik' },
  { name: 'Patna', slug: 'patna' },
  { name: 'Pune', slug: 'pune' },
  { name: 'Rajkot', slug: 'rajkot' },
  { name: 'Salem', slug: 'salem' },
  { name: 'Surat', slug: 'surat' },
  { name: 'Trichy', slug: 'trichy' },
  { name: 'Vadodara', slug: 'vadodara' },
  { name: 'Vijayawada', slug: 'vijayawada' },
  { name: 'Visakhapatnam', slug: 'visakhapatnam' },
];

// Fallback cities: Use nearby city's rates when GoodReturns doesn't have data
const CITY_FALLBACKS: Record<string, string> = {
  'Moodbidri': 'Mangalore',
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractPrice(text: string): number | null {
  const cleaned = text.replace(/[₹,\s]/g, '');
  const match = cleaned.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function toNumber(value: string): number | null {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (!cleaned) return null;
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
}

function isSuspiciousDifference(existingRate: number, newRate: number): boolean {
  const diff = Math.abs(existingRate - newRate);
  return diff === 10;
}

/**
 * Parse the combined "Gram | 24K | 22K | 18K" table that GoodReturns now uses
 * on both the India page and per-city pages. Returns per-10g prices (the row where
 * the first column is "10"), matching what the rest of the codebase expects.
 */
function parseCombinedGoodReturnsTable($: cheerio.CheerioAPI): {
  gold24k: number | null;
  gold22k: number | null;
  gold18k: number | null;
} {
  let gold24k: number | null = null;
  let gold22k: number | null = null;
  let gold18k: number | null = null;

  $('table').each((_, table) => {
    if (gold24k && gold22k && gold18k) return;

    const $table = $(table);
    const rows = $table.find('tr');
    if (rows.length < 2) return;

    const headerCells = $(rows[0])
      .find('th, td')
      .map((_, c) => $(c).text().trim().toLowerCase())
      .get();

    if (headerCells.length < 3) return;

    const gramIdx = headerCells.findIndex((h) => h === 'gram' || h.startsWith('gram'));
    const idx24k = headerCells.findIndex((h) => h.replace(/\s+/g, '').includes('24k'));
    const idx22k = headerCells.findIndex((h) => h.replace(/\s+/g, '').includes('22k'));
    const idx18k = headerCells.findIndex((h) => h.replace(/\s+/g, '').includes('18k'));

    if (gramIdx === -1 || idx24k === -1 || idx22k === -1) return;

    rows.each((_, row) => {
      const cells = $(row).find('td');
      const minCells = Math.max(gramIdx, idx24k, idx22k, idx18k) + 1;
      if (cells.length < minCells) return;

      const gramText = $(cells[gramIdx]).text().trim();
      if (gramText !== '10') return;

      const p24 = extractPrice($(cells[idx24k]).text());
      const p22 = extractPrice($(cells[idx22k]).text());
      const p18 = idx18k !== -1 ? extractPrice($(cells[idx18k]).text()) : null;

      if (p24 && !gold24k) gold24k = p24;
      if (p22 && !gold22k) gold22k = p22;
      if (p18 && !gold18k) gold18k = p18;
    });
  });

  return { gold24k, gold22k, gold18k };
}

// ============================================================================
// SILVER SCRAPING
// ============================================================================

async function scrapeSilverRate(citySlug?: string): Promise<number | null> {
  try {
    const url = citySlug
      ? `https://www.goodreturns.in/silver-rates/${citySlug}.html`
      : 'https://www.goodreturns.in/silver-rates/';

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);
    let silver1kg: number | null = null;

    $('table').each((_, table) => {
      $(table).find('tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const weight = $(cells[0]).text().trim().toLowerCase();
          if (weight === '1 kg' || weight === '1000 grams' || weight === '1000') {
            const price = extractPrice($(cells[1]).text());
            if (price) silver1kg = price;
          }
        }
      });
    });

    if (!silver1kg) {
      const bodyText = $('body').text();
      const match = bodyText.match(/1\s*kg\s*Silver\s*Rate.*?₹\s*(\d{1,3}(?:,\d{3})*)/i);
      if (match && match[1]) {
        silver1kg = extractPrice(match[1]);
      }
    }

    return silver1kg;
  } catch (e) {
    console.error(`Error scraping silver for ${citySlug || 'India'}:`, e);
    return null;
  }
}

// ============================================================================
// GOLD SCRAPING - INDIA
// ============================================================================

async function scrapeGoodReturnsIndia(): Promise<GoldRate> {
  try {
    const [goldResponse, silverPrice] = await Promise.all([
      fetch('https://www.goodreturns.in/gold-rates/', {
        headers: { 'User-Agent': USER_AGENT },
      }),
      scrapeSilverRate(),
    ]);

    if (!goldResponse.ok) {
      throw new Error(`HTTP ${goldResponse.status}`);
    }

    const html = await goldResponse.text();
    const $ = cheerio.load(html);

    let silver1kg: number | null = silverPrice;

    // Primary strategy: GoodReturns now uses one combined "Gram | 24K | 22K | 18K" table.
    const combined = parseCombinedGoodReturnsTable($);
    let gold24k: number | null = combined.gold24k;
    let gold22k: number | null = combined.gold22k;
    let gold18k: number | null = combined.gold18k;

    // Legacy strategy 1 (per-carat tables prefixed by "Carat" + "India" text). Kept as a
    // safety net in case GoodReturns reverts the layout for some pages.
    $('table').each((_, table) => {
      const tableContext = $(table).prevAll().first().text();

      if (tableContext.includes('24') && tableContext.includes('Carat') && tableContext.includes('India')) {
        $(table).find('tr').each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const gramCell = $(cells[0]).text().trim();
            if (gramCell === '10') {
              const price = extractPrice($(cells[1]).text());
              if (price && !gold24k) gold24k = price;
            }
          }
        });
      }

      if (tableContext.includes('22') && tableContext.includes('Carat') && tableContext.includes('India')) {
        $(table).find('tr').each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const gramCell = $(cells[0]).text().trim();
            if (gramCell === '10') {
              const price = extractPrice($(cells[1]).text());
              if (price && !gold22k) gold22k = price;
            }
          }
        });
      }
    });

    // Strategy 2: Look for card display format
    if (!gold24k || !gold22k) {
      $('div, section').each((_, elem) => {
        const text = $(elem).text();

        if (text.includes('24K Gold') && text.includes('/g') && text.length < 150) {
          const priceMatch = text.match(/₹\s*(\d{1,2}),(\d{3})/);
          if (priceMatch && !gold24k) {
            const perGram = parseInt(priceMatch[1] + priceMatch[2], 10);
            if (perGram) gold24k = perGram * 10;
          }
        }

        if (text.includes('22K Gold') && text.includes('/g') && text.length < 150) {
          const priceMatch = text.match(/₹\s*(\d{1,2}),(\d{3})/);
          if (priceMatch && !gold22k) {
            const perGram = parseInt(priceMatch[1] + priceMatch[2], 10);
            if (perGram) gold22k = perGram * 10;
          }
        }
      });
    }

    // Strategy 3: Look in raw HTML
    if (!gold24k || !gold22k) {
      const bodyHtml = $('body').html() || '';

      const match24k = bodyHtml.match(/24.*Carat.*India[\s\S]{0,500}<td>10<\/td>\s*<td>₹(\d{1,2}),(\d{3})/i);
      if (match24k && !gold24k) {
        gold24k = parseInt(match24k[1] + match24k[2], 10);
      }

      const match22k = bodyHtml.match(/22.*Carat.*India[\s\S]{0,500}<td>10<\/td>\s*<td>₹(\d{1,2}),(\d{3})/i);
      if (match22k && !gold22k) {
        gold22k = parseInt(match22k[1] + match22k[2], 10);
      }
    }

    if (!gold18k && gold24k) {
      gold18k = Math.round((gold24k * 18) / 24);
    }

    return {
      gold22k,
      gold24k,
      gold18k,
      silver1kg,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      gold22k: null,
      gold24k: null,
      gold18k: null,
      silver1kg: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// GOLD SCRAPING - CITY
// ============================================================================

async function scrapeGoodReturnsCity(citySlug: string): Promise<GoldRate> {
  try {
    const [goldResponse, silverPrice] = await Promise.all([
      fetch(`https://www.goodreturns.in/gold-rates/${citySlug}.html`, {
        headers: { 'User-Agent': USER_AGENT },
      }),
      scrapeSilverRate(citySlug),
    ]);

    if (!goldResponse.ok) {
      throw new Error(`HTTP ${goldResponse.status}`);
    }

    const html = await goldResponse.text();
    const $ = cheerio.load(html);

    let silver1kg: number | null = silverPrice;

    // Primary strategy: same combined "Gram | 24K | 22K | 18K" table that's now on city pages too.
    const combined = parseCombinedGoodReturnsTable($);
    let gold24k: number | null = combined.gold24k;
    let gold22k: number | null = combined.gold22k;
    let gold18k: number | null = combined.gold18k;

    // Legacy strategy: card-style "24K Gold" elements with per-gram prices, kept as fallback.
    const elements = $('div, section, article').toArray();

    for (const elem of elements) {
      const $elem = $(elem);
      const text = $elem.text();

      if (text.includes('24K Gold') && !text.includes('22K Gold') && !text.includes('18K Gold') && text.length < 200) {
        const matches = text.match(/₹\s*(\d{1,2}),?(\d{3})/g);
        if (matches) {
          for (const match of matches) {
            const priceMatch = match.match(/₹\s*(\d{1,2}),?(\d{3})/);
            if (priceMatch) {
              const price = parseInt(priceMatch[1] + priceMatch[2], 10);
              if (price && !gold24k) {
                gold24k = price * 10;
                break;
              }
            }
          }
        }
      }

      if (text.includes('22K Gold') && !text.includes('24K Gold') && !text.includes('18K Gold') && text.length < 200) {
        const matches = text.match(/₹\s*(\d{1,2}),?(\d{3})/g);
        if (matches) {
          for (const match of matches) {
            const priceMatch = match.match(/₹\s*(\d{1,2}),?(\d{3})/);
            if (priceMatch) {
              const price = parseInt(priceMatch[1] + priceMatch[2], 10);
              if (price && !gold22k) {
                gold22k = price * 10;
                break;
              }
            }
          }
        }
      }
    }

    // Strategy 2: Look in tables
    $('table').each((_, table) => {
      const $table = $(table);
      const prevHeading = $table.prevAll('h1, h2, h3, h4, h5, div, p').first().text();

      if (prevHeading.includes('24') && prevHeading.includes('Carat')) {
        const firstRow = $table.find('tr').eq(1);
        const cells = firstRow.find('td');
        if (cells.length >= 2) {
          const gramCell = $(cells[0]).text().trim();
          if (gramCell === '1' || gramCell === '1 gram') {
            const price = extractPrice($(cells[1]).text());
            if (price && !gold24k) {
              gold24k = price * 10;
            }
          }
        }
      }

      if (prevHeading.includes('22') && prevHeading.includes('Carat')) {
        const firstRow = $table.find('tr').eq(1);
        const cells = firstRow.find('td');
        if (cells.length >= 2) {
          const gramCell = $(cells[0]).text().trim();
          if (gramCell === '1' || gramCell === '1 gram') {
            const price = extractPrice($(cells[1]).text());
            if (price && !gold22k) {
              gold22k = price * 10;
            }
          }
        }
      }
    });

    // Strategy 3: Raw HTML patterns
    if (!gold24k || !gold22k) {
      const bodyText = $('body').html() || '';

      const match24k = bodyText.match(/24K\s+Gold[^₹]{0,50}₹\s*(\d{1,2}),?(\d{3})/i);
      if (match24k && !gold24k) {
        gold24k = parseInt(match24k[1] + match24k[2], 10) * 10;
      }

      const match22k = bodyText.match(/22K\s+Gold[^₹]{0,50}₹\s*(\d{1,2}),?(\d{3})/i);
      if (match22k && !gold22k) {
        gold22k = parseInt(match22k[1] + match22k[2], 10) * 10;
      }
    }

    if (!gold18k && gold24k) {
      gold18k = Math.round((gold24k * 18) / 24);
    }

    return {
      gold22k,
      gold24k,
      gold18k,
      silver1kg,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      gold22k: null,
      gold24k: null,
      gold18k: null,
      silver1kg: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// INTERNATIONAL RATES SCRAPING
// ============================================================================

function parseInternationalTable(
  $: cheerio.CheerioAPI,
  tableId: string,
  carat: Carat,
  timestamp: string
): InternationalRate[] {
  const table = $(`#${tableId}`).next('table');
  if (!table.length) return [];

  const rows: InternationalRate[] = [];

  table.find('tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 3) return;

    const country = $(cells[0]).text().trim();
    if (!country) return;

    const priceCell = $(cells[1]);
    const currencyCode = priceCell.find('i').text().trim() || '';
    const rawPrice = priceCell.text().replace(currencyCode, '').trim();
    const price = toNumber(rawPrice);
    const priceInr = toNumber($(cells[2]).text());

    rows.push({ country, currencyCode, price, priceInr, carat, timestamp });
  });

  return rows;
}

async function scrapeInternationalRates(): Promise<InternationalRates | null> {
  try {
    const response = await fetch('https://www.goodreturns.in/gold-rates/', {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch international rates (HTTP ${response.status})`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const timestamp = new Date().toISOString();

    return {
      gold24k: parseInternationalTable($, '24k_major_countries', '24K', timestamp),
      gold22k: parseInternationalTable($, '22k_major_countries', '22K', timestamp),
      gold18k: parseInternationalTable($, '18k_major_countries', '18K', timestamp),
      lastUpdated: timestamp,
      source: 'GoodReturns',
    };
  } catch (error) {
    console.error('❌ Failed to scrape international rates:', error);
    return null;
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function saveGoldRates(
  indiaRates: GoldRate,
  cityRates: CityRates
): Promise<{ success: boolean; saved: number; errors: number; skipped: number; changed: number }> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>('gold_prices');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();
    let saved = 0;
    let errors = 0;
    let skipped = 0;
    // Counts rows whose values actually differ from what's already stored. Only
    // used to decide whether the site cache needs to be revalidated.
    let changed = 0;

    const hasSilverValue = (value: number | null | undefined) => value !== null && value !== undefined;

    const ratesDiffer = (existing: GoldRateDocument, next: GoldRate) =>
      existing.gold_22k !== next.gold22k ||
      existing.gold_24k !== next.gold24k ||
      (next.gold18k != null && existing.gold_18k !== next.gold18k) ||
      (hasSilverValue(next.silver1kg) && existing.silver_1kg !== next.silver1kg);

    // Save India rate
    if (indiaRates.gold22k && indiaRates.gold24k) {
      try {
        const existingIndia = await collection.findOne({ city: 'India', date: today });

        if (existingIndia) {
          const is22kSuspicious = isSuspiciousDifference(existingIndia.gold_22k, indiaRates.gold22k);
          const is24kSuspicious = isSuspiciousDifference(existingIndia.gold_24k, indiaRates.gold24k);

          if (is22kSuspicious || is24kSuspicious) {
            console.log(`⏭️ [DB] Skipping India update - suspicious ₹10/10g difference`);
            skipped++;
          } else {
            const didChange = ratesDiffer(existingIndia, indiaRates);
            await collection.updateOne(
              { city: 'India', date: today },
              {
                $set: {
                  gold_22k: indiaRates.gold22k,
                  gold_24k: indiaRates.gold24k,
                  gold_18k: indiaRates.gold18k || Math.round((indiaRates.gold24k * 18) / 24),
                  ...(hasSilverValue(indiaRates.silver1kg) ? { silver_1kg: indiaRates.silver1kg } : {}),
                  source: 'GoodReturns',
                  updated_at: now,
                },
              }
            );
            saved++;
            if (didChange) changed++;
            console.log(`✅ [DB] Updated India rates: 22K=₹${indiaRates.gold22k}, 24K=₹${indiaRates.gold24k}`);
          }
        } else {
          await collection.insertOne({
            date: today,
            city: 'India',
            gold_22k: indiaRates.gold22k,
            gold_24k: indiaRates.gold24k,
            gold_18k: indiaRates.gold18k || Math.round((indiaRates.gold24k * 18) / 24),
            ...(hasSilverValue(indiaRates.silver1kg) ? { silver_1kg: indiaRates.silver1kg } : {}),
            source: 'GoodReturns',
            created_at: now,
            updated_at: now,
          } as GoldRateDocument);
          saved++;
          changed++;
          console.log(`✅ [DB] Saved India rates: 22K=₹${indiaRates.gold22k}, 24K=₹${indiaRates.gold24k}`);
        }
      } catch (error) {
        console.error('❌ [DB] Error saving India rates:', error);
        errors++;
      }
    }

    // Save city rates
    for (const [cityName, rates] of Object.entries(cityRates)) {
      if (rates.gold22k && rates.gold24k) {
        try {
          const existingCity = await collection.findOne({ city: cityName, date: today });

          if (existingCity) {
            const is22kSuspicious = isSuspiciousDifference(existingCity.gold_22k, rates.gold22k);
            const is24kSuspicious = isSuspiciousDifference(existingCity.gold_24k, rates.gold24k);

            if (is22kSuspicious || is24kSuspicious) {
              console.log(`⏭️ [DB] Skipping ${cityName} update - suspicious ₹10/10g difference`);
              skipped++;
            } else {
              const didChange = ratesDiffer(existingCity, rates);
              await collection.updateOne(
                { city: cityName, date: today },
                {
                  $set: {
                    gold_22k: rates.gold22k,
                    gold_24k: rates.gold24k,
                    gold_18k: rates.gold18k || Math.round((rates.gold24k * 18) / 24),
                    ...(hasSilverValue(rates.silver1kg) ? { silver_1kg: rates.silver1kg } : {}),
                    source: 'GoodReturns',
                    updated_at: now,
                  },
                }
              );
              saved++;
              if (didChange) changed++;
            }
          } else {
            await collection.insertOne({
              date: today,
              city: cityName,
              gold_22k: rates.gold22k,
              gold_24k: rates.gold24k,
              gold_18k: rates.gold18k || Math.round((rates.gold24k * 18) / 24),
              ...(hasSilverValue(rates.silver1kg) ? { silver_1kg: rates.silver1kg } : {}),
              source: 'GoodReturns',
              created_at: now,
              updated_at: now,
            } as GoldRateDocument);
            saved++;
            changed++;
          }
        } catch (error) {
          console.error(`❌ [DB] Error saving ${cityName} rates:`, error);
          errors++;
        }
      }
    }

    console.log(`📊 [DB] Summary: ${saved} saved, ${changed} changed, ${skipped} skipped, ${errors} errors`);
    return { success: true, saved, errors, skipped, changed };
  } catch (error) {
    console.error('❌ [DB] Database error:', error);
    return { success: false, saved: 0, errors: 1, skipped: 0, changed: 0 };
  }
}

async function saveInternationalRates(data: InternationalRates | null): Promise<{ success: boolean; saved: number; errors: number }> {
  if (!data) return { success: false, saved: 0, errors: 1 };

  try {
    const db = await getDatabase();
    const collection = db.collection('international_gold_prices');

    // Ensure unique index exists
    try {
      await collection.createIndex(
        { country: 1, carat: 1, date: 1 },
        { unique: true, name: 'country_carat_date_unique' }
      );
    } catch {
      // Index already exists, ignore
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    let saved = 0;
    let errors = 0;

    const upsertMany = async (carat: Carat, rows: InternationalRate[]) => {
      for (const row of rows) {
        try {
          await collection.updateOne(
            { country: row.country, carat, date: today },
            {
              $set: {
                currency_code: row.currencyCode,
                price: row.price,
                price_inr: row.priceInr,
                source: data.source,
                scrape_timestamp: row.timestamp,
                updated_at: now,
              },
              $setOnInsert: {
                date: today,
                created_at: now,
              },
            },
            { upsert: true }
          );
          saved++;
        } catch (error) {
          console.error(`❌ [DB] Error saving international rate for ${row.country} (${carat}):`, error);
          errors++;
        }
      }
    };

    await upsertMany('24K', data.gold24k);
    await upsertMany('22K', data.gold22k);
    await upsertMany('18K', data.gold18k);

    console.log(`🌍 [DB] International rates saved: ${saved} entries, ${errors} errors`);
    return { success: true, saved, errors };
  } catch (error) {
    console.error('❌ [DB] Error saving international rates:', error);
    return { success: false, saved: 0, errors: 1 };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 [Scraper] Starting gold rate scraping...');
  console.log(`📅 [Scraper] Timestamp: ${new Date().toISOString()}`);

  try {
    // Scrape India rate and all cities in parallel
    console.log('🌐 [Scraper] Scraping GoodReturns...');

    const indiaPromise = scrapeGoodReturnsIndia();
    const internationalPromise = scrapeInternationalRates();
    const cityPromises = CITIES.map(async (city) => {
      const rates = await scrapeGoodReturnsCity(city.slug);
      return { name: city.name, rates };
    });

    const [india, international, ...cityResults] = await Promise.all([
      indiaPromise,
      internationalPromise,
      ...cityPromises,
    ]);

    // Convert array to object with city names as keys
    const cities: CityRates = {};
    cityResults.forEach(({ name, rates }) => {
      cities[name] = rates;
    });

    // Apply fallbacks for cities without direct GoodReturns data
    for (const [city, fallbackCity] of Object.entries(CITY_FALLBACKS)) {
      if (cities[fallbackCity]) {
        cities[city] = { ...cities[fallbackCity] };
        console.log(`📍 [Scraper] Using ${fallbackCity} rates for ${city} (nearby city fallback)`);
      }
    }

    console.log(`✅ [Scraper] Scraped India and ${Object.keys(cities).length} cities`);
    console.log(`📊 [Scraper] India: 22K=₹${india.gold22k}, 24K=₹${india.gold24k}, Silver=₹${india.silver1kg}`);

    if (international) {
      const totalCountries = international.gold24k.length + international.gold22k.length + international.gold18k.length;
      console.log(`🌍 [Scraper] International: ${totalCountries} country rates`);
    }

    // Save to MongoDB
    console.log('💾 [Scraper] Saving to MongoDB...');

    const saveResult = await saveGoldRates(india, cities);

    if (international) {
      await saveInternationalRates(international);
    }

    console.log('✅ [Scraper] Scraping completed successfully');
    console.log(`📊 [Scraper] Final: ${saveResult.saved} saved, ${saveResult.changed} changed, ${saveResult.skipped} skipped, ${saveResult.errors} errors`);

    // Signal to the GitHub Action whether a cache revalidation is warranted.
    // The revalidate step should be gated on this so we don't regenerate ~250
    // ISR pages when the scraped rates are identical to what's already stored.
    emitRatesChanged(saveResult.changed > 0);
    if (saveResult.changed === 0) {
      console.log('⏭️  [Scraper] No rate changes — revalidation should be skipped');
    }

    // Close MongoDB connection
    await closeConnection();

    // Exit with appropriate code
    if (saveResult.errors > 0 && saveResult.saved === 0) {
      console.error('❌ [Scraper] All saves failed');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ [Scraper] Fatal error:', error);
    await closeConnection();
    process.exit(1);
  }
}

// Run the script
main();
