import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

export default async function PunePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Pune", host);

  return (
    <CityPageShell
      city="Pune"
      updated={rates.date}
      gold22k={rates.gold22k}
      gold24k={rates.gold24k}
      priceChange={rates.priceChange}
      history={rates.history}
      localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "BIS Hallmarking Center (Pune) and Maharashtra Assay Office.",
          },
          {
            title: "Making charges",
            description: "₹190 – ₹480 per gram for 22K ornaments in Laxmi Road.",
          },
          {
            title: "Top jewellery hubs",
            description: "Laxmi Road, FC Road, and Deccan Gymkhana jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Pune gold rate same as Mumbai?",
            answer:
              "Pune rates are typically ₹10-₹20 lower than Mumbai due to lower demand and logistics costs.",
          },
          {
            question: "Best time to buy gold in Pune?",
            answer:
              "Gudi Padwa, Akshaya Tritiya, and Diwali offer good buying opportunities with festive discounts.",
          },
          {
            question: "Trusted jewellers in Pune?",
            answer:
              "Laxmi Road has established jewellers with BIS hallmarked gold and competitive making charges.",
          },
        ]}
        similarCities={["Mumbai", "Nashik", "Aurangabad", "Kolhapur"]}
      />
    );
}

export const metadata = {
  title: "Pune Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Check Pune gold rate today for 22K and 24K gold per 10 grams. Get Laxmi Road prices, making charges, and trusted jewellers list.",
};

// Disable caching for immediate updates
export const revalidate = 0;

