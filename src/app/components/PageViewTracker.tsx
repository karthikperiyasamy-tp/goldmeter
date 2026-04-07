"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side page view tracker
 * Sends page views to API route (which can use MongoDB)
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  const getSessionId = () => {
    try {
      const key = "gm_analytics_session_id";
      const existing = sessionStorage.getItem(key);
      if (existing) return existing;
      const next = `s_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
      sessionStorage.setItem(key, next);
      return next;
    } catch {
      return `s_fallback_${Date.now().toString(36)}`;
    }
  };

  const getLocale = (path: string) => {
    const m = path.match(/^\/(hi|ta|te)(?:\/|$)/);
    return m?.[1] ?? "en";
  };

  const stripLocale = (path: string) => path.replace(/^\/(hi|ta|te)(?=\/|$)/, "") || "/";

  const getCalculatorType = (path: string) => {
    const normalized = stripLocale(path);
    const first = normalized.split("/").filter(Boolean)[0] || "";
    const known = [
      "calculator",
      "wastage-calculator",
      "purity-converter",
      "investment-calculator",
      "gold-loan-calculator",
      "wedding-gold-planner",
      "sip-calculator",
      "sip-calculator-with-step-up",
      "swp-calculator-with-inflation",
      "hallmark-guide",
    ];
    return known.includes(first) ? first : null;
  };

  const getSection = (path: string) => {
    const normalized = stripLocale(path);
    if (normalized === "/" || normalized.startsWith("/gold-rate") || normalized.startsWith("/gold-rate-today")) return "Gold Rate";
    if (normalized.startsWith("/silver-rate")) return "Silver Rate";
    if (normalized.startsWith("/gold-market-pulse")) return "Market Pulse";
    if (normalized.startsWith("/portfolio")) return "Portfolio";
    if (normalized.startsWith("/articles")) return "Articles";
    if (normalized.startsWith("/news")) return "News";
    if (normalized.startsWith("/community")) return "Community";
    if (normalized.startsWith("/jewellers")) return "Jewellers";
    if (normalized.startsWith("/gold-comparison")) return "Compare";
    if (normalized.startsWith("/games")) return "Games";
    if (getCalculatorType(path)) return "Calculator";
    return "Other";
  };

  const getPageType = (path: string) => {
    const normalized = stripLocale(path);
    if (/^\/gold-rate\/[^/]+$/.test(normalized)) return "gold_rate_city";
    if (/^\/silver-rate\/[^/]+$/.test(normalized)) return "silver_rate_city";
    if (normalized.startsWith("/jewellers/")) return "jeweller_detail";
    if (normalized.startsWith("/jewellers")) return "jeweller_list";
    if (normalized.startsWith("/news/recap/")) return "recap_detail";
    if (normalized.startsWith("/news/")) return "news_detail";
    if (normalized.startsWith("/articles/")) return "article_detail";
    return "general";
  };

  const getCitySlug = (path: string) => {
    const normalized = stripLocale(path);
    return normalized.match(/^\/(?:gold-rate|silver-rate)\/([^/]+)$/)?.[1] || null;
  };

  const sendEvent = (eventName: string, metadata?: Record<string, unknown>) => {
    const enriched = {
      sessionId: getSessionId(),
      section: getSection(pathname),
      pageType: getPageType(pathname),
      subSection: getCalculatorType(pathname) || undefined,
      locale: getLocale(pathname),
      citySlug: getCitySlug(pathname),
      calculatorType: getCalculatorType(pathname) || undefined,
      ...metadata,
    };
    const payload = JSON.stringify({
      eventName,
      path: pathname,
      metadata: enriched,
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
    if (shouldSendOnce(`analytics_event_page_view_enriched_${pathname}`)) {
      sendEvent("page_view_enriched", {
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      });
    }

    const img = new Image(1, 1);
    img.src = `/api/track?path=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin/")) return;

    let lastInteractionAt = Date.now();
    const onInteract = () => {
      lastInteractionAt = Date.now();
    };

    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];
    interactionEvents.forEach((evt) => window.addEventListener(evt, onInteract, { passive: true }));

    const heartbeat = window.setInterval(() => {
      const visible = document.visibilityState === "visible";
      const active = Date.now() - lastInteractionAt < 30_000;
      if (visible && active) {
        sendEvent("engagement_heartbeat");
      }
    }, 15_000);

    return () => {
      clearInterval(heartbeat);
      interactionEvents.forEach((evt) => window.removeEventListener(evt, onInteract));
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin/")) return;
    const sentDepths = new Set<number>();
    const thresholds = [25, 50, 75, 100];
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScrollable = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const pct = Math.min(100, Math.round((window.scrollY / maxScrollable) * 100));
      for (const depth of thresholds) {
        if (pct >= depth && !sentDepths.has(depth)) {
          sentDepths.add(depth);
          sendEvent("scroll_depth", { depth });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin/")) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor?.href) {
        try {
          const url = new URL(anchor.href, window.location.origin);
          if (url.origin !== window.location.origin) {
            sendEvent("outbound_click", {
              href: anchor.href,
              text: (anchor.textContent || "").trim().slice(0, 120),
            });
            return;
          }
          if (pathname.includes("/jewellers") && /\/jewellers\/[^/]+/.test(url.pathname)) {
            sendEvent("jeweller_profile_click", { href: url.pathname });
          }
        } catch {
          // Ignore invalid URL parsing.
        }
      }
      const button = target.closest("button") as HTMLButtonElement | null;
      if (button) {
        const txt = (button.textContent || "").trim().toLowerCase();
        if (txt.includes("calculate") || txt.includes("compare") || txt.includes("submit") || txt.includes("track")) {
          sendEvent("cta_click", { text: txt.slice(0, 120) });
          if (getSection(pathname) === "Calculator" && txt.includes("calculate")) {
            sendEvent("calculator_complete", { text: txt.slice(0, 120) });
          }
        }
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    if (getSection(pathname) !== "Calculator") return;
    let lastSent = 0;
    const sendInteraction = (eventType: string) => {
      const now = Date.now();
      if (now - lastSent < 5000) return;
      lastSent = now;
      sendEvent("tool_interaction", { eventType });
    };
    const onInput = () => sendInteraction("input");
    const onChange = () => sendInteraction("change");
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") sendInteraction("enter");
    };
    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onChange, true);
    document.addEventListener("keydown", onKeydown, true);
    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("keydown", onKeydown, true);
    };
  }, [pathname]);

  return null;
}
