import { getDatabase } from './mongodb';
import { unstable_cache } from 'next/cache';

export type GoldRateDocument = {
  date: Date;
  city: string;
  gold_22k: number;
  gold_24k: number;
  source: string;
  created_at: Date;
  updated_at: Date;
};

export type CityRates = {
  [city: string]: {
    gold22k: number | null;
    gold24k: number | null;
    timestamp: string;
  };
};

const COLLECTION_NAME = 'gold_prices';

/**
 * Save gold rates to MongoDB
 * Creates/updates a record for each city for the given date
 */
export async function saveGoldRates(
  indiaRates: { gold22k: number | null; gold24k: number | null },
  cityRates: CityRates
): Promise<{ success: boolean; saved: number; errors: number }> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const now = new Date();
    let saved = 0;
    let errors = 0;

    // Save India rate
    if (indiaRates.gold22k && indiaRates.gold24k) {
      try {
        await collection.updateOne(
          { city: 'India', date: today },
          {
            $set: {
              gold_22k: indiaRates.gold22k,
              gold_24k: indiaRates.gold24k,
              source: 'GoodReturns',
              updated_at: now,
            },
            $setOnInsert: {
              date: today,
              city: 'India',
              created_at: now,
            },
          },
          { upsert: true }
        );
        saved++;
        console.log(`✅ [DB] Saved India rates: 22K=₹${indiaRates.gold22k}, 24K=₹${indiaRates.gold24k}`);
      } catch (error) {
        console.error('❌ [DB] Error saving India rates:', error);
        errors++;
      }
    }

    // Save city rates
    for (const [cityName, rates] of Object.entries(cityRates)) {
      if (rates.gold22k && rates.gold24k) {
        try {
          await collection.updateOne(
            { city: cityName, date: today },
            {
              $set: {
                gold_22k: rates.gold22k,
                gold_24k: rates.gold24k,
                source: 'GoodReturns',
                updated_at: now,
              },
              $setOnInsert: {
                date: today,
                city: cityName,
                created_at: now,
              },
            },
            { upsert: true }
          );
          saved++;
        } catch (error) {
          console.error(`❌ [DB] Error saving ${cityName} rates:`, error);
          errors++;
        }
      }
    }

    console.log(`📊 [DB] Summary: ${saved} saved, ${errors} errors`);
    
    return { success: true, saved, errors };
  } catch (error) {
    console.error('❌ [DB] Database error:', error);
    return { success: false, saved: 0, errors: 1 };
  }
}

/**
 * Get latest gold rates for all cities (internal uncached version)
 * Returns dates as strings to work with Next.js cache serialization
 */
async function getLatestGoldRatesUncached(): Promise<{
  india: { gold22k: number; gold24k: number; date: string } | null;
  cities: Record<string, { gold22k: number; gold24k: number; date: string }>;
}> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);

    // Get the most recent date
    const latestDoc = await collection
      .find()
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    if (latestDoc.length === 0) {
      console.log('⚠️  [DB] No data found in database');
      return { india: null, cities: {} };
    }

    const latestDate = latestDoc[0].date;
    console.log(`📅 [DB] Fetching rates for date: ${latestDate.toISOString().split('T')[0]}`);

    // Get all rates for that date
    const allRates = await collection
      .find({ date: latestDate })
      .toArray();

    let india = null;
    const cities: Record<string, { gold22k: number; gold24k: number; date: string }> = {};

    for (const rate of allRates) {
      // Convert Date to formatted string for cache serialization
      const rateData = {
        gold22k: rate.gold_22k,
        gold24k: rate.gold_24k,
        date: rate.date.toLocaleDateString('en-IN'),
      };

      if (rate.city === 'India') {
        india = rateData;
      } else {
        cities[rate.city] = rateData;
      }
    }

    console.log(`✅ [DB] Fetched India rate and ${Object.keys(cities).length} city rates`);
    
    return { india, cities };
  } catch (error) {
    console.error('❌ [DB] Error fetching rates:', error);
    return { india: null, cities: {} };
  }
}

/**
 * Get latest gold rates for all cities (cached version)
 * Cache duration: 5 minutes (300 seconds)
 */
export const getLatestGoldRates = unstable_cache(
  getLatestGoldRatesUncached,
  ['latest-gold-rates'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['gold-rates'],
  }
);

/**
 * Get historical gold rates for a city (internal uncached version)
 * @param city City name or 'India'
 * @param days Number of days to fetch (7, 30, 365)
 */
async function getHistoricalGoldRatesUncached(
  city: string = 'India',
  days: number = 7
): Promise<Array<{
  date: string;
  gold22k: number;
  gold24k: number;
  timestamp: number;
}>> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const rates = await collection
      .find({
        city: city,
        date: { $gte: startDate },
      })
      .sort({ date: 1 })
      .toArray();

    const formatted = rates.map(rate => ({
      date: rate.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      gold22k: rate.gold_22k,
      gold24k: rate.gold_24k,
      timestamp: rate.date.getTime(),
    }));

    console.log(`📈 [DB] Fetched ${formatted.length} historical rates for ${city} (${days} days)`);
    
    return formatted;
  } catch (error) {
    console.error('❌ [DB] Error fetching historical rates:', error);
    return [];
  }
}

/**
 * Get historical gold rates for a city (cached version)
 * Cache duration: 30 minutes (1800 seconds)
 * Historical data doesn't change frequently, so longer cache is fine
 */
export async function getHistoricalGoldRates(
  city: string = 'India',
  days: number = 7
): Promise<Array<{
  date: string;
  gold22k: number;
  gold24k: number;
  timestamp: number;
}>> {
  // Create a cached version with city and days as cache key
  const cachedFn = unstable_cache(
    () => getHistoricalGoldRatesUncached(city, days),
    [`historical-gold-rates-${city}-${days}`],
    {
      revalidate: 1800, // Cache for 30 minutes
      tags: ['gold-rates', `city-${city}`],
    }
  );
  
  return cachedFn();
}

/**
 * Create indexes for better query performance
 * Should be run once during setup
 */
export async function createIndexes(): Promise<void> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);

    await collection.createIndex({ city: 1, date: -1 });
    await collection.createIndex({ date: -1 });
    
    console.log('✅ [DB] Indexes created successfully');
  } catch (error) {
    console.error('❌ [DB] Error creating indexes:', error);
  }
}

