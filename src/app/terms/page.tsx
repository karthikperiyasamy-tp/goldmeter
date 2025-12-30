import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - GoldMeter",
  description: "Terms and conditions for using GoldMeter's gold price tracking service and website.",
  alternates: {
    canonical: "https://goldmeter.in/terms",
  },
  openGraph: {
    title: "Terms of Service - GoldMeter",
    description: "Terms and conditions for using GoldMeter's gold price tracking service and website.",
    type: "website",
    url: "https://goldmeter.in/terms",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Terms of Service - GoldMeter",
      },
    ],
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf7]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Terms of Service</span>
        </nav>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: December 2024</p>

          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 mb-8">
            <p className="text-slate-700 leading-relaxed m-0">
              Welcome to GoldMeter. By accessing or using our website, you agree to be bound by these 
              Terms of Service. Please read them carefully before using our services.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            By accessing GoldMeter (goldmeter.in), you acknowledge that you have read, understood, and 
            agree to be bound by these Terms of Service. If you do not agree to these terms, please do 
            not use our website.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">2. Description of Service</h2>
          <p className="text-slate-600 leading-relaxed">
            GoldMeter provides:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Daily gold and silver price information for Indian cities</li>
            <li>Historical price data and trend charts</li>
            <li>Calculators for jewellery cost estimation</li>
            <li>News and market analysis</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-4">
            Our service is provided free of charge for informational purposes only.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">3. Information Accuracy</h2>
          <p className="text-slate-600 leading-relaxed">
            While we strive to provide accurate and up-to-date gold price information:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Prices are sourced from publicly available data and may have delays</li>
            <li>Actual prices at jewellery shops may differ due to making charges, GST, and other factors</li>
            <li>We do not guarantee the accuracy, completeness, or timeliness of any information</li>
            <li>Prices should be used as reference only; always confirm with your jeweller</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">4. Not Financial Advice</h2>
          <p className="text-slate-600 leading-relaxed">
            <strong>Important:</strong> The information on GoldMeter is for informational purposes only 
            and does not constitute financial, investment, or trading advice. We are not licensed 
            financial advisors. Any decisions you make based on information from our website are at 
            your own risk.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">5. No Commercial Transactions</h2>
          <p className="text-slate-600 leading-relaxed">
            GoldMeter does not:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Sell gold, silver, or any jewellery</li>
            <li>Facilitate purchases between users and jewellers</li>
            <li>Endorse or recommend specific jewellery shops</li>
            <li>Receive commissions from jewellery purchases</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-slate-600 leading-relaxed">
            All content on GoldMeter, including text, graphics, logos, and software, is the property 
            of GoldMeter or its content suppliers and is protected by intellectual property laws. You may not:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Copy, modify, or distribute our content without permission</li>
            <li>Use automated tools to scrape or extract data</li>
            <li>Use our branding or trademarks without authorization</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">7. User Conduct</h2>
          <p className="text-slate-600 leading-relaxed">
            When using GoldMeter, you agree not to:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the website&apos;s operation</li>
            <li>Use the website for any unlawful purpose</li>
            <li>Transmit malware or harmful code</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed">
            To the fullest extent permitted by law, GoldMeter shall not be liable for any direct, 
            indirect, incidental, special, or consequential damages arising from:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Use or inability to use our website</li>
            <li>Reliance on price information provided</li>
            <li>Financial decisions made based on our content</li>
            <li>Any errors or omissions in our data</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">9. Third-Party Links</h2>
          <p className="text-slate-600 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the 
            content, privacy practices, or terms of service of these external sites.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">10. Modifications to Service</h2>
          <p className="text-slate-600 leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any part of our service at any 
            time without notice. We may also update these Terms of Service periodically.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">11. Governing Law</h2>
          <p className="text-slate-600 leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with the laws of 
            India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">12. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have questions about these Terms of Service, please contact us at:{" "}
            <a href="mailto:hello@goldmeter.in" className="text-amber-600 hover:text-amber-700">
              hello@goldmeter.in
            </a>
          </p>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              By continuing to use GoldMeter, you acknowledge that you have read and agree to these Terms of Service.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

