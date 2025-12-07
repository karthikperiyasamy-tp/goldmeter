import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

export default async function DelhiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Delhi", host);

  return (
    <CityPageShell
      city="Delhi"
      intro="Gold rate in Delhi today per gram: 22K & 24K live prices with Karol Bagh and Chandni Chowk trends, charts, and FAQs."
      updated={rates.date}
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

export const metadata = {
  title: "Delhi Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Today's Delhi gold rate for 22K and 24K gold per 10 grams. Check Chandni Chowk prices, making charges, and best jewellery shops.",
};

// Disable caching for immediate updates
export const revalidate = 0;

