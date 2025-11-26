import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

const grams = [
  { label: "1g", value: 1 },
  { label: "8g", value: 8 },
  { label: "10g", value: 10 },
  { label: "100g", value: 100 },
];

export default async function BangalorePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Bangalore", host);
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
        city="Bangalore"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: 20, gold24k: 25 }}
        localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "BIS Hallmarking Center (Indiranagar) and Regional Assay Office (Bangalore).",
          },
          {
            title: "Making charges",
            description: "₹180 – ₹450 per gram for 22K ornaments in Commercial Street.",
          },
          {
            title: "Top jewellery hubs",
            description: "Commercial Street, Brigade Road, and Jayanagar shopping complex.",
          },
        ]}
        faqs={[
          {
            question: "Why is Bangalore gold rate higher than other cities?",
            answer:
              "Bangalore has high demand from IT professionals and premium jewellery stores, leading to slightly higher prices.",
          },
          {
            question: "Best jewellery shops in Bangalore?",
            answer:
              "Commercial Street and Brigade Road have numerous trusted jewellers with BIS hallmarked gold.",
          },
          {
            question: "Making charges in Bangalore?",
            answer:
              "Typically ₹180-₹450 per gram depending on the design intricacy and jeweller reputation.",
          },
        ]}
        similarCities={["Chennai", "Hyderabad", "Mysore", "Mangalore"]}
      />
    );
}

export const metadata = {
  title: "Bangalore Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Check today's Bangalore gold rate per 10 grams for 22K and 24K gold. Get real-time prices, making charges info, and top jewellery stores.",
};

