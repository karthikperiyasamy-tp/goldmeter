/**
 * Chandigarh-specific static content for SEO
 * Comprehensive coverage of gold rates, buying/selling, investment, taxation, and local market insights.
 */

interface ChandigarhStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function ChandigarhStaticContent({ perGram22k, perGram24k }: ChandigarhStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Introduction */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Chandigarh</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Chandigarh is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Chandigarh serves as the gold market hub for Punjab, Haryana, and Himachal Pradesh. Sector 17 
            and 22 are the main jewellery markets. Prices are updated from IBJA multiple times daily based 
            on international spot prices.
          </p>
          <p>
            The prosperous Punjabi and Haryanvi communities drive strong gold demand, particularly for elaborate 
            bridal sets and traditional Kundan jewellery. Gold prices fluctuate based on global economic 
            conditions and MCX futures market movements.
          </p>
        </div>
      </section>

      {/* Gold Rates by Carat */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat: 24K, 22K, and 18K in Chandigarh</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment coins and bars</li>
            <li><strong>22 Carat Gold Rate (916 Gold)</strong> - 91.6% pure, standard for Punjabi bridal jewellery</li>
            <li><strong>18 Carat Gold Rate</strong> - 75% pure, used for Kundan and diamond-studded designs</li>
          </ul>
          <p>Use GoldMeter&apos;s calculator to compute exact costs including making charges.</p>
        </div>
      </section>

      {/* Factors Influencing Prices */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">What Drives Gold Price Movements in Chandigarh</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <div>
            <h3 className="font-semibold text-charcoal">Global Factors:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Dollar Index</strong> - Gold trades inversely to USD</li>
              <li><strong>Federal Reserve</strong> - Interest rate decisions affect gold</li>
              <li><strong>Geopolitical Tensions</strong> - Drive safe-haven demand</li>
            </ul>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Domestic Factors:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Currency Exchange</strong> - Rupee depreciation increases prices</li>
              <li><strong>Import Duties</strong> - ~15% customs duty</li>
              <li><strong>GST</strong> - 3% on gold, 5% on making</li>
              <li><strong>Local Demand</strong> - Lohri, Baisakhi, and wedding season drive demand</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Purity and Hallmarking */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Verifying Gold Purity and BIS Hallmarking</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>BIS Logo</strong> - Triangle certification mark</li>
            <li><strong>Purity Grade</strong> - 916 for 22K, 750 for 18K</li>
            <li><strong>HUID</strong> - 6-digit unique identification</li>
          </ul>
          <p>Purchase only from BIS-certified jewellers with proper hallmarking.</p>
        </div>
      </section>

      {/* Buying Tips */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Smart Gold Buying Tips for Chandigarh</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Check Current Rates</strong> - Verify on GoldMeter before visiting</li>
            <li><strong>Making Charges</strong> - Range 8-25% based on design; Kundan higher</li>
            <li><strong>Compare Prices</strong> - Visit Sector 17, 22, and branded showrooms</li>
            <li><strong>Get Detailed Invoice</strong> - Gold weight, purity, charges separately</li>
          </ul>
          <p>Popular jewellers include PC Jeweller (headquartered here), Tanishq, Kalyan, and Amritsar jewellers.</p>
        </div>
      </section>

      {/* Selling Gold */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">How to Sell Gold in Chandigarh</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Know Current Rates</strong> - Check before approaching buyers</li>
            <li><strong>Multiple Quotes</strong> - Get 3-4 competitive offers</li>
            <li><strong>Original Documents</strong> - Bills fetch better prices</li>
            <li><strong>Exchange vs Cash</strong> - Exchange often better value</li>
          </ul>
        </div>
      </section>

      {/* Investment Options */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Investment Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Physical Gold</strong> - Coins, bars, jewellery</li>
            <li><strong>Sovereign Gold Bonds</strong> - 2.5% interest, tax-free on maturity</li>
            <li><strong>Gold ETFs</strong> - Trade via demat account</li>
            <li><strong>Digital Gold</strong> - Buy from ₹1 via apps</li>
          </ul>
        </div>
      </section>

      {/* Gold Loans */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loan Facilities</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Banks</strong> - SBI, HDFC, PNB offer competitive rates</li>
            <li><strong>NBFCs</strong> - Muthoot, Manappuram with fast processing</li>
            <li><strong>LTV</strong> - Typically 75% of gold&apos;s value</li>
          </ul>
        </div>
      </section>

      {/* Taxation */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Taxation on Gold</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>GST</strong> - 3% on gold, 5% on making</li>
            <li><strong>Short Term</strong> - Within 3 years, at slab rate</li>
            <li><strong>Long Term</strong> - After 3 years, 20% with indexation</li>
          </ul>
        </div>
      </section>

      {/* Local Insights */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Chandigarh Gold Market: Local Insights</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Sector 17</strong> - Main commercial hub with major jewellers</li>
            <li><strong>Sector 22</strong> - Traditional jewellery shops</li>
            <li><strong>Peak Seasons</strong> - Lohri, Baisakhi, Karva Chauth, wedding season</li>
          </ul>
          <p>GoldMeter provides daily updated gold rates for Chandigarh.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Frequently Asked Questions</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p><strong>How do Chandigarh rates compare to Delhi?</strong><br />
          Rates closely follow Delhi/IBJA prices with minimal variation.</p>
          
          <p><strong>Best place for Punjabi bridal jewellery?</strong><br />
          Sector 17 and 22 have extensive collections; also consider Amritsar jewellers&apos; branches.</p>
        </div>
      </section>
    </div>
  );
}
