/**
 * Pune-specific static content for SEO
 * Comprehensive coverage of gold rates, buying/selling, investment, taxation, and local market insights.
 */

interface PuneStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function PuneStaticContent({ perGram22k, perGram24k }: PuneStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Introduction to Pune Gold Market */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Pune is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Pune gold prices closely follow Mumbai&apos;s IBJA rates with minimal variation. Laxmi Road and 
            Tulsi Baug are the main traditional jewellery markets. Prices are updated from IBJA multiple 
            times daily based on international spot prices.
          </p>
          <p>
            Gold prices in Pune fluctuate based on international spot rates, the US dollar index, and MCX 
            futures market movements. The city&apos;s growing IT sector and young professionals have expanded 
            demand beyond traditional Maharashtrian designs to include contemporary jewellery.
          </p>
        </div>
      </section>

      {/* Gold Rates by Carat */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat: 24K, 22K, and 18K in Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Understanding different carat values is essential for Pune gold buyers:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure gold for investment in coins and bars</li>
            <li><strong>22 Carat Gold Rate (916 Gold)</strong> - 91.6% pure, standard for traditional 
            Maharashtrian jewellery like Kolhapuri Saaj, Thushi, and Nath</li>
            <li><strong>18 Carat Gold Rate</strong> - 75% pure, preferred for diamond-studded contemporary designs</li>
          </ul>
          
          <p>
            Use GoldMeter&apos;s gold rate calculator to compute exact costs including making charges. Traditional 
            Maharashtrian designs typically use 22K gold for durability and rich colour.
          </p>
        </div>
      </section>

      {/* Factors Influencing Gold Prices */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">What Drives Gold Price Movements in Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <div>
            <h3 className="font-semibold text-charcoal">Global Economic Factors:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Dollar Index</strong> - Gold trades inversely to USD</li>
              <li><strong>Federal Reserve Meetings</strong> - Interest rate decisions affect gold&apos;s appeal</li>
              <li><strong>Bond Yields</strong> - Rising yields reduce gold&apos;s attractiveness</li>
              <li><strong>Geopolitical Tensions</strong> - Global conflicts drive investors toward gold</li>
              <li><strong>Inflation Rates</strong> - Gold serves as a traditional inflation hedge</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Domestic Factors:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Currency Exchange Rates</strong> - Rupee depreciation increases gold prices</li>
              <li><strong>Import Duties</strong> - Government customs duty (~15%) adds to cost</li>
              <li><strong>GST</strong> - 3% on gold value, 5% on making charges</li>
              <li><strong>Central Bank Reserves</strong> - RBI gold purchases signal sentiment</li>
              <li><strong>Local Demand</strong> - Gudi Padwa and wedding season drive demand</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Historical Price Trends */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Historical Gold Price Trends in Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Seasonal Patterns</strong> - Prices rise during wedding season and Diwali when 
            Maharashtrian families traditionally purchase gold</li>
            <li><strong>Economic Indicators</strong> - Gold spiked during economic crises as safe-haven</li>
            <li><strong>Moving Averages</strong> - Traders use 50-day and 200-day moving averages</li>
            <li><strong>Forward Booking</strong> - Jewellers offer price-lock facilities</li>
          </ul>
          
          <p>
            Pune&apos;s gold market has grown alongside the city&apos;s economic expansion, with traditional 
            jewellers on Laxmi Road maintaining their significance alongside new branded showrooms.
          </p>
        </div>
      </section>

      {/* Gold Purity and Hallmarking */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Verifying Gold Purity and BIS Hallmarking</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <div>
            <h3 className="font-semibold text-charcoal">Hallmark Components:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>BIS Logo</strong> - Triangle mark for Bureau of Indian Standards certification</li>
              <li><strong>Purity Grade</strong> - 916 for 22K, 750 for 18K, 585 for 14K gold</li>
              <li><strong>HUID</strong> - 6-digit Hallmark Unique Identification number</li>
              <li><strong>Hallmarking Centre Code</strong> - Identifies the testing centre</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Purity Testing Methods:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Visual Inspection</strong> - Check for hallmark stamps and quality</li>
              <li><strong>Karat Machine</strong> - XRF devices for non-destructive testing</li>
              <li><strong>Nitric Acid Test</strong> - Chemical test at assaying centres</li>
              <li><strong>Magnetic Assessment</strong> - Pure gold is non-magnetic</li>
            </ul>
          </div>
          
          <p>
            Pune has multiple BIS-certified hallmarking centres. Always demand invoice transparency 
            with separate listing of gold weight, purity, and making charges.
          </p>
        </div>
      </section>

      {/* Buying Gold in Pune */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Smart Gold Jewellery Buying Tips for Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Check Current Rates</strong> - Verify gold rate on GoldMeter before visiting</li>
            <li><strong>Evaluate Seller Reputation</strong> - Choose established jewellers</li>
            <li><strong>Understand Making Charges</strong> - Range from 8% to 25% based on design</li>
            <li><strong>Insist on Hallmarked Gold</strong> - BIS certification with HUID</li>
            <li><strong>Compare Prices</strong> - Visit Laxmi Road, Deccan, Camp, and malls</li>
            <li><strong>Get Detailed Invoice</strong> - Gold weight, purity, making charges, and GST separately</li>
            <li><strong>Understand Buyback Terms</strong> - Know exchange policies</li>
          </ul>
          
          <p>
            Popular Pune jewellers include Waman Hari Pethe, PNG Jewellers, Tanishq, Malabar Gold, 
            Kalyan Jewellers, and traditional family jewellers on Laxmi Road.
          </p>
        </div>
      </section>

      {/* Selling Gold */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">How to Sell Gold and Scrap Gold in Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Know Current Rates</strong> - Check gold rate before approaching buyers</li>
            <li><strong>Get Multiple Quotes</strong> - Visit 3-4 jewellers for competitive offers</li>
            <li><strong>Carry Original Documents</strong> - Bills fetch better prices</li>
            <li><strong>Understand Deductions</strong> - Expect 3-8% below market for hallmarked gold</li>
            <li><strong>Scrap Gold Value</strong> - Valued by weight and purity after testing</li>
            <li><strong>Exchange vs Cash</strong> - Exchange often provides better value</li>
          </ul>
          
          <p>
            Pune&apos;s competitive market ensures fair pricing. Always witness weighing and purity testing.
          </p>
        </div>
      </section>

      {/* Investment Options */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Investment Options for Pune Investors</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <div>
            <h3 className="font-semibold text-charcoal">Physical Gold:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Gold Coins and Bars</strong> - Minimal making charges (1-3%)</li>
              <li><strong>Gold Jewellery</strong> - Higher making charges but wearable</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Paper and Digital Gold:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Sovereign Gold Bonds (SGBs)</strong> - 2.5% annual interest, tax-free on maturity</li>
              <li><strong>Gold Exchange Traded Funds</strong> - Trade via demat account</li>
              <li><strong>Gold Mutual Funds</strong> - SIP available without demat</li>
              <li><strong>Digital Gold</strong> - Buy from ₹1 via apps</li>
              <li><strong>Gold Futures</strong> - Leverage-based MCX trading</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Other Options:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Gold Monetization Scheme</strong> - Earn interest on deposited gold</li>
              <li><strong>Gold Jewellery Schemes</strong> - Monthly deposits at jewellers</li>
              <li><strong>Systematic Investment Plans</strong> - Regular gold fund investments</li>
            </ul>
          </div>
          
          <p>
            Pune&apos;s IT professionals increasingly use digital gold and gold ETFs for convenience.
          </p>
        </div>
      </section>

      {/* Gold Loans */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loan Facilities in Pune</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Banks</strong> - SBI, HDFC, ICICI, Bank of Maharashtra offer competitive rates</li>
            <li><strong>NBFCs</strong> - Muthoot, Manappuram provide faster processing</li>
            <li><strong>Loan-to-Value</strong> - Typically 75% of gold&apos;s market value</li>
            <li><strong>Documents</strong> - ID proof, address proof, and the gold</li>
            <li><strong>Process</strong> - Same-day disbursement after verification</li>
          </ul>
        </div>
      </section>

      {/* Taxation */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Taxation on Gold Purchases and Sales</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <div>
            <h3 className="font-semibold text-charcoal">On Purchase:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>GST</strong> - 3% on gold value, 5% on making charges</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">On Sale (Capital Gains Tax):</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Short Term</strong> - Within 3 years, taxed at slab rate</li>
              <li><strong>Long Term</strong> - After 3 years, 20% with indexation benefit</li>
              <li><strong>SGBs</strong> - Tax-free capital gains on maturity</li>
              <li><strong>Gold ETFs</strong> - Same rules as physical gold</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Local Market Insights */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Pune Gold Market: Local Insights</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Laxmi Road</strong> - Traditional jewellery hub with competitive prices</li>
            <li><strong>Deccan Area</strong> - Mix of traditional and modern jewellers</li>
            <li><strong>Camp</strong> - Branded showrooms and designer stores</li>
            <li><strong>Koregaon Park/Viman Nagar</strong> - Premium contemporary jewellery</li>
          </ul>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Peak Buying Seasons:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Gudi Padwa</strong> - Maharashtrian New Year; auspicious for gold</li>
              <li><strong>Dhanteras</strong> - Peak buying day across India</li>
              <li><strong>Ganesh Chaturthi</strong> - Festival period with purchases</li>
              <li><strong>Wedding Season</strong> - November to February highest demand</li>
            </ul>
          </div>
          
          <p>
            GoldMeter provides daily updated gold rates for Pune to help verify prices.
          </p>
        </div>
      </section>

      {/* Storage */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Storage and Security Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Bank Lockers</strong> - Most secure option; annual rent varies</li>
            <li><strong>Home Safes</strong> - Fire-resistant options for moderate holdings</li>
            <li><strong>Insurance</strong> - Jewellery-specific policies recommended</li>
            <li><strong>Digital Options</strong> - SGBs and ETFs eliminate storage needs</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Frequently Asked Questions About Pune Gold Rates</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p><strong>How do Pune gold rates compare to Mumbai?</strong><br />
          Pune rates closely follow Mumbai&apos;s IBJA reference prices with minimal variation. Transportation 
          costs may add marginal differences.</p>
          
          <p><strong>Where to get best gold rates in Pune?</strong><br />
          Laxmi Road offers competitive rates due to competition. Compare multiple jewellers and check 
          GoldMeter for current market rates.</p>
          
          <p><strong>What is Kolhapuri Saaj?</strong><br />
          Kolhapuri Saaj is a traditional Maharashtrian necklace featuring geometric gold beads on silk 
          thread. It&apos;s worn by married women and is an essential part of bridal jewellery.</p>
        </div>
      </section>
    </div>
  );
}
