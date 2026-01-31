import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWP Calculator with Inflation - Systematic Withdrawal Plan Calculator | GoldMeter",
  description:
    "Free SWP Calculator with Inflation adjustment. Calculate systematic withdrawals from your mutual fund investments. Plan your retirement income with inflation-adjusted returns.",
  alternates: {
    canonical: "https://goldmeter.in/swp-calculator-with-inflation",
  },
  keywords: [
    "swp calculator with inflation",
    "swp calculator",
    "systematic withdrawal plan calculator",
    "swp return calculator",
    "mutual fund swp calculator",
    "retirement withdrawal calculator",
    "swp inflation calculator",
  ],
  openGraph: {
    title: "SWP Calculator with Inflation - Withdrawal Plan Calculator | GoldMeter",
    description:
      "Free SWP Calculator with Inflation adjustment. Calculate systematic withdrawals and plan your retirement income.",
    url: "https://goldmeter.in/swp-calculator-with-inflation",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "SWP Calculator with Inflation - GoldMeter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SWP Calculator with Inflation | GoldMeter",
    description:
      "Calculate systematic withdrawals with inflation adjustment. Plan your retirement income from mutual funds.",
  },
};

export default function SWPCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
