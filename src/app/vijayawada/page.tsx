import { headers } from "next/headers";
import { Metadata } from "next";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

// Dynamic metadata with date for AIO freshness signals
export async function generateMetadata(): Promise<Metadata> {
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return {
    title: `Vijayawada Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Vijayawada gold rate per gram for 22K and 24K gold. Check Governorpet prices, making charges, and trusted jewellers.`,
    alternates: {
      canonical: "https://goldmeter.in/vijayawada",
    },
    openGraph: {
      title: `Vijayawada Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Vijayawada gold rate per gram. Updated daily from Vijayawada bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/vijayawada',
    },
  };
}

export default async function VijayawadaPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Vijayawada", host);

  return (
    <CityPageShell
      city="Vijayawada"
      intro="Gold rate in Vijayawada today per gram: 22K & 24K live prices with Governorpet and Autonagar trends, charts, and FAQs."
      updated={rates.date}
      dateISO={rates.dateISO}
      gold22k={rates.gold22k}
      gold24k={rates.gold24k}
      silver1kg={rates.silver1kg}
      priceChange={rates.priceChange}
      history={rates.history}
      localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "Andhra Pradesh Hallmarking Center and Regional Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹160 – ₹400 per gram for 22K ornaments in Governorpet.",
          },
          {
            title: "Top jewellery hubs",
            description: "Governorpet, Besant Road, and Eluru Road jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Vijayawada gold rate similar to Hyderabad?",
            answer:
              "Yes, Vijayawada rates are typically within ₹10-₹20 of Hyderabad prices.",
          },
          {
            question: "Best jewellery shops in Vijayawada?",
            answer:
              "Governorpet area has established jewellers with BIS hallmarked gold and traditional Andhra designs.",
          },
          {
            question: "Making charges in Vijayawada?",
            answer:
              "Typically ₹160-₹400 per gram, lower than metro cities like Mumbai or Delhi.",
          },
        ]}
        similarCities={["Hyderabad", "Guntur", "Visakhapatnam", "Tirupati"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

