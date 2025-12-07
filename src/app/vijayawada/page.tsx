import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

export default async function VijayawadaPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Vijayawada", host);

  return (
    <CityPageShell
      city="Vijayawada"
      intro="Gold rate in Vijayawada today per gram: 22K & 24K live prices with Governorpet and Autonagar trends, charts, and FAQs."
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
              "Andhra Pradesh Hallmarking Center and Regional Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹160 – ₹400 per gram for 22K ornaments in Governorpet.",
          },
          {
            title: "Top jewellery hubs",
            description: "Governorpet, Besant Road, and Eluru Road jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Vijayawada gold rate similar to Hyderabad?",
            answer:
              "Yes, Vijayawada rates are typically within ₹10-₹20 of Hyderabad prices.",
          },
          {
            question: "Best jewellery shops in Vijayawada?",
            answer:
              "Governorpet area has established jewellers with BIS hallmarked gold and traditional Andhra designs.",
          },
          {
            question: "Making charges in Vijayawada?",
            answer:
              "Typically ₹160-₹400 per gram, lower than metro cities like Mumbai or Delhi.",
          },
        ]}
        similarCities={["Hyderabad", "Guntur", "Visakhapatnam", "Tirupati"]}
      />
    );
}

export const metadata = {
  title: "Vijayawada Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Today's Vijayawada gold rate for 22K and 24K gold per 10 grams. Check Governorpet prices, making charges, and trusted jewellers.",
};

// Disable caching for immediate updates
export const revalidate = 0;

