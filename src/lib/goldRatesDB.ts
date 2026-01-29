import { getDatabase } from './mongodb';
import { unstable_cache } from 'next/cache';

export type GoldRateDocument = {
  date: Date;
  city: string;
  gold_22k: number;
  gold_24k: number;
  gold_18k: number;
  silver_1kg?: number;
  source: string;
  created_at: Date;
  updated_at: Date;
};

export type CityRates = {
  [city: string]: {
    gold22k: number | null;
    gold24k: number | null;
    gold18k: number | null;
    silver1kg: number | null;
    timestamp: string;
  };
};

const COLLECTION_NAME = 'gold_prices';

/**
 * Check if the rate difference is suspicious (likely preliminary data from GoodReturns)
 * GoodReturns often posts rates that differ by exactly ₹10/10g (₹1/gram) in the morning
 * before updating to the final rate later.
 * 
 * @param existingRate Existing rate in DB (per 10g)
 * @param newRate New rate from scraper (per 10g)
 * @returns true if the difference is suspicious and should be ignored
 */
function isSuspiciousDifference(existingRate: number, newRate: number): boolean {
  const diff = Math.abs(existingRate - newRate);
  // Ignore if difference is exactly ₹10/10g (₹1/gram) - likely preliminary data
  return diff === 10;
}

/**
 * Save gold rates to MongoDB
 * Creates/updates a record for each city for the given date
 * Skips updates if the difference is exactly ₹10/10g (likely preliminary data)
 */
