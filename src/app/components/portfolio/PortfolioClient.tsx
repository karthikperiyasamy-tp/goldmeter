"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PortfolioTransaction,
  SyncStatus,
  TransactionType,
  GoldItemType,
} from "@/types/portfolio";
import { GOLD_ITEM_TYPES } from "@/types/portfolio";
import {
  getLocalTransactions,
  setLocalTransactions,
  clearLocalTransactions,
} from "@/lib/portfolio/localStore";
import { computeHoldings } from "@/lib/portfolio/calc";
import {
  isFirebaseConfigured,
  getFirebaseMissingConfigKeys,
  signInWithGoogle,
  signOut,
  onAuthChange,
} from "@/lib/firebase/client";
import {
  getCloudTransactions,
  upsertCloudTransaction,
  deleteCloudTransaction,
  migrateLocalToCloud,
} from "@/lib/portfolio/cloudStore";
import type { User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";

// ---------- helpers ----------

const genId = () => crypto.randomUUID();

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fmtG = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 3 });

const today = () => new Date().toISOString().slice(0, 10);

const getItemIcon = (itemType?: GoldItemType) => {
  const found = GOLD_ITEM_TYPES.find((t) => t.value === itemType);
  return found?.icon ?? "📦";
};

const getItemLabel = (tx: PortfolioTransaction) => {
  if (tx.itemType === "other" && tx.customItemName) return tx.customItemName;
  const found = GOLD_ITEM_TYPES.find((t) => t.value === tx.itemType);
  return found?.label ?? "Other";
};

const getItemLabelByType = (itemType?: GoldItemType) => {
  const found = GOLD_ITEM_TYPES.find((t) => t.value === itemType);
  return found?.label ?? "Other";
};

function getSyncErrorMessage(err: unknown): string {
  const code =
    typeof err === "object" && err && "code" in err
      ? String((err as FirebaseError).code)
      : "";

  if (code.includes("permission-denied")) {
    return "Firestore rules blocked access. Allow the signed-in user to read/write their own transactions.";
  }
  if (code.includes("failed-precondition")) {
    return "Firestore is not ready for this Firebase project yet. Create the Firestore database first.";
  }
  if (code.includes("unauthenticated")) {
    return "Your session expired. Please sign in again.";
  }
  if (code.includes("unavailable")) {
    return "Network issue while syncing. Please retry in a moment.";
  }
  return "Could not sync with Firebase. Check console for exact error details.";
}

// ---------- sub-components ----------

