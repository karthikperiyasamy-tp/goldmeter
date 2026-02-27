"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LiveRateState = {
  gold22k: number | null;
  gold24k: number | null;
  loading: boolean;
};

export default function LiveGoldRateMention() {
  const [state, setState] = useState<LiveRateState>({
    gold22k: null,
    gold24k: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const loadRates = async () => {
      try {
        const res = await fetch("/api/calculator-rates", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (data?.success && Array.isArray(data.rates) && data.rates.length > 0) {
          const india = data.rates[0];
          setState({
            gold22k: Math.round((india.gold22k ?? 0) / 10),
            gold24k: Math.round((india.gold24k ?? 0) / 10),
            loading: false,
          });
          return;
        }
      } catch {
        // Fallback below.
      }
      if (!active) return;
      setState({ gold22k: 5920, gold24k: 6450, loading: false });
    };
    loadRates();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 my-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Today Gold Rate in India
      </p>
      {state.loading ? (
        <p className="text-sm text-slate-600 mt-1">Loading live gold rates...</p>
      ) : (
        <p className="text-sm text-slate-700 mt-1 leading-6">
          Looking for <Link href="/gold-rate-today" className="text-amber-700 font-semibold hover:text-amber-600">today gold rate</Link> or <strong>today gold price</strong>? In India, the current
          reference is about <strong>22K: Rs {state.gold22k?.toLocaleString("en-IN")}/g</strong> and{" "}
          <strong>24K: Rs {state.gold24k?.toLocaleString("en-IN")}/g</strong>. Final jewellery pricing can vary by
          city rates, purity, making charges, and taxes. See full <Link href="/gold-rate-today" className="text-amber-700 font-semibold hover:text-amber-600">gold rate today</Link> with city-wise breakdown.
        </p>
      )}
    </section>
  );
}