export async function saveGoldRates(
  indiaRates: { gold22k: number | null; gold24k: number | null; gold18k: number | null; silver1kg: number | null },
  cityRates: CityRates
): Promise<{ success: boolean; saved: number; errors: number; skipped: number }> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const now = new Date();
    let saved = 0;
    let errors = 0;
    let skipped = 0;

    const hasSilverValue = (value: number | null | undefined) => value !== null && value !== undefined;

    // Save India rate
    if (indiaRates.gold22k && indiaRates.gold24k) {
      try {
        // Check if rate already exists for today
        const existingIndia = await collection.findOne({ city: 'India', date: today });
        
        if (existingIndia) {
          // Check if the difference is suspicious (₹10/10g = ₹1/gram)
          const is22kSuspicious = isSuspiciousDifference(existingIndia.gold_22k, indiaRates.gold22k);
          const is24kSuspicious = isSuspiciousDifference(existingIndia.gold_24k, indiaRates.gold24k);
          
          if (is22kSuspicious || is24kSuspicious) {
            console.log(`⏭️ [DB] Skipping India update - suspicious ₹10/10g difference (likely preliminary data). Existing: 22K=₹${existingIndia.gold_22k}, 24K=₹${existingIndia.gold_24k}. New: 22K=₹${indiaRates.gold22k}, 24K=₹${indiaRates.gold24k}`);
            skipped++;
          } else {
            // Update with new rate
            await collection.updateOne(
              { city: 'India', date: today },
              {
                $set: {
                  gold_22k: indiaRates.gold22k,
                  gold_24k: indiaRates.gold24k,
                  gold_18k: indiaRates.gold18k || Math.round((indiaRates.gold24k * 18) / 24),
                  ...(hasSilverValue(indiaRates.silver1kg) ? { silver_1kg: indiaRates.silver1kg } : {}),
                  source: 'GoodReturns',
                  updated_at: now,
                },
              }
            );
            saved++;
            console.log(`✅ [DB] Updated India rates: 22K=₹${indiaRates.gold22k}, 24K=₹${indiaRates.gold24k}, Silver=₹${indiaRates.silver1kg}`);
          }
        } else {
          // Insert new rate
          await collection.insertOne({
            date: today,
            city: 'India',
            gold_22k: indiaRates.gold22k,
            gold_24k: indiaRates.gold24k,
            gold_18k: indiaRates.gold18k || Math.round((indiaRates.gold24k * 18) / 24),
            ...(hasSilverValue(indiaRates.silver1kg) ? { silver_1kg: indiaRates.silver1kg } : {}),
            source: 'GoodReturns',
            created_at: now,
            updated_at: now,
          } as GoldRateDocument);
          saved++;
          console.log(`✅ [DB] Saved India rates: 22K=₹${indiaRates.gold22k}, 24K=₹${indiaRates.gold24k}, Silver=₹${indiaRates.silver1kg}`);
        }
      } catch (error) {
        console.error('❌ [DB] Error saving India rates:', error);
        errors++;
      }
    }

    // Save city rates
    for (const [cityName, rates] of Object.entries(cityRates)) {
      if (rates.gold22k && rates.gold24k) {
        try {
          // Check if rate already exists for today
          const existingCity = await collection.findOne({ city: cityName, date: today });
          
          if (existingCity) {
            // Check if the difference is suspicious (₹10/10g = ₹1/gram)
            const is22kSuspicious = isSuspiciousDifference(existingCity.gold_22k, rates.gold22k);
            const is24kSuspicious = isSuspiciousDifference(existingCity.gold_24k, rates.gold24k);
            
            if (is22kSuspicious || is24kSuspicious) {
              console.log(`⏭️ [DB] Skipping ${cityName} update - suspicious ₹10/10g difference`);
              skipped++;
            } else {
              // Update with new rate
              await collection.updateOne(
                { city: cityName, date: today },
                {
                  $set: {
                    gold_22k: rates.gold22k,
                    gold_24k: rates.gold24k,
                    gold_18k: rates.gold18k || Math.round((rates.gold24k * 18) / 24),
                    ...(hasSilverValue(rates.silver1kg) ? { silver_1kg: rates.silver1kg } : {}),
                    source: 'GoodReturns',
                    updated_at: now,
                  },
                }
              );
              saved++;
            }
          } else {
            // Insert new rate
            await collection.insertOne({
              date: today,
              city: cityName,
              gold_22k: rates.gold22k,
              gold_24k: rates.gold24k,
              gold_18k: rates.gold18k || Math.round((rates.gold24k * 18) / 24),
              ...(hasSilverValue(rates.silver1kg) ? { silver_1kg: rates.silver1kg } : {}),
              source: 'GoodReturns',
              created_at: now,
              updated_at: now,
            } as GoldRateDocument);
            saved++;
          }
        } catch (error) {
          console.error(`❌ [DB] Error saving ${cityName} rates:`, error);
          errors++;
        }
      }
    }

    console.log(`📊 [DB] Summary: ${saved} saved, ${skipped} skipped (suspicious ₹10 diff), ${errors} errors`);
    
    return { success: true, saved, errors, skipped };
  } catch (error) {
    console.error('❌ [DB] Database error:', error);
    return { success: false, saved: 0, errors: 1, skipped: 0 };
  }
}

/**
 * Get latest gold rates for all cities (internal uncached version)
 * Returns dates as strings to work with Next.js cache serialization
 * Also returns yesterday's and day-before-yesterday's rates for calculating price changes
 * (day-before-yesterday is used as fallback when yesterday's change is suspicious ₹10/10g)
 */
