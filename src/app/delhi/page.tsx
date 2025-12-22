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
    title: `Delhi Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Delhi gold rate per gram for 22K and 24K gold. Check Chandni Chowk prices, making charges, and best jewellery shops.`,
    alternates: {
      canonical: "https://goldmeter.in/delhi",
    },
    openGraph: {
      title: `Delhi Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Delhi gold rate per gram. Updated daily from Delhi bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/delhi',
    },
  };
}

export default async function DelhiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Delhi", host);

  // Calculate per-gram prices for AIO answer block
  const perGram24k = Math.round((rates.gold24k || 0) / 10);
  const perGram22k = Math.round((rates.gold22k || 0) / 10);
  const perGram18k = Math.round(((rates.gold24k || 0) * 18) / 24 / 10);
  
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      <main className="min-h-screen bg-[#fffdf7]">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="mb-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in Delhi
            </h1>
            
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, the gold rate in Delhi is ₹{perGram24k.toLocaleString('en-IN')} per gram for 24K gold, ₹{perGram22k.toLocaleString('en-IN')} per gram for 22K gold, and ₹{perGram18k.toLocaleString('en-IN')} per gram for 18K gold.
            </p>
            
            <div className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800" data-ai-answer="true">
              Today&apos;s gold price in Delhi: ₹{perGram24k.toLocaleString('en-IN')}/g (24K) and ₹{perGram22k.toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={rates.dateISO}>{todayFormatted}</time>
            </p>
          </section>
        </article>
      </main>

      <CityPageShell
        city="Delhi"
        intro="Gold rate in Delhi today per gram: 22K & 24K live prices with Karol Bagh and Chandni Chowk trends, charts, and FAQs."
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
              "BIS Delhi Office (Chandni Chowk) and National Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹220 – ₹600 per gram for 22K ornaments in Chandni Chowk.",
          },
          {
            title: "Top jewellery hubs",
            description: "Chandni Chowk, Karol Bagh, and Connaught Place stores.",
          },
        ]}
        faqs={[
          {
            question: "Why is Delhi gold rate different?",
            answer:
              "Delhi rates include local taxes, high demand during wedding season, and proximity to import hubs.",
          },
          {
            question: "Is Chandni Chowk good for gold buying?",
            answer:
              "Yes, Chandni Chowk is India's largest gold market with competitive prices and wide variety.",
          },
          {
            question: "What are making charges in Delhi?",
            answer:
              "Making charges range from ₹220-₹600 per gram based on design.",
          },
        ]}
        similarCities={["Noida", "Gurgaon", "Faridabad", "Mumbai"]}
      />
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

