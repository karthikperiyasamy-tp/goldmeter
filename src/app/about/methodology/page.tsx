import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology: How We Source Gold & Silver Rates | GoldMeter",
  description: "Learn how GoldMeter collects, verifies, and updates gold and silver prices. Our transparent methodology ensures accurate, real-time rates from trusted sources like IBJA.",
  alternates: {
    canonical: "https://goldmeter.in/about/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-amber-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <Link 
          href="/about" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-6"
        >
          ← Back to About
        </Link>

        <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-bold text-charcoal">
            Our Data Methodology
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            How GoldMeter sources, verifies, and delivers accurate gold & silver prices
          </p>

          {/* E-E-A-T: Expert Introduction */}
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900">Our Commitment to Accuracy</h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              GoldMeter is committed to providing the most accurate and timely gold and silver price information 
              to Indian consumers. Our data is sourced directly from authoritative bullion market bodies and 
              verified through multiple cross-references.
            </p>
          </div>

          {/* Data Sources */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Primary Data Sources</h2>
            
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Indian Bullion & Jewellers Association (IBJA)
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  <strong>Primary source for benchmark gold prices</strong><br />
                  IBJA, headquartered in Mumbai&apos;s Zaveri Bazaar, is India&apos;s apex body for bullion trading. 
                  They publish official gold rates twice daily (morning and afternoon sessions) reflecting 
                  international spot prices and local market conditions.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  📍 Location: Zaveri Bazaar, Mumbai<br />
                  🕐 Update Frequency: Twice daily (10:30 AM and 3:30 PM IST)<br />
                  🌐 Authority: National benchmark setter for India
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multi Commodity Exchange (MCX)
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  <strong>Real-time futures market data</strong><br />
                  MCX gold and silver futures provide real-time market sentiment and price discovery. 
                  We reference MCX spot prices for intraday movements and to validate IBJA rates.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  📍 Location: Mumbai<br />
                  🕐 Update Frequency: Real-time during trading hours (9:00 AM - 11:30 PM IST)<br />
                  🌐 Authority: India&apos;s largest commodity exchange
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Regional Bullion Associations
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  <strong>City-specific price variations</strong><br />
                  For city-specific rates, we source data from regional bullion merchant associations including:
                </p>
                <ul className="mt-2 text-sm text-slate-600 list-disc list-inside space-y-1">
                  <li>Tamil Nadu Bullion Merchants Association (Chennai, Coimbatore)</li>
                  <li>Karnataka Bullion Merchants Association (Bangalore, Mysore)</li>
                  <li>Delhi Bullion & Jewellers Association</li>
                  <li>Calcutta Bullion Association</li>
                  <li>Gujarat Bullion Merchants Association (Ahmedabad, Surat)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  International Reference: London Bullion Market Association (LBMA)
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  <strong>Global price benchmarking</strong><br />
                  LBMA gold and silver prices (London Fix) serve as the international reference. Indian prices 
                  are derived by converting LBMA USD prices to INR, adding import duties (10-15%), GST (3%), 
                  and local premiums.
                </p>
              </div>
            </div>
          </section>

          {/* Data Collection Process */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Data Collection & Verification Process</h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Automated Data Fetching</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Our system automatically fetches gold and silver rates from IBJA&apos;s official website and 
                    regional association portals multiple times daily (every 2-4 hours).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Cross-Validation</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Each price is cross-validated against multiple sources:
                  </p>
                  <ul className="mt-2 text-sm text-slate-600 list-disc list-inside">
                    <li>MCX spot prices (±2% tolerance)</li>
                    <li>Historical trend analysis (anomaly detection)</li>
                    <li>Peer city comparison (regional consistency check)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Data Storage & Timestamping</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    All rates are stored in our database with precise timestamps (down to the second) in IST timezone. 
                    Historical data is preserved for trend analysis and verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Publication with Attribution</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Verified rates are published on GoldMeter with clear source attribution (&quot;Verified from IBJA&quot;, 
                    timestamp, and last update time visible on every page).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Update Frequency */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Update Frequency</h2>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="pb-2 text-left font-semibold text-blue-900">Data Type</th>
                    <th className="pb-2 text-left font-semibold text-blue-900">Update Frequency</th>
                    <th className="pb-2 text-left font-semibold text-blue-900">Source</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-blue-100">
                    <td className="py-2">India Gold Rates</td>
                    <td className="py-2">Every 2 hours</td>
                    <td className="py-2">IBJA Mumbai</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2">City-specific Rates</td>
                    <td className="py-2">Every 4 hours</td>
                    <td className="py-2">Regional Associations</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2">Silver Rates</td>
                    <td className="py-2">Every 4 hours</td>
                    <td className="py-2">IBJA + MCX</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2">International Rates</td>
                    <td className="py-2">Every 1 hour</td>
                    <td className="py-2">LBMA + Forex APIs</td>
                  </tr>
                  <tr>
                    <td className="py-2">Gold News</td>
                    <td className="py-2">Every 6 hours</td>
                    <td className="py-2">Trusted financial news sources</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Price Calculation Transparency */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Price Calculation Transparency</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                <strong>24K Gold (99.9% purity):</strong> Direct IBJA benchmark rate per 10 grams
              </p>
              <p>
                <strong>22K Gold (91.6% purity):</strong> Calculated as (24K rate × 22/24) or direct IBJA quote where available
              </p>
              <p>
                <strong>18K Gold (75% purity):</strong> Calculated as (24K rate × 18/24)
              </p>
              <p>
                <strong>Silver (99.9% purity):</strong> Per kilogram rate from IBJA/MCX
              </p>
              <p className="mt-4 text-xs text-slate-500">
                <strong>Note:</strong> Displayed rates are for pure metal only and do NOT include making charges 
                (₹150-600/gram) or GST (3% on gold value). Use our calculators for total jewellery cost estimation.
              </p>
            </div>
          </section>

          {/* Data Accuracy Commitment */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Accuracy Commitment</h2>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 space-y-3 text-sm text-slate-700">
              <p>
                <strong>Quality Assurance:</strong> We maintain ±1% accuracy tolerance compared to IBJA official rates. 
                Any variance beyond this triggers automated alerts for manual verification.
              </p>
              <p>
                <strong>Error Reporting:</strong> If you notice any discrepancy in rates, please report it via our 
                {" "}<Link href="/contact" className="text-amber-600 underline font-semibold">contact form</Link>. 
                We investigate and respond to all reports within 24 hours.
              </p>
              <p>
                <strong>Historical Data Integrity:</strong> All historical rates are immutable once published. 
                We maintain complete audit trails for regulatory compliance and transparency.
              </p>
            </div>
          </section>

          {/* Editorial Team */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-charcoal">Editorial Oversight</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>GoldMeter Editorial Team</strong><br />
                Our content is reviewed by financial analysts with expertise in commodity markets, bullion trading, 
                and Indian regulatory frameworks. While we strive for accuracy, GoldMeter is an informational service 
                and not a trading or investment advisor. Always verify rates directly with jewellers before making purchases.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Last methodology review: January 2026
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-900">Disclaimer</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              GoldMeter provides gold and silver price information for reference purposes only. Actual prices may vary 
              by jeweller, location, and market conditions. Making charges, GST, and other fees are additional. 
              We are not responsible for any transactions, losses, or decisions made based on this information. 
              Always verify current rates with authorized dealers before purchase. GoldMeter is not affiliated with IBJA, 
              MCX, or any bullion association.
            </p>
          </section>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              View Live Gold Rates
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              About GoldMeter
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
