"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

/** SVG Donut Chart */
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
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
        <text x="50" y="58" textAnchor="middle" className="text-[10px] fill-charcoal font-bold">
          {fmtG(total)}g
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.filter((s) => s.value > 0).map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600">
              {seg.label}: <strong className="text-charcoal">{fmtG(seg.value)}g</strong>
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

  const padding = { top: 10, right: 10, bottom: 24, left: 50 };
  const width = 500;
  const height = 180;
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
  const yLabels = [minVal, minVal + range / 2, maxVal];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[320px]" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yLabels.map((v) => (
          <g key={v}>
            <line x1={padding.left} y1={y(v)} x2={width - padding.right} y2={y(v)} stroke="#e2e8f0" strokeWidth="0.5" />
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

        {/* X-axis labels (first, middle, last) */}
        {[0, Math.floor(dataPoints.length / 2), dataPoints.length - 1].map((i) => (
          <text key={i} x={x(i)} y={height - 4} textAnchor="middle" className="text-[7px] fill-slate-400">
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
      <div className="flex justify-center gap-6 mt-1 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" /> Invested</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" /> Portfolio Value</span>
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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const fbReady = isFirebaseConfigured();

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
        try { await upsertCloudTransaction(user.uid, updated); setSyncStatus("synced"); }
        catch { setSyncStatus("error"); }
      } else { setLocalTransactions(newTxs); }
    } else {
      const tx: PortfolioTransaction = { id: genId(), ...baseTx, createdAt: now };
      const newTxs = [...transactions, tx];
      setTransactions(newTxs);
      if (user) {
        setSyncStatus("syncing");
        try { await upsertCloudTransaction(user.uid, tx); setSyncStatus("synced"); }
        catch { setSyncStatus("error"); }
      } else { setLocalTransactions(newTxs); }
    }
    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    const newTxs = transactions.filter((t) => t.id !== id);
    setTransactions(newTxs);
    if (user) {
      setSyncStatus("syncing");
      try { await deleteCloudTransaction(user.uid, id); setSyncStatus("synced"); }
      catch { setSyncStatus("error"); }
    } else { setLocalTransactions(newTxs); }
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
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  const sortedTxs = useMemo(() => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions]);

  // ================================================
  // RENDER
  // ================================================
  return (
    <div className="space-y-6">
      {/* ---- Sign-in / User Card ---- */}
      {!user ? (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-base font-semibold text-charcoal">Sync your portfolio across devices</p>
              <p className="text-sm text-slate-600 mt-1">Sign in with Google to save your gold portfolio to the cloud.</p>
              <div className="flex items-center gap-2 mt-2">
                <SyncBadge status={syncStatus} />
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
              <span className="text-xs text-slate-400 italic">Cloud sync not configured</span>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border border-slate-200" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal truncate">{user.displayName || user.email}</p>
                <SyncBadge status={syncStatus} />
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
            {!isNaN(displayXIRR) && (
              <div className={`rounded-full px-3 py-1 text-xs font-bold ${displayXIRR >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                XIRR: {displayXIRR >= 0 ? "+" : ""}{displayXIRR.toFixed(1)}% p.a.
              </div>
            )}
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

          {/* Charts */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
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

          {/* Portfolio Value Over Time Line Chart */}
          {lineChartData.length >= 2 && (
            <div className="mt-5 rounded-2xl bg-white/70 backdrop-blur border border-slate-100 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Portfolio Value Over Time</p>
              <PortfolioLineChart dataPoints={lineChartData} />
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

      {/* ============== ADD TRANSACTION ============== */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-charcoal">
          Transactions
          {transactions.length > 0 && <span className="ml-2 text-xs text-slate-400 font-normal">({transactions.length})</span>}
        </h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors">
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

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
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-3xl mb-3">📦</p>
          <p className="text-sm font-semibold text-charcoal">No transactions yet</p>
          <p className="text-xs text-slate-500 mt-1">Add your first gold buy or sell to start tracking your portfolio.</p>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="mt-4 rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors">
            + Add Transaction
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTxs.map((tx) => {
            const totalAmount = tx.grams * tx.pricePerGram + (tx.type === "buy" ? tx.charges : 0);
            return (
              <div key={tx.id} className={`rounded-xl border p-4 transition-colors ${
                tx.type === "buy"
                  ? "border-emerald-100 bg-emerald-50/30 hover:border-emerald-200"
                  : "border-red-100 bg-red-50/30 hover:border-red-200"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0 ${
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
                      <p className="text-xs text-slate-500">
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
                <div className="mt-2 flex gap-2 justify-end">
                  <button onClick={() => startEdit(tx)} className="text-xs text-slate-400 hover:text-amber-600 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(tx.id)} className="text-xs text-slate-400 hover:text-red-600 transition-colors">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
