import { getDatabase } from "./mongodb";
import type { InternationalRates } from "./internationalRates";

const COLLECTION_NAME = "international_gold_prices";

type SaveResult = { success: boolean; saved: number; errors: number };

let ensuredIndex = false;

async function ensureUniqueIndex() {
  if (ensuredIndex) return;
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);
    await collection.createIndex(
      { country: 1, carat: 1, date: 1 },
      { unique: true, name: "country_carat_date_unique" },
    );
    ensuredIndex = true;
  } catch (error) {
    // If index exists, ignore; otherwise log
    if (error && (error as Error).message?.includes("already exists")) {
      ensuredIndex = true;
    } else {
      console.error("⚠️  [DB] Failed to ensure international index:", error);
    }
  }
}

export async function saveInternationalRates(
  data: InternationalRates | null,
): Promise<SaveResult> {
  if (!data) return { success: false, saved: 0, errors: 1 };

  try {
    await ensureUniqueIndex();
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    let saved = 0;
    let errors = 0;

    const upsertMany = async (carat: "24K" | "22K" | "18K", rows: typeof data.gold24k) => {
      for (const row of rows) {
        try {
          await collection.updateOne(
            { country: row.country, carat, date: today },
            {
              $set: {
                currency_code: row.currencyCode,
                price: row.price,
                price_inr: row.priceInr,
                source: data.source,
                scrape_timestamp: row.timestamp,
                updated_at: now,
              },
              $setOnInsert: {
                date: today,
                created_at: now,
              },
            },
            { upsert: true },
          );
          saved++;
        } catch (error) {
          console.error(`❌ [DB] Error saving international rate for ${row.country} (${carat}):`, error);
          errors++;
        }
      }
    };

    await upsertMany("24K", data.gold24k);
    await upsertMany("22K", data.gold22k);
    await upsertMany("18K", data.gold18k);

    console.log(`🌍 [DB] International rates saved: ${saved} entries, ${errors} errors`);
    return { success: true, saved, errors };
  } catch (error) {
    console.error("❌ [DB] Error saving international rates:", error);
    return { success: false, saved: 0, errors: 1 };
  }
}

