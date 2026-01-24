/**
 * Delhi-specific static content for SEO
 * Comprehensive coverage of gold rates, buying/selling, investment, taxation, and local market insights.
 */

interface DelhiStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function DelhiStaticContent({ perGram22k, perGram24k }: DelhiStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Introduction to Delhi Gold Market */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Delhi is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Delhi gold prices serve as a benchmark for North India, with Chandni Chowk and Karol Bagh being 
            the main jewellery markets. Rates are updated from IBJA multiple times daily based on international 
            spot prices and USD/INR movements.
          </p>
          <p>
            Gold prices in Delhi fluctuate based on global economic conditions, currency exchange rates, and 
            trading on the Multi Commodity Exchange (MCX) futures market. From traditional Kundan sets in 
            Dariba Kalan to contemporary designs in premium malls, Delhi offers diverse options for gold buyers.
          </p>
        </div>
      </section>

      {/* Gold Rates by Carat */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat: 24K, 22K, and 18K in Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Understanding different carat values is essential for Delhi gold buyers. The gold price per gram 
            varies based on purity:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure gold, primarily used for investment in gold coins 
            and gold bars. This is the benchmark against which other purities are calculated.</li>
            <li><strong>22 Carat Gold Rate (916 Gold)</strong> - 91.6% pure gold, the standard for traditional 
            North Indian bridal jewellery including heavy necklaces and elaborate sets.</li>
            <li><strong>18 Carat Gold Rate</strong> - 75% pure gold, preferred for diamond-studded contemporary 
            designs and lightweight daily-wear pieces.</li>
          </ul>
          
          <p>
            Use GoldMeter&apos;s gold rate calculator to compute exact costs including making charges. Delhi&apos;s 
            diverse population drives demand for various styles from traditional Kundan to modern designs.
          </p>
        </div>
      </section>

      {/* Factors Influencing Gold Prices */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">What Drives Gold Price Movements in Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Multiple factors influence daily gold rate fluctuations in Delhi:
          </p>
          
          <div>
            <h3 className="font-semibold text-charcoal">Global Economic Factors:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Dollar Index</strong> - Gold trades inversely to USD; currency movements impact prices</li>
              <li><strong>Federal Reserve Meetings</strong> - Interest rate decisions affect gold&apos;s safe-haven appeal</li>
              <li><strong>Bond Yields</strong> - Rising yields reduce gold&apos;s investment attractiveness</li>
              <li><strong>Geopolitical Tensions</strong> - Global conflicts drive investors toward gold</li>
              <li><strong>Inflation Rates</strong> - Gold serves as a traditional inflation hedge</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Domestic Factors:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Currency Exchange Rates</strong> - Rupee depreciation increases gold prices in India</li>
              <li><strong>Import Duties</strong> - Government customs duty (~15%) adds to landed cost</li>
              <li><strong>GST</strong> - 3% Goods and Services Tax on gold value</li>
              <li><strong>Central Bank Reserves</strong> - RBI gold purchases signal market sentiment</li>
              <li><strong>Local Demand and Supply</strong> - Wedding season and festivals drive Delhi demand</li>
            </ul>
          </div>
          
          <p>
            Delhi traders monitor RBI monetary policy announcements and Federal Reserve meetings to anticipate 
            gold price movements and time their purchases accordingly.
          </p>
        </div>
      </section>

      {/* Historical Price Trends */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Historical Gold Price Trends in Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Analysing historical gold price trends helps investors time purchases. Gold in Delhi has shown 
            significant appreciation over the past decade:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Seasonal Patterns</strong> - Prices rise during wedding season (October-February) 
            and festivals like Diwali and Karva Chauth</li>
            <li><strong>Economic Indicators</strong> - Gold spiked during economic crises as investors sought 
            safe-haven assets amid market volatility</li>
            <li><strong>Moving Averages</strong> - Technical traders use 50-day and 200-day moving averages 
            to identify optimal entry points</li>
            <li><strong>Forward Booking</strong> - Many Delhi jewellers offer price-lock facilities for 
            customers planning wedding purchases</li>
          </ul>
          
          <p>
            The history of gold trade in Delhi&apos;s Chandni Chowk spans centuries, with Dariba Kalan remaining 
            India&apos;s premier destination for traditional jewellery.
          </p>
        </div>
      </section>

      {/* Gold Purity and Hallmarking */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Verifying Gold Purity and BIS Hallmarking</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            BIS hallmarking is mandatory for gold jewellery sold in India. Understanding hallmark symbols 
            protects Delhi buyers:
          </p>
          
          <div>
            <h3 className="font-semibold text-charcoal">Hallmark Components:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>BIS Logo</strong> - Triangle mark indicating Bureau of Indian Standards certification</li>
              <li><strong>Purity Grade</strong> - 916 for 22K, 750 for 18K, 585 for 14K gold</li>
              <li><strong>HUID</strong> - 6-digit Hallmark Unique Identification number for traceability</li>
              <li><strong>Hallmarking Centre Code</strong> - Identifies the testing and assaying centre</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Purity Testing Methods:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Visual Inspection</strong> - Check for hallmark stamps and quality finish</li>
              <li><strong>Karat Machine</strong> - Electronic XRF devices for quick non-destructive testing</li>
              <li><strong>Nitric Acid Test</strong> - Chemical test at assaying centres</li>
              <li><strong>Magnetic Assessment</strong> - Pure gold is non-magnetic</li>
            </ul>
          </div>
          
          <p>
            The Indian Bullion Association recommends purchasing only from BIS-certified jewellers. Delhi NCR 
            has multiple hallmarking centres for gold authenticity verification.
          </p>
        </div>
      </section>

      {/* Buying Gold in Delhi */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Smart Gold Jewellery Buying Tips for Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Whether buying for personal consumption or investment, follow these gold jewellery buying tips:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Check Current Rates</strong> - Verify today&apos;s gold rate on GoldMeter before visiting jewellers</li>
            <li><strong>Evaluate Seller Reputation</strong> - Choose established jewellers with transparent pricing</li>
            <li><strong>Understand Making Charges</strong> - Range from 8% to 25% based on design; Kundan work commands premium</li>
            <li><strong>Insist on Hallmarked Gold</strong> - Only purchase BIS-certified jewellery with HUID</li>
            <li><strong>Compare Prices</strong> - Visit Chandni Chowk, Karol Bagh, South Extension, and malls</li>
            <li><strong>Get Detailed Invoice</strong> - Bill must itemize gold weight, purity, making charges, and GST</li>
            <li><strong>Understand Buyback Terms</strong> - Know the jeweller&apos;s exchange and buyback policies</li>
          </ul>
          
          <p>
            Popular Delhi jewellers include Tanishq, PC Jeweller, Kalyan Jewellers, Malabar Gold, and 
            traditional family jewellers in Dariba Kalan known for Kundan and Polki work.
          </p>
        </div>
      </section>

      {/* Selling Gold */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">How to Sell Gold and Scrap Gold in Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            When selling gold or scrap gold in Delhi, understanding gold jewellery resale prices maximizes returns:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Know Current Rates</strong> - Check gold rate before approaching buyers</li>
            <li><strong>Get Multiple Quotes</strong> - Visit at least 3-4 jewellers for competitive offers</li>
            <li><strong>Carry Original Documents</strong> - Bills prove authenticity and fetch better prices</li>
            <li><strong>Understand Deductions</strong> - Expect 3-8% below market rate for hallmarked gold</li>
            <li><strong>Scrap Gold Value</strong> - Broken jewellery valued by weight and purity after melting</li>
            <li><strong>Exchange vs Cash</strong> - Exchange purchases often provide better value</li>
          </ul>
          
          <p>
            Delhi&apos;s competitive market ensures fair pricing. Chandni Chowk&apos;s bullion traders offer 
            competitive rates for scrap gold. Always witness weighing and purity testing.
          </p>
        </div>
      </section>

      {/* Investment Options */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Investment Options for Delhi Investors</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Beyond physical jewellery, Delhi investors have multiple gold investment avenues:
          </p>
          
          <div>
            <h3 className="font-semibold text-charcoal">Physical Gold:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Gold Coins and Bars</strong> - Available in 1g to 100g; minimal making charges (1-3%)</li>
              <li><strong>Gold Jewellery</strong> - Higher making charges but serves dual purpose</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Paper and Digital Gold:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Sovereign Gold Bonds (SGBs)</strong> - Government-backed, 2.5% annual interest, 
              tax-free capital gains on maturity</li>
              <li><strong>Gold Exchange Traded Funds (ETFs)</strong> - Trade like stocks; one gold ETF unit 
              equals ~1 gram; requires demat account</li>
              <li><strong>Gold Mutual Funds</strong> - Invest in gold ETFs without demat; SIP available</li>
              <li><strong>Digital Gold</strong> - Buy from ₹1 via apps; stored in insured vaults</li>
              <li><strong>Gold Futures</strong> - Leverage-based trading on MCX futures market</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Other Options:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Gold Monetization Scheme</strong> - Deposit idle gold with banks, earn interest</li>
              <li><strong>Gold Jewellery Schemes</strong> - Monthly deposits at jewellers for future purchase</li>
              <li><strong>Systematic Investment Plans</strong> - Regular investment in gold mutual funds</li>
            </ul>
          </div>
          
          <p>
            Delhi&apos;s proximity to NSE and financial markets makes gold ETFs and futures particularly accessible. 
            Sovereign Gold Bonds offer best risk-adjusted returns for long-term investors.
          </p>
        </div>
      </section>

      {/* Gold Loans */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loan Facilities in Delhi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Gold-backed loans offer quick liquidity without selling precious metal:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Banks</strong> - SBI, HDFC, ICICI, PNB offer gold loans at competitive rates</li>
            <li><strong>NBFCs</strong> - Muthoot Finance, Manappuram Finance provide faster processing</li>
            <li><strong>Loan-to-Value Ratios</strong> - Typically 75% of gold&apos;s market value</li>
            <li><strong>Documents Required</strong> - ID proof, address proof, and the gold itself</li>
            <li><strong>Gold Loan Process</strong> - Usually same-day disbursement after purity verification</li>
          </ul>
          
          <p>
            Delhi NCR&apos;s competitive lending market ensures attractive interest rates. Compare across 
            gold loan companies for best terms.
          </p>
        </div>
      </section>

      {/* Taxation */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Taxation on Gold Purchases and Sales</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Understanding tax implications is crucial for gold investors:
          </p>
          
          <div>
            <h3 className="font-semibold text-charcoal">On Purchase:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>GST</strong> - 3% on gold value, 5% on making charges</li>
              <li><strong>No Wealth Tax</strong> - Abolished since 2016</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">On Sale (Capital Gains Tax):</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Short Term Capital Gains Tax</strong> - Sold within 3 years, taxed at slab rate</li>
              <li><strong>Long Term Capital Gains Tax</strong> - Held over 3 years, 20% with indexation benefit</li>
              <li><strong>Indexation Benefit</strong> - Adjusts cost for inflation, reducing tax burden</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Tax Treatment by Investment Type:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Sovereign Gold Bonds</strong> - Interest taxable; capital gains tax-free on maturity</li>
              <li><strong>Gold ETFs</strong> - Same capital gains rules as physical gold</li>
              <li><strong>Digital Gold</strong> - Taxed as physical gold</li>
            </ul>
          </div>
          
          <p>
            Maintain all purchase invoices as documents for capital gains calculation.
          </p>
        </div>
      </section>

      {/* Local Market Insights */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Delhi Gold Market: Local Insights</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Delhi&apos;s gold market spans historic and modern shopping destinations:
          </p>
          
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Chandni Chowk & Dariba Kalan</strong> - Historic wholesale market; traditional Kundan jewellery</li>
            <li><strong>Karol Bagh</strong> - Popular retail destination with competitive pricing</li>
            <li><strong>South Extension & GK</strong> - Upscale boutiques and designer stores</li>
            <li><strong>Daily Fluctuations</strong> - Rates update multiple times tracking global markets</li>
          </ul>
          
          <div className="mt-3">
            <h3 className="font-semibold text-charcoal">Peak Buying Seasons:</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Karva Chauth</strong> - Major gold buying occasion in North India</li>
              <li><strong>Dhanteras</strong> - Peak buying day across India</li>
              <li><strong>Akshaya Tritiya</strong> - Pan-India auspicious day</li>
              <li><strong>Wedding Season</strong> - October to February sees highest demand</li>
            </ul>
          </div>
          
          <p>
            GoldMeter provides daily updated gold rates for Delhi to help verify prices and make informed decisions.
          </p>
        </div>
      </section>

      {/* Storage and Security */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Storage and Security Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Bank Lockers</strong> - Most secure option; annual rent varies by size</li>
            <li><strong>Home Safes</strong> - Fire-resistant, wall-mounted safes for moderate holdings</li>
            <li><strong>Insurance</strong> - Specific jewellery policies recommended</li>
            <li><strong>Documentation</strong> - Keep invoices, photos, and appraisals for claims</li>
            <li><strong>Digital Options</strong> - SGBs and ETFs eliminate storage concerns</li>
          </ul>
        </div>
      </section>

      {/* FAQ Summary */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Frequently Asked Questions About Delhi Gold Rates</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p><strong>How often do gold rates change in Delhi?</strong><br />
          Gold rates change multiple times daily based on international market movements. Check GoldMeter for updates.</p>
          
          <p><strong>Is Chandni Chowk cheaper than mall showrooms?</strong><br />
          Chandni Chowk often offers lower making charges due to wholesale volumes, especially for traditional designs.</p>
          
          <p><strong>What documents are needed to sell gold?</strong><br />
          Original purchase invoices help get better rates. Without documents, jewellers test purity and may apply deductions.</p>
          
          <p><strong>How to track live gold prices in Delhi?</strong><br />
          GoldMeter provides real-time Delhi gold rates, historical charts, and calculators for informed decisions.</p>
        </div>
      </section>
    </div>
  );
}
