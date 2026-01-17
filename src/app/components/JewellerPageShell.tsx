"use client";

import Link from "next/link";
import type { JewellerConfig } from "@/lib/jewellerConfig";
import { getRelatedJewellers } from "@/lib/jewellerConfig";

type JewellerPageShellProps = {
  jeweller: JewellerConfig;
};

export default function JewellerPageShell({ jeweller }: JewellerPageShellProps) {
  const relatedJewellers = getRelatedJewellers(jeweller.slug, 4);
  const typeLabel = jeweller.type === 'national' ? 'Pan-India Chain' : 'Regional Chain';

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">GoldMeter Home</Link>
          <span className="mx-2">›</span>
          <Link href="/jewellers" className="hover:text-amber-600">Jewellers</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{jeweller.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Hero Section */}
            <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    jeweller.type === 'national' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {typeLabel}
                  </span>
                  <h1 className="text-3xl font-bold text-charcoal md:text-4xl">
                    {jeweller.name}
                  </h1>
                  <p className="mt-2 text-slate-600">
                    {jeweller.headquarters} • Est. {jeweller.foundedYear}
                  </p>
                </div>
                {jeweller.website && (
                  <a
                    href={jeweller.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300 bg-white text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>

              {/* Highlights */}
              <div className="mt-6 flex flex-wrap gap-2">
                {jeweller.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-sm text-slate-700"
                  >
                    <span className="text-amber-500">✓</span>
                    {highlight}
                  </span>
                ))}
              </div>
            </section>

            {/* Making Charges Card - Prominent */}
            <section className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-100 to-amber-50 p-6 shadow-md">
              <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                <span className="text-2xl">💰</span> Making Charges
              </h2>
              <p className="mt-3 text-3xl font-bold text-amber-800">
                {jeweller.makingChargesRange}
              </p>
              <p className="mt-2 text-sm text-amber-700">
                Making charges vary based on design complexity, jewellery type, and craftsmanship. 
                Simple chains and bangles are at the lower end, while bridal sets and designer 
                pieces have higher charges.
              </p>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-xs text-amber-800 font-medium">
                  💡 Tip: Always ask for a detailed bill showing gold rate and making charges separately.
                </p>
              </div>
            </section>

            {/* About Section */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4">
                About {jeweller.name} - History, Heritage & Overview
              </h2>
              <div className="prose prose-slate prose-sm max-w-none">
                {jeweller.description.split('\n\n').map((para, idx) => (
                  <p key={idx} className="text-slate-600 leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {/* Key Statistics */}
            <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span> {jeweller.name} Key Facts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">{jeweller.foundedYear}</p>
                  <p className="text-xs text-slate-500 mt-1">Year Founded</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">{new Date().getFullYear() - jeweller.foundedYear}+</p>
                  <p className="text-xs text-slate-500 mt-1">Years of Heritage</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">₹{jeweller.makingChargesMin}</p>
                  <p className="text-xs text-slate-500 mt-1">Min Making/gram</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-lg font-bold text-amber-700">{typeLabel}</p>
                  <p className="text-xs text-slate-500 mt-1">Coverage Type</p>
                </div>
              </div>
            </section>

            {/* Purity & Quality */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">✅</span> Purity & Quality Standards at {jeweller.name}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {jeweller.purityStandards}
              </p>
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <h3 className="font-semibold text-emerald-800 mb-2">What to Check When Buying</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>Look for BIS hallmark with 6-digit HUID number (mandatory since 2021)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>916 mark indicates 22K gold (91.6% purity); 750 for 18K gold</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>Request itemized bill showing gold rate, weight, and making charges separately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>Watch weight measurement and ensure stone weight is excluded</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Popular Collections */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">💎</span> Popular Collections
              </h2>
              <div className="flex flex-wrap gap-2">
                {jeweller.popularCollections.map((collection, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700"
                  >
                    {collection}
                  </span>
                ))}
              </div>
            </section>

            {/* Exchange Policy */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">🔄</span> Exchange & Buyback Policy at {jeweller.name}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {jeweller.exchangePolicy}
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Exchange Tips</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">💡</span>
                    <span>Exchange during festivals - many jewellers offer bonus value on exchanges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">💡</span>
                    <span>Keep original invoice and purity certificate for hassle-free exchange</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">💡</span>
                    <span>Compare exchange rates across 2-3 jewellers before finalizing</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Savings Schemes & EMI */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span> Gold Savings Schemes & Payment Options
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most branded jewellers including {jeweller.name} offer monthly gold savings schemes that help 
                customers plan for major purchases like wedding jewellery. Typical benefits include:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-semibold text-charcoal mb-2">Monthly Savings Scheme</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Pay monthly for 11 months</li>
                    <li>• Get 12th month free (bonus)</li>
                    <li>• Redeem for any jewellery</li>
                    <li>• Protection against price rise</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-semibold text-charcoal mb-2">Payment Options</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Credit/Debit cards</li>
                    <li>• EMI options via banks</li>
                    <li>• UPI payments</li>
                    <li>• Advance booking benefits</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Buying Tips */}
            <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span> Tips for Buying at {jeweller.name}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-amber-800 mb-3">Before Visiting the Store</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">1.</span>
                      <span>Check today&apos;s gold rate on GoldMeter or {jeweller.name}&apos;s website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">2.</span>
                      <span>Research designs online to save time at the store</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">3.</span>
                      <span>Compare making charges with 1-2 alternative jewellers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">4.</span>
                      <span>Check for ongoing offers or festival discounts</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-3">At the Store</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">1.</span>
                      <span>Ask for the making charges before selecting designs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">2.</span>
                      <span>Verify BIS hallmark and HUID number on each piece</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">3.</span>
                      <span>Get itemized bill with gold rate, weight, and charges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">4.</span>
                      <span>Confirm exchange policy in writing before purchase</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* City Presence with Gold Rate Links */}
            <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4">
                Check Gold Rates in Cities with {jeweller.name}
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                {jeweller.name} has presence in these cities. Click to see today&apos;s gold rates:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {jeweller.cityLinks.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/gold-rate/${city.slug}`}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
                  >
                    <span className="text-amber-500">📍</span>
                    Gold Rate in {city.name}
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
                <span className="text-xl">❓</span> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {jeweller.faqs.map((faq, idx) => (
                  <details key={idx} className="group rounded-xl border border-slate-100 p-4 open:bg-slate-50">
                    <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700 list-none flex items-start justify-between gap-4">
                      <span>{faq.question}</span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Info Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sticky top-6">
              <h3 className="font-bold text-charcoal mb-4">Quick Info</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Founded</span>
                  <span className="font-semibold text-charcoal">{jeweller.foundedYear}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Headquarters</span>
                  <span className="font-semibold text-charcoal text-right">{jeweller.headquarters}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Type</span>
                  <span className="font-semibold text-charcoal">{typeLabel}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Making Charges</span>
                  <span className="font-semibold text-amber-700">₹{jeweller.makingChargesMin}+</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/calculator"
                  className="block w-full py-3 px-4 rounded-xl bg-amber-500 text-center text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                >
                  Calculate Jewellery Cost →
                </Link>
                <Link
                  href="/wastage-calculator"
                  className="block w-full py-3 px-4 rounded-xl border border-amber-300 text-center text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  Wastage Calculator
                </Link>
              </div>
            </div>

            {/* Related Jewellers */}
            {relatedJewellers.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
                <h3 className="font-bold text-charcoal mb-4">Similar Jewellers</h3>
                <div className="space-y-3">
                  {relatedJewellers.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/jewellers/${related.slug}`}
                      className="block p-3 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors"
                    >
                      <p className="font-semibold text-charcoal text-sm">{related.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {related.makingChargesRange}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/jewellers"
                  className="block mt-4 text-center text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  View all jewellers →
                </Link>
              </div>
            )}

            {/* Gold Rate Links */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <h3 className="font-bold text-amber-900 mb-3">Today&apos;s Gold Rates</h3>
              <div className="space-y-2">
                <Link
                  href="/gold-rate/chennai"
                  className="block text-sm text-amber-700 hover:text-amber-900"
                >
                  → Chennai Gold Rate
                </Link>
                <Link
                  href="/gold-rate/mumbai"
                  className="block text-sm text-amber-700 hover:text-amber-900"
                >
                  → Mumbai Gold Rate
                </Link>
                <Link
                  href="/gold-rate/delhi"
                  className="block text-sm text-amber-700 hover:text-amber-900"
                >
                  → Delhi Gold Rate
                </Link>
                <Link
                  href="/gold-rate/bangalore"
                  className="block text-sm text-amber-700 hover:text-amber-900"
                >
                  → Bangalore Gold Rate
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
