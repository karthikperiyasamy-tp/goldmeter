import { getLatestGoldRates, getHistoricalGoldRates } from './goldRatesDB';

// Price change per 10g (today - yesterday)
export type PriceChange = {
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number;
};

/**
 * Check if a price change is suspicious (likely preliminary data from GoodReturns)
 * GoodReturns often posts rates that differ by exactly ₹10/10g (₹1/gram) in the morning
 * before updating to the final rate later.
 * 
 * @param change Price change per 10g
 * @returns true if the change is suspicious and should be treated as 0
 */
export function isSuspiciousPriceChange(change: number): boolean {
  // Ignore if change is exactly ₹10/10g (₹1/gram) - likely preliminary data
  return Math.abs(change) === 10;
}

/**
 * Check if any gold price change is suspicious
 */
export function hasSuspiciousPriceChange(priceChange: PriceChange): boolean {
  return isSuspiciousPriceChange(priceChange.gold22k) || 
         isSuspiciousPriceChange(priceChange.gold24k) || 
         isSuspiciousPriceChange(priceChange.gold18k);
}

/**
 * Calculate price change, using fallback rates when yesterday's change is suspicious
 * 
 * @param todayRates Today's rates
 * @param yesterdayRates Yesterday's rates (may have suspicious preliminary data)
 * @param fallbackRates Day-before-yesterday's rates (used when yesterday is suspicious)
 * @returns Price change from the appropriate comparison date
 */
export function calculatePriceChangeWithFallback(
  todayRates: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null },
  yesterdayRates: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null } | null,
  fallbackRates: { gold22k: number; gold24k: number; gold18k: number; silver1kg: number | null } | null
): PriceChange {
  if (!yesterdayRates) {
    return { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 };
  }

  // Calculate change vs yesterday
  const changeVsYesterday: PriceChange = {
    gold22k: todayRates.gold22k - yesterdayRates.gold22k,
    gold24k: todayRates.gold24k - yesterdayRates.gold24k,
    gold18k: todayRates.gold18k - yesterdayRates.gold18k,
    silver1kg: (todayRates.silver1kg || 0) - (yesterdayRates.silver1kg || 0),
  };

  // Check if the change is suspicious (exactly ₹10/10g)
  if (hasSuspiciousPriceChange(changeVsYesterday)) {
    console.log(`⚠️ [PriceChange] Suspicious ₹10/10g change detected vs yesterday (22K=${changeVsYesterday.gold22k}, 24K=${changeVsYesterday.gold24k}, 18K=${changeVsYesterday.gold18k}).`);
    
    // Use day-before-yesterday as fallback
    if (fallbackRates) {
      const changeVsFallback: PriceChange = {
        gold22k: todayRates.gold22k - fallbackRates.gold22k,
        gold24k: todayRates.gold24k - fallbackRates.gold24k,
        gold18k: todayRates.gold18k - fallbackRates.gold18k,
        silver1kg: (todayRates.silver1kg || 0) - (fallbackRates.silver1kg || 0),
      };
      console.log(`📈 [PriceChange] Using day-before-yesterday as reference: 22K=${changeVsFallback.gold22k >= 0 ? '+' : ''}₹${changeVsFallback.gold22k}, 24K=${changeVsFallback.gold24k >= 0 ? '+' : ''}₹${changeVsFallback.gold24k}`);
      return changeVsFallback;
    } else {
      console.log(`⚠️ [PriceChange] No day-before-yesterday data available, showing 0 change`);
      return { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: changeVsYesterday.silver1kg };
    }
  }

  return changeVsYesterday;
}

type RateHistory = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number | null;
  timestamp: number;
};

// Cities that use another city's rates as fallback
// (when GoodReturns doesn't have data for them)
const CITY_FALLBACKS: Record<string, string> = {
  "Moodbidri": "Mangalore", // Moodbidri is 35km from Mangalore
  "Kochi": "Kerala", // Kochi is in Kerala
  "Tirunelveli": "Madurai", // Tirunelveli is 150km from Madurai, same region
};

/**
 * Fetch city-specific gold rates
 * Tries DB first, falls back to scraping API if needed
 * 
 * @param cityName - Name of the city (e.g., "Chennai", "Mumbai")
 * @param host - Request host for API calls
 * @returns Object with gold22k, gold24k and gold18k rates, plus price change from yesterday
 */
