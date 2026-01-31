import Link from "next/link";

const mainLinks = [
  { label: "Gold Rate Today", href: "/gold-rate-today" },
  { label: "Jewellers Directory", href: "/jewellers" },
  { label: "Silver Rate", href: "/silver-rate" },
  { label: "Gold Calculator", href: "/calculator" },
  { label: "News", href: "/news" },
];

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Methodology", href: "/about/methodology" }, // E-E-A-T: Data sourcing transparency
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* E-E-A-T: Data Source Attribution */}
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-emerald-900">Trusted Data Sources</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                GoldMeter sources gold and silver prices directly from authoritative bodies: 
                <strong> Indian Bullion & Jewellers Association (IBJA)</strong> for national benchmarks, 
                <strong> Multi Commodity Exchange (MCX)</strong> for futures data, and regional bullion associations 
                for city-specific rates. All prices are verified and updated multiple times daily.
                {" "}<Link href="/about/methodology" className="text-emerald-700 underline font-medium">Learn about our methodology →</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-lg font-semibold text-charcoal">GoldMeter</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              India&apos;s trusted source for live gold & silver prices across 25+ cities. 
              Updated daily from IBJA and regional bullion associations.
            </p>
          </div>
          
          {/* Main Navigation */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">Quick Links</p>
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

          {/* Tools */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">Gold Calculators</p>
            <nav className="flex flex-col gap-2">
              <Link href="/calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Gold Price Calculator
              </Link>
              <Link href="/wastage-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Wastage Calculator
              </Link>
              <Link href="/purity-converter" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Purity Converter
              </Link>
              <Link href="/investment-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Gold Investment Calculator
              </Link>
              <Link href="/gold-comparison" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Gold Comparison
              </Link>
            </nav>
            <p className="text-sm font-semibold text-charcoal mb-3 mt-4">Financial Calculators</p>
            <nav className="flex flex-col gap-2">
              <Link href="/sip-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                SIP Calculator
              </Link>
              <Link href="/sip-calculator-with-step-up" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                SIP Calculator with Step Up
              </Link>
              <Link href="/swp-calculator-with-inflation" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                SWP Calculator
              </Link>
              <Link href="/gold-loan-calculator" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Gold Loan Calculator
              </Link>
              <Link href="/wedding-gold-planner" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Wedding Gold Planner
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">Legal & Info</p>
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
      
      {/* Copyright and Update Info */}
      <div className="bg-slate-50 py-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} GoldMeter. All rights reserved. Not affiliated with IBJA or MCX.
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              Rates updated every 2-4 hours from verified sources
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

