import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Gold Market Recaps - AI Summary of Gold News | GoldMeter",
  description:
    "Daily AI-generated summaries of gold market news. Get quick insights on price movements, market trends, and expert opinions.",
  alternates: {
    canonical: "https://goldmeter.in/news/recap",
  },
  keywords: [
    "gold market recap",
    "daily gold summary",
    "gold price analysis",
    "gold market news summary",
  ],
};

export default function RecapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

