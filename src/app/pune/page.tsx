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
    title: `Pune Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Pune gold rate per gram for 22K and 24K gold. Check Laxmi Road prices, making charges, and trusted jewellers list.`,
    alternates: {
      canonical: "https://goldmeter.in/pune",
    },
    openGraph: {
      title: `Pune Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Pune gold rate per gram. Updated daily from Pune bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/pune',
    },
  };
}

export default async function PunePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Pune", host);

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
    "name": "Pune Gold Rate Today",
    "description": "Live gold price per gram in Pune for 22K and 24K gold, updated daily from Pune bullion market.",
    "creator": { "@type": "Organization", "name": "GoldMeter", "url": "https://goldmeter.in" },
    "temporalCoverage": rates.dateISO,
    "spatialCoverage": { "@type": "Place", "name": "Pune, Maharashtra, India" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      <main className="min-h-screen bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="mb-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Pune
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, according to GoldMeter&apos;s live Pune bullion tracking, 24K gold is priced at ₹{perGram24k.toLocaleString('en-IN')} per gram and 22K gold at ₹{perGram22k.toLocaleString('en-IN')} per gram. 18K gold is approximately ₹{perGram18k.toLocaleString('en-IN')} per gram.
            </p>
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              <strong>GoldMeter Pune Rate:</strong> ₹{perGram24k.toLocaleString('en-IN')}/g (24K) | ₹{perGram22k.toLocaleString('en-IN')}/g (22K) — Updated {todayFormatted}
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Source: <strong>GoldMeter</strong> • Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>
          </section>
        </article>
      </main>

      <CityPageShell
        city="Pune"
        intro="Gold rate in Pune today per gram: 22K & 24K live prices with Laxmi Road and Hadapsar trends, charts, and FAQs."
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
              "BIS Hallmarking Center (Pune) and Maharashtra Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹190 – ₹480 per gram for 22K ornaments in Laxmi Road.",
          },
          {
            title: "Top jewellery hubs",
            description: "Laxmi Road, FC Road, and Deccan Gymkhana stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Pune gold rate same as Mumbai?",
            answer:
              "Pune rates are typically ₹10-₹20 lower than Mumbai due to lower demand and logistics costs.",
          },
          {
            question: "Best time to buy gold in Pune?",
            answer:
              "Gudi Padwa, Akshaya Tritiya, and Diwali offer good buying opportunities with festive discounts.",
          },
          {
            question: "Trusted places in Pune?",
            answer:
              "Laxmi Road has established stores with BIS hallmarked gold and competitive making charges.",
          },
        ]}
        similarCities={["Mumbai", "Nashik", "Aurangabad", "Kolhapur"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

