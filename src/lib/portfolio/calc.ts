import type { PortfolioTransaction, PortfolioHolding } from "@/types/portfolio";

/**
 * Compute derived portfolio metrics from transactions.
 * @param transactions – array of buy/sell transactions
 * @param currentPricePerGram – live gold price per gram (₹)
 */
export function computeHoldings(
  transactions: PortfolioTransaction[],
  currentPricePerGram: number
): PortfolioHolding {
  let totalBought = 0;
  let totalSold = 0;
  let totalInvested = 0; // cost basis of buys
  let totalCharges = 0;
  let totalSellProceeds = 0;

  // Sort by date to process sequentially
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const tx of sorted) {
    if (tx.type === "buy") {
      totalBought += tx.grams;
      totalInvested += tx.grams * tx.pricePerGram;
      totalCharges += tx.charges;
    } else {
      totalSold += tx.grams;
      totalSellProceeds += tx.grams * tx.pricePerGram;
    }
  }

  const netGrams = Math.max(0, totalBought - totalSold);
  const avgBuyPrice = totalBought > 0 ? totalInvested / totalBought : 0;
  const currentValue = netGrams * currentPricePerGram;
  const costOfHeld = netGrams * avgBuyPrice; // cost basis of held grams
  const unrealizedPL = currentValue - costOfHeld;
  const unrealizedPLPercent = costOfHeld > 0 ? (unrealizedPL / costOfHeld) * 100 : 0;

  // Realized P&L: sell proceeds minus avg-cost basis of sold grams
  const costOfSold = totalSold * avgBuyPrice;
  const realizedPL = totalSellProceeds - costOfSold;

  // XIRR calculation
  const xirr = computeXIRR(transactions, currentPricePerGram);

  return {
    netGrams: round(netGrams, 3),
    totalInvested: round(totalInvested, 0),
    totalCharges: round(totalCharges, 0),
    avgBuyPrice: round(avgBuyPrice, 0),
    currentValue: round(currentValue, 0),
    unrealizedPL: round(unrealizedPL, 0),
    unrealizedPLPercent: round(unrealizedPLPercent, 2),
    totalBought: round(totalBought, 3),
    totalSold: round(totalSold, 3),
    totalSellProceeds: round(totalSellProceeds, 0),
    realizedPL: round(realizedPL, 0),
    xirr: round(xirr, 2),
  };
}

/**
 * Compute XIRR (annualized return) from transactions.
 * Cash flows: buy = negative (outflow), sell = positive (inflow).
 * Final value of remaining holdings = positive inflow today.
 */
function computeXIRR(
  transactions: PortfolioTransaction[],
  currentPricePerGram: number
): number {
  if (transactions.length === 0) return NaN;

  const cashFlows: { date: Date; amount: number }[] = [];

  let netGrams = 0;
  let avgBuyPrice = 0;
  let totalBought = 0;
  let totalInvested = 0;

  for (const tx of transactions) {
    const d = new Date(tx.date);
    if (tx.type === "buy") {
      const cost = tx.grams * tx.pricePerGram + tx.charges;
      cashFlows.push({ date: d, amount: -cost }); // outflow
      totalBought += tx.grams;
      totalInvested += tx.grams * tx.pricePerGram;
    } else {
      const proceeds = tx.grams * tx.pricePerGram;
      cashFlows.push({ date: d, amount: proceeds }); // inflow
    }
  }

  avgBuyPrice = totalBought > 0 ? totalInvested / totalBought : 0;
  netGrams = transactions.reduce(
    (g, tx) => g + (tx.type === "buy" ? tx.grams : -tx.grams),
    0
  );
  netGrams = Math.max(0, netGrams);

  // Add current value of holdings as final inflow today
  if (netGrams > 0) {
    const currentValue = netGrams * currentPricePerGram;
    cashFlows.push({ date: new Date(), amount: currentValue });
  }

  // Need at least one negative and one positive flow
  const hasNeg = cashFlows.some((cf) => cf.amount < 0);
  const hasPos = cashFlows.some((cf) => cf.amount > 0);
  if (!hasNeg || !hasPos) return NaN;

  // At least 2 distinct dates
  const dates = new Set(cashFlows.map((cf) => cf.date.toISOString().slice(0, 10)));
  if (dates.size < 2) return NaN;

  return xirrNewton(cashFlows) * 100; // convert to percentage
}

/**
 * Newton-Raphson XIRR solver.
 * Returns annualized rate (e.g. 0.12 for 12%).
 */
function xirrNewton(
  cashFlows: { date: Date; amount: number }[],
  maxIter = 100,
  tol = 1e-7
): number {
  // Sort by date
  const sorted = [...cashFlows].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const d0 = sorted[0].date.getTime();

  function npv(rate: number): number {
    let sum = 0;
    for (const cf of sorted) {
      const years = (cf.date.getTime() - d0) / (365.25 * 24 * 3600 * 1000);
      sum += cf.amount / Math.pow(1 + rate, years);
    }
    return sum;
  }

  function dnpv(rate: number): number {
    let sum = 0;
    for (const cf of sorted) {
      const years = (cf.date.getTime() - d0) / (365.25 * 24 * 3600 * 1000);
      if (years === 0) continue;
      sum += (-years * cf.amount) / Math.pow(1 + rate, years + 1);
    }
    return sum;
  }

  let rate = 0.1; // initial guess 10%

  for (let i = 0; i < maxIter; i++) {
    const f = npv(rate);
    const df = dnpv(rate);
    if (Math.abs(df) < 1e-12) break;
    const newRate = rate - f / df;
    if (Math.abs(newRate - rate) < tol) return newRate;
    rate = newRate;
    // Clamp to avoid divergence
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }

  return rate;
}

function round(n: number, decimals: number): number {
  if (isNaN(n)) return NaN;
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}
