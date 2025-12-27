"use client";

import { useEffect, useState } from "react";

type TickerData = {
  gold24k: number;
  gold22k: number;
  gold18k: number;
  silver1kg: number;
  gold24kChange: number;
  gold22kChange: number;
  silver1kgChange: number;
};

type PriceTickerProps = {
  initialData?: TickerData;
};

export default function PriceTicker({ initialData }: PriceTickerProps) {
  const [data, setData] = useState<TickerData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      // Fetch initial data if not provided
      fetch("/api/ticker-rates")
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setData(result.data);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [initialData]);

  if (isLoading || !data) {
    return (
      <div className="bg-slate-900 text-white py-2 overflow-hidden">
        <div className="animate-pulse flex justify-center gap-8">
          <span className="text-sm text-slate-400">Loading live prices...</span>
        </div>
      </div>
    );
  }

  // Calculate per gram prices
  const gold24kPerGram = Math.round(data.gold24k / 10);
  const gold22kPerGram = Math.round(data.gold22k / 10);
  const gold18kPerGram = Math.round(data.gold18k / 10);
  const silverPerGram = Math.round(data.silver1kg / 1000);
  const silverPer100g = Math.round(data.silver1kg / 10);

  // Calculate change per gram
  const gold24kChangePerGram = Math.round(data.gold24kChange / 10);
  const gold22kChangePerGram = Math.round(data.gold22kChange / 10);
  const silverChangePerGram = Math.round(data.silver1kgChange / 1000);

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
  
  const formatChange = (change: number) => {
    if (change === 0) return null;
    const isPositive = change > 0;
    return (
      <span className={`ml-1 text-xs ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
        {isPositive ? "▲" : "▼"} {Math.abs(change)}
      </span>
    );
  };

  // Ticker items - duplicated for seamless loop
  const tickerItems = [
    { label: "24K Gold", value: formatPrice(gold24kPerGram), unit: "/gm", change: gold24kChangePerGram, color: "text-amber-400" },
    { label: "22K Gold", value: formatPrice(gold22kPerGram), unit: "/gm", change: gold22kChangePerGram, color: "text-amber-400" },
    { label: "18K Gold", value: formatPrice(gold18kPerGram), unit: "/gm", change: 0, color: "text-amber-400" },
    { label: "Silver", value: formatPrice(silverPerGram), unit: "/gm", change: silverChangePerGram, color: "text-slate-300" },
    { label: "Silver 100g", value: formatPrice(silverPer100g), unit: "", change: 0, color: "text-slate-300" },
    { label: "Silver 1kg", value: formatPrice(data.silver1kg), unit: "", change: data.silver1kgChange, color: "text-slate-300" },
  ];

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10" />
      
      {/* Scrolling content - duplicated for seamless loop */}
      <div className="ticker-scroll flex whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="inline-flex items-center mx-6">
            <span className="text-xs text-slate-400 mr-2">{item.label}</span>
            <span className={`text-sm font-semibold ${item.color}`}>
              {item.value}
              <span className="text-xs text-slate-500">{item.unit}</span>
            </span>
            {formatChange(item.change)}
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-scroll {
          animation: ticker 25s linear infinite;
        }
        
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
        
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

