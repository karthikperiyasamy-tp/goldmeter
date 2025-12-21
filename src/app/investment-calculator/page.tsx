"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import CalculatorSwitcher from "../components/CalculatorSwitcher";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

export default function InvestmentCalculatorPage() {
  const [goldPrice, setGoldPrice] = useState(7450); // per gram 24K
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(8); // Annual gold appreciation %
  const [loading, setLoading] = useState(true);

  // Fetch latest gold rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetch('/api/calculator-rates');
        const data = await response.json();
        if (data.success && data.rates?.[0]) {
          setGoldPrice(Math.round(data.rates[0].gold24k / 10)); // Convert to per gram
        }
      } catch (error) {
        console.error('Failed to fetch rate:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    
    // Total invested amount
    const totalInvested = monthlyInvestment * months;
    
    // Future value with compound interest (SIP formula)
    // FV = P * [(1+r)^n - 1] / r * (1+r)
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    // Gold accumulated (in grams) - assuming buying at current price monthly
    const goldAccumulated = totalInvested / goldPrice;
    
    // Estimated gold value after appreciation
    const appreciatedGoldPrice = goldPrice * Math.pow(1 + expectedReturn / 100, years);
    const estimatedValue = goldAccumulated * appreciatedGoldPrice;
    
    // Wealth gained
    const wealthGained = futureValue - totalInvested;
    
    return {
      totalInvested,
      futureValue: Math.round(futureValue),
      goldAccumulated: goldAccumulated.toFixed(2),
      appreciatedGoldPrice: Math.round(appreciatedGoldPrice),
      estimatedValue: Math.round(estimatedValue),
      wealthGained: Math.round(wealthGained),
      returnPercentage: ((futureValue - totalInvested) / totalInvested * 100).toFixed(1),
    };
  }, [monthlyInvestment, years, expectedReturn, goldPrice]);

  const handleShare = async () => {
    const shareData = {
      title: 'Gold Investment Calculator - GoldMeter',
      text: `If I invest ₹${formatCurrency(monthlyInvestment)}/month in gold for ${years} years, I could accumulate ${result.goldAccumulated}g of gold worth ₹${formatCurrency(result.futureValue)}!`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-amber-50 py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft print:shadow-none print:border-0">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4 print:hidden"
            >
              ← Back to Home
            </Link>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Gold tools
            </p>
            <h1 className="mt-2 text-3xl font-bold text-charcoal">
              Gold Investment Calculator (SIP)
            </h1>
            <p className="text-sm text-slate-600">
              Plan your monthly gold investment and see potential returns over time.
            </p>
            
            {loading && (
              <div className="mt-4 text-sm text-amber-600">Loading latest gold rate...</div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-600">
                Monthly investment (₹)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)}
                  min={500}
                  step={500}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Investment period (years)
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                >
                  {[1, 2, 3, 5, 7, 10, 15, 20].map((y) => (
                    <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Current gold price (₹/gram 24K)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Number(e.target.value) || 0)}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Expected annual return (%)
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                >
                  <option value={5}>5% (Conservative)</option>
                  <option value={8}>8% (Moderate)</option>
                  <option value={10}>10% (Optimistic)</option>
                  <option value={12}>12% (Aggressive)</option>
                </select>
              </label>
            </div>

            <section className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
              <h2 className="text-lg font-semibold">Investment Summary</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Total Investment</p>
                  <p className="text-2xl font-bold text-charcoal">₹{formatCurrency(result.totalInvested)}</p>
                  <p className="text-xs text-slate-500">over {years} years</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Estimated Value</p>
                  <p className="text-2xl font-bold text-emerald-600">₹{formatCurrency(result.futureValue)}</p>
                  <p className="text-xs text-emerald-600">+{result.returnPercentage}% return</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Gold Accumulated</p>
                  <p className="text-2xl font-bold text-amber-600">{result.goldAccumulated}g</p>
                  <p className="text-xs text-slate-500">24K pure gold</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Wealth Gained</p>
                  <p className="text-2xl font-bold text-emerald-600">₹{formatCurrency(result.wealthGained)}</p>
                  <p className="text-xs text-slate-500">profit from investment</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold print:hidden">
                <button 
                  onClick={handleShare}
                  className="flex-1 rounded-full bg-amber-600 px-4 py-2 text-white shadow-soft hover:bg-amber-700"
                >
                  📤 Share Results
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 rounded-full border border-amber-200 px-4 py-2 text-amber-600 hover:bg-amber-50"
                >
                  🖨️ Print
                </button>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-charcoal">💡 Investment Tips</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Gold has historically given 8-10% annual returns in India</li>
                <li>Consider digital gold or Gold ETFs for easier SIP investments</li>
                <li>Physical gold has additional making charges (8-25%)</li>
                <li>Gold is a hedge against inflation and currency depreciation</li>
              </ul>
            </section>
          </div>
          
          <div className="lg:sticky lg:top-6 lg:self-start print:hidden">
            <CalculatorSwitcher />
          </div>
        </div>

        <section className="mt-10 grid gap-3 md:grid-cols-3 print:hidden">
          <Link
            href="/gold-loan-calculator"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold loan calculator → Check how much loan you can get.
          </Link>
          <Link
            href="/wedding-gold-planner"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Wedding gold planner → Plan gold for your wedding.
          </Link>
          <Link
            href="/calculator"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold price calculator → Calculate jewellery cost with GST.
          </Link>
        </section>
      </div>
    </main>
  );
}

