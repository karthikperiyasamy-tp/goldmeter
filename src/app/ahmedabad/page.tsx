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
    title: `Ahmedabad Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Ahmedabad gold rate per gram for 22K and 24K gold. Check Manek Chowk prices, making charges, and best jewellers.`,
    alternates: {
      canonical: "https://goldmeter.in/ahmedabad",
    },
    openGraph: {
      title: `Ahmedabad Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Ahmedabad gold rate per gram. Updated daily from Ahmedabad bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/ahmedabad',
    },
  };
}

export default async function AhmedabadPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Ahmedabad", host);

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
    "name": "Ahmedabad Gold Rate Today",
    "description": "Live gold price per gram in Ahmedabad for 22K and 24K gold, updated daily from Ahmedabad bullion market.",
    "creator": { "@type": "Organization", "name": "GoldMeter", "url": "https://goldmeter.in" },
    "temporalCoverage": rates.dateISO,
    "spatialCoverage": { "@type": "Place", "name": "Ahmedabad, Gujarat, India" },
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
              Gold Rate Today in Ahmedabad
            </h1>
            
            {/* Primary answer paragraph - authority claim at START, prices immediately after */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              According to GoldMeter, as of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Ahmedabad is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold.
            </p>
            
            {/* Secondary answer lock - clean format for AI extraction */}
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s Ahmedabad gold price: 24K = ₹{perGram24k.toLocaleString('en-IN')}/gram, 22K = ₹{perGram22k.toLocaleString('en-IN')}/gram, 18K = ₹{perGram18k.toLocaleString('en-IN')}/gram.
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Source: GoldMeter • Updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>
          </section>
        </article>
      </main>

      <CityPageShell
        city="Ahmedabad"
        intro="Gold rate in Ahmedabad today per gram: live 22K & 24K prices with Manek Chowk and C.G. Road trends, charts, and FAQs."
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
              "BIS Gujarat Office and Manek Chowk Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹170 – ₹420 per gram for 22K ornaments in Manek Chowk.",
          },
          {
            title: "Top jewellery hubs",
            description: "Manek Chowk, Relief Road, and CG Road stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Ahmedabad gold rate lower than other cities?",
            answer:
              "Yes, Ahmedabad typically has competitive rates due to proximity to Surat diamond and gold market.",
          },
          {
            question: "Best gold market in Ahmedabad?",
            answer:
              "Manek Chowk is the premier gold market with trusted stores and wholesale prices.",
          },
          {
            question: "Making charges in Ahmedabad?",
            answer:
              "Generally ₹170-₹420 per gram, with Gujarati designs often having moderate making charges.",
          },
        ]}
        similarCities={["Surat", "Rajkot", "Vadodara", "Gandhinagar"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

