"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import type { ChartPoint } from "@/lib/goldIndicators";

// ---------------------------------------------------------------------------
// Semicircular gauge (composite score / RSI)
// ---------------------------------------------------------------------------

function GaugeChart({
  value,
  max = 100,
  label,
  sentiment,
  zones,
}: {
  value: number;
  max?: number;
  label: string;
  sentiment: string;
  zones?: { from: number; to: number; color: string }[];
}) {
  const radius = 80;
  const stroke = 14;
  const cx = 100;
  const cy = 95;
  const circumference = Math.PI * radius;

  const defaultZones = [
    { from: 0, to: 20, color: "#ef4444" },
    { from: 20, to: 40, color: "#f97316" },
    { from: 40, to: 60, color: "#eab308" },
    { from: 60, to: 80, color: "#22c55e" },
    { from: 80, to: 100, color: "#059669" },
  ];
  const usedZones = zones || defaultZones;
  const clamped = Math.max(0, Math.min(max, value));
  const angle = (clamped / max) * 180;
  const needleRad = ((180 - angle) * Math.PI) / 180;
  const needleLen = radius - 10;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy - needleLen * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[220px]">
        {usedZones.map((zone) => {
          const startAngle = 180 - (zone.from / max) * 180;
          const endAngle = 180 - (zone.to / max) * 180;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = cx + radius * Math.cos(startRad);
          const y1 = cy - radius * Math.sin(startRad);
          const x2 = cx + radius * Math.cos(endRad);
          const y2 = cy - radius * Math.sin(endRad);
          const largeArc = zone.to - zone.from > max / 2 ? 1 : 0;
          return (
            <path
              key={zone.from}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`}
              fill="none"
              stroke={zone.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              opacity={0.25}
            />
          );
        })}

        {/* Filled arc up to value */}
        {clamped > 0 && (
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 ${angle > 90 ? 1 : 0} 1 ${cx + radius * Math.cos(needleRad)} ${cy - radius * Math.sin(needleRad)}`}
            fill="none"
            stroke={
              clamped >= 61
                ? "#22c55e"
                : clamped >= 41
                  ? "#eab308"
                  : "#f97316"
            }
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        )}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#334155"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill="#334155" />

        <text x={cx} y={cy - 20} textAnchor="middle" className="text-2xl font-extrabold" fill="#1e293b" fontSize="28">
          {value}
        </text>
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#64748b" fontSize="10">
          / {max}
        </text>
      </svg>
      <p className="mt-1 text-sm font-semibold text-slate-800">{label}</p>
      <p className={`text-xs font-medium ${
        sentiment.includes("Bullish") ? "text-green-700"
          : sentiment.includes("Bearish") ? "text-orange-700"
            : "text-amber-700"
      }`}>
        {sentiment}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom tooltip for the price chart
// ---------------------------------------------------------------------------

function PriceTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return d;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{formatDate(label ?? "")}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RSI Gauge
// ---------------------------------------------------------------------------

function RSIGauge({ value }: { value: number | null }) {
  if (value === null) return <p className="text-sm text-slate-400">No data</p>;

  const signal =
    value >= 70
      ? "Overbought"
      : value >= 60
        ? "Mildly Bullish"
        : value >= 40
          ? "Neutral"
          : value >= 30
            ? "Mildly Bearish"
            : "Oversold";

  return (
    <GaugeChart
      value={Math.round(value)}
      label="RSI (14-day)"
      sentiment={signal}
      zones={[
        { from: 0, to: 30, color: "#22c55e" },
        { from: 30, to: 40, color: "#86efac" },
        { from: 40, to: 60, color: "#eab308" },
        { from: 60, to: 70, color: "#fca5a5" },
        { from: 70, to: 100, color: "#ef4444" },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

type MarketPulseChartsProps = {
  chartData: ChartPoint[];
  compositeScore: number;
  compositeSentiment: string;
  rsiValue: number | null;
  bollingerUpper: number | null;
  bollingerLower: number | null;
  support: number | null;
  resistance: number | null;
};

export default function MarketPulseCharts({
  chartData,
  compositeScore,
  compositeSentiment,
  rsiValue,
  bollingerUpper,
  bollingerLower,
  support,
  resistance,
}: MarketPulseChartsProps) {
  const formatXTick = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return date;
    }
  };

  const prices = chartData.map((d) => d.price).filter(Boolean);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;

  return (
    <div className="space-y-6">
      {/* Gauge Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-soft">
          <GaugeChart
            value={compositeScore}
            label="Composite Score"
            sentiment={compositeSentiment}
          />
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-soft">
          <RSIGauge value={rsiValue} />
        </div>
      </div>

      {/* Price Trend Chart */}
      <div className="rounded-3xl border border-amber-100 bg-white p-4 shadow-soft sm:p-6">
        <h3 className="mb-1 text-sm font-semibold text-charcoal">90-Day Price Trend</h3>
        <p className="mb-4 text-xs text-slate-500">24K gold per gram with moving averages &amp; Bollinger Bands</p>
        <div className="h-[300px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="bollingerFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXTick}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                domain={[Math.floor(minPrice), Math.ceil(maxPrice)]}
                tickFormatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<PriceTooltip />} />
              <Legend
                verticalAlign="top"
                height={30}
                iconType="line"
                wrapperStyle={{ fontSize: 11 }}
              />

              {/* Bollinger band area */}
              <Area
                type="monotone"
                dataKey="bollingerUpper"
                stroke="none"
                fill="none"
                name="Bollinger Upper"
                legendType="none"
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="bollingerLower"
                stroke="none"
                fill="url(#bollingerFill)"
                name="Bollinger Lower"
                legendType="none"
                connectNulls={false}
              />

              {/* Bollinger band lines */}
              <Line
                type="monotone"
                dataKey="bollingerUpper"
                stroke="#d97706"
                strokeWidth={1}
                strokeDasharray="4 3"
                dot={false}
                name="Bollinger Upper"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="bollingerLower"
                stroke="#d97706"
                strokeWidth={1}
                strokeDasharray="4 3"
                dot={false}
                name="Bollinger Lower"
                connectNulls={false}
              />

              {/* SMA lines */}
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                name="SMA-20"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="sma7"
                stroke="#06b6d4"
                strokeWidth={1.5}
                strokeDasharray="3 2"
                dot={false}
                name="SMA-7"
                connectNulls={false}
              />

              {/* Price line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#d97706"
                strokeWidth={2.5}
                dot={false}
                name="Price"
                activeDot={{ r: 4, fill: "#d97706", stroke: "#fff", strokeWidth: 2 }}
              />

              {/* Support / Resistance reference lines */}
              {resistance !== null && (
                <Line
                  type="monotone"
                  dataKey={() => resistance}
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="8 4"
                  dot={false}
                  name={`Resistance ₹${resistance.toLocaleString("en-IN")}`}
                  legendType="line"
                />
              )}
              {support !== null && (
                <Line
                  type="monotone"
                  dataKey={() => support}
                  stroke="#22c55e"
                  strokeWidth={1}
                  strokeDasharray="8 4"
                  dot={false}
                  name={`Support ₹${support.toLocaleString("en-IN")}`}
                  legendType="line"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
