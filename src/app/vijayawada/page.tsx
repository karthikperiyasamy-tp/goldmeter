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
    title: `Vijayawada Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Vijayawada gold rate per gram for 22K and 24K gold. Check Governorpet prices, making charges, and trusted jewellers.`,
    alternates: {
      canonical: "https://goldmeter.in/vijayawada",
    },
    openGraph: {
      title: `Vijayawada Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Vijayawada gold rate per gram. Updated daily from Vijayawada bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/vijayawada',
    },
  };
}

export default async function VijayawadaPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Vijayawada", host);

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
    "name": "Vijayawada Gold Rate Today",
    "description": "Live gold price per gram in Vijayawada for 22K and 24K gold, updated daily from Vijayawada bullion market.",
    "creator": { "@type": "Organization", "name": "GoldMeter", "url": "https://goldmeter.in" },
    "temporalCoverage": rates.dateISO,
    "spatialCoverage": { "@type": "Place", "name": "Vijayawada, Andhra Pradesh, India" },
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
              Gold Rate Today in Vijayawada
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Vijayawada is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            <meta name="author" content="GoldMeter" />
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Vijayawada: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>

            {/* SEO: Expanded intro paragraph */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed">
              <p>
                The gold rate in Vijayawada is updated daily based on international market rates, USD/INR currency movements, 
                and Andhra Pradesh Bullion Association pricing. As Andhra Pradesh&apos;s commercial capital, Vijayawada offers 
                competitive gold rates similar to Hyderabad. These prices exclude making charges (₹160-400/gram) and 3% GST.
              </p>
              <p className="mt-2">
                Governorpet is Vijayawada&apos;s main jewellery hub, with established stores offering traditional Andhra 
                designs and temple jewellery. The city&apos;s strategic location makes it a regional gold trading center. 
                Gold demand peaks during Telugu festivals like Ugadi, Sankranti, and wedding season.
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
        city="Vijayawada"
        intro="Gold rate in Vijayawada today per gram: 22K & 24K live prices with Governorpet and Autonagar trends, charts, and FAQs."
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
              "Andhra Pradesh Hallmarking Center and Regional Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹160 – ₹400 per gram for 22K ornaments in Governorpet.",
          },
          {
            title: "Top jewellery hubs",
            description: "Governorpet, Besant Road, and Eluru Road stores.",
          },
        ]}
        faqs={[
          {
            question: "What is the gold rate in Vijayawada today?",
            answer:
              `Today's gold rate in Vijayawada is ₹${perGram24k.toLocaleString('en-IN')} per gram for 24K gold and ₹${perGram22k.toLocaleString('en-IN')} per gram for 22K gold. Prices are updated daily from Andhra Pradesh bullion market.`,
          },
          {
            question: "Why does Vijayawada gold rate change daily?",
            answer:
              "Vijayawada gold prices fluctuate based on London spot prices, USD/INR exchange rate, and regional demand during Telugu festivals like Ugadi and Sankranti.",
          },
          {
            question: "How is 22K different from 24K gold?",
            answer:
              "24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Vijayawada jewellers prefer 22K for traditional Andhra temple jewellery designs.",
          },
          {
            question: "Does making charge affect final jewellery price?",
            answer:
              "Yes, making charges in Vijayawada range from ₹160-400 per gram - lower than metro cities. Final price = Gold Rate × Weight + Making Charges + 3% GST.",
          },
          {
            question: "Are Vijayawada gold rates similar to Hyderabad?",
            answer:
              "Yes, Vijayawada rates are typically within ₹10-20 of Hyderabad prices, making it a convenient option for Andhra Pradesh residents.",
          },
          {
            question: "Which is the best place to buy gold in Vijayawada?",
            answer:
              "Governorpet (main market), Besant Road, and Eluru Road. For branded jewellery, visit Tanishq, Kalyan, or local stores like Manepally and Kirtilals.",
          },
        ]}
        similarCities={["Hyderabad", "Guntur", "Visakhapatnam", "Tirupati"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

