/**
 * Nagpur-specific static content for SEO
 */

interface NagpurStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function NagpurStaticContent({ perGram22k, perGram24k }: NagpurStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Nagpur</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Nagpur is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Nagpur is central India&apos;s commercial hub and Maharashtra&apos;s second capital. Sitabuldi and 
            Itwari are the main jewellery markets. Prices are updated from IBJA multiple times daily based 
            on international spot prices.
          </p>
          <p>
            The city serves buyers from Vidarbha and neighboring states. Traditional Maharashtrian and 
            Central Indian designs are popular alongside contemporary styles.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Nagpur</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for traditional Maharashtrian jewellery</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors & Peak Seasons</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve, geopolitical tensions</li>
            <li><strong>Domestic</strong> - Currency exchange, import duties, GST</li>
            <li><strong>Peak Seasons</strong> - Gudi Padwa, Diwali, Dhanteras, wedding season</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking & Buying Tips</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916/750) and HUID required</li>
            <li>Check rates on GoldMeter before visiting</li>
            <li>Compare prices at Sitabuldi, Itwari, and branded showrooms</li>
            <li>Understand making charges (8-20%)</li>
          </ul>
          <p>Popular jewellers: PNG, Tanishq, Kalyan, Malabar Gold, and local traditional jewellers.</p>
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
          <p>GoldMeter provides daily updated gold rates for Nagpur.</p>
        </div>
      </section>
    </div>
  );
}
