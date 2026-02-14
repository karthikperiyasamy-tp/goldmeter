import type { PortfolioTransaction } from "@/types/portfolio";

const STORAGE_KEY = "goldmeter:portfolio:v1";

/** Read all transactions from localStorage (backfills missing itemType) */
export function getLocalTransactions(): PortfolioTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Backfill fields for transactions created before they existed
    return parsed.map((tx: PortfolioTransaction) => ({
      ...tx,
      itemType: tx.itemType || "other",
      wastageCharges: tx.wastageCharges ?? 0,
      makingCharges: tx.makingCharges ?? tx.charges ?? 0,
      customItemName: tx.customItemName ?? undefined,
    }));
  } catch {
    return [];
  }
}

/** Write all transactions to localStorage */
export function setLocalTransactions(txs: PortfolioTransaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

/** Add a single transaction */
export function addLocalTransaction(tx: PortfolioTransaction): PortfolioTransaction[] {
  const txs = getLocalTransactions();
  txs.push(tx);
  setLocalTransactions(txs);
  return txs;
}

/** Update a transaction by id */
export function updateLocalTransaction(
  id: string,
  updates: Partial<Omit<PortfolioTransaction, "id" | "createdAt">>
): PortfolioTransaction[] {
  const txs = getLocalTransactions();
  const idx = txs.findIndex((t) => t.id === id);
  if (idx >= 0) {
    txs[idx] = {
      ...txs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setLocalTransactions(txs);
  }
  return txs;
}

/** Delete a transaction by id */
export function deleteLocalTransaction(id: string): PortfolioTransaction[] {
  const txs = getLocalTransactions().filter((t) => t.id !== id);
  setLocalTransactions(txs);
  return txs;
}

/** Clear all local transactions (e.g. after cloud migration) */
export function clearLocalTransactions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
