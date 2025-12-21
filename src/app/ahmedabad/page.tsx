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
    title: `Ahmedabad Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices | GoldMeter`,
    description: `As of ${todayFormatted}, get today's Ahmedabad gold rate per gram for 22K and 24K gold. Check Manek Chowk prices, making charges, and best jewellers.`,
    alternates: {
      canonical: "https://goldmeter.in/ahmedabad",
    },
    openGraph: {
      title: `Ahmedabad Gold Rate Today (${todayFormatted}) - Live 22K & 24K Prices`,
      description: `As of ${todayFormatted}, get today's Ahmedabad gold rate per gram. Updated daily from Ahmedabad bullion market.`,
      type: 'website',
      url: 'https://goldmeter.in/ahmedabad',
    },
  };
}

export default async function AhmedabadPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Ahmedabad", host);

  return (
    <CityPageShell
      city="Ahmedabad"
      intro="Gold rate in Ahmedabad today per gram: live 22K & 24K prices with Manek Chowk and C.G. Road jeweller trends, charts, and FAQs."
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
              "BIS Gujarat Office and Manek Chowk Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹170 – ₹420 per gram for 22K ornaments in Manek Chowk.",
          },
          {
            title: "Top jewellery hubs",
            description: "Manek Chowk, Relief Road, and CG Road jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Ahmedabad gold rate lower than other cities?",
            answer:
              "Yes, Ahmedabad typically has competitive rates due to proximity to Surat diamond and gold market.",
          },
          {
            question: "Best gold market in Ahmedabad?",
            answer:
              "Manek Chowk is the premier gold market with numerous trusted jewellers and wholesale prices.",
          },
          {
            question: "Making charges in Ahmedabad?",
            answer:
              "Generally ₹170-₹420 per gram, with Gujarati designs often having moderate making charges.",
          },
        ]}
        similarCities={["Surat", "Rajkot", "Vadodara", "Gandhinagar"]}
      />
    );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

