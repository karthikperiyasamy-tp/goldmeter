import Link from "next/link";
import RateCard from "./RateCard";
import PriceChartWrapper from "./PriceChartWrapper";
import Last10DaysTable from "./Last10DaysTable";
import MonthStatistics from "./MonthStatistics";

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
};

export type HistoryRate = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  timestamp: number;
};

type CityPageShellProps = {
  city: string;
  updated: string;
  gold22k: number;
  gold24k: number;
  gold18k?: number; // Optional for backward compatibility during migration
  priceChange?: PriceChange; // Dynamic price change from DB
  history?: HistoryRate[];
  localInfo: LocalInfo[];
  faqs: FAQ[];
  similarCities: string[];
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

export default function CityPageShell({
  city,
  updated,
  gold22k,
  gold24k,
  gold18k,
  priceChange = { gold22k: 0, gold24k: 0, gold18k: 0 },
  history = [],
  localInfo,
  faqs,
  similarCities,
}: CityPageShellProps) {
  // Calculate 18K if not provided
  const finalGold18k = gold18k || Math.round((gold24k * 18) / 24);

  // Calculate per gram prices
  const perGram22k = gold22k / 10;
  const perGram24k = gold24k / 10;
  const perGram18k = finalGold18k / 10;

  // Calculate change per gram from 10g price change
  const changePerGram22k = priceChange.gold22k / 10;
  const changePerGram24k = priceChange.gold24k / 10;
  const changePerGram18k = (priceChange.gold18k || 0) / 10;

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-12">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Hero Section - Like India Page */}
        <section className="border-y border-amber-100 bg-gradient-to-r from-white to-amber-50 rounded-3xl p-6 shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Updated {updated}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-amber-700 md:text-4xl">
                {city} Gold Rate Today
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Per 10 grams • Spot price sourced from leading jewellers
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    22K Gold
                  </p>
                  <p className="text-3xl font-bold text-charcoal">
                    ₹{inr.format(gold22k)}
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
                    ₹{inr.format(gold24k)}
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
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link 
                  href="/" 
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  ← Back to India
                </Link>
                <Link 
                  href="/calculator"
                  className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors"
                >
                  Calculate Price
                </Link>
              </div>
            </div>
            {/* Quick Calculator Card */}
            <div className="w-full rounded-3xl border border-amber-100 bg-white p-5 shadow-soft md:w-1/3">
              <p className="text-xs uppercase text-slate-400">Quick Calculator</p>
              <p className="mt-3 text-3xl font-bold text-amber-600">
                ₹{(gold24k / 10).toFixed(2)}
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

        {/* Last 10 Days Table */}
        <section className="mt-8">
          <Last10DaysTable history={history} />
        </section>

        {/* Month Statistics */}
        <section className="mt-8">
          <MonthStatistics history={history} />
        </section>

        {/* Price Trend Section */}
        <section className="mt-8 rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <PriceChartWrapper
            city={city}
            currentGold22k={gold22k}
            currentGold24k={gold24k}
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

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold">FAQs</h3>
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
    </main>
  );
}
