import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Market Pulse — Technical Indicators for India Gold | GoldMeter",
  description:
    "Live technical indicators for Indian gold: RSI, MACD, Bollinger Bands, Moving Averages, Momentum, Volatility, and a composite bullish/bearish score — computed daily from 24K gold prices.",
  alternates: {
    canonical: "https://goldmeter.in/gold-market-pulse",
  },
  keywords: [
    "gold market indicators",
    "gold RSI India",
    "gold MACD",
    "gold bollinger bands",
    "gold bullish bearish",
    "gold momentum India",
    "gold technical analysis India",
    "gold market pulse",
    "gold moving average",
    "gold volatility",
  ],
  openGraph: {
    title: "Gold Market Pulse — Technical Indicators | GoldMeter",
    description:
      "Composite bullish/bearish score, RSI, MACD, Bollinger Bands, and more — computed daily from India 24K gold prices.",
    type: "website",
    url: "https://goldmeter.in/gold-market-pulse",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Market Pulse — GoldMeter",
      },
    ],
  },
};

export default function GoldMarketPulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
