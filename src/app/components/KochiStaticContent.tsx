/**
 * Kochi-specific static content for SEO
 */

interface KochiStaticContentProps {
  perGram22k: number;
  perGram24k: number;
}

export default function KochiStaticContent({ perGram22k, perGram24k }: KochiStaticContentProps) {
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rate Today in Kochi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Today&apos;s gold rate in Kochi is <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> and <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> gold. 
            Kochi is Kerala&apos;s commercial capital with one of South India&apos;s most active gold markets. 
            Broadway and MG Road house major showrooms including Kalyan, Jos Alukkas, and Joyalukkas. 
            Prices are updated from IBJA multiple times daily.
          </p>
          <p>
            Gold prices fluctuate based on global economic conditions and Kerala&apos;s exceptionally high 
            gold demand. NRI remittances from the Gulf significantly boost demand during festivals.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Rates by Carat in Kochi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>24 Carat Gold Rate</strong> - 99.9% pure for investment in coins and bars</li>
            <li><strong>22 Carat Gold Rate (916)</strong> - Standard for traditional Kerala jewellery like Palakka, Manga Mala, and Nagapadam</li>
            <li><strong>18 Carat Gold Rate</strong> - For diamond-studded contemporary designs</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Factors Influencing Gold Prices in Kochi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li><strong>Global</strong> - Dollar index, Federal Reserve decisions, geopolitical tensions</li>
            <li><strong>Domestic</strong> - Currency exchange, import duties (15%), GST (3%)</li>
            <li><strong>NRI Remittances</strong> - Gulf NRI purchases significantly impact Kochi market</li>
            <li><strong>Peak Seasons</strong> - Onam, Vishu, and wedding season (November-May)</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">BIS Hallmarking</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>BIS Logo with purity grade (916 for 22K, 750 for 18K)</li>
            <li>HUID - 6-digit Hallmark Unique Identification number</li>
            <li>Kerala State Hallmarking Center in Kochi serves Ernakulam region</li>
            <li>Purchase only from BIS-certified jewellers</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Buying Tips for Kochi</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Check rates on GoldMeter before visiting showrooms</li>
            <li>Compare prices across Broadway, MG Road, and Edappally malls</li>
            <li>Understand making charges (8-20%); traditional Kerala designs may be higher</li>
            <li>Get detailed invoice with gold weight, purity, and GST breakdown</li>
            <li>Ask about exchange policies - most Kerala jewellers offer lifetime exchange</li>
          </ul>
          <p>Popular jewellers: Kalyan Jewellers, Jos Alukkas, Chemmanur, Joyalukkas, Bhima, and Malabar Gold.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Investment Options</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Physical gold - coins, bars, and jewellery</li>
            <li>Sovereign Gold Bonds - 2.5% annual interest, tax-free on maturity</li>
            <li>Gold ETFs and mutual funds via demat account</li>
            <li>Digital gold via apps starting from ₹1</li>
            <li>Gold purchase schemes - monthly deposits pioneered by Kerala jewellers</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">Gold Loans & Taxation</h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <ul className="mt-2 space-y-2 list-disc list-inside">
            <li>Kochi is headquarters for Muthoot Finance and Manappuram - India&apos;s largest gold loan NBFCs</li>
            <li>Banks like Federal Bank and South Indian Bank offer competitive gold loan rates</li>
            <li>Loan-to-Value typically 75% of gold&apos;s market value</li>
            <li>GST: 3% on gold value, 5% on making charges</li>
            <li>Long-term capital gains (3+ years): 20% with indexation benefit</li>
          </ul>
          <p>GoldMeter provides daily updated gold rates for Kochi and all Kerala cities.</p>
        </div>
      </section>
    </div>
  );
}
