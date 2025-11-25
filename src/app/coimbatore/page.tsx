import { headers } from "next/headers";
import CityPageShell from "../components/CityPageShell";

const grams = [
  { label: "1g", value: 1 },
  { label: "8g", value: 8 },
  { label: "10g", value: 10 },
  { label: "100g", value: 100 },
];

async function fetchRates() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/scrape-rates`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Unable to fetch rates");
  }

  return res.json();
}

export default async function CoimbatorePage() {
  try {
    const data = await fetchRates();
    const coimbatoreRates = data.data?.cities?.Coimbatore;
    
    const gold22k = coimbatoreRates?.gold22k || 59610;
    const gold24k = coimbatoreRates?.gold24k || 64810;

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
        city="Coimbatore"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
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
  } catch (error) {
    const gold22k = 59610;
    const gold24k = 64810;

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
        city="Coimbatore"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
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
}

export const metadata = {
  title: "Coimbatore Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Today's Coimbatore gold rate for 22K and 24K gold per 10 grams. Check RS Puram prices, making charges, and best jewellery shops.",
};

