"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CalculatorSwitcher from "../components/CalculatorSwitcher";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

// Format large numbers in words (Indian numbering system)
const formatInWords = (value: number): string => {
  if (value >= 10000000) {
    const crores = value / 10000000;
    return crores % 1 === 0 ? `${crores} Crore` : `${crores.toFixed(2)} Crore`;
  } else if (value >= 100000) {
    const lakhs = value / 100000;
    return lakhs % 1 === 0 ? `${lakhs} Lakh` : `${lakhs.toFixed(2)} Lakh`;
  } else if (value >= 1000) {
    const thousands = value / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return formatCurrency(value);
};

export default function SIPCalculatorPage() {
  const [initialLumpsum, setInitialLumpsum] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [showInflationAdjusted, setShowInflationAdjusted] = useState(false);
  const [inflationRate, setInflationRate] = useState(6);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const annualRate = expectedReturn / 100;

    // Lumpsum future value
    const lumpsumFV = initialLumpsum * Math.pow(1 + annualRate, years);

    // SIP future value
    const sipFV =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    // Total values
    const totalInvested = initialLumpsum + monthlyInvestment * months;
    const futureValue = lumpsumFV + sipFV;
    const estimatedReturns = futureValue - totalInvested;

    // Year-by-year breakdown for table and chart
    const yearlyBreakdown = [];
    for (let year = 1; year <= years; year++) {
      const monthsCompleted = year * 12;
      
      // Lumpsum portion
      const lumpsumValue = initialLumpsum * Math.pow(1 + annualRate, year);
      
      // SIP portion
      const sipValue =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) *
        (1 + monthlyRate);
      
      const invested = initialLumpsum + monthlyInvestment * monthsCompleted;
      const totalValue = lumpsumValue + sipValue;
      const returns = totalValue - invested;

      yearlyBreakdown.push({
        year,
        invested: Math.round(invested),
        returns: Math.round(returns),
        totalValue: Math.round(totalValue),
      });
    }

    // Calculate inflation-adjusted (today's) value
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    const todaysValue = Math.round(futureValue / inflationFactor);

    return {
      totalInvested,
      futureValue: Math.round(futureValue),
      estimatedReturns: Math.round(estimatedReturns),
      lumpsumFV: Math.round(lumpsumFV),
      sipFV: Math.round(sipFV),
      yearlyBreakdown,
      todaysValue,
    };
  }, [initialLumpsum, monthlyInvestment, years, expectedReturn, inflationRate]);

  // Calculate percentages for donut chart
  const investedPercent =
    (result.totalInvested / result.futureValue) * 100 || 0;
  const returnsPercent = 100 - investedPercent;

  // Get max value for bar chart
  const maxValue = Math.max(...result.yearlyBreakdown.map((r) => r.totalValue));

  const handleShare = async () => {
    const shareData = {
      title: "SIP Calculator - GoldMeter",
      text: `If I invest ${initialLumpsum > 0 ? `₹${formatCurrency(initialLumpsum)} lumpsum + ` : ''}₹${formatCurrency(monthlyInvestment)}/month for ${years} years at ${expectedReturn}% returns, I could get ₹${formatCurrency(result.futureValue)}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Link copied to clipboard!");
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
              Financial Tools
            </p>
            <h1 className="mt-2 text-3xl font-bold text-charcoal">
              SIP Calculator
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Calculate returns on your Systematic Investment Plan (SIP) and see
              how your money can grow with the power of compounding.
            </p>

            {/* Input Section */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-600">
                Initial Lumpsum Investment (₹)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={initialLumpsum}
                  onChange={(e) =>
                    setInitialLumpsum(Math.max(0, Number(e.target.value) || 0))
                  }
                  min={0}
                  step={10000}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={initialLumpsum}
                  onChange={(e) => setInitialLumpsum(Number(e.target.value))}
                  min={0}
                  max={100000000}
                  step={100000}
                />
                <span className="text-xs text-amber-600 font-medium block mt-1">
                  ₹{formatCurrency(initialLumpsum)} ({formatInWords(initialLumpsum)})
                </span>
                <span className="text-xs text-slate-400 block">
                  Optional: One-time investment before starting SIP
                </span>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Monthly Investment (₹)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={monthlyInvestment}
                  onChange={(e) =>
                    setMonthlyInvestment(Math.max(500, Number(e.target.value) || 500))
                  }
                  min={500}
                  step={500}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  min={500}
                  max={500000}
                  step={500}
                />
                <span className="text-xs text-amber-600 font-medium block mt-1">
                  ₹{formatCurrency(monthlyInvestment)} ({formatInWords(monthlyInvestment)})
                </span>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Expected Return Rate (% p.a.)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={expectedReturn}
                  onChange={(e) =>
                    setExpectedReturn(
                      Math.max(1, Math.min(30, Number(e.target.value) || 1))
                    )
                  }
                  min={1}
                  max={30}
                  step={0.5}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  min={1}
                  max={30}
                  step={0.5}
                />
                <span className="text-xs text-amber-600 font-medium block mt-1">
                  {expectedReturn}% per annum
                </span>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Time Period (Years)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={years}
                  onChange={(e) =>
                    setYears(
                      Math.max(1, Math.min(50, Number(e.target.value) || 1))
                    )
                  }
                  min={1}
                  max={50}
                  step={1}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min={1}
                  max={50}
                  step={1}
                />
                <span className="text-xs text-amber-600 font-medium block mt-1">
                  {years} {years === 1 ? 'Year' : 'Years'}
                </span>
              </label>
            </div>

            {/* Results Section */}
            <section className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
              <h2 className="text-lg font-semibold text-charcoal">
                Investment Summary
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Summary Cards */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <p className="text-xs text-slate-500">Total Invested</p>
                    <p className="text-2xl font-bold text-charcoal">
                      ₹{formatCurrency(result.totalInvested)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatInWords(result.totalInvested)}
                    </p>
                    {initialLumpsum > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        (Lumpsum: ₹{formatCurrency(initialLumpsum)} + SIP: ₹{formatCurrency(result.totalInvested - initialLumpsum)})
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <p className="text-xs text-slate-500">Est. Returns</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{formatCurrency(result.estimatedReturns)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatInWords(result.estimatedReturns)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white">
                    <p className="text-xs text-amber-100">Total Value (After {years} years)</p>
                    <p className="text-3xl font-bold">
                      ₹{formatCurrency(result.futureValue)}
                    </p>
                    <p className="text-xs text-amber-100 mt-1">
                      {formatInWords(result.futureValue)}
                    </p>
                  </div>
                  
                  {/* Today's Value Section */}
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500">Today&apos;s Value (Inflation Adjusted)</p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showInflationAdjusted}
                          onChange={(e) => setShowInflationAdjusted(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span className="text-xs text-slate-500">Show</span>
                      </label>
                    </div>
                    {showInflationAdjusted && (
                      <>
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{formatCurrency(result.todaysValue)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatInWords(result.todaysValue)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-slate-500">Inflation Rate:</span>
                          <input
                            type="number"
                            value={inflationRate}
                            onChange={(e) => setInflationRate(Math.max(0, Math.min(15, Number(e.target.value) || 0)))}
                            className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg"
                            min={0}
                            max={15}
                            step={0.5}
                          />
                          <span className="text-xs text-slate-500">%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Worth ₹{formatCurrency(result.todaysValue)} in today&apos;s purchasing power
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full -rotate-90"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        strokeDasharray={`${investedPercent * 2.51} 251`}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray={`${returnsPercent * 2.51} 251`}
                        strokeDashoffset={`-${investedPercent * 2.51}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-lg font-bold text-charcoal">
                        {formatInWords(result.futureValue)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-slate-600">Invested ({investedPercent.toFixed(0)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-600">Returns ({returnsPercent.toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Chart */}
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Wealth Growth Over Time
                </p>
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="relative h-48">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-6 w-20 flex flex-col justify-between text-xs text-slate-400">
                      <span>{formatInWords(maxValue)}</span>
                      <span>{formatInWords(maxValue / 2)}</span>
                      <span>₹0</span>
                    </div>
                    {/* Chart area */}
                    <div className="ml-20 h-full flex items-end gap-0.5 pb-6">
                      {result.yearlyBreakdown.map((row, index) => {
                        const totalHeight = maxValue > 0 ? (row.totalValue / maxValue) * 100 : 0;
                        const investedHeight = maxValue > 0 ? (row.invested / maxValue) * 100 : 0;
                        const showLabel = index === 0 || 
                          index === result.yearlyBreakdown.length - 1 || 
                          (years <= 20 ? (index + 1) % 2 === 0 : (index + 1) % 5 === 0);
                        return (
                          <div
                            key={row.year}
                            className="flex-1 flex flex-col items-center justify-end h-full relative group"
                            title={`Year ${row.year}: ₹${formatCurrency(row.totalValue)}`}
                          >
                            {/* Returns portion (top) */}
                            <div
                              className="w-full min-w-[3px] bg-emerald-400 rounded-t-sm"
                              style={{ height: `${Math.max(totalHeight - investedHeight, 0)}%` }}
                            />
                            {/* Invested portion (bottom) */}
                            <div
                              className="w-full min-w-[3px] bg-blue-400"
                              style={{ height: `${investedHeight}%` }}
                            />
                            {/* Tooltip on hover */}
                            <div className="hidden group-hover:block absolute bottom-full mb-2 bg-charcoal text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              Year {row.year}: {formatInWords(row.totalValue)}
                            </div>
                            {showLabel && (
                              <span className="text-[9px] text-slate-400 mt-1 absolute bottom-0 transform translate-y-full">
                                {row.year}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-blue-400"></span>
                      Invested
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-emerald-400"></span>
                      Returns
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold print:hidden">
                <button
                  onClick={handleShare}
                  className="flex-1 rounded-full bg-amber-600 px-4 py-2 text-white shadow-soft hover:bg-amber-700 transition-colors"
                >
                  📤 Share Results
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 rounded-full border border-amber-200 px-4 py-2 text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  🖨️ Print
                </button>
              </div>
            </section>

            {/* Year-by-Year Growth Table */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-charcoal mb-4">
                Year-by-Year Growth
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Year
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Invested (₹)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Returns (₹)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Total Value (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-amber-50/30">
                        <td className="px-4 py-3 font-medium text-charcoal">
                          {row.year}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {formatCurrency(row.invested)}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                          {formatCurrency(row.returns)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-charcoal">
                          {formatCurrency(row.totalValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start print:hidden">
            <CalculatorSwitcher />
          </div>
        </div>

        {/* Related Links */}
        <section className="mt-10 grid gap-3 md:grid-cols-3 print:hidden">
          <Link
            href="/sip-calculator-with-step-up"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            SIP Calculator with Step Up → Calculate SIP with yearly increases.
          </Link>
          <Link
            href="/swp-calculator-with-inflation"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            SWP Calculator → Plan systematic withdrawals with inflation.
          </Link>
          <Link
            href="/investment-calculator"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold Investment Calculator → Calculate gold SIP returns.
          </Link>
          <Link
            href="/gold-rate-today"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Today&apos;s gold rate → Compare gold vs mutual fund returns.
          </Link>
          <Link
            href="/calculator"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold Calculator → Calculate gold jewellery cost.
          </Link>
          <Link
            href="/news"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Market News → Gold market updates and analysis.
          </Link>
        </section>

        {/* Comprehensive Content Section */}
        <section className="mt-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft print:shadow-none">
          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-charcoal mb-4">
              What is SIP Calculator?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A SIP Calculator is a powerful online tool that helps investors estimate the potential returns on their Systematic Investment Plan investments in mutual funds. SIP, or Systematic Investment Plan, is a method of investing a fixed amount of money at regular intervals (usually monthly) in mutual fund schemes. The SIP calculator takes into account your monthly investment amount, expected rate of return, and investment tenure to project how much wealth you could potentially accumulate over time.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our SIP calculator also supports an optional initial lumpsum investment, allowing you to combine a one-time investment with regular monthly SIP contributions. This is particularly useful if you have received a bonus, inheritance, or any windfall that you want to invest along with your regular SIP. The calculator uses the compound interest formula to calculate future values, giving you a realistic estimate of your investment growth.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Understanding Today&apos;s Value (Inflation-Adjusted)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              One of the most important features of this calculator is the &quot;Today&apos;s Value&quot; or inflation-adjusted value. This tells you what your future corpus will be worth in today&apos;s purchasing power. Due to inflation, the value of money decreases over time - what you can buy with ₹100 today will cost more in the future.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              For example, if your SIP grows to ₹1 crore in 20 years, assuming 6% annual inflation, its real value in today&apos;s terms would be approximately ₹31 lakhs. This helps you plan more accurately - if you need ₹1 crore in today&apos;s purchasing power after 20 years, you&apos;ll actually need to accumulate around ₹3.2 crores! Enable the inflation adjustment feature to see this realistic picture.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              What is SIP (Systematic Investment Plan)?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Systematic Investment Plan (SIP) is an investment vehicle offered by mutual fund companies that allows investors to invest a fixed amount regularly, rather than making a lump sum investment. Think of it as a recurring deposit, but instead of a bank account, your money goes into market-linked mutual funds with potentially higher returns. SIPs have revolutionized mutual fund investing in India, making it accessible to everyone regardless of their income level.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              With SIP, you can start investing with amounts as low as ₹500 per month in many mutual fund schemes. The investment happens automatically on a predetermined date each month through auto-debit from your bank account. This automation removes the emotional aspect of investing - you invest regardless of whether markets are up or down, which actually works in your favor through a concept called rupee cost averaging.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              How Does SIP Calculator Work?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The SIP calculator works by applying the future value of annuity formula, which accounts for regular investments made at periodic intervals. When you enter your monthly investment amount, expected annual return rate, and investment period, the calculator converts the annual return to a monthly rate and computes how each monthly investment will grow over the remaining period.
            </p>
            <div className="bg-slate-100 p-4 rounded-xl mb-4">
              <p className="font-semibold text-charcoal mb-2">SIP Calculator Formula:</p>
              <p className="font-mono text-sm text-slate-700">
                M = P × ((1 + i)<sup>n</sup> - 1) / i × (1 + i)
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Where: M = Maturity amount, P = Monthly investment, i = Monthly interest rate (Annual rate / 12 converted using compound formula), n = Total number of months
              </p>
              <p className="font-semibold text-charcoal mb-2 mt-4">For Lumpsum + SIP:</p>
              <p className="font-mono text-sm text-slate-700">
                Total Value = Lumpsum × (1 + r)<sup>years</sup> + SIP Future Value
              </p>
              <p className="font-semibold text-charcoal mb-2 mt-4">Today&apos;s Value (Inflation Adjusted):</p>
              <p className="font-mono text-sm text-slate-700">
                Today&apos;s Value = Future Value ÷ (1 + inflation)<sup>years</sup>
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Benefits of SIP Investment
            </h2>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-3"><strong>1. Rupee Cost Averaging:</strong> This is perhaps the most significant advantage of SIP. When markets are down, your fixed SIP amount buys more mutual fund units. When markets are up, you buy fewer units. Over time, this averages out your purchase cost, reducing the impact of market volatility.</p>
              <p className="mb-3"><strong>2. Power of Compounding:</strong> Albert Einstein reportedly called compound interest the &quot;eighth wonder of the world.&quot; In SIP, your returns earn returns, creating a snowball effect. A ₹5,000 monthly SIP at 12% for 20 years grows to ₹49.9 lakhs - you invest only ₹12 lakhs, but earn ₹37.9 lakhs in returns!</p>
              <p className="mb-3"><strong>3. Disciplined Investing:</strong> SIP instills financial discipline by automating your investments. The money is deducted from your account before you can spend it elsewhere.</p>
              <p className="mb-3"><strong>4. Flexibility:</strong> SIPs are highly flexible. You can start with as low as ₹500/month, increase or decrease the amount anytime, pause during financial emergencies, or stop completely without any penalty.</p>
              <p className="mb-3"><strong>5. Lumpsum + SIP Combination:</strong> As our calculator shows, you can combine an initial lumpsum with regular SIP for even better results. This is ideal when you have some savings plus regular income to invest.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              How to Use This SIP Calculator
            </h2>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-2"><strong>Step 1 - Enter Initial Lumpsum (Optional):</strong> If you have a one-time amount to invest upfront, enter it here. This could be savings, bonus, or any windfall. Leave it at 0 if you only want to do SIP.</p>
              <p className="mb-2"><strong>Step 2 - Enter Monthly Investment:</strong> Input the amount you plan to invest every month through SIP. You can invest up to ₹5 lakhs monthly.</p>
              <p className="mb-2"><strong>Step 3 - Set Expected Return Rate:</strong> Enter the annual return you expect. For equity funds, 12-15% is reasonable for long-term planning.</p>
              <p className="mb-2"><strong>Step 4 - Choose Time Period:</strong> Select how long you plan to stay invested (up to 50 years). Longer periods benefit more from compounding.</p>
              <p className="mb-2"><strong>Step 5 - Enable Inflation Adjustment:</strong> Toggle &quot;Today&apos;s Value&quot; to see your future corpus in current purchasing power.</p>
              <p className="mb-2"><strong>Step 6 - Review Results:</strong> See your total invested amount, returns, maturity value, and today&apos;s value. The chart shows your wealth growth over time.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-charcoal">What is Today&apos;s Value in the calculator?</p>
                <p className="text-slate-600 mt-1">Today&apos;s Value shows what your future corpus will be worth in today&apos;s purchasing power, after accounting for inflation. It helps you understand the real value of your future wealth and plan accordingly.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Can I invest lumpsum and SIP together?</p>
                <p className="text-slate-600 mt-1">Yes! Our calculator supports this. Enter your initial lumpsum amount along with your monthly SIP. This is a powerful combination where your lumpsum starts compounding immediately while SIP adds regular investments.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">What is the minimum amount required for SIP?</p>
                <p className="text-slate-600 mt-1">Most mutual funds allow SIP starting from ₹500 per month. Some funds have ₹100 or ₹1000 minimums. There&apos;s no maximum limit.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Is SIP safe?</p>
                <p className="text-slate-600 mt-1">SIP itself is just an investment method, not a product. The safety depends on the underlying mutual fund. Equity funds carry market risk, while debt funds have lower risk. However, SIP reduces timing risk through rupee cost averaging.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">What inflation rate should I use?</p>
                <p className="text-slate-600 mt-1">India&apos;s long-term average inflation is around 5-7%. For conservative planning, use 6% inflation rate. For essential expenses like education or healthcare, you may consider 8-10% as these sectors see higher inflation.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Can I withdraw my SIP anytime?</p>
                <p className="text-slate-600 mt-1">Yes, most mutual funds (except ELSS with 3-year lock-in) allow withdrawal anytime. However, equity fund withdrawals within 1 year attract 15% short-term capital gains tax.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
