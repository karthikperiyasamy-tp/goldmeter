export type PricePoint = { date: string; price: number; timestamp: number };

export type SMAResult = {
  sma7: number | null;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
};

export type RSIResult = { value: number | null; signal: string };

export type MACDResult = {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
  trend: string;
};

export type BollingerResult = {
  upper: number | null;
  middle: number | null;
  lower: number | null;
  percentB: number | null;
};

export type MomentumResult = {
  roc7d: number | null;
  roc30d: number | null;
  direction: "up" | "down" | "flat";
};

export type VolatilityResult = {
  annualized: number | null;
  level: "low" | "normal" | "high";
};

export type SupportResistanceResult = {
  support: number | null;
  resistance: number | null;
};

export type PriceVsMAResult = {
  aboveSMA7: boolean | null;
  aboveSMA20: boolean | null;
  aboveSMA50: boolean | null;
  aboveSMA200: boolean | null;
  maSignal: string;
};

export type CompositeResult = {
  score: number;
  sentiment: string;
};

export type AllIndicators = {
  sma: SMAResult;
  rsi: RSIResult;
  macd: MACDResult;
  bollinger: BollingerResult;
  momentum: MomentumResult;
  volatility: VolatilityResult;
  supportResistance: SupportResistanceResult;
  priceVsMA: PriceVsMAResult;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function last(arr: number[]): number {
  return arr[arr.length - 1];
}

function sma(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function ema(prices: number[], period: number): number[] {
  if (prices.length < period) return [];
  const k = 2 / (period + 1);
  const result: number[] = [];
  let prev = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push(prev);
  for (let i = period; i < prices.length; i++) {
    prev = prices[i] * k + prev * (1 - k);
    result.push(prev);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Public indicator functions — all take the closes array sorted oldest-first
// ---------------------------------------------------------------------------

export function computeSMA(closes: number[]): SMAResult {
  return {
    sma7: sma(closes, 7),
    sma20: sma(closes, 20),
    sma50: sma(closes, 50),
    sma200: sma(closes, 200),
  };
}

export function computeRSI(closes: number[], period = 14): RSIResult {
  if (closes.length < period + 1) return { value: null, signal: "Insufficient data" };

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) avgGain += change;
    else avgLoss += Math.abs(change);
  }
  avgGain /= period;
  avgLoss /= period;

  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  const rounded = Math.round(rsi * 10) / 10;

  let signal: string;
  if (rounded >= 70) signal = "Overbought";
  else if (rounded >= 60) signal = "Mildly Bullish";
  else if (rounded >= 40) signal = "Neutral";
  else if (rounded >= 30) signal = "Mildly Bearish";
  else signal = "Oversold";

  return { value: rounded, signal };
}

export function computeMACD(closes: number[]): MACDResult {
  if (closes.length < 35) return { macd: null, signal: null, histogram: null, trend: "Insufficient data" };

  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);

  const offset = 26 - 12;
  const macdLine: number[] = [];
  for (let i = 0; i < ema26.length; i++) {
    macdLine.push(ema12[i + offset] - ema26[i]);
  }

  const signalLine = ema(macdLine, 9);
  if (signalLine.length === 0) return { macd: null, signal: null, histogram: null, trend: "Insufficient data" };

  const macdVal = last(macdLine);
  const signalVal = last(signalLine);
  const histVal = macdVal - signalVal;

  const r = (n: number) => Math.round(n * 100) / 100;

  let trend: string;
  if (histVal > 0 && macdLine.length >= 2 && macdLine[macdLine.length - 1] > macdLine[macdLine.length - 2]) {
    trend = "Strong Bullish";
  } else if (histVal > 0) {
    trend = "Bullish";
  } else if (histVal < 0 && macdLine.length >= 2 && macdLine[macdLine.length - 1] < macdLine[macdLine.length - 2]) {
    trend = "Strong Bearish";
  } else if (histVal < 0) {
    trend = "Bearish";
  } else {
    trend = "Neutral";
  }

  return { macd: r(macdVal), signal: r(signalVal), histogram: r(histVal), trend };
}

export function computeBollingerBands(closes: number[], period = 20, multiplier = 2): BollingerResult {
  if (closes.length < period) return { upper: null, middle: null, lower: null, percentB: null };

  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = Math.round(mean + multiplier * stdDev);
  const lower = Math.round(mean - multiplier * stdDev);
  const middle = Math.round(mean);
  const currentPrice = last(closes);
  const percentB = upper === lower ? 0.5 : (currentPrice - lower) / (upper - lower);

  return {
    upper,
    middle,
    lower,
    percentB: Math.round(percentB * 100) / 100,
  };
}

export function computeMomentum(closes: number[]): MomentumResult {
  const roc = (period: number): number | null => {
    if (closes.length <= period) return null;
    const old = closes[closes.length - 1 - period];
    if (old === 0) return null;
    return Math.round(((last(closes) - old) / old) * 10000) / 100;
  };

  const roc7d = roc(7);
  const roc30d = roc(30);

  let direction: "up" | "down" | "flat" = "flat";
  if (roc7d !== null) {
    if (roc7d > 0.3) direction = "up";
    else if (roc7d < -0.3) direction = "down";
  }

  return { roc7d, roc30d, direction };
}

export function computeVolatility(closes: number[], period = 30): VolatilityResult {
  if (closes.length < period + 1) return { annualized: null, level: "normal" };

  const recent = closes.slice(-(period + 1));
  const returns: number[] = [];
  for (let i = 1; i < recent.length; i++) {
    if (recent[i - 1] !== 0) {
      returns.push((recent[i] - recent[i - 1]) / recent[i - 1]);
    }
  }
  if (returns.length === 0) return { annualized: null, level: "normal" };

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const daily = Math.sqrt(variance);
  const annualized = Math.round(daily * Math.sqrt(252) * 10000) / 100;

  let level: "low" | "normal" | "high" = "normal";
  if (annualized < 8) level = "low";
  else if (annualized > 18) level = "high";

  return { annualized, level };
}

export function findSupportResistance(closes: number[], lookback = 60): SupportResistanceResult {
  if (closes.length < 10) return { support: null, resistance: null };

  const window = closes.slice(-Math.min(lookback, closes.length));
  const support = Math.min(...window);
  const resistance = Math.max(...window);

  return { support: Math.round(support), resistance: Math.round(resistance) };
}

export function computePriceVsMA(currentPrice: number, smaResult: SMAResult): PriceVsMAResult {
  const aboveSMA7 = smaResult.sma7 !== null ? currentPrice > smaResult.sma7 : null;
  const aboveSMA20 = smaResult.sma20 !== null ? currentPrice > smaResult.sma20 : null;
  const aboveSMA50 = smaResult.sma50 !== null ? currentPrice > smaResult.sma50 : null;
  const aboveSMA200 = smaResult.sma200 !== null ? currentPrice > smaResult.sma200 : null;

  const flags = [aboveSMA7, aboveSMA20, aboveSMA50, aboveSMA200].filter((v) => v !== null);
  const above = flags.filter(Boolean).length;
  const total = flags.length;

  let maSignal: string;
  if (total === 0) maSignal = "Insufficient data";
  else if (above === total) maSignal = "Strong Bullish";
  else if (above >= total * 0.75) maSignal = "Bullish";
  else if (above >= total * 0.5) maSignal = "Neutral";
  else if (above >= total * 0.25) maSignal = "Bearish";
  else maSignal = "Strong Bearish";

  return { aboveSMA7, aboveSMA20, aboveSMA50, aboveSMA200, maSignal };
}

// ---------------------------------------------------------------------------
// Composite score — weighted blend of sub-scores (each 0-100)
// ---------------------------------------------------------------------------

function clamp(v: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}

export function computeCompositeScore(indicators: AllIndicators): CompositeResult {
  const weights = { rsi: 25, priceVsMA: 20, macd: 20, bollinger: 15, momentum: 10, volatility: 10 };
  let totalWeight = 0;
  let weightedSum = 0;

  // RSI → already 0-100
  if (indicators.rsi.value !== null) {
    weightedSum += indicators.rsi.value * weights.rsi;
    totalWeight += weights.rsi;
  }

  // Price vs MA → Strong Bullish=90, Bullish=70, Neutral=50, Bearish=30, Strong Bearish=10
  const maMap: Record<string, number> = {
    "Strong Bullish": 90,
    Bullish: 70,
    Neutral: 50,
    Bearish: 30,
    "Strong Bearish": 10,
  };
  if (maMap[indicators.priceVsMA.maSignal] !== undefined) {
    weightedSum += maMap[indicators.priceVsMA.maSignal] * weights.priceVsMA;
    totalWeight += weights.priceVsMA;
  }

  // MACD histogram
  const macdMap: Record<string, number> = {
    "Strong Bullish": 85,
    Bullish: 65,
    Neutral: 50,
    Bearish: 35,
    "Strong Bearish": 15,
  };
  if (macdMap[indicators.macd.trend] !== undefined) {
    weightedSum += macdMap[indicators.macd.trend] * weights.macd;
    totalWeight += weights.macd;
  }

  // Bollinger %B → 0-1 mapped to 0-100
  if (indicators.bollinger.percentB !== null) {
    weightedSum += clamp(indicators.bollinger.percentB * 100) * weights.bollinger;
    totalWeight += weights.bollinger;
  }

  // Momentum (30d ROC) → clamp to -10..+10 and scale
  if (indicators.momentum.roc30d !== null) {
    const scaled = clamp(((indicators.momentum.roc30d + 10) / 20) * 100);
    weightedSum += scaled * weights.momentum;
    totalWeight += weights.momentum;
  }

  // Volatility → low=65 (stable/bullish), normal=50, high=35 (uncertain)
  const volMap: Record<string, number> = { low: 65, normal: 50, high: 35 };
  if (indicators.volatility.annualized !== null) {
    weightedSum += (volMap[indicators.volatility.level] ?? 50) * weights.volatility;
    totalWeight += weights.volatility;
  }

  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;

  let sentiment: string;
  if (score >= 81) sentiment = "Strong Bullish";
  else if (score >= 61) sentiment = "Bullish";
  else if (score >= 41) sentiment = "Neutral";
  else if (score >= 21) sentiment = "Bearish";
  else sentiment = "Strong Bearish";

  return { score, sentiment };
}

// ---------------------------------------------------------------------------
// Chart data — rolling time-series for visualizations
// ---------------------------------------------------------------------------

export type ChartPoint = {
  date: string;
  price: number;
  sma7: number | null;
  sma20: number | null;
  bollingerUpper: number | null;
  bollingerLower: number | null;
};

export function computeChartData(data: PricePoint[], displayDays = 90): ChartPoint[] {
  const closes = data.map((d) => d.price);
  const result: ChartPoint[] = [];
  const startIdx = Math.max(0, data.length - displayDays);

  for (let i = startIdx; i < data.length; i++) {
    const sma7Val = i >= 6 ? closes.slice(i - 6, i + 1).reduce((a, b) => a + b, 0) / 7 : null;
    const sma20Val = i >= 19 ? closes.slice(i - 19, i + 1).reduce((a, b) => a + b, 0) / 20 : null;

    let bollingerUpper: number | null = null;
    let bollingerLower: number | null = null;
    if (i >= 19) {
      const slice = closes.slice(i - 19, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / 20;
      const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / 20;
      const stdDev = Math.sqrt(variance);
      bollingerUpper = Math.round(mean + 2 * stdDev);
      bollingerLower = Math.round(mean - 2 * stdDev);
    }

    result.push({
      date: data[i].date,
      price: Math.round(closes[i]),
      sma7: sma7Val !== null ? Math.round(sma7Val) : null,
      sma20: sma20Val !== null ? Math.round(sma20Val) : null,
      bollingerUpper,
      bollingerLower,
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main entry — compute everything from a time-series
// ---------------------------------------------------------------------------

export function computeAllIndicators(data: PricePoint[]) {
  if (data.length === 0) {
    return null;
  }

  const closes = data.map((d) => d.price);
  const currentPrice = last(closes);

  const smaResult = computeSMA(closes);
  const rsi = computeRSI(closes);
  const macd = computeMACD(closes);
  const bollinger = computeBollingerBands(closes);
  const momentum = computeMomentum(closes);
  const volatility = computeVolatility(closes);
  const supportResistance = findSupportResistance(closes);
  const priceVsMA = computePriceVsMA(currentPrice, smaResult);

  const indicators: AllIndicators = {
    sma: smaResult,
    rsi,
    macd,
    bollinger,
    momentum,
    volatility,
    supportResistance,
    priceVsMA,
  };

  const composite = computeCompositeScore(indicators);

  return {
    currentPrice: Math.round(currentPrice),
    dataPoints: data.length,
    composite,
    indicators,
  };
}
