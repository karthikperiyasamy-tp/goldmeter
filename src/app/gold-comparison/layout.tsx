import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Rate Comparison: 22K vs 24K vs 18K | Mumbai vs Chennai vs Delhi | GoldMeter",
  description: "Compare gold rates across Indian cities and purities. See 22K, 24K, 18K gold price differences, investment options comparison, and city-wise rate analysis. Updated daily.",
  alternates: {
    canonical: "https://goldmeter.in/gold-comparison",
  },
  openGraph: {
    title: "Gold Rate Comparison Across India - City & Purity Comparison",
    description: "Compare 22K vs 24K vs 18K gold rates and city-wise prices across India",
    url: "https://goldmeter.in/gold-comparison",
    type: "website",
  },
};

export default function GoldComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
