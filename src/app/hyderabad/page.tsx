import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

const grams = [
  { label: "1g", value: 1 },
  { label: "8g", value: 8 },
  { label: "10g", value: 10 },
  { label: "100g", value: 100 },
];

export default async function HyderabadPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Hyderabad", host);
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
        city="Hyderabad"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -5, gold24k: 10 }}
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

export const metadata = {
  title: "Hyderabad Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Check today's Hyderabad gold rate per 10 grams for 22K and 24K gold. Get Abids and Sultan Bazaar prices, making charges info.",
};

// Cache this page for 5 minutes (300 seconds)
export const revalidate = 300;
