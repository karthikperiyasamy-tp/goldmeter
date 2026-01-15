import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getInternationalRates, type InternationalRates } from "@/lib/internationalRates";

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

type ScrapedRates = {
  india: GoldRate;
  cities: CityRates;
  international?: InternationalRates | null;
};

// List of cities to scrape from GoodReturns
const CITIES = [
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Ayodhya", slug: "ayodhya" },
  { name: "Bangalore", slug: "bangalore" },
  { name: "Bhubaneswar", slug: "bhubaneswar" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Chennai", slug: "chennai" },
  { name: "Coimbatore", slug: "coimbatore" },
  { name: "Delhi", slug: "delhi" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Jaipur", slug: "jaipur" },
  { name: "Kerala", slug: "kerala" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Lucknow", slug: "lucknow" },
  { name: "Madurai", slug: "madurai" },
  { name: "Mangalore", slug: "mangalore" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Mysore", slug: "mysore" },
  { name: "Nagpur", slug: "nagpur" },
  { name: "Nashik", slug: "nashik" },
  { name: "Patna", slug: "patna" },
  { name: "Pune", slug: "pune" },
  { name: "Rajkot", slug: "rajkot" },
  { name: "Salem", slug: "salem" },
  { name: "Surat", slug: "surat" },
  { name: "Trichy", slug: "trichy" },
  { name: "Vadodara", slug: "vadodara" },
  { name: "Vijayawada", slug: "vijayawada" },
  { name: "Visakhapatnam", slug: "visakhapatnam" },
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

// Helper function to scrape silver rates specifically
async function scrapeSilverRate(citySlug?: string): Promise<number | null> {
  try {
    const url = citySlug 
      ? `https://www.goodreturns.in/silver-rates/${citySlug}.html`
      : "https://www.goodreturns.in/silver-rates/";
      
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);
    let silver1kg: number | null = null;

    $("table").each((_, table) => {
      $(table).find("tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length >= 2) {
          const weight = $(cells[0]).text().trim().toLowerCase();
          // Check for 1kg variants
          if (weight === "1 kg" || weight === "1 kg" || weight === "1000 grams" || weight === "1000") {
             const price = extractPrice($(cells[1]).text());
             if (price) silver1kg = price;
          }
        }
      });
    });
    
    // Fallback strategy if table scrape fails: Look for text pattern
    if (!silver1kg) {
      const bodyText = $("body").text();
      // Look for "1 kg" followed by price
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

// Scrape GoodReturns India-wide rate
async function scrapeGoodReturnsIndia(): Promise<GoldRate> {
  try {
    // Fetch gold and silver in parallel
    const [goldResponse, silverPrice] = await Promise.all([
      fetch("https://www.goodreturns.in/gold-rates/", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        cache: "no-store",
      }),
      scrapeSilverRate()
    ]);

    if (!goldResponse.ok) {
      throw new Error(`HTTP ${goldResponse.status}`);
    }

    const html = await goldResponse.text();
    const $ = cheerio.load(html);

    let gold22k: number | null = null;
    let gold24k: number | null = null;
    let gold18k: number | null = null;
    let silver1kg: number | null = silverPrice;

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

      // Check for Silver table (if scrapeSilverRate failed or wasn't called)
      if (!silver1kg && tableContext.includes("Silver") && tableContext.includes("Rate") && tableContext.includes("India")) {
        $(table).find("tr").each((_, row) => {
          const cells = $(row).find("td");
          if (cells.length >= 2) {
            const weightCell = $(cells[0]).text().trim();
            if (weightCell === "1 kg" || weightCell === "1 Kg" || weightCell === "1000 grams") {
              const priceText = $(cells[1]).text();
              const price = extractPrice(priceText);
              if (price) {
                silver1kg = price;
              }
            }
          }
        });
      }
    });

    // Strategy 2: Look for the card display format (24K Gold /g, 22K Gold /g)
    if (!gold24k || !gold22k || !silver1kg) {
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

        // Look for Silver Rate
        if (text.includes("Silver Rate") && text.includes("India") && text.length < 200) {
           const matches = text.match(/₹\s*(\d{1,2}),(\d{3})/);
           if (matches && !silver1kg) {
             // Usually displayed per 1kg or 10g, hard to say without context.
             // But GoodReturns often shows 1kg price prominently.
             // Let's assume if it's > 10000 it's likely 1kg silver (approx 70k-90k)
             // If it's < 1000 it's likely 10g or 1g.
             const price = parseInt(matches[1] + matches[2], 10);
             if (price > 50000) {
               silver1kg = price;
             } else if (price > 50 && price < 200) { // 1g price approx 70-90
               silver1kg = price * 1000;
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

      // Match pattern for Silver table with 1 kg row
      const matchSilver = bodyHtml.match(/Silver.*Rate.*India[\s\S]{0,500}<td>1\s*kg<\/td>\s*<td>₹(\d{1,2}),(\d{3})/i);
      if (matchSilver && !silver1kg) {
        const price = parseInt(matchSilver[1] + matchSilver[2], 10);
        if (price) {
          silver1kg = price;
        }
      }
    }

    // Calculate 18K if not found but 24K is available
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
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

// Scrape GoodReturns for a specific city
async function scrapeGoodReturnsCity(citySlug: string): Promise<GoldRate> {
  try {
    // Fetch gold and silver in parallel
    const [goldResponse, silverPrice] = await Promise.all([
      fetch(`https://www.goodreturns.in/gold-rates/${citySlug}.html`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        cache: "no-store",
      }),
      scrapeSilverRate(citySlug)
    ]);

    if (!goldResponse.ok) {
      throw new Error(`HTTP ${goldResponse.status}`);
    }

    const html = await goldResponse.text();
    const $ = cheerio.load(html);

    let gold22k: number | null = null; // Will be per 10g
    let gold24k: number | null = null; // Will be per 10g
    let gold18k: number | null = null; // Will be per 10g
    let silver1kg: number | null = silverPrice; // Will be per 1kg

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

      // Check for Silver table (if not already found from silver page)
      if (!silver1kg && prevHeading.includes("Silver") && prevHeading.includes("Rate")) {
         const rows = $table.find("tr");
         rows.each((_, row) => {
           const cells = $(row).find("td");
           if (cells.length >= 2) {
             const weightCell = $(cells[0]).text().trim();
             // Usually looking for 1kg
             if (weightCell === "1 kg" || weightCell === "1 Kg" || weightCell === "1000 grams") {
               const price = extractPrice($(cells[1]).text());
               if (price && !silver1kg) {
                 silver1kg = price;
               }
             }
             // Or calculate from 1g/10g if 1kg not found
             if (!silver1kg && (weightCell === "1 gram" || weightCell === "1 g")) {
               const price = extractPrice($(cells[1]).text());
               if (price) {
                 silver1kg = price * 1000;
               }
             }
           }
         });
      }
    });

    // Strategy 3: Look for specific HTML patterns in raw HTML
    if (!gold24k || !gold22k || !silver1kg) {
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

      // Find Silver price (1kg)
      if (!silver1kg) {
        const matchSilver = bodyText.match(/Silver\s+Rate[^₹]{0,100}₹\s*(\d{1,2}),?(\d{3})/i);
        if (matchSilver) {
           // We need to be careful about the unit.
           // Usually prominently displayed silver price is for 1kg.
           // Let's assume > 50k is 1kg.
           const price = parseInt(matchSilver[1] + matchSilver[2], 10);
           if (price > 50000) {
             silver1kg = price;
           }
        }
      }
    }

    // Calculate 18K if not found but 24K is available
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
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Performs the actual scraping work
 * Can be called directly or via HTTP
 */
export async function performScraping(): Promise<ScrapedRates> {
  console.log("🌐 [Scrape] Starting fresh scrape...");
  
  // Scrape India rate and all cities in parallel
  const indiaPromise = scrapeGoodReturnsIndia();
  const internationalPromise = getInternationalRates().catch((error) => {
    console.error("❌ [Scrape] International rates scrape failed:", error);
    return null;
  });
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

  // Fallback cities: Use nearby city's rates when GoodReturns doesn't have data
  // Moodbidri (35 km from Mangalore) uses Mangalore's rates
  const CITY_FALLBACKS: Record<string, string> = {
    "Moodbidri": "Mangalore",
  };

  // Apply fallbacks for cities without direct GoodReturns data
  for (const [city, fallbackCity] of Object.entries(CITY_FALLBACKS)) {
    if (cities[fallbackCity]) {
      cities[city] = { ...cities[fallbackCity] };
      console.log(`📍 [Scrape] Using ${fallbackCity} rates for ${city} (nearby city fallback)`);
    }
  }

  const results: ScrapedRates = {
    india,
    cities,
    international,
  };

  console.log("✅ [Scrape] Fresh data scraped");
  console.log(`📊 [Scrape] India rates: 22K=₹${india.gold22k}, 24K=₹${india.gold24k}, 18K=₹${india.gold18k}, Silver=₹${india.silver1kg}`);
  if (international) {
    const totalCountries =
      international.gold24k.length +
      international.gold22k.length +
      international.gold18k.length;
    console.log(`🌍 [Scrape] International rows captured: ${totalCountries}`);
  }

  return results;
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
    
    const results = await performScraping();

    // Update cache
    cachedData = {
      data: results,
      timestamp: now,
    };

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
