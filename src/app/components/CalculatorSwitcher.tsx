"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Calculator = {
  name: string;
  href: string;
  icon: string;
  description: string;
};

type CalculatorCategory = {
  name: string;
  icon: string;
  calculators: Calculator[];
};

const calculatorCategories: CalculatorCategory[] = [
  {
    name: "Gold Calculators",
    icon: "📊",
    calculators: [
      {
        name: "Price Calculator",
        href: "/calculator",
        icon: "🧮",
        description: "Get price with GST",
      },
      {
        name: "Wastage Tool",
        href: "/wastage-calculator",
        icon: "💎",
        description: "Making + wastage charges",
      },
      {
        name: "Purity Converter",
        href: "/purity-converter",
        icon: "⚖️",
        description: "22K ↔ 24K conversion",
      },
      {
        name: "Hallmark Verifier",
        href: "/hallmark-guide",
        icon: "🔍",
        description: "Check gold purity",
      },
      {
        name: "Investment Calculator",
        href: "/investment-calculator",
        icon: "📈",
        description: "Gold SIP returns",
      },
    ],
  },
  {
    name: "Financial Calculators",
    icon: "💰",
    calculators: [
      {
        name: "SIP Calculator",
        href: "/sip-calculator",
        icon: "📊",
        description: "Calculate SIP returns",
      },
      {
        name: "SIP Calculator with Step Up",
        href: "/sip-calculator-with-step-up",
        icon: "📈",
        description: "SIP with yearly increase",
      },
      {
        name: "SWP Calculator with Inflation",
        href: "/swp-calculator-with-inflation",
        icon: "💸",
        description: "Withdrawal plan with inflation",
      },
      {
        name: "Gold Loan Calculator",
        href: "/gold-loan-calculator",
        icon: "🏦",
        description: "Loan against gold",
      },
    ],
  },
  {
    name: "Planning Tools",
    icon: "💍",
    calculators: [
      {
        name: "Wedding Planner",
        href: "/wedding-gold-planner",
        icon: "💍",
        description: "Plan wedding gold",
      },
      {
        name: "Gold Portfolio",
        href: "/portfolio",
        icon: "📂",
        description: "Track gold investments",
      },
    ],
  },
];

export default function CalculatorSwitcher() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        All Calculators
      </h3>
      <div className="space-y-4">
        {calculatorCategories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{category.icon}</span>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {category.name}
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
                          {calc.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {calc.description}
                        </p>
                      </div>
                      {isActive && (
                        <span className="text-amber-600 text-xs font-semibold shrink-0">
                          Active
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

