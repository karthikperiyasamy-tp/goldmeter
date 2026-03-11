"use client";

import { useEffect } from "react";

/**
 * Safely loads the ad script outside React's render cycle.
 * Errors thrown by ad network scripts are caught and logged
 * instead of crashing the React error boundary.
 */
export default function AdScript() {
  useEffect(() => {
    try {
      const container = document.getElementById("ads-core-container");
      if (!container) return;

      // Prevent duplicate injection on HMR / re-mount
      if (document.getElementById("AdsCoreLoader101206")) return;

      const script = document.createElement("script");
      script.id = "AdsCoreLoader101206";
      script.src =
        "https://sads.adsboosters.xyz/6b25da1d7c79a47dd21b1764379d56a3.js";
      script.type = "text/javascript";
      script.setAttribute("data-cfasync", "false");
      script.async = true;

      script.onerror = () => {
        console.warn("[Ads] Ad script failed to load");
      };

      container.appendChild(script);
    } catch (e) {
      console.warn("[Ads] Error injecting ad script:", e);
    }
  }, []);

  return <div id="ads-core-container" className="ads-core-ads" />;
}
