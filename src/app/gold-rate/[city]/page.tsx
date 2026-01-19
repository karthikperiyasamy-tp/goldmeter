import { headers } from "next/headers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageShell from "../../components/CityPageShell";
import ChennaiStaticContent from "../../components/ChennaiStaticContent";
import MumbaiStaticContent from "../../components/MumbaiStaticContent";
import HyderabadStaticContent from "../../components/HyderabadStaticContent";
import AhmedabadStaticContent from "../../components/AhmedabadStaticContent";
import AyodhyaStaticContent from "../../components/AyodhyaStaticContent";
import BangaloreStaticContent from "../../components/BangaloreStaticContent";
import BhubaneswarStaticContent from "../../components/BhubaneswarStaticContent";
import ChandigarhStaticContent from "../../components/ChandigarhStaticContent";
import CoimbatoreStaticContent from "../../components/CoimbatoreStaticContent";
import DelhiStaticContent from "../../components/DelhiStaticContent";
import JaipurStaticContent from "../../components/JaipurStaticContent";
import KeralaStaticContent from "../../components/KeralaStaticContent";
import KochiStaticContent from "../../components/KochiStaticContent";
import KolkataStaticContent from "../../components/KolkataStaticContent";
import LucknowStaticContent from "../../components/LucknowStaticContent";
import MaduraiStaticContent from "../../components/MaduraiStaticContent";
import MangaloreStaticContent from "../../components/MangaloreStaticContent";
import MoodbidriStaticContent from "../../components/MoodbidriStaticContent";
import MysoreStaticContent from "../../components/MysoreStaticContent";
import NagpurStaticContent from "../../components/NagpurStaticContent";
import NashikStaticContent from "../../components/NashikStaticContent";
import PatnaStaticContent from "../../components/PatnaStaticContent";
import PuneStaticContent from "../../components/PuneStaticContent";
import RajkotStaticContent from "../../components/RajkotStaticContent";
import SalemStaticContent from "../../components/SalemStaticContent";
import SuratStaticContent from "../../components/SuratStaticContent";
import TirunelveliStaticContent from "../../components/TirunelveliStaticContent";
import TrichyStaticContent from "../../components/TrichyStaticContent";
import VadodaraStaticContent from "../../components/VadodaraStaticContent";
import VijayawadaStaticContent from "../../components/VijayawadaStaticContent";
import VisakhapatnamStaticContent from "../../components/VisakhapatnamStaticContent";
import { fetchCityRates } from "@/lib/fetchCityRates";
import { getCityGoldConfig, getAllCitySlugs, generateFAQs } from "@/lib/cityGoldConfig";

type Props = {
  params: Promise<{ city: string }>;
};

// Generate static params for all cities
export async function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({
    city: city.toLowerCase(),
  }));
}

// Dynamic metadata with date for AIO freshness signals
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const config = getCityGoldConfig(city);
  
  if (!config) {
    return { title: 'City Not Found' };
  }

  // Short date for title (50-60 chars recommended)
  const shortDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  // Full date for descriptions
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return {
    // Title optimized for "gold rate today [city]" searches
    // Putting search phrase "Gold Rate Today" at front for better keyword matching
    title: `Gold Rate Today in ${config.name} (${shortDate}) - 22K & 24K Price | GoldMeter`,
    // Description: Starts with exact search phrase for better CTR
    description: `Gold rate today ${config.name.toLowerCase()}: ₹{price}/gram for 22K, ₹{price24k}/gram for 24K. Live prices updated ${shortDate}. Check making charges, charts & buy tips.`.replace('{date}', shortDate),
    alternates: {
      canonical: `https://goldmeter.in/gold-rate/${config.slug}`,
    },
    openGraph: {
      title: `Gold Rate Today ${config.name} - 22K & 24K Price (${shortDate})`,
      description: `Gold rate today in ${config.name}: 22K & 24K prices per gram. Updated ${shortDate} from IBJA. Check live rates, charts & jeweller tips.`,
      type: 'website',
      url: `https://goldmeter.in/gold-rate/${config.slug}`,
      siteName: 'GoldMeter',
      locale: 'en_IN',
      images: [
        {
          url: 'https://goldmeter.in/og-image.png',
          width: 1200,
          height: 630,
          alt: `Gold Rate Today ${config.name}`,
        },
      ],
    },
  };
}

