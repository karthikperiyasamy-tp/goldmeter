"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface BucketItem {
  _id: string;
  count: number;
}
interface CommunityStats {
  totalComments: number;
  totalQuestions: number;
  todaySentimentVotes: number;
}
interface AnalyticsData {
  totalViews: number;
  uniqueUsers: number;
  topPages: BucketItem[];
  sources: BucketItem[];
  topCities: BucketItem[];
  hourlyTraffic: BucketItem[];
  sectionBreakdown: BucketItem[];
  deviceBreakdown: BucketItem[];
  browserBreakdown: BucketItem[];
  topArticles: BucketItem[];
  topRecaps: BucketItem[];
  calculatorBreakdown: BucketItem[];
  bounceRate: number;
  newUsers: number;
  returningUsers: number;
  realtimeUsers: number;
  avgSessionDurationSec: number;
  engagedUsers: number;
  gamesViews: number;
  gamesUniqueUsers: number;
  gamesRealtimeUsers: number;
  gamesShare: number;
  marketPulseViews: number;
  marketPulseUniqueUsers: number;
  marketPulseRealtimeUsers: number;
  marketPulseShare: number;
  geoRedirectFunnel: {
    homeLandings: number;
    redirectExpected: number;
    redirectApplied: number;
    redirectSkipped: number;
    finalLandingPageviews: number;
  };
  deltas?: {
    totalViews: number;
    uniqueUsers: number;
    bounceRate: number;
    newUsers: number;
    returningUsers: number;
    gamesViews: number;
    avgSessionDurationSec: number;
  } | null;
  sectionDetails?: {
    section: string;
    totalViews: number;
    uniqueUsers: number;
    topPages: BucketItem[];
    sources: BucketItem[];
    topCities: BucketItem[];
  } | null;
  sectionPerformance: {
    section: string;
    totalViews: number;
    uniqueUsers: number;
    avgEngagementSec: number;
    medianEngagementSec: number;
    bounceRate: number;
    ctaClicks: number;
    topPage: string;
    leastPage: string;
  }[];
  calculatorInsights: {
    calculator: string;
    views: number;
    uniqueUsers: number;
    avgEngagementSec: number;
    medianEngagementSec: number;
    interactions: number;
    completionRate: number;
  }[];
  jewellerInsights: {
    page: string;
    views: number;
    uniqueUsers: number;
    avgEngagementSec: number;
    ctaClicks: number;
  }[];
  goldRateCityInsights: {
    city: string;
    views: number;
    uniqueUsers: number;
    avgEngagementSec: number;
    medianEngagementSec: number;
  }[];
  goldRateLocaleInsights: {
    locale: string;
    views: number;
    uniqueUsers: number;
    avgEngagementSec: number;
  }[];
  funnels: {
    calculators: { views: number; interactions: number; cta: number; conversions: number };
    jewellers: { views: number; interactions: number; cta: number; conversions: number };
    goldRateCities: { views: number; interactions: number; cta: number; conversions: number };
  };
  previous?: AnalyticsData | null;
  appliedFilters?: {
    locale?: string;
    device?: string;
    source?: string;
    city?: string;
    section?: string;
  };
  communityStats: CommunityStats;
}

