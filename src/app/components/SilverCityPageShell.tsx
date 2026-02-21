"use client";

import Link from "next/link";
import RateCard from "./RateCard";
import SilverLast10DaysTable from "./SilverLast10DaysTable";
import SimplePriceChart from "./SimplePriceChart";
import SilverStaticContent from "./SilverStaticContent";
import { GOLD_RATE_CITIES, SILVER_RATE_CITIES } from "@/lib/cities";
import { getAllJewellers, type JewellerConfig } from "@/lib/jewellerConfig";
import type { CitySilverConfig } from "@/lib/citySilverConfig";
import type { CitySilverSections } from "@/lib/citySilverSections";
import type { CitySilverExtra } from "@/lib/citySilverExtra";
import type { CitySilverTitles } from "@/lib/citySilverTitles";

type LocalInfo = {
  title: string;
  description: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type SilverCityPageShellProps = {
  city: string;
  updated: string;
  silver1kg: number;
  priceChange: number; // Change for 1kg
  history: any[];
  localInfo: LocalInfo[];
  faqs: FAQ[];
  similarCities?: string[]; // Deprecated - now using shared SILVER_RATE_CITIES config
  intro?: string;
  silverConfig?: CitySilverConfig;
  silverSections?: CitySilverSections;
  silverExtra?: CitySilverExtra;
  silverTitles?: CitySilverTitles;
  generatedFaqs?: { question: string; answer: string }[];
};

const inr = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const silverPresets = [
  { label: "1 gram", grams: 1 },
  { label: "10 gram", grams: 10 },
  { label: "100 gram", grams: 100 },
  { label: "1 kg", grams: 1000 },
];

export default function SilverCityPageShell({
  city,
  updated,
  silver1kg,
  priceChange = 0,
  history = [],
  localInfo,
  faqs,
  similarCities: _similarCities, // Deprecated - kept for backward compatibility
  intro,
  silverConfig,
  silverSections,
  silverExtra,
  silverTitles,
  generatedFaqs,
}: SilverCityPageShellProps) {
  const citySlug = city.toLowerCase();
  const goldHref = city === 'India' ? '/' : `/gold-rate/${citySlug}`;

  const perGramSilver = silver1kg / 1000;
  const changePerGram = priceChange / 1000;

  const heroIntro =
    intro ||
    `Silver rate in ${city} today per gram: ₹${Math.round(perGramSilver)} (999 purity). Updated ${updated}. Track daily moves, view 30-day history, and compare with gold tools below.`;

  // Prepare chart data
  // Filter out entries with no silver rate if any
  const chartData = history
    .filter(h => h.silver1kg && h.silver1kg > 0)
    .map(h => ({
      date: h.date,
      price: h.silver1kg || 0,
    }));

  // Get popular jewellers for sidebar
  const getPopularJewellers = (): JewellerConfig[] => {
    const allJewellers = getAllJewellers();
    const cityLower = city.toLowerCase();
    
    // Get jewellers that have this city in their cityLinks
    const jewellersInCity = allJewellers.filter((j) =>
      j.cityLinks.some((c) => c.slug === cityLower)
    );
    
    // If we have jewellers for this city, prioritize them
    if (jewellersInCity.length >= 4) {
      return jewellersInCity.slice(0, 5);
    }
    
    // Otherwise, show national chains
    return allJewellers.filter((j) => j.type === 'national').slice(0, 5);
  };
  
  const popularJewellers = getPopularJewellers();

  // Sidebar component for Top Cities (reusable)
  const TopCitiesSidebar = () => (
    <aside className="space-y-6">
      {/* Gold Guides & Articles — prominent for ad network approval + SEO */}
      <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-soft mt-1">
        <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2 mb-1">
          <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
          📚 Gold Guides &amp; Articles
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
          View all articles →
        </Link>
      </section>

      {/* Silver Rate in Top Cities */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-soft">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-slate-400 rounded-full"></span>
          Silver Rate in Top Cities of India
        </h3>
        <ul className="mt-4 space-y-1">
          {SILVER_RATE_CITIES.map((cityItem) => {
            const isCurrentCity = cityItem.toLowerCase() === city.toLowerCase();
            return (
              <li key={cityItem}>
                <Link
                  href={`/silver-rate/${cityItem.toLowerCase()}`}
                  className={`block py-1.5 text-sm transition-colors ${
                    isCurrentCity 
                      ? 'text-slate-700 font-semibold' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Silver price in {cityItem} {isCurrentCity && '←'}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Gold Rate in Top Cities */}
      <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-soft">
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          Gold Rate in Top Cities of India
        </h3>
        <ul className="mt-4 space-y-1">
          {GOLD_RATE_CITIES.map((cityItem) => (
            <li key={cityItem}>
              <Link
                href={`/gold-rate/${cityItem.toLowerCase()}`}
                className="block py-1.5 text-sm text-slate-600 hover:text-amber-600 transition-colors"
              >
                Gold rate in {cityItem}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular Jewellers */}
      <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-soft">
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          Popular Jewellers
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
                  Making: {jeweller.makingChargesRange.split(' - ')[0]}+
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/jewellers"
          className="mt-4 block text-center text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
        >
          View all jewellers →
        </Link>
      </section>
    </aside>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Two-column layout: Main content + Sidebar (like goodreturns) */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main Content */}
          <div>
        {/* Hero Section */}
        <section className="border-y border-slate-200 bg-gradient-to-r from-white to-slate-100 rounded-3xl p-6 shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Updated {updated}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-800 md:text-4xl">
                {city} Silver Rate Today
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Updated daily by GoldMeter
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft border border-slate-100">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Silver (1 gram)
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    ₹{inr.format(perGramSilver)}
                  </p>
                  <p className={`text-xs ${changePerGram >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {changePerGram >= 0 ? '+' : ''}₹{changePerGram.toFixed(1)} vs yesterday
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft border border-slate-100">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Silver (1 kg)
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    ₹{inr.format(silver1kg)}
                  </p>
                  <p className={`text-xs ${priceChange >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {priceChange >= 0 ? '+' : ''}₹{priceChange} vs yesterday
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link 
                  href={goldHref}
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  ← View Gold Rate
                </Link>
                <Link
                  href="#price-chart"
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Charts
                </Link>
              </div>
              <p className="mt-4 max-w-2xl text-sm text-slate-600">
                {heroIntro}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Cards */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Silver Rate - Quick Cards</h2>
            <p className="text-sm text-slate-500">{city} price</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {silverPresets.map((preset) => (
              <RateCard
                key={`silver-${preset.label}`}
                label={preset.label}
                grams={preset.grams}
                price={Math.round(perGramSilver * preset.grams)}
                change={Math.round(changePerGram * preset.grams)}
              />
            ))}
          </div>
        </section>

        {/* Silver Historical Rates Table */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Historical Silver Rates in {city}</h2>
          <SilverLast10DaysTable history={history} city={city} />
        </section>

        {/* Price Trend Section */}
        <section id="price-chart" className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Silver Price Trend in {city}</h2>
            <p className="text-sm text-slate-500">Last 30 days (per 1kg)</p>
          </div>
          <div className="h-[300px] w-full">
             <SimplePriceChart data={chartData} color="#64748b" />
          </div>
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

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Gold & Silver Tools</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href={goldHref} className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Gold rate in {city}</p>
              <p className="text-sm text-slate-600 mt-1">22K / 24K per gram with charts.</p>
            </Link>
            <Link href="/calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Gold price calculator</p>
              <p className="text-sm text-slate-600 mt-1">Enter grams → get cost with GST.</p>
            </Link>
            <Link href="/wastage-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Wastage & making</p>
              <p className="text-sm text-slate-600 mt-1">Estimate making + wastage charges.</p>
            </Link>
            <Link href="/purity-converter" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Purity converter</p>
              <p className="text-sm text-slate-600 mt-1">22K ↔ 24K instantly.</p>
            </Link>
            <Link href="/sip-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">SIP Calculator</p>
              <p className="text-sm text-slate-600 mt-1">Calculate SIP returns.</p>
            </Link>
            <Link href="/sip-calculator-with-step-up" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Step-up SIP</p>
              <p className="text-sm text-slate-600 mt-1">SIP with yearly increase.</p>
            </Link>
            <Link href="/swp-calculator-with-inflation" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">SWP Calculator with Inflation</p>
              <p className="text-sm text-slate-600 mt-1">Withdrawal plan with inflation.</p>
            </Link>
            <Link href="/news" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Gold news</p>
              <p className="text-sm text-slate-600 mt-1">Daily headlines and price movers.</p>
            </Link>
            <Link href="/news/recap" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Daily recap</p>
              <p className="text-sm text-slate-600 mt-1">AI summary of market signals.</p>
            </Link>
          </div>
        </section>

        {/* Comprehensive Silver Content */}
        {silverConfig && silverSections && generatedFaqs && (
          <SilverStaticContent
            city={city}
            silver1kg={silver1kg}
            silverPerGram={perGramSilver}
            config={silverConfig}
            sections={silverSections}
            extra={silverExtra}
            titles={silverTitles}
            faqs={generatedFaqs}
          />
        )}

        {/* Fallback FAQ section when no config is provided */}
        {!silverConfig && (
        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-100 p-4">
                <summary className="cursor-pointer font-semibold text-charcoal">
                  {faq.question}
                </summary>
                <p className="mt-2 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        )}
          </div>

          {/* Right Sidebar - Top Cities (visible on desktop, below content on mobile) */}
          <TopCitiesSidebar />
        </div>
      </div>
    </main>
  );
}

