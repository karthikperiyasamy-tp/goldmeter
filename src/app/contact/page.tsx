import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - GoldMeter",
  description: "Get in touch with GoldMeter for questions, feedback, or business inquiries about gold prices in India.",
  alternates: {
    canonical: "https://goldmeter.in/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fffdf7]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Contact</span>
        </nav>

        <h1 className="text-3xl font-bold text-charcoal mb-6">Contact Us</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6">
              <h2 className="text-lg font-semibold text-charcoal mb-4">Get in Touch</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We value your feedback and are here to help with any questions about gold prices, 
                our calculators, or suggestions for improvement.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-600 text-xl">✉️</span>
                  <div>
                    <p className="font-medium text-charcoal">Email</p>
                    <a 
                      href="mailto:hello@goldmeter.in" 
                      className="text-amber-600 hover:text-amber-700"
                    >
                      hello@goldmeter.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-600 text-xl">🕐</span>
                  <div>
                    <p className="font-medium text-charcoal">Response Time</p>
                    <p className="text-slate-600">Usually within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-charcoal mb-4">Common Inquiries</h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Questions about gold prices and data sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Bug reports or website issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Feature requests and suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Business and partnership inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Press and media requests</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Before You Contact Us</h2>
            <p className="text-slate-600 mb-4">
              Check if your question is answered here:
            </p>
            
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-charcoal hover:text-amber-600">
                  When are prices updated?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  Prices are updated daily in the morning, typically after 10:00 AM IST when IBJA releases official rates.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-charcoal hover:text-amber-600">
                  Why is the price different at my jeweller?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  Our rates show the base gold price. Jewellers add making charges (₹150-600/gram) and 3% GST. 
                  Some also add wastage charges.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-charcoal hover:text-amber-600">
                  Do you sell gold or jewellery?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  No, GoldMeter is a price tracking service only. We do not sell gold, silver, or jewellery.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-charcoal hover:text-amber-600">
                  Can I advertise on GoldMeter?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  For advertising and partnership inquiries, please email us at hello@goldmeter.in with details about your business.
                </p>
              </details>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Still have questions? Email us and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

