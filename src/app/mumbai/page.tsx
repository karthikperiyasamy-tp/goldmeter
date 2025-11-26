import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

const grams = [
  { label: "1g", value: 1 },
  { label: "8g", value: 8 },
  { label: "10g", value: 10 },
  { label: "100g", value: 100 },
];

export default async function MumbaiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Mumbai", host);
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
      city="Mumbai"
      updated={rates.date}
      gold22k={gold22k}
      gold24k={gold24k}
      gramPrices={gramPrices}
      todayVsYesterday={{ gold22k: -10, gold24k: 20 }}
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

export const metadata = {
  title: "Mumbai Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Get today's Mumbai gold rate per 10 grams for 22K and 24K gold. Compare prices, check making charges, and find best jewellery shops in Mumbai.",
};

