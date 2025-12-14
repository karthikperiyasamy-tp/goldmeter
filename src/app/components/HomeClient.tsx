"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CitySelector from "./CitySelector";
import PriceHero from "./PriceHero";
import RateCard from "./RateCard";
import PriceChartWrapper from "./PriceChartWrapper";
import Last10DaysTable from "./Last10DaysTable";
import MonthStatistics from "./MonthStatistics";
import GoldArticle from "./GoldArticle";
import { type InternationalRate, type InternationalRates } from "@/lib/internationalRates";

export type RateResponse = {
  date: string;
  gold_24k: number;
  gold_22k: number;
  gold_18k?: number;
  silver_1kg?: number;
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

// Price change per 10g (today - yesterday)
export type PriceChange = {
  gold22k: number;
  gold24k: number;
  gold18k?: number;
  silver1kg?: number;
};

export type { InternationalRate, InternationalRates };

type HistoryRate = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg?: number | null;
  timestamp: number;
};

type HomeClientProps = {
  baseRates: RateResponse;
  cities: CityRate[];
  newsItems: NewsItem[];
  priceChange?: PriceChange;
  history?: HistoryRate[];
  internationalRates?: InternationalRates | null;
};

// Gram presets for quick cards (just the gram quantities)
const gramPresets = [
  { label: "1 gram", grams: 1 },
  { label: "8 gram", grams: 8 },
  { label: "10 gram", grams: 10 },
  { label: "100 gram", grams: 100 },
];

