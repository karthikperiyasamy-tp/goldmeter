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

export default async function VijayawadaPage() {
  try {
    const data = await fetchRates();
    const vijayawadaRates = data.data?.cities?.Vijayawada;
    
    const gold22k = vijayawadaRates?.gold22k || 59400;
    const gold24k = vijayawadaRates?.gold24k || 64590;

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
        city="Vijayawada"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -3, gold24k: 8 }}
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
  } catch (error) {
    const gold22k = 59400;
    const gold24k = 64590;

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
        city="Vijayawada"
        updated={new Date().toLocaleDateString("en-IN")}
        gold22k={gold22k}
        gold24k={gold24k}
        gramPrices={gramPrices}
        todayVsYesterday={{ gold22k: -3, gold24k: 8 }}
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
}

export const metadata = {
  title: "Vijayawada Gold Rate Today - Live 22K & 24K Prices | GoldRate",
  description:
    "Today's Vijayawada gold rate for 22K and 24K gold per 10 grams. Check Governorpet prices, making charges, and trusted jewellers.",
};

