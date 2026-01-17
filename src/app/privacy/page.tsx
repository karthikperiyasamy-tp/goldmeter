import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - GoldMeter",
  description: "GoldMeter's privacy policy explains how we collect, use, and protect your personal information when you use our gold price tracking service.",
  alternates: {
    canonical: "https://goldmeter.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy - GoldMeter",
    description: "GoldMeter's privacy policy explains how we collect, use, and protect your personal information when you use our gold price tracking service.",
    type: "website",
    url: "https://goldmeter.in/privacy",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - GoldMeter",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fffdf7]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">GoldMeter Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Privacy Policy</span>
        </nav>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: December 2024</p>

          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 mb-8">
            <p className="text-slate-700 leading-relaxed m-0">
              At GoldMeter, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle information when you visit our website.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed">
            GoldMeter is designed to be privacy-friendly. We collect minimal data:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li><strong>Usage Data:</strong> Anonymous analytics data such as pages visited, time spent, and general geographic region (country/city level).</li>
            <li><strong>Device Information:</strong> Browser type, device type, and screen resolution to optimize your experience.</li>
            <li><strong>Cookies:</strong> Essential cookies for website functionality and optional analytics cookies.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-4">
            We do <strong>not</strong> collect:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Personal identification information (name, email, phone) unless you contact us</li>
            <li>Financial information or payment details</li>
            <li>Precise location data</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-600 leading-relaxed">
            The limited data we collect is used to:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Improve website performance and user experience</li>
            <li>Understand which features are most useful to visitors</li>
            <li>Fix bugs and technical issues</li>
            <li>Analyze traffic patterns to improve content</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">3. Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            We use cookies to enhance your browsing experience:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (can be disabled).</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-4">
            You can control cookies through your browser settings. Disabling cookies may affect some website features.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">4. Third-Party Services</h2>
          <p className="text-slate-600 leading-relaxed">
            We may use third-party services that collect data:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li><strong>Analytics:</strong> To understand website usage patterns</li>
            <li><strong>Hosting:</strong> Our website is hosted on secure cloud infrastructure</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-4">
            These services have their own privacy policies governing data collection.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">5. Data Security</h2>
          <p className="text-slate-600 leading-relaxed">
            We implement appropriate security measures to protect against unauthorized access, alteration, 
            or destruction of data. Our website uses HTTPS encryption for all connections.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">6. Data Retention</h2>
          <p className="text-slate-600 leading-relaxed">
            Analytics data is retained for up to 26 months. If you contact us via email, we retain 
            correspondence for as long as necessary to address your inquiry.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">7. Your Rights</h2>
          <p className="text-slate-600 leading-relaxed">
            You have the right to:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>Access information we hold about you</li>
            <li>Request deletion of your data</li>
            <li>Opt out of analytics tracking</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p className="text-slate-600 leading-relaxed">
            Our website is not directed at children under 13. We do not knowingly collect personal 
            information from children.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">9. Changes to This Policy</h2>
          <p className="text-slate-600 leading-relaxed">
            We may update this privacy policy from time to time. Changes will be posted on this page 
            with an updated revision date.
          </p>

          <h2 className="text-xl font-semibold text-charcoal mt-8 mb-4">10. Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have questions about this privacy policy or our data practices, please contact us at:{" "}
            <a href="mailto:hello@goldmeter.in" className="text-amber-600 hover:text-amber-700">
              hello@goldmeter.in
            </a>
          </p>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              By using GoldMeter, you agree to the terms outlined in this privacy policy.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

