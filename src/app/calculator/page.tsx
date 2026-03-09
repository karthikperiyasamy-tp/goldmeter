"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import CalculatorSwitcher from "../components/CalculatorSwitcher";
import Script from "next/script";

type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
};

const defaultCityRates: CityRate[] = [
  { name: "India", gold22k: 59200, gold24k: 64500 },
  { name: "Chennai", gold22k: 59680, gold24k: 64890 },
  { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
  { name: "Hyderabad", gold22k: 59390, gold24k: 64580 },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

// Purity options with their gold percentages
const purityOptions = [
  { karat: "24K", percentage: 99.9, description: "Pure gold (investment)" },
  { karat: "23K", percentage: 95.8, description: "Very rare" },
  { karat: "22K", percentage: 91.6, description: "Indian jewellery standard" },
  { karat: "21K", percentage: 87.5, description: "Middle East standard" },
  { karat: "20K", percentage: 83.3, description: "Less common" },
  { karat: "18K", percentage: 75.0, description: "International standard" },
  { karat: "14K", percentage: 58.3, description: "Western jewellery" },
  { karat: "10K", percentage: 41.7, description: "Budget jewellery (US)" },
  { karat: "9K", percentage: 37.5, description: "UK/Australia standard" },
];

export default function CalculatorPage() {
  const [cityRates, setCityRates] = useState<CityRate[]>(defaultCityRates);
  const [city, setCity] = useState<CityRate>(defaultCityRates[0]);
  const [grams, setGrams] = useState(10);
  const [purity, setPurity] = useState("24K");
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
          setCity(data.rates[0]); // Set first city as default
          console.log(`✅ [Calculator] Loaded ${data.rates.length} city rates from ${data.source}`);
        }
      } catch (error) {
        console.error('❌ [Calculator] Failed to fetch rates:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRates();
  }, []);

  // Calculate price based on selected purity
  // For 22K and 24K, use the actual rates; for others, derive from 24K rate
  const selectedPurity = purityOptions.find(p => p.karat === purity);
  const pricePer10g24K = city.gold24k;
  const pricePer10g = purity === "22K" 
    ? city.gold22k 
    : purity === "24K" 
      ? city.gold24k 
      : Math.round((pricePer10g24K * (selectedPurity?.percentage || 99.9)) / 99.9);
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

  // HowTo Schema for AIO - helps AI understand the calculator process
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Gold Jewellery Cost with Making Charges and GST",
    "description": "Step-by-step guide to calculate the exact cost of gold jewellery including gold value, making charges, and GST in India",
    "image": "https://goldmeter.in/og-image.png",
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": "0"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "GoldMeter Gold Calculator"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Your City",
        "text": "Choose your city from the dropdown to get accurate local gold rates. Different cities have different gold prices based on transportation costs and local taxes.",
        "position": 1,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": "Select your city from the dropdown menu to see current gold rates"
        }]
      },
      {
        "@type": "HowToStep",
        "name": "Enter Weight in Grams",
        "text": "Enter the weight of gold jewellery you want to purchase in grams. Common weights are 8 grams (1 sovereign), 10 grams, or the weight mentioned by your jeweller.",
        "position": 2,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": "Type the jewellery weight in the 'Weight (grams)' field"
        }]
      },
      {
        "@type": "HowToStep",
        "name": "Choose Gold Purity",
        "text": "Select gold purity: 24K (99.9% pure, investment grade), 22K (91.6% pure, most common for jewellery), or 18K (75% pure, for diamond-studded designs).",
        "position": 3,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": "Choose between 24K or 22K purity from the dropdown"
        }]
      },
      {
        "@type": "HowToStep",
        "name": "Enter Making Charges Per Gram",
        "text": "Making charges vary from ₹150-600 per gram depending on design complexity. Ask your jeweller for their making charges. Simple designs have lower charges (₹150-250/g), while intricate designs cost more (₹400-600/g).",
        "position": 4,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": "Enter the making charges per gram as quoted by your jeweller"
        }]
      },
      {
        "@type": "HowToStep",
        "name": "View Cost Breakdown",
        "text": "The calculator automatically shows: Gold value (weight × current rate), Making charges (weight × making charge per gram), GST at 3% (on gold value + making charges), and Total Payable Amount.",
        "position": 5,
        "itemListElement": [{
          "@type": "HowToDirection",
          "text": "Review the automatic calculation showing gold value, making charges, GST, and total cost"
        }]
      }
    ],
    "about": {
      "@type": "Thing",
      "name": "Gold Jewellery Price Calculation in India"
    }
  };

  return (
    <>
      {/* HowTo Structured Data for AI/AIO */}
      <Script
        id="calculator-howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      
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
          Gold Price Calculator
        </h1>
        <p className="text-sm text-slate-600">
          Estimate real-time payable amount including making charges & GST.
        </p>
        <p className="mt-3 text-sm text-amber-800">
          Before calculating, check the live benchmark:{" "}
          <Link href="/gold-rate-today" className="font-semibold underline hover:text-amber-700">
            gold rate today in India
          </Link>
          .
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
              onChange={(event) => setPurity(event.target.value)}
            >
              {purityOptions.map((p) => (
                <option key={p.karat} value={p.karat}>
                  {p.karat} ({p.percentage}%) - {p.description}
                </option>
              ))}
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
          <h2 className="text-lg font-semibold">Cost Estimate Breakdown</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span><strong>Gold value</strong></span>
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
              <span><strong>Total Payable Amount</strong></span>
              <span className="text-amber-700">₹{formatCurrency(result.total)}</span>
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

        <section className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <h2 className="font-semibold text-charcoal">💡 How Jewellery Pricing Works</h2>
          <ul className="mt-3 list-disc list-inside space-y-1">
            <li><strong>Gold Rate</strong> - Base price per gram (changes daily based on market). <Link href="/gold-rate-today" className="text-amber-600 hover:underline">Check today&apos;s gold rate</Link></li>
            <li><strong>Making Charges</strong> - Labour cost, typically ₹150-600 per gram</li>
            <li><strong>GST</strong> - 3% on gold value + 5% on making charges</li>
            <li><strong>Wastage</strong> - Gold lost during manufacturing (3-20%). <Link href="/wastage-calculator" className="text-amber-600 hover:underline">Calculate wastage charges</Link></li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Need to <Link href="/purity-converter" className="text-amber-600 hover:underline">convert between gold purities</Link>? Always <Link href="/hallmark-guide" className="text-amber-600 hover:underline">verify BIS hallmark</Link> before buying.
          </p>
        </section>
          </div>
          
          {/* Calculator Switcher Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <CalculatorSwitcher />
          </div>
        </div>

      <section className="mt-10 grid gap-3 md:grid-cols-3">
        <Link
          href="/wastage-calculator"
          className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Wastage Calculator → calculate wastage & making charges.
        </Link>
        <Link
          href="/hallmark-guide"
          className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Hallmark Guide → verify BIS hallmark & purity codes.
        </Link>
        <Link
          href="/jewellers"
          className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Compare Jewellers → making charges across brands.
        </Link>
        <Link
          href="/silver-rate"
          className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Silver rate today → ₹/kg with 30-day history.
        </Link>
        <Link
          href="/news"
          className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Gold news → daily headlines and market movers.
        </Link>
        <Link
          href="/news/recap"
          className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Daily recap → quick AI summary of gold price signals.
        </Link>
        <Link
          href="/gold-rate/chennai"
          className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Gold rate in Chennai today → per gram with charts.
        </Link>
        <Link
          href="/gold-rate/mumbai"
          className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Gold rate in Mumbai today → 22K / 24K per gram.
        </Link>
        <Link
          href="/gold-rate/delhi"
          className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
        >
          Gold rate in Delhi today → compare trends & FAQs.
        </Link>
      </section>
      </div>
    </main>
    </>
  );
}

