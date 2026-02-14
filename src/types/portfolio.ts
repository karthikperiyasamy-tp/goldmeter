/** Core portfolio data types */

export type TransactionType = "buy" | "sell";

/** Type of gold item */
export type GoldItemType =
  | "coin"
  | "bar"
  | "biscuit"
  | "necklace"
  | "chain"
  | "ring"
  | "bangle"
  | "earring"
  | "pendant"
  | "bracelet"
  | "digital"
  | "other";

export const GOLD_ITEM_TYPES: { value: GoldItemType; label: string; icon: string }[] = [
  { value: "coin", label: "Gold Coin", icon: "🪙" },
  { value: "bar", label: "Gold Bar", icon: "🧱" },
  { value: "biscuit", label: "Gold Biscuit", icon: "✨" },
  { value: "necklace", label: "Necklace", icon: "📿" },
  { value: "chain", label: "Chain", icon: "🔗" },
  { value: "ring", label: "Ring", icon: "💍" },
  { value: "bangle", label: "Bangle", icon: "⭕" },
  { value: "earring", label: "Earring", icon: "👂" },
  { value: "pendant", label: "Pendant", icon: "🔶" },
  { value: "bracelet", label: "Bracelet", icon: "⌚" },
  { value: "digital", label: "Digital Gold", icon: "📱" },
  { value: "other", label: "Other", icon: "📦" },
];

export interface PortfolioTransaction {
  /** Unique ID (UUID v4) */
  id: string;
  /** Buy or sell/gift */
  type: TransactionType;
  /** Transaction date (ISO string YYYY-MM-DD) */
  date: string;
  /** Gold weight in grams */
  grams: number;
  /** Price per gram at time of transaction (₹) */
  pricePerGram: number;
  /** Total charges (wastage + making). Kept for backward compat. */
  charges: number;
  /** Wastage charges (₹) — buy only */
  wastageCharges?: number;
  /** Making charges (₹) — buy only */
  makingCharges?: number;
  /** Gold purity - 22K or 24K */
  purity: "22K" | "24K";
  /** Type of gold item */
  itemType: GoldItemType;
  /** Custom item name when itemType is "other" (max 30 chars) */
  customItemName?: string;
  /** Optional note */
  note: string;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
}

export interface PortfolioHolding {
  /** Net grams held (buy minus sell) */
  netGrams: number;
  /** Total amount invested (sum of buy amounts) */
  totalInvested: number;
  /** Total charges paid */
  totalCharges: number;
  /** Average buy price per gram */
  avgBuyPrice: number;
  /** Current market value based on live rate */
  currentValue: number;
  /** Unrealized profit/loss */
  unrealizedPL: number;
  /** Unrealized P&L percentage */
  unrealizedPLPercent: number;
  /** Total grams bought */
  totalBought: number;
  /** Total grams sold */
  totalSold: number;
  /** Total sell proceeds */
  totalSellProceeds: number;
  /** Realized P&L from sells */
  realizedPL: number;
  /** XIRR annualized return (%) — NaN if not computable */
  xirr: number;
}

export type SyncStatus = "local" | "syncing" | "synced" | "error";

export interface PortfolioState {
  transactions: PortfolioTransaction[];
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
}
