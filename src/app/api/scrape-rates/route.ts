import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

type GoldRate = {
  gold22k: number | null;
  gold24k: number | null;
  error?: string;
  timestamp: string;
};

type CityRates = {
  [city: string]: GoldRate;
};

type ScrapedRates = {
  india: GoldRate;
  cities: CityRates;
};

// List of cities to scrape from GoodReturns
const CITIES = [
  { name: "Chennai", slug: "chennai" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Bangalore", slug: "bangalore" },
  { name: "Delhi", slug: "delhi" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Coimbatore", slug: "coimbatore" },
  { name: "Pune", slug: "pune" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Vijayawada", slug: "vijayawada" },
];

// Simple in-memory cache (30 minutes TTL)
let cachedData: { data: ScrapedRates; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Helper function to extract numbers from text
function extractPrice(text: string): number | null {
  const cleaned = text.replace(/[₹,\s]/g, "");
  const match = cleaned.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

// Scrape GoodReturns India-wide rate
async function scrapeGoodReturnsIndia(): Promise<GoldRate> {
  try {
    const url = "https://www.goodreturns.in/gold-rates/";
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let gold22k: number | null = null;
    let gold24k: number | null = null;

    // Strategy 1: Look for table with "Today 24 Carat Gold Rate Per Gram in India" and "10" gram row
    $("table").each((_, table) => {
      const tableContext = $(table).prevAll().first().text();
      
      // Check for 24K table
      if (tableContext.includes("24") && tableContext.includes("Carat") && tableContext.includes("India")) {
        $(table).find("tr").each((_, row) => {
          const cells = $(row).find("td");
          if (cells.length >= 2) {
            const gramCell = $(cells[0]).text().trim();
            if (gramCell === "10") {
              const priceText = $(cells[1]).text();
              const price = extractPrice(priceText);
              if (price) {
                gold24k = price;
              }
            }
          }
        });
      }
      
      // Check for 22K table
      if (tableContext.includes("22") && tableContext.includes("Carat") && tableContext.includes("India")) {
        $(table).find("tr").each((_, row) => {
          const cells = $(row).find("td");
          if (cells.length >= 2) {
            const gramCell = $(cells[0]).text().trim();
            if (gramCell === "10") {
              const priceText = $(cells[1]).text();
              const price = extractPrice(priceText);
              if (price) {
                gold22k = price;
              }
            }
          }
        });
      }
    });

    // Strategy 2: Look for the card display format (24K Gold /g, 22K Gold /g)
    if (!gold24k || !gold22k) {
      $("div, section").each((_, elem) => {
        const text = $(elem).text();
        
        // Look for "24K Gold" with per gram price
        if (text.includes("24K Gold") && text.includes("/g") && text.length < 150) {
          const priceMatch = text.match(/₹\s*(\d{1,2}),(\d{3})/);
          if (priceMatch && !gold24k) {
            const perGram = parseInt(priceMatch[1] + priceMatch[2], 10);
            if (perGram) {
              gold24k = perGram * 10; // Convert to per 10g
            }
          }
        }
        
        // Look for "22K Gold" with per gram price
        if (text.includes("22K Gold") && text.includes("/g") && text.length < 150) {
          const priceMatch = text.match(/₹\s*(\d{1,2}),(\d{3})/);
          if (priceMatch && !gold22k) {
            const perGram = parseInt(priceMatch[1] + priceMatch[2], 10);
            if (perGram) {
              gold22k = perGram * 10; // Convert to per 10g
            }
          }
        }
      });
    }

    // Strategy 3: Look in raw HTML for table data
    if (!gold24k || !gold22k) {
      const bodyHtml = $("body").html() || "";
      
      // Match pattern for 24K table with 10 gram row
      const match24k = bodyHtml.match(/24.*Carat.*India[\s\S]{0,500}<td>10<\/td>\s*<td>₹(\d{1,2}),(\d{3})/i);
      if (match24k && !gold24k) {
        const price = parseInt(match24k[1] + match24k[2], 10);
        if (price) {
          gold24k = price;
        }
      }
      
      // Match pattern for 22K table with 10 gram row
      const match22k = bodyHtml.match(/22.*Carat.*India[\s\S]{0,500}<td>10<\/td>\s*<td>₹(\d{1,2}),(\d{3})/i);
      if (match22k && !gold22k) {
        const price = parseInt(match22k[1] + match22k[2], 10);
        if (price) {
          gold22k = price;
        }
      }
    }

    return {
      gold22k,
      gold24k,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      gold22k: null,
      gold24k: null,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

// Scrape GoodReturns for a specific city
async function scrapeGoodReturnsCity(citySlug: string): Promise<GoldRate> {
  try {
    const url = `https://www.goodreturns.in/gold-rates/${citySlug}.html`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let gold22k: number | null = null; // Will be per 10g
    let gold24k: number | null = null; // Will be per 10g

    // Strategy 1: Find the main rate cards/boxes at the top of the page
    const elements = $("div, section, article").toArray();
    
    for (const elem of elements) {
      const $elem = $(elem);
      const text = $elem.text();
      
      // Look for element that contains ONLY 24K gold info (not 22K in same element)
      if (text.includes("24K Gold") && !text.includes("22K Gold") && 
          !text.includes("18K Gold") && text.length < 200) {
        // Extract price from this 24K-only element
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
      
      // Look for element that contains ONLY 22K gold info (not 24K in same element)
      if (text.includes("22K Gold") && !text.includes("24K Gold") && 
          !text.includes("18K Gold") && text.length < 200) {
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

    // Strategy 2: Look in tables for 1 gram prices
    $("table").each((_, table) => {
      const $table = $(table);
      const prevHeading = $table.prevAll("h1, h2, h3, h4, h5, div, p").first().text();
      
      // Check if this table is for 24K
      if (prevHeading.includes("24") && prevHeading.includes("Carat")) {
        const firstRow = $table.find("tr").eq(1); // Skip header, get first data row
        const cells = firstRow.find("td");
        if (cells.length >= 2) {
          const gramCell = $(cells[0]).text().trim();
          if (gramCell === "1" || gramCell === "1 gram") {
            const price = extractPrice($(cells[1]).text());
            if (price && !gold24k) {
              gold24k = price * 10;
            }
          }
        }
      }
      
      // Check if this table is for 22K
      if (prevHeading.includes("22") && prevHeading.includes("Carat")) {
        const firstRow = $table.find("tr").eq(1);
        const cells = firstRow.find("td");
        if (cells.length >= 2) {
          const gramCell = $(cells[0]).text().trim();
          if (gramCell === "1" || gramCell === "1 gram") {
            const price = extractPrice($(cells[1]).text());
            if (price && !gold22k) {
              gold22k = price * 10;
            }
          }
        }
      }
    });

    // Strategy 3: Look for specific HTML patterns in raw HTML
    if (!gold24k || !gold22k) {
      const bodyText = $("body").html() || "";
      
      // Find 24K price
      const match24k = bodyText.match(/24K\s+Gold[^₹]{0,50}₹\s*(\d{1,2}),?(\d{3})/i);
      if (match24k && !gold24k) {
        const price = parseInt(match24k[1] + match24k[2], 10);
        if (price) {
          gold24k = price * 10;
        }
      }
      
      // Find 22K price
      const match22k = bodyText.match(/22K\s+Gold[^₹]{0,50}₹\s*(\d{1,2}),?(\d{3})/i);
      if (match22k && !gold22k) {
        const price = parseInt(match22k[1] + match22k[2], 10);
        if (price) {
          gold22k = price * 10;
        }
      }
    }

    return {
      gold22k,
      gold24k,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      gold22k: null,
      gold24k: null,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function GET() {
  try {
    console.log("🔍 [Scrape-Rates] API called");
    
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
      const age = Math.floor((now - cachedData.timestamp) / 1000);
      console.log(`✨ [Scrape-Rates] Returning cached data (${age}s old)`);
      return NextResponse.json({
        success: true,
        data: cachedData.data,
        timestamp: new Date(cachedData.timestamp).toISOString(),
        cached: true,
        cacheAge: age,
      });
    }

    console.log("🌐 [Scrape-Rates] Cache miss or expired, scraping fresh data...");
    
    // Scrape India rate and all cities in parallel
    const indiaPromise = scrapeGoodReturnsIndia();
    const cityPromises = CITIES.map(async (city) => {
      const rates = await scrapeGoodReturnsCity(city.slug);
      return { name: city.name, rates };
    });

    const [india, ...cityResults] = await Promise.all([
      indiaPromise,
      ...cityPromises,
    ]);

    // Convert array to object with city names as keys
    const cities: CityRates = {};
    cityResults.forEach(({ name, rates }) => {
      cities[name] = rates;
    });

    const results: ScrapedRates = {
      india,
      cities,
    };

    // Update cache
    cachedData = {
      data: results,
      timestamp: now,
    };

    console.log("✅ [Scrape-Rates] Fresh data scraped and cached");
    console.log(`📊 [Scrape-Rates] India rates: 22K=₹${india.gold22k}, 24K=₹${india.gold24k}`);

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error("❌ [Scrape-Rates] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
