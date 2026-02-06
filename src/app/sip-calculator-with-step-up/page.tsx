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

type InvestmentMode = "sip" | "stepup" | "lumpsum";

export default function StepUpSIPCalculatorPage() {
  const [mode, setMode] = useState<InvestmentMode>("stepup");
  const [initialLumpsum, setInitialLumpsum] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualStepUp, setAnnualStepUp] = useState(10);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [showInflationAdjusted, setShowInflationAdjusted] = useState(false);
  const [inflationRate, setInflationRate] = useState(6);

  const result = useMemo(() => {
    const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const annualRate = expectedReturn / 100;

    // Lumpsum future value for combined option (same for both SIP modes)
    const combinedLumpsumFV = initialLumpsum * Math.pow(1 + annualRate, years);

    // Regular SIP calculation
    const calculateRegularSIP = () => {
      const months = years * 12;
      const sipInvested = monthlyInvestment * months;
      const totalInvested = initialLumpsum + sipInvested;
      const sipFV =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
      const futureValue = combinedLumpsumFV + sipFV;

      // Year-by-year breakdown
      const yearlyBreakdown = [];
      for (let year = 1; year <= years; year++) {
        const monthsCompleted = year * 12;
        const lumpsumValue = initialLumpsum * Math.pow(1 + annualRate, year);
        const sipValue =
          monthlyInvestment *
          ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) *
          (1 + monthlyRate);
        const invested = initialLumpsum + monthlyInvestment * monthsCompleted;
        const totalValue = lumpsumValue + sipValue;

        yearlyBreakdown.push({
          year,
          sipAmount: monthlyInvestment,
          yearlyInvestment: monthlyInvestment * 12,
          cumulativeInvested: Math.round(invested),
          estimatedValue: Math.round(totalValue),
        });
      }

      return { 
        totalInvested, 
        futureValue: Math.round(futureValue),
        yearlyBreakdown,
      };
    };

    // Step-up SIP calculation
    const calculateStepUpSIP = () => {
      let sipInvested = 0;
      let sipFV = 0;
      let currentSIP = monthlyInvestment;
      const yearlyBreakdown = [];

      for (let year = 1; year <= years; year++) {
        const monthsRemaining = (years - year + 1) * 12;

        for (let month = 0; month < 12; month++) {
          sipInvested += currentSIP;
          const monthsLeft = monthsRemaining - month;
          sipFV += currentSIP * Math.pow(1 + monthlyRate, monthsLeft);
        }

        // Lumpsum value at this year
        const lumpsumValue = initialLumpsum * Math.pow(1 + annualRate, year);

        yearlyBreakdown.push({
          year,
          sipAmount: Math.round(currentSIP),
          yearlyInvestment: Math.round(currentSIP * 12),
          cumulativeInvested: Math.round(initialLumpsum + sipInvested),
          estimatedValue: Math.round(lumpsumValue + sipFV),
        });

        currentSIP = currentSIP * (1 + annualStepUp / 100);
      }

      const totalInvested = initialLumpsum + sipInvested;
      const futureValue = combinedLumpsumFV + sipFV;

      return {
        totalInvested: Math.round(totalInvested),
        futureValue: Math.round(futureValue),
        yearlyBreakdown,
      };
    };

    // Standalone Lumpsum calculation
    const calculateLumpsum = () => {
      const futureValue = lumpsumAmount * Math.pow(1 + annualRate, years);
      
      // Year-by-year breakdown
      const yearlyBreakdown = [];
      for (let year = 1; year <= years; year++) {
        const value = lumpsumAmount * Math.pow(1 + annualRate, year);
        yearlyBreakdown.push({
          year,
          sipAmount: 0,
          yearlyInvestment: 0,
          cumulativeInvested: lumpsumAmount,
          estimatedValue: Math.round(value),
        });
      }

      return { 
        totalInvested: lumpsumAmount, 
        futureValue: Math.round(futureValue),
        yearlyBreakdown,
      };
    };

    const regularSIP = calculateRegularSIP();
    const stepUpSIP = calculateStepUpSIP();
    const lumpsum = calculateLumpsum();

    // Get active result based on mode
    let activeResult;
    switch (mode) {
      case "sip":
        activeResult = regularSIP;
        break;
      case "stepup":
        activeResult = stepUpSIP;
        break;
      case "lumpsum":
        activeResult = lumpsum;
        break;
    }

    // Calculate inflation-adjusted (today's) value
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    const todaysValue = Math.round(activeResult.futureValue / inflationFactor);

    return {
      active: {
        totalInvested: activeResult.totalInvested,
        futureValue: activeResult.futureValue,
        estimatedReturns: activeResult.futureValue - activeResult.totalInvested,
        yearlyBreakdown: activeResult.yearlyBreakdown,
        todaysValue,
      },
      regularSIP,
      stepUpSIP,
      lumpsum,
      comparison: {
        regularSIP: regularSIP.futureValue,
        stepUpSIP: stepUpSIP.futureValue,
        lumpsum: lumpsum.futureValue,
      },
    };
  }, [initialLumpsum, monthlyInvestment, annualStepUp, lumpsumAmount, years, expectedReturn, mode, inflationRate]);

  // Calculate percentages for donut chart
  const investedPercent =
    (result.active.totalInvested / result.active.futureValue) * 100 || 0;
  const returnsPercent = 100 - investedPercent;

  // Get max value for bar chart
  const maxValue = Math.max(...result.active.yearlyBreakdown.map((r) => r.estimatedValue));

  const handleShare = async () => {
    const modeText = mode === "stepup" ? "Step-up SIP" : mode === "sip" ? "Regular SIP" : "Lumpsum";
    const lumpsumText = mode !== "lumpsum" && initialLumpsum > 0 ? `₹${formatCurrency(initialLumpsum)} lumpsum + ` : '';
    const shareData = {
      title: "SIP Calculator with Step Up - GoldMeter",
      text: `With ${modeText} (${lumpsumText}${mode !== "lumpsum" ? `₹${formatCurrency(monthlyInvestment)}/month` : `₹${formatCurrency(lumpsumAmount)}`}${mode === "stepup" ? ` + ${annualStepUp}% yearly increase` : ''}) for ${years} years at ${expectedReturn}% returns, I could get ₹${formatCurrency(result.active.futureValue)}!`,
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
              SIP Calculator with Step Up
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Calculate SIP returns with yearly increase. Compare regular SIP,
              step-up SIP, and lumpsum investments.
            </p>

            {/* Mode Selector */}
            <div className="mt-6 grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setMode("sip")}
                className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all text-center ${
                  mode === "sip"
                    ? "bg-white text-charcoal shadow-sm"
                    : "text-slate-600 hover:text-charcoal"
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => setMode("stepup")}
                className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all text-center ${
                  mode === "stepup"
                    ? "bg-white text-charcoal shadow-sm"
                    : "text-slate-600 hover:text-charcoal"
                }`}
              >
                Step-up
              </button>
              <button
                onClick={() => setMode("lumpsum")}
                className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all text-center ${
                  mode === "lumpsum"
                    ? "bg-white text-charcoal shadow-sm"
                    : "text-slate-600 hover:text-charcoal"
                }`}
              >
                Lumpsum
              </button>
            </div>

            {/* Input Section */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {mode !== "lumpsum" && (
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
              )}

              {mode === "lumpsum" && (
                <label className="text-sm font-medium text-slate-600">
                  Lumpsum Amount (₹)
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    value={lumpsumAmount}
                    onChange={(e) =>
                      setLumpsumAmount(Math.max(1000, Number(e.target.value) || 1000))
                    }
                    min={1000}
                    step={10000}
                  />
                  <input
                    type="range"
                    className="mt-2 w-full accent-amber-500"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                    min={1000}
                    max={100000000}
                    step={100000}
                  />
                  <span className="text-xs text-amber-600 font-medium block mt-1">
                    ₹{formatCurrency(lumpsumAmount)} ({formatInWords(lumpsumAmount)})
                  </span>
                </label>
              )}

              {mode !== "lumpsum" && (
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
              )}

              {mode === "stepup" && (
                <label className="text-sm font-medium text-slate-600">
                  Annual Step Up (%)
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    value={annualStepUp}
                    onChange={(e) =>
                      setAnnualStepUp(
                        Math.max(0, Math.min(50, Number(e.target.value) || 0))
                      )
                    }
                    min={0}
                    max={50}
                    step={1}
                  />
                  <input
                    type="range"
                    className="mt-2 w-full accent-amber-500"
                    value={annualStepUp}
                    onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                    min={0}
                    max={50}
                    step={1}
                  />
                  <span className="text-xs text-amber-600 font-medium block mt-1">
                    {annualStepUp}% yearly increase
                  </span>
                  <span className="text-xs text-slate-400 block">
                    Increase your SIP by this % every year
                  </span>
                </label>
              )}

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
                {mode === "stepup" ? "Step-up SIP" : mode === "sip" ? "Regular SIP" : "Lumpsum"} Results
                {mode !== "lumpsum" && initialLumpsum > 0 && " (with Lumpsum)"}
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Summary Cards */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <p className="text-xs text-slate-500">Total Invested</p>
                    <p className="text-2xl font-bold text-charcoal">
                      ₹{formatCurrency(result.active.totalInvested)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatInWords(result.active.totalInvested)}
                    </p>
                    {mode !== "lumpsum" && initialLumpsum > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        (Lumpsum: ₹{formatCurrency(initialLumpsum)} + SIP: ₹{formatCurrency(result.active.totalInvested - initialLumpsum)})
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <p className="text-xs text-slate-500">Est. Returns</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{formatCurrency(result.active.estimatedReturns)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatInWords(result.active.estimatedReturns)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white">
                    <p className="text-xs text-amber-100">Total Value (After {years} years)</p>
                    <p className="text-3xl font-bold">
                      ₹{formatCurrency(result.active.futureValue)}
                    </p>
                    <p className="text-xs text-amber-100 mt-1">
                      {formatInWords(result.active.futureValue)}
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
                          ₹{formatCurrency(result.active.todaysValue)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatInWords(result.active.todaysValue)}
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
                          Worth ₹{formatCurrency(result.active.todaysValue)} in today&apos;s purchasing power
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
                        {formatInWords(result.active.futureValue)}
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
                      {result.active.yearlyBreakdown.map((row, index) => {
                        const totalHeight = maxValue > 0 ? (row.estimatedValue / maxValue) * 100 : 0;
                        const investedHeight = maxValue > 0 ? (row.cumulativeInvested / maxValue) * 100 : 0;
                        const showLabel = index === 0 || 
                          index === result.active.yearlyBreakdown.length - 1 || 
                          (years <= 20 ? (index + 1) % 2 === 0 : (index + 1) % 5 === 0);
                        return (
                          <div
                            key={row.year}
                            className="flex-1 flex flex-col items-center justify-end h-full relative group"
                            title={`Year ${row.year}: ₹${formatCurrency(row.estimatedValue)}`}
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
                              Year {row.year}: {formatInWords(row.estimatedValue)}
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

            {/* Comparison Chart */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-charcoal mb-4">
                Investment Comparison
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    mode === "sip"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-xs text-slate-500 font-medium">Regular SIP{initialLumpsum > 0 && " + Lumpsum"}</p>
                  <p className="text-xl font-bold text-charcoal mt-1">
                    ₹{formatCurrency(result.comparison.regularSIP)}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    {formatInWords(result.comparison.regularSIP)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Invested: ₹{formatCurrency(result.regularSIP.totalInvested)}
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    mode === "stepup"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-xs text-slate-500 font-medium">Step-up SIP{initialLumpsum > 0 && " + Lumpsum"}</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">
                    ₹{formatCurrency(result.comparison.stepUpSIP)}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    {formatInWords(result.comparison.stepUpSIP)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Invested: ₹{formatCurrency(result.stepUpSIP.totalInvested)}
                  </p>
                  {result.comparison.stepUpSIP > result.comparison.regularSIP && (
                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                      +₹{formatCurrency(result.comparison.stepUpSIP - result.comparison.regularSIP)} vs Regular
                    </p>
                  )}
                </div>
                <div
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    mode === "lumpsum"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-xs text-slate-500 font-medium">Lumpsum Only</p>
                  <p className="text-xl font-bold text-charcoal mt-1">
                    ₹{formatCurrency(result.comparison.lumpsum)}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    {formatInWords(result.comparison.lumpsum)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Invested: ₹{formatCurrency(result.lumpsum.totalInvested)}
                  </p>
                </div>
              </div>
            </section>

            {/* Year-by-Year Growth Table */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-charcoal mb-4">
                Year-by-Year {mode === "stepup" ? "Step-up SIP" : mode === "sip" ? "Regular SIP" : "Lumpsum"} Growth
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Year
                      </th>
                      {mode !== "lumpsum" && (
                        <>
                          <th className="px-4 py-3 text-right font-semibold text-slate-700">
                            Monthly (₹)
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-slate-700">
                            Yearly (₹)
                          </th>
                        </>
                      )}
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Cumulative (₹)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Value (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.active.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-amber-50/30">
                        <td className="px-4 py-3 font-medium text-charcoal">
                          {row.year}
                        </td>
                        {mode !== "lumpsum" && (
                          <>
                            <td className="px-4 py-3 text-right text-slate-600">
                              {formatCurrency(row.sipAmount)}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-600">
                              {formatCurrency(row.yearlyInvestment)}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3 text-right text-slate-600">
                          {formatCurrency(row.cumulativeInvested)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                          {formatCurrency(row.estimatedValue)}
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
            href="/sip-calculator"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            SIP Calculator → Calculate regular SIP returns.
          </Link>
          <Link
            href="/swp-calculator-with-inflation"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            SWP Calculator with Inflation → Plan systematic withdrawals with inflation.
          </Link>
          <Link
            href="/investment-calculator"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold Investment Calculator → Calculate gold SIP returns.
          </Link>
        </section>

        {/* Comprehensive Content Section */}
        <section className="mt-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft print:shadow-none">
          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-charcoal mb-4">
              What is SIP Calculator with Step Up?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A SIP Calculator with Step Up is an advanced financial planning tool that helps investors calculate the future value of their Systematic Investment Plan (SIP) investments with an annual increase or &quot;step-up&quot; in the investment amount. Also known as a Top-up SIP Calculator, this tool is specifically designed for investors who plan to increase their monthly SIP contributions over time, typically in line with their expected salary increments or growing income.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our calculator also supports an optional initial lumpsum investment that can be combined with both regular SIP and step-up SIP. This is particularly useful for investors who have a one-time amount to invest (like a bonus or inheritance) along with their regular monthly contributions. The lumpsum amount starts compounding from day one while your SIP contributions add to it over time.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Understanding Today&apos;s Value (Inflation-Adjusted)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The &quot;Today&apos;s Value&quot; feature shows your future corpus in today&apos;s purchasing power. Due to inflation, ₹1 crore after 20 years will not have the same buying power as ₹1 crore today. This inflation-adjusted calculation helps you understand the real value of your future wealth.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              For example, if you accumulate ₹1 crore in 20 years with 6% average inflation, its purchasing power would be equivalent to approximately ₹31 lakhs in today&apos;s terms. This helps you set realistic financial goals and plan for higher corpus if needed.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Understanding Step-up SIP (Top-up SIP)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Step-up SIP, also called Top-up SIP or Booster SIP, is a feature offered by most mutual fund houses that allows you to automatically increase your SIP amount by a fixed percentage or fixed amount every year. For example, if you start with a ₹10,000 monthly SIP with a 10% annual step-up, your SIP becomes ₹11,000 in year 2, ₹12,100 in year 3, ₹13,310 in year 4, and so on.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This approach aligns your investments with the typical career trajectory where your salary increases over time. Most employees in India receive 8-15% annual salary hikes. By channeling a portion of these increments into increased SIP contributions, you can significantly accelerate your wealth creation without feeling the pinch on your monthly budget.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Lumpsum + SIP Combination Strategy
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              One of the most powerful features of this calculator is the ability to combine a lumpsum investment with SIP. Here&apos;s how it works:
            </p>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-3"><strong>Initial Lumpsum:</strong> Your one-time investment (e.g., ₹1 lakh) starts compounding from day one at the expected return rate.</p>
              <p className="mb-3"><strong>Monthly SIP:</strong> Your regular monthly contributions are added on top, each compounding for its remaining duration.</p>
              <p className="mb-3"><strong>Combined Growth:</strong> The final value is the sum of your compounded lumpsum plus compounded SIP contributions.</p>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              This strategy is ideal when you have received a bonus, inheritance, or any windfall and also have regular income for SIP. Instead of investing the lumpsum separately, combining it with SIP in the same fund simplifies tracking and ensures consistent asset allocation.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Step-up SIP vs Regular SIP: A Comparison
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To understand the power of step-up SIP, let&apos;s compare it with regular SIP using a concrete example:
            </p>
            <div className="bg-slate-100 p-4 rounded-xl mb-4">
              <p className="font-semibold text-charcoal mb-2">Example Scenario:</p>
              <p className="text-sm text-slate-600">Starting SIP: ₹10,000/month | Duration: 20 years | Expected Return: 12% p.a. | Step-up: 10% annually</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-charcoal">Regular SIP</p>
                  <p className="text-sm text-slate-600">Total Invested: ₹24,00,000</p>
                  <p className="text-sm text-emerald-600 font-medium">Maturity Value: ₹99,91,479</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-charcoal">Step-up SIP (10%)</p>
                  <p className="text-sm text-slate-600">Total Invested: ₹68,73,692</p>
                  <p className="text-sm text-emerald-600 font-medium">Maturity Value: ₹2,26,72,916</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Benefits of Step-up SIP with Lumpsum
            </h2>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-3"><strong>1. Maximized Compounding:</strong> Your lumpsum starts compounding immediately while step-up SIP adds increasing amounts over time.</p>
              <p className="mb-3"><strong>2. Aligned with Income Growth:</strong> As your salary grows, your investments grow too without affecting lifestyle.</p>
              <p className="mb-3"><strong>3. Flexibility:</strong> Combine any lumpsum amount with any SIP - perfect for variable income situations.</p>
              <p className="mb-3"><strong>4. Goal Achievement:</strong> Reach your financial goals faster by leveraging both strategies.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-charcoal">What is Today&apos;s Value in the calculator?</p>
                <p className="text-slate-600 mt-1">Today&apos;s Value shows your future corpus in current purchasing power terms. It accounts for inflation erosion, helping you understand what your accumulated wealth will actually be worth.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Can I invest lumpsum and SIP in the same mutual fund?</p>
                <p className="text-slate-600 mt-1">Yes! Most mutual funds allow both lumpsum and SIP investments in the same folio. Your lumpsum and SIP investments are combined in the same account.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Should I do step-up SIP or increase my lumpsum?</p>
                <p className="text-slate-600 mt-1">If you have a lump sum now, invest it immediately. For future income, set up step-up SIP. The combination of immediate lumpsum + growing SIP provides the best of both worlds.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">What is the ideal step-up percentage?</p>
                <p className="text-slate-600 mt-1">A 10% annual step-up is recommended for most investors as it aligns with typical salary increments. However, you can adjust based on your expected income growth - anywhere from 5% to 25%.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
