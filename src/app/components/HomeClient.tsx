"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CitySelector from "./CitySelector";
import Footer from "./Footer";
import PriceHero from "./PriceHero";
import RateCard from "./RateCard";
import RatesModal from "./RatesModal";
import TopBar from "./TopBar";
import PriceChart from "./PriceChart";
import { generateMockChartData } from "../utils/chartDataHelpers";

export type RateResponse = {
  date: string;
  gold_24k: number;
  gold_22k: number;
  city: string;
};

export type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
  updated: string;
  change: number;
};

export type NewsItem = {
  id: number;
  title: string;
  date: string;
  summary: string;
  city?: string;
  slug: string;
};

type HomeClientProps = {
  baseRates: RateResponse;
  cities: CityRate[];
  newsItems: NewsItem[];
};

const quickPresets22k = [
  { label: "1 gram", grams: 1, change: 45 },
  { label: "8 gram", grams: 8, change: -30 },
  { label: "10 gram", grams: 10, change: 45 },
  { label: "100 gram", grams: 100, change: -120 },
];

const quickPresets24k = [
  { label: "1 gram", grams: 1, change: -30 },
  { label: "8 gram", grams: 8, change: 20 },
  { label: "10 gram", grams: 10, change: -30 },
  { label: "100 gram", grams: 100, change: 150 },
];

const cityListBlock = [
  "Chennai",
  "Bangalore",
  "Mumbai",
  "Coimbatore",
  "Delhi",
  "Hyderabad",
];

const formatINR = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

type GoldRate = {
  gold22k: number | null;
  gold24k: number | null;
  error?: string;
  timestamp: string;
};

type CityRates = {
  [city: string]: GoldRate;
};

type ScrapedRatesData = {
  india: {
    gold22k: number | null;
    gold24k: number | null;
    error?: string;
    timestamp: string;
  };
  cities: CityRates;
};

