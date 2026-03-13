"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CalculatorSwitcher from "@/app/components/CalculatorSwitcher";

type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
};

type WeightUnit = {
  id: string;
  name: string;
  toGrams: number; // multiplier to convert to grams
  symbol: string;
};

const defaultCityRates: CityRate[] = [
  { name: "India", gold22k: 59200, gold24k: 64500 },
  { name: "Chennai", gold22k: 59680, gold24k: 64890 },
  { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
];

// Weight unit conversions
const weightUnits: WeightUnit[] = [
  { id: "grams", name: "Grams", toGrams: 1, symbol: "g" },
  { id: "tola", name: "Tola", toGrams: 11.6638, symbol: "tola" },
  { id: "mg", name: "Milligrams", toGrams: 0.001, symbol: "mg" },
  { id: "oz", name: "Troy Ounce", toGrams: 31.1035, symbol: "oz t" },
  { id: "kg", name: "Kilograms", toGrams: 1000, symbol: "kg" },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const formatWeight = (value: number, decimals: number = 4) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });

// Updated purity data with 9K added
const purityData = [
  { karat: "24K", percentage: 99.9, parts: "24/24", description: "Pure gold" },
  { karat: "23K", percentage: 95.8, parts: "23/24", description: "Very rare" },
  { karat: "22K", percentage: 91.6, parts: "22/24", description: "Standard Indian jewellery" },
  { karat: "21K", percentage: 87.5, parts: "21/24", description: "Common in Middle East" },
  { karat: "20K", percentage: 83.3, parts: "20/24", description: "Less common" },
  { karat: "18K", percentage: 75.0, parts: "18/24", description: "International standard" },
  { karat: "14K", percentage: 58.3, parts: "14/24", description: "Western jewellery" },
  { karat: "10K", percentage: 41.7, parts: "10/24", description: "Minimum legal standard (US)" },
  { karat: "9K", percentage: 37.5, parts: "9/24", description: "UK/Australia standard" },
];

// Calculation modes
type CalculationMode = "convert" | "analyze" | "make";

const calculationModes = [
  { 
    id: "convert" as CalculationMode, 
    name: "Convert Weight", 
    description: "Convert gold weight between different karats",
    icon: "⚖️"
  },
  { 
    id: "analyze" as CalculationMode, 
    name: "Analyze Purity", 
    description: "Find pure gold & alloy content in your gold",
    icon: "🔍"
  },
  { 
    id: "make" as CalculationMode, 
    name: "Make Lower Karat", 
    description: "Calculate alloy needed to create lower karat gold",
    icon: "🛠️"
  },
];

