/**
 * Tirunelveli-specific static content for SEO
 */

interface TirunelveliStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function TirunelveliStaticContent({ perGram22k, perGram24k }: TirunelveliStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Tirunelveli</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Tirunelveli is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Tirunelveli is a historic city in southern Tamil Nadu serving the Nellai region. South Car Street 
            and Palayamkottai are the main jewellery hubs. Prices are updated from IBJA multiple times daily.
          </p>
          <p>
            The city offers authentic Tamil temple jewellery at competitive prices. Its proximity to 
            Nagercoil and Kanyakumari makes it a regional gold trading center.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Tirunelveli</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment in coins and bars</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for Tamil temple jewellery and bridal sets</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded and contemporary designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors Influencing Gold Prices</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve decisions, geopolitical tensions</li>
            <li><strong>Domestic</strong> - Currency exchange, import duties, GST, local demand</li>
            <li><strong>Peak Seasons</strong> - Pongal, Deepavali, temple festivals, Tamil wedding season</li>
            <li><strong>Regional Factors</strong> - Tirunelveli rates often lower than Chennai due to lower overhead costs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916 for 22K, 750 for 18K)</li>
            <li>HUID - 6-digit Hallmark Unique Identification number</li>
            <li>Tamil Nadu Hallmarking Center serves Tirunelveli via Madurai office</li>
            <li>Purchase only from BIS-certified jewellers</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Buying Tips for Tirunelveli</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Check rates on GoldMeter before visiting</li>
            <li>Compare prices on South Car Street and branded showrooms</li>
            <li>Understand making charges (8-18%); Tirunelveli often has lower charges than metro cities</li>
            <li>Get detailed invoice with gold weight, purity, and GST breakdown</li>
          </ul>
          <p>Popular jewellers: GRT, Thangamayil, Lalitha Jewellery, Kalyan, and traditional family jewellers on South Car Street.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Investment Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Physical gold - coins, bars, and jewellery</li>
            <li>Sovereign Gold Bonds - 2.5% annual interest, tax-free on maturity</li>
            <li>Gold ETFs and mutual funds</li>
            <li>Digital gold via apps</li>
            <li>Gold schemes at local jewellers with monthly deposits</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loans & Taxation</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Banks and NBFCs (Muthoot, Manappuram) offer gold loans at 75% LTV</li>
            <li>GST: 3% on gold value, 5% on making charges</li>
            <li>Short-term gains (within 3 years): Taxed at income slab rate</li>
            <li>Long-term capital gains (3+ years): 20% with indexation benefit</li>
          </ul>
          <p>GoldMeter provides daily updated gold rates for Tirunelveli and all Tamil Nadu cities.</p>
        </div>
      </section>
    </div>
  );
}
