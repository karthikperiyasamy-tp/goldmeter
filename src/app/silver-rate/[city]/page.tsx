import { headers } from "next/headers";
import SilverCityPageShell from "../../components/SilverCityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";
import { getLatestGoldRates, getHistoricalGoldRates } from "@/lib/goldRatesDB";

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

// List of supported cities for silver rate pages
const supportedCities = [
  "Ahmedabad",
  "Ayodhya",
  "Bangalore",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Delhi",
  "Hyderabad",
  "Jaipur",
  "Kerala",
  "Kolkata",
  "Lucknow",
  "Madurai",
  "Mangalore",
  "Mumbai",
  "Mysore",
  "Nagpur",
  "Nashik",
  "Patna",
  "Pune",
  "Rajkot",
  "Salem",
  "Surat",
  "Trichy",
  "Vadodara",
  "Vijayawada",
  "Visakhapatnam",
];

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return supportedCities.map((city) => ({
    city: city.toLowerCase(),
  }));
}

export default async function SilverCityPage({ params }: Props) {
  const { city } = await params;
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  // Capitalize city name for display/fetching
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  
  const rates = await fetchCityRates(cityName, host);
  const history = dedupeHistory(rates.history || []);

  // Fallbacks when silver is missing for the city snapshot
  let silver1kg = rates.silver1kg || 0;
  let priceChange = rates.priceChange.silver1kg || 0;
  let updatedDate = rates.date;
  let outputHistory = history;

  // 1) Try city history last non-zero
  if (!silver1kg && history.length > 0) {
    const withSilver = history.filter((h) => !!h.silver1kg && h.silver1kg > 0);
    const last = withSilver.at(-1);
    const prev = withSilver.length > 1 ? withSilver.at(-2) : undefined;
    if (last?.silver1kg) {
      silver1kg = last.silver1kg;
      priceChange = last.silver1kg - (prev?.silver1kg || 0);
      updatedDate = last.date;
    }
  }

  // 2) If still missing, fall back to India latest + history
  if (!silver1kg) {
    const indiaData = await getLatestGoldRates();
    const indiaSilver = indiaData?.india?.silver1kg || 0;
    if (indiaSilver) {
      const indiaYesterday = indiaData?.yesterdayIndia?.silver1kg || 0;
      silver1kg = indiaSilver;
      priceChange = indiaSilver - indiaYesterday;
      updatedDate = indiaData?.india?.date || updatedDate;
    }

    if (!outputHistory.length) {
      const indiaHistory = dedupeHistory(await getHistoricalGoldRates("India", 30));
      if (indiaHistory.length) {
        outputHistory = indiaHistory;
      }
    }
  }

  return (
    <SilverCityPageShell
      city={cityName}
      intro={`Silver rate in ${cityName} today per gram and per kg with charts and 30-day history. Compare with gold tools below.`}
      updated={updatedDate}
      silver1kg={silver1kg}
      priceChange={priceChange}
      history={outputHistory}
      localInfo={[
        {
          title: "Local Silver Market",
          description:
            `Check local silver bullion dealers in ${cityName} for spot prices.`,
        },
        {
          title: "Silver Purity",
          description:
            "Standard silver rates are usually for 99.9% purity (Fine Silver).",
        },
      ]}
      faqs={[
        {
          question: `What is today's silver rate in ${cityName}?`,
          answer:
            `The silver rate in ${cityName} today is ₹${rates.silver1kg.toLocaleString('en-IN')} per kg.`,
        },
        {
          question: `Is silver price same across all cities?`,
          answer:
            "No, silver prices vary slightly by city due to local taxes and transportation costs.",
        },
      ]}
      similarCities={supportedCities.filter(c => c !== cityName).slice(0, 5)}
    />
  );
}

// Metadata is defined in layout.tsx for this route
// Removed duplicate generateMetadata to prevent canonical/title conflicts

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

