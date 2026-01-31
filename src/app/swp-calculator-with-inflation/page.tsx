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

export default function SWPCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(5000000); // 50 Lakhs
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(30000);
  const [years, setYears] = useState(20);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(6);
  const [adjustForInflation, setAdjustForInflation] = useState(true);

  const result = useMemo(() => {
    const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const yearlyInflation = inflationRate / 100;

    const yearlyBreakdown = [];
    let balance = initialInvestment;
    let totalWithdrawn = 0;
    let currentWithdrawal = monthlyWithdrawal;
    let fundDepleted = false;
    let depletionYear = 0;

    for (let year = 1; year <= years; year++) {
      if (fundDepleted) {
        yearlyBreakdown.push({
          year,
          openingBalance: 0,
          monthlyWithdrawal: 0,
          yearlyWithdrawal: 0,
          interestEarned: 0,
          closingBalance: 0,
          inflationAdjustedValue: 0,
        });
        continue;
      }

      const openingBalance = balance;
      let yearlyWithdrawn = 0;
      let yearlyInterest = 0;

      // Process each month
      for (let month = 0; month < 12; month++) {
        if (balance <= 0) {
          fundDepleted = true;
          depletionYear = year;
          break;
        }

        // Withdraw for the month
        const withdrawal = Math.min(currentWithdrawal, balance);
        balance -= withdrawal;
        yearlyWithdrawn += withdrawal;
        totalWithdrawn += withdrawal;

        // Add interest for remaining balance
        const interest = balance * monthlyRate;
        balance += interest;
        yearlyInterest += interest;
      }

      // Calculate inflation-adjusted value of closing balance
      const inflationFactor = Math.pow(1 + yearlyInflation, year);
      const inflationAdjustedValue = adjustForInflation
        ? balance / inflationFactor
        : balance;

      yearlyBreakdown.push({
        year,
        openingBalance: Math.round(openingBalance),
        monthlyWithdrawal: Math.round(currentWithdrawal),
        yearlyWithdrawal: Math.round(yearlyWithdrawn),
        interestEarned: Math.round(yearlyInterest),
        closingBalance: Math.round(Math.max(0, balance)),
        inflationAdjustedValue: Math.round(Math.max(0, inflationAdjustedValue)),
      });

      // Increase withdrawal for next year if adjusting for inflation
      if (adjustForInflation) {
        currentWithdrawal = currentWithdrawal * (1 + yearlyInflation);
      }
    }

    // Calculate totals
    const finalBalance = Math.max(0, balance);
    const totalInterestEarned = yearlyBreakdown.reduce(
      (sum, row) => sum + row.interestEarned,
      0
    );

    // Calculate inflation-adjusted final balance
    const inflationFactor = Math.pow(1 + yearlyInflation, years);
    const inflationAdjustedFinalBalance = adjustForInflation
      ? finalBalance / inflationFactor
      : finalBalance;

    return {
      totalWithdrawn: Math.round(totalWithdrawn),
      finalBalance: Math.round(finalBalance),
      totalInterestEarned: Math.round(totalInterestEarned),
      inflationAdjustedFinalBalance: Math.round(inflationAdjustedFinalBalance),
      yearlyBreakdown,
      fundDepleted,
      depletionYear,
      effectiveYears: fundDepleted ? depletionYear : years,
    };
  }, [initialInvestment, monthlyWithdrawal, years, expectedReturn, inflationRate, adjustForInflation]);

  // Data for line chart (simplified bar representation)
  const maxBalance = Math.max(
    initialInvestment,
    ...result.yearlyBreakdown.map((r) => r.closingBalance)
  );

  const handleShare = async () => {
    const shareData = {
      title: "SWP Calculator with Inflation - GoldMeter",
      text: `With ₹${formatCurrency(initialInvestment)} investment, withdrawing ₹${formatCurrency(monthlyWithdrawal)}/month at ${expectedReturn}% returns, I can sustain for ${result.effectiveYears} years with ₹${formatCurrency(result.finalBalance)} remaining!`,
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
              SWP Calculator with Inflation
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Calculate systematic withdrawals from your mutual fund investments.
              Plan retirement income with inflation-adjusted returns.
            </p>

            {/* Input Section */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-600">
                Initial Investment (₹)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={initialInvestment}
                  onChange={(e) =>
                    setInitialInvestment(Math.max(100000, Number(e.target.value) || 100000))
                  }
                  min={100000}
                  step={100000}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  min={100000}
                  max={100000000}
                  step={100000}
                />
                <span className="text-xs text-amber-600 font-medium block mt-1">
                  ₹{formatCurrency(initialInvestment)} ({formatInWords(initialInvestment)})
                </span>
              </label>

              <label className="text-sm font-medium text-slate-600">
                Monthly Withdrawal (₹)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={monthlyWithdrawal}
                  onChange={(e) =>
                    setMonthlyWithdrawal(Math.max(1000, Number(e.target.value) || 1000))
                  }
                  min={1000}
                  step={1000}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                  min={5000}
                  max={500000}
                  step={5000}
                />
                <span className="text-xs text-amber-600 font-medium block mt-1">
                  ₹{formatCurrency(monthlyWithdrawal)} ({formatInWords(monthlyWithdrawal)})
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
                      Math.max(1, Math.min(20, Number(e.target.value) || 1))
                    )
                  }
                  min={1}
                  max={20}
                  step={0.5}
                />
                <input
                  type="range"
                  className="mt-2 w-full accent-amber-500"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  min={1}
                  max={20}
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

            {/* Inflation Toggle */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Adjust for Inflation
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Increase withdrawal yearly to maintain purchasing power
                  </p>
                </div>
                <button
                  onClick={() => setAdjustForInflation(!adjustForInflation)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    adjustForInflation ? "bg-amber-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      adjustForInflation ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {adjustForInflation && (
                <label className="text-sm font-medium text-slate-600 block mt-4">
                  Inflation Rate (% p.a.)
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    value={inflationRate}
                    onChange={(e) =>
                      setInflationRate(
                        Math.max(0, Math.min(15, Number(e.target.value) || 0))
                      )
                    }
                    min={0}
                    max={15}
                    step={0.5}
                  />
                  <input
                    type="range"
                    className="mt-2 w-full accent-amber-500"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                  <span className="text-xs text-amber-600 font-medium block mt-1">
                    {inflationRate}% yearly inflation
                  </span>
                </label>
              )}
            </div>

            {/* Results Section */}
            <section className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
              <h2 className="text-lg font-semibold text-charcoal">
                Withdrawal Summary
              </h2>

              {result.fundDepleted && (
                <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Warning: Your fund will be depleted in year {result.depletionYear}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Consider reducing monthly withdrawal or increasing investment.
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 border border-slate-100">
                  <p className="text-xs text-slate-500">Total Invested</p>
                  <p className="text-xl font-bold text-charcoal">
                    ₹{formatCurrency(initialInvestment)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatInWords(initialInvestment)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-100">
                  <p className="text-xs text-slate-500">Total Withdrawn</p>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{formatCurrency(result.totalWithdrawn)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatInWords(result.totalWithdrawn)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-100">
                  <p className="text-xs text-slate-500">Interest Earned</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ₹{formatCurrency(result.totalInterestEarned)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatInWords(result.totalInterestEarned)}
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white">
                  <p className="text-xs text-amber-100">Final Balance</p>
                  <p className="text-xl font-bold">
                    ₹{formatCurrency(result.finalBalance)}
                  </p>
                  <p className="text-xs text-amber-100 mt-1">
                    {formatInWords(result.finalBalance)}
                  </p>
                  {adjustForInflation && result.finalBalance > 0 && (
                    <p className="text-xs text-amber-100 mt-1">
                      (₹{formatCurrency(result.inflationAdjustedFinalBalance)} / {formatInWords(result.inflationAdjustedFinalBalance)} in today&apos;s value)
                    </p>
                  )}
                </div>
              </div>

              {/* Visual Balance Chart */}
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Balance Over Time
                </p>
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="relative h-40">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-6 w-20 flex flex-col justify-between text-xs text-slate-400">
                      <span>{formatInWords(maxBalance)}</span>
                      <span>{formatInWords(maxBalance / 2)}</span>
                      <span>₹0</span>
                    </div>
                    {/* Chart area */}
                    <div className="ml-20 h-full flex items-end gap-0.5 pb-6">
                      {result.yearlyBreakdown.map((row, index) => {
                        const height = maxBalance > 0
                          ? (row.closingBalance / maxBalance) * 100
                          : 0;
                        const showLabel = index === 0 || 
                          index === result.yearlyBreakdown.length - 1 || 
                          (years <= 20 ? (index + 1) % 2 === 0 : (index + 1) % 5 === 0);
                        return (
                          <div
                            key={row.year}
                            className="flex-1 flex flex-col items-center justify-end h-full group"
                            title={`Year ${row.year}: ${formatInWords(row.closingBalance)}`}
                          >
                            <div
                              className={`w-full min-w-[4px] rounded-t-sm transition-all cursor-pointer hover:opacity-80 ${
                                row.closingBalance > 0 ? "bg-gradient-to-t from-amber-500 to-amber-300" : "bg-red-300"
                              }`}
                              style={{ height: `${Math.max(height, 1)}%` }}
                            />
                            {showLabel && (
                              <span className="text-[9px] text-slate-400 mt-1 absolute bottom-0">
                                {row.year}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-gradient-to-t from-amber-500 to-amber-300"></span>
                      Balance
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-red-300"></span>
                      Depleted
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
                Year-by-Year Withdrawal Schedule
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold text-slate-700">
                        Year
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700">
                        Opening (₹)
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700">
                        Monthly (₹)
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700">
                        Yearly (₹)
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700">
                        Interest (₹)
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700">
                        Closing (₹)
                      </th>
                      {adjustForInflation && (
                        <th className="px-3 py-3 text-right font-semibold text-slate-700">
                          Today&apos;s Value (₹)
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.yearlyBreakdown.map((row) => (
                      <tr
                        key={row.year}
                        className={`hover:bg-amber-50/30 ${
                          row.closingBalance === 0 ? "bg-red-50/50" : ""
                        }`}
                      >
                        <td className="px-3 py-3 font-medium text-charcoal">
                          {row.year}
                        </td>
                        <td className="px-3 py-3 text-right text-slate-600">
                          {formatCurrency(row.openingBalance)}
                        </td>
                        <td className="px-3 py-3 text-right text-slate-600">
                          {formatCurrency(row.monthlyWithdrawal)}
                        </td>
                        <td className="px-3 py-3 text-right text-blue-600 font-medium">
                          {formatCurrency(row.yearlyWithdrawal)}
                        </td>
                        <td className="px-3 py-3 text-right text-emerald-600">
                          {formatCurrency(row.interestEarned)}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-charcoal">
                          {formatCurrency(row.closingBalance)}
                        </td>
                        {adjustForInflation && (
                          <td className="px-3 py-3 text-right text-amber-600 font-medium">
                            {formatCurrency(row.inflationAdjustedValue)}
                          </td>
                        )}
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
            SIP Calculator → Calculate SIP returns for wealth creation.
          </Link>
          <Link
            href="/sip-calculator-with-step-up"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Step-up SIP Calculator → SIP with yearly increase.
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
              What is SWP Calculator with Inflation?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A Systematic Withdrawal Plan (SWP) Calculator with Inflation is a powerful financial tool designed to help investors plan their regular withdrawals from mutual fund investments while accounting for the impact of inflation on their purchasing power. This calculator is particularly useful for retirees, senior citizens, and anyone looking to generate a steady income stream from their existing investments. Unlike a simple SWP calculator, an inflation-adjusted SWP calculator provides a more realistic picture of your future financial situation by factoring in the rising cost of living over time.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The SWP calculator with inflation helps you understand how much you can withdraw monthly from your mutual fund corpus while ensuring your money lasts for your desired time period. It calculates the impact of inflation on your withdrawals, showing you the real value of your money in today&apos;s terms. This is crucial for retirement planning because what seems like a comfortable income today may not be sufficient 10-20 years down the line due to inflation.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Understanding Systematic Withdrawal Plan (SWP)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A Systematic Withdrawal Plan (SWP) is an investment facility offered by mutual fund houses that allows investors to withdraw a fixed or variable amount from their mutual fund investments at regular intervals - monthly, quarterly, half-yearly, or annually. Think of SWP as the reverse of SIP (Systematic Investment Plan). While SIP helps you build wealth by investing regularly, SWP helps you utilize your accumulated wealth by withdrawing regularly.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you set up an SWP, the mutual fund house redeems units from your investment to provide you with the desired withdrawal amount. The remaining units continue to stay invested and can potentially grow based on market performance. This dual benefit of regular income plus continued growth potential makes SWP an attractive option for generating passive income.
            </p>

            <h3 className="text-xl font-semibold text-charcoal mb-3 mt-6">
              How Does SWP Work?
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Let&apos;s understand the SWP mechanism with an example. Suppose you have invested ₹50 lakhs in a mutual fund and you set up an SWP of ₹30,000 per month. Each month, the fund house will redeem units worth ₹30,000 from your investment and credit the amount to your bank account. The number of units redeemed will depend on the prevailing NAV (Net Asset Value). If the NAV is ₹100, 300 units will be redeemed. If the NAV is ₹120, only 250 units will be redeemed.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Meanwhile, your remaining investment continues to earn returns based on market performance. If the fund generates 10% annual returns and your withdrawal rate is lower than the returns, your corpus may actually grow over time. However, if you withdraw more than what the fund earns, your corpus will gradually deplete. Our SWP calculator with inflation helps you find the right balance between withdrawal amount and investment returns.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Why is Inflation Adjustment Important in SWP?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Inflation is the silent wealth destroyer that erodes the purchasing power of your money over time. What costs ₹100 today might cost ₹180 in 10 years at 6% annual inflation. This means if you withdraw a fixed ₹30,000 every month, the real value of that money decreases each year. After 20 years, ₹30,000 would have the purchasing power of only about ₹9,350 in today&apos;s terms at 6% inflation.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This is why our SWP calculator includes an inflation adjustment feature. When enabled, your withdrawal amount increases each year by the inflation rate you specify. So if you start with ₹30,000 monthly and set 6% inflation, your withdrawal becomes ₹31,800 in year 2, ₹33,708 in year 3, and so on. This ensures your standard of living remains consistent throughout your retirement years.
            </p>

            <h3 className="text-xl font-semibold text-charcoal mb-3 mt-6">
              Real vs Nominal Returns
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When planning SWP, it&apos;s important to understand the difference between nominal and real returns. Nominal return is the actual return your investment generates - say 10% per year. Real return is nominal return minus inflation. So if your fund returns 10% and inflation is 6%, your real return is only 4%. This means your wealth is growing at 4% in terms of actual purchasing power. Our calculator shows both the nominal balance and the inflation-adjusted (today&apos;s value) balance to give you a complete picture.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Benefits of Using SWP Calculator with Inflation
            </h2>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-3"><strong>1. Accurate Retirement Planning:</strong> By factoring in inflation, you get a realistic estimate of how long your retirement corpus will last. This helps you plan better and avoid the risk of outliving your savings.</p>
              <p className="mb-3"><strong>2. Optimal Withdrawal Strategy:</strong> The calculator helps you find the sweet spot between withdrawal amount and corpus longevity. You can experiment with different withdrawal amounts and inflation rates to find a sustainable strategy.</p>
              <p className="mb-3"><strong>3. Tax-Efficient Income:</strong> SWP withdrawals are more tax-efficient compared to interest income from FDs. Only the capital gains portion of each withdrawal is taxable, not the entire amount. For equity funds held over 1 year, long-term capital gains up to ₹1 lakh are tax-free.</p>
              <p className="mb-3"><strong>4. Flexibility and Control:</strong> Unlike annuities or pension plans with fixed payouts, SWP gives you complete flexibility. You can increase, decrease, pause, or stop withdrawals anytime based on your needs.</p>
              <p className="mb-3"><strong>5. Continued Growth Potential:</strong> Your remaining corpus stays invested in the market and has the potential to grow. During bull markets, your corpus might actually increase despite regular withdrawals.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              How to Use This SWP Calculator
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Using our SWP calculator with inflation is straightforward. Here&apos;s a step-by-step guide:
            </p>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-2"><strong>Step 1:</strong> Enter your initial investment amount - this is the total corpus you plan to invest or have already invested in mutual funds.</p>
              <p className="mb-2"><strong>Step 2:</strong> Enter your desired monthly withdrawal amount - this is how much you want to receive every month.</p>
              <p className="mb-2"><strong>Step 3:</strong> Set the expected return rate - this is the annual return you expect from your mutual fund investments. Conservative estimates range from 8-10% for balanced funds and 10-12% for equity funds.</p>
              <p className="mb-2"><strong>Step 4:</strong> Enter the time period in years - this is how long you want the SWP to continue.</p>
              <p className="mb-2"><strong>Step 5:</strong> Toggle inflation adjustment if desired and enter the expected inflation rate (typically 5-7% in India).</p>
              <p className="mb-2"><strong>Step 6:</strong> Review the results including total withdrawn, interest earned, final balance, and the year-by-year breakdown.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              SWP vs Other Income Options
            </h2>
            <h3 className="text-xl font-semibold text-charcoal mb-3 mt-6">
              SWP vs Fixed Deposit
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Fixed deposits offer guaranteed returns but typically lower than mutual funds (5-7% vs 10-12% for equity funds). FD interest is fully taxable at your income tax slab rate, while SWP enjoys more favorable tax treatment. FDs don&apos;t benefit from market growth, while SWP corpus has growth potential. For long-term income needs, SWP often proves more beneficial.
            </p>

            <h3 className="text-xl font-semibold text-charcoal mb-3 mt-6">
              SWP vs Dividend Plans
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Dividend plans of mutual funds pay dividends based on fund profits, which are unpredictable and irregular. SWP provides fixed, predictable income of your choice. Dividends are taxable at 10% TDS for amounts above ₹5,000, while SWP taxation is more favorable for long-term holdings. SWP gives you more control over your cash flows.
            </p>

            <h3 className="text-xl font-semibold text-charcoal mb-3 mt-6">
              SWP vs Annuity Plans
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Annuity plans from insurance companies offer guaranteed lifetime income but typically at lower rates (4-6%). Once you buy an annuity, the money is locked - you cannot access the principal. SWP offers flexibility to access your corpus anytime. However, annuities provide longevity protection - you never outlive your income. Consider a combination of both for comprehensive retirement planning.
            </p>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Best Mutual Funds for SWP
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Not all mutual funds are suitable for SWP. Here are the recommended fund categories:
            </p>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-3"><strong>Balanced Advantage Funds:</strong> These dynamically allocate between equity and debt based on market valuations. They offer stability with growth potential, making them ideal for retirees. Expected returns: 9-11% annually.</p>
              <p className="mb-3"><strong>Equity Savings Funds:</strong> These maintain 65% in equity derivatives for tax efficiency while keeping actual equity exposure low. They offer stable returns with equity taxation benefits. Expected returns: 8-10% annually.</p>
              <p className="mb-3"><strong>Conservative Hybrid Funds:</strong> With 75-90% in debt and 10-25% in equity, these are suitable for risk-averse investors. They provide stability with modest growth. Expected returns: 7-9% annually.</p>
              <p className="mb-3"><strong>Large Cap Equity Funds:</strong> For those with higher risk appetite and longer time horizon, large cap funds can provide higher returns. However, they come with higher volatility. Expected returns: 10-12% annually.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Common Mistakes to Avoid in SWP
            </h2>
            <div className="text-slate-600 leading-relaxed mb-4">
              <p className="mb-3"><strong>1. Ignoring Inflation:</strong> Planning SWP without considering inflation is the biggest mistake. Your ₹30,000 monthly withdrawal will feel like ₹15,000 after 15 years at 5% inflation.</p>
              <p className="mb-3"><strong>2. Withdrawing Too Much:</strong> If your withdrawal rate exceeds your investment returns, your corpus will deplete rapidly. Keep your withdrawal rate at 4-6% of corpus annually for sustainability.</p>
              <p className="mb-3"><strong>3. Choosing Wrong Fund:</strong> Aggressive equity funds can see 30-40% drawdowns in bear markets. Stick to balanced or hybrid funds for SWP.</p>
              <p className="mb-3"><strong>4. Not Reviewing Periodically:</strong> Markets change, inflation changes, your needs change. Review and adjust your SWP annually.</p>
              <p className="mb-3"><strong>5. Putting All Eggs in One Basket:</strong> Don&apos;t rely solely on SWP. Maintain an emergency fund in FDs/liquid funds for unexpected expenses.</p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              SWP Calculator Formula
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The SWP calculation involves monthly compounding where each month: (1) the withdrawal amount is deducted from the corpus, and (2) the remaining balance earns returns. With inflation adjustment, the withdrawal amount increases annually by the inflation rate.
            </p>
            <div className="bg-slate-100 p-4 rounded-xl mb-4">
              <p className="font-mono text-sm text-slate-700">
                Monthly Balance = Previous Balance - Withdrawal + (Remaining Balance × Monthly Return Rate)
              </p>
              <p className="font-mono text-sm text-slate-700 mt-2">
                Where Monthly Return Rate = (1 + Annual Return)^(1/12) - 1
              </p>
              <p className="font-mono text-sm text-slate-700 mt-2">
                Inflation-Adjusted Withdrawal = Base Withdrawal × (1 + Inflation Rate)^Year
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4 mt-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-charcoal">What is the ideal SWP withdrawal rate?</p>
                <p className="text-slate-600 mt-1">Financial experts recommend keeping your annual withdrawal rate between 4-6% of your total corpus. This rate, combined with expected investment returns of 8-10%, can help your corpus last 25-30 years or more.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Is SWP taxable?</p>
                <p className="text-slate-600 mt-1">Yes, but only the capital gains portion of each SWP withdrawal is taxable. For equity funds held over 12 months, gains up to ₹1 lakh annually are tax-free, and gains above that are taxed at 10%. This makes SWP more tax-efficient than FD interest.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Can I change my SWP amount?</p>
                <p className="text-slate-600 mt-1">Yes, most fund houses allow you to modify your SWP amount, frequency, or even stop it entirely without any penalty. This flexibility is one of the key advantages of SWP over annuities.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">What happens if my fund value drops significantly?</p>
                <p className="text-slate-600 mt-1">During market downturns, more units will be redeemed to meet your withdrawal amount, depleting your corpus faster. Consider reducing withdrawals during prolonged bear markets or maintain a cash buffer to avoid selling at market lows.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
