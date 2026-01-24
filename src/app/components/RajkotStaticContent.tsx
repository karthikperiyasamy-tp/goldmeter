/**
 * Rajkot-specific static content for SEO
 */

interface RajkotStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function RajkotStaticContent({ perGram22k, perGram24k }: RajkotStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Rajkot</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Rajkot is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Rajkot is Gujarat&apos;s fourth-largest city with a thriving gold market driven by the prosperous 
            Saurashtra business community. Soni Bazaar and Yagnik Road are the main jewellery hubs. 
            Prices are updated from IBJA multiple times daily.
          </p>
          <p>
            Rajkot is famous for both gold and imitation jewellery manufacturing, with traditional Gujarati 
            designs being particularly popular.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Rajkot</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for Gujarati wedding jewellery</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors & Peak Seasons</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve, geopolitical tensions</li>
            <li><strong>Peak Seasons</strong> - Navratri, Dhanteras, Diwali, wedding season</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking & Buying Tips</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916/750) and HUID required</li>
            <li>Check rates on GoldMeter before visiting</li>
            <li>Compare prices at Soni Bazaar and branded showrooms</li>
          </ul>
          <p>Popular jewellers: Tribhovandas Bhimji Zaveri, Tanishq, Kalyan, and local Soni Bazaar jewellers.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Investment & Loans</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Physical gold, SGBs, Gold ETFs, Digital gold available</li>
            <li>Gold loans from banks and NBFCs at 75% LTV</li>
            <li>GST: 3% on gold, 5% on making; Long-term: 20% with indexation</li>
          </ul>
          <p>GoldMeter provides daily updated gold rates for Rajkot.</p>
        </div>
      </section>
    </div>
  );
}
