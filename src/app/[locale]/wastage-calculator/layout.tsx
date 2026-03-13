import type { Metadata } from "next";

export const metadata: Metadata = {
  // Optimized for "what is wastage in gold" search query (250 searches/month)
  title: "What is Wastage in Gold? Calculator & Guide | GoldMeter",
  description:
    "What is wastage in gold jewellery? Wastage (6-12%) is gold lost during making. Use our free calculator to estimate wastage charges, making charges & total cost.",
  alternates: {
    canonical: "https://goldmeter.in/wastage-calculator",
  },
  keywords: [
    "what is wastage in gold",
    "gold wastage calculator",
    "wastage charges in gold jewellery",
    "making charges calculator",
    "gold wastage meaning",
    "jewellery wastage india",
  ],
  openGraph: {
    title: "What is Wastage in Gold Jewellery? Free Calculator | GoldMeter",
    description: "Learn what wastage means in gold jewellery (6-12% of gold lost during making). Calculate wastage charges, making charges & total ornament cost.",
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

