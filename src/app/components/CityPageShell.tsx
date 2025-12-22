"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import RateCard from "./RateCard";
import PriceChartWrapper from "./PriceChartWrapper";
import Last10DaysTable from "./Last10DaysTable";
import MonthStatistics from "./MonthStatistics";
import StructuredData from "./StructuredData";

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
  history?: HistoryRateInput[];
  localInfo: LocalInfo[];
  faqs: FAQ[];
  similarCities: string[];
  intro?: string;
  dateISO?: string; // ISO date for structured data freshness
  hideAnswerBlock?: boolean; // Hide the AIO answer block if server-rendered version exists
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

export default function CityPageShell({
  city,
  updated,
  gold22k,
  gold24k,
  gold18k,
  silver1kg,
  priceChange = { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 },
  history = [],
  localInfo,
  faqs,
  similarCities,
  intro,
  dateISO,
  hideAnswerBlock = false,
}: CityPageShellProps) {
  const router = useRouter();

  // Handle "Back to India" click - uses noredirect param to bypass geo-redirect
  const handleBackToIndia = () => {
    router.push("/?noredirect=true");
  };

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: `${city} Gold Rate Today - GoldMeter`,
      text: `${city} Gold Rate Today: 22K ₹${gold22k?.toLocaleString('en-IN')}/10g, 24K ₹${gold24k?.toLocaleString('en-IN')}/10g. Check live prices!`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
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
      <div className={hideAnswerBlock ? "mx-auto max-w-6xl px-4 pb-12" : "mx-auto max-w-6xl px-4 py-6"}>
        {/* AIO-OPTIMIZED ANSWER BLOCK - Only show if not server-rendered */}
        {!hideAnswerBlock && (
          <article className="mb-6 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-soft">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl">
              Gold Rate Today in {city}
            </h1>
            
            {/* Primary answer paragraph - AI scrapers prioritize this */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true">
              As of <time dateTime={isoDateTime}>{todayFormatted}</time>, the gold rate in {city} is ₹{Math.round(perGram24k).toLocaleString('en-IN')} per gram for 24K gold, ₹{Math.round(perGram22k).toLocaleString('en-IN')} per gram for 22K gold, and ₹{Math.round(perGram18k).toLocaleString('en-IN')} per gram for 18K gold, as reported by GoldMeter.in.
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
                  ← back to india
                </button>
                <span className="normal-case text-slate-500">Updated {updated}</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold text-amber-700 md:text-4xl">
                {city} Gold Rate — Per 10 Grams
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Live prices updated daily
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    22K Gold
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(safeGold22k)}
                  </p>
                  <p className={`text-xs ${priceChange.gold22k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange.gold22k >= 0 ? '+' : ''}₹{priceChange.gold22k} vs yesterday
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    24K Gold
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(safeGold24k)}
                  </p>
                  <p className={`text-xs ${priceChange.gold24k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange.gold24k >= 0 ? '+' : ''}₹{priceChange.gold24k} vs yesterday
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    18K Gold
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(finalGold18k)}
                  </p>
                  <p className={`text-xs ${priceChange.gold18k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange.gold18k >= 0 ? '+' : ''}₹{priceChange.gold18k} vs yesterday
                  </p>
                </div>
                {!!silver1kg && (
                  <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Silver (1kg)
                    </p>
                    <p className="text-3xl font-bold text-charcoal">
                      ₹{inr.format(silver1kg)}
                    </p>
                    <p className={`text-xs ${(priceChange.silver1kg || 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {(priceChange.silver1kg || 0) >= 0 ? '+' : ''}₹{priceChange.silver1kg || 0} vs yesterday
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm print:hidden">
                <Link
                  href="#price-chart"
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Charts
                </Link>
                <Link 
                  href="/calculator"
                  className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors"
                >
                  Calculate Price
                </Link>
                <button
                  onClick={handleShare}
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  📤 Share
                </button>
                <button
                  onClick={handlePrint}
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  🖨️ Print
                </button>
              </div>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                {heroIntro}
              </p>
            </div>
            {/* Quick Calculator Card */}
            <div className="w-full rounded-3xl border border-amber-100 bg-white p-5 shadow-soft md:w-1/3">
              <p className="text-xs uppercase text-slate-400">Quick Calculator</p>
              <p className="mt-3 text-3xl font-bold text-amber-600">
                ₹{(safeGold24k / 10).toFixed(2)}
                <span className="text-sm font-medium text-slate-500">/ gram</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Estimate jewellery cost with making + GST
              </p>
              <Link 
                href="/wastage-calculator"
                className="mt-4 block w-full rounded-2xl bg-amber-100 py-2 text-center text-sm font-semibold text-amber-700 hover:bg-amber-200 transition-colors"
              >
                Open Jewellery Wastage Tool
              </Link>
            </div>
          </div>
        </section>

        {/* 22K Quick Cards */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">22K Gold - Quick Cards</h3>
            <p className="text-sm text-slate-500">{city} price</p>
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
            <h3 className="text-lg font-semibold">24K Gold - Quick Cards</h3>
            <p className="text-sm text-slate-500">{city} price</p>
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
            <h3 className="text-lg font-semibold">18K Gold - Quick Cards</h3>
            <p className="text-sm text-slate-500">{city} price</p>
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
              <h3 className="text-lg font-semibold">Silver - Quick Cards</h3>
              <p className="text-sm text-slate-500">{city} price</p>
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
          <Last10DaysTable history={normalizedHistory} />
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
          <h3 className="text-lg font-semibold">Tools & Calculators</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">🧮</span>
              <p className="font-semibold text-charcoal mt-1">Price calculator</p>
              <p className="text-sm text-slate-600">Get cost with GST.</p>
            </Link>
            <Link href="/wastage-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">💎</span>
              <p className="font-semibold text-charcoal mt-1">Wastage & making</p>
              <p className="text-sm text-slate-600">Compare jeweller quotes.</p>
            </Link>
            <Link href="/purity-converter" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">⚖️</span>
              <p className="font-semibold text-charcoal mt-1">Purity converter</p>
              <p className="text-sm text-slate-600">22K ↔ 24K instantly.</p>
            </Link>
            <Link href="/investment-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">📈</span>
              <p className="font-semibold text-charcoal mt-1">Investment SIP</p>
              <p className="text-sm text-slate-600">Plan gold SIP returns.</p>
            </Link>
            <Link href="/gold-loan-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">🏦</span>
              <p className="font-semibold text-charcoal mt-1">Loan calculator</p>
              <p className="text-sm text-slate-600">Check loan eligibility.</p>
            </Link>
            <Link href="/wedding-gold-planner" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <span className="text-xl">💍</span>
              <p className="font-semibold text-charcoal mt-1">Wedding planner</p>
              <p className="text-sm text-slate-600">Plan wedding gold.</p>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/silver-rate" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <p className="font-semibold text-charcoal">Silver rate India</p>
              <p className="text-sm text-slate-600">Track ₹/kg silver.</p>
            </Link>
            <Link href="/news" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <p className="font-semibold text-charcoal">Gold news</p>
              <p className="text-sm text-slate-600">Daily headlines.</p>
            </Link>
            <Link href="/news/recap" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors">
              <p className="font-semibold text-charcoal">Daily recap</p>
              <p className="text-sm text-slate-600">AI market summary.</p>
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold">FAQs</h3>
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
            <h3 className="text-lg font-semibold text-charcoal">Why Gold Prices Change in {city}</h3>
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
            <h3 className="text-lg font-semibold text-charcoal">Is Today a Good Day to Buy Gold in {city}?</h3>
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
          <h3 className="text-lg font-semibold text-charcoal">Difference Between 22K and 24K Gold</h3>
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

        {/* E-E-A-T: About GoldMeter - moved lower for SEO, not in answer block */}
        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-charcoal">About GoldMeter</h3>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>
              GoldMeter is India&apos;s gold price tracker, updating {city} rates daily.
            </p>
            <ul className="mt-3 space-y-2">
              <li>• <strong>Daily updates:</strong> Fresh prices every morning</li>
              <li>• <strong>All purities:</strong> 24K, 22K, and 18K per gram</li>
              <li>• <strong>30-day history:</strong> Track trends and patterns</li>
              <li>• <strong>All major cities:</strong> Pan-India coverage</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Note: Shop prices may vary due to making charges and GST.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-500">Similar cities</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {similarCities.map((cityItem) => (
              <Link
                key={cityItem}
                href={`/${cityItem.toLowerCase()}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-amber-200 hover:text-amber-600"
              >
                {cityItem}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
