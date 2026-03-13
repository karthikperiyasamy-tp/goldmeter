"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type Calculator = {
  nameKey: string;
  href: string;
  icon: string;
  descKey: string;
};

type CalculatorCategory = {
  nameKey: string;
  icon: string;
  calculators: Calculator[];
};

const calculatorCategories: CalculatorCategory[] = [
  {
    nameKey: "goldCalculators",
    icon: "📊",
    calculators: [
      { nameKey: "priceCalculator", href: "/calculator", icon: "🧮", descKey: "getCostWithGST" },
      { nameKey: "wastageTool", href: "/wastage-calculator", icon: "💎", descKey: "makingWastageCharges" },
      { nameKey: "purityConverter", href: "/purity-converter", icon: "⚖️", descKey: "convert22k24k" },
      { nameKey: "hallmarkVerifier", href: "/hallmark-guide", icon: "🔍", descKey: "checkGoldPurity" },
      { nameKey: "investmentCalculator", href: "/investment-calculator", icon: "📈", descKey: "goldSIPReturns" },
    ],
  },
  {
    nameKey: "financialCalculators",
    icon: "💰",
    calculators: [
      { nameKey: "sipCalculator", href: "/sip-calculator", icon: "📊", descKey: "calculateSIPReturns" },
      { nameKey: "sipWithStepUp", href: "/sip-calculator-with-step-up", icon: "📈", descKey: "sipWithYearlyIncrease" },
      { nameKey: "swpWithInflation", href: "/swp-calculator-with-inflation", icon: "💸", descKey: "withdrawalPlanInflation" },
      { nameKey: "goldLoanCalculator", href: "/gold-loan-calculator", icon: "🏦", descKey: "loanAgainstGold" },
    ],
  },
  {
    nameKey: "planningTools",
    icon: "💍",
    calculators: [
      { nameKey: "weddingPlanner", href: "/wedding-gold-planner", icon: "💍", descKey: "planWeddingGold" },
      { nameKey: "goldPortfolio", href: "/portfolio", icon: "📂", descKey: "trackGoldInvestments" },
    ],
  },
];

export default function CalculatorSwitcher() {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/^\/(hi|ta|te)\//, '/');
  const t = useTranslations("tools");

  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        {t("allCalculators")}
      </h3>
      <div className="space-y-4">
        {calculatorCategories.map((category) => (
          <div key={category.nameKey}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{category.icon}</span>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t(category.nameKey)}
              </h4>
            </div>
            <div className="space-y-1.5">
              {category.calculators.map((calc) => {
                const isActive = pathname === calc.href;

                return (
                  <Link
                    key={calc.href}
                    href={calc.href}
                    className={`block rounded-xl border p-2.5 transition-all ${
                      isActive
                        ? "border-amber-300 bg-amber-50/50 shadow-sm cursor-default"
                        : "border-slate-100 bg-white hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{calc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? "text-amber-900" : "text-slate-700"
                          }`}
                        >
                          {t(calc.nameKey)}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {t(calc.descKey)}
                        </p>
                      </div>
                      {isActive && (
                        <span className="text-amber-600 text-xs font-semibold shrink-0">
                          {t("active")}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
