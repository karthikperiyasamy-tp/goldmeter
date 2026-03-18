"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side page view tracker
 * Sends page views to API route (which can use MongoDB)
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  const sendEvent = (eventName: string, metadata?: Record<string, unknown>) => {
    const payload = JSON.stringify({
      eventName,
      path: pathname,
      metadata,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track-event", blob);
        return;
      }
    } catch {
      // Fallback below.
    }

    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  };

  const shouldSendOnce = (key: string, ttlMs: number = 15_000) => {
    try {
      const now = Date.now();
      const existingRaw = sessionStorage.getItem(key);
      const existing = existingRaw ? Number(existingRaw) : 0;
      if (existing && now - existing < ttlMs) return false;
      sessionStorage.setItem(key, String(now));
      return true;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (pathname.startsWith('/admin/')) return;

    // Skip homepage tracking when a geo-redirect is pending.
    // Without stayOnIndia / geo_redirect_checked / preferredCity the user
    // will be redirected to a city page within milliseconds, which would
    // double-count the visit (once for "/" and once for "/gold-rate/{city}").
    if (pathname === '/') {
      const c = document.cookie;
      const hasNoRedirectParam = new URLSearchParams(window.location.search).has("noredirect");
      const willStay =
        c.includes('stayOnIndia=') ||
        c.includes('geo_redirect_checked=') ||
        c.includes('preferredCity=') ||
        hasNoRedirectParam;

      if (shouldSendOnce(`analytics_event_home_landing_${pathname}`)) {
        sendEvent("home_landing_detected", {
          hasStayOnIndia: c.includes("stayOnIndia="),
          hasGeoChecked: c.includes("geo_redirect_checked="),
          hasPreferredCity: c.includes("preferredCity="),
          hasNoRedirectParam,
        });
      }

      if (!willStay) {
        try {
          sessionStorage.setItem("gm_geo_redirect_pending", "1");
        } catch {}
        if (shouldSendOnce(`analytics_event_geo_expected_${pathname}`)) {
          sendEvent("geo_redirect_expected");
        }
        return;
      }

      try {
        sessionStorage.removeItem("gm_geo_redirect_pending");
      } catch {}
      if (shouldSendOnce(`analytics_event_geo_skipped_${pathname}`)) {
        sendEvent("geo_redirect_skipped");
      }
    } else {
      try {
        const pending = sessionStorage.getItem("gm_geo_redirect_pending") === "1";
        if (pending) {
          sessionStorage.removeItem("gm_geo_redirect_pending");
          if (shouldSendOnce(`analytics_event_geo_applied_${pathname}`)) {
            sendEvent("geo_redirect_applied", { destination: pathname });
          }
        }
      } catch {}
    }

    if (shouldSendOnce(`analytics_event_final_landing_${pathname}`)) {
      sendEvent("final_landing_pageview");
    }

    const img = new Image(1, 1);
    img.src = `/api/track?path=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  return null;
}
