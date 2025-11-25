"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const cityRates = [
  { name: "Chennai", gold22k: 59680, gold24k: 64890 },
  { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
  { name: "Hyderabad", gold22k: 59390, gold24k: 64580 },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

export default function CalculatorPage() {
  const [city, setCity] = useState(cityRates[0]);
  const [grams, setGrams] = useState(10);
  const [purity, setPurity] = useState<"22K" | "24K">("24K");
  const [makingCharges, setMakingCharges] = useState(150);

  const pricePer10g = purity === "22K" ? city.gold22k : city.gold24k;
  const pricePerGram = pricePer10g / 10;

  const result = useMemo(() => {
    const goldValue = pricePerGram * grams;
    const making = makingCharges * grams;
    const gst = (goldValue + making) * 0.03;
    const total = goldValue + making + gst;
    return {
      goldValue,
      making,
      gst,
      total,
    };
  }, [grams, makingCharges, pricePerGram]);

  return (
    <main className="min-h-screen bg-amber-50 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4"
        >
          ← Back to Home
        </Link>
        <p className="text-xs uppercase tracking-widest text-slate-500">
          Gold tools
        </p>
        <h1 className="mt-2 text-3xl font-bold text-charcoal">
          Gold Price Calculator
        </h1>
        <p className="text-sm text-slate-600">
          Estimate real-time payable amount including making charges & GST.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            Select city
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={city.name}
              onChange={(event) => {
                const selected = cityRates.find(
                  (item) => item.name === event.target.value,
                );
                if (selected) setCity(selected);
              }}
            >
              {cityRates.map((cityOption) => (
                <option key={cityOption.name} value={cityOption.name}>
                  {cityOption.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Weight (grams)
            <input
              type="number"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={grams}
              onChange={(event) => setGrams(Number(event.target.value) || 0)}
              min={1}
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            Purity
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={purity}
              onChange={(event) => setPurity(event.target.value as "22K" | "24K")}
            >
              <option value="24K">24K</option>
              <option value="22K">22K</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Making charges (₹ per gram)
            <input
              type="number"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={makingCharges}
              onChange={(event) =>
                setMakingCharges(Number(event.target.value) || 0)
              }
              min={0}
            />
          </label>
        </div>

        <section className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
          <h2 className="text-lg font-semibold">Estimate</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Gold value</span>
              <span>₹{formatCurrency(result.goldValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Making charges</span>
              <span>₹{formatCurrency(result.making)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GST (3%)</span>
              <span>₹{formatCurrency(result.gst)}</span>
            </div>
            <hr className="border-dashed border-slate-300" />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Payable amount</span>
              <span>₹{formatCurrency(result.total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <button className="flex-1 rounded-full bg-amber-600 px-4 py-2 text-white shadow-soft">
              Download Estimate (PDF)
            </button>
            <button className="flex-1 rounded-full border border-amber-200 px-4 py-2 text-amber-600">
              Share
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

