/**
 * Ayodhya-specific static content for SEO
 */

interface AyodhyaStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function AyodhyaStaticContent({ perGram22k, perGram24k }: AyodhyaStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Ayodhya</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Ayodhya is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Ayodhya is the sacred city and birthplace of Lord Ram with a growing gold market driven by 
            religious tourism. With Ram Mandir attracting millions of devotees, demand for religious 
            gold jewellery and coins has increased. Prices are updated from IBJA multiple times daily.
          </p>
          <p>
            Gold prices fluctuate based on global economic conditions and MCX futures market movements. 
            Religious gold coins and temple jewellery are particularly popular here.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Ayodhya</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment coins and temple offerings</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for traditional jewellery</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors Influencing Gold Prices</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve policies, geopolitical events</li>
            <li><strong>Domestic</strong> - Currency exchange, import duties, GST</li>
            <li><strong>Religious Events</strong> - Ram Navami, Diwali see increased gold purchases</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916/750)</li>
            <li>HUID - 6-digit unique identification</li>
            <li>Purchase only from BIS-certified jewellers</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Buying Tips for Ayodhya</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Check rates on GoldMeter before visiting</li>
            <li>Compare prices at local and branded showrooms</li>
            <li>Understand making charges (8-20%)</li>
            <li>For religious coins, verify weight and purity</li>
            <li>Get detailed invoice with gold weight and purity</li>
          </ul>
          <p>For larger purchases, consider visiting nearby Lucknow for more options.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Investment Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Physical gold - coins, bars, jewellery</li>
            <li>Sovereign Gold Bonds - 2.5% interest, tax-free on maturity</li>
            <li>Gold ETFs and mutual funds</li>
            <li>Digital gold via apps</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loans & Taxation</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Banks and NBFCs offer gold loans at 75% LTV</li>
            <li>GST: 3% on gold, 5% on making</li>
            <li>Long-term gains (3+ years): 20% with indexation</li>
          </ul>
          <p>GoldMeter provides daily updated gold rates for Ayodhya.</p>
        </div>
      </section>
    </div>
  );
}
