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
  openGraph: {
    title: "Gold Wastage & Making Charges Calculator | GoldMeter",
    description: "Calculate gold jewellery wastage charges and making charges in India. Compare jeweller quotes and estimate total cost for ornaments.",
    type: "website",
    url: "https://goldmeter.in/wastage-calculator",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Wastage & Making Charges Calculator - GoldMeter",
      },
    ],
  },
};

export default function WastageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

