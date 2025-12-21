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
    title: `Pune Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Pune gold rate per gram for 22K and 24K gold. Check Laxmi Road prices, making charges, and trusted jewellers list.`,
    alternates: {
      canonical: "https://goldmeter.in/pune",
    },
    openGraph: {
      title: `Pune Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Pune gold rate per gram. Updated daily from Pune bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/pune',
    },
  };
}

export default async function PunePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Pune", host);

  return (
    <CityPageShell
      city="Pune"
      intro="Gold rate in Pune today per gram: 22K & 24K live prices with Laxmi Road and Hadapsar trends, charts, and FAQs."
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
              "BIS Hallmarking Center (Pune) and Maharashtra Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹190 – ₹480 per gram for 22K ornaments in Laxmi Road.",
          },
          {
            title: "Top jewellery hubs",
            description: "Laxmi Road, FC Road, and Deccan Gymkhana jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Pune gold rate same as Mumbai?",
            answer:
              "Pune rates are typically ₹10-₹20 lower than Mumbai due to lower demand and logistics costs.",
          },
          {
            question: "Best time to buy gold in Pune?",
            answer:
              "Gudi Padwa, Akshaya Tritiya, and Diwali offer good buying opportunities with festive discounts.",
          },
          {
            question: "Trusted jewellers in Pune?",
            answer:
              "Laxmi Road has established jewellers with BIS hallmarked gold and competitive making charges.",
          },
        ]}
        similarCities={["Mumbai", "Nashik", "Aurangabad", "Kolhapur"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

