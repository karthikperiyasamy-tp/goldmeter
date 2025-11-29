"use client";

import { useState, useEffect } from "react";
import PriceChart from "./PriceChart";
import type { ChartDataPoint, TimeRange } from "../utils/chartDataHelpers";

type PriceChartWrapperProps = {
  city: string;
  // Optional initial data from server
  initialData?: ChartDataPoint[];
  // Fallback prices if no historical data
  currentGold22k: number;
  currentGold24k: number;
};

// Generate fallback data if no historical data exists
function generateFallbackData(
  currentGold22k: number,
  currentGold24k: number,
  days: number
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Small realistic variations
    const variation22k = (Math.random() - 0.5) * 0.02;
    const variation24k = (Math.random() - 0.5) * 0.02;
    const trendFactor = (days - i) / days * 0.015;

    data.push({
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      gold22k: Math.round(currentGold22k * (1 + variation22k - trendFactor)),
      gold24k: Math.round(currentGold24k * (1 + variation24k - trendFactor)),
      timestamp: date.getTime(),
    });
  }

  return data;
}

export default function PriceChartWrapper({
  city,
  initialData,
  currentGold22k,
  currentGold24k,
}: PriceChartWrapperProps) {
  const [chartRange, setChartRange] = useState<TimeRange>("7D");
  const [chartData, setChartData] = useState<ChartDataPoint[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRealData, setHasRealData] = useState(false);

  // Fetch data when range changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/gold-prices/history?city=${encodeURIComponent(city)}&range=${chartRange}`
        );
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setChartData(result.data);
          setHasRealData(true);
        } else {
          // Use fallback data if no real data
          const days = chartRange === "7D" ? 7 : chartRange === "30D" ? 30 : 365;
          setChartData(generateFallbackData(currentGold22k, currentGold24k, days));
          setHasRealData(false);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Use fallback on error
        const days = chartRange === "7D" ? 7 : chartRange === "30D" ? 30 : 365;
        setChartData(generateFallbackData(currentGold22k, currentGold24k, days));
        setHasRealData(false);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [city, chartRange, currentGold22k, currentGold24k]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Price Trend - {city}</h3>
          <p className="text-sm text-slate-500">
            Historical price movement · Per 10 grams
            {!hasRealData && chartData.length > 0 && (
              <span className="ml-2 text-xs text-amber-600">(Estimated)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 rounded-full bg-amber-50 p-1 text-sm font-semibold">
          {(["7D", "30D", "1Y"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setChartRange(range)}
              className={`rounded-full px-4 py-1 transition-colors ${
                chartRange === range
                  ? "bg-white text-amber-600 shadow-soft"
                  : "text-slate-500 hover:text-amber-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              Loading chart data...
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <PriceChart data={chartData} range={chartRange} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            No price data available
          </div>
        )}
      </div>
    </div>
  );
}

