import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Articles & Guides — GoldMeter",
  description:
    "Read in-depth articles on gold investing, buying tips, hallmarking, spot prices, and more. Expert guides to help you make smarter gold decisions in India.",
  alternates: { canonical: "/articles" },
  keywords: [
    "gold articles",
    "gold investment guide",
    "gold buying tips india",
    "gold hallmarking",
    "gold spot price",
    "22k vs 24k gold",
    "gold education",
    "gold facts",
  ],
  openGraph: {
    title: "Gold Articles & Guides — GoldMeter",
    description:
      "Expert articles on gold investing, buying tips, hallmarking, and more for Indian gold buyers.",
    url: "https://goldmeter.in/articles",
    siteName: "GoldMeter",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Articles & Guides — GoldMeter",
    description:
      "Expert articles on gold investing, buying tips, hallmarking, and more.",
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
