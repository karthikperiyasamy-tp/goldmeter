import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

const grams = [
  { label: "1g", value: 1 },
  { label: "8g", value: 8 },
  { label: "10g", value: 10 },
  { label: "100g", value: 100 },
];

export default async function DelhiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Delhi", host);
  const gold22k = rates.gold22k;
  const gold24k = rates.gold24k;

    const gramPrices = [
      {
        carat: "22K",
        values: grams.map((item) => ({
          label: item.label,
          price: (gold22k / 10) * item.value,
        })),
      },
      {
        carat: "24K",
        values: grams.map((item) => ({
          label: item.label,
          price: (gold24k / 10) * item.value,
        })),
      },
    ];

    return (
      <CityPageShell
        city="Delhi"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: 15, gold24k: 18 }}
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

// Cache this page for 5 minutes (300 seconds)
export const revalidate = 300;

