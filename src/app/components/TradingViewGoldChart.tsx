"use client";

import { useEffect, useRef, useState } from "react";

const TV_SCRIPT = "https://s3.tradingview.com/tv.js";

type TradingViewWidgetConfig = {
  container_id: string;
  width: string;
  height: number;
  symbol: string;
  interval: string;
  timezone: string;
  theme: "light" | "dark";
  style: string;
  locale: string;
  toolbar_bg?: string;
  enable_publishing: boolean;
  hide_top_toolbar: boolean;
  hide_legend: boolean;
};

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: TradingViewWidgetConfig) => unknown;
    };
  }
}

type Props = {
  /** TradingView symbol, e.g. OANDA:XAUUSD */
  symbol?: string;
  height?: number;
  className?: string;
};

/**
 * Embeds TradingView’s chart widget (see https://www.tradingview.com/widget-docs/).
 * Data, branding, and terms are provided by TradingView — not GoldMeter.
 */
export default function TradingViewGoldChart({
  symbol = "OANDA:XAUUSD",
  height = 520,
  className = "",
}: Props) {
  const [containerId] = useState(
    () => `tradingview_gold_${Math.random().toString(36).slice(2, 11)}`
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountEl = containerRef.current;
    if (!mountEl) return;

    let cancelled = false;

    function paintWidget() {
      if (cancelled || !mountEl || !window.TradingView?.widget) return;
      mountEl.innerHTML = "";
      const inner = document.createElement("div");
      inner.id = containerId;
      inner.style.height = "100%";
      inner.style.width = "100%";
      mountEl.appendChild(inner);

      new window.TradingView.widget({
        container_id: containerId,
        width: "100%",
        height,
        symbol,
        interval: "D",
        timezone: "Asia/Kolkata",
        theme: "light",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
      });
    }

    if (window.TradingView?.widget) {
      paintWidget();
      return () => {
        cancelled = true;
        mountEl.innerHTML = "";
      };
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${TV_SCRIPT}"]`
    );

    const onLoad = () => paintWidget();

    if (!script) {
      script = document.createElement("script");
      script.src = TV_SCRIPT;
      script.async = true;
      script.addEventListener("load", onLoad);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", onLoad);
      if (window.TradingView?.widget) {
        paintWidget();
      }
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", onLoad);
      mountEl.innerHTML = "";
    };
  }, [containerId, height, symbol]);

  return (
    <div
      className={`tradingview-widget-container overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}
      style={{ minHeight: height }}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ minHeight: height }}
        aria-label="TradingView gold chart"
      />
    </div>
  );
}
