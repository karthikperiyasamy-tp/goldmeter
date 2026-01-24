/**
 * Surat-specific static content for SEO
 * Comprehensive coverage of gold rates, buying/selling, investment, taxation, and local market insights.
 */

interface SuratStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function SuratStaticContent({ perGram22k, perGram24k }: SuratStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Introduction */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Surat</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Surat is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Surat is the diamond capital of the world with a thriving gold market. Mahidharpura is the main 
            jewellery hub. Prices are updated from IBJA multiple times daily based on international spot 
            prices and USD/INR movements.
          </p>
          <p>
            The city&apos;s prosperous textile and diamond industries drive significant gold demand. Modern showrooms in 
            Athwa and Adajan cater to contemporary tastes. Surat&apos;s wealthy business families traditionally 
            invest heavily in gold.
          </p>
        </div>
      </section>

      {/* Gold Rates by Carat */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat: 24K, 22K, and 18K in Surat</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment coins and bars</li>
            <li><strong>22 Carat Gold Rate (916 Gold)</strong> - 91.6% pure, standard for Gujarati wedding sets</li>
            <li><strong>18 Carat Gold Rate</strong> - 75% pure, popular for diamond-studded jewellery—Surat&apos;s specialty</li>
          </ul>
          <p>Use GoldMeter&apos;s calculator to compute exact costs including making charges.</p>
        </div>
      </section>

      {/* Factors Influencing Prices */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">What Drives Gold Price Movements in Surat</h2>
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
              <li><strong>Local Demand</strong> - Navratri, Diwali, and weddings drive demand</li>
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
          <p>For diamond jewellery, verify both gold hallmark and diamond certification.</p>
        </div>
      </section>

      {/* Buying Tips */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Smart Gold Buying Tips for Surat</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Check Current Rates</strong> - Verify on GoldMeter before visiting</li>
            <li><strong>Diamond-Gold Pieces</strong> - Get separate valuations for gold and diamonds</li>
            <li><strong>Making Charges</strong> - Range 8-20% based on design</li>
            <li><strong>Compare Prices</strong> - Visit Mahidharpura, Athwa, and branded showrooms</li>
          </ul>
          <p>Popular jewellers include Tribhovandas Bhimji Zaveri, Kalyan, Tanishq, and local diamond jewellers.</p>
        </div>
      </section>

      {/* Selling Gold */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">How to Sell Gold in Surat</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Know Current Rates</strong> - Check before approaching buyers</li>
            <li><strong>Diamond Jewellery</strong> - Diamonds and gold valued separately</li>
            <li><strong>Multiple Quotes</strong> - Get 3-4 competitive offers</li>
            <li><strong>Original Documents</strong> - Bills and certificates help</li>
          </ul>
        </div>
      </section>

      {/* Investment Options */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Investment Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Physical Gold</strong> - Coins, bars for pure investment</li>
            <li><strong>Sovereign Gold Bonds</strong> - 2.5% interest, tax-free on maturity</li>
            <li><strong>Gold ETFs</strong> - Trade via demat account</li>
            <li><strong>Digital Gold</strong> - Buy from ₹1 via apps</li>
          </ul>
          <p>Surat&apos;s business community actively invests in both physical gold and gold ETFs.</p>
        </div>
      </section>

      {/* Gold Loans */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loan Facilities</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Banks</strong> - SBI, HDFC, Bank of Baroda offer competitive rates</li>
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
        <h2 className="text-xl font-bold text-charcoal">Surat Gold Market: Local Insights</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Mahidharpura</strong> - Diamond and gold jewellery hub</li>
            <li><strong>Athwa/Adajan</strong> - Modern showrooms</li>
            <li><strong>Peak Seasons</strong> - Navratri, Dhanteras, Diwali, wedding season</li>
          </ul>
          <p>GoldMeter provides daily updated gold rates for Surat.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Frequently Asked Questions</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p><strong>Is Surat good for diamond-gold jewellery?</strong><br />
          Yes, Surat is the world&apos;s diamond cutting hub, offering excellent prices on diamond-studded gold.</p>
          
          <p><strong>How do Surat rates compare to Ahmedabad?</strong><br />
          Rates closely follow IBJA prices with minimal variation between cities.</p>
        </div>
      </section>
    </div>
  );
}
