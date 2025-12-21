import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Gold Planner - Calculate Gold for Marriage | GoldMeter",
  description:
    "Plan gold jewellery for your wedding. Calculate total cost for bride & groom jewellery with making charges. Free wedding gold budget calculator.",
  alternates: {
    canonical: "https://goldmeter.in/wedding-gold-planner",
  },
  keywords: [
    "wedding gold planner",
    "wedding gold calculator",
    "marriage gold budget",
    "bridal jewellery calculator",
    "wedding jewellery cost",
    "gold for wedding india",
  ],
  openGraph: {
    title: "Wedding Gold Planner - Plan Your Marriage Jewellery | GoldMeter",
    description: "Plan gold jewellery for bride & groom with budget estimates. Calculate making charges & GST.",
    url: "https://goldmeter.in/wedding-gold-planner",
    siteName: "GoldMeter",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Gold Planner | GoldMeter",
    description: "Plan and budget gold jewellery for your wedding with accurate cost estimates.",
  },
};

export default function WeddingGoldPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

