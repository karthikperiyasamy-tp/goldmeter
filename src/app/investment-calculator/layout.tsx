import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Investment Calculator - SIP Returns Calculator | GoldMeter",
  description:
    "Calculate gold SIP returns and plan your monthly gold investment. See potential wealth accumulation over 5, 10, 20 years with our free gold investment calculator.",
  alternates: {
    canonical: "https://goldmeter.in/investment-calculator",
  },
  keywords: [
    "gold investment calculator",
    "gold SIP calculator",
    "gold returns calculator",
    "invest in gold india",
    "gold investment returns",
    "digital gold calculator",
  ],
  openGraph: {
    title: "Gold Investment Calculator - Plan Your Gold SIP | GoldMeter",
    description: "Calculate gold SIP returns and see potential wealth accumulation over 5, 10, 20 years.",
    url: "https://goldmeter.in/investment-calculator",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold Investment Calculator - GoldMeter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Investment Calculator | GoldMeter",
    description: "Plan your monthly gold investment and see potential returns over time.",
  },
};

export default function InvestmentCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