async function getLatestGoldRatesUncached(): Promise<{
  india: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null; date: string } | null;
  cities: Record<string, { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null; date: string }>;
  yesterdayIndia: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null } | null;
  yesterdayCities: Record<string, { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null }>;
  dayBeforeYesterdayIndia: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null } | null;
  dayBeforeYesterdayCities: Record<string, { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null }>;
}> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);

    // Get the three most recent distinct dates (today, yesterday, day-before-yesterday)
    const recentDates = await collection
      .aggregate([
        { $group: { _id: '$date' } },
        { $sort: { _id: -1 } },
        { $limit: 3 }
      ])
      .toArray();

    if (recentDates.length === 0) {
      console.log('⚠️  [DB] No data found in database');
      return { india: null, cities: {}, yesterdayIndia: null, yesterdayCities: {}, dayBeforeYesterdayIndia: null, dayBeforeYesterdayCities: {} };
    }

    const latestDate = recentDates[0]._id;
    const yesterdayDate = recentDates.length > 1 ? recentDates[1]._id : null;
    const dayBeforeYesterdayDate = recentDates.length > 2 ? recentDates[2]._id : null;
    
    console.log(`📅 [DB] Fetching rates for date: ${latestDate.toISOString().split('T')[0]}`);
    if (yesterdayDate) {
      console.log(`📅 [DB] Yesterday's date: ${yesterdayDate.toISOString().split('T')[0]}`);
    }
    if (dayBeforeYesterdayDate) {
      console.log(`📅 [DB] Day-before-yesterday's date: ${dayBeforeYesterdayDate.toISOString().split('T')[0]}`);
    }

    // Get all rates for today
    const todayRates = await collection
      .find({ date: latestDate })
      .toArray();

    // Get all rates for yesterday (if available)
    const yesterdayRates = yesterdayDate 
      ? await collection.find({ date: yesterdayDate }).toArray()
      : [];

    // Get all rates for day-before-yesterday (if available)
    const dayBeforeYesterdayRates = dayBeforeYesterdayDate 
      ? await collection.find({ date: dayBeforeYesterdayDate }).toArray()
      : [];

    let india = null;
    const cities: Record<string, { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null; date: string }> = {};

    for (const rate of todayRates) {
      const rateData = {
        gold22k: rate.gold_22k,
        gold24k: rate.gold_24k,
        gold18k: rate.gold_18k || Math.round((rate.gold_24k * 18) / 24),
        silver1kg: rate.silver_1kg || null,
        date: rate.date.toLocaleDateString('en-IN'),
      };

      if (rate.city === 'India') {
        india = rateData;
      } else {
        cities[rate.city] = rateData;
      }
    }

    // Process yesterday's rates
    let yesterdayIndia: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null } | null = null;
    const yesterdayCities: Record<string, { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null }> = {};

    for (const rate of yesterdayRates) {
      const rateData = {
        gold22k: rate.gold_22k,
        gold24k: rate.gold_24k,
        gold18k: rate.gold_18k || Math.round((rate.gold_24k * 18) / 24),
        silver1kg: rate.silver_1kg || null,
      };

      if (rate.city === 'India') {
        yesterdayIndia = rateData;
      } else {
        yesterdayCities[rate.city] = rateData;
      }
    }

    // Process day-before-yesterday's rates
    let dayBeforeYesterdayIndia: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null } | null = null;
    const dayBeforeYesterdayCities: Record<string, { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null }> = {};

    for (const rate of dayBeforeYesterdayRates) {
      const rateData = {
        gold22k: rate.gold_22k,
        gold24k: rate.gold_24k,
        gold18k: rate.gold_18k || Math.round((rate.gold_24k * 18) / 24),
        silver1kg: rate.silver_1kg || null,
      };

      if (rate.city === 'India') {
        dayBeforeYesterdayIndia = rateData;
      } else {
        dayBeforeYesterdayCities[rate.city] = rateData;
      }
    }

    console.log(`✅ [DB] Fetched India rate and ${Object.keys(cities).length} city rates for today`);
    if (yesterdayIndia || Object.keys(yesterdayCities).length > 0) {
      console.log(`✅ [DB] Yesterday's rates: India=${yesterdayIndia ? 'yes' : 'no'}, ${Object.keys(yesterdayCities).length} cities`);
    } else {
      console.log(`⚠️ [DB] No yesterday rates found (need at least 2 distinct dates in DB)`);
    }
    if (dayBeforeYesterdayIndia || Object.keys(dayBeforeYesterdayCities).length > 0) {
      console.log(`✅ [DB] Day-before-yesterday's rates: India=${dayBeforeYesterdayIndia ? 'yes' : 'no'}, ${Object.keys(dayBeforeYesterdayCities).length} cities`);
    }
    
    return { india, cities, yesterdayIndia, yesterdayCities, dayBeforeYesterdayIndia, dayBeforeYesterdayCities };
  } catch (error) {
    console.error('❌ [DB] Error fetching rates:', error);
    return { india: null, cities: {}, yesterdayIndia: null, yesterdayCities: {}, dayBeforeYesterdayIndia: null, dayBeforeYesterdayCities: {} };
  }
}

