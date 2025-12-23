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
    title: `Kolkata Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Kolkata gold rate per gram for 22K and 24K gold. Check Bowbazar prices, Bengali jewellery making charges, and trusted shops.`,
    alternates: {
      canonical: "https://goldmeter.in/kolkata",
    },
    openGraph: {
      title: `Kolkata Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Kolkata gold rate per gram. Updated daily from Kolkata bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/kolkata',
    },
  };
}

export default async function KolkataPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Kolkata", host);

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
    "name": "Kolkata Gold Rate Today",
    "description": "Live gold price per gram in Kolkata for 22K and 24K gold, updated daily from Kolkata bullion market.",
    "creator": { "@type": "Organization", "name": "GoldMeter", "url": "https://goldmeter.in" },
    "temporalCoverage": rates.dateISO,
    "spatialCoverage": { "@type": "Place", "name": "Kolkata, West Bengal, India" },
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
              Gold Rate Today in Kolkata
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
            As per GoldMeter.in, as of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Kolkata is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            <meta name="author" content="GoldMeter" />
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Kolkata: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>

            {/* SEO: Expanded intro paragraph */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed">
              <p>
                The gold rate in Kolkata is updated daily based on international market prices, USD/INR currency movements, 
                and West Bengal Bullion Association rates. Kolkata, being East India&apos;s largest gold market, has unique 
                pricing influenced by traditional Bengali jewellery demand. These rates exclude making charges (₹200-550/gram) 
                and 3% GST.
              </p>
              <p className="mt-2">
                Bowbazar is Kolkata&apos;s historic gold hub with century-old jewellers specializing in traditional Bengali 
                designs like Shakha-Pola and temple jewellery. Gold demand peaks during Durga Puja, Dhanteras, and Bengali 
                wedding season. The city is known for intricate filigree work and lightweight contemporary designs.
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
        city="Kolkata"
        intro="Gold rate in Kolkata today per gram: 22K & 24K live prices with Bowbazar and Burrabazar trends, charts, and FAQs."
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
              "BIS Eastern Regional Office and Bowbazar Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹200 – ₹550 per gram for 22K ornaments in Bowbazar.",
          },
          {
            title: "Top jewellery hubs",
            description: "Bowbazar, Bagree Market, and New Market stores.",
          },
        ]}
        faqs={[
          {
            question: "What is the gold rate in Kolkata today?",
            answer:
              `Today's gold rate in Kolkata is ₹${perGram24k.toLocaleString('en-IN')} per gram for 24K gold and ₹${perGram22k.toLocaleString('en-IN')} per gram for 22K gold. Prices are updated daily from West Bengal bullion market.`,
          },
          {
            question: "Why does Kolkata gold rate change daily?",
            answer:
              "Kolkata gold prices fluctuate based on London spot prices, USD/INR exchange rate, and local demand during Durga Puja and wedding season. Bengali jewellery traditions influence premium designs.",
          },
          {
            question: "How is 22K different from 24K gold?",
            answer:
              "24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Kolkata jewellers use 22K for traditional Bengali designs like Shakha-Pola and filigree work.",
          },
          {
            question: "Does making charge affect final jewellery price?",
            answer:
              "Yes, making charges in Kolkata range from ₹200-550 per gram. Traditional Bengali designs cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.",
          },
          {
            question: "Are Kolkata gold rates competitive?",
            answer:
              "Kolkata rates are competitive with Mumbai and Delhi. Prices are typically ₹20-40 lower than South Indian cities. Bowbazar offers the best wholesale rates.",
          },
          {
            question: "Which is the best place to buy gold in Kolkata?",
            answer:
              "Bowbazar (oldest market), Bagree Market, New Market, and Gariahat. For branded jewellery, visit Senco, PC Chandra, or Tanishq showrooms across the city.",
          },
        ]}
        similarCities={["Siliguri", "Asansol", "Durgapur", "Patna"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

