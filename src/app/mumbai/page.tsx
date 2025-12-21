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
    title: `Mumbai Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Mumbai gold rate per gram for 22K and 24K gold. Compare prices, check making charges, and find best jewellery shops in Mumbai.`,
    alternates: {
      canonical: "https://goldmeter.in/mumbai",
    },
    openGraph: {
      title: `Mumbai Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Mumbai gold rate per gram. Updated daily from Mumbai bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/mumbai',
    },
  };
}

export default async function MumbaiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Mumbai", host);

  return (
    <CityPageShell
      city="Mumbai"
      intro="Gold rate in Mumbai today per gram: 22K & 24K live prices with Zaveri Bazaar and Dadar trends, charts, and FAQs."
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
            "BIS Regional Office (Andheri) and Zaveri Bazaar Assay Office.",
        },
        {
          title: "Making charges",
          description: "₹200 – ₹500 per gram for 22K ornaments in Zaveri Bazaar.",
        },
        {
          title: "Top jewellery hubs",
          description: "Zaveri Bazaar, Dadar, and Andheri West flagship stores.",
        },
      ]}
      faqs={[
        {
          question: "Why is Mumbai gold rate different from other cities?",
          answer:
            "Mumbai rates are influenced by international markets, port logistics, and high demand from jewellers.",
        },
        {
          question: "Is making charge high in Mumbai?",
          answer:
            "Making charges in Mumbai range from ₹200-₹500 per gram depending on design complexity.",
        },
        {
          question: "Best time to buy gold in Mumbai?",
          answer:
            "Akshaya Tritiya, Dhanteras, and during off-season months when making charges are lower.",
        },
      ]}
      similarCities={["Pune", "Ahmedabad", "Surat", "Chennai"]}
    />
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

