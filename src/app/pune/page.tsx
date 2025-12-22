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
      <div className="bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Pune
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Pune is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            <meta name="author" content="GoldMeter" />
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Pune: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>

            {/* SEO: Expanded intro paragraph */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed">
              <p>
                The gold rate in Pune is updated daily based on international market rates, USD/INR currency movements, 
                and Maharashtra Bullion Association pricing. Pune, being close to Mumbai, enjoys competitive gold rates 
                with lower overhead costs. These prices exclude making charges (₹190-480/gram) and 3% GST.
              </p>
              <p className="mt-2">
                Laxmi Road is Pune&apos;s premier jewellery destination, with established stores offering traditional 
                Maharashtrian designs and contemporary styles. The city&apos;s IT and manufacturing workforce creates 
                steady demand. Gold prices typically follow Mumbai trends but are ₹10-20 lower due to reduced logistics costs.
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
            question: "What is the gold rate in Pune today?",
            answer:
              `Today's gold rate in Pune is ₹${perGram24k.toLocaleString('en-IN')} per gram for 24K gold and ₹${perGram22k.toLocaleString('en-IN')} per gram for 22K gold. Prices are updated daily following Maharashtra bullion market.`,
          },
          {
            question: "Why does Pune gold rate change daily?",
            answer:
              "Pune gold prices fluctuate based on London spot prices, USD/INR exchange rate, and follow Mumbai market trends. Local demand during Gudi Padwa and wedding season also impacts prices.",
          },
          {
            question: "How is 22K different from 24K gold?",
            answer:
              "24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Pune jewellers prefer 22K for traditional Maharashtrian designs like Thushi and Vajratik.",
          },
          {
            question: "Does making charge affect final jewellery price?",
            answer:
              "Yes, making charges in Pune range from ₹190-480 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST. Laxmi Road offers competitive rates.",
          },
          {
            question: "Are Pune gold rates lower than Mumbai?",
            answer:
              "Yes, Pune rates are typically ₹10-20 lower than Mumbai due to lower overhead costs and reduced logistics expenses from being an inland city.",
          },
          {
            question: "Which is the best place to buy gold in Pune?",
            answer:
              "Laxmi Road (main market), FC Road, and Deccan area. For branded jewellery, visit PNG, Tanishq, or Waman Hari Pethe showrooms across Pune.",
          },
        ]}
        similarCities={["Mumbai", "Nashik", "Aurangabad", "Kolhapur"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

