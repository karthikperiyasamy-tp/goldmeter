import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator - Calculate Mutual Fund SIP Returns Online | GoldMeter",
  description:
    "Free SIP Calculator to estimate returns on your Systematic Investment Plan. Calculate how much wealth you can create with monthly SIP investments in mutual funds.",
  alternates: {
    canonical: "https://goldmeter.in/sip-calculator",
  },
  keywords: [
    "sip calculator",
    "sip return calculator",
    "mutual fund sip calculator",
    "systematic investment plan calculator",
    "sip investment calculator",
    "monthly sip calculator",
    "sip maturity calculator",
  ],
  openGraph: {
    title: "SIP Calculator - Calculate Mutual Fund SIP Returns | GoldMeter",
    description:
      "Free SIP Calculator to estimate returns on your Systematic Investment Plan. Calculate wealth creation with monthly SIP investments.",
    url: "https://goldmeter.in/sip-calculator",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIP Calculator - GoldMeter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator | GoldMeter",
    description:
      "Calculate SIP returns and plan your mutual fund investments with our free SIP calculator.",
  },
};

export default function SIPCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
