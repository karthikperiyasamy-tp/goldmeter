import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

const grams = [
  { label: "1g", value: 1 },
  { label: "8g", value: 8 },
  { label: "10g", value: 10 },
  { label: "100g", value: 100 },
];

export default async function ChennaiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  // Fetch rates from DB, scraping API, or fallback to mock
  const rates = await fetchCityRates("Chennai", host);
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
      city="Chennai"
      updated={rates.date}
      gold22k={gold22k}
      gold24k={gold24k}
      gramPrices={gramPrices}
      todayVsYesterday={{ gold22k: 45, gold24k: -30 }}
      localInfo={[
        {
          title: "Hallmarking centers",
          description:
            "Tamil Nadu Hallmarking Center (T Nagar) and Regional Assay Office (Egmore).",
        },
        {
          title: "Making charges",
          description: "₹150 – ₹450 per gram for 22K ornaments in T Nagar.",
        },
        {
          title: "Top jewellery hubs",
          description: "Usman Road, Pondy Bazaar, and Anna Nagar flagship stores.",
        },
      ]}
      faqs={[
        {
          question: "Why is Chennai gold rate high today?",
          answer:
            "Festive jewellery orders and a weaker rupee pushed spot prices up by ₹45 per 10g.",
        },
        {
          question: "Is Chennai gold rate different from Mumbai?",
          answer:
            "Yes, local demand, logistics, and making charges create a ₹40–₹60 spread vs Mumbai.",
        },
        {
          question: "What affects Chennai gold price daily?",
          answer:
            "London spot prices, USD/INR, MCX futures and local marriage season demand.",
        },
      ]}
      similarCities={["Trichy", "Coimbatore", "Madurai", "Hyderabad"]}
    />
  );
}

export const metadata = {
  title: "Chennai Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Get today's Chennai gold rate per 10 grams for 22K and 24K gold. Check T Nagar prices, making charges, and top jewellery shops.",
};

