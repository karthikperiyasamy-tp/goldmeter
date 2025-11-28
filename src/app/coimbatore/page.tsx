import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";

export default async function CoimbatorePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  const rates = await fetchCityRates("Coimbatore", host);

  return (
    <CityPageShell
      city="Coimbatore"
      updated={rates.date}
      gold22k={rates.gold22k}
      gold24k={rates.gold24k}
      todayVsYesterday={{ gold22k: 25, gold24k: 28 }}
        localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "Tamil Nadu Hallmarking Center (Coimbatore Branch) and Regional Office.",
          },
          {
            title: "Making charges",
            description: "₹140 – ₹400 per gram for 22K ornaments in RS Puram.",
          },
          {
            title: "Top jewellery hubs",
            description: "RS Puram, Oppanakara Street, and Gandhipuram markets.",
          },
        ]}
        faqs={[
          {
            question: "Is Coimbatore gold rate different from Chennai?",
            answer:
              "Coimbatore rates are usually ₹20-₹40 lower than Chennai due to lower demand and local competition.",
          },
          {
            question: "Best place to buy gold in Coimbatore?",
            answer:
              "RS Puram and Oppanakara Street are traditional jewellery hubs with competitive prices.",
          },
          {
            question: "Making charges in Coimbatore?",
            answer:
              "Generally ₹140-₹400 per gram, often lower than metro cities.",
          },
        ]}
        similarCities={["Chennai", "Madurai", "Salem", "Erode"]}
      />
    );
}

export const metadata = {
  title: "Coimbatore Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Today's Coimbatore gold rate for 22K and 24K gold per 10 grams. Check RS Puram prices, making charges, and best jewellery shops.",
};

// Cache this page for 5 minutes (300 seconds)
export const revalidate = 300;

