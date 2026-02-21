"use client";

import type { CitySilverConfig } from "@/lib/citySilverConfig";
import type { CitySilverSections } from "@/lib/citySilverSections";
import type { CitySilverExtra } from "@/lib/citySilverExtra";
import type { CitySilverTitles } from "@/lib/citySilverTitles";

interface SilverStaticContentProps {
  city: string;
  silver1kg: number;
  silverPerGram: number;
  config: CitySilverConfig;
  sections: CitySilverSections;
  extra?: CitySilverExtra;
  titles?: CitySilverTitles;
  faqs: { question: string; answer: string }[];
}

export default function SilverStaticContent({
  city,
  silver1kg,
  silverPerGram,
  config,
  sections,
  extra,
  titles,
  faqs,
}: SilverStaticContentProps) {
  const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

  const introParagraph1 = config.introParagraph1
    .replace(/{silver1kg}/g, inr.format(silver1kg))
    .replace(/{silverPerGram}/g, inr.format(silverPerGram));
  const introParagraph2 = config.introParagraph2
    .replace(/{silver1kg}/g, inr.format(silver1kg))
    .replace(/{silverPerGram}/g, inr.format(silverPerGram));

  return (
    <div className="mt-8 space-y-6">
      {/* Introduction — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.overview ?? `Silver Rate Today in ${city} — Overview`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>{introParagraph1}</p>
          <p>{introParagraph2}</p>
        </div>
      </section>

      {/* Silver Economy — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.silverEconomy ?? `Silver Trade and Economy in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <p>{sections.silverEconomy}</p>
        </div>
      </section>

      {/* City-Specific Market & Tradition — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.localInsights ?? `Silver Market in ${city} — Local Insights`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>{config.localMarketDescription}</p>
          <p>{config.silverTradition}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {config.localInfo.map((info) => (
              <div
                key={info.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-charcoal">{info.title}</p>
                <p className="mt-1 text-sm text-slate-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guide — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.buyingGuide ?? `How to Buy Silver in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <p>{sections.buyingGuide}</p>
        </div>
      </section>

      {/* Price Drivers — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.priceDrivers ?? `What Drives Silver Prices in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <p>{sections.priceDrivers}</p>
        </div>
      </section>

      {/* Historical Context — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.historicalContext ?? `History of Silver Trade in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <p>{sections.historicalContext}</p>
        </div>
      </section>

      {/* Investment Scene — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.investmentScene ?? `Silver Investment in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <p>{sections.investmentScene}</p>
        </div>
      </section>

      {/* Seasonal Buying Patterns — unique per city */}
      {extra?.seasonalPatterns && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal">
            {titles?.seasonalPatterns ?? `Best Time to Buy Silver in ${city} — Seasonal Guide`}
          </h2>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>{extra.seasonalPatterns}</p>
          </div>
        </section>
      )}

      {/* Silver Craftsmanship — unique per city */}
      {extra?.silverCraftsmanship && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal">
            {titles?.silverCraftsmanship ?? `Silver Craftsmanship and Artisan Traditions in ${city}`}
          </h2>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>{extra.silverCraftsmanship}</p>
          </div>
        </section>
      )}

      {/* Market Comparison — unique per city */}
      {extra?.marketComparison && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal">
            {titles?.marketComparison ?? `${city} Silver Market — Regional Comparison`}
          </h2>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>{extra.marketComparison}</p>
          </div>
        </section>
      )}

      {/* Storage and Care — unique per city */}
      {extra?.storageAndCare && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal">
            {titles?.storageAndCare ?? `How to Store and Care for Silver in ${city}`}
          </h2>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>{extra.storageAndCare}</p>
          </div>
        </section>
      )}

      {/* Future Outlook — unique per city */}
      {extra?.futureOutlook && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal">
            {titles?.futureOutlook ?? `Silver Market Outlook for ${city}`}
          </h2>
          <div className="mt-4 text-sm text-slate-600 leading-relaxed">
            <p>{extra.futureOutlook}</p>
          </div>
        </section>
      )}

      {/* Silver Purity Quick Reference — short shared factual section */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          Silver Purity Grades — Quick Reference
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 font-semibold text-charcoal">Grade</th>
                  <th className="py-2 pr-4 font-semibold text-charcoal">Purity</th>
                  <th className="py-2 font-semibold text-charcoal">Common Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-4 font-medium">999 Fine Silver</td>
                  <td className="py-2 pr-4">99.9%</td>
                  <td className="py-2">Bullion bars, investment coins, IBJA benchmark</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">925 Sterling</td>
                  <td className="py-2 pr-4">92.5%</td>
                  <td className="py-2">Jewellery, cutlery, decorative articles</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">900 Coin Silver</td>
                  <td className="py-2 pr-4">90.0%</td>
                  <td className="py-2">Antique coins, collectible numismatics</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            BIS hallmarking for silver is voluntary in India. Look for the 999 or 925 stamp
            and HUID on purchases in {city}.
          </p>
        </div>
      </section>

      {/* Selling & Exchange — city-specific guidance */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.sellingExchange ?? `Selling or Exchanging Silver in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            When selling silver in {city}, approach bullion dealers and jewellers who
            operate in the same markets where you would buy — {config.localInfo[0]?.title && (
              <>{config.localInfo[0].title.toLowerCase()} areas and established retail zones</>
            )} offer competitive buyback rates. Dealers typically test purity using
            an XRF spectrometer or touchstone method and offer 95–98% of the day&apos;s IBJA
            rate for .999 bars with original invoices. Silver without documentation may
            attract a 5–10% discount after melt-and-assay testing. Exchange transactions
            — trading old silver for new articles — often yield better effective value than
            outright cash sales, as jewellers waive or reduce making charges on the new
            purchase. Maintain all purchase records, photographs, and purity certificates
            for smooth resale transactions and accurate capital gains computation.
          </p>
          <p>
            Before visiting a dealer in {city}, check the live silver rate on GoldMeter to
            establish your reference price. Get quotes from at least two or three shops and
            insist on witnessing the weighing and purity testing process. For silver utensils
            and jewellery, the buyback value is based on pure silver content after deducting any
            stones, enamel, or non-silver components. Scrap and broken silver is valued purely
            by weight and purity after melting — expect slightly lower realisation compared to
            intact articles. If selling in bulk (above 500 grams), wholesale bullion dealers
            generally offer tighter spreads than retail jewellers.
          </p>
          <p>
            {config.silverTradition} This deep cultural demand means that well-maintained
            traditional silver items — particularly {config.localInfo.length > 1 ? config.localInfo[1].title.toLowerCase() : "regional specialties"} — can
            command premiums above pure metal value when sold to collectors or specialist
            dealers in {city}. Heritage and antique silver pieces with documented provenance
            are especially valued in the resale market.
          </p>
        </div>
      </section>

      {/* Key Takeaways — city-specific summary */}
      <section className="rounded-3xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.keyTakeaways ?? `Key Takeaways — Silver in ${city}`}
        </h2>
        <div className="mt-4 text-sm text-slate-600 leading-relaxed">
          <ul className="space-y-2 list-disc list-inside">
            <li>
              Today&apos;s silver rate in {city}: <strong>₹{inr.format(silverPerGram)}/gram</strong> and <strong>₹{inr.format(silver1kg)}/kg</strong> for 999 fine silver.
            </li>
            {config.localInfo.map((info) => (
              <li key={info.title}>
                <strong>{info.title}:</strong> {info.description}
              </li>
            ))}
            <li>
              Always verify the 999 or 925 purity stamp and BIS hallmark when buying silver
              in {city}. Request an itemised bill with separate metal weight, rate, making
              charges, and GST breakdowns.
            </li>
            <li>
              Track daily silver rate updates for {city} on GoldMeter for informed buying
              and selling decisions. Use the 30-day price chart above to identify trends.
            </li>
          </ul>
        </div>
      </section>

      {/* Extended FAQs — unique per city */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal">
          {titles?.faqs ?? `Frequently Asked Questions — Silver Rate in ${city}`}
        </h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-2xl border border-slate-100 p-4"
            >
              <summary className="cursor-pointer font-semibold text-charcoal">
                {faq.question}
              </summary>
              <p className="mt-2 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
