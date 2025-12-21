import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Purity Converter - 22K to 24K & Karat Calculator | GoldMeter",
  description:
    "Convert gold purity between 22K, 24K, 18K karats instantly. Free gold purity calculator for India with accurate conversion rates.",
  alternates: {
    canonical: "https://goldmeter.in/purity-converter",
  },
  keywords: [
    "gold purity converter",
    "22k to 24k converter",
    "karat calculator",
    "gold karat converter",
    "gold purity calculator india",
  ],
};

export default function PurityConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

