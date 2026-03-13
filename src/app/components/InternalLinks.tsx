"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TOP_CITIES = [
  { slug: "chennai" },
  { slug: "mumbai" },
  { slug: "delhi" },
  { slug: "bangalore" },
  { slug: "hyderabad" },
  { slug: "kolkata" },
];

const CALCULATORS_KEYS = [
  { nameKey: "goldCalculator" as const, href: "/calculator", descKey: "getCostWithGST" as const },
  { nameKey: "wastageCalculator" as const, href: "/wastage-calculator", descKey: "makingWastageCharges" as const },
  { nameKey: "purityConverter" as const, href: "/purity-converter", descKey: "convert22k24k" as const },
  { nameKey: "investmentCalculator" as const, href: "/investment-calculator", descKey: "goldSIPReturns" as const },
  { nameKey: "goldLoanCalculator" as const, href: "/gold-loan-calculator", descKey: "loanAgainstGold" as const },
  { nameKey: "weddingPlanner" as const, href: "/wedding-gold-planner", descKey: "planWeddingGold" as const },
];

const ARTICLES = [
  { name: "Where Does Gold Come From?", href: "/articles/gold-origins" },
  { name: "What Makes Gold Special?", href: "/articles/gold-special" },
  { name: "Gold as Inflation Hedge", href: "/articles/gold-hedge" },
  { name: "Hallmarking in India", href: "/articles/gold-hallmarking" },
  { name: "Spot Prices & Premiums", href: "/articles/gold-premiums" },
];

type InternalLinksProps = {
  showCities?: boolean;
  showCalculators?: boolean;
  showArticles?: boolean;
  currentPath?: string;
};

export default function InternalLinks({
  showCities = true,
  showCalculators = true,
  showArticles = true,
  currentPath,
}: InternalLinksProps) {
  const t = useTranslations("internalLinks");
  const tTools = useTranslations("tools");

  return (
    <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft print:hidden">
      <h3 className="text-lg font-semibold text-charcoal">{t("exploreMore")}</h3>

      {showCities && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">{t("goldRateByCity")}</h4>
          <div className="flex flex-wrap gap-2">
            {TOP_CITIES.map((city) => {
              const href = `/gold-rate/${city.slug}`;
              if (href === currentPath) return null;
              return (
                <Link
                  key={city.slug}
                  href={href}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  {t("goldRateCityLabel", { city: city.slug.charAt(0).toUpperCase() + city.slug.slice(1) })}
                </Link>
              );
            })}
            <Link
              href="/gold-rate-today"
              className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition-colors"
            >
              {t("allIndiaRates")}
            </Link>
          </div>
        </div>
      )}

      {showCalculators && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">{t("goldCalculatorsTools")}</h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {CALCULATORS_KEYS.map((calc) => {
              if (calc.href === currentPath) return null;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs hover:border-amber-200 transition-colors"
                >
                  <span className="font-semibold text-charcoal">{tTools(calc.nameKey)}</span>
                  <span className="block text-slate-500 mt-0.5">{tTools(calc.descKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {showArticles && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">{t("goldEducation")}</h4>
          <div className="flex flex-wrap gap-2">
            {ARTICLES.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                {article.name}
              </Link>
            ))}
            <Link
              href="/articles"
              className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200 transition-colors"
            >
              {t("allArticles")}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
