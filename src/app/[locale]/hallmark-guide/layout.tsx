import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hallmark Verification Guide - Check Gold Purity & HUID | GoldMeter",
  description:
    "Verify gold hallmark authenticity in India. Decode HUID, check purity (916, 750, 585), find BIS registered jewellers, and learn to spot fake hallmarks.",
  alternates: {
    canonical: "https://goldmeter.in/hallmark-guide",
  },
  keywords: [
    "hallmark verification",
    "HUID check",
    "BIS hallmark",
    "gold purity check",
    "916 hallmark meaning",
    "750 gold purity",
    "BIS registered jewellers",
    "fake hallmark",
    "gold authenticity",
    "hallmark decoder",
  ],
  openGraph: {
    title: "Hallmark Verification Guide - Check Gold Purity & HUID | GoldMeter",
    description:
      "Verify gold hallmark authenticity in India. Decode HUID, check purity (916, 750, 585), find BIS registered jewellers, and learn to spot fake hallmarks.",
    type: "website",
    url: "https://goldmeter.in/hallmark-guide",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hallmark Verification Guide - GoldMeter",
      },
    ],
  },
};

export default function HallmarkGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
