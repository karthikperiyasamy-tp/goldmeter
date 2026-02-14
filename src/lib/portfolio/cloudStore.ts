import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import type { PortfolioTransaction } from "@/types/portfolio";

/** Firestore collection path for a user's transactions */
function txCollection(uid: string) {
  const db = getFirebaseFirestore();
  return collection(db, "users", uid, "transactions");
}

/** Fetch all transactions from Firestore for a user */
export async function getCloudTransactions(
  uid: string
): Promise<PortfolioTransaction[]> {
  const snap = await getDocs(txCollection(uid));
  return snap.docs.map((d) => d.data() as PortfolioTransaction);
}

/** Upsert a single transaction */
export async function upsertCloudTransaction(
  uid: string,
  tx: PortfolioTransaction
): Promise<void> {
  const ref = doc(txCollection(uid), tx.id);
  await setDoc(ref, tx, { merge: true });
}

/** Delete a single transaction */
export async function deleteCloudTransaction(
  uid: string,
  txId: string
): Promise<void> {
  const ref = doc(txCollection(uid), txId);
  await deleteDoc(ref);
}

/**
 * Migrate local transactions to Firestore (idempotent upsert by id).
 * Merges with existing cloud data — keeps cloud copy if same id exists.
 * Returns the unified list.
 */
export async function migrateLocalToCloud(
  uid: string,
  localTxs: PortfolioTransaction[]
): Promise<PortfolioTransaction[]> {
  const db = getFirebaseFirestore();
  const existing = await getCloudTransactions(uid);
  const existingIds = new Set(existing.map((t) => t.id));

  // Only write local txs that don't already exist in cloud
  const newTxs = localTxs.filter((t) => !existingIds.has(t.id));

  if (newTxs.length > 0) {
    const batch = writeBatch(db);
    for (const tx of newTxs) {
      const ref = doc(txCollection(uid), tx.id);
      batch.set(ref, tx);
    }
    await batch.commit();
  }

  // Return the merged list
  return [...existing, ...newTxs];
}
