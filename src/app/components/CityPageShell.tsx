"use client";

import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import RateCard from "./RateCard";
import PriceChartWrapper from "./PriceChartWrapper";
import Last10DaysTable from "./Last10DaysTable";
import MonthStatistics from "./MonthStatistics";
import StructuredData from "./StructuredData";
import CityLocalSEOBlock from "./CityLocalSEOBlock";
import ShareButtons from "./ShareButtons";
import { GOLD_RATE_CITIES, SILVER_RATE_CITIES } from "@/lib/cities";
import { getAllJewellers, type JewellerConfig } from "@/lib/jewellerConfig";
import { getCityMarketData } from "@/lib/cityMarketData";
import { useTranslations } from "next-intl";
import type { GoldPeriodPctChanges } from "@/lib/goldRatePeriodChanges";

type LocalInfo = {
  title: string;
  description: string;
};

type FAQ = {
  question: string;
  answer: string;
};

// Price change per 10g (today - yesterday)
export type PriceChange = {
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg?: number;
};

// Input history (can include nulls from DB/scrape)
export type HistoryRateInput = {
  date: string;
  gold22k: number | null;
  gold24k: number | null;
  gold18k: number | null;
  silver1kg?: number | null;
  timestamp: number;
};

// Normalized history used by child components (non-null numbers)
type HistoryRate = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg?: number;
  timestamp: number;
};

type CityPageShellProps = {
  city: string;
  updated: string;
  gold22k: number | null;
  gold24k: number | null;
  gold18k?: number | null; // Optional for backward compatibility during migration
  silver1kg?: number | null;
  priceChange?: PriceChange; // Dynamic price change from DB
  /** % vs yesterday / ~7d / ~30d (24K per 10g chips); computed on server for city gold pages */
  periodPctChanges: GoldPeriodPctChanges;
  history?: HistoryRateInput[];
  localInfo: LocalInfo[];
  faqs: FAQ[];
  similarCities?: string[]; // Deprecated - now using shared GOLD_RATE_CITIES config
  intro?: string;
  dateISO?: string; // ISO date for structured data freshness
  hideAnswerBlock?: boolean; // Hide the AIO answer block if server-rendered version exists
  children?: React.ReactNode; // City-specific static content for SEO
};

const inr = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

// Quick presets for gram cards
const quickPresets = [
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

function GoldPeriodChip({ label, pct }: { label: string; pct: number | null }) {
  if (pct === null || !Number.isFinite(pct)) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="ml-1.5 tabular-nums">—</span>
      </span>
    );
  }
  const up = pct > 0;
  const down = pct < 0;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums ${
        up
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : down
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
      title={`${label}: ${pct >= 0 ? "+" : ""}${pct.toFixed(2)}% (24K / 10g)`}
    >
      <span className="font-medium opacity-90">{label}</span>
      <span className="ml-1.5">
        {pct > 0 ? "+" : ""}
        {pct.toFixed(1)}%
      </span>
    </span>
  );
}

