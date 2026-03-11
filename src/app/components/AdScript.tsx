"use client";

import { useEffect, useRef } from "react";

/**
 * Renders the ad container div in React's tree (so it exists from SSR)
 * but loads the ad script via native DOM API to isolate any errors
 * from React's reconciliation.
 */
export default function AdScript() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (document.getElementById("AdsCoreLoader101206")) return;
    loaded.current = true;

    try {
      const script = document.createElement("script");
      script.id = "AdsCoreLoader101206";
      script.src =
        "https://sads.adsboosters.xyz/6b25da1d7c79a47dd21b1764379d56a3.js";
      script.type = "text/javascript";
      script.setAttribute("data-cfasync", "false");
      script.async = true;
      script.onerror = () => console.warn("[Ads] Ad script failed to load");

      document.head.appendChild(script);
    } catch (e) {
      console.warn("[Ads] Error injecting ad script:", e);
    }
  }, []);

  return <div className="ads-core-ads" suppressHydrationWarning />;
}
