import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold News Today - Latest Headlines & Market Updates | GoldMeter",
  description:
    "Stay updated with the latest gold news, price movements, and market analysis. Daily gold rate headlines for Indian investors and jewellery buyers.",
  alternates: {
    canonical: "https://goldmeter.in/news",
  },
  keywords: [
    "gold news today",
    "gold price news india",
    "gold market news",
    "gold rate news",
    "gold price update",
  ],
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

