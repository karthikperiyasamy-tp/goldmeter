import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Gold Jewellers in India - Making Charges & Reviews | GoldMeter",
  description:
    "Compare 20+ popular gold jewellers in India. Find making charges, exchange policies, and trusted reviews for Tanishq, Kalyan, Malabar, GRT & more.",
  alternates: {
    canonical: "https://goldmeter.in/jewellers",
  },
  openGraph: {
    title: "Top Gold Jewellers in India - Compare Making Charges",
    description:
      "Directory of India's best jewellers with making charges comparison, exchange policies, and buyer guide.",
    type: "website",
    url: "https://goldmeter.in/jewellers",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Jewellers in India - GoldMeter",
      },
    ],
  },
  keywords: [
    "gold jewellers india",
    "tanishq making charges",
    "kalyan jewellers making charges",
    "malabar gold making charges",
    "best jewellers india",
    "gold jewellery shops",
    "jewellers near me",
  ],
};

export default function JewellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
