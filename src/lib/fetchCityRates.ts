import { getLatestGoldRates, getHistoricalGoldRates } from './goldRatesDB';

// Price change per 10g (today - yesterday)
export type PriceChange = {
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number;
};

type RateHistory = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number | null;
  timestamp: number;
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
  priceChange: PriceChange;
  history: RateHistory[];
}> {
  // Fetch history and current rates in parallel for better performance
  console.log(`📊 [FetchCityRates] Fetching data for ${cityName}...`);
  const [historyResult, dbDataResult] = await Promise.allSettled([
    getHistoricalGoldRates(cityName, 30),
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
    
    if (dbData.cities[cityName]) {
      console.log(`✅ [FetchCityRates] Found ${cityName} in DB`);
      
      // Calculate price change from yesterday
      let priceChange: PriceChange = { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 };
      if (dbData.yesterdayCities[cityName]) {
        priceChange = {
          gold22k: dbData.cities[cityName].gold22k - dbData.yesterdayCities[cityName].gold22k,
          gold24k: dbData.cities[cityName].gold24k - dbData.yesterdayCities[cityName].gold24k,
          gold18k: dbData.cities[cityName].gold18k - dbData.yesterdayCities[cityName].gold18k,
          silver1kg: (dbData.cities[cityName].silver1kg || 0) - (dbData.yesterdayCities[cityName].silver1kg || 0),
        };
        console.log(`📈 [FetchCityRates] ${cityName} price change: 22K=${priceChange.gold22k >= 0 ? '+' : ''}₹${priceChange.gold22k}, 24K=${priceChange.gold24k >= 0 ? '+' : ''}₹${priceChange.gold24k}, 18K=${priceChange.gold18k >= 0 ? '+' : ''}₹${priceChange.gold18k}, Silver=${priceChange.silver1kg >= 0 ? '+' : ''}₹${priceChange.silver1kg}`);
      }
      
      return {
        gold22k: dbData.cities[cityName].gold22k,
        gold24k: dbData.cities[cityName].gold24k,
        gold18k: dbData.cities[cityName].gold18k || Math.round((dbData.cities[cityName].gold24k * 18) / 24),
        silver1kg: dbData.cities[cityName].silver1kg || 0,
        source: 'db',
        date: dbData.cities[cityName].date, // Already formatted as string
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
      const cityRates = data.data?.cities?.[cityName];
      
      if (cityRates?.gold22k && cityRates?.gold24k) {
        console.log(`✅ [FetchCityRates] Scraped ${cityName} rates`);
        const gold18k = cityRates.gold18k || Math.round((cityRates.gold24k * 18) / 24);
        return {
          gold22k: cityRates.gold22k,
          gold24k: cityRates.gold24k,
          gold18k,
          silver1kg: cityRates.silver1kg || 0,
          source: 'scrape',
          date: new Date().toLocaleDateString('en-IN'),
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
  };
  
  const rates = mockRatesMap[cityName] || { gold22k: 59500, gold24k: 64700, silver1kg: 75000 };
  const gold18k = Math.round((rates.gold24k * 18) / 24);
  
  return {
    ...rates,
    gold18k,
    source: 'mock',
    date: new Date().toLocaleDateString('en-IN'),
    priceChange: { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 }, // No historical data for mock
  };
}

