import { headers } from "next/headers";
import HomeClient, {
  type CityRate,
  type InternationalRates,
  type NewsItem,
  type RateResponse,
  type PriceChange,
} from "./components/HomeClient";
import { getLatestGoldRates, getHistoricalGoldRates } from "@/lib/goldRatesDB";
import { getRecentNews } from "@/lib/newsDB";
import { getInternationalRates } from "@/lib/internationalRates";

type HistoryRate = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg?: number | null;
  timestamp: number;
};

// Fetch scraped rates including India rate
// Using Next.js cache with 30-minute revalidation to prevent multiple calls
async function getScrapedRates() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  
  console.log("🔄 [HomePage] Fetching scraped rates from API...");
  
  try {
    const res = await fetch(`${protocol}://${host}/api/scrape-rates`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error("Failed to fetch scraped rates");
    }

    const data = await res.json();
    console.log("✅ [HomePage] Scraped rates received successfully");
    return data;
  } catch (error) {
    console.error("❌ [HomePage] Failed to fetch scraped rates:", error);
    return null;
  }
}

const mockCities: CityRate[] = [
  {
    name: "Chennai",
    gold22k: 59680,
    gold24k: 64890,
    updated: "10:35 AM",
    change: 0.4,
  },
  {
    name: "Mumbai",
    gold22k: 59410,
    gold24k: 64600,
    updated: "10:30 AM",
    change: -0.1,
  },
  {
    name: "Bangalore",
    gold22k: 59720,
    gold24k: 64980,
    updated: "10:33 AM",
    change: 0.2,
  },
  {
    name: "Delhi",
    gold22k: 59540,
    gold24k: 64720,
    updated: "10:32 AM",
    change: 0.15,
  },
  {
    name: "Hyderabad",
    gold22k: 59390,
    gold24k: 64580,
    updated: "10:31 AM",
    change: -0.05,
  },
  {
    name: "Coimbatore",
    gold22k: 59610,
    gold24k: 64810,
    updated: "10:36 AM",
    change: 0.25,
  },
];

// Fallback mock news in case database is unavailable
const fallbackNews: NewsItem[] = [
  {
    id: 1,
    title: "Gold Market Update",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    summary: "Stay tuned for the latest gold market updates and price movements.",
    city: "India",
    slug: "gold-market-update",
  },
];

