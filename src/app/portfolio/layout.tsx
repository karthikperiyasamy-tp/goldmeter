import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Portfolio Tracker - Track Your Gold Investments | GoldMeter",
  description:
    "Track your gold investments with GoldMeter's free portfolio tracker. Add buy/sell transactions, view holdings, average price, current value and P&L. Sign in with Google to sync across devices.",
  alternates: {
    canonical: "https://goldmeter.in/portfolio",
  },
  keywords: [
    "gold portfolio tracker",
    "gold investment tracker",
    "track gold holdings",
    "gold buy sell tracker",
    "gold profit loss calculator",
    "gold investment portfolio india",
  ],
  openGraph: {
    title: "Gold Portfolio Tracker | GoldMeter",
    description:
      "Track your gold investments — holdings, P&L, and current value. Sync with Google to access from any device.",
    url: "https://goldmeter.in/portfolio",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Portfolio Tracker - GoldMeter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Portfolio Tracker | GoldMeter",
    description:
      "Track your gold investments — holdings, P&L, and current value.",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
