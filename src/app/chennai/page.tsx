import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

export default async function ChennaiPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  // Fetch rates from DB, scraping API, or fallback to mock
  const rates = await fetchCityRates("Chennai", host);

  return (
    <CityPageShell
      city="Chennai"
      intro="Gold rate in Chennai today per gram: 22K & 24K live prices with T Nagar and Anna Nagar trends, charts, and FAQs."
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

// Disable caching for immediate updates
export const revalidate = 0;

