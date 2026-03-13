import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("calculatorTitle"),
    description: t("calculatorDescription"),
    alternates: {
      canonical: "https://goldmeter.in/calculator",
      languages: {
        en: "/calculator",
        hi: "/hi/calculator",
        ta: "/ta/calculator",
        te: "/te/calculator",
      },
    },
    keywords: [
      "gold calculator",
      "gold price calculator",
      "jewellery calculator india",
      "gold making charges calculator",
      "22k gold calculator",
      "24k gold calculator",
    ],
    openGraph: {
      title: t("calculatorTitle"),
      description: t("calculatorDescription"),
      type: "website",
      url: "https://goldmeter.in/calculator",
      siteName: "GoldMeter",
      locale: "en_IN",
      images: [
        {
          url: "https://goldmeter.in/og-image.png",
          width: 1200,
          height: 630,
          alt: "Gold Price Calculator - GoldMeter",
        },
      ],
    },
  };
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

