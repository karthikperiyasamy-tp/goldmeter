"use client";

import Link from "next/link";

type PriceHeroProps = {
  city: string;
  gold22k: number;
  gold24k: number;
  gold18k?: number;
  silver1kg?: number;
  updated: string;
};

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export default function PriceHero({
  city,
  gold22k,
  gold24k,
  gold18k,
  silver1kg,
  updated,
}: PriceHeroProps) {
  const finalGold18k = gold18k || Math.round((gold24k * 18) / 24);

  return (
    <section className="border-y border-amber-100 bg-gradient-to-r from-white to-amber-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
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
                ₹{formatter.format(gold22k)}
              </p>
              <p className="text-xs text-emerald-600">+₹45 vs yesterday</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                24K Gold
              </p>
              <p className="text-3xl font-bold text-charcoal">
                ₹{formatter.format(gold24k)}
              </p>
              <p className="text-xs text-rose-500">-₹30 vs yesterday</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                18K Gold
              </p>
              <p className="text-3xl font-bold text-charcoal">
                ₹{formatter.format(finalGold18k)}
              </p>
              <p className="text-xs text-slate-500">Calculated</p>
            </div>
            {!!silver1kg && (
              <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Silver (1kg)
                </p>
                <p className="text-3xl font-bold text-charcoal">
                  ₹{formatter.format(silver1kg)}
                </p>
                <p className="text-xs text-slate-500">Spot Price</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="#price-chart"
              className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Charts
            </Link>
            <button className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-soft">
              Set Alert
            </button>
          </div>
        </div>
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
  );
}

