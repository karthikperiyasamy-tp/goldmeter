import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Loan Calculator - Check Loan Amount & EMI | GoldMeter",
  description:
    "Calculate gold loan eligibility based on your gold weight and purity. Check maximum loan amount, EMI, and interest rates from banks and NBFCs.",
  alternates: {
    canonical: "https://goldmeter.in/gold-loan-calculator",
  },
  keywords: [
    "gold loan calculator",
    "gold loan eligibility",
    "gold loan EMI calculator",
    "gold loan interest rate",
    "loan against gold calculator",
    "gold loan amount calculator",
  ],
  openGraph: {
    title: "Gold Loan Calculator - Check Eligibility & EMI | GoldMeter",
    description: "Calculate how much loan you can get against your gold jewellery. Check EMI and interest rates.",
    url: "https://goldmeter.in/gold-loan-calculator",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Loan Calculator | GoldMeter",
    description: "Check gold loan eligibility, EMI, and interest rates from banks and NBFCs.",
  },
};

export default function GoldLoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

