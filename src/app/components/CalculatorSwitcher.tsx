"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const calculators = [
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
];

export default function CalculatorSwitcher() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        Other Calculators
      </h3>
      <div className="space-y-2">
        {calculators.map((calc) => {
          const isActive = pathname === calc.href;
          
          return (
            <Link
              key={calc.href}
              href={calc.href}
              className={`block rounded-xl border p-3 transition-all ${
                isActive
                  ? "border-amber-300 bg-amber-50/50 shadow-sm cursor-default"
                  : "border-slate-100 bg-white hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{calc.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    isActive ? "text-amber-900" : "text-slate-700"
                  }`}>
                    {calc.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {calc.description}
                  </p>
                </div>
                {isActive && (
                  <span className="text-amber-600 text-xs font-semibold">
                    Active
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

