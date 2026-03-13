"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PROMO_STATE_KEY = "portfolioPromoState:v2";
const PORTFOLIO_COMPLETED_KEY = "portfolioOnboarded:v1";
const SHOW_DELAY_AFTER_INTERACTION_MS = 12000;
const REMIND_AFTER_MAYBE_LATER_MS = 24 * 60 * 60 * 1000;
const REMIND_AFTER_CTA_MS = 24 * 60 * 60 * 1000;

type PromoState = {
  nextEligibleAt?: number;
  lastAction?: "later" | "cta";
  lastShownAt?: number;
  impressions?: number;
};

function readPromoState(): PromoState {
  try {
    const raw = window.localStorage.getItem(PROMO_STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PromoState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePromoState(next: PromoState) {
  window.localStorage.setItem(PROMO_STATE_KEY, JSON.stringify(next));
}

function getLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/(hi|ta|te)(\/|$)/);
  return match ? `/${match[1]}` : "";
}

export default function PortfolioPromoBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [messageVariant, setMessageVariant] = useState<"first" | "reminderAfterCta" | "reminderAfterLater">("first");

  const localePrefix = useMemo(() => getLocalePrefix(pathname), [pathname]);

  const isEligibleToShow = () => {
    if (pathname.includes("/portfolio")) return false;
    if (window.localStorage.getItem(PORTFOLIO_COMPLETED_KEY) === "1") return false;

    const now = Date.now();
    const state = readPromoState();
    const nextEligibleAt = state.nextEligibleAt ?? 0;
    return now >= nextEligibleAt;
  };

  useEffect(() => {
    if (!isEligibleToShow()) {
      setVisible(false);
      return;
    }

    let hasScheduled = false;
    let showTimer: ReturnType<typeof setTimeout> | null = null;

    const schedulePromo = () => {
      if (hasScheduled) return;
      hasScheduled = true;
      showTimer = setTimeout(() => {
        if (!isEligibleToShow()) return;
        const current = readPromoState();
        const nextVariant =
          current.lastAction === "cta"
            ? "reminderAfterCta"
            : current.lastAction === "later"
            ? "reminderAfterLater"
            : "first";
        setMessageVariant(nextVariant);
        writePromoState({
          ...current,
          lastShownAt: Date.now(),
          impressions: (current.impressions ?? 0) + 1,
        });
        setVisible(true);
      }, SHOW_DELAY_AFTER_INTERACTION_MS);
      removeIntentListeners();
    };

    const onUserIntent = () => {
      schedulePromo();
    };

    const removeIntentListeners = () => {
      window.removeEventListener("pointerdown", onUserIntent);
      window.removeEventListener("scroll", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
      window.removeEventListener("touchstart", onUserIntent);
    };

    window.addEventListener("pointerdown", onUserIntent, { passive: true });
    window.addEventListener("scroll", onUserIntent, { passive: true });
    window.addEventListener("keydown", onUserIntent);
    window.addEventListener("touchstart", onUserIntent, { passive: true });

    return () => {
      removeIntentListeners();
      if (showTimer) clearTimeout(showTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    if (!isEligibleToShow()) {
      setVisible(false);
    }
  }, [visible]);

  const dismiss = () => {
    const current = readPromoState();
    writePromoState({
      ...current,
      lastAction: "later",
      nextEligibleAt: Date.now() + REMIND_AFTER_MAYBE_LATER_MS,
    });
    setVisible(false);
  };

  const goToPortfolio = () => {
    const current = readPromoState();
    writePromoState({
      ...current,
      lastAction: "cta",
      nextEligibleAt: Date.now() + REMIND_AFTER_CTA_MS,
    });
    setVisible(false);
    router.push(`${localePrefix}/portfolio`);
  };

  if (!visible) return null;

  const content =
    messageVariant === "reminderAfterCta"
      ? {
          icon: "✅",
          title: "Finish your portfolio setup",
          body: "You opened Portfolio earlier. Add your first gold entry to unlock live P&L and return tracking.",
          cta: "Continue setup",
          panelClass: "border-emerald-100 bg-emerald-50",
          ctaClass: "bg-emerald-600 hover:bg-emerald-700",
        }
      : messageVariant === "reminderAfterLater"
      ? {
          icon: "🔔",
          title: "Ready to track your gold buys?",
          body: "Add one purchase to start tracking value, profit/loss, and returns automatically.",
          cta: "Start now",
          panelClass: "border-sky-100 bg-sky-50",
          ctaClass: "bg-sky-600 hover:bg-sky-700",
        }
      : {
          icon: "🏆",
          title: "Start tracking your gold in 30 seconds",
          body: "Record your first purchase and instantly see live P&L, charts, and XIRR returns.",
          cta: "OK, open Portfolio",
          panelClass: "border-amber-100 bg-[#fffdf7]",
          ctaClass: "bg-amber-600 hover:bg-amber-700",
        };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/45 p-4">
      <div className={`w-full max-w-3xl rounded-3xl border p-6 text-center shadow-2xl sm:p-8 ${content.panelClass}`}>
        <div className="text-5xl" aria-hidden="true">
          {content.icon}
        </div>
        <h2 className="mt-3 text-2xl font-bold text-charcoal sm:text-4xl">
          {content.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-700 sm:text-3xl">
          {content.body}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={dismiss}
            className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
          >
            Maybe later
          </button>
          <button
            onClick={goToPortfolio}
            className={`w-full rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors sm:w-auto ${content.ctaClass}`}
          >
            {content.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

