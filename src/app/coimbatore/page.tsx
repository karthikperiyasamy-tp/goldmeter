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
    title: `Coimbatore Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Coimbatore gold rate per gram for 22K and 24K gold. Check RS Puram prices, making charges, and best jewellery shops.`,
    alternates: {
      canonical: "https://goldmeter.in/coimbatore",
    },
    openGraph: {
      title: `Coimbatore Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Coimbatore gold rate per gram. Updated daily from Coimbatore bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/coimbatore',
    },
  };
}

export default async function CoimbatorePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Coimbatore", host);

  return (
    <CityPageShell
      city="Coimbatore"
      intro="Gold rate in Coimbatore today per gram: 22K & 24K live prices with RS Puram and Cross Cut Road trends, charts, and FAQs."
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
              "Tamil Nadu Hallmarking Center (Coimbatore Branch) and Regional Office.",
          },
          {
            title: "Making charges",
            description: "₹140 – ₹400 per gram for 22K ornaments in RS Puram.",
          },
          {
            title: "Top jewellery hubs",
            description: "RS Puram, Oppanakara Street, and Gandhipuram markets.",
          },
        ]}
        faqs={[
          {
            question: "Is Coimbatore gold rate different from Chennai?",
            answer:
              "Coimbatore rates are usually ₹20-₹40 lower than Chennai due to lower demand and local competition.",
          },
          {
            question: "Best place to buy gold in Coimbatore?",
            answer:
              "RS Puram and Oppanakara Street are traditional jewellery hubs with competitive prices.",
          },
          {
            question: "Making charges in Coimbatore?",
            answer:
              "Generally ₹140-₹400 per gram, often lower than metro cities.",
          },
        ]}
        similarCities={["Chennai", "Madurai", "Salem", "Erode"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

