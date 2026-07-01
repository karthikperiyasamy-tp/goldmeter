import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import SilverCityPageShell from "@/app/components/SilverCityPageShell";
import { fetchCityRates } from "@/lib/fetchCityRates";
import { getLatestGoldRates, getHistoricalGoldRates } from "@/lib/goldRatesDB";
import { getSilverConfig, generateSilverFAQs } from "@/lib/citySilverConfig";
import { getSilverSections } from "@/lib/citySilverSections";
import { getSilverExtra } from "@/lib/citySilverExtra";
import { getSilverTitles } from "@/lib/citySilverTitles";
import { SILVER_RATE_CITIES } from "@/lib/cities";
import { routing } from "@/i18n/routing";

type HistoryEntry = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg: number | null;
  timestamp: number;
};

// Deduplicate history by date, keeping the latest entry per date
function dedupeHistory(history: HistoryEntry[]) {
  const byDate = new Map<string, HistoryEntry>();
  for (const entry of history) {
    byDate.set(entry.date, entry); // later entries overwrite earlier ones
  }
  return Array.from(byDate.values()).sort((a, b) => a.timestamp - b.timestamp);
}

function resolveSilverCity(slug: string): string | null {
  const lower = slug.toLowerCase();
  const match = SILVER_RATE_CITIES.find((c) => c.toLowerCase() === lower);
  return match ?? null;
}

type Props = {
  params: Promise<{ locale: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  const cityName = resolveSilverCity(city);
  if (!cityName) {
    return { title: "City Not Found | GoldMeter" };
  }
  const t = await getTranslations({ locale, namespace: "meta" });

  const rates = await fetchCityRates(cityName);
  const silver1kg = rates.silver1kg || 0;
  const pricePerGram = Math.round(silver1kg / 1000);
  const pricePerKg = silver1kg;

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    title: t("silverCityTitle", { city: cityName, date: todayFormatted }),
    description: t("silverCityDescription", {
      city: cityName,
      pricePerGram: pricePerGram.toLocaleString("en-IN"),
      pricePerKg: pricePerKg.toLocaleString("en-IN"),
    }),
    alternates: {
      canonical: `https://goldmeter.in/silver-rate/${city.toLowerCase()}`,
      languages: {
        en: `/silver-rate/${city.toLowerCase()}`,
        hi: `/hi/silver-rate/${city.toLowerCase()}`,
        ta: `/ta/silver-rate/${city.toLowerCase()}`,
        te: `/te/silver-rate/${city.toLowerCase()}`,
      },
    },
    openGraph: {
      title: t("silverCityTitle", { city: cityName, date: todayFormatted }),
      description: t("silverCityDescription", {
        city: cityName,
        pricePerGram: pricePerGram.toLocaleString("en-IN"),
        pricePerKg: pricePerKg.toLocaleString("en-IN"),
      }),
      type: "website",
      url: `https://goldmeter.in/silver-rate/${city.toLowerCase()}`,
      siteName: "GoldMeter",
      locale: "en_IN",
      images: [
        {
          url: "https://goldmeter.in/og-image.png",
          width: 1200,
          height: 630,
          alt: `Silver Rate in ${cityName} Today - GoldMeter`,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SILVER_RATE_CITIES.map((city) => ({
      locale,
      city: city.toLowerCase(),
    }))
  );
}

/** Only pre-rendered city slugs — unknown paths (e.g. /silver-rate/bilaspur) 404 instead of 500 */
export const dynamicParams = false;

export default async function SilverCityPage({ params }: Props) {
  const { city } = await params;

  const cityName = resolveSilverCity(city);
  if (!cityName) {
    notFound();
  }

  const rates = await fetchCityRates(cityName);
  const history = dedupeHistory(rates.history || []);

  // Fallbacks when silver is missing for the city snapshot
  let silver1kg = rates.silver1kg || 0;
  let priceChange = rates.priceChange.silver1kg || 0;
  let updatedDate = rates.date;
  let outputHistory = history;

  // 1) Try city history last non-zero
  if (!silver1kg && history.length > 0) {
    const withSilver = history.filter((h) => !!h.silver1kg && h.silver1kg > 0);
    const last = withSilver.at(-1);
    const prev = withSilver.length > 1 ? withSilver.at(-2) : undefined;
    if (last?.silver1kg) {
      silver1kg = last.silver1kg;
      priceChange = last.silver1kg - (prev?.silver1kg || 0);
      updatedDate = last.date;
    }
  }

  // 2) If still missing, fall back to India latest + history
  if (!silver1kg) {
    const indiaData = await getLatestGoldRates();
    const indiaSilver = indiaData?.india?.silver1kg || 0;
    if (indiaSilver) {
      const indiaYesterday = indiaData?.yesterdayIndia?.silver1kg || 0;
      silver1kg = indiaSilver;
      priceChange = indiaSilver - indiaYesterday;
      updatedDate = indiaData?.india?.date || updatedDate;
    }

    if (!outputHistory.length) {
      const indiaHistory = dedupeHistory(await getHistoricalGoldRates("India", 30));
      if (indiaHistory.length) {
        outputHistory = indiaHistory;
      }
    }
  }

  const silverConfig = getSilverConfig(cityName);
  const silverSections = getSilverSections(cityName);
  const silverExtra = getSilverExtra(cityName);
  const silverTitles = getSilverTitles(cityName);
  const perGramSilver = silver1kg / 1000;
  const generatedFaqs = silverConfig
    ? generateSilverFAQs(silverConfig, silver1kg, perGramSilver)
    : [];

  return (
    <SilverCityPageShell
      city={cityName}
      intro={`Silver rate in ${cityName} today per gram and per kg with charts and 30-day history. Compare with gold tools below.`}
      updated={updatedDate}
      silver1kg={silver1kg}
      priceChange={priceChange}
      history={outputHistory}
      localInfo={silverConfig?.localInfo ?? [
        {
          title: "Local Silver Market",
          description:
            `Check local silver bullion dealers in ${cityName} for spot prices.`,
        },
        {
          title: "Silver Purity",
          description:
            "Standard silver rates are usually for 99.9% purity (Fine Silver).",
        },
      ]}
      faqs={generatedFaqs.length > 0 ? generatedFaqs : [
        {
          question: `What is today's silver rate in ${cityName}?`,
          answer:
            `The silver rate in ${cityName} today is ₹${rates.silver1kg.toLocaleString('en-IN')} per kg.`,
        },
        {
          question: `Is silver price same across all cities?`,
          answer:
            "No, silver prices vary slightly by city due to local taxes and transportation costs.",
        },
      ]}
      similarCities={[...SILVER_RATE_CITIES].filter((c) => c !== cityName).slice(0, 5)}
      silverConfig={silverConfig}
      silverSections={silverSections}
      silverExtra={silverExtra}
      silverTitles={silverTitles}
      generatedFaqs={generatedFaqs}
    />
  );
}

// Metadata is defined in layout.tsx for this route
// Removed duplicate generateMetadata to prevent canonical/title conflicts

// Tag-driven freshness via /api/revalidate-gold-rates; 6h safety net since GitHub Actions
// busts the 'gold-rates' tag after each scrape (this is the source of truth for freshness).
export const revalidate = 86400;

