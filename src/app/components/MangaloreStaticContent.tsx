/**
 * Mangalore-specific static content for SEO
 */

interface MangaloreStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function MangaloreStaticContent({ perGram22k, perGram24k }: MangaloreStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Mangalore</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Mangalore is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Mangalore has a thriving gold market with Hampankatta and Car Street being the main jewellery 
            hubs. The NRI population from the Gulf significantly boosts demand. Prices are updated from 
            IBJA multiple times daily.
          </p>
          <p>
            Traditional jewellers offer Tulu and Konkani-style designs. NRI remittances significantly boost 
            gold demand during festival and wedding seasons.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Mangalore</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for traditional jewellery</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors Influencing Gold Prices</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve, geopolitical tensions</li>
            <li><strong>NRI Factor</strong> - Gulf remittances impact local gold demand</li>
            <li><strong>Peak Seasons</strong> - Dasara, Diwali, wedding season drive demand</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking & Buying Tips</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916/750) and HUID</li>
            <li>Check rates on GoldMeter before visiting</li>
            <li>Compare prices at Hampankatta and branded showrooms</li>
            <li>Understand making charges (8-20%)</li>
          </ul>
          <p>Popular jewellers: Joyalukkas, Malabar Gold, Bhima, Tanishq, and local traditional jewellers.</p>
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
          <p>GoldMeter provides daily updated gold rates for Mangalore.</p>
        </div>
      </section>
    </div>
  );
}