export async function fetchCityRates(
  cityName: string,
  host: string = 'localhost:3000'
): Promise<{
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number;
  source: 'db' | 'scrape' | 'mock';
  date: string;
  dateISO: string; // ISO format for structured data freshness
  priceChange: PriceChange;
  history: RateHistory[];
}> {
  // Determine if this city has a fallback source
  const fallbackCity = CITY_FALLBACKS[cityName];
  const historyCity = fallbackCity || cityName;
  
  // Fetch history and current rates in parallel for better performance
  console.log(`📊 [FetchCityRates] Fetching data for ${cityName}${fallbackCity ? ` (using ${fallbackCity} rates)` : ''}...`);
  const [historyResult, dbDataResult] = await Promise.allSettled([
    getHistoricalGoldRates(historyCity, 30), // Use fallback city for history if needed
    getLatestGoldRates(),
  ]);

  // Process history
  const history: RateHistory[] = historyResult.status === 'fulfilled' ? historyResult.value : [];
  if (historyResult.status === 'fulfilled') {
    console.log(`📊 [FetchCityRates] Fetched ${history.length} historical records for ${cityName}`);
  } else {
    console.error(`❌ [FetchCityRates] Error fetching history for ${cityName}:`, historyResult.reason);
  }

  // Try database first
  if (dbDataResult.status === 'fulfilled') {
    const dbData = dbDataResult.value;
    
    // Try primary city first, then fallback city if available
    const dbCityName = dbData.cities[cityName] ? cityName : (fallbackCity && dbData.cities[fallbackCity] ? fallbackCity : null);
    
    if (dbCityName) {
      if (dbCityName !== cityName) {
        console.log(`📍 [FetchCityRates] Using ${dbCityName} rates for ${cityName} (nearby city fallback)`);
      } else {
        console.log(`✅ [FetchCityRates] Found ${cityName} in DB`);
      }
      
      // Calculate price change from yesterday (using the same source city)
      // If yesterday's change is suspicious (₹10/10g), use day-before-yesterday instead
      let priceChange: PriceChange = { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 };
      
      if (dbData.yesterdayCities[dbCityName]) {
        // Primary: Use yesterday's data from DB, with day-before-yesterday as fallback
        const todayRates = {
          gold22k: dbData.cities[dbCityName].gold22k,
          gold24k: dbData.cities[dbCityName].gold24k,
          gold18k: dbData.cities[dbCityName].gold18k,
          silver1kg: dbData.cities[dbCityName].silver1kg,
        };
        const yesterdayRates = dbData.yesterdayCities[dbCityName];
        const dayBeforeYesterdayRates = dbData.dayBeforeYesterdayCities?.[dbCityName] || null;
        
        priceChange = calculatePriceChangeWithFallback(todayRates, yesterdayRates, dayBeforeYesterdayRates);
        console.log(`📈 [FetchCityRates] ${cityName} price change (from DB): 22K=${priceChange.gold22k >= 0 ? '+' : ''}₹${priceChange.gold22k}, 24K=${priceChange.gold24k >= 0 ? '+' : ''}₹${priceChange.gold24k}, 18K=${priceChange.gold18k >= 0 ? '+' : ''}₹${priceChange.gold18k}, Silver=${priceChange.silver1kg >= 0 ? '+' : ''}₹${priceChange.silver1kg}`);
      } else if (history.length >= 2) {
        // Fallback: Use history array if yesterday's specific city data is missing
        // History is sorted by date ascending, so last entry is today's, second-to-last is yesterday's
        const todayHistory = history[history.length - 1];
        const yesterdayHistory = history[history.length - 2];
        const dayBeforeYesterdayHistory = history.length >= 3 ? history[history.length - 3] : null;
        
        priceChange = calculatePriceChangeWithFallback(todayHistory, yesterdayHistory, dayBeforeYesterdayHistory);
        console.log(`📈 [FetchCityRates] ${cityName} price change (from history fallback): 22K=${priceChange.gold22k >= 0 ? '+' : ''}₹${priceChange.gold22k}, 24K=${priceChange.gold24k >= 0 ? '+' : ''}₹${priceChange.gold24k}, 18K=${priceChange.gold18k >= 0 ? '+' : ''}₹${priceChange.gold18k}, Silver=${priceChange.silver1kg >= 0 ? '+' : ''}₹${priceChange.silver1kg}`);
      } else {
        console.log(`⚠️ [FetchCityRates] ${cityName}: No yesterday data in DB (yesterdayCities: ${Object.keys(dbData.yesterdayCities).length} cities) or history (${history.length} records), price change = ₹0`);
      }
      
      return {
        gold22k: dbData.cities[dbCityName].gold22k,
        gold24k: dbData.cities[dbCityName].gold24k,
        gold18k: dbData.cities[dbCityName].gold18k || Math.round((dbData.cities[dbCityName].gold24k * 18) / 24),
        silver1kg: dbData.cities[dbCityName].silver1kg || 0,
        source: 'db',
        date: dbData.cities[dbCityName].date, // Already formatted as string
        dateISO: new Date().toISOString().split('T')[0], // ISO format for structured data
        priceChange,
        history,
      };
    }
    
    console.log(`⚠️  [FetchCityRates] ${cityName} not found in DB, trying scrape...`);
  } else {
    console.error(`❌ [FetchCityRates] DB error for ${cityName}:`, dbDataResult.reason);
  }
  
  // Fallback to scraping API
  try {
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const response = await fetch(`${protocol}://${host}/api/scrape-rates`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      // Try primary city first, then fallback city
      let cityRates = data.data?.cities?.[cityName];
      let usedFallback = false;
      
      if (!cityRates?.gold22k && fallbackCity) {
        cityRates = data.data?.cities?.[fallbackCity];
        usedFallback = true;
      }
      
      if (cityRates?.gold22k && cityRates?.gold24k) {
        if (usedFallback) {
          console.log(`📍 [FetchCityRates] Scraped ${fallbackCity} rates for ${cityName} (nearby city fallback)`);
        } else {
          console.log(`✅ [FetchCityRates] Scraped ${cityName} rates`);
        }
        const gold18k = cityRates.gold18k || Math.round((cityRates.gold24k * 18) / 24);
        return {
          gold22k: cityRates.gold22k,
          gold24k: cityRates.gold24k,
          gold18k,
          silver1kg: cityRates.silver1kg || 0,
          source: 'scrape',
          date: new Date().toLocaleDateString('en-IN'),
          dateISO: new Date().toISOString().split('T')[0],
          priceChange: { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 }, // No historical data from scraping
          history,
        };
      }
    }
    
    console.log(`⚠️  [FetchCityRates] Scraping failed for ${cityName}, using mock data`);
  } catch (error) {
    console.error(`❌ [FetchCityRates] Scraping error for ${cityName}:`, error);
  }
  
  // Final fallback to mock data
  console.log(`⚠️  [FetchCityRates] Using mock data for ${cityName}`);
  return {
    ...getMockRates(cityName),
    history,
  };
}

