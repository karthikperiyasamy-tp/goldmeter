import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Gold Portfolio Tracker — XIRR, P&L & Holdings | GoldMeter",
  description:
    "Track your gold investments for free with GoldMeter's portfolio tracker. Add buy/sell transactions, view XIRR returns, average price, current value, unrealized P&L, and sync across devices with Google.",
  alternates: {
    canonical: "https://goldmeter.in/portfolio",
  },
  keywords: [
    "gold portfolio tracker",
    "gold investment tracker",
    "gold tracker app india",
    "gold P&L calculator",
    "gold XIRR calculator",
    "track gold holdings",
    "gold buy sell tracker",
    "gold profit loss calculator",
    "gold investment portfolio india",
    "free gold tracker",
  ],
  openGraph: {
    title: "Free Gold Portfolio Tracker — XIRR & P&L | GoldMeter",
    description:
      "Track your gold investments for free — XIRR returns, P&L, holdings, and current value. Sync with Google to access from any device.",
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
    title: "Free Gold Portfolio Tracker — XIRR & P&L | GoldMeter",
    description:
      "Track your gold investments for free — XIRR returns, P&L, and current value.",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
