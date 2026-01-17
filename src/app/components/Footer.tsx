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
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div>
            <p className="text-lg font-semibold text-charcoal">GoldMeter</p>
            <p className="text-sm text-slate-500 mt-1">
              Live gold prices updated daily • 22K & 24K
            </p>
          </div>
          
          {/* Main Navigation */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">Quick Links</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
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

          {/* Legal Links */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-3">Legal</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
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
      <div className="bg-slate-50 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GoldMeter. All rights reserved.
      </div>
    </footer>
  );
}

