"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const mainLinks = [
    { label: t("goldRateToday"), href: "/gold-rate-today" },
    { label: t("articlesGuides"), href: "/articles" },
    { label: t("jewellersDirectory"), href: "/jewellers" },
    { label: t("silverRate"), href: "/silver-rate" },
    { label: t("goldCalculator"), href: "/calculator" },
    { label: t("goldPortfolio"), href: "/portfolio" },
    { label: t("news"), href: "/news" },
  ];

  const footerLinks = [
    { label: t("aboutUs"), href: "/about" },
    { label: t("contactUs"), href: "/contact" },
    { label: t("methodology"), href: "/about/methodology" },
    { label: t("privacyPolicy"), href: "/privacy" },
    { label: t("termsOfService"), href: "/terms" },
    { label: t("disclaimer"), href: "/disclaimer" },
  ];

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            {t("lookingForBenchmark")}{" "}
            <Link href="/gold-rate-today" className="font-semibold underline hover:text-amber-700">
              {t("goldRateTodayIndia")}
            </Link>
            {" "}{t("withLivePrices")}
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-emerald-900">{t("trustedDataSources")}</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {t("trustedDataSourcesDesc")}
                {" "}<Link href="/about/methodology" className="text-emerald-700 underline font-medium">{t("learnMethodology")}</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-charcoal">GoldMeter</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">{t("quickLinks")}</p>
            <nav className="flex flex-col gap-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-amber-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">{t("goldCalculators")}</p>
            <nav className="flex flex-col gap-2">
              <Link href="/calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("goldPriceCalculator")}
              </Link>
              <Link href="/wastage-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("wastageCalculator")}
              </Link>
              <Link href="/purity-converter" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("purityConverter")}
              </Link>
              <Link href="/investment-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("goldInvestmentCalculator")}
              </Link>
              <Link href="/gold-comparison" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("goldComparison")}
              </Link>
            </nav>
            <p className="text-sm font-semibold text-charcoal mb-3 mt-4">{t("financialCalculators")}</p>
            <nav className="flex flex-col gap-2">
              <Link href="/sip-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("sipCalculator")}
              </Link>
              <Link href="/sip-calculator-with-step-up" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("sipWithStepUp")}
              </Link>
              <Link href="/swp-calculator-with-inflation" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("swpWithInflation")}
              </Link>
              <Link href="/gold-loan-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("goldLoanCalculator")}
              </Link>
              <Link href="/wedding-gold-planner" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                {t("weddingGoldPlanner")}
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">{t("legalInfo")}</p>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-500 hover:text-amber-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 py-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-slate-500">
            <p>
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              {t("ratesUpdated")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

