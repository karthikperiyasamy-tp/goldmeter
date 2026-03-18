import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Games: Play Gold Bar Stack | GoldMeter",
  description:
    "Play Gold Bar Stack on GoldMeter. Drop 8g, 16g and other gold bars into stacks, match and clear bars, and beat your high score.",
  alternates: {
    canonical: "https://goldmeter.in/gold-games",
  },
  openGraph: {
    title: "Gold Games: Gold Bar Stack | GoldMeter",
    description:
      "Stack and match gold bars by weight. Simple, fast, and addictive gameplay for gold enthusiasts.",
    url: "https://goldmeter.in/gold-games",
    type: "website",
    siteName: "GoldMeter",
    locale: "en_IN",
  },
};

export default function GoldGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

