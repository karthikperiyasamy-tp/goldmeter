import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Price Calculator - Calculate Gold Value with GST | GoldMeter",
  description:
    "Free gold price calculator for India. Calculate jewellery cost with making charges, GST (3%), and real-time gold rates for 22K & 24K.",
  alternates: {
    canonical: "https://goldmeter.in/calculator",
  },
  keywords: [
    "gold calculator",
    "gold price calculator",
    "jewellery calculator india",
    "gold making charges calculator",
    "22k gold calculator",
    "24k gold calculator",
  ],
  openGraph: {
    title: "Gold Price Calculator - Calculate Gold Value with GST | GoldMeter",
    description: "Free gold price calculator for India. Calculate jewellery cost with making charges, GST (3%), and real-time gold rates for 22K & 24K.",
    type: "website",
    url: "https://goldmeter.in/calculator",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Price Calculator - GoldMeter",
      },
    ],
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