export default function PurityConverterPage() {
  const [cityRates, setCityRates] = useState<CityRate[]>(defaultCityRates);
  const [city, setCity] = useState<CityRate>(defaultCityRates[0]);
  const [fromPurity, setFromPurity] = useState("22K");
  const [toPurity, setToPurity] = useState("24K");
  const [weightValue, setWeightValue] = useState(10);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(weightUnits[0]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<CalculationMode>("convert");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

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

  // Convert input weight to grams for calculations
  const grams = weightValue * weightUnit.toGrams;

  const fromPurityData = purityData.find((p) => p.karat === fromPurity);
  const toPurityData = purityData.find((p) => p.karat === toPurity);

  // ===== MODE 1: CONVERT - Calculate equivalent gold weight =====
  const fromPureGold = fromPurityData ? (grams * fromPurityData.percentage) / 100 : 0;
  const fromAlloyContent = grams - fromPureGold;
  const toEquivalentGrams = toPurityData ? (fromPureGold * 100) / toPurityData.percentage : 0;
  const toAlloyContent = toEquivalentGrams - fromPureGold;

  // ===== MODE 2: ANALYZE - Pure gold & alloy in a piece =====
  // Uses fromPureGold and fromAlloyContent calculated above

  // ===== MODE 3: MAKE - Calculate alloy needed to make lower karat =====
  const makeTargetWeight = toPurityData ? (fromPureGold * 100) / toPurityData.percentage : 0;
  const alloyToAdd = makeTargetWeight - grams;

  // Calculate values
  const fromRate = fromPurity === "22K" ? city.gold22k : city.gold24k;
  const toRate = toPurity === "22K" ? city.gold22k : city.gold24k;
  
  const fromValue = (fromRate / 10) * grams;
  const toValue = (toRate / 10) * toEquivalentGrams;

  // Get formula text based on mode
  const getFormulaText = () => {
    switch (mode) {
      case "convert":
        return `Weight × (${fromPurity} purity ÷ ${toPurity} purity) = ${formatWeight(toEquivalentGrams, 2)}g`;
      case "analyze":
        return `${weightValue} ${weightUnit.symbol} × (${fromPurityData?.percentage || 0}% ÷ 100) = ${formatWeight(fromPureGold, 2)}g pure gold`;
      case "make":
        return `Pure gold (${formatWeight(fromPureGold, 2)}g) ÷ (${toPurityData?.percentage || 0}% ÷ 100) = ${formatWeight(makeTargetWeight, 2)}g total`;
      default:
        return "";
    }
  };

  // FAQ data
  const faqData = [
    {
      question: "How do I convert 22K gold to 24K gold?",
      answer: "To convert 22K gold to 24K, multiply your 22K weight by 0.916 (the purity of 22K). For example, 10g of 22K gold contains 9.16g of pure 24K gold. Use our converter above with 'Convert Weight' mode for instant calculations."
    },
    {
      question: "What is the formula for gold purity conversion?",
      answer: "The formula is: Equivalent Weight = (Original Weight × Original Purity %) ÷ Target Purity %. For example, converting 10g of 22K to 18K: (10 × 91.6%) ÷ 75% = 12.21g of 18K gold."
    },
    {
      question: "Why does weight increase when converting to lower karat?",
      answer: "Lower karat gold contains less pure gold and more alloy metals. So the same amount of pure gold spreads across more total weight. Converting 10g of 24K to 22K gives you 10.91g because 22K has only 91.6% gold content."
    },
    {
      question: "How much alloy is in 22K gold?",
      answer: "22K gold contains 91.6% pure gold and 8.4% alloy metals (usually copper, silver, or zinc). This alloy makes the gold harder and more suitable for jewellery. Use our 'Analyze Purity' mode to see exact alloy content."
    },
    {
      question: "What is a Tola and how is it used in gold measurement?",
      answer: "A Tola is a traditional South Asian unit of weight equal to 11.6638 grams. It's commonly used in India, Pakistan, and Bangladesh for measuring gold. Our calculator supports Tola along with grams, milligrams, and troy ounces."
    },
    {
      question: "Which gold purity is best for investment?",
      answer: "24K gold (99.9% pure) is best for investment as it holds maximum gold content and is easier to sell at market rates. 22K is preferred for jewellery due to better durability, while 18K offers a balance of purity and strength."
    },
  ];

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
            <p className="mt-3 text-sm text-amber-800">
              Check the current benchmark first:{" "}
              <Link href="/gold-rate-today" className="font-semibold underline hover:text-amber-700">
                gold rate today in India
              </Link>
              .
            </p>
            
            {loading && (
              <div className="mt-4 text-sm text-amber-600">Loading latest rates...</div>
            )}

            {/* Mode Selector Tabs */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {calculationModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-xl px-3 py-3 text-center transition-all ${
                    mode === m.id
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-lg block">{m.icon}</span>
                  <span className="text-xs font-medium block mt-1">{m.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-center text-slate-500">
              {calculationModes.find(m => m.id === mode)?.description}
            </p>

            <div className="mt-6 grid gap-4">
              {/* City Selector */}
              <label className="text-sm font-medium text-slate-600">
                Select city for price calculation
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

              {/* FROM Section */}
              <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  {mode === "analyze" ? "Your Gold" : mode === "make" ? "Source Gold" : "From"}
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
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium text-slate-600">
                      Weight
                      <input
                        type="number"
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={weightValue}
                        onChange={(event) => setWeightValue(Number(event.target.value) || 0)}
                        min={0.01}
                        step={0.01}
                      />
                    </label>
                    <label className="text-sm font-medium text-slate-600">
                      Unit
                      <select
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={weightUnit.id}
                        onChange={(event) => {
                          const selected = weightUnits.find(u => u.id === event.target.value);
                          if (selected) setWeightUnit(selected);
                        }}
                      >
                        {weightUnits.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                
                {fromPurityData && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Pure gold content:</span>
                      <span className="font-semibold text-amber-700">{formatWeight(fromPureGold, 2)}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Alloy content:</span>
                      <span className="font-semibold text-slate-500">{formatWeight(fromAlloyContent, 2)}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Approximate value:</span>
                      <span className="font-semibold">₹{formatCurrency(fromValue)}</span>
                    </div>
                    {weightUnit.id !== "grams" && (
                      <div className="flex justify-between text-slate-500 text-xs pt-1 border-t border-slate-200">
                        <span>Weight in grams:</span>
                        <span>{formatWeight(grams, 2)}g</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Swap Button - Only for Convert Mode */}
              {mode === "convert" && (
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
              )}

              {/* MODE: CONVERT - To Section */}
              {mode === "convert" && (
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
                          {formatWeight(toEquivalentGrams, 2)}g
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Alloy in result:</span>
                        <span className="font-semibold text-slate-500">
                          {formatWeight(toAlloyContent, 2)}g
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
              )}

              {/* MODE: ANALYZE - Results */}
              {mode === "analyze" && fromPurityData && (
                <div className="rounded-3xl border-2 border-purple-200 bg-purple-50/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">
                    Analysis Result
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                        <p className="text-xs text-slate-500 uppercase">Pure Gold (24K)</p>
                        <p className="text-2xl font-bold text-amber-600">{formatWeight(fromPureGold, 2)}g</p>
                        <p className="text-xs text-slate-500">{fromPurityData.percentage}% of total</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                        <p className="text-xs text-slate-500 uppercase">Alloy Metals</p>
                        <p className="text-2xl font-bold text-slate-600">{formatWeight(fromAlloyContent, 2)}g</p>
                        <p className="text-xs text-slate-500">{(100 - fromPurityData.percentage).toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500 uppercase mb-2">Composition Breakdown</p>
                      <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500" 
                          style={{ width: `${fromPurityData.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span className="text-amber-600">Gold: {fromPurityData.percentage}%</span>
                        <span className="text-slate-500">Alloy: {(100 - fromPurityData.percentage).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE: MAKE - Target Section */}
              {mode === "make" && (
                <div className="rounded-3xl border-2 border-blue-200 bg-blue-50/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                    Target Karat
                  </p>
                  <div className="mt-3">
                    <label className="text-sm font-medium text-slate-600">
                      Target Purity
                      <select
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={toPurity}
                        onChange={(event) => setToPurity(event.target.value)}
                      >
                        {purityData
                          .filter(p => p.percentage < (fromPurityData?.percentage || 100))
                          .map((p) => (
                            <option key={p.karat} value={p.karat}>
                              {p.karat} ({p.percentage}%)
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                  
                  {toPurityData && fromPurityData && toPurityData.percentage < fromPurityData.percentage && (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase mb-3">To make {toPurity} gold:</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Your {fromPurity} gold:</span>
                            <span className="font-semibold">{formatWeight(grams, 2)}g</span>
                          </div>
                          <div className="flex justify-between items-center text-blue-700">
                            <span>+ Alloy to add:</span>
                            <span className="font-bold text-lg">{formatWeight(alloyToAdd, 2)}g</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600">= Total {toPurity} gold:</span>
                            <span className="font-bold text-green-700 text-lg">{formatWeight(makeTargetWeight, 2)}g</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Note: This calculation shows the theoretical alloy needed. Actual jewellery making involves specific alloy compositions (copper, silver, zinc) based on desired color and properties.
                      </p>
                    </div>
                  )}
                  {toPurityData && fromPurityData && toPurityData.percentage >= fromPurityData.percentage && (
                    <div className="mt-4 p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Select a lower karat than {fromPurity} to calculate alloy addition. You cannot make higher purity gold by adding alloy.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Formula Display */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📐</span>
                <h3 className="text-sm font-semibold text-slate-700">Formula Used</h3>
              </div>
              <code className="block text-xs text-slate-600 bg-white rounded-lg p-3 font-mono">
                {getFormulaText()}
              </code>
            </div>

            {/* Understanding Gold Purity */}
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
                <li><strong>24K Gold</strong> - 99.9% pure, best for <Link href="/investment-calculator" className="text-amber-600 hover:underline">gold investment</Link></li>
                <li><strong>22K Gold</strong> - 91.6% pure, standard for Indian jewellery</li>
                <li><strong>18K Gold</strong> - 75% pure, common in international markets</li>
                <li><strong>14K Gold</strong> - 58.3% pure, popular in Western countries</li>
                <li><strong>9K Gold</strong> - 37.5% pure, standard in UK/Australia</li>
              </ul>
              <p className="mt-3 text-xs text-blue-700">
                <Link href="/calculator" className="text-amber-600 hover:underline">Calculate jewellery cost</Link> with different purities • 
                <Link href="/hallmark-guide" className="text-amber-600 hover:underline ml-1">Verify purity marks</Link>
              </p>
            </div>

            {/* Gold Purity Reference Table */}
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

            {/* Related Tools */}
            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50/50 p-4">
              <h2 className="text-sm font-semibold text-green-900">
                🛠️ Related Tools
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/calculator" className="text-xs text-green-700 hover:underline">Gold Calculator</Link>
                <span className="text-slate-300">•</span>
                <Link href="/wastage-calculator" className="text-xs text-green-700 hover:underline">Wastage Calculator</Link>
                <span className="text-slate-300">•</span>
                <Link href="/hallmark-guide" className="text-xs text-green-700 hover:underline">Hallmark Guide</Link>
                <span className="text-slate-300">•</span>
                <Link href="/investment-calculator" className="text-xs text-green-700 hover:underline">Investment Calculator</Link>
                <span className="text-slate-300">•</span>
                <Link href="/gold-rate-today" className="text-xs text-green-700 hover:underline">Today&apos;s Gold Rate</Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faqData.map((faq, index) => (
                  <div 
                    key={index} 
                    className="rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">{faq.question}</span>
                      <svg 
                        className={`w-5 h-5 text-slate-400 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {faqOpen === index && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-slate-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
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

