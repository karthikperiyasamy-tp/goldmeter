import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About GoldMeter - India's Trusted Gold Price Today",
  description: "Learn about GoldMeter, India's reliable source for daily gold and silver prices across major cities. Our mission, data sources, and commitment to accuracy.",
  alternates: {
    canonical: "https://goldmeter.in/about",
  },
  openGraph: {
    title: "About GoldMeter - India's Trusted Gold Price Today",
    description: "Learn about GoldMeter, India's reliable source for daily gold and silver prices across major cities. Our mission, data sources, and commitment to accuracy.",
    type: "website",
    url: "https://goldmeter.in/about",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "About GoldMeter",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffdf7]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">GoldMeter Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">About Us</span>
        </nav>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-charcoal mb-6">About GoldMeter</h1>
          
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 mb-8">
            <p className="text-lg text-slate-700 leading-relaxed m-0">
              GoldMeter is India&apos;s trusted gold price tracker, providing accurate and up-to-date 
              gold and silver rates across major Indian cities. We help millions of Indians make 
              informed decisions about their gold purchases and investments.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Gold holds a special place in Indian culture – from weddings to festivals, from investments 
            to savings. Our mission is to democratize access to accurate gold price information, helping 
            every Indian – whether buying a simple chain or planning a wedding – make informed decisions.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">What We Offer</h2>
          <ul className="text-slate-600 space-y-3">
            <li><strong><Link href="/gold-rate-today" className="text-amber-600 hover:underline">Daily Price Updates</Link>:</strong> Gold and silver rates updated every morning from trusted bullion market sources.</li>
            <li><strong>City-wise Rates:</strong> Prices for 10+ major Indian cities including <Link href="/gold-rate/chennai" className="text-amber-600 hover:underline">Chennai</Link>, <Link href="/gold-rate/mumbai" className="text-amber-600 hover:underline">Mumbai</Link>, <Link href="/gold-rate/delhi" className="text-amber-600 hover:underline">Delhi</Link>, <Link href="/gold-rate/bangalore" className="text-amber-600 hover:underline">Bangalore</Link>, and more.</li>
            <li><strong>Multiple Purities:</strong> 24K, 22K, and 18K gold prices per gram. Use our <Link href="/purity-converter" className="text-amber-600 hover:underline">purity converter</Link> for conversions.</li>
            <li><strong>Historical Data:</strong> 30-day price history with charts to track trends.</li>
            <li><strong><Link href="/calculator" className="text-amber-600 hover:underline">Helpful Calculators</Link>:</strong> Tools for <Link href="/wastage-calculator" className="text-amber-600 hover:underline">making charges</Link>, <Link href="/investment-calculator" className="text-amber-600 hover:underline">gold investment</Link>, and more.</li>
            <li><strong><Link href="/news" className="text-amber-600 hover:underline">Market Insights</Link>:</strong> Daily AI-powered <Link href="/news/recap" className="text-amber-600 hover:underline">recaps</Link> and news to understand price movements.</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Our Data Sources</h2>
          <p className="text-slate-600 leading-relaxed">
            We aggregate data from multiple trusted sources including:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>India Bullion and Jewellers Association (IBJA)</li>
            <li>Regional bullion merchant associations</li>
            <li>MCX (Multi Commodity Exchange) reference rates</li>
            <li>International spot prices (London Gold Fix, COMEX)</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Accuracy & Updates</h2>
          <p className="text-slate-600 leading-relaxed">
            Our prices are updated daily, typically in the morning after the IBJA releases official rates. 
            While we strive for accuracy, actual prices at jewellery shops may vary due to making charges, 
            GST, and individual jeweller pricing policies. We recommend using our rates as a reference 
            point and confirming with your jeweller before purchase. Learn more about our{" "}
            <Link href="/about/methodology" className="text-amber-600 hover:underline font-medium">data methodology</Link>.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Jewellers Directory</h2>
          <p className="text-slate-600 leading-relaxed">
            Planning to buy gold? Check our{" "}
            <Link href="/jewellers" className="text-amber-600 hover:underline font-medium">jewellers directory</Link>{" "}
            to compare making charges across top jewellers in India, or read our{" "}
            <Link href="/jewellers/buying-guide" className="text-amber-600 hover:underline font-medium">gold buying guide</Link>{" "}
            for tips on making smart purchases.</p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            Have questions, feedback, or suggestions? We&apos;d love to hear from you! Visit our{" "}
            <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
              Contact page
            </Link>{" "}
            to get in touch.
          </p>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              GoldMeter is an independent price tracking service and is not affiliated with any jewellery 
              retailer or bullion dealer. We do not sell gold or silver.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