const silverPresets = [
  { label: "1 gram", grams: 1 },
  { label: "10 gram", grams: 10 },
  { label: "100 gram", grams: 100 },
  { label: "1 kg", grams: 1000 },
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

const formatNumber = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

export default function HomeClient({
  baseRates,
  cities,
  newsItems,
  priceChange = { gold22k: 0, gold24k: 0 },
  history = [],
  internationalRates = null,
}: HomeClientProps) {
  const router = useRouter();

  // Client-side fallback for city detection (when middleware IP headers are missing)
  useEffect(() => {
    const checkLocation = async () => {
      // Check if we've already checked location in this session/period
      const cookies = document.cookie;
      if (cookies.includes("geo_redirect_checked=true") || cookies.includes("preferredCity")) {
        return;
      }

      try {
        console.log("📍 Client-side detecting location...");
        const res = await fetch("/api/detect-city");
        const data = await res.json();

        if (data.success && data.detected && data.slug) {
          console.log(`✅ [HomeClient] Detected ${data.city}, redirecting...`);
          
          // Redirect to the detected city
          // No cookies are set here, so it re-detects every time unless session override is active
          router.push(`/${data.slug}`);
        } else {
           // Mark as checked even if failed (for 1 hour) so we don't spam API on every refresh
           console.log("⚠️ [HomeClient] Location detection failed or no city found.");
           document.cookie = `geo_redirect_checked=true; path=/; max-age=${3600}`;
        }
      } catch (error) {
        console.error("Location detection failed:", error);
      }
    };
    
    checkLocation();
  }, [router]);

  // Use India rates directly from baseRates for homepage
  const hero22k = baseRates.gold_22k;
  const hero24k = baseRates.gold_24k;
  const hero18k = baseRates.gold_18k || Math.round((hero24k * 18) / 24);
  const heroSilver = baseRates.silver_1kg || 0;

  const perGram22k = hero22k / 10;
  const perGram24k = hero24k / 10;
  const perGram18k = hero18k / 10;
  const perGramSilver = heroSilver / 1000;

  // Calculate change per gram from 10g price change
  const changePerGram22k = priceChange.gold22k / 10;
  const changePerGram24k = priceChange.gold24k / 10;
  const changePerGram18k = (priceChange.gold18k || 0) / 10;
  const changePerGramSilver = (priceChange.silver1kg || 0) / 1000;

  // Normalize history to ensure numbers (no nulls) for downstream components
  const normalizedHistory = (history || []).map((h) => ({
    date: h.date,
    gold22k: h.gold22k,
    gold24k: h.gold24k,
    gold18k: h.gold18k,
    silver1kg: h.silver1kg ?? 0,
    timestamp: h.timestamp,
  }));

  const defaultInternational: InternationalRates = {
    gold24k: [],
    gold22k: [],
    gold18k: [],
    lastUpdated: "",
    source: "",
  };

  const internationalData = internationalRates || defaultInternational;
  const hasInternationalData =
    internationalData.gold24k.length > 0 ||
    internationalData.gold22k.length > 0 ||
    internationalData.gold18k.length > 0;

  const internationalUpdatedLabel = internationalData.lastUpdated
    ? new Date(internationalData.lastUpdated).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const renderInternationalTable = (title: string, rates: InternationalRate[]) => (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 bg-amber-50/60 px-4 py-3">
        <p className="text-sm font-semibold text-charcoal">{title}</p>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          1 gram
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Country</th>
              <th className="px-4 py-2 text-left font-semibold">Price</th>
              <th className="px-4 py-2 text-left font-semibold">Price (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rates.map((row) => (
              <tr key={`${row.country}-${title}`}>
                <td className="px-4 py-3 font-semibold text-charcoal">{row.country}</td>
                <td className="px-4 py-3 text-slate-700">
                  {row.price !== null ? `${row.currencyCode} ${formatNumber.format(row.price)}` : "—"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {row.priceInr !== null ? `₹${formatINR.format(row.priceInr)}` : "—"}
                </td>
              </tr>
            ))}
            {rates.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-sm text-slate-500" colSpan={3}>
                  Data not available right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffdf7] text-charcoal">
      <PriceHero
        city="India"
        gold22k={hero22k}
        gold24k={hero24k}
        silver1kg={heroSilver}
        updated={baseRates.date}
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
            {gramPresets.map((preset) => (
              <RateCard
                key={`22k-${preset.label}`}
                label={preset.label}
                grams={preset.grams}
                price={Math.round(perGram22k * preset.grams)}
                change={Math.round(changePerGram22k * preset.grams)}
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
            {gramPresets.map((preset) => (
              <RateCard
                key={`24k-${preset.label}`}
                label={preset.label}
                grams={preset.grams}
                price={Math.round(perGram24k * preset.grams)}
                change={Math.round(changePerGram24k * preset.grams)}
              />
            ))}
          </div>
        </section>

        {/* 18K Quick Cards */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">18K Gold - Quick Cards</h3>
            <p className="text-sm text-slate-500">
              India reference price
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {gramPresets.map((preset) => (
              <RateCard
                key={`18k-${preset.label}`}
                label={preset.label}
                grams={preset.grams}
                price={Math.round(perGram18k * preset.grams)}
                change={Math.round(changePerGram18k * preset.grams)}
              />
            ))}
          </div>
        </section>

        {/* Silver Quick Cards */}
        {heroSilver > 0 && (
          <section id="silver-rate">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Silver - Quick Cards</h3>
              <p className="text-sm text-slate-500">
                India reference price
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {silverPresets.map((preset) => (
                <RateCard
                  key={`silver-${preset.label}`}
                  label={preset.label}
                  grams={preset.grams}
                  price={Math.round(perGramSilver * preset.grams)}
                  change={Math.round(changePerGramSilver * preset.grams)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Last 10 Days Table */}
        <section>
          <Last10DaysTable history={normalizedHistory} />
        </section>

        {/* Month Statistics */}
        <section>
          <MonthStatistics history={normalizedHistory} />
        </section>

        <section id="price-chart" className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <PriceChartWrapper
            city="India"
            currentGold22k={hero22k}
            currentGold24k={hero24k}
          />
        </section>

        <section id="international-rates" className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-charcoal">International Gold Prices</h3>
              <p className="text-sm text-slate-500">
                {internationalData.source || "GoodReturns"} · 1 gram prices
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Updated {internationalUpdatedLabel || "recently"}
            </p>
          </div>

          {hasInternationalData ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {renderInternationalTable("24K Gold", internationalData.gold24k)}
              {renderInternationalTable("22K Gold", internationalData.gold22k)}
              {renderInternationalTable("18K Gold", internationalData.gold18k)}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              International prices are temporarily unavailable. Please check back soon.
            </p>
          )}
        </section>
      </main>

      <CitySelector
        cities={cities.map((city) => ({
          name: city.name,
          gold22k: city.gold22k,
          updated: city.updated,
        }))}
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

      {/* Latest News - moved above Featured Articles */}
      {newsItems.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pt-10">
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
      )}

      {/* Featured Article - Gold Origins */}
      <GoldArticle />

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold">Gold Price Calculator</p>
            <p className="text-sm text-slate-500">
              Enter grams → get price with GST. Great before purchase.
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
              Estimate making + wastage charges; compare quotes.
            </p>
            <Link
              href="/wastage-calculator"
              className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Open
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold">Purity Converter</p>
            <p className="text-sm text-slate-500">22K ↔ 24K in one tap</p>
            <Link
              href="/purity-converter"
              className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Open
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold">Daily Recap (News)</p>
            <p className="text-sm text-slate-500">
              AI summary of gold headlines & market signals.
            </p>
            <Link
              href="/news/recap"
              className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
            >
              View recaps
            </Link>
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
    </div>
  );
}

