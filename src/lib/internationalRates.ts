import { unstable_cache } from "next/cache";
import * as cheerio from "cheerio";

type Carat = "24K" | "22K" | "18K";

export type InternationalRate = {
  country: string;
  currencyCode: string;
  price: number | null;
  priceInr: number | null;
  carat: Carat;
  timestamp: string;
};

export type InternationalRates = {
  gold24k: InternationalRate[];
  gold22k: InternationalRate[];
  gold18k: InternationalRate[];
  lastUpdated: string;
  source: string;
};

const GOODRETURNS_URL = "https://www.goodreturns.in/gold-rates/";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const toNumber = (value: string): number | null => {
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return null;

  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseInternationalTable = (
  $: cheerio.CheerioAPI,
  tableId: string,
  carat: Carat,
  timestamp: string,
): InternationalRate[] => {
  const table = $(`#${tableId}`).next("table");
  if (!table.length) return [];

  const rows: InternationalRate[] = [];

  table.find("tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 3) return;

    const country = $(cells[0]).text().trim();
    if (!country) return;

    const priceCell = $(cells[1]);
    const currencyCode = priceCell.find("i").text().trim() || "";
    const rawPrice = priceCell.text().replace(currencyCode, "").trim();
    const price = toNumber(rawPrice);

    const priceInr = toNumber($(cells[2]).text());

    rows.push({
      country,
      currencyCode,
      price,
      priceInr,
      carat,
      timestamp,
    });
  });

  return rows;
};

export async function scrapeInternationalRates(): Promise<InternationalRates> {
  const response = await fetch(GOODRETURNS_URL, {
    headers: {
      "User-Agent": USER_AGENT,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch international rates (HTTP ${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const timestamp = new Date().toISOString();

  return {
    gold24k: parseInternationalTable($, "24k_major_countries", "24K", timestamp),
    gold22k: parseInternationalTable($, "22k_major_countries", "22K", timestamp),
    gold18k: parseInternationalTable($, "18k_major_countries", "18K", timestamp),
    lastUpdated: timestamp,
    source: "GoodReturns",
  };
}

export const getInternationalRates = unstable_cache(
  scrapeInternationalRates,
  ["international-gold-rates-v1"],
  {
    revalidate: 21600, // 6h safety net; busted on demand via 'international-gold-rates' tag.
    tags: ["international-gold-rates"],
  },
);

