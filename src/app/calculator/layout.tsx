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
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

