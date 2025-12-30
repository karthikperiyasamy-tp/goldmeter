import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer - GoldMeter",
  description: "Important disclaimers about gold price information provided by GoldMeter. Understand the limitations of our data.",
  alternates: {
    canonical: "https://goldmeter.in/disclaimer",
  },
  openGraph: {
    title: "Disclaimer - GoldMeter",
    description: "Important disclaimers about gold price information provided by GoldMeter. Understand the limitations of our data.",
    type: "website",
    url: "https://goldmeter.in/disclaimer",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Disclaimer - GoldMeter",
      },
    ],
  },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#fffdf7]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Disclaimer</span>
        </nav>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Disclaimer</h1>

          <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-white p-6 mb-8">
            <p className="text-rose-800 leading-relaxed m-0 font-medium">
              ⚠️ The information provided on GoldMeter is for general informational purposes only. 
              It should not be considered as financial advice or a recommendation to buy or sell gold.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Price Information</h2>
          <p className="text-slate-600 leading-relaxed">
            The gold and silver prices displayed on GoldMeter are:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li><strong>Indicative only:</strong> Prices represent the base metal rate and do not include making charges, wastage, GST, or other fees charged by jewellers.</li>
            <li><strong>Subject to delays:</strong> There may be delays between actual market movements and the prices displayed on our website.</li>
            <li><strong>From third-party sources:</strong> We aggregate data from various sources and cannot guarantee its accuracy at all times.</li>
            <li><strong>Not live trading prices:</strong> These are reference rates and not prices at which transactions can be executed.</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Actual Purchase Prices</h2>
          <p className="text-slate-600 leading-relaxed">
            When you purchase gold jewellery, the final price will typically include:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li><strong>Making charges:</strong> ₹150 to ₹600+ per gram depending on design complexity</li>
            <li><strong>Wastage charges:</strong> 3-20% depending on the jeweller and design</li>
            <li><strong>GST:</strong> 3% on gold value + 5% on making charges</li>
            <li><strong>Stone/Diamond costs:</strong> If the jewellery contains precious stones</li>
            <li><strong>Jeweller markup:</strong> Individual pricing policies vary by store</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-4">
            <strong>Always verify the current rate with your jeweller before making a purchase.</strong>
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Not Financial Advice</h2>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 my-4">
            <p className="text-slate-700 leading-relaxed m-0">
              GoldMeter does not provide financial, investment, or trading advice. The information on 
              this website should not be used as the sole basis for making investment decisions. Gold 
              prices are volatile and can go up or down. Past performance is not indicative of future results.
            </p>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Before making any investment decisions:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Consult with a qualified financial advisor</li>
            <li>Conduct your own research</li>
            <li>Consider your financial situation and risk tolerance</li>
            <li>Understand that gold investments can lose value</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Calculator Estimates</h2>
          <p className="text-slate-600 leading-relaxed">
            The calculators on GoldMeter (jewellery cost calculator, wastage calculator, etc.) provide 
            <strong> estimates only</strong>. Actual costs may vary based on:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Real-time gold prices at the time of purchase</li>
            <li>Individual jeweller pricing policies</li>
            <li>Specific design and craftsmanship requirements</li>
            <li>Regional pricing variations</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">No Endorsements</h2>
          <p className="text-slate-600 leading-relaxed">
            GoldMeter does not endorse, recommend, or have any commercial relationship with any 
            jewellery shop, bullion dealer, or financial institution. Mentions of specific markets, 
            brands, or locations are for informational purposes only.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Data Sources</h2>
          <p className="text-slate-600 leading-relaxed">
            Our price data is sourced from:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>India Bullion and Jewellers Association (IBJA)</li>
            <li>Regional bullion associations</li>
            <li>Publicly available market data</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-4">
            While we strive for accuracy, we cannot guarantee that all information is error-free or 
            up-to-date at all times.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed">
            GoldMeter, its owners, employees, and affiliates shall not be held liable for any losses, 
            damages, or claims arising from:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Use of information provided on this website</li>
            <li>Inaccuracies or errors in price data</li>
            <li>Investment decisions based on our content</li>
            <li>Technical issues or service interruptions</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            If you notice any errors in our data or have concerns about the information provided, 
            please contact us at:{" "}
            <a href="mailto:hello@goldmeter.in" className="text-amber-600 hover:text-amber-700">
              hello@goldmeter.in
            </a>
          </p>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              By using GoldMeter, you acknowledge that you have read and understood this disclaimer.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

