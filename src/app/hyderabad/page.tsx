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
    title: `Hyderabad Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Hyderabad gold rate per gram for 22K and 24K gold. Check Abids and Sultan Bazaar prices, making charges info.`,
    alternates: {
      canonical: "https://goldmeter.in/hyderabad",
    },
    openGraph: {
      title: `Hyderabad Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Hyderabad gold rate per gram. Updated daily from Hyderabad bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/hyderabad',
    },
  };
}

export default async function HyderabadPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Hyderabad", host);

  return (
    <CityPageShell
      city="Hyderabad"
      intro="Gold rate in Hyderabad today per gram: 22K & 24K live prices with Abids and Banjara Hills trends, charts, and FAQs."
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
              "Telangana State Hallmarking Center and Regional Assay Office (Hyderabad).",
          },
          {
            title: "Making charges",
            description: "₹180 – ₹500 per gram for 22K ornaments in Old City.",
          },
          {
            title: "Top jewellery hubs",
            description: "Abids, Sultan Bazaar, and Begum Bazaar flagship stores.",
          },
        ]}
        faqs={[
          {
            question: "Why is Hyderabad gold rate competitive?",
            answer:
              "Lower state taxes and local competition keep Hyderabad rates among the most competitive in South India.",
          },
          {
            question: "Best place to buy gold in Hyderabad?",
            answer:
              "Abids and Sultan Bazaar offer a wide range of jewellers with competitive prices and traditional designs.",
          },
          {
            question: "What affects Hyderabad gold price?",
            answer:
              "International gold prices, rupee exchange rate, and local demand during festivals like Ugadi.",
          },
        ]}
        similarCities={["Vijayawada", "Bangalore", "Chennai", "Visakhapatnam"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;
