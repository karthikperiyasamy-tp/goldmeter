"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import CalculatorSwitcher from "../components/CalculatorSwitcher";

type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
};

const defaultCityRates: CityRate[] = [
  { name: "India", gold22k: 59200, gold24k: 64500 },
  { name: "Chennai", gold22k: 59680, gold24k: 64890 },
  { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

export default function WastageCalculatorPage() {
  const [cityRates, setCityRates] = useState<CityRate[]>(defaultCityRates);
  const [city, setCity] = useState<CityRate>(defaultCityRates[0]);
  const [grams, setGrams] = useState(10);
  const [purity, setPurity] = useState<"22K" | "24K">("24K");
  const [wastagePercent, setWastagePercent] = useState(8);
  const [makingCharges, setMakingCharges] = useState(150);
  const [loading, setLoading] = useState(true);

  // Fetch latest rates from API
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('/api/calculator-rates');
        const data = await response.json();
        
        if (data.success && data.rates && data.rates.length > 0) {
          setCityRates(data.rates);
          setCity(data.rates[0]);
          console.log(`✅ [Wastage Calculator] Loaded ${data.rates.length} city rates`);
        }
      } catch (error) {
        console.error('❌ [Wastage Calculator] Failed to fetch rates:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRates();
  }, []);

  const pricePer10g = purity === "22K" ? city.gold22k : city.gold24k;
  const pricePerGram = pricePer10g / 10;

  const result = useMemo(() => {
    const goldValue = pricePerGram * grams;
    const wastageAmount = goldValue * (wastagePercent / 100);
    const making = makingCharges * grams;
    const subtotal = goldValue + wastageAmount + making;
    const gst = subtotal * 0.03;
    const total = subtotal + gst;
    
    return {
      goldValue,
      wastageAmount,
      making,
      subtotal,
      gst,
      total,
    };
  }, [grams, wastagePercent, makingCharges, pricePerGram]);

  return (
    <main className="min-h-screen bg-amber-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
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
          Jewellery Wastage Tool
        </h1>
        <p className="text-sm text-slate-600">
          Estimate making + wastage charges
        </p>
        
        {loading && (
          <div className="mt-4 text-sm text-amber-600">Loading latest rates...</div>
        )}

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
            Wastage (%)
            <input
              type="number"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={wastagePercent}
              onChange={(event) =>
                setWastagePercent(Number(event.target.value) || 0)
              }
              min={0}
              max={100}
              step={0.5}
            />
          </label>
          <label className="text-sm font-medium text-slate-600 md:col-span-2">
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
              <span>Wastage ({wastagePercent}%)</span>
              <span>₹{formatCurrency(result.wastageAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Making charges</span>
              <span>₹{formatCurrency(result.making)}</span>
            </div>
            <hr className="border-dashed border-slate-300" />
            <div className="flex items-center justify-between font-medium">
              <span>Subtotal</span>
              <span>₹{formatCurrency(result.subtotal)}</span>
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

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <h3 className="text-sm font-semibold text-blue-900">
            💡 About Wastage Charges
          </h3>
          <p className="mt-2 text-xs text-blue-800">
            Wastage charges compensate for gold lost during jewellery making.
            Typical wastage ranges from 6-12% depending on jewellery design
            complexity. Intricate designs like chains and bracelets may have
            higher wastage.
          </p>
        </div>
          </div>
          
          {/* Calculator Switcher Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <CalculatorSwitcher />
          </div>
        </div>
      </div>
    </main>
  );
}

