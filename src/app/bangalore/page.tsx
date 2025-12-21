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
    title: `Bangalore Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Bangalore gold rate per gram for 22K and 24K gold. Get real-time prices, making charges info, and top jewellery stores.`,
    alternates: {
      canonical: "https://goldmeter.in/bangalore",
    },
    openGraph: {
      title: `Bangalore Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Bangalore gold rate per gram. Updated daily from Bangalore bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/bangalore',
    },
  };
}

export default async function BangalorePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Bangalore", host);

  return (
    <CityPageShell
      city="Bangalore"
      intro="Gold rate in Bangalore today per gram: 22K & 24K live prices with Jayanagar and Commercial Street trends, charts, and FAQs."
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
              "BIS Hallmarking Center (Indiranagar) and Regional Assay Office (Bangalore).",
          },
          {
            title: "Making charges",
            description: "₹180 – ₹450 per gram for 22K ornaments in Commercial Street.",
          },
          {
            title: "Top jewellery hubs",
            description: "Commercial Street, Brigade Road, and Jayanagar shopping complex.",
          },
        ]}
        faqs={[
          {
            question: "Why is Bangalore gold rate higher than other cities?",
            answer:
              "Bangalore has high demand from IT professionals and premium jewellery stores, leading to slightly higher prices.",
          },
          {
            question: "Best jewellery shops in Bangalore?",
            answer:
              "Commercial Street and Brigade Road have numerous trusted jewellers with BIS hallmarked gold.",
          },
          {
            question: "Making charges in Bangalore?",
            answer:
              "Typically ₹180-₹450 per gram depending on the design intricacy and jeweller reputation.",
          },
        ]}
        similarCities={["Chennai", "Hyderabad", "Mysore", "Mangalore"]}
      />
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

