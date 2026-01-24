/**
 * Kerala-specific static content for SEO
 * Comprehensive coverage of gold rates, buying/selling, investment, taxation, and local market insights.
 */

interface KeralaStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function KeralaStaticContent({ perGram22k, perGram24k }: KeralaStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Introduction to Kerala Gold Market */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Kerala</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Kerala is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Kerala has the highest per capita gold consumption in India. Thrissur is known as Kerala&apos;s gold 
            capital, home to Kalyan Jewellers and Joyalukkas. Prices are updated from IBJA multiple times daily 
            based on international spot prices.
          </p>
          <p>
            The state&apos;s deep cultural connection with gold dates back to ancient maritime trade routes. From 
            elaborate bridal sets weighing kilograms to daily-wear ornaments, gold is integral to Malayali identity.
          </p>
        </div>
      </section>

      {/* Gold Rates by Carat */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat: 24K, 22K, and 18K in Kerala</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Understanding different carat values is essential for Kerala gold buyers:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure gold for investment in coins and bars</li>
            <li><strong>22 Carat Gold Rate (916 Gold)</strong> - 91.6% pure, the standard for traditional 
            Kerala bridal jewellery like Manga Mala, Kasumalai, and Palakka</li>
            <li><strong>18 Carat Gold Rate</strong> - 75% pure, used for diamond-studded contemporary designs</li>
          </ul>
          
          <p>
            Use GoldMeter&apos;s gold rate calculator to compute exact costs including making charges. Kerala&apos;s 
            tradition of heavy bridal gold (often 100+ sovereigns) makes 22K gold particularly significant.
          </p>
        </div>
      </section>

      {/* Factors Influencing Gold Prices */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">What Drives Gold Price Movements in Kerala</h2>
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
              <li><strong>NRI Remittances</strong> - Gulf NRI demand significantly impacts Kerala market</li>
              <li><strong>Local Demand</strong> - Onam, Vishu, and wedding season drive massive demand</li>
            </ul>
          </div>
          
          <p>
            Kerala&apos;s unique NRI remittance economy means gold purchases often correlate with Gulf oil 
            prices and Indian expatriate income trends.
          </p>
        </div>
      </section>

      {/* Historical Price Trends */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Historical Gold Price Trends in Kerala</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Seasonal Patterns</strong> - Prices rise during wedding season (November-May) 
            when Malayali families purchase extensive bridal collections</li>
            <li><strong>Festival Impact</strong> - Onam and Vishu see significant buying activity</li>
            <li><strong>Moving Averages</strong> - Traders use 50-day and 200-day moving averages</li>
            <li><strong>Forward Booking</strong> - Most Kerala jewellers offer price-lock facilities 
            essential for planning elaborate wedding purchases</li>
          </ul>
          
          <p>
            Kerala&apos;s gold market has grown alongside Gulf migration, with NRI remittances often 
            converted to gold as a store of value and social status symbol.
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
            Kerala was among the first states to adopt widespread hallmarking. The India Bullion Association 
            recommends purchasing only from BIS-certified jewellers.
          </p>
        </div>
      </section>

      {/* Buying Gold in Kerala */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Smart Gold Jewellery Buying Tips for Kerala</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Check Current Rates</strong> - Verify gold rate on GoldMeter before visiting</li>
            <li><strong>Evaluate Seller Reputation</strong> - Choose established jewellers</li>
            <li><strong>Understand Making Charges</strong> - Range from 8% to 20%; temple jewellery 
            and intricate designs command higher charges</li>
            <li><strong>Insist on Hallmarked Gold</strong> - BIS certification with HUID mandatory</li>
            <li><strong>Compare Prices</strong> - Visit Thrissur, Kochi, Trivandrum showrooms</li>
            <li><strong>Get Detailed Invoice</strong> - Gold weight, purity, making charges, and GST separately</li>
            <li><strong>Understand Buyback Terms</strong> - Most Kerala jewellers offer lifetime exchange</li>
          </ul>
          
          <p>
            Leading Kerala jewellers include Kalyan Jewellers, Joyalukkas, Bhima, Jos Alukkas, Malabar Gold, 
            Chemmanur, and AVR Swarna Mahal—many founded in Thrissur and now global brands.
          </p>
        </div>
      </section>

      {/* Selling Gold */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">How to Sell Gold and Scrap Gold in Kerala</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Know Current Rates</strong> - Check gold rate before approaching buyers</li>
            <li><strong>Get Multiple Quotes</strong> - Visit 3-4 jewellers for competitive offers</li>
            <li><strong>Carry Original Documents</strong> - Bills fetch better prices</li>
            <li><strong>Understand Deductions</strong> - Expect 3-8% below market for hallmarked gold</li>
            <li><strong>Exchange Option</strong> - Most Kerala families exchange old for new designs</li>
            <li><strong>Scrap Gold Value</strong> - Valued by weight and purity after testing</li>
          </ul>
          
          <p>
            Kerala&apos;s competitive jewellery market ensures fair pricing. Exchange offers are often 
            better than outright sale due to high turnover volumes.
          </p>
        </div>
      </section>

      {/* Investment Options */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Investment Options for Kerala Investors</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <div>
            <h3 className="font-semibold text-charcoal">Physical Gold:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Gold Coins and Bars</strong> - Minimal making charges (1-3%)</li>
              <li><strong>Gold Jewellery</strong> - Serves cultural and investment purposes</li>
              <li><strong>Gold Schemes</strong> - Kerala jewellers pioneered monthly purchase schemes</li>
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
              <li><strong>Gold Monetization Scheme</strong> - Deposit idle gold, earn interest</li>
              <li><strong>Chitty Funds</strong> - Traditional Kerala saving scheme often converted to gold</li>
              <li><strong>Jewellery Schemes</strong> - Monthly deposits at jewellers—very popular in Kerala</li>
            </ul>
          </div>
          
          <p>
            Kerala&apos;s gold jewellery purchase schemes (advance payment with monthly installments) 
            are extremely popular, pioneered by local jewellers before national expansion.
          </p>
        </div>
      </section>

      {/* Gold Loans */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loan Facilities in Kerala</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Kerala is India&apos;s largest gold loan market, with Muthoot Finance and Manappuram Finance 
            both headquartered here:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>NBFCs</strong> - Muthoot and Manappuram dominate with dense branch networks</li>
            <li><strong>Banks</strong> - Federal Bank, South Indian Bank, SBI offer competitive rates</li>
            <li><strong>Loan-to-Value</strong> - Typically 75% of gold&apos;s market value</li>
            <li><strong>Documents</strong> - ID proof, address proof, and the gold</li>
            <li><strong>Process</strong> - Same-day (often within hours) disbursement</li>
          </ul>
          
          <p>
            Gold loans are culturally accepted in Kerala as temporary liquidity solutions rather than 
            distress sales of family gold.
          </p>
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
          
          <p>
            Maintain all purchase invoices for capital gains calculation. NRIs have specific tax 
            provisions—consult a tax professional.
          </p>
        </div>
      </section>

      {/* Local Market Insights */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Kerala Gold Market: Local Insights</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Thrissur</strong> - Kerala&apos;s gold capital; headquarters of major jewellers</li>
            <li><strong>Kochi/Ernakulam</strong> - Major retail hub with numerous showrooms</li>
            <li><strong>Trivandrum</strong> - State capital with premium jewellers</li>
            <li><strong>Kozhikode</strong> - North Kerala&apos;s main gold market</li>
          </ul>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Peak Buying Seasons:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Onam</strong> - Kerala&apos;s harvest festival; massive gold sales</li>
              <li><strong>Vishu</strong> - Malayalam New Year; auspicious for gold</li>
              <li><strong>Dhanteras</strong> - Pan-India buying day</li>
              <li><strong>Wedding Season</strong> - November to May sees highest demand</li>
            </ul>
          </div>
          
          <p>
            GoldMeter provides daily updated gold rates for Kerala to help verify prices.
          </p>
        </div>
      </section>

      {/* Storage */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Storage and Security Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Bank Lockers</strong> - Most secure; high demand in Kerala</li>
            <li><strong>Home Safes</strong> - Fire-resistant options for moderate holdings</li>
            <li><strong>Insurance</strong> - Jewellery-specific policies essential for large holdings</li>
            <li><strong>Digital Options</strong> - SGBs and ETFs eliminate storage concerns</li>
          </ul>
          
          <p>
            Given Kerala&apos;s high gold ownership, bank locker demand is significant. Many families 
            maintain insurance specifically for jewellery collections.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Frequently Asked Questions About Kerala Gold Rates</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p><strong>Why is gold so important in Kerala culture?</strong><br />
          Gold symbolizes prosperity, status, and is central to wedding traditions. A bride&apos;s gold 
          reflects family wealth and remains her personal asset.</p>
          
          <p><strong>What is a sovereign in Kerala?</strong><br />
          A sovereign (Pavan in Malayalam) equals 8 grams of gold. Kerala bridal gold is traditionally 
          measured in sovereigns (e.g., &quot;50 sovereign wedding set&quot;).</p>
          
          <p><strong>Are Kerala gold rates different from other states?</strong><br />
          Rates follow national IBJA prices closely. Competition among major jewellers ensures 
          competitive pricing in Kerala.</p>
          
          <p><strong>What is a gold purchase scheme?</strong><br />
          Monthly payment schemes where you deposit fixed amounts for 11 months and buy gold in the 
          12th month with bonus—pioneered by Kerala jewellers.</p>
        </div>
      </section>
    </div>
  );
}
