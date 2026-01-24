/**
 * Moodbidri-specific static content for SEO
 */

interface MoodbidriStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function MoodbidriStaticContent({ perGram22k, perGram24k }: MoodbidriStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Moodbidri</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Moodbidri is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Moodbidri, known as &quot;Jain Kashi&quot; for its 18 historic Jain temples, has a growing gold 
            market. Located 35 km from Mangalore, prices closely follow IBJA and Karnataka Bullion Association rates.
          </p>
          <p>
            The town serves Jain pilgrims and local residents with traditional South Canara designs. 
            Gold prices are updated multiple times daily.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Moodbidri</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment and coins</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for traditional South Canara jewellery</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded and modern designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors Influencing Gold Prices</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve, geopolitical tensions</li>
            <li><strong>Regional</strong> - Mangalore market trends, Karnataka demand patterns</li>
            <li><strong>Peak Seasons</strong> - Jain festivals, Deepavali, wedding season drive demand</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking & Buying Tips</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916/750) and HUID mandatory</li>
            <li>Check rates on GoldMeter before visiting</li>
            <li>Compare prices with Mangalore stores for best deals</li>
            <li>Understand making charges (8-18%)</li>
          </ul>
          <p>For wider selection, visit Mangalore&apos;s Car Street with Bhima, Joyalukkas, and Tanishq showrooms.</p>
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
          <p>GoldMeter provides daily updated gold rates for Moodbidri and nearby cities.</p>
        </div>
      </section>
    </div>
  );
}
