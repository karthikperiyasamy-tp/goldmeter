"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
};

type RatesState = {
  rates: CityRate[];
  loading: boolean;
};

function cityHref(city: string) {
  if (city.toLowerCase() === "india") return "/";
  return `/gold-rate/${city.toLowerCase()}`;
}

export default function ArticleCityRatesSidebar() {
  const [state, setState] = useState<RatesState>({ rates: [], loading: true });

  useEffect(() => {
    let active = true;
    const loadRates = async () => {
      try {
        const res = await fetch("/api/calculator-rates", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (data?.success && Array.isArray(data.rates) && data.rates.length > 0) {
          setState({ rates: data.rates, loading: false });
          return;
        }
      } catch {
        // Fallback below.
      }
      if (!active) return;
      setState({
        loading: false,
        rates: [
          { name: "India", gold22k: 59200, gold24k: 64500 },
          { name: "Chennai", gold22k: 59680, gold24k: 64890 },
          { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
          { name: "Bangalore", gold22k: 59720, gold24k: 64980 },
          { name: "Delhi", gold22k: 59540, gold24k: 64720 },
          { name: "Hyderabad", gold22k: 59390, gold24k: 64580 },
        ],
      });
    };
    loadRates();
    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-soft">
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
        Today Gold Rate by City
      </h3>
      <p className="mt-2 text-xs text-slate-500">
        Live today gold rate and today gold price references.
      </p>
      {state.loading ? (
        <p className="mt-3 text-sm text-slate-500">Loading city rates...</p>
      ) : (
        <ul className="mt-4 space-y-2 max-h-[70vh] overflow-auto pr-1">
          {state.rates.map((rate) => (
            <li key={rate.name}>
              <Link
                href={cityHref(rate.name)}
                className="block rounded-xl border border-slate-100 bg-white px-3 py-2 hover:border-amber-200 hover:bg-amber-50/40 transition-colors"
              >
                <p className="text-sm font-semibold text-charcoal">{rate.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  22K: <span className="font-semibold text-slate-700">Rs {rate.gold22k.toLocaleString("en-IN")}/10g</span>
                  {"  "} | {"  "}
                  24K: <span className="font-semibold text-slate-700">Rs {rate.gold24k.toLocaleString("en-IN")}/10g</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
