import { headers } from "next/headers";
import SilverCityPageShell from "../components/SilverCityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

type HistoryEntry = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number | null;
  timestamp: number;
};

// Deduplicate history by date, keeping the latest entry per date
function dedupeHistory(history: HistoryEntry[]) {
  const byDate = new Map<string, HistoryEntry>();
  for (const entry of history) {
    byDate.set(entry.date, entry); // later entries overwrite earlier ones
  }
  return Array.from(byDate.values()).sort((a, b) => a.timestamp - b.timestamp);
}

export default async function SilverIndiaPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  // Fetch rates for India (using "India" or a default city fallback for India aggregate)
  // fetchCityRates actually fetches specific city or falls back.
  // For India, we should ideally use the India data from DB. 
  // But fetchCityRates is designed for cities.
  // We can make a helper or just use a major city as proxy if India key isn't supported by fetchCityRates directly yet.
  // Actually fetchCityRates is wrapper around getLatestGoldRates which HAS India.
  // But fetchCityRates expects a city name to look up in the `cities` object.
  // Let's modify fetchCityRates or just manually fetch for now.
  
  // Better: Reuse fetchCityRates logic but for India.
  // However, fetchCityRates looks in `dbData.cities[cityName]`.
  // India is in `dbData.india`.
  
  // Let's construct the data manually here using the DB functions directly for best accuracy for "India".
  
  const { getLatestGoldRates, getHistoricalGoldRates } = await import("@/lib/goldRatesDB");
  
  const dbData = await getLatestGoldRates();
  const rawHistory = await getHistoricalGoldRates("India", 30);
  const history = dedupeHistory(rawHistory);
  
  let silver1kg = 0;
  let priceChange = 0;
  let date = new Date().toLocaleDateString('en-IN');

  if (dbData?.india) {
    silver1kg = dbData.india.silver1kg || 0;
    date = dbData.india.date;
    
    if (dbData.yesterdayIndia) {
      priceChange = (dbData.india.silver1kg || 0) - (dbData.yesterdayIndia.silver1kg || 0);
    }
  }

  // Fallback: if latest silver is missing in the India snapshot, derive it from history
  if (!silver1kg && history.length > 0) {
    const withSilver = history.filter((h) => !!h.silver1kg && h.silver1kg > 0);
    const last = withSilver.at(-1);
    const prev = withSilver.length > 1 ? withSilver.at(-2) : undefined;
    if (last?.silver1kg) {
      silver1kg = last.silver1kg;
      priceChange = last.silver1kg - (prev?.silver1kg || 0);
      // Use the last entry's date if we took the fallback
      date = last.date;
    }
  }

  return (
    <SilverCityPageShell
      city="India"
      intro="Silver rate in India today per gram and per kg with 30-day history, daily changes, and links to calculators and gold prices."
      updated={date}
      silver1kg={silver1kg}
      priceChange={priceChange}
      history={history}
      localInfo={[
        {
          title: "Silver Purity",
          description:
            "Standard silver rates in India are usually for 99.9% purity (Fine Silver).",
        },
        {
          title: "Industrial Demand",
          description: "Silver prices are heavily influenced by industrial demand in electronics and solar sectors.",
        },
      ]}
      faqs={[
        {
          question: "What is 1kg silver price in India today?",
          answer:
            `The price of 1kg silver in India today is ₹${silver1kg.toLocaleString('en-IN')}.`,
        },
        {
          question: "Is silver price same across India?",
          answer:
            "No, it varies slightly by state due to local taxes and transportation costs, though less variance than gold.",
        },
      ]}
      similarCities={["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Kolkata"]}
    />
  );
}

export const metadata = {
  title: "Silver Rate Today in India - 1kg, 10g, 1g Silver Price",
  description:
    "Check the latest Silver rate in India today. Live 1kg, 10g and 1g silver prices with historical trends.",
};

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

