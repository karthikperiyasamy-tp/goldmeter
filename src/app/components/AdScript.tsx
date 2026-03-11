"use client";

import { useEffect } from "react";

/**
 * Loads the ad network script completely outside React's DOM tree.
 * Renders nothing — all DOM nodes are created via native APIs so
 * React never tries to reconcile them during hydration or re-renders.
 */
export default function AdScript() {
  useEffect(() => {
    // Prevent duplicate injection (HMR, StrictMode double-mount)
    if (document.getElementById("AdsCoreLoader101206")) return;

    try {
      const container = document.createElement("div");
      container.className = "ads-core-ads";
      container.id = "ads-core-container";
      document.body.appendChild(container);

      const script = document.createElement("script");
      script.id = "AdsCoreLoader101206";
      script.src =
        "https://sads.adsboosters.xyz/6b25da1d7c79a47dd21b1764379d56a3.js";
      script.type = "text/javascript";
      script.setAttribute("data-cfasync", "false");
      script.async = true;
      script.onerror = () => console.warn("[Ads] Ad script failed to load");
      document.body.appendChild(script);
    } catch (e) {
      console.warn("[Ads] Error injecting ad script:", e);
    }
  }, []);

  // Render nothing — keeps React's DOM tree clean
  return null;
}
