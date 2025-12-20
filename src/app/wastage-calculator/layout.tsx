import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Wastage & Making Charges Calculator | GoldMeter",
  description:
    "Calculate gold jewellery wastage charges and making charges in India. Compare jeweller quotes and estimate total cost for ornaments.",
  alternates: {
    canonical: "https://goldmeter.in/wastage-calculator",
  },
  keywords: [
    "gold wastage calculator",
    "making charges calculator",
    "jewellery wastage india",
    "gold ornament cost calculator",
    "wastage charges gold",
  ],
};

export default function WastageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

