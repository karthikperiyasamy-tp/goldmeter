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
    title: `Coimbatore Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Coimbatore gold rate per gram for 22K and 24K gold. Check RS Puram prices, making charges, and best jewellery shops.`,
    alternates: {
      canonical: "https://goldmeter.in/coimbatore",
    },
    openGraph: {
      title: `Coimbatore Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Coimbatore gold rate per gram. Updated daily from Coimbatore bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/coimbatore',
    },
  };
}

export default async function CoimbatorePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Coimbatore", host);

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
    "name": "Coimbatore Gold Rate Today",
    "description": "Live gold price per gram in Coimbatore for 22K and 24K gold, updated daily from Coimbatore bullion market.",
    "creator": { "@type": "Organization", "name": "GoldMeter", "url": "https://goldmeter.in" },
    "temporalCoverage": rates.dateISO,
    "spatialCoverage": { "@type": "Place", "name": "Coimbatore, Tamil Nadu, India" },
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
      <div className="bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Coimbatore
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Coimbatore is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            <meta name="author" content="GoldMeter" />
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Coimbatore: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>
          </section>
        </article>
      </div>

      <CityPageShell
        city="Coimbatore"
        intro="Gold rate in Coimbatore today per gram: 22K & 24K live prices with RS Puram and Cross Cut Road trends, charts, and FAQs."
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
              "Tamil Nadu Hallmarking Center (Coimbatore Branch) and Regional Office.",
          },
          {
            title: "Making charges",
            description: "₹140 – ₹400 per gram for 22K ornaments in RS Puram.",
          },
          {
            title: "Top jewellery hubs",
            description: "RS Puram, Oppanakara Street, and Gandhipuram markets.",
          },
        ]}
        faqs={[
          {
            question: "Is Coimbatore gold rate different from Chennai?",
            answer:
              "Coimbatore rates are usually ₹20-₹40 lower than Chennai due to lower demand and local competition.",
          },
          {
            question: "Best place to buy gold in Coimbatore?",
            answer:
              "RS Puram and Oppanakara Street are traditional hubs with competitive prices.",
          },
          {
            question: "Making charges in Coimbatore?",
            answer:
              "Generally ₹140-₹400 per gram, often lower than metro cities.",
          },
        ]}
        similarCities={["Chennai", "Madurai", "Salem", "Erode"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

