import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import TradingViewGoldChart from "@/app/components/TradingViewGoldChart";

type PageProps = { params: Promise<{ locale: string }> };

function absolutePageUrl(locale: string, path: string) {
  const base = "https://goldmeter.in";
  if (locale === "en") return `${base}${path}`;
  return `${base}/${locale}${path}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const keywords = t("worldGoldPriceKeywords")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const pageUrl = absolutePageUrl(locale, "/world-gold-price");

  return {
    title: t("worldGoldPriceTitle"),
    description: t("worldGoldPriceDescription"),
    keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: "/world-gold-price",
        hi: "/hi/world-gold-price",
        ta: "/ta/world-gold-price",
        te: "/te/world-gold-price",
      },
    },
    openGraph: {
      title: t("worldGoldPriceOgTitle"),
      description: t("worldGoldPriceOgDescription"),
      url: pageUrl,
      siteName: "GoldMeter",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://goldmeter.in/og-image.png",
          width: 1200,
          height: 630,
          alt: t("worldGoldPriceOgTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("worldGoldPriceOgTitle"),
      description: t("worldGoldPriceOgDescription"),
      images: ["https://goldmeter.in/og-image.png"],
    },
  };
}

export default async function WorldGoldPricePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "worldGoldPrice" });
  const tm = await getTranslations({ locale, namespace: "meta" });

  const pageUrl = absolutePageUrl(locale, "/world-gold-price");
  const homeUrl = absolutePageUrl(locale, "/");

  const structuredJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: tm("worldGoldPriceOgTitle"),
        description: tm("worldGoldPriceOgDescription"),
        inLanguage: locale,
        isPartOf: { "@id": "https://goldmeter.in/#website" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("breadcrumbHome"),
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("breadcrumbCurrent"),
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is XAU/USD?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "XAU is the standard code for one troy ounce of gold and USD is the US dollar. XAU/USD is the global benchmark quote for how many US dollars one ounce of gold costs.",
            },
          },
          {
            "@type": "Question",
            name: "Why is India’s gold price different from the world chart?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Indian retail gold is quoted in rupees per gram (often 22K or 24K) and includes USD-INR conversion, import duty, GST, logistics, and jeweller margins. The world chart is dollar per ounce for wholesale-style benchmarks.",
            },
          },
          {
            "@type": "Question",
            name: "Where does the live world gold price come from?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Global gold prices emerge from continuous trading among banks, refiners, investors, and platforms linked to major OTC and futures markets (such as London and COMEX). No single shop sets the world price.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-16 pt-8">
      <div className="mx-auto max-w-5xl px-4">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-amber-600">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium text-charcoal">{t("breadcrumbCurrent")}</span>
        </nav>

        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-amber-600"
        >
          {t("backHome")}
        </Link>

        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">{t("badge")}</p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal md:text-4xl">{t("title")}</h1>
          <p className="mt-2 text-slate-600">{t("subtitle")}</p>
        </header>

        <p className="mb-6 text-sm leading-relaxed text-slate-700">
          {t("intro")}{" "}
          <Link href="/gold-rate-today" className="font-semibold text-amber-700 underline hover:text-amber-800">
            {t("goldRateTodayLink")}
          </Link>{" "}
          {t("introSuffix")}
        </p>

        <TradingViewGoldChart height={540} />

        <p className="mt-4 text-xs text-slate-500">{t("chartNote")}</p>

        <p className="mt-2 text-center text-xs text-slate-400">
          <a
            href="https://www.tradingview.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600"
          >
            {t("attribution")}
          </a>
        </p>

        {/* Educational content */}
        <article className="prose prose-slate prose-headings:font-bold prose-headings:text-charcoal prose-p:text-slate-700 prose-li:text-slate-700 mt-14 max-w-none border-t border-slate-200 pt-12 text-sm leading-relaxed">
          <h2 className="text-xl md:text-2xl">{t("eduTitle")}</h2>
          <p>{t("eduIntro")}</p>

          <h3 className="mt-8 text-lg text-charcoal">{t("whatIsXauTitle")}</h3>
          <p>{t("whatIsXauP1")}</p>
          <p>{t("whatIsXauP2")}</p>

          <h3 className="mt-8 text-lg text-charcoal">{t("benchmarkTitle")}</h3>
          <p>{t("benchmarkP1")}</p>
          <ul className="list-disc pl-5">
            <li>{t("benchmarkLi1")}</li>
            <li>{t("benchmarkLi2")}</li>
            <li>{t("benchmarkLi3")}</li>
          </ul>
          <p>{t("benchmarkP2")}</p>

          <h3 className="mt-8 text-lg text-charcoal">{t("indiaGapTitle")}</h3>
          <p>{t("indiaGapP1")}</p>
          <p>{t("indiaGapP2")}</p>
          <p>
            <Link href="/about/methodology" className="font-semibold text-amber-700 no-underline hover:underline">
              {t("methodologyLink")}
            </Link>
          </p>

          <h3 className="mt-8 text-lg text-charcoal">{t("readChartTitle")}</h3>
          <p>{t("readChartP1")}</p>
          <p>{t("readChartP2")}</p>

          <h3 className="mt-8 text-lg text-charcoal">{t("driversTitle")}</h3>
          <ul className="list-disc pl-5">
            <li>{t("driversLi1")}</li>
            <li>{t("driversLi2")}</li>
            <li>{t("driversLi3")}</li>
            <li>{t("driversLi4")}</li>
          </ul>
          <p>{t("driversP2")}</p>

          <h3 className="mt-8 text-lg text-charcoal">{t("practicalTitle")}</h3>
          <p>{t("practicalP1")}</p>
          <p>{t("practicalP2")}</p>
        </article>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-charcoal">{t("learnMoreTitle")}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-amber-800 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li>
              <Link href="/gold-rate-today" className="font-medium underline hover:text-amber-950">
                {t("goldRateTodayLink")}
              </Link>
            </li>
            <li>
              <Link href="/gold-market-pulse" className="font-medium underline hover:text-amber-950">
                {t("learnMarketPulse")}
              </Link>
            </li>
            <li>
              <Link href="/articles" className="font-medium underline hover:text-amber-950">
                {t("learnArticles")}
              </Link>
            </li>
            <li>
              <Link href="/about/methodology" className="font-medium underline hover:text-amber-950">
                {t("methodologyLink")}
              </Link>
            </li>
          </ul>
        </div>

        <section className="mt-10 rounded-2xl border border-amber-100 bg-amber-50/80 p-5">
          <h2 className="text-sm font-semibold text-amber-900">{t("disclaimerTitle")}</h2>
          <p className="mt-2 text-xs leading-relaxed text-amber-950/90">{t("disclaimerBody")}</p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredJsonLd) }}
      />
    </main>
  );
}
