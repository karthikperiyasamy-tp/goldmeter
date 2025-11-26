import { getLatestGoldRates } from './goldRatesDB';

/**
 * Fetch city-specific gold rates
 * Tries DB first, falls back to scraping API if needed
 * 
 * @param cityName - Name of the city (e.g., "Chennai", "Mumbai")
 * @param host - Request host for API calls
 * @returns Object with gold22k and gold24k rates
 */
export async function fetchCityRates(
  cityName: string,
  host: string = 'localhost:3000'
): Promise<{
  gold22k: number;
  gold24k: number;
  source: 'db' | 'scrape' | 'mock';
  date: string;
}> {
  // Try database first
  try {
    console.log(`📊 [FetchCityRates] Trying DB for ${cityName}...`);
    const dbData = await getLatestGoldRates();
    
    if (dbData.cities[cityName]) {
      console.log(`✅ [FetchCityRates] Found ${cityName} in DB`);
      return {
        gold22k: dbData.cities[cityName].gold22k,
        gold24k: dbData.cities[cityName].gold24k,
        source: 'db',
        date: dbData.cities[cityName].date.toLocaleDateString('en-IN'),
      };
    }
    
    console.log(`⚠️  [FetchCityRates] ${cityName} not found in DB, trying scrape...`);
  } catch (error) {
    console.error(`❌ [FetchCityRates] DB error for ${cityName}:`, error);
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
        return {
          gold22k: cityRates.gold22k,
          gold24k: cityRates.gold24k,
          source: 'scrape',
          date: new Date().toLocaleDateString('en-IN'),
        };
      }
    }
    
    console.log(`⚠️  [FetchCityRates] Scraping failed for ${cityName}, using mock data`);
  } catch (error) {
    console.error(`❌ [FetchCityRates] Scraping error for ${cityName}:`, error);
  }
  
  // Final fallback to mock data
  console.log(`⚠️  [FetchCityRates] Using mock data for ${cityName}`);
  return getMockRates(cityName);
}

/**
 * Mock data fallback for each city
 */
function getMockRates(cityName: string): {
  gold22k: number;
  gold24k: number;
  source: 'mock';
  date: string;
} {
  const mockRatesMap: Record<string, { gold22k: number; gold24k: number }> = {
    Chennai: { gold22k: 59680, gold24k: 64890 },
    Mumbai: { gold22k: 59410, gold24k: 64600 },
    Bangalore: { gold22k: 59720, gold24k: 64980 },
    Delhi: { gold22k: 59540, gold24k: 64720 },
    Hyderabad: { gold22k: 59390, gold24k: 64580 },
    Coimbatore: { gold22k: 59610, gold24k: 64810 },
    Pune: { gold22k: 59450, gold24k: 64650 },
    Kolkata: { gold22k: 59680, gold24k: 64890 },
    Ahmedabad: { gold22k: 59520, gold24k: 64700 },
    Vijayawada: { gold22k: 59620, gold24k: 64820 },
  };
  
  const rates = mockRatesMap[cityName] || { gold22k: 59500, gold24k: 64700 };
  
  return {
    ...rates,
    source: 'mock',
    date: new Date().toLocaleDateString('en-IN'),
  };
}

