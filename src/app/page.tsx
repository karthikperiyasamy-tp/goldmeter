import { headers } from "next/headers";
import type { Metadata } from "next";
import HomeClient, {
  type CityRate,
  type InternationalRates,
  type NewsItem,
  type RateResponse,
  type PriceChange,
  type RecapItem,
} from "./components/HomeClient";
import { getLatestGoldRates, getHistoricalGoldRates } from "@/lib/goldRatesDB";
import { getRecentNews } from "@/lib/newsDB";
import { getInternationalRates } from "@/lib/internationalRates";
import { getRecentRecaps, formatDateForDisplay } from "@/lib/recapDB";
import { calculatePriceChangeWithFallback } from "@/lib/fetchCityRates";

// Dynamic metadata for SEO - updates with today's date for freshness signals
export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  // Short date for title (50-60 chars recommended)
  const shortDate = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  return {
    // Homepage title - brand-focused, differentiated from /gold-rate-today
    title: `GoldMeter - Live Gold & Silver Prices India (${shortDate})`,
    // Description: brand-focused with live rates
    description: `GoldMeter: Track live gold & silver rates across 25+ Indian cities. Compare 22K, 24K prices, use calculators, and get daily updates from IBJA.`,
    alternates: {
      canonical: "https://goldmeter.in",
    },
    openGraph: {
      title: `GoldMeter - India's Gold Price Today (${shortDate})`,
      description: `Live gold & silver prices across 25+ Indian cities. Updated daily from IBJA.`,
      url: "https://goldmeter.in",
      siteName: "GoldMeter",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://goldmeter.in/og-image.png",
          width: 1200,
          height: 630,
          alt: `Gold Rate Today in India`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Gold Rate Today (${shortDate}) - India Gold Prices`,
      description: `Live 22K & 24K gold rates in India. Updated daily from IBJA.`,
      images: ["https://goldmeter.in/og-image.png"],
    },
  };
}

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
  const [dbDataResult, historyResult, newsResult, intlRatesResult, recapsResult] = await Promise.allSettled([
    getLatestGoldRates(),
    getHistoricalGoldRates("India", 30),
    getRecentNews(3),
    getInternationalRates(),
    getRecentRecaps(6),
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

  // Process recaps for internal linking
  let recentRecaps: RecapItem[] = [];
  if (recapsResult.status === 'fulfilled' && recapsResult.value.length > 0) {
    recentRecaps = recapsResult.value.map((recap) => ({
      slug: recap.slug,
      title: recap.title,
      date: formatDateForDisplay(recap.date),
      summary: recap.summary,
      sourcesCount: recap.sourcesCount,
    }));
    console.log(`📊 [HomePage] Loaded ${recentRecaps.length} recent recaps for internal linking`);
  } else if (recapsResult.status === 'rejected') {
    console.error("❌ [HomePage] Failed to fetch recaps:", recapsResult.reason);
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
    // If yesterday's change is suspicious (₹10/10g), use day-before-yesterday instead
    if (dbData.yesterdayIndia) {
      const todayRates = {
        gold22k: dbData.india.gold22k,
        gold24k: dbData.india.gold24k,
        gold18k: dbData.india.gold18k || Math.round((dbData.india.gold24k * 18) / 24),
        silver1kg: dbData.india.silver1kg,
      };
      const yesterdayRates = {
        ...dbData.yesterdayIndia,
        gold18k: dbData.yesterdayIndia.gold18k || Math.round((dbData.yesterdayIndia.gold24k * 18) / 24),
      };
      const dayBeforeYesterdayRates = dbData.dayBeforeYesterdayIndia ? {
        ...dbData.dayBeforeYesterdayIndia,
        gold18k: dbData.dayBeforeYesterdayIndia.gold18k || Math.round((dbData.dayBeforeYesterdayIndia.gold24k * 18) / 24),
      } : null;
      
      const calculatedChange = calculatePriceChangeWithFallback(todayRates, yesterdayRates, dayBeforeYesterdayRates);
      priceChange = {
        gold22k: calculatedChange.gold22k,
        gold24k: calculatedChange.gold24k,
        silver1kg: calculatedChange.silver1kg,
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

  // Calculate per-gram prices for AIO answer block and schema
  const perGram24k = Math.round(baseRates.gold_24k / 10);
  const perGram22k = Math.round(baseRates.gold_22k / 10);
  const perGram18k = Math.round((baseRates.gold_24k * 18) / 24 / 10);
  const silver1g = Math.round((baseRates.silver_1kg || 0) / 1000);
  
  // Format today's date for display
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const todayISO = new Date().toISOString().split('T')[0];
  
  // Format time for display
  const timeFormatted = new Date().toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Table Schema for Featured Snippets
  const tableSchema = {
    "@context": "https://schema.org",
    "@type": "Table",
    "about": "Gold Rate Today in India",
    "name": "Today's Gold & Silver Rates in India",
    "dateModified": new Date().toISOString(),
  };

  // Homepage structured data - WebSite schema for search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GoldMeter",
    "url": "https://goldmeter.in",
    "description": "Track live 22K & 24K gold prices across Indian cities, compare trends, and calculate jewellery costs.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://goldmeter.in/{city}",
      "query-input": "required name=city"
    }
  };

  // Organization schema for brand recognition
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GoldMeter",
    "url": "https://goldmeter.in",
    "logo": "https://goldmeter.in/logo.png",
    "description": "India's trusted source for live gold and silver prices across major cities.",
    "sameAs": []
  };

  // WebPage schema with dateModified - critical for freshness signals in Google AI Overview
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Gold Rate Today in India (${todayFormatted}) - Live 22K & 24K Price`,
    "description": `Today's gold rate in India: ₹${perGram24k.toLocaleString('en-IN')}/gram for 24K, ₹${perGram22k.toLocaleString('en-IN')}/gram for 22K. Updated ${todayFormatted}.`,
    "url": "https://goldmeter.in",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
    "inLanguage": "en-IN",
    "isPartOf": {
      "@type": "WebSite",
      "name": "GoldMeter",
      "url": "https://goldmeter.in"
    },
    "about": {
      "@type": "Thing",
      "name": "Gold Price in India"
    },
    "mainEntity": {
      "@type": "Dataset",
      "name": "India Gold Rate Today",
      "description": `Live 22K and 24K gold prices in India as of ${todayFormatted}. Current rates: 24K gold at ₹${perGram24k.toLocaleString('en-IN')} per gram, 22K gold at ₹${perGram22k.toLocaleString('en-IN')} per gram. Updated daily from Indian bullion markets.`,
      "temporalCoverage": todayISO,
      "creator": {
        "@type": "Organization",
        "name": "GoldMeter",
        "url": "https://goldmeter.in"
      },
      "license": "https://goldmeter.in/terms",
      "variableMeasured": [
        {
          "@type": "PropertyValue",
          "name": "24K Gold Price per gram",
          "value": perGram24k,
          "unitText": "INR"
        },
        {
          "@type": "PropertyValue",
          "name": "22K Gold Price per gram",
          "value": perGram22k,
          "unitText": "INR"
        }
      ]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["[data-ai-answer]", "h1"]
    }
  };

  // Note: No FAQPage schema on homepage
  // - Regular users get geo-redirected to city pages (which have FAQPage via StructuredData)
  // - Bots see the homepage which is a landing page, not FAQ content
  // - Adding FAQPage here causes "Duplicate field FAQPage" errors in Search Console

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema) }}
      />
      
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      {/* This MUST be outside HomeClient so it renders as static HTML for bots */}
      <div className="bg-[#fffdf7]" itemScope itemType="https://schema.org/Product">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl" itemProp="name">
              Live Gold &amp; Silver Prices in India ({todayFormatted})
            </h1>
            
            {/* Primary AIO answer - structured for AI extraction */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true" itemProp="description">
              Today gold rates in India are <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> (99.9% purity), <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> (91.6% purity), and <strong>₹{perGram18k.toLocaleString('en-IN')} per gram for 18K</strong> (75.0% purity). Silver rate is ₹{silver1g.toLocaleString('en-IN')} per gram. Prices updated <time dateTime={todayISO}>{todayFormatted}</time>. For today&apos;s full gold rates, visit <strong>GoldMeter.in</strong>.
            </p>

            {/* Structured price table for AI extraction */}
            <div className="mt-4 overflow-x-auto" data-price-table="true">
              <table className="w-full text-sm border-collapse" itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
                <caption className="text-left font-semibold text-amber-800 mb-2">
                  Today&apos;s Gold & Silver Rates in India
                  {/* Schema.org metadata for AggregateOffer - using hidden spans instead of meta tags */}
                  <span itemProp="priceCurrency" className="sr-only">INR</span>
                  <span itemProp="lowPrice" className="sr-only">{perGram18k.toString()}</span>
                  <span itemProp="highPrice" className="sr-only">{perGram24k.toString()}</span>
                </caption>
                <thead>
                  <tr className="bg-amber-100 text-amber-900">
                    <th className="px-3 py-2 text-left border border-amber-200">Metal</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Purity</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per Gram</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per 8g</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per 10g</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 24K</td>
                    <td className="px-3 py-2 border border-amber-200">99.9%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="24k">₹{perGram24k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram24k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{baseRates.gold_24k.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 22K</td>
                    <td className="px-3 py-2 border border-amber-200">91.6%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="22k">₹{perGram22k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram22k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{baseRates.gold_22k.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 18K</td>
                    <td className="px-3 py-2 border border-amber-200">75.0%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="18k">₹{perGram18k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram18k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram18k * 10).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Silver</td>
                    <td className="px-3 py-2 border border-amber-200">99.9%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="silver">₹{silver1g.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(silver1g * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{Math.round((baseRates.silver_1kg || 0) / 100).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* City-wise quick rates for AI */}
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-amber-800 mb-2">Gold Rates Across Major Indian Cities (22K per gram):</h2>
              <ul className="grid grid-cols-2 gap-1 text-sm text-slate-700 sm:grid-cols-3">
                {cityRates.slice(0, 6).map((city) => (
                  <li key={city.name}>
                    <strong>{city.name}:</strong> ₹{Math.round(city.gold22k / 10).toLocaleString('en-IN')}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* IBJA Verification Timestamp - E-E-A-T Signal */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 border border-emerald-200">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified from IBJA
              </span>
              <span>|</span>
              <span>Updated: <time dateTime={todayISO}>{todayFormatted}, {timeFormatted}</time></span>
              <span>|</span>
              <span>Source: <strong>GoldMeter.in</strong></span>
            </div>
          </section>
          
          {/* Related Searches - Internal Linking for SEO */}
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">🔍 Popular Gold Rate Searches</p>
            <div className="flex flex-wrap gap-2">
              <a href="/gold-rate-today" className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200 transition-colors">
                Gold rate today
              </a>
              <a href="/gold-rate/chennai" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Chennai gold rate
              </a>
              <a href="/gold-rate/mumbai" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Mumbai gold rate
              </a>
              <a href="/gold-rate/delhi" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Delhi gold rate
              </a>
              <a href="/gold-rate/bangalore" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Bangalore gold rate
              </a>
              <a href="/gold-rate/hyderabad" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Hyderabad gold rate
              </a>
              <a href="/silver-rate" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Silver rate today
              </a>
              <a href="/calculator" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Gold calculator
              </a>
            </div>
          </div>
        </article>
      </div>
      
      <HomeClient baseRates={baseRates} cities={cityRates} newsItems={newsItems} priceChange={priceChange} history={normalizedHistory} internationalRates={internationalRates ?? undefined} recentRecaps={recentRecaps} />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching for optimal performance
export const revalidate = 300;
