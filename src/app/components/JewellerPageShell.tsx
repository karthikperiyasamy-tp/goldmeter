"use client";

import Link from "next/link";
import type { JewellerConfig } from "@/lib/jewellerConfig";
import { getRelatedJewellers } from "@/lib/jewellerConfig";

type GoldRateData = {
  gold22k: number;
  gold24k: number;
  gold18k: number;
  priceChange: {
    gold22k: number;
    gold24k: number;
  };
  date: string;
  dateISO: string;
  city: string;
};

type JewellerPageShellProps = {
  jeweller: JewellerConfig;
  goldRate?: GoldRateData | null;
  lastUpdated: string; // ISO date string
};

export default function JewellerPageShell({ jeweller, goldRate, lastUpdated }: JewellerPageShellProps) {
  const relatedJewellers = getRelatedJewellers(jeweller.slug, 4);
  const typeLabel = jeweller.type === 'national' ? 'Pan-India Chain' : 'Regional Chain';
  
  // Format last updated date
  const formattedLastUpdated = new Date(lastUpdated).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
                    {jeweller.seoH1 || jeweller.name}
                  </h1>
                  <p className="mt-2 text-slate-600">
                    {jeweller.headquarters} • Est. {jeweller.foundedYear}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Last updated: {formattedLastUpdated}
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
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">💰</span>
                <h2 className="text-xl font-bold text-amber-900">{jeweller.name} Making Charges</h2>
              </div>
              <p className="mt-3 text-3xl font-bold text-amber-800">
                <strong>{jeweller.makingChargesRange}</strong>
              </p>
              <p className="mt-2 text-sm text-amber-700">
                At <strong>{jeweller.name}</strong>, making charges start from <strong>₹{jeweller.makingChargesMin}/gram</strong> for simple designs 
                and go up to <strong>₹{jeweller.makingChargesMax}/gram</strong> for intricate bridal and designer pieces.
              </p>
            </section>

            {/* Dynamic Gold Rate Section */}
            {goldRate && (
              <section className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">📈</span>
                      <h2 className="text-xl font-bold text-charcoal">Gold Rate in {goldRate.city} Today</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {jeweller.name} headquarters • Updated {goldRate.date}
                    </p>
                  </div>
                  <Link
                    href={`/gold-rate/${goldRate.city.toLowerCase()}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View full rates →
                  </Link>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs text-slate-500 mb-1">22K Gold</p>
                    <p className="text-xl font-bold text-charcoal"><strong>₹{goldRate.gold22k.toLocaleString('en-IN')}</strong></p>
                    <p className={`text-xs mt-1 font-medium ${goldRate.priceChange.gold22k >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {goldRate.priceChange.gold22k >= 0 ? '▲' : '▼'} ₹{Math.abs(goldRate.priceChange.gold22k)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs text-slate-500 mb-1">24K Gold</p>
                    <p className="text-xl font-bold text-charcoal"><strong>₹{goldRate.gold24k.toLocaleString('en-IN')}</strong></p>
                    <p className={`text-xs mt-1 font-medium ${goldRate.priceChange.gold24k >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {goldRate.priceChange.gold24k >= 0 ? '▲' : '▼'} ₹{Math.abs(goldRate.priceChange.gold24k)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs text-slate-500 mb-1">18K Gold</p>
                    <p className="text-xl font-bold text-charcoal"><strong>₹{goldRate.gold18k.toLocaleString('en-IN')}</strong></p>
                    <p className="text-xs mt-1 text-slate-400">per gram</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 text-center">
                  Prices are per gram. <strong>Actual jewellery cost</strong> = Gold rate + Making charges (<strong>{jeweller.makingChargesRange}</strong>)
                </p>
              </section>
            )}

            {/* About Section */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-charcoal mb-4">
                About {jeweller.name} - History, Heritage & Overview
              </h2>
              <div className="prose prose-slate prose-sm max-w-none">
                {jeweller.description.split('\n\n').map((para, idx) => (
                  <p key={idx} className="text-slate-600 leading-relaxed mb-4">
                    {idx === 0 ? (
                      <><strong>{jeweller.name}</strong> {para.replace(jeweller.name, '').trim()}</>
                    ) : (
                      para
                    )}
                  </p>
                ))}
              </div>
            </section>

            {/* Key Statistics */}
            <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" aria-hidden="true">📊</span>
                <h2 className="text-xl font-bold text-charcoal">{jeweller.name} Key Facts</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700"><strong>{jeweller.foundedYear}</strong></p>
                  <p className="text-xs text-slate-500 mt-1">Year Founded</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700"><strong>{new Date().getFullYear() - jeweller.foundedYear}+</strong></p>
                  <p className="text-xs text-slate-500 mt-1">Years of Heritage</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700"><strong>₹{jeweller.makingChargesMin}</strong></p>
                  <p className="text-xs text-slate-500 mt-1">Min Making/gram</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-100">
                  <p className="text-lg font-bold text-amber-700"><strong>{typeLabel}</strong></p>
                  <p className="text-xs text-slate-500 mt-1">Coverage Type</p>
                </div>
              </div>
            </section>

            {/* Purity & Quality */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" aria-hidden="true">✅</span>
                <h2 className="text-xl font-bold text-charcoal">Purity & Quality Standards at {jeweller.name}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>{jeweller.name}</strong> ensures all gold jewellery is <strong>BIS hallmarked</strong> with <strong>HUID certification</strong>. {jeweller.purityStandards}
              </p>
            </section>

            {/* Popular Collections */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" aria-hidden="true">💎</span>
                <h2 className="text-xl font-bold text-charcoal">Popular Collections</h2>
              </div>
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" aria-hidden="true">🔄</span>
                <h2 className="text-xl font-bold text-charcoal">Exchange & Buyback Policy at {jeweller.name}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>{jeweller.name}&apos;s exchange policy:</strong> {jeweller.exchangePolicy}
              </p>
            </section>

            {/* Buying Guide Callout - Links to central guide to avoid duplicate content */}
            <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">📝</span>
                    <h2 className="text-lg font-bold text-charcoal">Gold Buying Guide</h2>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Learn about <strong>gold savings schemes</strong>, <strong>making charges</strong>, <strong>BIS hallmark verification</strong>, 
                    and smart buying tips before visiting <strong>{jeweller.name}</strong>.
                  </p>
                </div>
                <Link
                  href="/jewellers/buying-guide"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors whitespace-nowrap"
                >
                  Read Buying Guide →
                </Link>
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
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl" aria-hidden="true">❓</span>
                <h2 className="text-xl font-bold text-charcoal">Frequently Asked Questions</h2>
              </div>
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
                  <span className="font-semibold text-charcoal"><strong>{jeweller.foundedYear}</strong></span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Headquarters</span>
                  <span className="font-semibold text-charcoal text-right"><strong>{jeweller.headquarters}</strong></span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Type</span>
                  <span className="font-semibold text-charcoal"><strong>{typeLabel}</strong></span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Making Charges</span>
                  <span className="font-semibold text-amber-700"><strong>₹{jeweller.makingChargesMin}+</strong></span>
                </div>
                {goldRate && (
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">22K Gold Today</span>
                    <span className="font-semibold text-emerald-600"><strong>₹{goldRate.gold22k.toLocaleString('en-IN')}</strong></span>
                  </div>
                )}
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

            {/* Gold Rate Links - Dynamic based on jeweller's city presence */}
            {jeweller.cityLinks.length > 0 && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <h3 className="font-bold text-amber-900 mb-3">Gold Rates in {jeweller.name} Cities</h3>
                <div className="space-y-2">
                  {jeweller.cityLinks.slice(0, 5).map((city) => (
                    <Link
                      key={city.slug}
                      href={`/gold-rate/${city.slug}`}
                      className="block text-sm text-amber-700 hover:text-amber-900"
                    >
                      → {city.name} Gold Rate
                    </Link>
                  ))}
                  {jeweller.cityLinks.length > 5 && (
                    <p className="text-xs text-amber-600 pt-1">
                      +{jeweller.cityLinks.length - 5} more cities
                    </p>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