/**
 * Mock data fallback for each city
 */
function getMockRates(cityName: string): {
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number;
  source: 'mock';
  date: string;
  dateISO: string;
  priceChange: PriceChange;
} {
  const mockRatesMap: Record<string, { gold22k: number; gold24k: number; silver1kg: number }> = {
    Chennai: { gold22k: 59680, gold24k: 64890, silver1kg: 78000 },
    Mumbai: { gold22k: 59410, gold24k: 64600, silver1kg: 76500 },
    Bangalore: { gold22k: 59720, gold24k: 64980, silver1kg: 75000 },
    Delhi: { gold22k: 59540, gold24k: 64720, silver1kg: 77000 },
    Hyderabad: { gold22k: 59390, gold24k: 64580, silver1kg: 79000 },
    Coimbatore: { gold22k: 59610, gold24k: 64810, silver1kg: 78500 },
    Pune: { gold22k: 59450, gold24k: 64650, silver1kg: 76000 },
    Kolkata: { gold22k: 59680, gold24k: 64890, silver1kg: 77500 },
    Ahmedabad: { gold22k: 59520, gold24k: 64700, silver1kg: 75500 },
    Vijayawada: { gold22k: 59620, gold24k: 64820, silver1kg: 78200 },
    Kerala: { gold22k: 59750, gold24k: 65020, silver1kg: 78500 },
    Kochi: { gold22k: 59750, gold24k: 65020, silver1kg: 78500 }, // Same as Kerala
    Madurai: { gold22k: 59680, gold24k: 64890, silver1kg: 78000 },
    Tirunelveli: { gold22k: 59680, gold24k: 64890, silver1kg: 78000 }, // Same as Madurai
  };
  
  const rates = mockRatesMap[cityName] || { gold22k: 59500, gold24k: 64700, silver1kg: 75000 };
  const gold18k = Math.round((rates.gold24k * 18) / 24);
  
  return {
    ...rates,
    gold18k,
    source: 'mock',
    date: new Date().toLocaleDateString('en-IN'),
    dateISO: new Date().toISOString().split('T')[0],
    priceChange: { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 }, // No historical data for mock
  };
}