function SyncBadge({ status }: { status: SyncStatus }) {
  const map: Record<SyncStatus, { dot: string; label: string }> = {
    local: { dot: "bg-slate-400", label: "Local only" },
    syncing: { dot: "bg-amber-400 animate-pulse", label: "Syncing..." },
    synced: { dot: "bg-emerald-500", label: "Synced" },
    error: { dot: "bg-red-500", label: "Sync error" },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/** SVG Donut Chart — supports grams (default) or currency mode */
function DonutChart({ segments, mode = "grams" }: {
  segments: { label: string; value: number; color: string }[];
  mode?: "grams" | "currency";
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const fmtValue = mode === "currency" ? (v: number) => `₹${fmt(v)}` : (v: number) => `${fmtG(v)}g`;
  const centerText = mode === "currency" ? `₹${fmt(total)}` : `${fmtG(total)}g`;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0" role="img" aria-label={`Gold allocation donut chart — ${mode === "currency" ? "by value" : "by weight"}`}>
        {segments.filter((s) => s.value > 0).map((seg) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const currentOffset = offset;
          offset += dash;
          return (
            <circle key={seg.label} cx="50" cy="50" r={radius} fill="none" stroke={seg.color} strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-currentOffset} className="transition-all duration-500" />
          );
        })}
        <text x="50" y="48" textAnchor="middle" className="text-[8px] fill-slate-500">Total</text>
        <text x="50" y="58" textAnchor="middle" className={`fill-charcoal font-bold ${mode === "currency" ? "text-[8px]" : "text-[10px]"}`}>
          {centerText}
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.filter((s) => s.value > 0).map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600">
              {seg.label}: <strong className="text-charcoal">{fmtValue(seg.value)}</strong>
              <span className="text-slate-400 ml-1">({total > 0 ? ((seg.value / total) * 100).toFixed(0) : 0}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Horizontal bar chart */
function ValueBar({ invested, current }: { invested: number; current: number }) {
  const max = Math.max(invested, current, 1);
  const investedPct = (invested / max) * 100;
  const currentPct = (current / max) * 100;
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">Invested</span>
          <span className="font-semibold text-charcoal">₹{fmt(invested)}</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${investedPct}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">Current Value</span>
          <span className="font-semibold text-charcoal">₹{fmt(current)}</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${current >= invested ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}
            style={{ width: `${currentPct}%` }} />
        </div>
      </div>
    </div>
  );
}

/** SVG Line Chart for portfolio value over time */
function PortfolioLineChart({ dataPoints }: { dataPoints: { date: string; invested: number; value: number }[] }) {
  if (dataPoints.length < 2) return null;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const padding = { top: 10, right: 10, bottom: 24, left: 50 };
  const width = 500;
  const height = 220;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = dataPoints.flatMap((d) => [d.invested, d.value]);
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const range = maxVal - minVal || 1;

  const x = (i: number) => padding.left + (i / (dataPoints.length - 1)) * chartW;
  const y = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH;

  const investedPath = dataPoints.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.invested)}`).join(" ");
  const valuePath = dataPoints.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");

  // Fill area under value line
  const valueAreaPath = `${valuePath} L${x(dataPoints.length - 1)},${y(minVal)} L${x(0)},${y(minVal)} Z`;

  // Y-axis labels
  const yLabels = [minVal, minVal + range * 0.25, minVal + range * 0.5, minVal + range * 0.75, maxVal];
  const xLabelIndices = Array.from(
    new Set([0, Math.floor((dataPoints.length - 1) / 2), dataPoints.length - 1])
  );
  const activeIndex = hoverIndex;
  const activePoint = activeIndex !== null ? dataPoints[activeIndex] : null;

  const getClosestIndexFromClientX = (clientX: number, svgElement: SVGSVGElement) => {
    const rect = svgElement.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * width;
    const safeX = Math.min(width - padding.right, Math.max(padding.left, relativeX));
    const ratio = (safeX - padding.left) / chartW;
    return Math.round(ratio * (dataPoints.length - 1));
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-w-[320px]"
        role="img"
        aria-label="Portfolio value over time chart showing invested amount and current value"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={(e) => setHoverIndex(getClosestIndexFromClientX(e.clientX, e.currentTarget))}
        onMouseLeave={() => setHoverIndex(null)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (!touch) return;
          setHoverIndex(getClosestIndexFromClientX(touch.clientX, e.currentTarget));
        }}
        onTouchEnd={() => setHoverIndex(null)}
      >
        {/* Grid lines */}
        {yLabels.map((v) => (
          <g key={v}>
            <line x1={padding.left} y1={y(v)} x2={width - padding.right} y2={y(v)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 3" />
            <text x={padding.left - 4} y={y(v) + 3} textAnchor="end" className="text-[7px] fill-slate-400">
              ₹{v >= 100000 ? `${(v / 100000).toFixed(1)}L` : fmt(v)}
            </text>
          </g>
        ))}

        {/* Value area fill */}
        <path d={valueAreaPath} fill="url(#valueGrad)" opacity="0.15" />

        {/* Invested line */}
        <path d={investedPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Value line */}
        <path d={valuePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots on last point */}
        <circle cx={x(dataPoints.length - 1)} cy={y(dataPoints[dataPoints.length - 1].invested)} r="3" fill="#3b82f6" />
        <circle cx={x(dataPoints.length - 1)} cy={y(dataPoints[dataPoints.length - 1].value)} r="3" fill="#10b981" />
        {activeIndex !== null && (
          <>
            <line
              x1={x(activeIndex)}
              y1={padding.top}
              x2={x(activeIndex)}
              y2={height - padding.bottom}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <circle cx={x(activeIndex)} cy={y(dataPoints[activeIndex].invested)} r="4" fill="#3b82f6" />
            <circle cx={x(activeIndex)} cy={y(dataPoints[activeIndex].value)} r="4" fill="#10b981" />
          </>
        )}

        {/* X-axis labels (first, middle, last) */}
        {xLabelIndices.map((i) => (
          <text
            key={`x-${i}-${dataPoints[i]?.date ?? "na"}`}
            x={x(i)}
            y={height - 4}
            textAnchor="middle"
            className="text-[7px] fill-slate-400"
          >
            {new Date(dataPoints[i].date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
          </text>
        ))}

        {/* Gradient defs */}
        <defs>
          <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {activePoint && activeIndex !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur"
          style={{
            left: `${((x(activeIndex) / width) * 100).toFixed(2)}%`,
          }}
        >
          <p className="font-semibold text-charcoal">
            {new Date(activePoint.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p className="text-slate-600">
            <span className="text-blue-600 font-semibold">Invested:</span> ₹{fmt(activePoint.invested)}
          </p>
          <p className="text-slate-600">
            <span className="text-emerald-600 font-semibold">Value:</span> ₹{fmt(activePoint.value)}
          </p>
        </div>
      )}
      <div className="flex justify-center gap-6 mt-1 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" /> Invested</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" /> Portfolio Value</span>
      </div>
    </div>
  );
}

// ---------- tutorial ----------

interface TutorialStep {
  targetId: string | null;
  title: string;
  description: string;
  icon: string;
  position: "center" | "bottom" | "top";
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    targetId: null,
    title: "Welcome to Gold Portfolio Tracker!",
    description: "Track all your gold investments in one place with live P&L, charts, and more. Let\u2019s take a quick 30-second tour.",
    icon: "👋",
    position: "center",
  },
  {
    targetId: "tour-add-btn",
    title: "Record Your Gold Purchases",
    description: "Tap \u201c+ Add Transaction\u201d to log a gold buy or sell. Enter weight, price per gram, purity (22K/24K), item type, and any charges.",
    icon: "➕",
    position: "top",
  },
  {
    targetId: "tour-quick-add",
    title: "Quick-Add Shortcuts",
    description: "Use these one-tap buttons to pre-fill common purchases at today\u2019s live rate. Just enter the weight and you\u2019re done!",
    icon: "⚡",
    position: "top",
  },
  {
    targetId: "tour-signin",
    title: "Sync Across All Devices",
    description: "Sign in with Google (free, 2 seconds) to save your portfolio to the cloud. Access it from any phone, tablet, or laptop.",
    icon: "☁️",
    position: "bottom",
  },
  {
    targetId: "tour-goal",
    title: "Set a Gold Goal",
    description: "Want to accumulate 50g? 100g? Set a target and watch the progress bar fill up as you add purchases.",
    icon: "🎯",
    position: "top",
  },
  {
    targetId: null,
    title: "Your Dashboard Awaits!",
    description: "Once you add your first purchase, your dashboard appears with live P&L, XIRR returns, allocation charts, and portfolio value over time.",
    icon: "📊",
    position: "center",
  },
  {
    targetId: null,
    title: "You\u2019re All Set!",
    description: "Start by adding your first gold purchase. Your data stays private \u2014 stored in your browser until you choose to sign in.",
    icon: "🚀",
    position: "center",
  },
];

function TutorialOverlay({
  step,
  totalSteps,
  currentStep,
  onNext,
  onPrev,
  onSkip,
}: {
  step: TutorialStep;
  totalSteps: number;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!step.targetId) {
      setSpotlightRect(null);
      return;
    }
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const updateRect = () => setSpotlightRect(el.getBoundingClientRect());
      setTimeout(updateRect, 350);
      window.addEventListener("resize", updateRect);
      return () => window.removeEventListener("resize", updateRect);
    } else {
      setSpotlightRect(null);
    }
  }, [step.targetId]);

  const isCenter = !spotlightRect || step.position === "center";
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onSkip}>
      {/* Dark overlay with spotlight cutout */}
      {spotlightRect ? (
        <div
          className="fixed rounded-2xl z-[9998] transition-all duration-300 pointer-events-none"
          style={{
            top: spotlightRect.top - 8,
            left: spotlightRect.left - 8,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 16,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.6)",
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-slate-900/60 z-[9998]" />
      )}

      {/* Tooltip card */}
      <div
        className="fixed z-[9999] w-[calc(100vw-2rem)] max-w-sm"
        style={
          isCenter
            ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
            : step.position === "bottom"
            ? {
                top: (spotlightRect?.bottom ?? 0) + 16,
                left: Math.max(
                  16,
                  Math.min(
                    (spotlightRect?.left ?? 0) + (spotlightRect?.width ?? 0) / 2 - 176,
                    window.innerWidth - 368
                  )
                ),
              }
            : {
                top: Math.max(16, (spotlightRect?.top ?? 0) - 16),
                left: Math.max(
                  16,
                  Math.min(
                    (spotlightRect?.left ?? 0) + (spotlightRect?.width ?? 0) / 2 - 176,
                    window.innerWidth - 368
                  )
                ),
                transform: "translateY(-100%)",
              }
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStep
                      ? "w-6 bg-amber-500"
                      : i < currentStep
                      ? "w-1.5 bg-amber-300"
                      : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onSkip}
              className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip tour
            </button>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-3xl mb-2">{step.icon}</p>
            <h3 className="text-base font-bold text-charcoal">{step.title}</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            {isFirst ? (
              <span />
            ) : (
              <button
                onClick={onPrev}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={onNext}
              className="rounded-full bg-amber-600 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              {isLast ? "Get Started!" : "Next →"}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-3">
            {currentStep + 1} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- main ----------

interface Props {
  gold22k: number;
  gold24k: number;
}

export default function PortfolioClient({ gold22k, gold24k }: Props) {
  // Load from localStorage synchronously on first client render so data
  // persists across browser close/reopen without waiting for async effects
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>(
    () => (typeof window !== "undefined" ? getLocalTransactions() : [])
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioTransaction | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form fields
  const [formType, setFormType] = useState<TransactionType>("buy");
  const [formDate, setFormDate] = useState(today());
  const [formGrams, setFormGrams] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formWastageCharges, setFormWastageCharges] = useState("0");
  const [formMakingCharges, setFormMakingCharges] = useState("0");
  const [formPurity, setFormPurity] = useState<"22K" | "24K">("22K");
  const [formItemType, setFormItemType] = useState<GoldItemType>("coin");
  const [formCustomItemName, setFormCustomItemName] = useState("");
  const [formNote, setFormNote] = useState("");

  // Goal tracker (persisted in localStorage)
  const [goldGoal, setGoldGoal] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseFloat(localStorage.getItem("portfolio-gold-goal") || "0");
  });
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  // Tutorial / onboarding
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const tutorialTriggered = useRef(false);

  // Transaction filters
  const [filterSearch, setFilterSearch] = useState("");
  const [filterPurity, setFilterPurity] = useState<"all" | "22K" | "24K">("all");
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all");
  const [filterItemType, setFilterItemType] = useState<"all" | GoldItemType>("all");

  // Sort control
  const [sortKey, setSortKey] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "weight-desc">("date-desc");

  // Date range filter
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Monthly/yearly P&L breakdown
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [monthlyViewMode, setMonthlyViewMode] = useState<"monthly" | "yearly">("monthly");

  const fbReady = isFirebaseConfigured();
  const missingFirebaseKeys = getFirebaseMissingConfigKeys();

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.uid, user?.photoURL]);

  useEffect(() => {
    if (!deleteTarget) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleteLoading) {
        setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteTarget, deleteLoading]);

  // ---- auth listener ----
  useEffect(() => {
    if (!fbReady) { setAuthLoading(false); return; }
    const unsub = onAuthChange((u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, [fbReady]);

  // ---- load / sync transactions from cloud when signed in ----
  const loadCloudTransactions = useCallback(async () => {
    if (!user) return;
    setSyncStatus("syncing");
    setSyncErrorMessage(null);
    try {
      const localTxs = getLocalTransactions();
      let cloudTxs: PortfolioTransaction[];
      if (localTxs.length > 0) {
        cloudTxs = await migrateLocalToCloud(user.uid, localTxs);
        clearLocalTransactions();
      } else {
        cloudTxs = await getCloudTransactions(user.uid);
      }
      setTransactions(cloudTxs);
      setSyncStatus("synced");
    } catch (err) {
      console.error("Cloud load error:", err);
      setSyncStatus("error");
      setSyncErrorMessage(getSyncErrorMessage(err));
      // Fall back to whatever we already have (initialised from localStorage)
    }
  }, [user]);

  // When auth resolves: if signed in, fetch from cloud; otherwise local data
  // is already loaded via the lazy useState initialiser.
  useEffect(() => {
    if (!authLoading && user) {
      loadCloudTransactions();
    }
  }, [authLoading, user, loadCloudTransactions]);

  // ---- derived metrics ----
  const holdings22k = useMemo(() => computeHoldings(transactions.filter((t) => t.purity === "22K"), gold22k), [transactions, gold22k]);
  const holdings24k = useMemo(() => computeHoldings(transactions.filter((t) => t.purity === "24K"), gold24k), [transactions, gold24k]);

  const totalCurrentValue = holdings22k.currentValue + holdings24k.currentValue;
  const totalInvested = holdings22k.totalInvested + holdings24k.totalInvested;
  const totalUnrealizedPL = holdings22k.unrealizedPL + holdings24k.unrealizedPL;
  const totalPLPercent = totalInvested > 0 ? (totalUnrealizedPL / totalInvested) * 100 : 0;
  const totalNetGrams = holdings22k.netGrams + holdings24k.netGrams;

  const displayXIRR = !isNaN(holdings22k.xirr) && !isNaN(holdings24k.xirr)
    ? totalInvested > 0 ? (holdings22k.xirr * holdings22k.totalInvested + holdings24k.xirr * holdings24k.totalInvested) / totalInvested : 0
    : !isNaN(holdings22k.xirr) ? holdings22k.xirr
    : !isNaN(holdings24k.xirr) ? holdings24k.xirr : NaN;

  // Item-type allocation for donut chart
  const itemAllocation = useMemo(() => {
    const map = new Map<string, { grams: number; type: GoldItemType }>();
    for (const tx of transactions) {
      const key = tx.itemType === "other" && tx.customItemName ? tx.customItemName : (tx.itemType || "other");
      const existing = map.get(key) || { grams: 0, type: tx.itemType || "other" };
      existing.grams += tx.type === "buy" ? tx.grams : -tx.grams;
      map.set(key, existing);
    }
    const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16", "#64748b", "#0ea5e9"];
    let ci = 0;
    const segments: { label: string; value: number; color: string }[] = [];
    for (const [key, info] of map) {
      if (info.grams > 0) {
        const label = info.type === "other" ? key : getItemLabelByType(info.type);
        segments.push({ label, value: info.grams, color: colors[ci % colors.length] });
        ci++;
      }
    }
    return segments;
  }, [transactions]);

  // Portfolio value over time for line chart
  const lineChartData = useMemo(() => {
    if (transactions.length === 0) return [];

    // Sort chronologically
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const points: { date: string; invested: number; value: number }[] = [];
    let cumInvested = 0;
    let grams22k = 0;
    let grams24k = 0;

    for (const tx of sorted) {
      if (tx.type === "buy") {
        cumInvested += tx.grams * tx.pricePerGram + tx.charges;
        if (tx.purity === "22K") grams22k += tx.grams;
        else grams24k += tx.grams;
      } else {
        if (tx.purity === "22K") grams22k = Math.max(0, grams22k - tx.grams);
        else grams24k = Math.max(0, grams24k - tx.grams);
      }

      // Value at that point uses the buy price as an approximation for historical value
      // For the chart we use tx's price as the market rate at that date
      const valueAtPoint = grams22k * tx.pricePerGram + grams24k * tx.pricePerGram;
      points.push({ date: tx.date, invested: Math.round(cumInvested), value: Math.round(valueAtPoint) });
    }

    // Add today's point with live rates
    const todayValue = Math.round(grams22k * gold22k + grams24k * gold24k);
    points.push({ date: today(), invested: Math.round(cumInvested), value: todayValue });

    return points;
  }, [transactions, gold22k, gold24k]);

  // ---- CRUD ----
  const resetForm = () => {
    setFormType("buy");
    setFormDate(today());
    setFormGrams("");
    setFormPrice("");
    setFormWastageCharges("0");
    setFormMakingCharges("0");
    setFormPurity("22K");
    setFormItemType("coin");
    setFormCustomItemName("");
    setFormNote("");
    setEditingId(null);
  };

  const formTotalCharges = (parseFloat(formWastageCharges) || 0) + (parseFloat(formMakingCharges) || 0);

  const handleSave = async () => {
    const grams = parseFloat(formGrams);
    const price = parseFloat(formPrice);
    if (!grams || grams <= 0 || !price || price <= 0) return;

    const wastage = parseFloat(formWastageCharges) || 0;
    const making = parseFloat(formMakingCharges) || 0;
    const charges = formType === "buy" ? wastage + making : 0;
    const now = new Date().toISOString();

    const baseTx = {
      type: formType,
      date: formDate,
      grams,
      pricePerGram: price,
      charges,
      wastageCharges: formType === "buy" ? wastage : 0,
      makingCharges: formType === "buy" ? making : 0,
      purity: formPurity,
      itemType: formItemType,
      customItemName: formItemType === "other" ? formCustomItemName.trim().slice(0, 30) : undefined,
      note: formNote,
      updatedAt: now,
    };

    if (editingId) {
      const updated: PortfolioTransaction = {
        ...(transactions.find((t) => t.id === editingId)!),
        ...baseTx,
      };
      const newTxs = transactions.map((t) => t.id === editingId ? updated : t);
      setTransactions(newTxs);
      if (user) {
        setSyncStatus("syncing");
        setSyncErrorMessage(null);
        try {
          await upsertCloudTransaction(user.uid, updated);
          setSyncStatus("synced");
        }
        catch (err) {
          setSyncStatus("error");
          setSyncErrorMessage(getSyncErrorMessage(err));
        }
      } else { setLocalTransactions(newTxs); }
    } else {
      const tx: PortfolioTransaction = { id: genId(), ...baseTx, createdAt: now };
      const newTxs = [...transactions, tx];
      setTransactions(newTxs);
      if (user) {
        setSyncStatus("syncing");
        setSyncErrorMessage(null);
        try {
          await upsertCloudTransaction(user.uid, tx);
          setSyncStatus("synced");
        }
        catch (err) {
          setSyncStatus("error");
          setSyncErrorMessage(getSyncErrorMessage(err));
        }
      } else { setLocalTransactions(newTxs); }
    }
    resetForm();
    setShowForm(false);
  };

  const openDeleteModal = (tx: PortfolioTransaction) => {
    setDeleteTarget(tx);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteLoading(true);
    const newTxs = transactions.filter((t) => t.id !== id);
    setTransactions(newTxs);
    if (user) {
      setSyncStatus("syncing");
      setSyncErrorMessage(null);
      try {
        await deleteCloudTransaction(user.uid, id);
        setSyncStatus("synced");
      }
      catch (err) {
        setSyncStatus("error");
        setSyncErrorMessage(getSyncErrorMessage(err));
      }
    } else { setLocalTransactions(newTxs); }
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const startEdit = (tx: PortfolioTransaction) => {
    setEditingId(tx.id);
    setFormType(tx.type);
    setFormDate(tx.date);
    setFormGrams(String(tx.grams));
    setFormPrice(String(tx.pricePerGram));
    setFormWastageCharges(String(tx.wastageCharges ?? 0));
    setFormMakingCharges(String(tx.makingCharges ?? tx.charges ?? 0));
    setFormPurity(tx.purity);
    setFormItemType(tx.itemType || "other");
    setFormCustomItemName(tx.customItemName || "");
    setFormNote(tx.note);
    setShowForm(true);
  };

  // ---- auth ----
  const handleSignIn = async () => { try { await signInWithGoogle(); } catch (err) { console.error("Sign-in error:", err); } };
  const handleSignOut = async () => {
    try {
      await signOut();
      const localTxs = getLocalTransactions();
      setTransactions(localTxs);
      setSyncStatus("local");
      setSyncErrorMessage(null);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  const sortedTxs = useMemo(() => {
    const txs = [...transactions];
    switch (sortKey) {
      case "date-asc": return txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "amount-desc": return txs.sort((a, b) => (b.grams * b.pricePerGram + b.charges) - (a.grams * a.pricePerGram + a.charges));
      case "amount-asc": return txs.sort((a, b) => (a.grams * a.pricePerGram + a.charges) - (b.grams * b.pricePerGram + b.charges));
      case "weight-desc": return txs.sort((a, b) => b.grams - a.grams);
      default: return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }, [transactions, sortKey]);

  // Purity allocation for donut (by current value)
  const purityAllocation = useMemo(() => {
    const segments: { label: string; value: number; color: string }[] = [];
    if (holdings22k.currentValue > 0) segments.push({ label: "22K Gold", value: holdings22k.currentValue, color: "#f59e0b" });
    if (holdings24k.currentValue > 0) segments.push({ label: "24K Gold", value: holdings24k.currentValue, color: "#3b82f6" });
    return segments;
  }, [holdings22k.currentValue, holdings24k.currentValue]);

  // Realized P&L totals
  const totalRealizedPL = holdings22k.realizedPL + holdings24k.realizedPL;
  const totalSellProceeds = holdings22k.totalSellProceeds + holdings24k.totalSellProceeds;
  const hasSells = holdings22k.totalSold > 0 || holdings24k.totalSold > 0;
  const totalSoldGrams = holdings22k.totalSold + holdings24k.totalSold;

  // Filtered transactions
  const filteredTxs = useMemo(() => {
    let txs = sortedTxs;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      txs = txs.filter(tx =>
        tx.note.toLowerCase().includes(q) ||
        getItemLabel(tx).toLowerCase().includes(q) ||
        tx.date.includes(q)
      );
    }
    if (filterPurity !== "all") txs = txs.filter(tx => tx.purity === filterPurity);
    if (filterType !== "all") txs = txs.filter(tx => tx.type === filterType);
    if (filterItemType !== "all") txs = txs.filter(tx => tx.itemType === filterItemType);
    if (filterDateFrom) txs = txs.filter(tx => tx.date >= filterDateFrom);
    if (filterDateTo) txs = txs.filter(tx => tx.date <= filterDateTo);
    return txs;
  }, [sortedTxs, filterSearch, filterPurity, filterType, filterItemType, filterDateFrom, filterDateTo]);

  const hasActiveFilters = filterSearch || filterPurity !== "all" || filterType !== "all" || filterItemType !== "all" || filterDateFrom || filterDateTo;

  // Quick-add: pre-fill form with common scenarios
  const quickAdd = (purity: "22K" | "24K", itemType: GoldItemType) => {
    resetForm();
    setFormType("buy");
    setFormPurity(purity);
    setFormItemType(itemType);
    setFormPrice(String(purity === "22K" ? gold22k : gold24k));
    setShowForm(true);
  };

  // Goal tracker helpers
  const saveGoal = () => {
    const g = parseFloat(goalInput);
    if (g > 0) {
      setGoldGoal(g);
      localStorage.setItem("portfolio-gold-goal", String(g));
      setShowGoalInput(false);
    }
  };
  const clearGoal = () => {
    setGoldGoal(0);
    localStorage.removeItem("portfolio-gold-goal");
    setShowGoalInput(false);
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Purity", "Item", "Weight(g)", "Price/g", "Charges", "Total", "Note"];
    const rows = filteredTxs.map(tx => [
      tx.date,
      tx.type,
      tx.purity,
      getItemLabel(tx),
      tx.grams.toFixed(3),
      tx.pricePerGram.toFixed(0),
      tx.charges.toFixed(0),
      (tx.grams * tx.pricePerGram + (tx.type === "buy" ? tx.charges : 0)).toFixed(0),
      tx.note || "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gold-portfolio-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const monthlyBreakdown = useMemo(() => {
    if (transactions.length === 0) return [];
    const map = new Map<string, { buysGrams: number; buysAmount: number; sellsGrams: number; sellsAmount: number }>();
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const tx of sorted) {
      const key = monthlyViewMode === "monthly" ? tx.date.slice(0, 7) : tx.date.slice(0, 4);
      const entry = map.get(key) || { buysGrams: 0, buysAmount: 0, sellsGrams: 0, sellsAmount: 0 };
      const amount = tx.grams * tx.pricePerGram + (tx.type === "buy" ? tx.charges : 0);
      if (tx.type === "buy") { entry.buysGrams += tx.grams; entry.buysAmount += amount; }
      else { entry.sellsGrams += tx.grams; entry.sellsAmount += amount; }
      map.set(key, entry);
    }
    let cumGrams = 0;
    return Array.from(map.entries()).map(([period, d]) => {
      cumGrams += d.buysGrams - d.sellsGrams;
      return { period, ...d, netGrams: d.buysGrams - d.sellsGrams, cumGrams };
    });
  }, [transactions, monthlyViewMode]);

  // Auto-show tutorial for first-time visitors
  useEffect(() => {
    if (tutorialTriggered.current) return;
    if (authLoading) return;
    const seen = localStorage.getItem("portfolio-tour-seen");
    if (!seen && transactions.length === 0) {
      tutorialTriggered.current = true;
      const timer = setTimeout(() => {
        setTutorialStep(0);
        setShowTutorial(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [authLoading, transactions.length]);

  const startTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const endTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("portfolio-tour-seen", "1");
  };

  const completeTutorial = () => {
    endTutorial();
    setShowForm(true);
  };

  // ================================================
  // RENDER
  // ================================================
  return (
    <div className="space-y-6">
      {/* Print-only header */}
      <div className="hidden print:block mb-4">
        <h1 className="text-xl font-bold text-charcoal">GoldMeter Portfolio Report</h1>
        <p className="text-xs text-slate-500">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          {user ? ` — ${user.displayName || user.email}` : ""}
        </p>
        {transactions.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
            <div><span className="text-slate-500">Invested:</span> <strong>₹{fmt(totalInvested)}</strong></div>
            <div><span className="text-slate-500">Current Value:</span> <strong>₹{fmt(totalCurrentValue)}</strong></div>
            <div><span className="text-slate-500">P&L:</span> <strong className={totalUnrealizedPL >= 0 ? "text-emerald-600" : "text-red-600"}>{totalUnrealizedPL >= 0 ? "+" : ""}₹{fmt(Math.abs(totalUnrealizedPL))} ({totalPLPercent.toFixed(2)}%)</strong></div>
            <div><span className="text-slate-500">Holding:</span> <strong>{fmtG(totalNetGrams)}g</strong></div>
          </div>
        )}
      </div>

      {/* ---- Sign-in / User Card ---- */}
      {!user ? (
        <div id="tour-signin" className="rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-base font-semibold text-charcoal">Sync your portfolio across devices</p>
              <p className="text-sm text-slate-600 mt-1">Sign in with Google to save your gold portfolio to the cloud.</p>
              <div className="flex items-center gap-2 mt-2">
                <SyncBadge status={syncStatus} />
                {syncStatus === "error" && syncErrorMessage && (
                  <span className="text-xs text-red-600">{syncErrorMessage}</span>
                )}
                {transactions.length > 0 && (
                  <span className="text-xs text-slate-400">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""} stored locally</span>
                )}
              </div>
            </div>
            {fbReady ? (
              <button onClick={handleSignIn}
                className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow transition-all shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic text-right">
                Cloud sync not configured
                {missingFirebaseKeys.length > 0 && (
                  <>
                    <br />
                    Missing: {missingFirebaseKeys.join(", ")}
                    <br />
                    Restart dev server after updating `.env.local`
                  </>
                )}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarLoadFailed(true)}
                  className={`w-9 h-9 rounded-full border border-slate-200 ${avatarLoadFailed ? "hidden" : ""}`}
                />
              )}
              {(!user.photoURL || avatarLoadFailed) && (
                <span className="w-9 h-9 rounded-full border border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold inline-flex items-center justify-center">
                  {(user.displayName || user.email || "U").trim().charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal truncate">{user.displayName || user.email}</p>
                <SyncBadge status={syncStatus} />
                {syncStatus === "error" && syncErrorMessage && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-red-600 max-w-lg">{syncErrorMessage}</p>
                    <button onClick={loadCloudTransactions}
                      className="text-[11px] font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2 shrink-0">
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleSignOut} className="text-xs text-slate-500 hover:text-red-600 transition-colors shrink-0">Sign out</button>
          </div>
        </div>
      )}

      {/* ============== PORTFOLIO SUMMARY ============== */}
      {transactions.length > 0 && (
        <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-charcoal">Portfolio Summary</h2>
            <div className="flex items-center gap-2">
              {!isNaN(displayXIRR) && (
                <div className={`rounded-full px-3 py-1 text-xs font-bold ${displayXIRR >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  XIRR: {displayXIRR >= 0 ? "+" : ""}{displayXIRR.toFixed(1)}% p.a.
                </div>
              )}
              <div className="relative print:hidden">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:text-amber-600 hover:border-amber-300 transition-colors"
                  title="Export Portfolio"
                >
                  📤 Export ▾
                </button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg z-20">
                      <button onClick={handleExportCSV}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-amber-50 hover:text-amber-700 rounded-t-xl transition-colors">
                        📊 Download CSV
                      </button>
                      <button onClick={() => { setShowExportMenu(false); window.print(); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-amber-50 hover:text-amber-700 rounded-b-xl transition-colors border-t border-slate-100">
                        🖨️ Print / PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Hero metrics */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">💰</span>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Invested</p>
              </div>
              <p className="text-xl font-bold text-charcoal">₹{fmt(totalInvested)}</p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">📈</span>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Current Value</p>
              </div>
              <p className="text-xl font-bold text-charcoal">₹{fmt(totalCurrentValue)}</p>
            </div>
            <div className={`rounded-2xl p-4 border shadow-sm ${totalUnrealizedPL >= 0 ? "bg-emerald-50/80 border-emerald-200" : "bg-red-50/80 border-red-200"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{totalUnrealizedPL >= 0 ? "🚀" : "📉"}</span>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Unrealized P&L</p>
              </div>
              <p className={`text-xl font-bold ${totalUnrealizedPL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {totalUnrealizedPL >= 0 ? "+" : ""}₹{fmt(Math.abs(totalUnrealizedPL))}
              </p>
              <p className={`text-xs font-semibold ${totalPLPercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {totalPLPercent >= 0 ? "+" : ""}{totalPLPercent.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">⚖️</span>
                <p className="text-[11px] text-amber-100 uppercase tracking-wide">Net Holding</p>
              </div>
              <p className="text-xl font-bold">{fmtG(totalNetGrams)}g</p>
              <p className="text-[11px] text-amber-100 mt-0.5">22K: {fmtG(holdings22k.netGrams)}g &middot; 24K: {fmtG(holdings24k.netGrams)}g</p>
            </div>
          </div>

          {/* Realized P&L + Charges row */}
          {(hasSells || holdings22k.totalCharges + holdings24k.totalCharges > 0) && (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 mt-3">
              {hasSells && (
                <div className={`rounded-2xl bg-white/80 backdrop-blur p-4 border shadow-sm ${totalRealizedPL >= 0 ? "border-emerald-100" : "border-red-100"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">💵</span>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Realized P&L</p>
                  </div>
                  <p className={`text-lg font-bold ${totalRealizedPL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {totalRealizedPL >= 0 ? "+" : ""}₹{fmt(Math.abs(totalRealizedPL))}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sold {fmtG(totalSoldGrams)}g &middot; Proceeds ₹{fmt(totalSellProceeds)}
                  </p>
                </div>
              )}
              {(holdings22k.totalCharges + holdings24k.totalCharges) > 0 && (
                <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🏷️</span>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Total Charges</p>
                  </div>
                  <p className="text-lg font-bold text-charcoal">₹{fmt(holdings22k.totalCharges + holdings24k.totalCharges)}</p>
                  <p className="text-[11px] text-slate-400">Wastage + making charges</p>
                </div>
              )}
              {hasSells && (
                <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">📊</span>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Total P&L</p>
                  </div>
                  <p className={`text-lg font-bold ${(totalRealizedPL + totalUnrealizedPL) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {(totalRealizedPL + totalUnrealizedPL) >= 0 ? "+" : ""}₹{fmt(Math.abs(totalRealizedPL + totalUnrealizedPL))}
                  </p>
                  <p className="text-[11px] text-slate-400">Realized + Unrealized</p>
                </div>
              )}
            </div>
          )}

          {/* Charts */}
          <div className="mt-5 grid gap-4 md:grid-cols-2 print:hidden">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Invested vs Current Value</p>
              <ValueBar invested={totalInvested} current={totalCurrentValue} />
            </div>
            {itemAllocation.length > 0 && (
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Allocation by Item Type</p>
                <DonutChart segments={itemAllocation} />
              </div>
            )}
          </div>

          {/* Purity split donut */}
          {purityAllocation.length > 1 && (
            <div className="mt-4 rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4 print:hidden">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Value by Purity</p>
              <DonutChart segments={purityAllocation} mode="currency" />
            </div>
          )}

          {/* Portfolio Value Over Time Line Chart */}
          {lineChartData.length >= 2 && (
            <div className="mt-5 rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4 print:hidden">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Portfolio Value Over Time</p>
              <PortfolioLineChart dataPoints={lineChartData} />
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Historical values are approximated using your transaction prices. The last data point uses today&apos;s live rate.
              </p>
            </div>
          )}

          {/* Purity Breakdown */}
          {(holdings22k.netGrams > 0 || holdings24k.netGrams > 0) && (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {holdings22k.totalBought > 0 && (
                <div className="rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-charcoal">22K Gold</p>
                    {!isNaN(holdings22k.xirr) && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${holdings22k.xirr >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        XIRR {holdings22k.xirr >= 0 ? "+" : ""}{holdings22k.xirr.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Avg buy price</span>
                    <span className="text-right font-semibold text-charcoal">₹{fmt(holdings22k.avgBuyPrice)}/g</span>
                    <span className="text-slate-500">Net grams</span>
                    <span className="text-right font-semibold text-charcoal">{fmtG(holdings22k.netGrams)}g</span>
                    <span className="text-slate-500">Current value</span>
                    <span className="text-right font-semibold text-charcoal">₹{fmt(holdings22k.currentValue)}</span>
                    <span className="text-slate-500">P&L</span>
                    <span className={`text-right font-bold ${holdings22k.unrealizedPL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {holdings22k.unrealizedPL >= 0 ? "+" : ""}₹{fmt(Math.abs(holdings22k.unrealizedPL))}
                      <span className="text-[10px] ml-0.5">({holdings22k.unrealizedPLPercent.toFixed(1)}%)</span>
                    </span>
                  </div>
                </div>
              )}
              {holdings24k.totalBought > 0 && (
                <div className="rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-charcoal">24K Gold</p>
                    {!isNaN(holdings24k.xirr) && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${holdings24k.xirr >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        XIRR {holdings24k.xirr >= 0 ? "+" : ""}{holdings24k.xirr.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Avg buy price</span>
                    <span className="text-right font-semibold text-charcoal">₹{fmt(holdings24k.avgBuyPrice)}/g</span>
                    <span className="text-slate-500">Net grams</span>
                    <span className="text-right font-semibold text-charcoal">{fmtG(holdings24k.netGrams)}g</span>
                    <span className="text-slate-500">Current value</span>
                    <span className="text-right font-semibold text-charcoal">₹{fmt(holdings24k.currentValue)}</span>
                    <span className="text-slate-500">P&L</span>
                    <span className={`text-right font-bold ${holdings24k.unrealizedPL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {holdings24k.unrealizedPL >= 0 ? "+" : ""}₹{fmt(Math.abs(holdings24k.unrealizedPL))}
                      <span className="text-[10px] ml-0.5">({holdings24k.unrealizedPLPercent.toFixed(1)}%)</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============== MONTHLY/YEARLY P&L BREAKDOWN ============== */}
      {transactions.length > 0 && monthlyBreakdown.length >= 2 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
              className="flex items-center gap-2 text-sm font-bold text-charcoal hover:text-amber-600 transition-colors">
              <span className={`text-xs transition-transform ${showMonthlyBreakdown ? "rotate-90" : ""}`}>▶</span>
              Performance by {monthlyViewMode === "monthly" ? "Month" : "Year"}
            </button>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
              <button onClick={() => setMonthlyViewMode("monthly")}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${monthlyViewMode === "monthly" ? "bg-white text-charcoal shadow-sm" : "text-slate-500"}`}>
                Monthly
              </button>
              <button onClick={() => setMonthlyViewMode("yearly")}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${monthlyViewMode === "yearly" ? "bg-white text-charcoal shadow-sm" : "text-slate-500"}`}>
                Yearly
              </button>
            </div>
          </div>
          {showMonthlyBreakdown && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left py-2 pr-3 font-medium">Period</th>
                    <th className="text-right py-2 px-2 font-medium">Bought</th>
                    <th className="text-right py-2 px-2 font-medium">Sold</th>
                    <th className="text-right py-2 px-2 font-medium">Net</th>
                    <th className="text-right py-2 pl-2 font-medium">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyBreakdown.map((row, i) => (
                    <tr key={row.period} className={i % 2 === 0 ? "bg-slate-50/50" : ""}>
                      <td className="py-2 pr-3 font-medium text-charcoal">
                        {monthlyViewMode === "monthly"
                          ? new Date(row.period + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                          : row.period}
                      </td>
                      <td className="text-right py-2 px-2 text-emerald-600">
                        {row.buysGrams > 0 ? `${fmtG(row.buysGrams)}g` : "—"}
                        {row.buysAmount > 0 && <span className="text-slate-400 ml-1">(₹{fmt(row.buysAmount)})</span>}
                      </td>
                      <td className="text-right py-2 px-2 text-red-500">
                        {row.sellsGrams > 0 ? `${fmtG(row.sellsGrams)}g` : "—"}
                        {row.sellsAmount > 0 && <span className="text-slate-400 ml-1">(₹{fmt(row.sellsAmount)})</span>}
                      </td>
                      <td className={`text-right py-2 px-2 font-semibold ${row.netGrams >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {row.netGrams >= 0 ? "+" : ""}{fmtG(row.netGrams)}g
                      </td>
                      <td className="text-right py-2 pl-2 font-semibold text-charcoal">
                        {fmtG(row.cumGrams)}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============== GOAL TRACKER ============== */}
      <div id="tour-goal" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-charcoal flex items-center gap-2">
            🎯 Gold Goal
          </h2>
          {goldGoal > 0 && !showGoalInput && (
            <div className="flex gap-2">
              <button onClick={() => { setGoalInput(String(goldGoal)); setShowGoalInput(true); }}
                className="text-[11px] text-slate-400 hover:text-amber-600 transition-colors">Edit</button>
              <button onClick={clearGoal}
                className="text-[11px] text-slate-400 hover:text-red-500 transition-colors">Remove</button>
            </div>
          )}
        </div>
        {goldGoal > 0 && !showGoalInput ? (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">
                {fmtG(totalNetGrams)}g of {fmtG(goldGoal)}g
              </span>
              <span className="font-semibold text-charcoal">
                {goldGoal > 0 ? Math.min(100, (totalNetGrams / goldGoal) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  totalNetGrams >= goldGoal
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-500"
                }`}
                style={{ width: `${Math.min(100, (totalNetGrams / goldGoal) * 100)}%` }}
              />
            </div>
            {totalNetGrams >= goldGoal ? (
              <p className="text-xs text-emerald-600 font-semibold mt-2">Goal reached! You&apos;ve accumulated {fmtG(totalNetGrams)}g of gold.</p>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                {fmtG(goldGoal - totalNetGrams)}g more to go &middot; Worth ~₹{fmt((goldGoal - totalNetGrams) * gold22k)} at today&apos;s 22K rate
              </p>
            )}
          </div>
        ) : (
          <div>
            {!showGoalInput ? (
              <div className="text-center py-2">
                <p className="text-xs text-slate-500 mb-3">Set a gold accumulation target to track your progress.</p>
                <button onClick={() => { setGoalInput(""); setShowGoalInput(true); }}
                  className="rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                  + Set Goal
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-3">
                <label className="flex-1 text-xs font-medium text-slate-600">
                  Target weight (grams)
                  <input type="number" step="0.1" min="0.1" placeholder="e.g. 50"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                  />
                </label>
                <button onClick={saveGoal} disabled={!parseFloat(goalInput) || parseFloat(goalInput) <= 0}
                  className="rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-40">
                  Save
                </button>
                <button onClick={() => setShowGoalInput(false)}
                  className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============== ADD TRANSACTION ============== */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-charcoal">
          Transactions
          {transactions.length > 0 && <span className="ml-2 text-xs text-slate-400 font-normal">({transactions.length})</span>}
        </h2>
        <button id="tour-add-btn" onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors print:hidden">
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {/* Quick-add shortcuts (when form is NOT open and has transactions) */}
      {!showForm && transactions.length > 0 && (
        <div id="tour-quick-add" className="flex flex-wrap gap-2 print:hidden">
          <span className="text-[11px] text-slate-400 self-center mr-1">Quick add:</span>
          <button onClick={() => quickAdd("22K", "coin")}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors">
            🪙 22K Coin
          </button>
          <button onClick={() => quickAdd("24K", "bar")}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
            🧱 24K Bar
          </button>
          <button onClick={() => quickAdd("22K", "necklace")}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors">
            📿 22K Necklace
          </button>
          <button onClick={() => quickAdd("22K", "ring")}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700 transition-colors">
            💍 22K Ring
          </button>
          <button onClick={() => quickAdd("24K", "digital")}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">
            📱 24K Digital
          </button>
        </div>
      )}

      {/* ---- Transaction Form ---- */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-charcoal mb-4">
            {editingId ? "Edit Transaction" : "New Transaction"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Buy / Sell Toggle */}
            <div className="sm:col-span-2">
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(["buy", "sell"] as TransactionType[]).map((t) => (
                  <button key={t} onClick={() => setFormType(t)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      formType === t
                        ? t === "buy" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
                        : "text-slate-600 hover:text-charcoal"
                    }`}>
                    {t === "buy" ? "Buy" : "Sell / Gift"}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <label className="text-sm font-medium text-slate-600">
              Date
              <input type="date" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                value={formDate} onChange={(e) => setFormDate(e.target.value)} max={today()} />
            </label>

            {/* Purity */}
            <label className="text-sm font-medium text-slate-600">
              Purity
              <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                value={formPurity} onChange={(e) => setFormPurity(e.target.value as "22K" | "24K")}>
                <option value="22K">22K</option>
                <option value="24K">24K</option>
              </select>
            </label>

            {/* Item Type */}
            <label className="text-sm font-medium text-slate-600">
              Item Type
              <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                value={formItemType} onChange={(e) => setFormItemType(e.target.value as GoldItemType)}>
                {GOLD_ITEM_TYPES.map((it) => (
                  <option key={it.value} value={it.value}>{it.icon} {it.label}</option>
                ))}
              </select>
            </label>

            {/* Custom item name when "other" is selected */}
            {formItemType === "other" && (
              <label className="text-sm font-medium text-slate-600">
                Custom Item Name
                <input type="text" maxLength={30}
                  placeholder="e.g. Thali, Anklet"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={formCustomItemName} onChange={(e) => setFormCustomItemName(e.target.value)} />
                <span className="text-[10px] text-slate-400 mt-0.5 block">{formCustomItemName.length}/30</span>
              </label>
            )}

            {/* Grams */}
            <label className="text-sm font-medium text-slate-600">
              Weight (grams)
              <input type="number" step="0.001" min="0.001" placeholder="e.g. 10"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                value={formGrams} onChange={(e) => setFormGrams(e.target.value)} />
            </label>

            {/* Price per gram */}
            <label className="text-sm font-medium text-slate-600">
              Price per gram (₹)
              <input type="number" step="1" min="1"
                placeholder={`e.g. ${fmt(formPurity === "22K" ? gold22k : gold24k)}`}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              <span className="text-[11px] text-amber-600 mt-0.5 block">
                Today&apos;s rate: ₹{fmt(formPurity === "22K" ? gold22k : gold24k)}/g ({formPurity})
              </span>
            </label>

            {/* Wastage & Making Charges - Buy only */}
            {formType === "buy" && (
              <>
                <label className="text-sm font-medium text-slate-600">
                  Wastage Charges (₹)
                  <input type="number" step="1" min="0" placeholder="0"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    value={formWastageCharges} onChange={(e) => setFormWastageCharges(e.target.value)} />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Weight loss during making</span>
                </label>
                <label className="text-sm font-medium text-slate-600">
                  Making Charges (₹)
                  <input type="number" step="1" min="0" placeholder="0"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    value={formMakingCharges} onChange={(e) => setFormMakingCharges(e.target.value)} />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Labour / craftsmanship cost</span>
                </label>
              </>
            )}

            {/* Note */}
            <label className={`text-sm font-medium text-slate-600 ${formType === "buy" ? "sm:col-span-2" : ""}`}>
              Note (optional)
              <input type="text" maxLength={100}
                placeholder={formType === "buy" ? "e.g. Tanishq, Anniversary" : "e.g. Gifted to daughter, Wedding"}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                value={formNote} onChange={(e) => setFormNote(e.target.value)} />
            </label>
          </div>

          {/* Summary preview */}
          {parseFloat(formGrams) > 0 && parseFloat(formPrice) > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600">
              Total: <strong>₹{fmt(parseFloat(formGrams) * parseFloat(formPrice) + (formType === "buy" ? formTotalCharges : 0))}</strong>
              <span className="text-slate-400 ml-2">
                ({formGrams}g × ₹{fmt(parseFloat(formPrice))}
                {formType === "buy" && formTotalCharges > 0 && ` + ₹${fmt(formTotalCharges)} charges`})
              </span>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button onClick={handleSave}
              disabled={!parseFloat(formGrams) || !parseFloat(formPrice)}
              className="flex-1 rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {editingId ? "Update" : formType === "buy" ? "Record Buy" : "Record Sell / Gift"}
            </button>
            <button onClick={() => { resetForm(); setShowForm(false); }}
              className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ============== TRANSACTIONS LIST ============== */}
      {transactions.length === 0 ? (
        <div className="space-y-6">
          {/* Action-oriented hero */}
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white p-8 text-center">
            <p className="text-5xl mb-3">🏆</p>
            <h3 className="text-xl font-bold text-charcoal">Start tracking your gold in 30 seconds</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Record your first purchase and instantly see live P&L, charts, and XIRR returns.
            </p>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors">
              + Add Your First Transaction
            </button>
          </div>

          {/* Benefit cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl mb-2">📈</p>
              <p className="text-sm font-semibold text-charcoal">Track P&L in real time</p>
              <p className="text-xs text-slate-500 mt-1">See unrealized profit or loss based on live gold rates.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl mb-2">⚖️</p>
              <p className="text-sm font-semibold text-charcoal">Compare 22K vs 24K holdings</p>
              <p className="text-xs text-slate-500 mt-1">Track different purities with separate average prices.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl mb-2">☁️</p>
              <p className="text-sm font-semibold text-charcoal">Sync across devices</p>
              <p className="text-xs text-slate-500 mt-1">Sign in with Google to access your portfolio anywhere.</p>
            </div>
          </div>

          {/* Quick-add shortcuts */}
          <div id="tour-quick-add" className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick add at today&apos;s rate</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => quickAdd("22K", "coin")}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                🪙 22K Coin @ ₹{fmt(gold22k)}/g
              </button>
              <button onClick={() => quickAdd("24K", "bar")}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                🧱 24K Bar @ ₹{fmt(gold24k)}/g
              </button>
              <button onClick={() => quickAdd("22K", "necklace")}
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors">
                📿 22K Necklace @ ₹{fmt(gold22k)}/g
              </button>
              <button onClick={() => quickAdd("22K", "ring")}
                className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700 hover:bg-pink-100 transition-colors">
                💍 22K Ring @ ₹{fmt(gold22k)}/g
              </button>
              <button onClick={() => quickAdd("24K", "digital")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                📱 24K Digital @ ₹{fmt(gold24k)}/g
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          {transactions.length > 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm space-y-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search by note, item, or date..."
                  className="flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-slate-400"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                />
                {hasActiveFilters && (
                  <button onClick={() => { setFilterSearch(""); setFilterPurity("all"); setFilterType("all"); setFilterItemType("all"); setFilterDateFrom(""); setFilterDateTo(""); setSortKey("date-desc"); }}
                    className="text-[11px] text-amber-600 font-medium hover:text-amber-700 transition-colors shrink-0">
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value as "all" | "buy" | "sell")}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 bg-white focus:border-amber-400 focus:outline-none">
                  <option value="all">All Types</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
                <select value={filterPurity} onChange={(e) => setFilterPurity(e.target.value as "all" | "22K" | "24K")}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 bg-white focus:border-amber-400 focus:outline-none">
                  <option value="all">All Purity</option>
                  <option value="22K">22K</option>
                  <option value="24K">24K</option>
                </select>
                <select value={filterItemType} onChange={(e) => setFilterItemType(e.target.value as "all" | GoldItemType)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 bg-white focus:border-amber-400 focus:outline-none">
                  <option value="all">All Items</option>
                  {GOLD_ITEM_TYPES.map((it) => (
                    <option key={it.value} value={it.value}>{it.icon} {it.label}</option>
                  ))}
                </select>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 bg-white focus:border-amber-400 focus:outline-none">
                  <option value="date-desc">Date (newest)</option>
                  <option value="date-asc">Date (oldest)</option>
                  <option value="amount-desc">Amount (high→low)</option>
                  <option value="amount-asc">Amount (low→high)</option>
                  <option value="weight-desc">Weight (high→low)</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400">Date range:</span>
                <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} max={filterDateTo || today()}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 bg-white focus:border-amber-400 focus:outline-none" />
                <span className="text-[11px] text-slate-400">to</span>
                <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} min={filterDateFrom} max={today()}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 bg-white focus:border-amber-400 focus:outline-none" />
                {hasActiveFilters && (
                  <span className="self-center text-[11px] text-slate-400 ml-auto">
                    {filteredTxs.length} of {transactions.length} shown
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Print-only transaction table */}
          <div className="hidden print:block">
            <h3 className="text-sm font-bold text-charcoal mb-2">Transactions</h3>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th className="text-left py-1.5 pr-2 font-semibold">Date</th>
                  <th className="text-left py-1.5 px-1 font-semibold">Type</th>
                  <th className="text-left py-1.5 px-1 font-semibold">Item</th>
                  <th className="text-left py-1.5 px-1 font-semibold">Purity</th>
                  <th className="text-right py-1.5 px-1 font-semibold">Weight</th>
                  <th className="text-right py-1.5 px-1 font-semibold">Price/g</th>
                  <th className="text-right py-1.5 px-1 font-semibold">Charges</th>
                  <th className="text-right py-1.5 pl-1 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((tx, i) => {
                  const total = tx.grams * tx.pricePerGram + (tx.type === "buy" ? tx.charges : 0);
                  return (
                    <tr key={tx.id} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                      <td className="py-1 pr-2">{tx.date}</td>
                      <td className="py-1 px-1 capitalize">{tx.type}</td>
                      <td className="py-1 px-1">{getItemLabel(tx)}</td>
                      <td className="py-1 px-1">{tx.purity}</td>
                      <td className="py-1 px-1 text-right">{fmtG(tx.grams)}g</td>
                      <td className="py-1 px-1 text-right">₹{fmt(tx.pricePerGram)}</td>
                      <td className="py-1 px-1 text-right">₹{fmt(tx.charges)}</td>
                      <td className="py-1 pl-1 text-right font-semibold">₹{fmt(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Transaction list (screen) */}
          <div className="space-y-2 print:hidden">
            {filteredTxs.length === 0 && hasActiveFilters ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm font-semibold text-charcoal">No matching transactions</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              filteredTxs.map((tx) => {
                const totalAmount = tx.grams * tx.pricePerGram + (tx.type === "buy" ? tx.charges : 0);
                return (
                  <div key={tx.id} className={`group rounded-xl border p-4 transition-colors ${
                    tx.type === "buy"
                      ? "border-emerald-100 bg-emerald-50/30 hover:border-emerald-200"
                      : "border-red-100 bg-red-50/30 hover:border-red-200"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-lg shrink-0 ${
                          tx.type === "buy" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}>
                          {getItemIcon(tx.itemType)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal">
                            <span className={`${tx.type === "buy" ? "text-emerald-700" : "text-red-600"}`}>
                              {tx.type === "buy" ? "Bought" : "Sold / Gifted"}
                            </span>
                            {" "}{fmtG(tx.grams)}g{" "}
                            <span className="text-slate-400 font-normal text-xs">
                              {getItemLabel(tx)} &middot; {tx.purity}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {tx.note && <span className="ml-2 text-slate-400">&middot; {tx.note}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold ${tx.type === "buy" ? "text-emerald-700" : "text-red-600"}`}>
                          {tx.type === "buy" ? "+" : "−"}₹{fmt(totalAmount)}
                        </p>
                        <p className="text-[11px] text-slate-400">@ ₹{fmt(tx.pricePerGram)}/g</p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1 justify-end print:hidden">
                      <button onClick={() => startEdit(tx)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors sm:opacity-0 sm:group-hover:opacity-100">
                        ✏️ Edit
                      </button>
                      <button onClick={() => openDeleteModal(tx)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors sm:opacity-0 sm:group-hover:opacity-100">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-transaction-title"
          >
            <p id="delete-transaction-title" className="text-base font-semibold text-charcoal">
              Delete this transaction?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently remove
              {" "}
              <span className="font-semibold text-charcoal">
                {deleteTarget.type === "buy" ? "buy" : "sell"} {fmtG(deleteTarget.grams)}g {getItemLabel(deleteTarget)}
              </span>
              {" "}
              from your portfolio.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Date: {new Date(deleteTarget.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============== TUTORIAL OVERLAY ============== */}
      {showTutorial && (
        <TutorialOverlay
          step={TUTORIAL_STEPS[tutorialStep]}
          totalSteps={TUTORIAL_STEPS.length}
          currentStep={tutorialStep}
          onNext={() => {
            if (tutorialStep < TUTORIAL_STEPS.length - 1) {
              setTutorialStep(tutorialStep + 1);
            } else {
              completeTutorial();
            }
          }}
          onPrev={() => {
            if (tutorialStep > 0) setTutorialStep(tutorialStep - 1);
          }}
          onSkip={completeTutorial}
        />
      )}

      {/* Help button to re-trigger tutorial */}
      {!showTutorial && (
        <button
          onClick={startTutorial}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 hover:scale-110 transition-all flex items-center justify-center text-lg font-bold print:hidden"
          title="Take a tour"
          aria-label="Show guided tour"
        >
          ?
        </button>
      )}
    </div>
  );
}
