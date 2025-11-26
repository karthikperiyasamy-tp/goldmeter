import { headers } from "next/headers";
import HomeClient, {
  type CityRate,
  type NewsItem,
  type RateResponse,
} from "./components/HomeClient";

// Fetch scraped rates including India rate
// Using Next.js cache with 30-minute revalidation to prevent multiple calls
async function getScrapedRates() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  
  console.log("🔄 [HomePage] Fetching scraped rates from API...");
  
  try {
    const res = await fetch(`${protocol}://${host}/api/scrape-rates`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!res.ok) {
      throw new Error("Failed to fetch scraped rates");
    }

    const data = await res.json();
    console.log("✅ [HomePage] Scraped rates received successfully");
    return data;
  } catch (error) {
    console.error("❌ [HomePage] Failed to fetch scraped rates:", error);
    return null;
  }
}

const mockCities: CityRate[] = [
  {
    name: "Chennai",
    gold22k: 59680,
    gold24k: 64890,
    updated: "10:35 AM",
    change: 0.4,
  },
  {
    name: "Mumbai",
    gold22k: 59410,
    gold24k: 64600,
    updated: "10:30 AM",
    change: -0.1,
  },
  {
    name: "Bangalore",
    gold22k: 59720,
    gold24k: 64980,
    updated: "10:33 AM",
    change: 0.2,
  },
  {
    name: "Delhi",
    gold22k: 59540,
    gold24k: 64720,
    updated: "10:32 AM",
    change: 0.15,
  },
  {
    name: "Hyderabad",
    gold22k: 59390,
    gold24k: 64580,
    updated: "10:31 AM",
    change: -0.05,
  },
  {
    name: "Coimbatore",
    gold22k: 59610,
    gold24k: 64810,
    updated: "10:36 AM",
    change: 0.25,
  },
];

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Why Gold Prices Spiked Today?",
    date: "20 Nov 2025",
    summary:
      "Rupee weakness and festive demand lifted domestic prices despite a flat COMEX session.",
    city: "India",
    slug: "gold-price-spike-today",
  },
  {
    id: 2,
    title: "Chennai Demand Pushes 22K Higher",
    date: "19 Nov 2025",
    summary:
      "Retail buying in T Nagar and increased wedding orders nudged 22K prices up by ₹45.",
    city: "Chennai",
    slug: "chennai-gold-demand",
  },
  {
    id: 3,
    title: "Is 24K Premium Justified in 2025?",
    date: "18 Nov 2025",
    summary:
      "We decode the spread between 22K vs 24K coins and how investors can optimize purchases.",
    slug: "24k-premium-2025",
  },
];

export default async function HomePage() {
  const scrapedData = await getScrapedRates();
  
  console.log("Scraped data:", JSON.stringify(scrapedData, null, 2));
  
  // Use scraped India rate or fallback to mock
  const baseRates: RateResponse = {
    date: new Date().toLocaleDateString("en-IN"),
    gold_24k: scrapedData?.success && scrapedData?.data?.india?.gold24k 
      ? scrapedData.data.india.gold24k 
      : 64500,
    gold_22k: scrapedData?.success && scrapedData?.data?.india?.gold22k 
      ? scrapedData.data.india.gold22k 
      : 59200,
    city: "India",
  };
  
  console.log("Base rates being used:", baseRates);

  // Convert scraped city data to CityRate format, or fallback to mock
  let cityRates: CityRate[] = mockCities;
  
  if (scrapedData?.success && scrapedData?.data?.cities) {
    const cities = scrapedData.data.cities as Record<string, { gold22k: number | null; gold24k: number | null; timestamp: string }>;
    
    cityRates = Object.entries(cities)
      .filter(([_, rates]) => rates.gold22k !== null && rates.gold24k !== null)
      .map(([name, rates]) => ({
        name,
        gold22k: rates.gold22k as number,
        gold24k: rates.gold24k as number,
        updated: new Date(rates.timestamp).toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        change: 0, // Calculate change if you have historical data
      }));
    
    console.log(`✅ Using ${cityRates.length} scraped city rates`);
  } else {
    console.log("⚠️ Using mock city data (scraping failed or no data)");
  }

  return <HomeClient baseRates={baseRates} cities={cityRates} newsItems={mockNews} />;
}
