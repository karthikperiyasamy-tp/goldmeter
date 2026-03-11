"use client";

import Script from "next/script";

/**
 * Ad loader: renders the required container div and loads the
 * ad network script via next/script with lazyOnload strategy.
 * Body has suppressHydrationWarning to tolerate DOM changes
 * the ad script makes.
 */
export default function AdScript() {
  return (
    <>
      <div className="ads-core-ads" suppressHydrationWarning />
      <Script
        id="AdsCoreLoader101206"
        src="https://sads.adsboosters.xyz/6b25da1d7c79a47dd21b1764379d56a3.js"
        strategy="lazyOnload"
        data-cfasync="false"
      />
    </>
  );
}
