import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games: Play Gold Bar Stack | GoldMeter",
  description:
    "Play Gold Bar Stack on GoldMeter. Move falling 8g, 16g and other gold bars left or right, match and clear bars, and beat your high score.",
  alternates: {
    canonical: "https://goldmeter.in/games",
  },
  openGraph: {
    title: "Games: Gold Bar Stack | GoldMeter",
    description:
      "Move and match falling gold bars by weight. Simple, fast, and addictive gameplay for gold enthusiasts.",
    url: "https://goldmeter.in/games",
    type: "website",
    siteName: "GoldMeter",
    locale: "en_IN",
  },
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