export default function CityPageShell({
  city,
  updated,
  gold22k,
  gold24k,
  gold18k,
  silver1kg,
  priceChange = { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 },
  periodPctChanges,
  history = [],
  localInfo,
  faqs,
  similarCities: _similarCities, // Deprecated - kept for backward compatibility
  intro,
  dateISO,
  hideAnswerBlock = false,
  children,
}: CityPageShellProps) {
  const router = useRouter();
  const t = useTranslations("goldRate");
  const tc = useTranslations("common");

  // Handle "Back to India" click - uses noredirect param to bypass geo-redirect
  const handleBackToIndia = () => {
    router.push("/?noredirect=true");
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Calculate 18K if not provided
  const safeGold24k = gold24k || 0;
  const safeGold22k = gold22k || 0;
  const finalGold18k = gold18k || Math.round((safeGold24k * 18) / 24);

  // Calculate per gram prices
  const perGram22k = safeGold22k / 10;
  const perGram24k = safeGold24k / 10;
  const perGram18k = finalGold18k / 10;
  const perGramSilver = silver1kg ? silver1kg / 1000 : 0;

  // Calculate change per gram from 10g price change
  const changePerGram22k = (priceChange.gold22k || 0) / 10;
  const changePerGram24k = (priceChange.gold24k || 0) / 10;
  const changePerGram18k = (priceChange.gold18k || 0) / 10;
  const changePerGramSilver = (priceChange.silver1kg || 0) / 1000;

  const normalizedHistory: HistoryRate[] = (history || []).map((h) => ({
    date: h.date,
    gold22k: h.gold22k ?? 0,
    gold24k: h.gold24k ?? 0,
    gold18k: h.gold18k ?? Math.round(((h.gold24k ?? 0) * 18) / 24),
    silver1kg: h.silver1kg ?? 0,
    timestamp: h.timestamp ?? Date.now(),
  }));

  const enhancedFaqs: FAQ[] = [
    {
      question: `What is the gold rate in ${city} today per gram?`,
      answer: `Today's ${city} gold rate per gram is ₹${Math.round(perGram22k)} for 22K and ₹${Math.round(perGram24k)} for 24K. Updated daily by GoldMeter.`,
    },
    ...faqs,
  ];

  const heroIntro =
    intro ||
    `Gold rate in ${city} today per gram: ₹${Math.round(perGram22k)} (22K) / ₹${Math.round(perGram24k)} (24K). Updated ${updated}. Track daily changes, compare charts, and use calculators below.`;

  // Generate today's date in readable format for AIO
  const now = new Date();
  const todayFormatted = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // ISO datetime for structured freshness signal (AI loves this format)
  const isoDateTime = now.toISOString();
  const isoDate = dateISO || isoDateTime.split('T')[0];
  
  // Formatted time for display
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  // Price direction indicator for freshness
  const priceDirection = priceChange.gold24k > 0 ? '↑' : priceChange.gold24k < 0 ? '↓' : '→';
  const priceDirectionText = priceChange.gold24k > 0 
    ? `up ₹${Math.abs(priceChange.gold24k)}` 
    : priceChange.gold24k < 0 
      ? `down ₹${Math.abs(priceChange.gold24k)}` 
      : 'unchanged';

  // Get popular jewellers for sidebar (mix of national and regional based on city)
  const getPopularJewellers = (): JewellerConfig[] => {
    const allJewellers = getAllJewellers();
    const cityLower = city.toLowerCase();
    
    // Get jewellers that have this city in their cityLinks
    const jewellersInCity = allJewellers.filter((j) =>
      j.cityLinks.some((c) => c.slug === cityLower)
    );
    
    // If we have jewellers for this city, prioritize them
    if (jewellersInCity.length >= 4) {
      return jewellersInCity.slice(0, 10); // Show up to 10 jewellers
    }
    
    // Otherwise, show national chains + some regional
    const national = allJewellers.filter((j) => j.type === 'national').slice(0, 6);
    const regional = allJewellers.filter((j) => j.type === 'regional').slice(0, 4);
    return [...national, ...regional];
  };
  
  const popularJewellers = getPopularJewellers();

  // Sidebar component for Top Cities (reusable)
  const TopCitiesSidebar = () => (
    <aside className="space-y-6">
      {/* Gold Guides & Articles — prominent for ad network approval + SEO */}
      <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-soft mt-1">
        <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2 mb-1">
          <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
          📚 {t("goldGuidesArticles")}
        </h3>
        <ul className="mt-4 space-y-2">
          <li>
            <Link href="/articles/gold-origins" className="block py-1 text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              → Where Does Gold Come From?
            </Link>
          </li>
          <li>
            <Link href="/articles/gold-special" className="block py-1 text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              → What Makes Gold So Special?
            </Link>
          </li>
          <li>
            <Link href="/articles/gold-hedge" className="block py-1 text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              → Gold as Inflation Hedge
            </Link>
          </li>
          <li>
            <Link href="/articles/gold-premiums" className="block py-1 text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              → Spot Prices &amp; Premiums
            </Link>
          </li>
          <li>
            <Link href="/articles/gold-hallmarking" className="block py-1 text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              → Gold Hallmarking in India
            </Link>
          </li>
        </ul>
        <Link
          href="/articles"
          className="mt-4 block text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {tc("viewAllArticles")}
        </Link>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-soft">
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          {t("goldRateTopCities")}
        </h3>
        <ul className="mt-4 space-y-1">
          {GOLD_RATE_CITIES.map((cityItem) => {
            const isCurrentCity = cityItem.toLowerCase() === city.toLowerCase();
            return (
              <li key={cityItem}>
                <Link
                  href={`/gold-rate/${cityItem.toLowerCase()}`}
                  className={`block py-1.5 text-sm transition-colors ${
                    isCurrentCity 
                      ? 'text-amber-700 font-semibold' 
                      : 'text-slate-600 hover:text-amber-600'
                  }`}
                >
                  {t("goldRateIn", { city: cityItem })} {isCurrentCity && '←'}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Silver Rate in Top Cities */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-soft">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-slate-400 rounded-full"></span>
          {t("silverRateTopCities")}
        </h3>
        <ul className="mt-4 space-y-1">
          {SILVER_RATE_CITIES.map((cityItem) => (
            <li key={cityItem}>
              <Link
                href={`/silver-rate/${cityItem.toLowerCase()}`}
                className="block py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                {t("silverPriceIn", { city: cityItem })}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular Jewellers */}
      <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-soft">
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          {t("popularJewellersIn", { city })}
        </h3>
        <ul className="mt-4 space-y-2">
          {popularJewellers.map((jeweller) => (
            <li key={jeweller.slug}>
              <Link
                href={`/jewellers/${jeweller.slug}`}
                className="block py-1.5 text-sm text-slate-600 hover:text-amber-600 transition-colors"
              >
                <span className="font-medium">{jeweller.name}</span>
                <span className="block text-xs text-slate-400 mt-0.5">
                  {t("making")} {jeweller.makingChargesRange.split(' - ')[0]}+
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/jewellers"
          className="mt-4 block text-center text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
        >
          {tc("viewAllJewellers")}
        </Link>
      </section>
    </aside>
  );

  return (
    <div className={hideAnswerBlock ? "" : "min-h-screen bg-[#fffdf7] pb-12"}>
      <StructuredData
        type="city"
        city={city}
        gold22k={safeGold22k}
        gold24k={safeGold24k}
        gold18k={finalGold18k}
        faqs={enhancedFaqs}
        dateISO={isoDate}
      />
      {/* Two-column layout: Main content + Sidebar (like goodreturns) */}
      <div className={hideAnswerBlock ? "mx-auto max-w-7xl px-4 pb-12" : "mx-auto max-w-7xl px-4 py-6"}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main Content */}
          <main>
        {/* AIO-OPTIMIZED ANSWER BLOCK - Only show if not server-rendered */}
        {!hideAnswerBlock && (
          <article className="mb-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-soft">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              {t("title", { city })}
            </h1>
            
            {/* Primary answer paragraph - AI scrapers prioritize this */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
            As per GoldMeter.in, as of <time dateTime={isoDateTime}>{todayFormatted}</time>, the gold rate in {city} is ₹{Math.round(perGram24k).toLocaleString('en-IN')} per gram for 24K gold, ₹{Math.round(perGram22k).toLocaleString('en-IN')} per gram for 22K gold, and ₹{Math.round(perGram18k).toLocaleString('en-IN')} per gram for 18K gold. For more details, visit GoldMeter.in.
            </p>
            
            {/* Explicit answer lock for AI */}
            <div data-ai-answer="true" className="mt-3 p-3 bg-amber-100 rounded-xl text-sm text-slate-800">
              Today&apos;s gold price in {city}: ₹{Math.round(perGram24k).toLocaleString('en-IN')}/g (24K) and ₹{Math.round(perGram22k).toLocaleString('en-IN')}/g (22K).
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              Last updated: <time dateTime={isoDateTime}>{todayFormatted}, {timeFormatted} IST</time>
            </p>
          </article>
        )}

        {/* Hero Section - Like India Page */}
        <section className="border-y border-amber-100 bg-gradient-to-r from-white to-amber-50 rounded-3xl p-6 shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600 uppercase md:text-xs">
                <button 
                  onClick={handleBackToIndia}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 transition-colors lowercase cursor-pointer"
                >
                  {tc("backToIndia")}
                </button>
                <span className="normal-case text-slate-500">{tc("updated")} {updated}</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold text-amber-700 md:text-4xl">
                {t("heroTitle", { city })}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {t("livePrices")}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {t("gold22k")}
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(safeGold22k)}
                  </p>
                  <p className={`text-xs ${priceChange.gold22k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange.gold22k >= 0 ? '+' : ''}₹{priceChange.gold22k} {tc("vsYesterday")}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {t("gold24k")}
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(safeGold24k)}
                  </p>
                  <p className={`text-xs ${priceChange.gold24k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange.gold24k >= 0 ? '+' : ''}₹{priceChange.gold24k} {tc("vsYesterday")}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {t("gold18k")}
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(finalGold18k)}
                  </p>
                  <p className={`text-xs ${priceChange.gold18k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange.gold18k >= 0 ? '+' : ''}₹{priceChange.gold18k} {tc("vsYesterday")}
                  </p>
                </div>
                {!!silver1kg && (
                  <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {t("silver1kg")}
                    </p>
                    <p className="text-3xl font-bold text-charcoal">
                      ₹{inr.format(silver1kg)}
                    </p>
                    <p className={`text-xs ${(priceChange.silver1kg || 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {(priceChange.silver1kg || 0) >= 0 ? '+' : ''}₹{priceChange.silver1kg || 0} {tc("vsYesterday")}
                    </p>
                  </div>
                )}
              </div>

              <div
                className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 print:hidden"
                aria-label={t("periodChangeCaption")}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {t("periodChangeCaption")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <GoldPeriodChip label={t("periodYesterday")} pct={periodPctChanges.yesterday.pct24} />
                  <GoldPeriodChip label={t("period7Days")} pct={periodPctChanges.week.pct24} />
                  <GoldPeriodChip label={t("period30Days")} pct={periodPctChanges.month.pct24} />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm print:hidden">
                <Link
                  href="#price-chart"
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {t("viewCharts")}
                </Link>
                <Link 
                  href="/calculator"
                  className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors"
                >
                  {t("calculatePrice")}
                </Link>
                <button
                  onClick={handlePrint}
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  🖨️ {tc("print")}
                </button>
              </div>
              <div className="mt-4 print:hidden">
                <ShareButtons
                  title={`${city} Gold Rate Today - GoldMeter`}
                  text={`${city} Gold Rate Today: 22K ₹${gold22k?.toLocaleString('en-IN')}/10g, 24K ₹${gold24k?.toLocaleString('en-IN')}/10g`}
                />
              </div>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                {heroIntro}
              </p>
            </div>
            {/* Quick Calculator Card */}
            <div className="w-full rounded-3xl border border-amber-100 bg-white p-5 shadow-soft md:w-1/3">
              <p className="text-xs uppercase text-slate-400">{t("quickCalculator")}</p>
              <p className="mt-3 text-3xl font-bold text-amber-600">
                ₹{(safeGold24k / 10).toFixed(2)}
                <span className="text-sm font-medium text-slate-500">/ gram</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {t("estimateJewelleryCost")}
              </p>
              <Link 
                href="/wastage-calculator"
                className="mt-4 block w-full rounded-2xl bg-amber-100 py-2 text-center text-sm font-semibold text-amber-700 hover:bg-amber-200 transition-colors"
              >
                {t("openWastageTool")}
              </Link>
            </div>
          </div>
        </section>

        {/* 22K Quick Cards */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("quickCards", { purity: "22K" })}</h3>
            <p className="text-sm text-slate-500">{t("cityPrice", { city })}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickPresets.map((preset) => (
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
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("quickCards", { purity: "24K" })}</h3>
            <p className="text-sm text-slate-500">{t("cityPrice", { city })}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickPresets.map((preset) => (
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
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("quickCards", { purity: "18K" })}</h3>
            <p className="text-sm text-slate-500">{t("cityPrice", { city })}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickPresets.map((preset) => (
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
        {!!silver1kg && (
          <section id="silver-rate" className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("silverQuickCards")}</h3>
              <p className="text-sm text-slate-500">{t("cityPrice", { city })}</p>
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
        <section className="mt-8">
          <Last10DaysTable history={normalizedHistory} city={city} />
        </section>

        {/* Month Statistics */}
        <section className="mt-8">
          <MonthStatistics history={normalizedHistory} />
        </section>

        {/* Price Trend Section */}
        <section id="price-chart" className="mt-8 rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <PriceChartWrapper
            city={city}
            currentGold22k={safeGold22k}
            currentGold24k={safeGold24k}
          />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {localInfo.map((info) => (
            <div
              key={info.title}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft"
            >
              <p className="text-sm font-semibold text-charcoal">{info.title}</p>
              <p className="mt-2 text-sm text-slate-600">{info.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft print:hidden">
          <h3 className="text-lg font-semibold">{t("toolsCalculators")}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">🧮</span>
              <p className="font-semibold text-charcoal mt-1">{t("priceCalculator")}</p>
              <p className="text-sm text-slate-600">{t("getCostWithGST")}</p>
            </Link>
            <Link href="/wastage-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">💎</span>
              <p className="font-semibold text-charcoal mt-1">{t("wastageMaking")}</p>
              <p className="text-sm text-slate-600">{t("compareJewellerQuotes")}</p>
            </Link>
            <Link href="/purity-converter" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">⚖️</span>
              <p className="font-semibold text-charcoal mt-1">{t("purityConverter")}</p>
              <p className="text-sm text-slate-600">{t("purityConvert22k24k")}</p>
            </Link>
            <Link href="/investment-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">📈</span>
              <p className="font-semibold text-charcoal mt-1">{t("investmentSIP")}</p>
              <p className="text-sm text-slate-600">{t("planGoldSIPReturns")}</p>
            </Link>
            <Link href="/gold-loan-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">🏦</span>
              <p className="font-semibold text-charcoal mt-1">{t("loanCalculator")}</p>
              <p className="text-sm text-slate-600">{t("checkLoanEligibility")}</p>
            </Link>
            <Link href="/wedding-gold-planner" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">💍</span>
              <p className="font-semibold text-charcoal mt-1">{t("weddingPlanner")}</p>
              <p className="text-sm text-slate-600">{t("planWeddingGold")}</p>
            </Link>
            <Link href="/sip-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">📊</span>
              <p className="font-semibold text-charcoal mt-1">{t("sipCalculator")}</p>
              <p className="text-sm text-slate-600">{t("calculateSIPReturns")}</p>
            </Link>
            <Link href="/sip-calculator-with-step-up" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">📈</span>
              <p className="font-semibold text-charcoal mt-1">{t("stepUpSIP")}</p>
              <p className="text-sm text-slate-600">{t("sipWithYearlyIncrease")}</p>
            </Link>
            <Link href="/swp-calculator-with-inflation" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">💰</span>
              <p className="font-semibold text-charcoal mt-1">{t("swpCalculator")}</p>
              <p className="text-sm text-slate-600">{t("withdrawalPlanInflation")}</p>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/silver-rate" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <p className="font-semibold text-charcoal">{t("silverRateIndia")}</p>
              <p className="text-sm text-slate-600">{t("trackSilverRate")}</p>
            </Link>
            <Link href="/news" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <p className="font-semibold text-charcoal">{t("goldNews")}</p>
              <p className="text-sm text-slate-600">{t("dailyHeadlines")}</p>
            </Link>
            <Link href="/news/recap" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <p className="font-semibold text-charcoal">{t("dailyRecap")}</p>
              <p className="text-sm text-slate-600">{t("aiMarketSummary")}</p>
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold">{t("faqs")}</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {enhancedFaqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-100 p-4">
                <summary className="cursor-pointer font-semibold text-charcoal">
                  {faq.question}
                </summary>
                <p className="mt-2 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* AIO Content Sections - Adds depth for AI search */}
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Why Prices Change */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-charcoal">{t("whyPricesChange", { city })}</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Gold prices in {city} fluctuate based on several key factors:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span><strong>International spot price</strong> – London gold fix and COMEX futures directly influence local rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span><strong>USD/INR exchange rate</strong> – A weaker rupee makes gold imports costlier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span><strong>MCX gold futures</strong> – India&apos;s Multi Commodity Exchange sets domestic benchmarks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span><strong>Local demand</strong> – Wedding season and festivals like Akshaya Tritiya spike {city} demand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span><strong>Import duties & GST</strong> – Government levies (currently ~18.5% total) affect final prices</span>
              </li>
            </ul>
          </div>

          {/* Is Today Good to Buy */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-charcoal">{t("isTodayGoodDay", { city })}</h3>
            <div className="mt-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Today&apos;s {city} gold rate is{' '}
                <span className={priceChange.gold24k >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'}>
                  {priceDirection} {priceDirectionText}
                </span>
                {' '}from yesterday.
              </p>
              <div className="mt-4 rounded-xl bg-amber-50 p-4">
                <p className="font-semibold text-amber-800">Quick market analysis:</p>
                <ul className="mt-2 space-y-1 text-slate-700">
                  {priceChange.gold24k > 50 && (
                    <li>• Prices rising – consider buying before further increase</li>
                  )}
                  {priceChange.gold24k < -50 && (
                    <li>• Prices falling – good opportunity if dip continues</li>
                  )}
                  {Math.abs(priceChange.gold24k) <= 50 && (
                    <li>• Prices stable – favorable for planned purchases</li>
                  )}
                  <li>• Check 30-day trend in chart above for pattern</li>
                  <li>• Wedding/festival seasons typically see higher prices</li>
                </ul>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Note: This is informational only, not financial advice. Gold prices can be volatile.
              </p>
            </div>
          </div>
        </section>

        {/* 22K vs 24K Explanation */}
        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-charcoal">{t("difference22k24k")}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">24K Gold (99.9% pure)</p>
              <p className="mt-2 text-slate-600">
                Purest form of gold. Ideal for investment, coins, and bars. Too soft for daily-wear jewellery.
                Current {city} rate: <strong>₹{Math.round(perGram24k).toLocaleString('en-IN')}/gram</strong>
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">22K Gold (91.6% pure)</p>
              <p className="mt-2 text-slate-600">
                Most popular for jewellery in India. Mixed with copper/silver for durability. Standard for wedding ornaments.
                Current {city} rate: <strong>₹{Math.round(perGram22k).toLocaleString('en-IN')}/gram</strong>
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">18K Gold (75% pure)</p>
              <p className="mt-2 text-slate-600">
                Stronger and more affordable. Common for studded jewellery and international designs.
                Current {city} rate: <strong>₹{Math.round(perGram18k).toLocaleString('en-IN')}/gram</strong>
              </p>
            </div>
          </div>
        </section>

        {/* City-specific static content for SEO */}
        {children}

        {/* City Local SEO Block - Jewellers, Market Landmarks, Making Charges, Historical Trends */}
        <CityLocalSEOBlock
          city={city}
          citySlug={city.toLowerCase()}
          marketData={getCityMarketData(city.toLowerCase())}
        />

        {/* E-E-A-T: About GoldMeter - moved lower for SEO, not in answer block */}
        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-charcoal">{t("aboutGoldMeter")}</h3>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>
              {t("aboutGoldMeterDesc", { city })}
            </p>
            <ul className="mt-3 space-y-2">
              <li>• <strong>{t("dailyUpdates")}</strong> {t("dailyUpdatesDesc")}</li>
              <li>• <strong>{t("allPurities")}</strong> {t("allPuritiesDesc")}</li>
              <li>• <strong>{t("thirtyDayHistory")}</strong> {t("thirtyDayHistoryDesc")}</li>
              <li>• <strong>{t("allMajorCities")}</strong> {t("allMajorCitiesDesc")}</li>
            </ul>
            <p className="mt-3">
              <Link href="/gold-rate-today" className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                {t("goldRateTodayIndia")}
              </Link>
            </p>
            <p className="mt-4 text-xs text-slate-500">
              {t("shopPricesMayVary")}
            </p>
          </div>
        </section>
          </main>

          {/* Right Sidebar - Top Cities (visible on desktop, below content on mobile) */}
          <TopCitiesSidebar />
        </div>
      </div>
    </div>
  );
}
