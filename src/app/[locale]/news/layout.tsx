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
  openGraph: {
    title: "Gold News Today - Latest Headlines & Market Updates | GoldMeter",
    description: "Stay updated with the latest gold news, price movements, and market analysis. Daily gold rate headlines for Indian investors and jewellery buyers.",
    type: "website",
    url: "https://goldmeter.in/news",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold News & Market Updates - GoldMeter",
      },
    ],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

