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
      <div className="bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Mumbai
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
            As per GoldMeter.in, as of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Mumbai is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            <meta name="author" content="GoldMeter" />
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Mumbai: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>

            {/* SEO: Expanded intro paragraph */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed">
              <p>
                The gold rate in Mumbai is updated daily based on international market rates, USD/INR currency movements, 
                and Zaveri Bazaar bullion market prices. Mumbai, being India&apos;s financial capital and home to MCX (Multi Commodity Exchange), 
                often sets the benchmark for gold prices across India. These rates reflect spot metal prices without making charges 
                (typically ₹200-500/gram in Zaveri Bazaar) or 3% GST.
              </p>
              <p className="mt-2">
                Zaveri Bazaar in South Mumbai is Asia&apos;s oldest and largest bullion market, dating back over 150 years. 
                Other popular jewellery destinations include Dadar, Borivali, and Malad. Mumbai&apos;s gold rates are typically 
                ₹20-50 lower than South Indian cities due to proximity to international trade routes and wholesale trading volumes.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href="/calculator" className="text-amber-600 hover:text-amber-700 font-medium">Calculate jewellery cost →</a>
                <a href="/wastage-calculator" className="text-amber-600 hover:text-amber-700 font-medium">Making charges calculator →</a>
                <a href="/news" className="text-amber-600 hover:text-amber-700 font-medium">Latest gold news →</a>
              </div>
            </div>
          </section>
        </article>
      </div>

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
            question: "What is the gold rate in Mumbai today?",
            answer:
              `Today's gold rate in Mumbai is ₹${perGram24k.toLocaleString('en-IN')} per gram for 24K gold and ₹${perGram22k.toLocaleString('en-IN')} per gram for 22K gold. Prices are updated daily from Zaveri Bazaar bullion market.`,
          },
          {
            question: "Why does Mumbai gold rate change daily?",
            answer:
              "Mumbai gold prices fluctuate based on London spot prices, MCX futures, USD/INR exchange rate, and trading volumes in Zaveri Bazaar. Being India's financial capital, Mumbai rates respond quickly to global market movements.",
          },
          {
            question: "How is 22K different from 24K gold?",
            answer:
              "24K gold is 99.9% pure (ideal for investment), while 22K gold is 91.6% pure with alloy metals for durability. Most Mumbai jewellers recommend 22K for ornaments and 24K for coins/bars.",
          },
          {
            question: "Does making charge affect final jewellery price?",
            answer:
              "Yes, making charges in Mumbai range from ₹200-500 per gram in Zaveri Bazaar. Final price = Gold Rate × Weight + Making Charges + 3% GST. Wholesale markets offer lower making charges.",
          },
          {
            question: "Are Mumbai gold rates lower than other cities?",
            answer:
              "Yes, Mumbai gold rates are typically ₹20-50 lower than Chennai or Bangalore due to proximity to ports, MCX trading, and higher wholesale volumes in Zaveri Bazaar.",
          },
          {
            question: "Which is the best place to buy gold in Mumbai?",
            answer:
              "Zaveri Bazaar (oldest bullion market), Dadar, Borivali, and Malad are popular. For branded jewellery, visit Tanishq, Kalyan, or PNG stores across the city.",
          },
        ]}
        similarCities={["Pune", "Ahmedabad", "Surat", "Chennai"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

