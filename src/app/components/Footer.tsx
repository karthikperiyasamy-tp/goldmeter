import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-charcoal">GoldMeter</p>
          <p className="text-sm text-slate-500">
            Live gold prices updated daily • 22K & 24K
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
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
      <div className="bg-slate-50 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GoldMeter. All rights reserved.
      </div>
    </footer>
  );
}

