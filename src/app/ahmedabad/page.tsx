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

export default async function AhmedabadPage() {
  try {
    const data = await fetchRates();
    const ahmedabadRates = data.data?.cities?.Ahmedabad;
    
    const gold22k = ahmedabadRates?.gold22k || 59380;
    const gold24k = ahmedabadRates?.gold24k || 64570;

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
        city="Ahmedabad"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -8, gold24k: 12 }}
        localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "BIS Gujarat Office and Manek Chowk Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹170 – ₹420 per gram for 22K ornaments in Manek Chowk.",
          },
          {
            title: "Top jewellery hubs",
            description: "Manek Chowk, Relief Road, and CG Road jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Ahmedabad gold rate lower than other cities?",
            answer:
              "Yes, Ahmedabad typically has competitive rates due to proximity to Surat diamond and gold market.",
          },
          {
            question: "Best gold market in Ahmedabad?",
            answer:
              "Manek Chowk is the premier gold market with numerous trusted jewellers and wholesale prices.",
          },
          {
            question: "Making charges in Ahmedabad?",
            answer:
              "Generally ₹170-₹420 per gram, with Gujarati designs often having moderate making charges.",
          },
        ]}
        similarCities={["Surat", "Rajkot", "Vadodara", "Gandhinagar"]}
      />
    );
  } catch (error) {
    const gold22k = 59380;
    const gold24k = 64570;

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
        city="Ahmedabad"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -8, gold24k: 12 }}
        localInfo={[
          {
            title: "Hallmarking centers",
            description:
              "BIS Gujarat Office and Manek Chowk Assay Centre.",
          },
          {
            title: "Making charges",
            description: "₹170 – ₹420 per gram for 22K ornaments in Manek Chowk.",
          },
          {
            title: "Top jewellery hubs",
            description: "Manek Chowk, Relief Road, and CG Road jewellery stores.",
          },
        ]}
        faqs={[
          {
            question: "Is Ahmedabad gold rate lower than other cities?",
            answer:
              "Ahmedabad typically has competitive rates due to proximity to Surat diamond and gold market.",
          },
          {
            question: "Best gold market in Ahmedabad?",
            answer:
              "Manek Chowk is the premier gold market with numerous trusted jewellers and wholesale prices.",
          },
          {
            question: "Making charges in Ahmedabad?",
            answer:
              "Generally ₹170-₹420 per gram, with Gujarati designs often having moderate making charges.",
          },
        ]}
        similarCities={["Surat", "Rajkot", "Vadodara", "Gandhinagar"]}
      />
    );
  }
}

export const metadata = {
  title: "Ahmedabad Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Check Ahmedabad gold rate today for 22K and 24K gold per 10 grams. Get Manek Chowk prices, making charges, and best jewellers.",
};

