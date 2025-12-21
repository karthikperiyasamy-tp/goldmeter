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
    title: `Kolkata Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Kolkata gold rate per gram for 22K and 24K gold. Check Bowbazar prices, Bengali jewellery making charges, and trusted shops.`,
    alternates: {
      canonical: "https://goldmeter.in/kolkata",
    },
    openGraph: {
      title: `Kolkata Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Kolkata gold rate per gram. Updated daily from Kolkata bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/kolkata',
    },
  };
}

export default async function KolkataPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Kolkata", host);

  return (
    <CityPageShell
      city="Kolkata"
      intro="Gold rate in Kolkata today per gram: 22K & 24K live prices with Bowbazar and Burrabazar trends, charts, and FAQs."
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
              "BIS Eastern Regional Office and Bowbazar Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹200 – ₹550 per gram for 22K ornaments in Bowbazar.",
          },
          {
            title: "Top jewellery hubs",
            description: "Bowbazar, Bagree Market, and New Market jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Why is Kolkata gold rate different?",
            answer:
              "Kolkata has unique demand during Durga Puja and traditional Bengali jewellery preferences affect pricing.",
          },
          {
            question: "Best place to buy gold in Kolkata?",
            answer:
              "Bowbazar is the traditional gold hub with century-old jewellers and competitive prices.",
          },
          {
            question: "Making charges in Kolkata?",
            answer:
              "Ranges from ₹200-₹550 per gram, with traditional Bengali designs commanding premium charges.",
          },
        ]}
        similarCities={["Siliguri", "Asansol", "Durgapur", "Patna"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

