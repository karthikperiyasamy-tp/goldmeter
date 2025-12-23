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
      <div className="bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Ahmedabad
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As per GoldMeter.in, as of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Ahmedabad is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            <meta name="author" content="GoldMeter" />
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Ahmedabad: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>

            {/* SEO: Expanded intro paragraph */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed">
              <p>
                The gold rate in Ahmedabad is updated daily based on international market rates, USD/INR currency movements, 
                and Gujarat Bullion Association pricing. Ahmedabad benefits from proximity to Surat&apos;s diamond and gold 
                wholesale market, making it one of the most competitive gold markets in India. These prices exclude making 
                charges (₹170-420/gram) and 3% GST.
              </p>
              <p className="mt-2">
                Manek Chowk is Ahmedabad&apos;s iconic jewellery market, known for traditional Gujarati designs and competitive 
                wholesale prices. The city&apos;s strong business community creates steady demand for gold as investment and 
                jewellery. Gold buying peaks during Dhanteras, Diwali, and wedding season (November-February).
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
            question: "What is the gold rate in Ahmedabad today?",
            answer:
              `Today's gold rate in Ahmedabad is ₹${perGram24k.toLocaleString('en-IN')} per gram for 24K gold and ₹${perGram22k.toLocaleString('en-IN')} per gram for 22K gold. Prices are updated daily from Gujarat bullion market.`,
          },
          {
            question: "Why does Ahmedabad gold rate change daily?",
            answer:
              "Ahmedabad gold prices fluctuate based on London spot prices, USD/INR exchange rate, and influence from Surat's wholesale market. Local demand during Dhanteras and wedding season also impacts prices.",
          },
          {
            question: "How is 22K different from 24K gold?",
            answer:
              "24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Ahmedabad jewellers prefer 22K for traditional Gujarati designs and daily-wear jewellery.",
          },
          {
            question: "Does making charge affect final jewellery price?",
            answer:
              "Yes, making charges in Ahmedabad range from ₹170-420 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST. Manek Chowk offers competitive rates.",
          },
          {
            question: "Are Ahmedabad gold rates lower than other cities?",
            answer:
              "Yes, Ahmedabad has competitive rates due to proximity to Surat's wholesale market. Prices are typically ₹20-40 lower than Mumbai and significantly lower than South Indian cities.",
          },
          {
            question: "Which is the best place to buy gold in Ahmedabad?",
            answer:
              "Manek Chowk (iconic market), Relief Road, and CG Road. For branded jewellery, visit Tribhovandas Bhimji Zaveri, Tanishq, or Kalyan showrooms across the city.",
          },
        ]}
        similarCities={["Surat", "Rajkot", "Vadodara", "Gandhinagar"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

