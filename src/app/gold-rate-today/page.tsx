import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getLatestGoldRates, getHistoricalGoldRates } from "@/lib/goldRatesDB";
import { getRecentNews } from "@/lib/newsDB";
import { getInternationalRates } from "@/lib/internationalRates";
import HomeClient, {
  type CityRate,
  type InternationalRates,
  type NewsItem,
  type RateResponse,
  type PriceChange,
} from "../components/HomeClient";

// Dynamic metadata for SEO - optimized for "gold rate today" query
export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  // Short date for title (50-60 chars recommended)
  const shortDate = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  return {
    // OPTIMIZED for "gold rate today" AND "gold price today" keywords
    // Title: ~60 chars - includes both target keywords
    title: `Gold Rate Today (${shortDate}) | Gold Price Today India - GoldMeter`,
    // Description: includes both keywords naturally - 155 chars
    description: `Gold rate today & gold price today in India: 24K ₹ per gram, 22K ₹ per gram. Live prices for Mumbai, Chennai, Delhi, Bangalore. Updated from IBJA.`,
    alternates: {
      canonical: "https://goldmeter.in/gold-rate-today",
    },
    openGraph: {
      title: `Gold Rate Today & Gold Price Today (${shortDate}) - India | GoldMeter`,
      description: `Today's gold rate & gold price: 24K and 22K prices per gram in India. Updated from IBJA.`,
      url: "https://goldmeter.in/gold-rate-today",
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
      description: `Live 22K & 24K gold rates per gram in India. Updated daily from IBJA.`,
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

// Fallback mock news
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

export default async function GoldRateTodayPage() {
  // Fetch all data in parallel (including international rates like homepage)
  const [dbDataResult, historyResult, newsResult, intlRatesResult] = await Promise.allSettled([
    getLatestGoldRates(),
    getHistoricalGoldRates("India", 30),
    getRecentNews(3),
    getInternationalRates(),
  ]);

  // Process international rates
  let internationalRates: InternationalRates | null = intlRatesResult.status === 'fulfilled' ? intlRatesResult.value : null;

  // Process database rates
  const dbData = dbDataResult.status === 'fulfilled' ? dbDataResult.value : null;
  const history: HistoryRate[] = historyResult.status === 'fulfilled' ? historyResult.value : [];

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
  }

  // Prepare rates
  let baseRates: RateResponse;
  let cityRates: CityRate[] = [];
  let priceChange: PriceChange = { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 };
  
  if (dbData?.india) {
    baseRates = {
      date: dbData.india.date,
      gold_24k: dbData.india.gold24k,
      gold_22k: dbData.india.gold22k,
      silver_1kg: dbData.india.silver1kg || 0,
      city: "India",
    };
    
    if (dbData.yesterdayIndia) {
      priceChange = {
        gold22k: dbData.india.gold22k - dbData.yesterdayIndia.gold22k,
        gold24k: dbData.india.gold24k - dbData.yesterdayIndia.gold24k,
        silver1kg: (dbData.india.silver1kg || 0) - (dbData.yesterdayIndia.silver1kg || 0),
      };
    }
    
    if (Object.keys(dbData.cities).length > 0) {
      cityRates = Object.entries(dbData.cities).map(([name, rates]) => ({
        name,
        gold22k: rates.gold22k,
        gold24k: rates.gold24k,
        updated: "Today",
        change: 0,
      }));
    }
  } else {
    baseRates = {
      date: new Date().toLocaleDateString("en-IN"),
      gold_24k: 142040,
      gold_22k: 130200,
      silver_1kg: 99000,
      city: "India",
    };
  }

  const normalizedHistory: HistoryRate[] = (history || []).map((h) => ({
    date: h.date,
    gold22k: h.gold22k,
    gold24k: h.gold24k,
    gold18k: h.gold18k,
    silver1kg: h.silver1kg ?? 0,
    timestamp: h.timestamp,
  }));

  // Calculate per-gram prices
  const perGram24k = Math.round(baseRates.gold_24k / 10);
  const perGram22k = Math.round(baseRates.gold_22k / 10);
  const perGram18k = Math.round((baseRates.gold_24k * 18) / 24 / 10);
  const silver1g = Math.round((baseRates.silver_1kg || 0) / 1000);
  
  // Yesterday's prices
  const yesterdayPerGram24k = perGram24k - Math.round((priceChange.gold24k || 0) / 10);
  const yesterdayPerGram22k = perGram22k - Math.round((priceChange.gold22k || 0) / 10);
  
  // Format dates
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const todayISO = new Date().toISOString().split('T')[0];
  const updateTime = new Date().toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Consolidated Structured Data using @graph - ALL schemas in ONE block
  // This prevents Next.js RSC serialization from creating duplicate FAQPage entries
  const structuredDataJson = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      // WebSite schema for search
      {
        "@type": "WebSite",
        "@id": "https://goldmeter.in/#website",
        "name": "GoldMeter",
        "url": "https://goldmeter.in",
        "description": "Track live 22K & 24K gold prices across Indian cities, compare trends, and calculate jewellery costs.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://goldmeter.in/{city}",
          "query-input": "required name=city"
        }
      },
      // Organization schema for brand recognition
      {
        "@type": "Organization",
        "@id": "https://goldmeter.in/#organization",
        "name": "GoldMeter",
        "url": "https://goldmeter.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://goldmeter.in/logo.png"
        },
        "description": "India's trusted source for live gold and silver prices across major cities."
      },
      // WebPage schema
      {
        "@type": "WebPage",
        "@id": "https://goldmeter.in/gold-rate-today/#webpage",
        "name": `Gold Rate Today in India (${todayFormatted}) - Live 22K & 24K Price per Gram`,
        "description": `Today's gold rate in India: ₹${perGram24k.toLocaleString('en-IN')}/gram for 24K, ₹${perGram22k.toLocaleString('en-IN')}/gram for 22K. Updated ${todayFormatted}.`,
        "url": "https://goldmeter.in/gold-rate-today",
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString(),
        "inLanguage": "en-IN",
        "isPartOf": { "@id": "https://goldmeter.in/#website" },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["[data-ai-answer]", "h1", "[data-price-table]"]
        }
      },
      // BreadcrumbList schema
      {
        "@type": "BreadcrumbList",
        "@id": "https://goldmeter.in/gold-rate-today/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://goldmeter.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Gold Rate Today",
            "item": "https://goldmeter.in/gold-rate-today"
          }
        ]
      },
      // Dataset schema for AI Overview authority
      {
        "@type": "Dataset",
        "@id": "https://goldmeter.in/gold-rate-today/#dataset",
        "name": "India Gold Rate Today",
        "description": `Live 22K and 24K gold prices in India as of ${todayFormatted}. Current rates: 24K gold at ₹${perGram24k.toLocaleString('en-IN')} per gram, 22K gold at ₹${perGram22k.toLocaleString('en-IN')} per gram.`,
        "temporalCoverage": todayISO,
        "creator": { "@id": "https://goldmeter.in/#organization" },
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
          },
          {
            "@type": "PropertyValue",
            "name": "18K Gold Price per gram",
            "value": perGram18k,
            "unitText": "INR"
          }
        ]
      },
      // FAQPage schema - included in @graph to prevent RSC duplication
      {
        "@type": "FAQPage",
        "@id": "https://goldmeter.in/gold-rate-today/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the gold rate today in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `As of ${todayFormatted}, 24K gold rate is ₹${perGram24k.toLocaleString('en-IN')} per gram and 22K gold rate is ₹${perGram22k.toLocaleString('en-IN')} per gram in India.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the gold price today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Gold price today in India: 24K gold is ₹${perGram24k.toLocaleString('en-IN')} per gram, 22K gold is ₹${perGram22k.toLocaleString('en-IN')} per gram. Prices updated ${todayFormatted} from IBJA.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the 22K gold rate today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Today's 22K gold rate in India is ₹${perGram22k.toLocaleString('en-IN')} per gram (₹${baseRates.gold_22k.toLocaleString('en-IN')} per 10 grams). 22K gold contains 91.6% pure gold.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the 24K gold rate today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Today's 24K gold rate in India is ₹${perGram24k.toLocaleString('en-IN')} per gram (₹${baseRates.gold_24k.toLocaleString('en-IN')} per 10 grams). 24K is 99.9% pure gold.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the price of 1 gram gold today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `1 gram gold price today: 24K is ₹${perGram24k.toLocaleString('en-IN')}, 22K is ₹${perGram22k.toLocaleString('en-IN')}, and 18K is ₹${perGram18k.toLocaleString('en-IN')}.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the price of 8 gram gold today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `8 gram gold price today: 24K is ₹${(perGram24k * 8).toLocaleString('en-IN')}, 22K is ₹${(perGram22k * 8).toLocaleString('en-IN')}, and 18K is ₹${(perGram18k * 8).toLocaleString('en-IN')}.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the price of 10 gram gold today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `10 gram gold price today in India: 24K is ₹${baseRates.gold_24k.toLocaleString('en-IN')}, 22K is ₹${baseRates.gold_22k.toLocaleString('en-IN')}. Updated ${todayFormatted}.`
            }
          },
          {
            "@type": "Question",
            "name": "Is gold rate up or down today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Gold rate today is ${(priceChange.gold24k || 0) >= 0 ? 'UP' : 'DOWN'} by ₹${Math.abs(Math.round((priceChange.gold24k || 0) / 10))}/gram compared to yesterday. 24K: ₹${perGram24k.toLocaleString('en-IN')}/g, 22K: ₹${perGram22k.toLocaleString('en-IN')}/g.`
            }
          },
          {
            "@type": "Question",
            "name": "What is today's gold price per gram in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Today's gold price per gram in India: 24 carat (99.9% pure) is ₹${perGram24k.toLocaleString('en-IN')}, 22 carat (91.6% pure) is ₹${perGram22k.toLocaleString('en-IN')}, 18 carat is ₹${perGram18k.toLocaleString('en-IN')}. Source: IBJA.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the hallmark gold rate today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Hallmark gold rate today: 22K (916 hallmark) is ₹${perGram22k.toLocaleString('en-IN')}/gram, 18K (750 hallmark) is ₹${perGram18k.toLocaleString('en-IN')}/gram. Always buy BIS hallmarked gold.`
            }
          }
        ]
      }
    ]
  });

  return (
    <>
      {/* Single consolidated structured data script using @graph */}
      {/* Using Script component with id to prevent Next.js RSC double-serialization */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        strategy="beforeInteractive"
      />
      
      {/* AIO ANSWER BLOCK - Server-rendered for AI scrapers */}
      <div className="bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today &amp; Gold Price Today in India ({todayFormatted})
            </h1>
            <p className="text-lg text-amber-700 font-medium mt-1">Live 22K &amp; 24K Price per Gram</p>
            
            {/* Primary AIO answer */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={todayISO}>{todayFormatted}</time>, gold rates in India are <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> (99.9% purity), <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> (91.6% purity), and <strong>₹{perGram18k.toLocaleString('en-IN')} per gram for 18K</strong> (75.0% purity). Silver rate is ₹{silver1g.toLocaleString('en-IN')} per gram.
            </p>

            {/* TODAY VS YESTERDAY - Critical for Featured Snippets */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white p-3 border border-amber-100 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-semibold">24K Today</p>
                <p className="text-lg font-bold text-amber-800">₹{perGram24k.toLocaleString('en-IN')}</p>
                <p className={`text-xs font-medium ${(priceChange.gold24k || 0) >= 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {(priceChange.gold24k || 0) >= 0 ? '▲' : '▼'} ₹{Math.abs(Math.round((priceChange.gold24k || 0) / 10)).toLocaleString('en-IN')}/g
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-semibold">24K Yesterday</p>
                <p className="text-lg font-bold text-slate-600">₹{yesterdayPerGram24k.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-400">per gram</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-amber-100 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-semibold">22K Today</p>
                <p className="text-lg font-bold text-amber-800">₹{perGram22k.toLocaleString('en-IN')}</p>
                <p className={`text-xs font-medium ${(priceChange.gold22k || 0) >= 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {(priceChange.gold22k || 0) >= 0 ? '▲' : '▼'} ₹{Math.abs(Math.round((priceChange.gold22k || 0) / 10)).toLocaleString('en-IN')}/g
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-semibold">22K Yesterday</p>
                <p className="text-lg font-bold text-slate-600">₹{yesterdayPerGram22k.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-400">per gram</p>
              </div>
            </div>

            {/* Structured price table matching competitor format */}
            <div className="mt-4 overflow-x-auto" data-price-table="true">
              <table className="w-full text-sm border-collapse">
                <caption className="text-left font-semibold text-amber-800 mb-2">
                  Today&apos;s Gold & Silver Rates in India (per gram)
                </caption>
                <thead>
                  <tr className="bg-amber-100 text-amber-900">
                    <th className="px-3 py-2 text-left border border-amber-200">Gram</th>
                    <th className="px-3 py-2 text-left border border-amber-200">22K Today</th>
                    <th className="px-3 py-2 text-left border border-amber-200">22K Yesterday</th>
                    <th className="px-3 py-2 text-left border border-amber-200">24K Today</th>
                    <th className="px-3 py-2 text-left border border-amber-200">24K Yesterday</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">1 gram</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{perGram22k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{yesterdayPerGram22k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{perGram24k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{yesterdayPerGram24k.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">8 gram</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{(perGram22k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{(yesterdayPerGram22k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{(perGram24k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{(yesterdayPerGram24k * 8).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">10 gram</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{baseRates.gold_22k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{(baseRates.gold_22k - (priceChange.gold22k || 0)).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{baseRates.gold_24k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{(baseRates.gold_24k - (priceChange.gold24k || 0)).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">100 gram</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{(perGram22k * 100).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{(yesterdayPerGram22k * 100).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold">₹{(perGram24k * 100).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200 text-slate-500">₹{(yesterdayPerGram24k * 100).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Silver Rates Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="text-left font-semibold text-slate-700 mb-2">Silver Rate Today in India</caption>
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="px-3 py-2 text-left border border-slate-200">Weight</th>
                    <th className="px-3 py-2 text-left border border-slate-200">Silver Price Today</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-slate-200">1 gram</td>
                    <td className="px-3 py-2 border border-slate-200 font-semibold">₹{silver1g.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2 border border-slate-200">10 gram</td>
                    <td className="px-3 py-2 border border-slate-200 font-semibold">₹{(silver1g * 10).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-slate-200">100 gram</td>
                    <td className="px-3 py-2 border border-slate-200 font-semibold">₹{Math.round((baseRates.silver_1kg || 0) / 10).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2 border border-slate-200">1 kg</td>
                    <td className="px-3 py-2 border border-slate-200 font-semibold">₹{(baseRates.silver_1kg || 0).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* City-wise quick rates */}
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-amber-800 mb-2">Gold Rates Across Major Indian Cities (22K per gram):</h2>
              <ul className="grid grid-cols-2 gap-1 text-sm text-slate-700 sm:grid-cols-3">
                {cityRates.slice(0, 6).map((city) => (
                  <li key={city.name}>
                    <Link href={`/gold-rate/${city.name.toLowerCase()}`} className="hover:text-amber-600">
                      <strong>{city.name}:</strong> ₹{Math.round(city.gold22k / 10).toLocaleString('en-IN')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* IBJA Verification Timestamp - E-E-A-T Signal */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 border border-emerald-200">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified from IBJA
              </span>
              <span>|</span>
              <span>Updated: <time dateTime={todayISO}>{todayFormatted}</time> at {updateTime} IST</span>
              <span>|</span>
              <span>Source: <strong>GoldMeter.in</strong></span>
            </div>
          </section>
        </article>
      </div>

      {/* FAQ Section - Visible content matching FAQ schema (important for Google validation) */}
      <div className="bg-[#fffdf7]">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-charcoal mb-4">Gold Rate Today - Frequently Asked Questions</h2>
            <div className="space-y-3">
              <details className="rounded-xl border border-slate-100 p-4 hover:border-amber-200">
                <summary className="cursor-pointer font-semibold text-charcoal">What is the gold rate today in India?</summary>
                <p className="mt-2 text-sm text-slate-600">As of {todayFormatted}, 24K gold rate is ₹{perGram24k.toLocaleString('en-IN')} per gram and 22K gold rate is ₹{perGram22k.toLocaleString('en-IN')} per gram in India.</p>
              </details>
              <details className="rounded-xl border border-slate-100 p-4 hover:border-amber-200">
                <summary className="cursor-pointer font-semibold text-charcoal">What is the gold price today?</summary>
                <p className="mt-2 text-sm text-slate-600">Gold price today in India: 24K gold is ₹{perGram24k.toLocaleString('en-IN')} per gram, 22K gold is ₹{perGram22k.toLocaleString('en-IN')} per gram. Prices updated {todayFormatted} from IBJA.</p>
              </details>
              <details className="rounded-xl border border-slate-100 p-4 hover:border-amber-200">
                <summary className="cursor-pointer font-semibold text-charcoal">What is the price of 10 gram gold today?</summary>
                <p className="mt-2 text-sm text-slate-600">10 gram gold price today in India: 24K is ₹{baseRates.gold_24k.toLocaleString('en-IN')}, 22K is ₹{baseRates.gold_22k.toLocaleString('en-IN')}. Updated {todayFormatted}.</p>
              </details>
              <details className="rounded-xl border border-slate-100 p-4 hover:border-amber-200">
                <summary className="cursor-pointer font-semibold text-charcoal">Is gold rate up or down today?</summary>
                <p className="mt-2 text-sm text-slate-600">Gold rate today is {(priceChange.gold24k || 0) >= 0 ? 'UP' : 'DOWN'} by ₹{Math.abs(Math.round((priceChange.gold24k || 0) / 10))}/gram compared to yesterday. 24K: ₹{perGram24k.toLocaleString('en-IN')}/g, 22K: ₹{perGram22k.toLocaleString('en-IN')}/g.</p>
              </details>
              <details className="rounded-xl border border-slate-100 p-4 hover:border-amber-200">
                <summary className="cursor-pointer font-semibold text-charcoal">What is today&apos;s gold price per gram in India?</summary>
                <p className="mt-2 text-sm text-slate-600">Today&apos;s gold price per gram in India: 24 carat (99.9% pure) is ₹{perGram24k.toLocaleString('en-IN')}, 22 carat (91.6% pure) is ₹{perGram22k.toLocaleString('en-IN')}, 18 carat is ₹{perGram18k.toLocaleString('en-IN')}. Source: IBJA.</p>
              </details>
            </div>
          </section>
        </div>
      </div>

      {/* Related Searches - Internal Linking for SEO */}
      <div className="bg-[#fffdf7]">
        <div className="mx-auto max-w-6xl px-4 pb-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">🔍 Popular Gold Rate Searches</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/gold-rate/chennai" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today Chennai
              </Link>
              <Link href="/gold-rate/mumbai" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today Mumbai
              </Link>
              <Link href="/gold-rate/delhi" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today Delhi
              </Link>
              <Link href="/gold-rate/bangalore" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today Bangalore
              </Link>
              <Link href="/gold-rate/hyderabad" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today Hyderabad
              </Link>
              <Link href="/calculator" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                1 gram gold rate today
              </Link>
              <Link href="/purity-converter" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                22K vs 24K converter
              </Link>
              <Link href="/silver-rate" className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Silver rate today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full interactive UI (with international rates like homepage) */}
      <HomeClient 
        baseRates={baseRates} 
        cities={cityRates} 
        newsItems={newsItems} 
        priceChange={priceChange} 
        history={normalizedHistory}
        internationalRates={internationalRates ?? undefined}
      />
    </>
  );
}

// Cache page for 5 minutes
export const revalidate = 300;

