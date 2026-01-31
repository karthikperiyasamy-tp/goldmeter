import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator with Step Up - Calculate Step Up SIP Returns | GoldMeter",
  description:
    "Free SIP Calculator with Step Up feature. Calculate returns with yearly SIP increase. Compare regular SIP, step-up SIP, and lumpsum investments.",
  alternates: {
    canonical: "https://goldmeter.in/sip-calculator-with-step-up",
  },
  keywords: [
    "sip calculator with step up",
    "step up sip calculator",
    "top up sip calculator",
    "sip step up calculator",
    "increasing sip calculator",
    "yearly increase sip calculator",
    "sip vs lumpsum calculator",
  ],
  openGraph: {
    title: "SIP Calculator with Step Up - Step Up SIP Returns | GoldMeter",
    description:
      "Free SIP Calculator with Step Up feature. Calculate returns with yearly SIP increase and compare with lumpsum.",
    url: "https://goldmeter.in/sip-calculator-with-step-up",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIP Calculator with Step Up - GoldMeter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator with Step Up | GoldMeter",
    description:
      "Calculate step-up SIP returns with yearly increase and compare with regular SIP and lumpsum investments.",
  },
};

export default function StepUpSIPCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
