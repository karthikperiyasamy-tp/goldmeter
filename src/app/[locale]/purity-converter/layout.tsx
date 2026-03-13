import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Purity Converter - 22K to 24K & Karat Calculator | GoldMeter",
  description:
    "Convert gold purity between 22K, 24K, 18K karats instantly. Free gold purity calculator for India with accurate conversion rates. Calculate pure gold content, alloy percentage, and weight in grams or tola.",
  alternates: {
    canonical: "https://goldmeter.in/purity-converter",
  },
  keywords: [
    "gold purity converter",
    "22k to 24k converter",
    "karat calculator",
    "gold karat converter",
    "gold purity calculator india",
    "gold alloy calculator",
    "tola to gram converter",
    "24k gold calculator",
    "gold weight converter",
    "pure gold content calculator",
  ],
  openGraph: {
    title: "Gold Purity Converter - 22K to 24K & Karat Calculator | GoldMeter",
    description: "Convert gold purity between 22K, 24K, 18K karats instantly. Free gold purity calculator for India with accurate conversion rates. Calculate pure gold content, alloy percentage, and weight in grams or tola.",
    type: "website",
    url: "https://goldmeter.in/purity-converter",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Purity Converter - GoldMeter",
      },
    ],
  },
};

export default function PurityConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