export default async function GoldRateCityPage({ params }: Props) {
  const { city } = await params;
  const config = getCityGoldConfig(city);
  
  if (!config) {
    notFound();
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  
  // Fetch rates from DB, scraping API, or fallback to mock
  const rates = await fetchCityRates(config.name, host);

  // Calculate per-gram prices for AIO answer block
  const perGram24k = Math.round((rates.gold24k || 0) / 10);
  const perGram22k = Math.round((rates.gold22k || 0) / 10);
  const perGram18k = Math.round(((rates.gold24k || 0) * 18) / 24 / 10);
  const silverPerGram = Math.round((rates.silver1kg || 0) / 1000);
  
  // Format date for display
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Generate FAQs with actual prices
  const faqs = generateFAQs(config, perGram24k, perGram22k);

  return (
    <>
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      <div className="bg-[#fffdf7]" itemScope itemType="https://schema.org/Product">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl" itemProp="name">
              Gold Rate Today in {config.name} ({todayFormatted}) – 22K &amp; 24K
            </h1>
            
            {/* Primary AIO answer - structured like competitors */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true" itemProp="description">
              As of <time dateTime={rates.dateISO}>{todayFormatted}</time>, gold rates in {config.name} are <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> (99.9% purity), <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> (91.6% purity), and <strong>₹{perGram18k.toLocaleString('en-IN')} per gram for 18K</strong> (75.0% purity). Silver rate is ₹{silverPerGram.toLocaleString('en-IN')} per gram. For today&apos;s full gold rates, visit <strong>GoldMeter.in</strong>.
            </p>
            
            {/* Structured price table for AI extraction */}
            <div className="mt-4 overflow-x-auto" data-price-table="true">
              <table className="w-full text-sm border-collapse" itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
                <caption className="text-left font-semibold text-amber-800 mb-2">
                  Today&apos;s Gold & Silver Rates in {config.name}
                  {/* Schema.org metadata for AggregateOffer - must be inside itemScope */}
                  <meta itemProp="priceCurrency" content="INR" />
                  <meta itemProp="lowPrice" content={perGram18k.toString()} />
                  <meta itemProp="highPrice" content={perGram24k.toString()} />
                </caption>
                <thead>
                  <tr className="bg-amber-100 text-amber-900">
                    <th className="px-3 py-2 text-left border border-amber-200">Metal</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Purity</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per Gram</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per 10g</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 24K</td>
                    <td className="px-3 py-2 border border-amber-200">99.9%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="24k">₹{perGram24k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(rates.gold24k || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 22K</td>
                    <td className="px-3 py-2 border border-amber-200">91.6%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="22k">₹{perGram22k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(rates.gold22k || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 18K</td>
                    <td className="px-3 py-2 border border-amber-200">75.0%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="18k">₹{perGram18k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram18k * 10).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Silver</td>
                    <td className="px-3 py-2 border border-amber-200">99.9%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="silver">₹{silverPerGram.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{Math.round((rates.silver1kg || 0) / 100).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* IBJA Verification Timestamp - E-E-A-T Signal */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 border border-emerald-200">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified from IBJA
              </span>
              <span>|</span>
              <span>Updated: <time dateTime={rates.dateISO}>{todayFormatted}</time></span>
              <span>|</span>
              <span>Source: <strong>GoldMeter.in</strong></span>
            </div>

            {/* SEO: Expanded intro paragraph (150-200 words) - Voice Search Optimized */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed" data-speakable-summary="true">
              <p>{config.introParagraph1}</p>
              <p className="mt-2">{config.introParagraph2}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href="/calculator" className="text-amber-600 hover:text-amber-700 font-medium">Calculate jewellery cost →</a>
                <a href="/wastage-calculator" className="text-amber-600 hover:text-amber-700 font-medium">Making charges calculator →</a>
                <a href="/news" className="text-amber-600 hover:text-amber-700 font-medium">Latest gold news →</a>
              </div>
            </div>
          </section>
          
          {/* Related Searches - Internal Linking for SEO */}
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">🔍 Related Gold Rate Searches</p>
            <div className="flex flex-wrap gap-2">
              <a href="/gold-rate-today" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today India
              </a>
              {config.relatedCities.map((relatedCity) => (
                <a 
                  key={relatedCity.slug}
                  href={`/gold-rate/${relatedCity.slug}`} 
                  className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {relatedCity.name} gold rate
                </a>
              ))}
              <a href={`/silver-rate/${config.slug}`} className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                {config.name} silver rate
              </a>
            </div>
          </div>
        </article>
      </div>

      {/* Full interactive UI below */}
      <CityPageShell
        city={config.name}
        intro={config.intro}
        updated={rates.date}
        dateISO={rates.dateISO}
        gold22k={rates.gold22k}
        gold24k={rates.gold24k}
        silver1kg={rates.silver1kg}
        priceChange={rates.priceChange}
        history={rates.history}
        hideAnswerBlock={true}
        localInfo={config.localInfo}
        faqs={faqs}
        similarCities={config.similarCities}
      >
        {/* City-specific static content for SEO */}
        {config.slug === 'chennai' && <ChennaiStaticContent />}
        {config.slug === 'mumbai' && <MumbaiStaticContent />}
        {config.slug === 'hyderabad' && <HyderabadStaticContent />}
        {config.slug === 'ahmedabad' && <AhmedabadStaticContent />}
        {config.slug === 'ayodhya' && <AyodhyaStaticContent />}
        {config.slug === 'bangalore' && <BangaloreStaticContent />}
        {config.slug === 'bhubaneswar' && <BhubaneswarStaticContent />}
        {config.slug === 'chandigarh' && <ChandigarhStaticContent />}
        {config.slug === 'coimbatore' && <CoimbatoreStaticContent />}
        {config.slug === 'delhi' && <DelhiStaticContent />}
        {config.slug === 'jaipur' && <JaipurStaticContent />}
        {config.slug === 'kerala' && <KeralaStaticContent />}
        {config.slug === 'kochi' && <KochiStaticContent />}
        {config.slug === 'kolkata' && <KolkataStaticContent />}
        {config.slug === 'lucknow' && <LucknowStaticContent />}
        {config.slug === 'madurai' && <MaduraiStaticContent />}
        {config.slug === 'mangalore' && <MangaloreStaticContent />}
        {config.slug === 'moodbidri' && <MoodbidriStaticContent />}
        {config.slug === 'mysore' && <MysoreStaticContent />}
        {config.slug === 'nagpur' && <NagpurStaticContent />}
        {config.slug === 'nashik' && <NashikStaticContent />}
        {config.slug === 'patna' && <PatnaStaticContent />}
        {config.slug === 'pune' && <PuneStaticContent />}
        {config.slug === 'rajkot' && <RajkotStaticContent />}
        {config.slug === 'salem' && <SalemStaticContent />}
        {config.slug === 'surat' && <SuratStaticContent />}
        {config.slug === 'tirunelveli' && <TirunelveliStaticContent />}
        {config.slug === 'trichy' && <TrichyStaticContent />}
        {config.slug === 'vadodara' && <VadodaraStaticContent />}
        {config.slug === 'vijayawada' && <VijayawadaStaticContent />}
        {config.slug === 'visakhapatnam' && <VisakhapatnamStaticContent />}
      </CityPageShell>
    </>
  );
}

// Cache page for 5 minutes - combined with DB-level caching
export const revalidate = 300;