export default async function HomePage() {
  console.log("🏠 [HomePage] Loading gold rates and news...");
  
  // Fetch all data in parallel for faster page load
  const [dbDataResult, historyResult, newsResult, intlRatesResult] = await Promise.allSettled([
    getLatestGoldRates(),
    getHistoricalGoldRates("India", 30),
    getRecentNews(3),
    getInternationalRates(),
  ]);

  // Process database rates
  const dbData = dbDataResult.status === 'fulfilled' ? dbDataResult.value : null;
  if (dbData) {
    console.log("📊 [HomePage] DB fetch result:", dbData.india ? "India data found" : "No India data", Object.keys(dbData.cities).length, "cities found");
  } else if (dbDataResult.status === 'rejected') {
    console.error("❌ [HomePage] Database error:", dbDataResult.reason);
  }

  // Process historical data
  const history: HistoryRate[] = historyResult.status === 'fulfilled' ? historyResult.value : [];
  if (historyResult.status === 'fulfilled') {
    console.log(`📊 [HomePage] Fetched ${history.length} historical records for India`);
  } else {
    console.error("❌ [HomePage] History fetch error:", historyResult.reason);
  }

  // Process news
  let newsItems: NewsItem[] = fallbackNews;
  if (newsResult.status === 'fulfilled' && newsResult.value.length > 0) {
    newsItems = newsResult.value.map((article, index) => ({
      id: index + 1,
      title: article.title,
      date: article.publishedAt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      summary: article.summary,
      city: article.sourceName,
      slug: article.slug,
    }));
    console.log(`📰 [HomePage] Loaded ${newsItems.length} news articles`);
  } else if (newsResult.status === 'rejected') {
    console.error("❌ [HomePage] News fetch error:", newsResult.reason);
  }

  // Process international rates
  let internationalRates: InternationalRates | null = intlRatesResult.status === 'fulfilled' ? intlRatesResult.value : null;
  if (internationalRates) {
    console.log(`🌍 [HomePage] Loaded international rates: 24K=${internationalRates.gold24k.length}, 22K=${internationalRates.gold22k.length}, 18K=${internationalRates.gold18k.length}`);
  } else if (intlRatesResult.status === 'rejected') {
    console.error("❌ [HomePage] Failed to fetch international rates:", intlRatesResult.reason);
  }
  
  // Prepare base rates (India)
  let baseRates: RateResponse;
  let cityRates: CityRate[] = mockCities;
  let priceChange: PriceChange = { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 };
  
  if (dbData?.india) {
    // Use database data
    console.log("✅ [HomePage] Using rates from MongoDB");
    baseRates = {
      date: dbData.india.date, // Already formatted as string
      gold_24k: dbData.india.gold24k,
      gold_22k: dbData.india.gold22k,
      silver_1kg: dbData.india.silver1kg || 0,
      city: "India",
    };
    
    // Calculate price change from yesterday (per 10g)
    if (dbData.yesterdayIndia) {
      priceChange = {
        gold22k: dbData.india.gold22k - dbData.yesterdayIndia.gold22k,
        gold24k: dbData.india.gold24k - dbData.yesterdayIndia.gold24k,
        silver1kg: (dbData.india.silver1kg || 0) - (dbData.yesterdayIndia.silver1kg || 0),
      };
      console.log(`📈 [HomePage] Price change: 22K=${priceChange.gold22k >= 0 ? '+' : ''}₹${priceChange.gold22k}, 24K=${priceChange.gold24k >= 0 ? '+' : ''}₹${priceChange.gold24k}, Silver=${(priceChange.silver1kg || 0) >= 0 ? '+' : ''}₹${priceChange.silver1kg}`);
    }
    
    // Convert DB city data to CityRate format
    if (Object.keys(dbData.cities).length > 0) {
      cityRates = Object.entries(dbData.cities).map(([name, rates]) => ({
        name,
        gold22k: rates.gold22k,
        gold24k: rates.gold24k,
        updated: "Today",
        change: 0,
      }));
      console.log(`✅ [HomePage] Using ${cityRates.length} city rates from MongoDB`);
    }
  } else {
    // Fallback to scraping
    console.log("⚠️  [HomePage] No DB data found, falling back to scraping");
    const scrapedData = await getScrapedRates();
    
    if (scrapedData?.success && scrapedData?.data?.india) {
      console.log("✅ [HomePage] Using scraped rates");
      baseRates = {
        date: new Date().toLocaleDateString("en-IN"),
        gold_24k: scrapedData.data.india.gold24k || 64500,
        gold_22k: scrapedData.data.india.gold22k || 59200,
        silver_1kg: scrapedData.data.india.silver1kg || 0,
        city: "India",
      };

      // Reuse scraped international rates if cache helper failed
      if (!internationalRates && scrapedData.data.international) {
        internationalRates = scrapedData.data.international as InternationalRates;
      }
      
      // Convert scraped city data
      if (scrapedData.data.cities) {
        const cities = scrapedData.data.cities as Record<string, { gold22k: number | null; gold24k: number | null; timestamp: string }>;
        
        cityRates = Object.entries(cities)
          .filter(([_, rates]) => rates.gold22k !== null && rates.gold24k !== null)
          .map(([name, rates]) => ({
            name,
            gold22k: rates.gold22k as number,
            gold24k: rates.gold24k as number,
            updated: new Date(rates.timestamp).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            change: 0,
          }));
        
        console.log(`✅ [HomePage] Using ${cityRates.length} scraped city rates`);
      }
    } else {
      // Final fallback to mock data
      console.log("⚠️  [HomePage] Using mock data (DB and scraping unavailable)");
      baseRates = {
        date: new Date().toLocaleDateString("en-IN"),
        gold_24k: 64500,
        gold_22k: 59200,
        city: "India",
      };
    }
  }

  const normalizedHistory: HistoryRate[] = (history || []).map((h) => ({
    date: h.date,
    gold22k: h.gold22k,
    gold24k: h.gold24k,
    gold18k: h.gold18k,
    silver1kg: h.silver1kg ?? 0,
    timestamp: h.timestamp,
  }));

  return <HomeClient baseRates={baseRates} cities={cityRates} newsItems={newsItems} priceChange={priceChange} history={normalizedHistory} internationalRates={internationalRates ?? undefined} />;
}

// Cache page for 5 minutes - combined with DB-level caching for optimal performance
export const revalidate = 300;
