"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
};

export default function GoldComparisonPage() {
  const [cityRates, setCityRates] = useState<CityRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('/api/calculator-rates');
        const data = await response.json();
        
        if (data.success && data.rates) {
          setCityRates(data.rates.slice(0, 10)); // Top 10 cities
        }
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRates();
  }, []);

  const perGram22k = (per10g: number) => Math.round(per10g / 10);
  const perGram24k = (per10g: number) => Math.round(per10g / 10);
  const perGram18k = (per10g: number) => Math.round((per10g * 18) / 24 / 10);

  // Comparison Table Schema for AI extraction
  const tableSchema = {
    "@context": "https://schema.org",
    "@type": "Table",
    "about": "Gold Rate Comparison Across Indian Cities",
    "name": "City-wise Gold Price Comparison in India",
    "description": "Compare 22K and 24K gold rates per gram across major Indian cities",
    "dateModified": new Date().toISOString()
  };

  return (
    <>
      {/* Structured Data for Comparison Table */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema) }}
      />

      <main className="min-h-screen bg-amber-50 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-6"
          >
            ← Back to Home
          </Link>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-bold text-charcoal">
              Gold Rate Comparison Across India
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Compare live 22K and 24K gold prices across major Indian cities. Updated daily.
            </p>

            {/* Purity Comparison Table */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-charcoal mb-4">
                Gold Purity Comparison: 24K vs 22K vs 18K
              </h2>
              
              <div className="overflow-x-auto" data-comparison="gold-purities">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-amber-100 text-amber-900">
                      <th className="px-4 py-3 text-left border border-amber-200" data-column="metric">Feature</th>
                      <th className="px-4 py-3 text-left border border-amber-200" data-column="24k">24K Gold (999)</th>
                      <th className="px-4 py-3 text-left border border-amber-200" data-column="22k">22K Gold (916)</th>
                      <th className="px-4 py-3 text-left border border-amber-200" data-column="18k">18K Gold (750)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="purity">Purity</td>
                      <td className="px-4 py-3 border border-amber-200" data-value="99.9%">99.9% pure gold</td>
                      <td className="px-4 py-3 border border-amber-200" data-value="91.6%">91.6% gold + 8.4% alloy</td>
                      <td className="px-4 py-3 border border-amber-200" data-value="75%">75% gold + 25% alloy</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="best-for">Best For</td>
                      <td className="px-4 py-3 border border-amber-200">Investment, coins, bars</td>
                      <td className="px-4 py-3 border border-amber-200">Traditional jewellery, wedding sets</td>
                      <td className="px-4 py-3 border border-amber-200">Diamond jewellery, daily wear</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="durability">Durability</td>
                      <td className="px-4 py-3 border border-amber-200">⭐⭐ Soft, bends easily</td>
                      <td className="px-4 py-3 border border-amber-200">⭐⭐⭐⭐ Strong, good for daily wear</td>
                      <td className="px-4 py-3 border border-amber-200">⭐⭐⭐⭐⭐ Very strong, scratch-resistant</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="color">Color</td>
                      <td className="px-4 py-3 border border-amber-200">Bright yellow-gold</td>
                      <td className="px-4 py-3 border border-amber-200">Slightly lighter yellow</td>
                      <td className="px-4 py-3 border border-amber-200">Lighter, can be white/rose gold</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="resale-value">Resale Value</td>
                      <td className="px-4 py-3 border border-amber-200">⭐⭐⭐⭐⭐ Highest resale</td>
                      <td className="px-4 py-3 border border-amber-200">⭐⭐⭐⭐ Good resale</td>
                      <td className="px-4 py-3 border border-amber-200">⭐⭐⭐ Lower resale</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="making-charges">Typical Making Charges</td>
                      <td className="px-4 py-3 border border-amber-200">₹100-200/gram (coins/bars)</td>
                      <td className="px-4 py-3 border border-amber-200">₹150-450/gram</td>
                      <td className="px-4 py-3 border border-amber-200">₹200-600/gram</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-amber-200 font-medium" data-metric="hallmark">BIS Hallmark</td>
                      <td className="px-4 py-3 border border-amber-200">999</td>
                      <td className="px-4 py-3 border border-amber-200">916</td>
                      <td className="px-4 py-3 border border-amber-200">750</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* City-wise Comparison */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-charcoal mb-4">
                City-wise Gold Rate Comparison
              </h2>
              
              {loading ? (
                <p className="text-sm text-amber-600">Loading live rates...</p>
              ) : (
                <div className="overflow-x-auto" data-comparison="city-rates">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800">
                        <th className="px-4 py-3 text-left border border-slate-200">City</th>
                        <th className="px-4 py-3 text-right border border-slate-200">22K per Gram</th>
                        <th className="px-4 py-3 text-right border border-slate-200">24K per Gram</th>
                        <th className="px-4 py-3 text-right border border-slate-200">18K per Gram</th>
                        <th className="px-4 py-3 text-right border border-slate-200">22K per 10g</th>
                        <th className="px-4 py-3 text-right border border-slate-200">24K per 10g</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {cityRates.map((city, idx) => (
                        <tr key={city.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-4 py-3 border border-slate-200 font-medium">
                            <Link href={`/gold-rate/${city.name.toLowerCase()}`} className="text-amber-600 hover:text-amber-700">
                              {city.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 border border-slate-200 text-right" data-city={city.name} data-purity="22k" data-price={perGram22k(city.gold22k)}>
                            ₹{perGram22k(city.gold22k).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 border border-slate-200 text-right" data-city={city.name} data-purity="24k" data-price={perGram24k(city.gold24k)}>
                            ₹{perGram24k(city.gold24k).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 border border-slate-200 text-right" data-city={city.name} data-purity="18k" data-price={perGram18k(city.gold24k)}>
                            ₹{perGram18k(city.gold24k).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 border border-slate-200 text-right">
                            ₹{city.gold22k.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 border border-slate-200 text-right">
                            ₹{city.gold24k.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Investment Options Comparison */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-charcoal mb-4">
                Gold Investment Options Comparison
              </h2>
              
              <div className="overflow-x-auto" data-comparison="investment-options">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-emerald-100 text-emerald-900">
                      <th className="px-4 py-3 text-left border border-emerald-200">Investment Type</th>
                      <th className="px-4 py-3 text-left border border-emerald-200">Minimum Investment</th>
                      <th className="px-4 py-3 text-left border border-emerald-200">Returns</th>
                      <th className="px-4 py-3 text-left border border-emerald-200">Liquidity</th>
                      <th className="px-4 py-3 text-left border border-emerald-200">Storage Needed</th>
                      <th className="px-4 py-3 text-left border border-emerald-200">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-emerald-200 font-medium">Physical Gold (Coins/Bars)</td>
                      <td className="px-4 py-3 border border-emerald-200">₹5,000+ (1g)</td>
                      <td className="px-4 py-3 border border-emerald-200">Gold price appreciation</td>
                      <td className="px-4 py-3 border border-emerald-200">⭐⭐⭐ Moderate</td>
                      <td className="px-4 py-3 border border-emerald-200">Yes (locker)</td>
                      <td className="px-4 py-3 border border-emerald-200">Traditional investors</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="px-4 py-3 border border-emerald-200 font-medium">Sovereign Gold Bonds (SGB)</td>
                      <td className="px-4 py-3 border border-emerald-200">₹5,000 (1g)</td>
                      <td className="px-4 py-3 border border-emerald-200">Gold price + 2.5% p.a. interest</td>
                      <td className="px-4 py-3 border border-emerald-200">⭐⭐ Low (8-year lock-in)</td>
                      <td className="px-4 py-3 border border-emerald-200">No (digital)</td>
                      <td className="px-4 py-3 border border-emerald-200">Long-term investors</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-emerald-200 font-medium">Gold ETFs</td>
                      <td className="px-4 py-3 border border-emerald-200">₹100+ (per unit)</td>
                      <td className="px-4 py-3 border border-emerald-200">Gold price - expense ratio</td>
                      <td className="px-4 py-3 border border-emerald-200">⭐⭐⭐⭐⭐ Very High</td>
                      <td className="px-4 py-3 border border-emerald-200">No (digital)</td>
                      <td className="px-4 py-3 border border-emerald-200">Active traders</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="px-4 py-3 border border-emerald-200 font-medium">Digital Gold</td>
                      <td className="px-4 py-3 border border-emerald-200">₹10+ (any amount)</td>
                      <td className="px-4 py-3 border border-emerald-200">Gold price - spread</td>
                      <td className="px-4 py-3 border border-emerald-200">⭐⭐⭐⭐ High</td>
                      <td className="px-4 py-3 border border-emerald-200">No (vault stored)</td>
                      <td className="px-4 py-3 border border-emerald-200">Small investors</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 border border-emerald-200 font-medium">Gold Mutual Funds</td>
                      <td className="px-4 py-3 border border-emerald-200">₹500+ (SIP)</td>
                      <td className="px-4 py-3 border border-emerald-200">Gold price - fund expenses</td>
                      <td className="px-4 py-3 border border-emerald-200">⭐⭐⭐⭐ High</td>
                      <td className="px-4 py-3 border border-emerald-200">No (digital)</td>
                      <td className="px-4 py-3 border border-emerald-200">SIP investors</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="px-4 py-3 border border-emerald-200 font-medium">Gold Jewellery</td>
                      <td className="px-4 py-3 border border-emerald-200">₹10,000+ (design dependent)</td>
                      <td className="px-4 py-3 border border-emerald-200">Gold price - making charges</td>
                      <td className="px-4 py-3 border border-emerald-200">⭐⭐ Low (resale loss)</td>
                      <td className="px-4 py-3 border border-emerald-200">Yes (home/locker)</td>
                      <td className="px-4 py-3 border border-emerald-200">Personal use + investment</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Key Takeaways */}
            <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="font-semibold text-blue-900">Key Takeaways</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-inside">
                <li><strong>For Investment:</strong> Choose 24K gold (coins/bars), SGBs, or Gold ETFs</li>
                <li><strong>For Jewellery:</strong> 22K gold offers the best balance of purity and durability</li>
                <li><strong>For Daily Wear:</strong> 18K gold is more durable and scratch-resistant</li>
                <li><strong>City Price Variance:</strong> Mumbai typically has the lowest rates, South Indian cities are ₹30-80 higher</li>
                <li><strong>Making Charges:</strong> Add 15-40% to gold value for jewellery final price</li>
              </ul>
            </section>

            {/* CTA Links */}
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <Link
                href="/calculator"
                className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-charcoal hover:border-amber-200 transition-colors"
              >
                🧮 Gold Calculator → Estimate jewellery cost
              </Link>
              <Link
                href="/investment-calculator"
                className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-charcoal hover:border-emerald-200 transition-colors"
              >
                📈 Investment Calculator → Plan your gold SIP
              </Link>
              <Link
                href="/"
                className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200 transition-colors"
              >
                💰 Live Gold Rates → Check today&apos;s prices
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
