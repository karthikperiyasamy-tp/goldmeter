import { headers } from "next/headers";
import { Metadata } from "next";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

// Dynamic metadata with date for AIO freshness signals
export async function generateMetadata(): Promise<Metadata> {
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return {
    title: `Mumbai Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Mumbai gold rate per gram for 22K and 24K gold. Compare prices, check making charges, and find best jewellery shops in Mumbai.`,
    alternates: {
      canonical: "https://goldmeter.in/mumbai",
    },
    openGraph: {
      title: `Mumbai Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Mumbai gold rate per gram. Updated daily from Mumbai bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/mumbai',
    },
  };
}

export default async function MumbaiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Mumbai", host);

  // Calculate per-gram prices for AIO answer block
  const perGram24k = Math.round((rates.gold24k || 0) / 10);
  const perGram22k = Math.round((rates.gold22k || 0) / 10);
  const perGram18k = Math.round(((rates.gold24k || 0) * 18) / 24 / 10);
  
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Dataset JSON-LD for AIO data authority
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Mumbai Gold Rate Today",
    "description": "Live gold price per gram in Mumbai for 22K and 24K gold, updated daily from Mumbai bullion market.",
    "creator": {
      "@type": "Organization",
      "name": "GoldMeter",
      "url": "https://goldmeter.in"
    },
    "temporalCoverage": rates.dateISO,
    "spatialCoverage": {
      "@type": "Place",
      "name": "Mumbai, Maharashtra, India"
    },
    "variableMeasured": [
      { "@type": "PropertyValue", "name": "24K Gold Price", "value": perGram24k, "unitText": "INR per gram" },
      { "@type": "PropertyValue", "name": "22K Gold Price", "value": perGram22k, "unitText": "INR per gram" },
      { "@type": "PropertyValue", "name": "18K Gold Price", "value": perGram18k, "unitText": "INR per gram" }
    ],
    "dateModified": rates.dateISO,
    "license": "https://goldmeter.in/terms"
  };

  return (
    <>
      {/* Dataset JSON-LD for data authority */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      <main className="min-h-screen bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="mb-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Mumbai
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Mumbai is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold, as reported by GoldMeter.in.
            </p>
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Mumbai: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>
          </section>
        </article>
      </main>

      <CityPageShell
        city="Mumbai"
        intro="Gold rate in Mumbai today per gram: 22K & 24K live prices with Zaveri Bazaar and Dadar trends, charts, and FAQs."
        updated={rates.date}
        dateISO={rates.dateISO}
        gold22k={rates.gold22k}
        gold24k={rates.gold24k}
        silver1kg={rates.silver1kg}
        priceChange={rates.priceChange}
        history={rates.history}
        hideAnswerBlock={true}
        localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "BIS Regional Office (Andheri) and Zaveri Bazaar Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹200 – ₹500 per gram for 22K ornaments in Zaveri Bazaar.",
          },
          {
            title: "Top jewellery hubs",
            description: "Zaveri Bazaar, Dadar, and Andheri West flagship stores.",
          },
        ]}
        faqs={[
          {
            question: "Why is Mumbai gold rate different from other cities?",
            answer:
              "Mumbai rates are influenced by international markets, port logistics, and high demand.",
          },
          {
            question: "Is making charge high in Mumbai?",
            answer:
              "Making charges in Mumbai range from ₹200-₹500 per gram depending on design complexity.",
          },
          {
            question: "Best time to buy gold in Mumbai?",
            answer:
              "Akshaya Tritiya, Dhanteras, and during off-season months when making charges are lower.",
          },
        ]}
        similarCities={["Pune", "Ahmedabad", "Surat", "Chennai"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

