"use client";

import { useEffect } from "react";

export default function AdScript() {
  console.log("[AdScript] Component rendered");

  useEffect(() => {
    console.log("[AdScript] useEffect fired");

    if (document.getElementById("AdsCoreLoader101206")) {
      console.log("[AdScript] Script already exists, skipping");
      return;
    }

    console.log("[AdScript] Creating ads-core-ads container div");
    const container = document.createElement("div");
    container.className = "ads-core-ads";
    document.body.appendChild(container);

    console.log("[AdScript] Creating script element for adsboosters");
    const s = document.createElement("script");
    s.src =
      "https://sads.adsboosters.xyz/6b25da1d7c79a47dd21b1764379d56a3.js";
    s.id = "AdsCoreLoader101206";
    s.type = "text/javascript";
    s.setAttribute("data-cfasync", "false");

    s.onload = () => {
      console.log("[AdScript] adsboosters script LOADED successfully");
      const adsDivs = document.querySelectorAll(".ads-core-ads");
      console.log("[AdScript] ads-core-ads divs found:", adsDivs.length);
      adsDivs.forEach((div, i) =>
        console.log(`[AdScript] div[${i}] innerHTML length:`, div.innerHTML.length)
      );
    };

    s.onerror = (err) => {
      console.error("[AdScript] adsboosters script FAILED to load", err);
    };

    console.log("[AdScript] Appending script to body");
    document.body.appendChild(s);
    console.log("[AdScript] Script appended, waiting for load...");
  }, []);

  return null;
}
