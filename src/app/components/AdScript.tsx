"use client";

import { useEffect } from "react";

export default function AdScript() {
  useEffect(() => {
    // 1. First Ad Script (Video / Native)
    const scriptId1 = "hilltopads-ad-script";
    if (!document.getElementById(scriptId1)) {
      const s1 = document.createElement("script");
      s1.id = scriptId1;
      s1.src = "//shameful-farm.com/bKXAVcs.djGll/0uYyWPcG/zenmH9mulZFUPlDkdPMTIcLymOoTjUs5iOoT/cjtRNPzIIx5uNZjDAXw-MpQv";
      s1.async = true;
      s1.referrerPolicy = "no-referrer-when-downgrade";
      document.body.appendChild(s1);
    }

    // 2. Popunder Script (Zone #7298409)
    const scriptId2 = "hilltopads-popunder-7298409";
    if (!document.getElementById(scriptId2)) {
      const s2 = document.createElement("script");
      s2.id = scriptId2;
      s2.src = "//windy-imagination.com/cVD_9/6.bN2/5MlPSrWxQY9IN/zfId50OBDOQUwvO1S/0W3dM_jZkD4nNCDNEbzR";
      s2.async = true;
      s2.referrerPolicy = "no-referrer-when-downgrade";
      document.body.appendChild(s2);
    }
  }, []);

  return null;
}
