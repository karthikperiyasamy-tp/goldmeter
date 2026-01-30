"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import CalculatorSwitcher from "../components/CalculatorSwitcher";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

// LTV ratios by bank type
const ltvRatios = [
  { label: "Banks (75% LTV)", value: 0.75 },
  { label: "NBFCs (65% LTV)", value: 0.65 },
  { label: "Gold Loan Companies (60% LTV)", value: 0.60 },
];

export default function GoldLoanCalculatorPage() {
  const [goldPrice, setGoldPrice] = useState(7450); // per gram 24K
  const [goldWeight, setGoldWeight] = useState(50); // grams
  const [purity, setPurity] = useState<"24K" | "22K" | "18K">("22K");
  const [ltv, setLtv] = useState(0.75);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(12); // months
  const [loading, setLoading] = useState(true);

  // Purity multipliers
  const purityMultiplier = {
    "24K": 1,
    "22K": 22 / 24,
    "18K": 18 / 24,
  };

  // Fetch latest gold rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetch('/api/calculator-rates');
        const data = await response.json();
        if (data.success && data.rates?.[0]) {
          setGoldPrice(Math.round(data.rates[0].gold24k / 10));
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
    // Calculate gold value based on purity
    const effectiveGoldPrice = goldPrice * purityMultiplier[purity];
    const totalGoldValue = effectiveGoldPrice * goldWeight;
    
    // Loan amount based on LTV
    const maxLoanAmount = Math.round(totalGoldValue * ltv);
    
    // Monthly interest
    const monthlyRate = interestRate / 100 / 12;
    const monthlyInterest = maxLoanAmount * monthlyRate;
    
    // Total interest for tenure
    const totalInterest = monthlyInterest * tenure;
    
    // EMI calculation (for regular EMI scheme)
    const emi = maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
      (Math.pow(1 + monthlyRate, tenure) - 1);
    
    // Total repayment
    const totalRepayment = emi * tenure;
    
    return {
      totalGoldValue: Math.round(totalGoldValue),
      maxLoanAmount,
      monthlyInterest: Math.round(monthlyInterest),
      totalInterest: Math.round(totalInterest),
      emi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      effectiveGoldPrice: Math.round(effectiveGoldPrice),
    };
  }, [goldWeight, goldPrice, purity, ltv, interestRate, tenure, purityMultiplier]);

  const handleShare = async () => {
    const shareData = {
      title: 'Gold Loan Calculator - GoldMeter',
      text: `With ${goldWeight}g of ${purity} gold, I can get a loan of up to ₹${formatCurrency(result.maxLoanAmount)} at ${interestRate}% interest!`,
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
              Gold Loan Calculator
            </h1>
            <p className="text-sm text-slate-600">
              Calculate how much loan you can get against your gold jewellery.
            </p>
            
            {loading && (
              <div className="mt-4 text-sm text-amber-600">Loading latest gold rate...</div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-600">
                Gold weight (grams)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(Number(e.target.value) || 0)}
                  min={1}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Gold purity
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={purity}
                  onChange={(e) => setPurity(e.target.value as "24K" | "22K" | "18K")}
                >
                  <option value="24K">24K (99.9% pure)</option>
                  <option value="22K">22K (91.6% pure) - Most jewellery</option>
                  <option value="18K">18K (75% pure)</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Current 24K gold price (₹/gram)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Number(e.target.value) || 0)}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Lender type (LTV ratio)
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={ltv}
                  onChange={(e) => setLtv(Number(e.target.value))}
                >
                  {ltvRatios.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Interest rate (% per annum)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  step={0.5}
                  min={7}
                  max={24}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Loan tenure (months)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={tenure}
                  onChange={(e) => setTenure(Math.max(1, Math.min(120, Number(e.target.value) || 1)))}
                  min={1}
                  max={120}
                  step={1}
                />
                <span className="text-xs text-slate-400 mt-1 block">Enter 1-120 months (10 years max)</span>
              </label>
            </div>

            <section className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
              <h2 className="text-lg font-semibold">Loan Eligibility</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Gold Value ({purity})</p>
                  <p className="text-2xl font-bold text-charcoal">₹{formatCurrency(result.totalGoldValue)}</p>
                  <p className="text-xs text-slate-500">{goldWeight}g × ₹{formatCurrency(result.effectiveGoldPrice)}/g</p>
                </div>
                <div className="rounded-2xl bg-white p-4 border-2 border-amber-400">
                  <p className="text-xs text-slate-500">Maximum Loan Amount</p>
                  <p className="text-2xl font-bold text-amber-600">₹{formatCurrency(result.maxLoanAmount)}</p>
                  <p className="text-xs text-slate-500">{ltv * 100}% of gold value</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Monthly Interest</p>
                  <p className="text-2xl font-bold text-charcoal">₹{formatCurrency(result.monthlyInterest)}</p>
                  <p className="text-xs text-slate-500">on max loan amount</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Monthly EMI</p>
                  <p className="text-2xl font-bold text-charcoal">₹{formatCurrency(result.emi)}</p>
                  <p className="text-xs text-slate-500">for {tenure} months</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Interest ({tenure} months)</span>
                  <span className="font-semibold text-rose-600">₹{formatCurrency(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-600">Total Repayment</span>
                  <span className="font-semibold">₹{formatCurrency(result.totalRepayment)}</span>
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
              <p className="font-semibold text-charcoal">💡 Gold Loan Tips</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Banks offer lower interest rates (7-12%) vs NBFCs (12-24%)</li>
                <li>RBI allows max 75% LTV for gold loans</li>
                <li>Keep gold valuation certificate handy for better rates</li>
                <li>Compare processing fees (0.5-2% of loan amount)</li>
              </ul>
            </section>
          </div>
          
          <div className="lg:sticky lg:top-6 lg:self-start print:hidden">
            <CalculatorSwitcher />
          </div>
        </div>

        <section className="mt-10 grid gap-3 md:grid-cols-3 print:hidden">
          <Link
            href="/investment-calculator"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold investment calculator → Plan your gold SIP.
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

