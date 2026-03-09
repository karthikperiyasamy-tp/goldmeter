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
import { PUBLISHED_ARTICLES, ARTICLE_CATEGORIES } from "@/lib/articles";
import { type InternationalRate, type InternationalRates } from "@/lib/internationalRates";
import { getAllJewellers } from "@/lib/jewellerConfig";

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

export type RecapItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  sourcesCount: number;
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
  recentRecaps?: RecapItem[];
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
  recentRecaps = [],
}: HomeClientProps) {
  const router = useRouter();

  // Client-side fallback for city detection (when middleware IP headers are missing)
  useEffect(() => {
    const checkLocation = async () => {
      // Check if user explicitly chose to stay on India page
      // This happens when user clicks "Back to India" or GoldMeter logo from a city page
      const cookies = document.cookie;
      const urlParams = new URLSearchParams(window.location.search);
      
      // IMPORTANT: If user has stayOnIndia cookie OR came via ?noredirect=true, DO NOT redirect
      if (cookies.includes("stayOnIndia=true")) {
        console.log("🚫 [HomeClient] User has stayOnIndia cookie, skipping redirect");
        return;
      }
      
      // If ?noredirect=true is in URL, set the cookie and skip redirect
      if (urlParams.has("noredirect")) {
        console.log("🚫 [HomeClient] noredirect param detected, setting session cookie and skipping redirect");
        // No max-age = session cookie - expires when browser closes
        document.cookie = `stayOnIndia=true; path=/; SameSite=Lax`;
        // Clean up URL without reload
        window.history.replaceState({}, '', '/');
        return;
      }
      
      // Also skip if we've already checked location recently
      if (cookies.includes("geo_redirect_checked=true") || cookies.includes("preferredCity")) {
        return;
      }

      try {
        console.log("📍 Client-side detecting location...");
        const res = await fetch("/api/detect-city");
        const data = await res.json();

        if (data.success && data.detected && data.slug) {
          console.log(`✅ [HomeClient] Detected ${data.city}, redirecting...`);
          router.push(`/gold-rate/${data.slug}`);
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
        priceChange={priceChange}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8">
        {/* SEO: Explanatory Text Block for AI/Search Context */}
        <section className="rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 to-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-amber-800 mb-3">Understanding Gold Prices in India</h2>
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>What do these prices mean?</strong> The gold rates shown above represent the current market price for 10 grams of gold in India. 
              22K gold (91.6% purity) is most commonly used for jewellery, while 24K gold (99.9% purity) is considered investment-grade pure gold. 
              18K gold (75% purity) is often used for diamond-studded jewellery due to its durability.
            </p>
            <p>
              <strong>How are prices determined?</strong> Indian gold prices are influenced by international spot prices (London Bullion Market), 
              USD/INR exchange rates, import duties (currently 15%), GST (3%), and local demand. Prices can vary ₹50-200 between cities due to 
              transportation costs and regional demand patterns.
            </p>
            <p>
              <strong>How often are prices updated?</strong> GoldMeter updates gold rates daily, tracking morning opening prices from major bullion 
              markets. Intraday fluctuations may occur based on international market movements. For buying decisions, always confirm with your 
              jeweller as retail prices include making charges (8-25%) and GST.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/calculator" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              Calculate jewellery cost →
            </Link>
            <Link href="/news" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              Latest gold news →
            </Link>
          </div>
        </section>

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
                {internationalData.source || "GoldMeter"} · 1 gram prices
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

      {/* City Comparison Table */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">🏙️ City-wise Gold Rate Comparison</h3>
            <p className="text-xs text-slate-500">Per 10 grams</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 font-semibold text-slate-700">City</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">22K Gold</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right">24K Gold</th>
                  <th className="pb-3 font-semibold text-slate-700 text-right hidden sm:table-cell">Difference</th>
                  <th className="pb-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cities.slice(0, 10).map((city) => {
                  const diff22k = city.gold22k - hero22k;
                  return (
                    <tr key={city.name} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3 font-medium text-charcoal">{city.name}</td>
                      <td className="py-3 text-right font-semibold">₹{formatINR.format(city.gold22k)}</td>
                      <td className="py-3 text-right font-semibold">₹{formatINR.format(city.gold24k)}</td>
                      <td className={`py-3 text-right hidden sm:table-cell ${diff22k > 0 ? 'text-rose-500' : diff22k < 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {diff22k === 0 ? '—' : `${diff22k > 0 ? '+' : ''}₹${formatINR.format(diff22k)}`}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/gold-rate/${city.name.toLowerCase()}`}
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          View gold rate →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            💡 Difference shown is compared to India average. Prices vary due to local demand, logistics, and taxes.
          </p>
        </div>
      </section>

      {/* Latest News - moved above Featured Articles */}
      {newsItems.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pt-10">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Latest News</h3>
              <Link href="/news" className="text-sm font-semibold text-amber-600">
                View all gold news →
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
                      Read article
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Market Recaps - SEO internal linking */}
      {recentRecaps.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pt-6">
          <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-semibold text-charcoal">Daily Market Recaps</h3>
              </div>
              <Link href="/news/recap" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                View all daily recaps →
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {recentRecaps.slice(0, 6).map((recap) => (
                <Link
                  key={recap.slug}
                  href={`/news/recap/${recap.slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-amber-100 bg-white p-4 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    📊
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">{recap.date}</p>
                    <p className="text-sm font-semibold text-charcoal line-clamp-2 group-hover:text-amber-700 mt-0.5">
                      {recap.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{recap.sourcesCount} sources</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Jewellers Section */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <h3 className="text-lg font-semibold text-charcoal">Popular Jewellers in India</h3>
            </div>
            <Link href="/jewellers" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              View all jewellers →
            </Link>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Compare making charges, exchange policies, and find trusted jewellers across India.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {getAllJewellers()
              .filter((j) => j.type === 'national')
              .slice(0, 8)
              .map((jeweller) => (
                <Link
                  key={jeweller.slug}
                  href={`/jewellers/${jeweller.slug}`}
                  className="group rounded-2xl border border-amber-100 bg-white p-4 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-charcoal group-hover:text-amber-700">
                    {jeweller.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {jeweller.headquarters}
                  </p>
                  <div className="mt-2 rounded-lg bg-amber-50 px-2 py-1">
                    <p className="text-xs text-amber-800 font-medium">
                      Making: {jeweller.makingChargesRange.split(' - ')[0]}+
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          <div className="mt-4 pt-4 border-t border-amber-100">
            <p className="text-xs text-slate-500">
              💡 Making charges vary by design complexity. Always ask for a detailed bill breakdown before purchasing.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Articles */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-charcoal">Gold Guides & Articles</h2>
            <Link
              href="/articles"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              View all articles →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLE_CATEGORIES.map((cat) => {
              const catArticles = PUBLISHED_ARTICLES.filter((a) => a.category === cat.key).slice(0, 3);
              return (
                <div key={cat.key} className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                  <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </h3>
                  <ul className="space-y-2">
                    {catArticles.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/articles/${a.slug}`}
                          className="text-sm text-amber-700 font-medium hover:text-amber-600 transition-colors"
                        >
                          → {a.shortTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Homepage FAQ Section for SEO */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">❓ Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal flex justify-between items-center">
                Why do gold prices change daily?
                <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Gold prices fluctuate based on international spot prices (set in London), USD/INR exchange rates, 
                central bank policies, inflation expectations, and geopolitical events. In India, import duties and 
                local demand (especially during wedding/festival seasons) also impact prices.
              </p>
            </details>
            <details className="group rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal flex justify-between items-center">
                What is the difference between 22K and 24K gold?
                <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                24K gold is 99.9% pure gold, ideal for investment (coins, bars). 22K gold is 91.6% pure with 8.4% 
                alloy metals for strength, making it perfect for jewellery. 22K is more durable for daily wear while 
                24K is softer and can scratch easily.
              </p>
            </details>
            <details className="group rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal flex justify-between items-center">
                How is jewellery price calculated from gold rate?
                <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Final jewellery price = (Gold Rate × Weight) + Making Charges + 3% GST. Making charges range from 
                8-25% depending on design complexity. Use our <Link href="/calculator" className="text-amber-600 hover:underline">Price Calculator</Link> for accurate estimates.
              </p>
            </details>
            <details className="group rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal flex justify-between items-center">
                Is gold rate same across all cities in India?
                <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                No, gold prices vary ₹50-200 per 10g between cities due to transportation costs, local taxes, 
                jeweller associations, and regional demand. Southern cities (Chennai, Bangalore) often have slightly 
                higher rates due to stronger gold buying traditions.
              </p>
            </details>
            <details className="group rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal flex justify-between items-center">
                What is the best time to buy gold in India?
                <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Gold prices typically dip during monsoon season (July-August) when demand is lower. Avoid buying 
                during peak festival seasons (Dhanteras, Akshaya Tritiya) when prices spike 3-6%. Track prices for 
                2-3 weeks before making large purchases.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Festive Gold Rate Predictions */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎉</span>
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Festive Season Gold Rate Outlook</h3>
              <p className="text-sm text-slate-600">What to expect during upcoming festivals</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 border border-amber-100">
              <p className="text-xs text-amber-600 font-semibold uppercase">Pongal / Sankranti</p>
              <p className="text-sm font-medium text-charcoal mt-1">January 2026</p>
              <p className="text-xs text-slate-500 mt-1">Traditionally stable prices. Good for buying as demand is moderate.</p>
              <p className="text-xs text-emerald-600 mt-2">💡 Expected: Stable to +2%</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-amber-100">
              <p className="text-xs text-amber-600 font-semibold uppercase">Akshaya Tritiya</p>
              <p className="text-sm font-medium text-charcoal mt-1">May 2026</p>
              <p className="text-xs text-slate-500 mt-1">Peak buying season. Prices typically rise 3-5% before the date.</p>
              <p className="text-xs text-rose-500 mt-2">⚠️ Expected: +3-5% spike</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-amber-100">
              <p className="text-xs text-amber-600 font-semibold uppercase">Dhanteras / Diwali</p>
              <p className="text-sm font-medium text-charcoal mt-1">October 2026</p>
              <p className="text-xs text-slate-500 mt-1">Highest demand period. Book early for better making charges.</p>
              <p className="text-xs text-rose-500 mt-2">⚠️ Expected: +4-6% spike</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            💡 <strong>Tip:</strong> Buy gold 2-3 weeks before major festivals for better prices. Avoid last-minute purchases during peak demand.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h3 className="text-lg font-semibold mb-4">🧮 Gold Calculators & Tools</h3>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
          <Link href="/calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
            <span className="text-2xl">🧮</span>
            <p className="text-sm font-semibold mt-2">Price Calculator</p>
            <p className="text-xs text-slate-500">Get price with GST</p>
          </Link>
          <Link href="/wastage-calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
            <span className="text-2xl">💎</span>
            <p className="text-sm font-semibold mt-2">Wastage Tool</p>
            <p className="text-xs text-slate-500">Making charges</p>
          </Link>
          <Link href="/purity-converter" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
            <span className="text-2xl">⚖️</span>
            <p className="text-sm font-semibold mt-2">Purity Converter</p>
            <p className="text-xs text-slate-500">22K ↔ 24K</p>
          </Link>
          <Link href="/investment-calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
            <span className="text-2xl">📈</span>
            <p className="text-sm font-semibold mt-2">Gold Investment</p>
            <p className="text-xs text-slate-500">Gold SIP returns</p>
          </Link>
          <Link href="/hallmark-guide" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-soft hover:border-amber-300 transition-colors">
            <span className="text-2xl">🔍</span>
            <p className="text-sm font-semibold mt-2">Hallmark Verifier</p>
            <p className="text-xs text-slate-500">Check gold purity</p>
          </Link>
        </div>

        <h3 className="text-lg font-semibold mb-4 mt-8">💰 Financial Calculators</h3>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
          <Link href="/sip-calculator" className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-soft hover:border-emerald-200 transition-colors">
            <span className="text-2xl">📊</span>
            <p className="text-sm font-semibold mt-2">SIP Calculator</p>
            <p className="text-xs text-slate-500">Mutual fund SIP</p>
          </Link>
          <Link href="/sip-calculator-with-step-up" className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-soft hover:border-emerald-200 transition-colors">
            <span className="text-2xl">📈</span>
            <p className="text-sm font-semibold mt-2">Step-up SIP</p>
            <p className="text-xs text-slate-500">SIP with yearly increase</p>
          </Link>
          <Link href="/swp-calculator-with-inflation" className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-soft hover:border-emerald-200 transition-colors">
            <span className="text-2xl">💸</span>
            <p className="text-sm font-semibold mt-2">SWP Calculator with Inflation</p>
            <p className="text-xs text-slate-500">Withdrawal plan with inflation</p>
          </Link>
          <Link href="/gold-loan-calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
            <span className="text-2xl">🏦</span>
            <p className="text-sm font-semibold mt-2">Gold Loan</p>
            <p className="text-xs text-slate-500">Loan against gold</p>
          </Link>
          <Link href="/wedding-gold-planner" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
            <span className="text-2xl">💍</span>
            <p className="text-sm font-semibold mt-2">Wedding Planner</p>
            <p className="text-xs text-slate-500">Plan wedding gold</p>
          </Link>
          <Link href="/portfolio" className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-soft hover:border-emerald-200 transition-colors">
            <span className="text-2xl">📂</span>
            <p className="text-sm font-semibold mt-2">Gold Portfolio</p>
            <p className="text-xs text-slate-500">Track gold investments</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/gold-loan-calculator" className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold text-amber-700">
              🏦 Gold Loan Calculator
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Check how much loan you can get against your gold jewellery.
            </p>
            <span className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
              Calculate now
            </span>
          </Link>
          <Link href="/wedding-gold-planner" className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-soft hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold text-amber-700">
              💍 Wedding Gold Planner
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Plan gold jewellery for bride & groom with budget estimates.
            </p>
            <span className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
              Start planning
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

