/**
 * % change vs yesterday / ~7d / ~30d for city gold rates (10g prices).
 * Used on city gold pages; history from getHistoricalGoldRates (sorted ascending by time).
 */

const MS_PER_DAY = 86400000;

export type GoldHistoryPoint = {
  timestamp: number;
  gold22k: number;
  gold24k: number;
};

export type GoldPeriodPctSnapshot = {
  pct22: number | null;
  pct24: number | null;
};

export type GoldPeriodPctChanges = {
  yesterday: GoldPeriodPctSnapshot;
  week: GoldPeriodPctSnapshot;
  month: GoldPeriodPctSnapshot;
};

function pctVsPast(current: number, past: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(past) || past <= 0) return null;
  return ((current - past) / past) * 100;
}

/** Parse YYYY-MM-DD to UTC noon for stable day-boundary math */
export function parseDateISOAnchorMs(dateISO: string): number {
  const trimmed = dateISO?.trim() ?? "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) return Date.now();
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return Date.now();
  return Date.UTC(y, mo - 1, d, 12, 0, 0);
}

/**
 * Latest history row at or before (anchorMs - offsetDays), using only rows on/before anchor.
 */
export function findGoldRateBeforeOffsetDays(
  historySortedAsc: GoldHistoryPoint[],
  anchorMs: number,
  offsetDays: number
): { gold22k: number; gold24k: number } | null {
  const cutoff = anchorMs - offsetDays * MS_PER_DAY;
  let best: GoldHistoryPoint | null = null;
  for (const row of historySortedAsc) {
    if (row.timestamp > anchorMs) continue;
    if (row.gold24k <= 0 || row.gold22k <= 0) continue;
    if (row.timestamp <= cutoff) {
      best = row;
    }
  }
  return best ? { gold22k: best.gold22k, gold24k: best.gold24k } : null;
}

function normalizeHistory(
  history: Array<{
    timestamp: number;
    gold22k: number | null;
    gold24k: number | null;
  }>
): GoldHistoryPoint[] {
  return history
    .filter((h) => h.gold22k != null && h.gold24k != null)
    .map((h) => ({
      timestamp: h.timestamp,
      gold22k: h.gold22k as number,
      gold24k: h.gold24k as number,
    }))
    .filter((h) => h.gold22k > 0 && h.gold24k > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * @param gold22k10g / gold24k10g — current headline rates (per 10g)
 * @param priceChange — vs yesterday (10g), from DB (may use day-before-yesterday fallback)
 */
export function computeGoldPeriodPercentChanges(params: {
  gold22k10g: number;
  gold24k10g: number;
  priceChange: { gold22k: number; gold24k: number };
  history: Array<{
    timestamp: number;
    gold22k: number | null;
    gold24k: number | null;
  }>;
  dateISO: string;
}): GoldPeriodPctChanges {
  const { gold22k10g, gold24k10g, priceChange, history, dateISO } = params;

  const prev22 = gold22k10g - (priceChange.gold22k || 0);
  const prev24 = gold24k10g - (priceChange.gold24k || 0);

  const yesterday: GoldPeriodPctSnapshot = {
    pct22: pctVsPast(gold22k10g, prev22),
    pct24: pctVsPast(gold24k10g, prev24),
  };

  const sorted = normalizeHistory(history);
  const anchorMs = parseDateISOAnchorMs(dateISO);

  const weekBase = findGoldRateBeforeOffsetDays(sorted, anchorMs, 7);
  const monthBase = findGoldRateBeforeOffsetDays(sorted, anchorMs, 30);

  return {
    yesterday,
    week: {
      pct22: weekBase ? pctVsPast(gold22k10g, weekBase.gold22k) : null,
      pct24: weekBase ? pctVsPast(gold24k10g, weekBase.gold24k) : null,
    },
    month: {
      pct22: monthBase ? pctVsPast(gold22k10g, monthBase.gold22k) : null,
      pct24: monthBase ? pctVsPast(gold24k10g, monthBase.gold24k) : null,
    },
  };
}
