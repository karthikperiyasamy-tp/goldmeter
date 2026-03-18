"use client";

import { useState, useEffect } from "react";
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
  const [selectedRange, setSelectedRange] = useState("7d");
  const [compareMode, setCompareMode] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          range: selectedRange,
          compare: compareMode ? "1" : "0",
        });
        if (selectedSection) params.set("section", selectedSection);
        const res = await fetch(`/api/analytics/summary?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        if (!cancelled) setData(result);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedRange, compareMode, selectedSection]);

  const sectionBreakdown = (data?.sectionBreakdown || []).map((s) => ({
    ...s,
    label: s._id,
    emoji: SECTION_CFG[s._id]?.emoji || "📁",
    color: SECTION_CFG[s._id]?.color || "bg-gray-400",
  }));
  const sectionTotal = sectionBreakdown.reduce((s, i) => s + i.count, 0);

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
          <Link href="/" className="text-amber-600 hover:underline text-xs">
            ← Back to Home
          </Link>
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

            {/* ---- Row 1B: Engagement + Games ---- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-violet-600">
                      {data.gamesViews.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Game Views</p>
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
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Traffic Share</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-600">
                      {data.gamesRealtimeUsers}
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
                  <div className="space-y-0.5 max-h-64 overflow-y-auto">
                    {data.hourlyTraffic.map((h, i) => (
                      <div key={i} className="flex justify-between text-[11px] py-0.5">
                        <span className="text-slate-500 font-mono">{h._id}</span>
                        <span className="font-semibold text-slate-800">{h.count}</span>
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
