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

export default async function PunePage() {
  try {
    const data = await fetchRates();
    const puneRates = data.data?.cities?.Pune;
    
    const gold22k = puneRates?.gold22k || 59420;
    const gold24k = puneRates?.gold24k || 64610;

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
        city="Pune"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -5, gold24k: 10 }}
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
  } catch (error) {
    const gold22k = 59420;
    const gold24k = 64610;

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
        city="Pune"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -5, gold24k: 10 }}
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
}

export const metadata = {
  title: "Pune Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Check Pune gold rate today for 22K and 24K gold per 10 grams. Get Laxmi Road prices, making charges, and trusted jewellers list.",
};

