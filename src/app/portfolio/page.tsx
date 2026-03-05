"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PortfolioClient from "../components/portfolio/PortfolioClient";

interface RateData {
  gold22k: number;
  gold24k: number;
  loading: boolean;
}

export default function PortfolioPage() {
  const [rates, setRates] = useState<RateData>({
    gold22k: 0,
    gold24k: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/calculator-rates");
        const data = await res.json();
        if (data.success && data.rates?.length > 0) {
          // Use India rate (first item) - API returns per 10g, divide by 10
          const india = data.rates[0];
          setRates({
            gold22k: Math.round(india.gold22k / 10),
            gold24k: Math.round(india.gold24k / 10),
            loading: false,
          });
        } else {
          // Fallback (per gram)
          setRates({ gold22k: 5920, gold24k: 6450, loading: false });
        }
      } catch {
        setRates({ gold22k: 5920, gold24k: 6450, loading: false });
      }
    }
    fetchRates();
  }, []);

  return (
    <main className="min-h-screen bg-amber-50 py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-5xl px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4 print:hidden"
        >
          ← Back to Home
        </Link>
        <p className="text-xs uppercase tracking-widest text-slate-500">
          Investment Tools
        </p>
        <h1 className="mt-2 text-3xl font-bold text-charcoal">
          Gold Portfolio Tracker
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Track your gold investments, view holdings, and monitor profit &amp;
          loss with live prices.
        </p>

        {/* Live rate pill */}
        {!rates.loading && (
          <div className="mt-3 inline-flex items-center gap-3 rounded-full bg-white border border-amber-200 px-4 py-1.5 text-xs text-slate-600 shadow-sm">
            <span>
              22K: <strong className="text-charcoal">₹{rates.gold22k.toLocaleString("en-IN")}/g</strong>
            </span>
            <span className="w-px h-3 bg-slate-200" />
            <span>
              24K: <strong className="text-charcoal">₹{rates.gold24k.toLocaleString("en-IN")}/g</strong>
            </span>
          </div>
        )}

        <div className="mt-6">
          {rates.loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
            </div>
          ) : (
            <PortfolioClient gold22k={rates.gold22k} gold24k={rates.gold24k} />
          )}
        </div>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Gold Portfolio Tracker",
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web",
                  "description": "Free gold portfolio tracker with XIRR returns, P&L calculation, 22K/24K holdings, and cloud sync via Google.",
                  "url": "https://goldmeter.in/portfolio",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR",
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "GoldMeter",
                    "url": "https://goldmeter.in",
                  },
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Is the Gold Portfolio Tracker free?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, GoldMeter's Gold Portfolio Tracker is completely free. There are no hidden charges, subscriptions, or premium tiers.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "How does the Gold Portfolio Tracker calculate XIRR?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "XIRR (Extended Internal Rate of Return) is computed using the dates and amounts of all your buy/sell transactions along with the current market value of your holdings, giving you an annualized return percentage.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "Is my portfolio data safe?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Your data starts in your browser's local storage and never leaves your device unless you choose to sign in with Google. With Google sign-in, data syncs securely to Firebase (Google Cloud) and is tied to your Google account.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "Can I track both 22K and 24K gold?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Every transaction lets you select 22K or 24K purity. The tracker maintains separate average prices and P&L for each purity, plus a combined portfolio view.",
                      },
                    },
                    {
                      "@type": "Question",
                      "name": "Does it work on mobile?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. The Gold Portfolio Tracker is fully responsive and works on all devices — phones, tablets, and desktops. You can also export your data as CSV or print a PDF report.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />

        {/* SEO content */}
        <section className="mt-12 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft print:hidden">
          <article className="prose prose-slate max-w-none text-sm">
            <h2 className="text-xl font-bold text-charcoal mb-3">
              About Gold Portfolio Tracker
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              GoldMeter&apos;s Gold Portfolio Tracker helps you record every gold
              purchase and sale in one place. It automatically calculates your
              net holdings, average buy price, current market value and
              unrealized profit or loss using live gold rates from India.
            </p>
            <p className="text-slate-600 leading-relaxed mb-3">
              Your data starts in your browser&apos;s local storage so you can begin
              immediately without signing up. When you&apos;re ready, sign in with
              Google to sync your portfolio to the cloud (powered by Firebase)
              and access it from any device.
            </p>

            <h2 className="text-lg font-semibold text-charcoal mt-6 mb-2">
              Gold Portfolio Features
            </h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>Add buy and sell transactions with date, weight, price, charges, and notes</li>
              <li>Supports both 22K and 24K gold tracking</li>
              <li>Auto-computed average buy price, invested amount, and current value</li>
              <li>XIRR calculation for annualized portfolio returns</li>
              <li>Live unrealized P&amp;L based on today&apos;s gold rate</li>
              <li>Export to CSV or print a PDF portfolio report</li>
              <li>Monthly and yearly performance breakdown</li>
              <li>Local-first: works without sign-in, data stays in your browser</li>
              <li>Optional Google sign-in to sync across devices via Firebase</li>
            </ul>

            <h2 className="text-lg font-semibold text-charcoal mt-6 mb-2">
              How to Track Gold Investments
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Every time you add a transaction, the tracker recalculates your
              net grams, average cost, and current value. Buy entries increase
              your holdings; sell entries reduce them. The unrealized P&amp;L
              shows the difference between what you paid (cost basis) and what
              your gold is worth right now at India&apos;s live price.
            </p>
            <p className="text-slate-600 leading-relaxed mb-3">
              Use the sort and filter controls to quickly find specific
              transactions by date, type, purity, or item. The date range
              filter lets you focus on a specific period. You can export
              your filtered transactions as CSV for record-keeping or
              print a clean report using the export dropdown.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 text-slate-600">
              <div>
                <p className="font-semibold text-charcoal">Is the Gold Portfolio Tracker free?</p>
                <p>Yes — completely free with no hidden charges, subscriptions, or premium tiers.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">How is XIRR calculated?</p>
                <p>XIRR uses the dates and amounts of all your transactions along with today&apos;s market value to compute an annualized return percentage.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Is my data safe?</p>
                <p>Your data stays in your browser until you sign in with Google. With sign-in, it syncs securely to Firebase (Google Cloud).</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Can I track 22K and 24K gold separately?</p>
                <p>Yes — separate average prices and P&L are maintained for each purity, with a combined portfolio view.</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal">Does it work on mobile?</p>
                <p>Fully responsive — works on phones, tablets, and desktops. You can also export CSV or print a PDF report.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
