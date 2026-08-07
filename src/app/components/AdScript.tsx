"use client";

import { useEffect } from "react";

export default function AdScript() {
  useEffect(() => {
    // Prevent duplicate script insertion in modern React Strict Mode
    const scriptId = "hilltopads-ad-script";
    if (document.getElementById(scriptId)) return;

    // Inject the third-party ad script dynamically
    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "//shameful-farm.com/bKXAVcs.djGll/0uYyWPcG/zenmH9mulZFUPlDkdPMTIcLymOoTjUs5iOoT/cjtRNPzIIx5uNZjDAXw-MpQv";
    s.async = true;
    s.referrerPolicy = "no-referrer-when-downgrade";

    // Attach to document body or head
    document.body.appendChild(s);

    // Prevent duplicate script execution
    const scriptId2 = "hilltopads-popunder-script";
    if (document.getElementById(scriptId2)) return;

    // Inject the Popunder script
    const s2 = document.createElement("script");
    s2.id = scriptId2;
    s2.src = "//windy-imagination.com/c.D_9N6ybQ2Y5C1TSrWbQQ9/N/z/IT5cO_D/QiwH0/Ss0Z3XMOjbkU4MNID/EUzB";
    s2.async = true;
    s2.referrerPolicy = "no-referrer-when-downgrade";

    document.body.appendChild(s2);
    
    //if (document.getElementById("AdsCoreLoader101206")) return;

    // const container = document.createElement("div");
    // container.className = "ads-core-ads";
    // document.body.appendChild(container);

    // const s = document.createElement("script");
    // s.src =
    //   "https://sads.adsboosters.xyz/6b25da1d7c79a47dd21b1764379d56a3.js";
    // s.id = "AdsCoreLoader101206";
    // s.type = "text/javascript";
    // s.setAttribute("data-cfasync", "false");
    // document.body.appendChild(s);

    // // Monetag In-Page Push
    // if (!document.getElementById("monetag-inpage")) {
    //   const monetag = document.createElement("script");
    //   monetag.id = "monetag-inpage";
    //   monetag.dataset.zone = "11275969";
    //   monetag.src = "https://nap5k.com/tag.min.js";
    //   document.body.appendChild(monetag);
    // }
  }, []);

  return null;
}
