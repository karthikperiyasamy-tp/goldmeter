import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gold Jewellery Buying Guide - Tips, Savings Schemes & What to Check | GoldMeter",
  description: "Complete guide to buying gold jewellery in India. Learn about gold savings schemes, making charges, BIS hallmark verification, exchange policies, and smart buying tips.",
  alternates: {
    canonical: "https://goldmeter.in/jewellers/buying-guide",
  },
  openGraph: {
    title: "Gold Jewellery Buying Guide - Tips & Savings Schemes",
    description: "Complete guide to buying gold jewellery in India. Learn about gold savings schemes, making charges, BIS hallmark verification, and smart buying tips.",
    type: "website",
    url: "https://goldmeter.in/jewellers/buying-guide",
  },
};

export default function BuyingGuidePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">GoldMeter Home</Link>
          <span className="mx-2">›</span>
          <Link href="/jewellers" className="hover:text-amber-600">Jewellers</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Buying Guide</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Gold Jewellery Buying Guide
          </h1>
          <p className="text-lg text-slate-600">
            Everything you need to know before buying gold jewellery in India - from understanding 
            making charges to verifying purity and choosing the right savings scheme.
          </p>
        </header>

        <div className="space-y-8">
          {/* Table of Contents */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-charcoal mb-4">📑 In This Guide</h2>
            <ul className="grid md:grid-cols-2 gap-2 text-sm">
              <li><a href="#making-charges" className="text-amber-600 hover:text-amber-700">→ Understanding Making Charges</a></li>
              <li><a href="#purity" className="text-amber-600 hover:text-amber-700">→ Gold Purity & BIS Hallmark</a></li>
              <li><a href="#savings-schemes" className="text-amber-600 hover:text-amber-700">→ Gold Savings Schemes</a></li>
              <li><a href="#payment-options" className="text-amber-600 hover:text-amber-700">→ Payment Options</a></li>
              <li><a href="#exchange-policy" className="text-amber-600 hover:text-amber-700">→ Exchange & Buyback Policies</a></li>
              <li><a href="#buying-tips" className="text-amber-600 hover:text-amber-700">→ Smart Buying Tips</a></li>
              <li><a href="#checklist" className="text-amber-600 hover:text-amber-700">→ Pre-Purchase Checklist</a></li>
              <li><a href="#red-flags" className="text-amber-600 hover:text-amber-700">→ Red Flags to Avoid</a></li>
            </ul>
          </section>

          {/* Making Charges */}
          <section id="making-charges" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span> Understanding Making Charges
            </h2>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-600 mb-4">
                Making charges are the fees jewellers charge for crafting jewellery from raw gold. 
                This is where profit margins vary significantly between jewellers - gold rates are 
                largely similar across the market, but making charges can differ by ₹100-400 per gram.
              </p>
              
              <h3 className="font-semibold text-charcoal mt-6 mb-3">Types of Making Charge Structures</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-charcoal mb-2">Per Gram Basis</h4>
                  <p className="text-sm text-slate-600">
                    Most common method. Charged as ₹X per gram of gold weight. 
                    Example: ₹300/gram on a 20g necklace = ₹6,000 making charges.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-charcoal mb-2">Percentage Basis</h4>
                  <p className="text-sm text-slate-600">
                    Charged as X% of gold value. Example: 15% on ₹1,00,000 gold value = ₹15,000 making charges.
                    Common in traditional markets.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">What Affects Making Charges?</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">1.</span>
                  <span><strong>Design Complexity:</strong> Simple chains (₹150-250/g) vs intricate temple work (₹400-800/g)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">2.</span>
                  <span><strong>Craftsmanship Type:</strong> Machine-made (lower) vs handcrafted (higher)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">3.</span>
                  <span><strong>Brand Premium:</strong> National chains typically charge more than regional jewellers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">4.</span>
                  <span><strong>Weight:</strong> Very lightweight pieces may have higher per-gram charges due to complexity</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm text-amber-800">
                  <strong>💡 Pro Tip:</strong> Always ask for making charges BEFORE browsing designs. 
                  Some jewellers quote lower per-gram charges but add "wastage" (2-15%) separately.
                </p>
              </div>
            </div>
          </section>

          {/* Purity & BIS Hallmark */}
          <section id="purity" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">✅</span> Gold Purity & BIS Hallmark
            </h2>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-600 mb-4">
                Since June 2021, BIS hallmarking with HUID (Hallmark Unique Identification Number) 
                is mandatory for all gold jewellery sold in India. This 6-digit alphanumeric code 
                can be verified online at bis.gov.in.
              </p>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Understanding Purity Marks</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-charcoal">Mark</th>
                      <th className="px-4 py-3 text-left font-semibold text-charcoal">Karats</th>
                      <th className="px-4 py-3 text-left font-semibold text-charcoal">Purity</th>
                      <th className="px-4 py-3 text-left font-semibold text-charcoal">Common Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-amber-700">999</td>
                      <td className="px-4 py-3">24K</td>
                      <td className="px-4 py-3">99.9%</td>
                      <td className="px-4 py-3 text-slate-600">Coins, bars (too soft for jewellery)</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="px-4 py-3 font-mono text-amber-700">916</td>
                      <td className="px-4 py-3 font-semibold">22K</td>
                      <td className="px-4 py-3">91.6%</td>
                      <td className="px-4 py-3 text-slate-600">Most Indian jewellery (traditional)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-amber-700">750</td>
                      <td className="px-4 py-3">18K</td>
                      <td className="px-4 py-3">75%</td>
                      <td className="px-4 py-3 text-slate-600">Diamond jewellery, modern designs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-amber-700">585</td>
                      <td className="px-4 py-3">14K</td>
                      <td className="px-4 py-3">58.5%</td>
                      <td className="px-4 py-3 text-slate-600">Western-style, everyday wear</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">What to Check on the Hallmark</h3>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span><strong>BIS Logo:</strong> Triangle mark of Bureau of Indian Standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span><strong>Purity Grade:</strong> 916, 750, etc.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span><strong>HUID:</strong> 6-character alphanumeric code (verify at bis.gov.in)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span><strong>Assaying Center Mark:</strong> Code of the testing center</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Gold Savings Schemes */}
          <section id="savings-schemes" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">🏦</span> Gold Savings Schemes
            </h2>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-600 mb-4">
                Most branded jewellers offer monthly savings schemes to help customers plan for 
                major purchases like wedding jewellery. These schemes typically provide bonus 
                benefits and protection against gold price increases.
              </p>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">How Gold Savings Schemes Work</h3>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-amber-700">11</div>
                    <div className="text-xs text-amber-800">Monthly Payments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-700">+1</div>
                    <div className="text-xs text-amber-800">Free Month (Bonus)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-700">=</div>
                    <div className="text-xs text-amber-800">Total Value</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">~8%</div>
                    <div className="text-xs text-emerald-700">Effective Return</div>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Key Benefits</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span><strong>Bonus Value:</strong> 12th month free = ~8% effective return</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span><strong>Price Protection:</strong> Gold rate locked at purchase time, not enrollment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span><strong>Discipline:</strong> Helps save systematically for big purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span><strong>Flexibility:</strong> Redeem for any jewellery in their collection</span>
                </li>
              </ul>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Important Considerations</h3>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <ul className="space-y-2 text-sm text-rose-800">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">⚠</span>
                    <span>Making charges and GST apply at time of purchase (not included in scheme)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">⚠</span>
                    <span>Money is locked with jeweller - check their financial stability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">⚠</span>
                    <span>Read terms carefully - some have minimum purchase requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">⚠</span>
                    <span>Compare scheme benefits across 2-3 jewellers before enrolling</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Options */}
          <section id="payment-options" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">💳</span> Payment Options
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-charcoal mb-3">Accepted Payment Methods</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Cash (PAN required above ₹2 lakh)</li>
                  <li>• Credit/Debit Cards</li>
                  <li>• UPI (GPay, PhonePe, etc.)</li>
                  <li>• Net Banking</li>
                  <li>• Gold Savings Scheme Balance</li>
                  <li>• Old Gold Exchange</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-charcoal mb-3">EMI & Financing</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• No-cost EMI (select cards/banks)</li>
                  <li>• Bank EMI (3-24 months)</li>
                  <li>• Bajaj Finserv EMI Card</li>
                  <li>• HDFC/ICICI Consumer Loans</li>
                  <li>• Store Credit Programs</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Check if your credit card offers reward points on jewellery 
                purchases. Some premium cards offer 2-5x points, effectively giving you 1-2% back.
              </p>
            </div>
          </section>

          {/* Exchange & Buyback */}
          <section id="exchange-policy" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">🔄</span> Exchange & Buyback Policies
            </h2>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-600 mb-4">
                Understanding exchange policies is crucial - it affects the long-term value of your purchase.
                Most branded jewellers offer better exchange terms than local shops.
              </p>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Types of Exchange</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-2">Same Brand Exchange</h4>
                  <p className="text-sm text-slate-600">
                    Exchange jewellery from the same jeweller. Usually get 100% gold value 
                    (no deductions). Best option for upgrades.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-charcoal mb-2">Other Brand/Old Gold</h4>
                  <p className="text-sm text-slate-600">
                    Exchange jewellery from other jewellers. Typically 2-10% deduction 
                    for purity testing and melting.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">Exchange Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>Exchange during festivals - many offer bonus value (5-10% extra)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>Keep original invoice - ensures full exchange value</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>Compare exchange rates at 2-3 jewellers before finalizing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>Stone weight is typically not valued in exchange</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Smart Buying Tips */}
          <section id="buying-tips" className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">📝</span> Smart Buying Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-amber-800 mb-3">Before Visiting the Store</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span>Check today&apos;s gold rate on GoldMeter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span>Research designs online to save time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span>Compare making charges across 2-3 jewellers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">4.</span>
                    <span>Check for ongoing offers or festival discounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">5.</span>
                    <span>Set a budget and stick to it</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-3">At the Store</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span>Ask for making charges BEFORE browsing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span>Verify BIS hallmark and HUID on each piece</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span>Watch the weighing - ensure stones excluded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">4.</span>
                    <span>Get itemized bill (gold rate + making + GST)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">5.</span>
                    <span>Confirm exchange policy in writing</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pre-Purchase Checklist */}
          <section id="checklist" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <span className="text-xl">✅</span> Pre-Purchase Checklist
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Verified BIS hallmark with HUID</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Confirmed purity (916/750/etc.)</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Checked today&apos;s gold rate</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Understood making charges</span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Watched weight measurement</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Got itemized bill</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Confirmed exchange policy</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 rounded" />
                  <span className="text-sm text-slate-700">Received purity certificate</span>
                </label>
              </div>
            </div>
          </section>

          {/* Red Flags */}
          <section id="red-flags" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-soft scroll-mt-20">
            <h2 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🚩</span> Red Flags to Avoid
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-rose-800">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>No BIS hallmark or reluctance to show HUID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>Significantly lower gold rate than market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>Hidden charges revealed only at billing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>Pressure tactics or &quot;today only&quot; offers</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-rose-800">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>Refusal to provide itemized bill</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>Weighing done out of customer&apos;s view</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>No clear exchange or return policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500">✕</span>
                  <span>Discouraging from checking hallmark</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-100 to-amber-50 p-6 text-center">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Ready to Buy?</h2>
            <p className="text-amber-800 mb-4">
              Compare making charges and find the best jeweller for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/jewellers"
                className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
              >
                Browse Jewellers →
              </Link>
              <Link
                href="/calculator"
                className="px-6 py-3 rounded-xl border border-amber-400 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
              >
                Calculate Cost →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