const TIME_RANGES = [
  { value: "5m", label: "5 min" },
  { value: "15m", label: "15 min" },
  { value: "30m", label: "30 min" },
  { value: "1h", label: "1 hr" },
  { value: "4h", label: "4 hr" },
  { value: "12h", label: "12 hr" },
  { value: "24h", label: "24 hr" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

const DEVICE_COLORS: Record<string, string> = {
  desktop: "#f59e0b",
  mobile: "#6366f1",
  tablet: "#10b981",
  bot: "#94a3b8",
  unknown: "#d1d5db",
};

const BROWSER_COLORS: Record<string, string> = {
  Chrome: "#4285F4",
  Safari: "#000000",
  Firefox: "#FF7139",
  Edge: "#0078D7",
  Opera: "#FF1B2D",
  IE: "#0076D6",
  Bot: "#94a3b8",
  Other: "#d1d5db",
  unknown: "#d1d5db",
};

const SECTION_CFG: Record<string, { emoji: string; color: string }> = {
  "Gold Rate": { emoji: "🥇", color: "bg-amber-500" },
  "Silver Rate": { emoji: "🥈", color: "bg-slate-400" },
  "Market Pulse": { emoji: "📈", color: "bg-rose-500" },
  Games: { emoji: "🎮", color: "bg-violet-500" },
  Portfolio: { emoji: "💼", color: "bg-purple-500" },
  Articles: { emoji: "📝", color: "bg-blue-500" },
  News: { emoji: "📰", color: "bg-emerald-500" },
  Calculator: { emoji: "🧮", color: "bg-orange-500" },
  Community: { emoji: "💬", color: "bg-teal-500" },
  Jewellers: { emoji: "💎", color: "bg-pink-500" },
  Compare: { emoji: "⚖️", color: "bg-cyan-500" },
  Other: { emoji: "📁", color: "bg-gray-400" },
};

/* ---------- tiny helpers ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-slate-700 mb-3">{children}</h2>;
}

function EmptyRow() {
  return <p className="text-xs text-slate-400 italic">No data</p>;
}

function formatSlug(path: string) {
  return path
    .replace(/^\/(?:hi|ta|te)\//, "/")
    .replace(/^\/(articles|news\/recap)\//, "")
    .replace(/-/g, " ");
}

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatSlugLabel(value: string) {
  return value.replace(/^\/(?:hi|ta|te)\//, "/").replace(/^\/+/, "").replace(/-/g, " ");
}

function pctDelta(curr: number, prev: number) {
  if (!prev && !curr) return 0;
  if (!prev && curr > 0) return 100;
  if (!prev) return 0;
  return Number((((curr - prev) / prev) * 100).toFixed(1));
}

function getDropRate(from: number, to: number) {
  if (!from) return 0;
  return Number((((from - to) / from) * 100).toFixed(1));
}

function DeltaBadge({
  value,
  inverse = false,
  suffix = "%",
}: {
  value?: number | null;
  inverse?: boolean;
  suffix?: string;
}) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const better = inverse ? value < 0 : value > 0;
  const neutral = value === 0;
  const cls = neutral
    ? "bg-slate-100 text-slate-600"
    : better
      ? "bg-emerald-100 text-emerald-700"
      : "bg-rose-100 text-rose-700";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
      {sign}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

function SafePct({ num, den }: { num: number; den: number }) {
  if (!den) return <span>0%</span>;
  return <span>{((num / den) * 100).toFixed(1)}%</span>;
}

/* ---------- donut ---------- */

function Donut({ items, colorMap }: { items: BucketItem[]; colorMap: Record<string, string> }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (total === 0) return <EmptyRow />;

  let cumulative = 0;
  const segments = items.map((item) => {
    const pct = (item.count / total) * 100;
    const offset = cumulative;
    cumulative += pct;
    return { ...item, pct, offset };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 42 42" className="w-28 h-28 flex-shrink-0">
        <circle cx="21" cy="21" r="15.91549" fill="transparent" stroke="#f1f5f9" strokeWidth="5" />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="21"
            cy="21"
            r="15.91549"
            fill="transparent"
            stroke={colorMap[seg._id] || "#d1d5db"}
            strokeWidth="5"
            strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
            strokeDashoffset={`${100 - seg.offset + 25}`}
          />
        ))}
      </svg>
      <div className="space-y-1.5 flex-1 min-w-0">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorMap[seg._id] || "#d1d5db" }}
            />
            <span className="text-slate-600 capitalize truncate">{seg._id}</span>
            <span className="ml-auto font-semibold text-slate-800">{seg.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- horizontal bar list ---------- */

function HBarList({
  items,
  colorMap,
  max: maxProp,
}: {
  items: BucketItem[];
  colorMap?: Record<string, string>;
  max?: number;
}) {
  const biggest = maxProp || Math.max(...items.map((i) => i.count), 1);
  if (items.length === 0) return <EmptyRow />;
  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const pct = (item.count / biggest) * 100;
        const color = colorMap?.[item._id] || "#f59e0b";
        return (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-slate-600 truncate mr-2 capitalize">{item._id || "unknown"}</span>
              <span className="font-semibold text-slate-800 flex-shrink-0">{item.count.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- slug table ---------- */

function SlugTable({ items, label }: { items: BucketItem[]; label: string }) {
  if (items.length === 0) return <EmptyRow />;
  return (
    <div className="overflow-x-auto -mx-4 md:-mx-5">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left font-medium text-slate-500 px-4 md:px-5 pb-2">{label}</th>
            <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Views</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-50 last:border-0">
              <td className="px-4 md:px-5 py-2 text-slate-700 capitalize truncate max-w-[200px]">
                {formatSlug(item._id)}
              </td>
              <td className="px-4 md:px-5 py-2 text-right font-semibold text-slate-800">
                {item.count.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =================================================================
   MAIN PAGE
   ================================================================= */

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<{
    locale: string;
    device: string;
    source: string;
    city: string;
    sectionFilter: string;
  }>({
    locale: "",
    device: "",
    source: "",
    city: "",
    sectionFilter: "",
  });
  const [selectedRange, setSelectedRange] = useState("7d");
  const [compareMode, setCompareMode] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("analytics_admin_filters_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as typeof filters;
      setFilters((prev) => ({ ...prev, ...parsed }));
    } catch {
      // Ignore parse errors.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("analytics_admin_filters_v1", JSON.stringify(filters));
    } catch {
      // Ignore storage errors.
    }
  }, [filters]);

  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        range: selectedRange,
        compare: compareMode ? "1" : "0",
      });
      if (selectedSection) params.set("section", selectedSection);
      if (filters.locale) params.set("locale", filters.locale);
      if (filters.device) params.set("device", filters.device);
      if (filters.source) params.set("source", filters.source);
      if (filters.city) params.set("city", filters.city);
      if (filters.sectionFilter) params.set("sectionFilter", filters.sectionFilter);
      const res = await fetch(`/api/analytics/summary?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [selectedRange, compareMode, selectedSection, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoRefresh) {
      intervalRef.current = setInterval(() => fetchData(false), 30_000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, fetchData]);

  const sectionBreakdown = (data?.sectionBreakdown || []).map((s) => ({
    ...s,
    label: s._id,
    emoji: SECTION_CFG[s._id]?.emoji || "📁",
    color: SECTION_CFG[s._id]?.color || "bg-gray-400",
  }));
  const sectionTotal = sectionBreakdown.reduce((s, i) => s + i.count, 0);
  const cityOptions = Array.from(new Set((data?.goldRateCityInsights || []).map((c) => c.city))).sort();
  const sectionOptions = Array.from(new Set((data?.sectionPerformance || []).map((s) => s.section))).sort();
  const previousSectionMap = new Map((data?.previous?.sectionPerformance || []).map((s) => [s.section, s]));
  const previousCalculatorMap = new Map((data?.previous?.calculatorInsights || []).map((c) => [c.calculator, c]));
  const previousCityMap = new Map((data?.previous?.goldRateCityInsights || []).map((c) => [c.city, c]));

  const actionableInsights = (() => {
    if (!data) return [] as string[];
    const lines: string[] = [];
    const highTrafficLowEng = [...data.sectionPerformance]
      .filter((s) => s.totalViews > 100 && s.avgEngagementSec < 35)
      .sort((a, b) => b.totalViews - a.totalViews)[0];
    if (highTrafficLowEng) {
      lines.push(`High traffic, low engagement: ${highTrafficLowEng.section} (${highTrafficLowEng.totalViews.toLocaleString()} views, ${formatDuration(highTrafficLowEng.avgEngagementSec)} avg).`);
    }
    const highEngLowCta = [...data.sectionPerformance]
      .filter((s) => s.avgEngagementSec > 60 && s.ctaClicks < Math.max(5, Math.round(s.totalViews * 0.01)))
      .sort((a, b) => b.avgEngagementSec - a.avgEngagementSec)[0];
    if (highEngLowCta) {
      lines.push(`High engagement, low CTA: ${highEngLowCta.section} (${formatDuration(highEngLowCta.avgEngagementSec)} avg, ${highEngLowCta.ctaClicks} CTA clicks).`);
    }
    const highestAbandon = [...data.calculatorInsights]
      .filter((c) => c.interactions >= 10)
      .sort((a, b) => a.completionRate - b.completionRate)[0];
    if (highestAbandon) {
      lines.push(`Calculator with highest abandonment: ${formatSlugLabel(highestAbandon.calculator)} (${highestAbandon.completionRate.toFixed(1)}% completion).`);
    }
    const lowGoldCity = [...data.goldRateCityInsights]
      .filter((c) => c.views > 50 && c.avgEngagementSec < 30)
      .sort((a, b) => b.views - a.views)[0];
    if (lowGoldCity) {
      lines.push(`Gold city page needing content work: ${lowGoldCity.city} (${lowGoldCity.views.toLocaleString()} views, ${formatDuration(lowGoldCity.avgEngagementSec)} avg).`);
    }
    return lines;
  })();

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Analytics</h1>
            {data && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {data.realtimeUsers} live
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[10px] text-slate-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => setAutoRefresh((prev) => !prev)}
              className={`px-2.5 py-1 text-[10px] rounded-lg font-medium transition-colors border ${
                autoRefresh
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300"
              }`}
              title="Auto-refresh every 30s"
            >
              {autoRefresh ? "⟳ Auto" : "⟳ Auto"}
            </button>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="px-2.5 py-1 text-[10px] rounded-lg font-medium bg-white text-slate-500 border border-slate-200 hover:border-amber-300 disabled:opacity-50"
            >
              Refresh
            </button>
            <Link href="/" className="text-amber-600 hover:underline text-xs">
              ← Home
            </Link>
          </div>
        </div>

        {/* Range picker */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {TIME_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedRange(r.value)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  selectedRange === r.value
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCompareMode((prev) => !prev)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${
              compareMode
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
          >
            {compareMode ? "Compare: ON" : "Compare: OFF"}
          </button>
          {selectedSection && (
            <button
              onClick={() => setSelectedSection(null)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium bg-white text-slate-600 border border-slate-200 hover:border-amber-300"
            >
              Clear Section Filter
            </button>
          )}
        </div>

        {/* Global sticky filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <select
            value={filters.locale}
            onChange={(e) => setFilters((prev) => ({ ...prev, locale: e.target.value }))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700"
          >
            <option value="">All locales</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
          <select
            value={filters.device}
            onChange={(e) => setFilters((prev) => ({ ...prev, device: e.target.value }))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700"
          >
            <option value="">All devices</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
            <option value="bot">Bot</option>
          </select>
          <select
            value={filters.source}
            onChange={(e) => setFilters((prev) => ({ ...prev, source: e.target.value }))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700"
          >
            <option value="">All sources</option>
            <option value="direct">Direct</option>
            <option value="google">Google</option>
            <option value="search">Search</option>
            <option value="social">Social</option>
            <option value="referral">Referral</option>
          </select>
          <select
            value={filters.city}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700"
          >
            <option value="">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={filters.sectionFilter}
            onChange={(e) => setFilters((prev) => ({ ...prev, sectionFilter: e.target.value }))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700"
          >
            <option value="">All sections</option>
            {sectionOptions.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        {(filters.locale || filters.device || filters.source || filters.city || filters.sectionFilter) && (
          <div className="flex justify-end">
            <button
              onClick={() => setFilters({ locale: "", device: "", source: "", city: "", sectionFilter: "" })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-amber-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <Card>
            <p className="text-red-600 font-medium text-sm mb-1">Failed to load analytics</p>
            <p className="text-xs text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
            >
              Retry
            </button>
          </Card>
        )}

        {/* Dashboard */}
        {!loading && !error && data && (
          <>
            {/* ---- Row 1: KPI cards ---- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Page Views</p>
                  {compareMode && <DeltaBadge value={data.deltas?.totalViews} />}
                </div>
                <p className="text-2xl font-bold text-slate-800">{data.totalViews.toLocaleString()}</p>
              </Card>
              <Card>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Unique Visitors</p>
                  {compareMode && <DeltaBadge value={data.deltas?.uniqueUsers} />}
                </div>
                <p className="text-2xl font-bold text-slate-800">{data.uniqueUsers.toLocaleString()}</p>
              </Card>
              <Card>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Pages / User</p>
                <p className="text-2xl font-bold text-slate-800">
                  {data.uniqueUsers > 0 ? (data.totalViews / data.uniqueUsers).toFixed(1) : "0"}
                </p>
              </Card>
              <Card>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Bounce Rate</p>
                  {compareMode && <DeltaBadge value={data.deltas?.bounceRate} inverse />}
                </div>
                <p className="text-2xl font-bold text-slate-800">{data.bounceRate}%</p>
              </Card>
              <Card>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">New Visitors</p>
                  {compareMode && <DeltaBadge value={data.deltas?.newUsers} />}
                </div>
                <p className="text-2xl font-bold text-indigo-600">{data.newUsers.toLocaleString()}</p>
              </Card>
              <Card>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Returning</p>
                  {compareMode && <DeltaBadge value={data.deltas?.returningUsers} />}
                </div>
                <p className="text-2xl font-bold text-amber-600">{data.returningUsers.toLocaleString()}</p>
              </Card>
            </div>

            {/* ---- Row 1B: Engagement + Games + Market Pulse ---- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card>
                <SectionTitle>Engagement Quality</SectionTitle>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatDuration(data.avgSessionDurationSec)}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                      Avg Session (proxy)
                    </p>
                    {compareMode && (
                      <div className="mt-1">
                        <DeltaBadge value={data.deltas?.avgSessionDurationSec} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {data.engagedUsers.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                      Engaged Users (2+ views)
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionTitle>Games Performance</SectionTitle>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-violet-600">
                      {data.gamesViews.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Views</p>
                    {compareMode && (
                      <div className="mt-1">
                        <DeltaBadge value={data.deltas?.gamesViews} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">
                      {data.gamesUniqueUsers.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Unique</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-600">
                      {data.gamesShare.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Share</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-600">
                      {data.gamesRealtimeUsers}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Live (5m)</p>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionTitle>Market Pulse Performance</SectionTitle>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-rose-600">
                      {(data.marketPulseViews ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Views</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">
                      {(data.marketPulseUniqueUsers ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Unique</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-600">
                      {(data.marketPulseShare ?? 0).toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Share</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-600">
                      {data.marketPulseRealtimeUsers ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Live (5m)</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* ---- Row 1C: Geo Redirect Funnel ---- */}
            <Card>
              <SectionTitle>Geo Redirect Funnel</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-slate-800">
                    {data.geoRedirectFunnel.homeLandings.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Home Landings</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-600">
                    {data.geoRedirectFunnel.redirectExpected.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Redirect Expected</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    <SafePct
                      num={data.geoRedirectFunnel.redirectExpected}
                      den={data.geoRedirectFunnel.homeLandings}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">
                    {data.geoRedirectFunnel.redirectApplied.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Redirect Applied</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    <SafePct
                      num={data.geoRedirectFunnel.redirectApplied}
                      den={data.geoRedirectFunnel.redirectExpected}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-indigo-600">
                    {data.geoRedirectFunnel.redirectSkipped.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Redirect Skipped</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    <SafePct
                      num={data.geoRedirectFunnel.redirectSkipped}
                      den={data.geoRedirectFunnel.homeLandings}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-violet-600">
                    {data.geoRedirectFunnel.finalLandingPageviews.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Final Landing PV</p>
                </div>
              </div>
            </Card>

            {/* ---- Row 2: Section breakdown ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Actionable Insights</SectionTitle>
                {actionableInsights.length > 0 ? (
                  <ul className="space-y-2 text-xs text-slate-700">
                    {actionableInsights.map((insight, idx) => (
                      <li key={idx} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                        {insight}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyRow />
                )}
              </Card>
              <Card>
                <SectionTitle>Section Funnels (View → Interact → CTA → Conversion)</SectionTitle>
                {data.funnels ? (
                  <div className="space-y-3 text-xs">
                    {[
                      { label: "Calculators", data: data.funnels.calculators },
                      { label: "Jewellers", data: data.funnels.jewellers },
                      { label: "Gold Rate Cities", data: data.funnels.goldRateCities },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <p className="mb-2 font-semibold text-slate-700">{f.label}</p>
                        <div className="grid grid-cols-4 gap-2">
                          <div><p className="text-slate-400">Views</p><p className="font-semibold text-slate-800">{f.data.views.toLocaleString()}</p></div>
                          <div><p className="text-slate-400">Interact</p><p className="font-semibold text-slate-800">{f.data.interactions.toLocaleString()}</p></div>
                          <div><p className="text-slate-400">CTA</p><p className="font-semibold text-slate-800">{f.data.cta.toLocaleString()}</p></div>
                          <div><p className="text-slate-400">Convert</p><p className="font-semibold text-slate-800">{f.data.conversions.toLocaleString()}</p></div>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500">
                          Drop: {getDropRate(f.data.views, f.data.interactions).toFixed(1)}% → {getDropRate(f.data.interactions, f.data.cta).toFixed(1)}% → {getDropRate(f.data.cta, f.data.conversions).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>
            </div>

            {sectionBreakdown.length > 0 && (
              <Card>
                <SectionTitle>Section Breakdown</SectionTitle>
                <div className="flex rounded-full overflow-hidden h-3 mb-4 bg-slate-100">
                  {sectionBreakdown.map((sec, i) => {
                    const pct = sectionTotal > 0 ? (sec.count / sectionTotal) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className={`${sec.color} transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`${sec.label}: ${sec.count} (${pct.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-2">
                  {sectionBreakdown.map((sec, i) => {
                    const pct = sectionTotal > 0 ? ((sec.count / sectionTotal) * 100).toFixed(1) : "0";
                    const selected = selectedSection === sec.label;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedSection(sec.label)}
                        className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-xs text-left transition-colors ${
                          selected
                            ? "border-amber-300 bg-amber-50"
                            : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sec.color}`} />
                        <span className="text-slate-600">
                          {sec.emoji} {sec.label}
                        </span>
                        <span className="ml-auto font-semibold text-slate-800">
                          {sec.count.toLocaleString()}{" "}
                          <span className="text-slate-400 font-normal">({pct}%)</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {selectedSection && data.sectionDetails && (
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <SectionTitle>{data.sectionDetails.section} Drill-down</SectionTitle>
                  <span className="text-xs text-slate-500">
                    {data.sectionDetails.totalViews.toLocaleString()} views ·{" "}
                    {data.sectionDetails.uniqueUsers.toLocaleString()} users
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Top Pages</p>
                    <HBarList items={data.sectionDetails.topPages} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Top Sources</p>
                    <HBarList items={data.sectionDetails.sources} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Top Cities</p>
                    <HBarList items={data.sectionDetails.topCities} />
                  </div>
                </div>
              </Card>
            )}

            {/* ---- Row 3: Device + Browser + New/Returning ---- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Card>
                <SectionTitle>Device Breakdown</SectionTitle>
                <Donut items={data.deviceBreakdown || []} colorMap={DEVICE_COLORS} />
              </Card>

              <Card>
                <SectionTitle>Browser Breakdown</SectionTitle>
                <HBarList items={data.browserBreakdown || []} colorMap={BROWSER_COLORS} />
              </Card>

              <Card>
                <SectionTitle>New vs Returning</SectionTitle>
                {data.newUsers + data.returningUsers > 0 ? (
                  <>
                    <div className="flex rounded-full overflow-hidden h-3 mb-4 bg-slate-100">
                      <div
                        className="bg-indigo-500"
                        style={{
                          width: `${(data.newUsers / (data.newUsers + data.returningUsers)) * 100}%`,
                        }}
                      />
                      <div className="bg-amber-500 flex-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-indigo-600">{data.newUsers.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">New</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-600">{data.returningUsers.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">Returning</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyRow />
                )}
              </Card>
            </div>

            {/* ---- Row 4: Top Articles + Top Recaps ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Top Articles</SectionTitle>
                <SlugTable items={data.topArticles || []} label="Article" />
              </Card>
              <Card>
                <SectionTitle>Top News Recaps</SectionTitle>
                <SlugTable items={data.topRecaps || []} label="Recap" />
              </Card>
            </div>

            {/* ---- Row 5: Calculator + Community Stats ---- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Calculator Usage</SectionTitle>
                {(data.calculatorBreakdown || []).length > 0 ? (
                  <HBarList
                    items={(data.calculatorBreakdown || []).map((c) => ({
                      _id: c._id
                        .replace(/^\/(?:hi|ta|te)\//, "/")
                        .replace(
                          /^\/(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|wedding-gold-planner|sip-calculator|sip-calculator-with-step-up|swp-calculator-with-inflation|hallmark-guide).*/,
                          "$1"
                        )
                        .replace(/-/g, " "),
                      count: c.count,
                    }))}
                  />
                ) : (
                  <EmptyRow />
                )}
              </Card>

              <Card>
                <SectionTitle>Community</SectionTitle>
                {data.communityStats ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {data.communityStats.totalComments}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Comments</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {data.communityStats.totalQuestions}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Questions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {data.communityStats.todaySentimentVotes}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Votes Today</p>
                    </div>
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>
            </div>

            {/* ---- Row 6: Existing — Top Pages + Sources ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Top Pages</SectionTitle>
                {data.topPages.length > 0 ? (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {data.topPages.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0">
                        <span className="text-slate-600 font-mono truncate mr-2">{p._id || "/"}</span>
                        <span className="font-semibold text-slate-800 flex-shrink-0">{p.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>

              <Card>
                <SectionTitle>Traffic Sources</SectionTitle>
                <HBarList items={data.sources} />
              </Card>
            </div>

            {/* ---- Row 7: Cities + Hourly ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Top Cities</SectionTitle>
                {data.topCities.length > 0 ? (
                  <div className="space-y-1.5">
                    {data.topCities.map((c, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                        <span className="text-slate-600">{c._id}</span>
                        <span className="font-semibold text-slate-800">{c.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>

              <Card>
                <SectionTitle>Traffic Over Time</SectionTitle>
                {data.hourlyTraffic.length > 0 ? (
                  <div className="space-y-0">
                    <div className="flex items-end gap-px h-40 mb-2">
                      {(() => {
                        const maxCount = Math.max(...data.hourlyTraffic.map(h => h.count), 1);
                        return data.hourlyTraffic.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 min-w-0 group relative"
                            title={`${h._id}: ${h.count.toLocaleString()}`}
                          >
                            <div
                              className="w-full bg-amber-400 rounded-t-sm hover:bg-amber-500 transition-colors"
                              style={{ height: `${Math.max((h.count / maxCount) * 100, 2)}%` }}
                            />
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                              {h.count.toLocaleString()}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>{data.hourlyTraffic[0]?._id?.split(" ").pop()}</span>
                      <span>{data.hourlyTraffic[data.hourlyTraffic.length - 1]?._id?.split(" ").pop()}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 text-right mt-1">
                      Peak: {Math.max(...data.hourlyTraffic.map(h => h.count)).toLocaleString()} ·
                      Total: {data.hourlyTraffic.reduce((s, h) => s + h.count, 0).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>
            </div>

            {/* ---- Row 8: Section deep analysis ---- */}
            <Card>
              <SectionTitle>Section Engagement Deep Dive</SectionTitle>
              {(data.sectionPerformance || []).length > 0 ? (
                <div className="overflow-x-auto -mx-4 md:-mx-5">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left font-medium text-slate-500 px-4 md:px-5 pb-2">Section</th>
                        <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Views</th>
                        <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Users</th>
                        <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Avg Time (Δ)</th>
                        <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Median</th>
                        <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Bounce</th>
                        <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">CTA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sectionPerformance.map((item) => {
                        const prev = previousSectionMap.get(item.section);
                        return (
                        <tr key={item.section} className="border-b border-slate-50 last:border-0">
                          <td className="px-4 md:px-5 py-2 font-medium text-slate-700">{item.section}</td>
                          <td className="px-4 md:px-5 py-2 text-right font-semibold text-slate-800">{item.totalViews.toLocaleString()}</td>
                          <td className="px-4 md:px-5 py-2 text-right text-slate-700">{item.uniqueUsers.toLocaleString()}</td>
                          <td className="px-4 md:px-5 py-2 text-right text-emerald-700 font-semibold">
                            {formatDuration(item.avgEngagementSec)}
                            {prev && (
                              <span className="ml-1 text-[10px] text-slate-500">
                                ({pctDelta(item.avgEngagementSec, prev.avgEngagementSec)}%)
                              </span>
                            )}
                          </td>
                          <td className="px-4 md:px-5 py-2 text-right text-slate-700">{formatDuration(item.medianEngagementSec)}</td>
                          <td className="px-4 md:px-5 py-2 text-right text-slate-700">{item.bounceRate.toFixed(1)}%</td>
                          <td className="px-4 md:px-5 py-2 text-right text-amber-700 font-semibold">{item.ctaClicks.toLocaleString()}</td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyRow />
              )}
            </Card>

            {/* ---- Row 9: Calculator + Jewellers drilldown ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Calculator Drilldown (Most vs Least)</SectionTitle>
                {(data.calculatorInsights || []).length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-700">Most Used</p>
                        <p className="text-sm font-semibold text-emerald-900 mt-1">{formatSlugLabel(data.calculatorInsights[0].calculator)}</p>
                        <p className="text-xs text-emerald-700 mt-1">{data.calculatorInsights[0].views.toLocaleString()} views</p>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-[10px] uppercase tracking-wide text-amber-700">Least Used</p>
                        <p className="text-sm font-semibold text-amber-900 mt-1">
                          {formatSlugLabel(data.calculatorInsights[data.calculatorInsights.length - 1].calculator)}
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          {data.calculatorInsights[data.calculatorInsights.length - 1].views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                    <div className="overflow-x-auto -mx-4 md:-mx-5">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left font-medium text-slate-500 px-4 md:px-5 pb-2">Calculator</th>
                            <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Avg Time (Δ)</th>
                            <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Interactions</th>
                            <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Completion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.calculatorInsights.slice(0, 10).map((item) => {
                            const prev = previousCalculatorMap.get(item.calculator);
                            return (
                            <tr key={item.calculator} className="border-b border-slate-50 last:border-0">
                              <td className="px-4 md:px-5 py-2 text-slate-700">{formatSlugLabel(item.calculator)}</td>
                              <td className="px-4 md:px-5 py-2 text-right font-semibold text-emerald-700">
                                {formatDuration(item.avgEngagementSec)}
                                {prev && (
                                  <span className="ml-1 text-[10px] text-slate-500">
                                    ({pctDelta(item.avgEngagementSec, prev.avgEngagementSec)}%)
                                  </span>
                                )}
                              </td>
                              <td className="px-4 md:px-5 py-2 text-right text-slate-700">{item.interactions.toLocaleString()}</td>
                              <td className="px-4 md:px-5 py-2 text-right text-amber-700 font-semibold">{item.completionRate.toFixed(1)}%</td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>

              <Card>
                <SectionTitle>Jewellers Drilldown</SectionTitle>
                {(data.jewellerInsights || []).length > 0 ? (
                  <div className="overflow-x-auto -mx-4 md:-mx-5">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left font-medium text-slate-500 px-4 md:px-5 pb-2">Jeweller Page</th>
                          <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Views</th>
                          <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Avg Time (Δ)</th>
                          <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">CTA Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.jewellerInsights.slice(0, 12).map((item) => (
                          <tr key={item.page} className="border-b border-slate-50 last:border-0">
                            <td className="px-4 md:px-5 py-2 text-slate-700">{formatSlugLabel(item.page)}</td>
                            <td className="px-4 md:px-5 py-2 text-right font-semibold text-slate-800">{item.views.toLocaleString()}</td>
                            <td className="px-4 md:px-5 py-2 text-right text-emerald-700 font-semibold">{formatDuration(item.avgEngagementSec)}</td>
                            <td className="px-4 md:px-5 py-2 text-right text-amber-700 font-semibold">{item.ctaClicks.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>
            </div>

            {/* ---- Row 10: Gold rate city drilldown ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Gold Rate City Drilldown</SectionTitle>
                {(data.goldRateCityInsights || []).length > 0 ? (
                  <div className="overflow-x-auto -mx-4 md:-mx-5">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left font-medium text-slate-500 px-4 md:px-5 pb-2">City</th>
                          <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Views</th>
                          <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Users</th>
                          <th className="text-right font-medium text-slate-500 px-4 md:px-5 pb-2">Avg Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.goldRateCityInsights.slice(0, 15).map((item) => {
                          const prev = previousCityMap.get(item.city);
                          return (
                          <tr key={item.city} className="border-b border-slate-50 last:border-0">
                            <td className="px-4 md:px-5 py-2 capitalize text-slate-700">{item.city.replace(/-/g, " ")}</td>
                            <td className="px-4 md:px-5 py-2 text-right font-semibold text-slate-800">{item.views.toLocaleString()}</td>
                            <td className="px-4 md:px-5 py-2 text-right text-slate-700">{item.uniqueUsers.toLocaleString()}</td>
                            <td className="px-4 md:px-5 py-2 text-right text-emerald-700 font-semibold">
                              {formatDuration(item.avgEngagementSec)}
                              {prev && (
                                <span className="ml-1 text-[10px] text-slate-500">
                                  ({pctDelta(item.avgEngagementSec, prev.avgEngagementSec)}%)
                                </span>
                              )}
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>

              <Card>
                <SectionTitle>Gold Rate Locale Performance</SectionTitle>
                {(data.goldRateLocaleInsights || []).length > 0 ? (
                  <div className="space-y-2">
                    {data.goldRateLocaleInsights.map((item) => (
                      <div key={item.locale} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 uppercase">{item.locale}</p>
                          <p className="text-[11px] text-slate-500">{item.uniqueUsers.toLocaleString()} users</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">{item.views.toLocaleString()} views</p>
                          <p className="text-[11px] font-medium text-emerald-700">{formatDuration(item.avgEngagementSec)} avg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyRow />
                )}
              </Card>
            </div>

            {/* GA comparison */}
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Why This Shows More Traffic Than Google Analytics
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>
                  <strong>Server-side tracking</strong> — can&apos;t be blocked by ad blockers (30-50% of
                  users)
                </li>
                <li>
                  <strong>Privacy browsers</strong> — captures Brave, Firefox Enhanced Protection users
                </li>
                <li>
                  <strong>All traffic</strong> — shows the actual traffic your server receives
                </li>
              </ul>
            </Card>

            <p className="text-center text-[10px] text-slate-400 pb-4">
              MongoDB server-side tracking · real-time · privacy-friendly
            </p>
          </>
        )}
      </div>
    </div>
  );
}
