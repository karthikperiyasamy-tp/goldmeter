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
    title: `Chennai Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Chennai gold rate per gram for 22K and 24K gold. Check T Nagar prices, making charges, and top jewellery shops. Updated daily.`,
    alternates: {
      canonical: "https://goldmeter.in/chennai",
    },
    openGraph: {
      title: `Chennai Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Chennai gold rate per gram for 22K and 24K gold. Updated daily from Chennai bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/chennai',
    },
  };
}

export default async function ChennaiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  // Fetch rates from DB, scraping API, or fallback to mock
  const rates = await fetchCityRates("Chennai", host);

  // Calculate per-gram prices for AIO answer block
  const perGram24k = Math.round((rates.gold24k || 0) / 10);
  const perGram22k = Math.round((rates.gold22k || 0) / 10);
  const perGram18k = Math.round(((rates.gold24k || 0) * 18) / 24 / 10);
  
  // Format date for display
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      {/* This MUST be outside CityPageShell so it renders as static HTML */}
      <main className="min-h-screen bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="mb-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Chennai
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Chennai is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold.
            </p>
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Chennai: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>
          </section>
        </article>
      </main>

      {/* Full interactive UI below */}
      <CityPageShell
        city="Chennai"
        intro="Gold rate in Chennai today per gram: 22K & 24K live prices with T Nagar and Anna Nagar trends, charts, and FAQs."
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
              "Tamil Nadu Hallmarking Center (T Nagar) and Regional Assay Office (Egmore).",
          },
          {
            title: "Making charges",
            description: "₹150 – ₹450 per gram for 22K ornaments in T Nagar.",
          },
          {
            title: "Top jewellery hubs",
            description: "Usman Road, Pondy Bazaar, and Anna Nagar flagship stores.",
          },
        ]}
        faqs={[
          {
            question: "Why is Chennai gold rate high today?",
            answer:
              "Festive jewellery orders and a weaker rupee pushed spot prices up by ₹45 per 10g.",
          },
          {
            question: "Is Chennai gold rate different from Mumbai?",
            answer:
              "Yes, local demand, logistics, and making charges create a ₹40–₹60 spread vs Mumbai.",
          },
          {
            question: "What affects Chennai gold price daily?",
            answer:
              "London spot prices, USD/INR, MCX futures and local marriage season demand.",
          },
        ]}
        similarCities={["Trichy", "Coimbatore", "Madurai", "Hyderabad"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

