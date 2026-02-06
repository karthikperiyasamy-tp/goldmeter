import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWP Calculator with Inflation - Systematic Withdrawal Plan Calculator | GoldMeter",
  description:
    "Free SWP Calculator with Inflation adjustment. Calculate systematic withdrawals from your mutual fund investments. Plan your retirement income with inflation-adjusted returns. Easy to use, no sign-up required.",
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
    "inflation adjusted swp",
    "free swp calculator india",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the ideal SWP withdrawal rate?", acceptedAnswer: { "@type": "Answer", text: "Financial experts recommend keeping your annual withdrawal rate between 4–6% of your total corpus. Combined with expected returns of 8–10%, this can help your corpus last 25–30 years or more." } },
    { "@type": "Question", name: "Is SWP taxable in India?", acceptedAnswer: { "@type": "Answer", text: "Only the capital gains portion of each SWP withdrawal is taxable. For equity funds held over 12 months, LTCG up to ₹1 lakh per year is tax-free; above that, 10% applies. SWP is typically more tax-efficient than FD interest." } },
    { "@type": "Question", name: "Can I change my SWP amount or stop it?", acceptedAnswer: { "@type": "Answer", text: "Yes. Most fund houses let you modify the SWP amount, frequency, or stop it entirely without penalty. This flexibility is a key advantage over annuities." } },
    { "@type": "Question", name: "Can the corpus run out?", acceptedAnswer: { "@type": "Answer", text: "Yes. If withdrawals are too high or returns are low, the corpus can deplete before your planned period. This calculator shows when depletion is likely so you can adjust." } },
    { "@type": "Question", name: "What return rate should I use in the SWP calculator?", acceptedAnswer: { "@type": "Answer", text: "Use a conservative assumption, often 1–2% lower than expected. For balanced or hybrid funds, 8–10% is common; for equity-heavy portfolios, 10–12%." } },
    { "@type": "Question", name: "Is SWP the same as dividends (IDCW)?", acceptedAnswer: { "@type": "Answer", text: "No. SWP is a planned redemption of units to get a fixed amount at intervals. IDCW is a distribution decided by the fund. SWP gives you control over amount and timing." } },
    { "@type": "Question", name: "Who should use an SWP calculator with inflation?", acceptedAnswer: { "@type": "Answer", text: "Retirees, senior citizens, and anyone planning regular income from a lump sum in mutual funds. Use the inflation-adjusted option for a more realistic plan." } },
  ],
};

export default function SWPCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
