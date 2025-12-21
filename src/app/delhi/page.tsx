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
    title: `Delhi Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Delhi gold rate per gram for 22K and 24K gold. Check Chandni Chowk prices, making charges, and best jewellery shops.`,
    alternates: {
      canonical: "https://goldmeter.in/delhi",
    },
    openGraph: {
      title: `Delhi Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Delhi gold rate per gram. Updated daily from Delhi bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/delhi',
    },
  };
}

export default async function DelhiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Delhi", host);

  return (
    <CityPageShell
      city="Delhi"
      intro="Gold rate in Delhi today per gram: 22K & 24K live prices with Karol Bagh and Chandni Chowk trends, charts, and FAQs."
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
              "BIS Delhi Office (Chandni Chowk) and National Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹220 – ₹600 per gram for 22K ornaments in Chandni Chowk.",
          },
          {
            title: "Top jewellery hubs",
            description: "Chandni Chowk, Karol Bagh, and Connaught Place jewellers.",
          },
        ]}
        faqs={[
          {
            question: "Why is Delhi gold rate different?",
            answer:
              "Delhi rates include local taxes, high demand during wedding season, and proximity to import hubs.",
          },
          {
            question: "Is Chandni Chowk good for gold buying?",
            answer:
              "Yes, Chandni Chowk is India's largest gold market with competitive prices and wide variety.",
          },
          {
            question: "What are making charges in Delhi?",
            answer:
              "Making charges range from ₹220-₹600 per gram based on design and jeweller.",
          },
        ]}
        similarCities={["Noida", "Gurgaon", "Faridabad", "Mumbai"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

