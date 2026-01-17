"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

const purityData = [
  { karat: "24K", percentage: 99.9, parts: "24/24", description: "Pure gold" },
  { karat: "23K", percentage: 95.8, parts: "23/24", description: "Very rare" },
  { karat: "22K", percentage: 91.6, parts: "22/24", description: "Standard jewellery" },
  { karat: "21K", percentage: 87.5, parts: "21/24", description: "Common in some regions" },
  { karat: "20K", percentage: 83.3, parts: "20/24", description: "Less common" },
  { karat: "18K", percentage: 75.0, parts: "18/24", description: "International standard" },
  { karat: "14K", percentage: 58.3, parts: "14/24", description: "Western jewellery" },
  { karat: "10K", percentage: 41.7, parts: "10/24", description: "Minimum legal standard (US)" },
];

export default function PurityConverterPage() {
  const [cityRates, setCityRates] = useState<CityRate[]>(defaultCityRates);
  const [city, setCity] = useState<CityRate>(defaultCityRates[0]);
  const [fromPurity, setFromPurity] = useState("22K");
  const [toPurity, setToPurity] = useState("24K");
  const [grams, setGrams] = useState(10);
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
          console.log(`✅ [Purity Converter] Loaded ${data.rates.length} city rates`);
        }
      } catch (error) {
        console.error('❌ [Purity Converter] Failed to fetch rates:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRates();
  }, []);

  const fromPurityData = purityData.find((p) => p.karat === fromPurity);
  const toPurityData = purityData.find((p) => p.karat === toPurity);

  // Calculate equivalent gold weight
  const fromPureGold = fromPurityData ? (grams * fromPurityData.percentage) / 100 : 0;
  const toEquivalentGrams = toPurityData ? (fromPureGold * 100) / toPurityData.percentage : 0;

  // Calculate values
  const fromRate = fromPurity === "22K" ? city.gold22k : city.gold24k;
  const toRate = toPurity === "22K" ? city.gold22k : city.gold24k;
  
  const fromValue = (fromRate / 10) * grams;
  const toValue = (toRate / 10) * toEquivalentGrams;

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
          Purity Converter
        </h1>
        <p className="text-sm text-slate-600">
          22K ↔ 24K in one tap
        </p>
        
        {loading && (
          <div className="mt-4 text-sm text-amber-600">Loading latest rates...</div>
        )}

        <div className="mt-6 grid gap-4">
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

          <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              From
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-600">
                Purity
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={fromPurity}
                  onChange={(event) => setFromPurity(event.target.value)}
                >
                  {purityData.map((p) => (
                    <option key={p.karat} value={p.karat}>
                      {p.karat} ({p.percentage}%)
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
                  min={0.1}
                  step={0.1}
                />
              </label>
            </div>
            
            {fromPurityData && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Pure gold content:</span>
                  <span className="font-semibold">{fromPureGold.toFixed(2)}g</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Approximate value:</span>
                  <span className="font-semibold">₹{formatCurrency(fromValue)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              className="rounded-full border-2 border-amber-300 bg-white p-3 shadow-md hover:bg-amber-50 transition-colors"
              onClick={() => {
                const temp = fromPurity;
                setFromPurity(toPurity);
                setToPurity(temp);
              }}
            >
              <svg 
                className="h-6 w-6 text-amber-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
                />
              </svg>
            </button>
          </div>

          <div className="rounded-3xl border-2 border-green-200 bg-green-50/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-800">
              To
            </p>
            <div className="mt-3">
              <label className="text-sm font-medium text-slate-600">
                Purity
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={toPurity}
                  onChange={(event) => setToPurity(event.target.value)}
                >
                  {purityData.map((p) => (
                    <option key={p.karat} value={p.karat}>
                      {p.karat} ({p.percentage}%)
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            {toPurityData && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Equivalent weight:</span>
                  <span className="font-semibold text-green-700">
                    {toEquivalentGrams.toFixed(2)}g
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Approximate value:</span>
                  <span className="font-semibold text-green-700">
                    ₹{formatCurrency(toValue)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <h2 className="text-sm font-semibold text-blue-900">
            💡 Understanding Gold Purity
          </h2>
          <p className="mt-2 text-xs text-blue-800">
            <strong>Gold purity</strong> is measured in karats (K) or percentage. <strong>24K is 99.9% pure gold</strong>.
            22K gold contains 91.6% pure gold mixed with other metals for strength.
            This converter helps you understand equivalent weights when converting between purities.
          </p>
          <ul className="mt-3 text-xs text-blue-800 list-disc list-inside space-y-1">
            <li><strong>24K Gold</strong> - 99.9% pure, best for investment</li>
            <li><strong>22K Gold</strong> - 91.6% pure, standard for Indian jewellery</li>
            <li><strong>18K Gold</strong> - 75% pure, common in international markets</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Gold Purity Reference Table
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Karat</th>
                  <th className="px-4 py-3 text-left font-semibold">Purity %</th>
                  <th className="px-4 py-3 text-left font-semibold">Parts</th>
                  <th className="px-4 py-3 text-left font-semibold">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purityData.map((p) => (
                  <tr key={p.karat} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-amber-900">{p.karat}</td>
                    <td className="px-4 py-3">{p.percentage}%</td>
                    <td className="px-4 py-3 text-slate-600">{p.parts}</td>
                    <td className="px-4 py-3 text-slate-600">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

