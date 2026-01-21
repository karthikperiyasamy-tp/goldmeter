/**
 * City-specific Local SEO Block Component
 * Displays unique city-specific content for improved local SEO:
 * - Local leading jewellers listing
 * - Important market landmarks
 * - Typical making charges range
 * - Historical price trends
 */

import Link from "next/link";
import { getAllJewellers, type JewellerConfig } from "@/lib/jewellerConfig";

// Types for city-specific market data
export interface MarketLandmark {
  name: string;
  description: string;
  speciality?: string;
  area?: string;
}

export interface MakingChargesInfo {
  range: string;
  plain: string;
  antique: string;
  kundan?: string;
  temple?: string;
  diamond?: string;
  tips: string[];
}

export interface HistoricalTrendInfo {
  summary: string;
  yearlyTrend: string;
  seasonalPattern: string;
  bestBuyingTime: string;
  festivalImpact: string;
}

export interface CityMarketData {
  landmarks: MarketLandmark[];
  makingCharges: MakingChargesInfo;
  historicalTrends: HistoricalTrendInfo;
}

interface CityLocalSEOBlockProps {
  city: string;
  citySlug: string;
  marketData?: CityMarketData;
}

export default function CityLocalSEOBlock({
  city,
  citySlug,
  marketData,
}: CityLocalSEOBlockProps) {
  // Get jewellers that operate in this city
  const allJewellers = getAllJewellers();
  const cityLower = citySlug.toLowerCase();
  
  // Filter jewellers that have this city in their cityLinks
  const jewellersInCity = allJewellers.filter((j: JewellerConfig) =>
    j.cityLinks.some((c) => c.slug === cityLower)
  );
  
  // If no specific jewellers, show a mix of national chains
  const displayJewellers = jewellersInCity.length > 0 
    ? jewellersInCity.slice(0, 8) 
    : allJewellers.filter((j: JewellerConfig) => j.type === 'national').slice(0, 6);

  // Default market data if not provided
  const defaultMarketData: CityMarketData = {
    landmarks: [],
    makingCharges: {
      range: "₹200 - ₹500 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹350 - ₹450/gram",
      diamond: "₹400 - ₹600/gram",
      tips: [
        "Compare making charges across multiple jewellers",
        "Ask for itemized bill with separate gold and making charges",
        "Check if making charges are flat rate or percentage-based",
      ],
    },
    historicalTrends: {
      summary: `Gold prices in ${city} have shown steady appreciation over the years, closely following international gold markets.`,
      yearlyTrend: "Annual appreciation of 8-12% over the past decade",
      seasonalPattern: "Prices typically peak during wedding seasons and major festivals",
      bestBuyingTime: "Post-monsoon months (August-September) often see relatively stable prices",
      festivalImpact: "Dhanteras and Akshaya Tritiya see highest buying volumes and sometimes premium pricing",
    },
  };

  const data = marketData || defaultMarketData;

  return (
    <div className="mt-8 space-y-6">
      {/* Section: Popular Jewellers in City */}
      <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          Popular Jewellers in {city}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Compare gold rates and making charges from trusted jewellers in {city}. 
          All listed jewellers are BIS hallmark certified.
        </p>
        
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayJewellers.map((jeweller: JewellerConfig) => (
            <Link
              key={jeweller.slug}
              href={`/jewellers/${jeweller.slug}`}
              className="group block rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-charcoal group-hover:text-amber-700 transition-colors">
                    {jeweller.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {jeweller.type === 'national' ? '🌐 National Chain' : '📍 Regional'}
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  {jeweller.type === 'national' ? 'Pan India' : jeweller.headquarters.split(',')[1]?.trim() || jeweller.headquarters}
                </span>
              </div>
              
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-amber-600">💰</span>
                  <span>Making: <strong className="text-charcoal">{jeweller.makingChargesRange}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-amber-600">✨</span>
                  <span className="truncate">{jeweller.popularCollections.slice(0, 2).join(', ')}</span>
                </div>
              </div>
              
              <p className="mt-3 text-xs text-amber-600 group-hover:text-amber-700 font-medium">
                View details & rates →
              </p>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link
            href="/jewellers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            View all jewellers & compare making charges
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Section: Market Landmarks & Gold Markets */}
      {data.landmarks.length > 0 && (
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Gold Markets & Jewellery Hubs in {city}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Explore the famous jewellery markets and gold trading areas in {city} for the best deals and variety.
          </p>
          
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.landmarks.map((landmark, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-colors"
              >
                <h3 className="font-semibold text-charcoal flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-bold">
                    {index + 1}
                  </span>
                  {landmark.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {landmark.description}
                </p>
                {landmark.speciality && (
                  <p className="mt-2 text-xs text-amber-700 font-medium">
                    ✨ Known for: {landmark.speciality}
                  </p>
                )}
                {landmark.area && (
                  <p className="mt-1 text-xs text-slate-500">
                    📍 Area: {landmark.area}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: Making Charges in City */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
          <span className="text-2xl">💎</span>
          Typical Making Charges in {city}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Making charges vary based on design complexity, craftsmanship, and jeweller. 
          Here&apos;s a typical range for {city}:
        </p>
        
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-50 text-amber-900">
                <th className="px-4 py-3 text-left border border-amber-100 font-semibold">Jewellery Type</th>
                <th className="px-4 py-3 text-left border border-amber-100 font-semibold">Making Charges (per gram)</th>
                <th className="px-4 py-3 text-left border border-amber-100 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="bg-white hover:bg-amber-50/50 transition-colors">
                <td className="px-4 py-3 border border-amber-100 font-medium">Plain Gold Jewellery</td>
                <td className="px-4 py-3 border border-amber-100">{data.makingCharges.plain}</td>
                <td className="px-4 py-3 border border-amber-100 text-slate-500">Chains, simple bangles, rings</td>
              </tr>
              <tr className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                <td className="px-4 py-3 border border-amber-100 font-medium">Antique/Matte Finish</td>
                <td className="px-4 py-3 border border-amber-100">{data.makingCharges.antique}</td>
                <td className="px-4 py-3 border border-amber-100 text-slate-500">Oxidized, handcrafted designs</td>
              </tr>
              {data.makingCharges.temple && (
                <tr className="bg-white hover:bg-amber-50/50 transition-colors">
                  <td className="px-4 py-3 border border-amber-100 font-medium">Temple Jewellery</td>
                  <td className="px-4 py-3 border border-amber-100">{data.makingCharges.temple}</td>
                  <td className="px-4 py-3 border border-amber-100 text-slate-500">Traditional South Indian designs</td>
                </tr>
              )}
              {data.makingCharges.kundan && (
                <tr className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                  <td className="px-4 py-3 border border-amber-100 font-medium">Kundan/Polki</td>
                  <td className="px-4 py-3 border border-amber-100">{data.makingCharges.kundan}</td>
                  <td className="px-4 py-3 border border-amber-100 text-slate-500">Traditional North Indian bridal</td>
                </tr>
              )}
              <tr className="bg-white hover:bg-amber-50/50 transition-colors">
                <td className="px-4 py-3 border border-amber-100 font-medium">Diamond Studded</td>
                <td className="px-4 py-3 border border-amber-100">{data.makingCharges.diamond}</td>
                <td className="px-4 py-3 border border-amber-100 text-slate-500">Stone setting charges extra</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Making Charges Tips */}
        <div className="mt-4 rounded-2xl bg-amber-50 p-4">
          <p className="font-semibold text-amber-800 text-sm">💡 Smart Buying Tips:</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data.makingCharges.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/wastage-calculator"
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            💎 Calculate Making Charges
          </Link>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
          >
            🧮 Gold Price Calculator
          </Link>
        </div>
      </section>

      {/* Section: Historical Price Trends */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Historical Gold Price Trends in {city}
        </h2>
        
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {data.historicalTrends.summary}
        </p>
        
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <span>📊</span>
              <h3 className="font-semibold">Yearly Trend</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {data.historicalTrends.yearlyTrend}
            </p>
          </div>
          
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <span>🗓️</span>
              <h3 className="font-semibold">Seasonal Pattern</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {data.historicalTrends.seasonalPattern}
            </p>
          </div>
          
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <span>💡</span>
              <h3 className="font-semibold">Best Time to Buy</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {data.historicalTrends.bestBuyingTime}
            </p>
          </div>
          
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <span>🎉</span>
              <h3 className="font-semibold">Festival Impact</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {data.historicalTrends.festivalImpact}
            </p>
          </div>
        </div>
        
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            <strong>📌 Note:</strong> Gold prices are influenced by global factors including international spot prices, 
            USD/INR exchange rates, and geopolitical events. Historical trends are indicative and past performance 
            doesn&apos;t guarantee future prices. Always check current rates before making a purchase.
          </p>
        </div>
        
        <div className="mt-4">
          <Link
            href="#price-chart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            View 30-day price chart above →
          </Link>
        </div>
      </section>
    </div>
  );
}