/**
 * Get latest gold rates for all cities (cached version)
 * Cache duration: 5 minutes (300 seconds)
 * Returns today's rates and yesterday's rates for calculating changes
 */
export const getLatestGoldRates = unstable_cache(
  getLatestGoldRatesUncached,
  ['latest-gold-rates-v3'], // Incremented version to bust cache
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
  gold18k: number;
  silver1kg: number | null;
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
      gold18k: rate.gold_18k || Math.round((rate.gold_24k * 18) / 24),
      silver1kg: rate.silver_1kg || null,
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
  gold18k: number;
  silver1kg: number | null;
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

/**
 * Get India gold rates for a specific date (for recap pages)
 * Returns rates and price change from previous day
 * If previous day's change is suspicious (₹10/10g), uses day-before-yesterday as fallback
 * @param dateString Date string in format "YYYY-MM-DD"
 */
export async function getGoldRatesForDate(dateString: string): Promise<{
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number | null;
  priceChange: { gold22k: number; gold24k: number };
} | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<GoldRateDocument>(COLLECTION_NAME);

    // Parse the date string and normalize to start of day
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    // Get the previous day and day-before-yesterday
    const previousDate = new Date(targetDate);
    previousDate.setDate(previousDate.getDate() - 1);
    
    const dayBeforeYesterdayDate = new Date(targetDate);
    dayBeforeYesterdayDate.setDate(dayBeforeYesterdayDate.getDate() - 2);

    // Fetch rates for target date (India)
    const targetRate = await collection.findOne({
      city: 'India',
      date: targetDate,
    });

    if (!targetRate) {
      console.log(`⚠️ [DB] No India rate found for ${dateString}`);
      return null;
    }

    // Fetch rates for previous day
    const previousRate = await collection.findOne({
      city: 'India',
      date: previousDate,
    });

    // Calculate raw price change vs previous day
    const rawPriceChange = {
      gold22k: previousRate ? targetRate.gold_22k - previousRate.gold_22k : 0,
      gold24k: previousRate ? targetRate.gold_24k - previousRate.gold_24k : 0,
    };
    
    // Check if the change is suspicious (₹10/10g = ₹1/gram)
    const is22kSuspicious = isSuspiciousDifference(previousRate?.gold_22k || 0, targetRate.gold_22k);
    const is24kSuspicious = isSuspiciousDifference(previousRate?.gold_24k || 0, targetRate.gold_24k);
    
    let priceChange = rawPriceChange;
    
    if (is22kSuspicious || is24kSuspicious) {
      // Fetch day-before-yesterday rates as fallback
      const dayBeforeYesterdayRate = await collection.findOne({
        city: 'India',
        date: dayBeforeYesterdayDate,
      });
      
      if (dayBeforeYesterdayRate) {
        priceChange = {
          gold22k: targetRate.gold_22k - dayBeforeYesterdayRate.gold_22k,
          gold24k: targetRate.gold_24k - dayBeforeYesterdayRate.gold_24k,
        };
        console.log(`⚠️ [DB] Suspicious ₹10 change for ${dateString}, using day-before-yesterday as reference`);
      } else {
        // No fallback available, show 0
        priceChange = { gold22k: 0, gold24k: 0 };
        console.log(`⚠️ [DB] Suspicious ₹10 change for ${dateString}, no fallback data available`);
      }
    }

    console.log(`✅ [DB] Fetched India rate for ${dateString}: 22K=₹${targetRate.gold_22k}, 24K=₹${targetRate.gold_24k}, change: 22K=${priceChange.gold22k >= 0 ? '+' : ''}₹${priceChange.gold22k}, 24K=${priceChange.gold24k >= 0 ? '+' : ''}₹${priceChange.gold24k}`);

    return {
      gold22k: targetRate.gold_22k,
      gold24k: targetRate.gold_24k,
      gold18k: targetRate.gold_18k || Math.round((targetRate.gold_24k * 18) / 24),
      silver1kg: targetRate.silver_1kg || null,
      priceChange,
    };
  } catch (error) {
    console.error(`❌ [DB] Error fetching rates for ${dateString}:`, error);
    return null;
  }
}