export default function HomeClient({
  baseRates,
  cities,
  newsItems,
}: HomeClientProps) {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState("India"); // Default to India on homepage
  const [chartRange, setChartRange] = useState<"7D" | "30D" | "1Y">("7D");
  const [modalOpen, setModalOpen] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedRatesData | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-detect user's city and redirect
  useEffect(() => {
    const detectAndRedirect = async () => {
      console.log("🏠 [HomeClient] Checking city auto-redirect...");
      
      // Check if user has already been redirected in this session
      const hasRedirected = sessionStorage.getItem("cityAutoRedirected");
      if (hasRedirected) {
        console.log("⏭️  [HomeClient] Already redirected in this session, skipping");
        return;
      }

      try {
        console.log("📡 [HomeClient] Calling /api/detect-city...");
        const response = await fetch("/api/detect-city");
        const data = await response.json();
        
        console.log("📍 [HomeClient] Detect-city response:", data);

        if (data.success && data.detected && data.slug) {
          console.log(`✈️  [HomeClient] Redirecting to /${data.slug}...`);
          // Mark as redirected and navigate to city page
          sessionStorage.setItem("cityAutoRedirected", "true");
          router.push(`/${data.slug}`);
        } else {
          console.log("🌏 [HomeClient] No city detected, staying on India homepage");
        }
        // If not detected or not in our list, stay on India page (do nothing)
      } catch (error) {
        console.error("❌ [HomeClient] City detection failed:", error);
        // On error, stay on India page
      }
    };

    detectAndRedirect();
  }, [router]);

  const fetchGoldRates = async () => {
    setModalOpen(true);
    setLoading(true);
    setScrapedData(null);

    try {
      const response = await fetch("/api/scrape-rates");
      const result = await response.json();

      if (result.success) {
        setScrapedData(result.data);
      } else {
        console.error("Failed to fetch rates:", result.error);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use India rates directly from baseRates for homepage
  const hero22k = baseRates.gold_22k;
  const hero24k = baseRates.gold_24k;

  const perGram22k = hero22k / 10;
  const perGram24k = hero24k / 10;

  // Generate chart data based on current prices and selected range
  // TODO: Replace with fetchChartDataFromDB when database is integrated
  const chartData = useMemo(
    () => generateMockChartData(hero22k, hero24k, chartRange, "India"),
    [hero22k, hero24k, chartRange]
  );

  return (
    <div className="min-h-screen bg-[#fffdf7] text-charcoal">
      <TopBar city={activeCity} onCityChange={setActiveCity} />
      <PriceHero
        city="India"
        gold22k={hero22k}
        gold24k={hero24k}
        updated={baseRates.date}
      />

      {/* Test Button for Web Scraping */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                🧪 Test Web Scraping Feature
              </p>
              <p className="text-xs text-amber-700">
                Fetch real-time gold rates from GoodReturns for 10+ cities
              </p>
            </div>
            <button
              onClick={fetchGoldRates}
              disabled={loading}
              className="rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-soft hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Fetching..." : "Fetch Gold Rates"}
            </button>
          </div>
        </div>
      </div>

      <RatesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={scrapedData}
        loading={loading}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8">
        {/* 22K Quick Cards */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">22K Gold - Quick Cards</h3>
            <p className="text-sm text-slate-500">
              India reference price
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickPresets22k.map((preset) => (
              <RateCard
                key={`22k-${preset.label}`}
                label={preset.label}
                grams={preset.grams}
                price={Math.round(perGram22k * preset.grams)}
                change={preset.change}
              />
            ))}
          </div>
        </section>

        {/* 24K Quick Cards */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">24K Gold - Quick Cards</h3>
            <p className="text-sm text-slate-500">
              India reference price
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickPresets24k.map((preset) => (
              <RateCard
                key={`24k-${preset.label}`}
                label={preset.label}
                grams={preset.grams}
                price={Math.round(perGram24k * preset.grams)}
                change={preset.change}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Price Trend</h3>
              <p className="text-sm text-slate-500">
                Historical price movement · Per 10 grams
              </p>
            </div>
            <div className="flex gap-2 rounded-full bg-amber-50 p-1 text-sm font-semibold">
              {["7D", "30D", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range as "7D" | "30D" | "1Y")}
                  className={`rounded-full px-4 py-1 ${
                    chartRange === range
                      ? "bg-white text-amber-600 shadow-soft"
                      : "text-slate-500"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 h-80 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-4">
            <PriceChart data={chartData} range={chartRange} />
          </div>
        </section>
      </main>

      <CitySelector
        cities={cities.map((city) => ({
          name: city.name,
          gold22k: city.gold22k,
          updated: city.updated,
        }))}
        onSelect={setActiveCity}
      />

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold">Gold Rates by City</h3>
          <div className="mt-4 divide-y divide-slate-100">
            {cityListBlock.map((city) => (
              <div
                key={city}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-charcoal">
                    Gold rate in {city}
                  </p>
                  <p className="text-slate-500">
                    ₹{formatINR.format(hero22k)} · Updated today
                  </p>
                </div>
                <Link
                  href={`/${city.toLowerCase()}`}
                  className="text-amber-600"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold">Gold Price Calculator</p>
            <p className="text-sm text-slate-500">
              Enter grams → get price with GST
            </p>
            <Link
              href="/calculator"
              className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Open
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold">Jewellery Wastage Tool</p>
            <p className="text-sm text-slate-500">
              Estimate making + wastage charges
            </p>
            <button className="mt-4 rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-600">
              Coming soon
            </button>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold">Purity Converter</p>
            <p className="text-sm text-slate-500">22K ↔ 24K in one tap</p>
            <button className="mt-4 rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-600">
              Coming soon
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Latest News</h3>
            <Link href="/news" className="text-sm font-semibold text-amber-600">
              View all →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-charcoal">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.date} · {item.city ?? "India"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.summary}
                    </p>
                  </div>
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-sm font-semibold text-amber-600"
                  >
                    Read
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
            <p className="text-sm font-semibold text-amber-700">
              Gold Loan Offers
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Compare low-interest gold loans from trusted NBFCs.
            </p>
            <button className="mt-4 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
              Explore offers
            </button>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-soft">
            <p className="text-sm font-semibold text-amber-700">
              Nearby Jewellery Shops
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Discover hallmark-certified stores rated by locals.
            </p>
            <button className="mt-4 rounded-full border border-white bg-white/70 px-4 py-2 text-sm font-semibold text-amber-700">
              View shops
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <div className="fixed bottom-6 left-1/2 z-40 w-full max-w-xs -translate-x-1/2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-soft backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <button
            className="font-semibold text-amber-600"
            onClick={() => setActiveCity(cities[0]?.name ?? "Chennai")}
          >
            Home
          </button>
          <Link href="/chennai" className="text-slate-500">
            City
          </Link>
          <Link href="/calculator" className="text-slate-500">
            Calc
          </Link>
          <Link href="/news" className="text-slate-500">
            News
          </Link>
        </div>
      </div>
    </div>
  );
}

