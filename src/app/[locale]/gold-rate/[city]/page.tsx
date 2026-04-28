import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import CityPageShell from "@/app/components/CityPageShell";
import ChennaiStaticContent from "@/app/components/ChennaiStaticContent";
import MumbaiStaticContent from "@/app/components/MumbaiStaticContent";
import HyderabadStaticContent from "@/app/components/HyderabadStaticContent";
import AhmedabadStaticContent from "@/app/components/AhmedabadStaticContent";
import AyodhyaStaticContent from "@/app/components/AyodhyaStaticContent";
import BangaloreStaticContent from "@/app/components/BangaloreStaticContent";
import BhubaneswarStaticContent from "@/app/components/BhubaneswarStaticContent";
import ChandigarhStaticContent from "@/app/components/ChandigarhStaticContent";
import CoimbatoreStaticContent from "@/app/components/CoimbatoreStaticContent";
import DelhiStaticContent from "@/app/components/DelhiStaticContent";
import JaipurStaticContent from "@/app/components/JaipurStaticContent";
import KeralaStaticContent from "@/app/components/KeralaStaticContent";
import KochiStaticContent from "@/app/components/KochiStaticContent";
import KolkataStaticContent from "@/app/components/KolkataStaticContent";
import LucknowStaticContent from "@/app/components/LucknowStaticContent";
import MaduraiStaticContent from "@/app/components/MaduraiStaticContent";
import MangaloreStaticContent from "@/app/components/MangaloreStaticContent";
import MoodbidriStaticContent from "@/app/components/MoodbidriStaticContent";
import MysoreStaticContent from "@/app/components/MysoreStaticContent";
import NagpurStaticContent from "@/app/components/NagpurStaticContent";
import NashikStaticContent from "@/app/components/NashikStaticContent";
import PatnaStaticContent from "@/app/components/PatnaStaticContent";
import PuneStaticContent from "@/app/components/PuneStaticContent";
import RajkotStaticContent from "@/app/components/RajkotStaticContent";
import SalemStaticContent from "@/app/components/SalemStaticContent";
import SuratStaticContent from "@/app/components/SuratStaticContent";
import TirunelveliStaticContent from "@/app/components/TirunelveliStaticContent";
import TrichyStaticContent from "@/app/components/TrichyStaticContent";
import VadodaraStaticContent from "@/app/components/VadodaraStaticContent";
import VijayawadaStaticContent from "@/app/components/VijayawadaStaticContent";
import VisakhapatnamStaticContent from "@/app/components/VisakhapatnamStaticContent";
import FreshnessTrustBar from "@/app/components/FreshnessTrustBar";
import { fetchCityRates } from "@/lib/fetchCityRates";
import { computeGoldPeriodPercentChanges } from "@/lib/goldRatePeriodChanges";
import { getCityGoldConfig, getAllCitySlugs, generateFAQs } from "@/lib/cityGoldConfig";

type Props = {
  params: Promise<{ locale: string; city: string }>;
};

function getFallbackRates() {
  return {
    gold22k: 59500,
    gold24k: 64700,
    gold18k: Math.round((64700 * 18) / 24),
    silver1kg: 76000,
    source: "mock" as const,
    date: new Date().toLocaleDateString("en-IN"),
    dateISO: new Date().toISOString().split("T")[0],
    priceChange: { gold22k: 0, gold24k: 0, gold18k: 0, silver1kg: 0 },
    history: [],
  };
}

async function fetchCityRatesSafe(cityName: string) {
  try {
    return await fetchCityRates(cityName);
  } catch (error) {
    console.error(`[GoldRateCityPage] Failed fetching rates for ${cityName}:`, error);
    return getFallbackRates();
  }
}

// Generate static params for all cities
export async function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({
    city: city.toLowerCase(),
  }));
}

// Dynamic metadata with date for AIO freshness signals
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { locale, city } = await params;
    const config = getCityGoldConfig(city);
    
    if (!config) {
      return { title: "City Not Found" };
    }

    const t = await getTranslations({ locale, namespace: "meta" });

    // Fetch actual rates for metadata
    const rates = await fetchCityRatesSafe(config.name);
    
    // Calculate per-gram prices for metadata
    const perGram24k = Math.round((rates.gold24k || 0) / 10);
    const perGram22k = Math.round((rates.gold22k || 0) / 10);
    
    const todayFormatted = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    
    const price22k = perGram22k.toLocaleString("en-IN");
    const price24k = perGram24k.toLocaleString("en-IN");
    
    return {
      title: t("cityTitle", { city: config.name, date: todayFormatted }),
      description: t("cityDescription", { city: config.name, price22k, price24k }),
      alternates: {
        canonical: `https://goldmeter.in/gold-rate/${config.slug}`,
        languages: {
          en: `/gold-rate/${config.slug}`,
          hi: `/hi/gold-rate/${config.slug}`,
          ta: `/ta/gold-rate/${config.slug}`,
          te: `/te/gold-rate/${config.slug}`,
        },
      },
      openGraph: {
        title: t("cityTitle", { city: config.name, date: todayFormatted }),
        description: t("cityDescription", { city: config.name, price22k, price24k }),
        type: "website",
        url: `https://goldmeter.in/gold-rate/${config.slug}`,
        siteName: "GoldMeter",
        locale: "en_IN",
        images: [
          {
            url: "https://goldmeter.in/og-image.png",
            width: 1200,
            height: 630,
            alt: `Gold Rate Today ${config.name}`,
          },
        ],
      },
    };
  } catch (error) {
    console.error("[GoldRateCityPage] generateMetadata failed:", error);
    return {
      title: "City Gold Rates | GoldMeter",
      description: "Track live 22K and 24K city-wise gold rates in India with GoldMeter.",
    };
  }
}

export default async function GoldRateCityPage({ params }: Props) {
  const { city } = await params;
  const config = getCityGoldConfig(city);
  
  if (!config) {
    notFound();
  }

  try {
    // Fetch rates from DB, scraping API, or fallback to resilient defaults
    const rates = await fetchCityRatesSafe(config.name);

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
    
    // Format time for display
    const timeFormatted = new Date().toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Generate FAQs with actual prices
    const faqs = generateFAQs(config, perGram24k, perGram22k);

    const periodPctChanges = computeGoldPeriodPercentChanges({
      gold22k10g: rates.gold22k,
      gold24k10g: rates.gold24k,
      priceChange: rates.priceChange,
      history: rates.history,
      dateISO: rates.dateISO,
    });

    return (
      <>
      {/* 🔥 AIO ANSWER BLOCK - Server-rendered plain HTML for AI scrapers */}
      <div className="bg-[#fffdf7]" itemScope itemType="https://schema.org/Product">
        <article className="mx-auto max-w-6xl px-4 pt-6">
          <section className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-lg">
            <h1 className="text-2xl font-extrabold text-amber-800 md:text-3xl" itemProp="name">
              Gold Rate Today {config.name} ({todayFormatted}) – 22K &amp; 24K
            </h1>
            
            {/* Primary AIO answer - structured like competitors */}
            <p className="mt-3 text-base text-slate-700 leading-relaxed" data-ai-answer="true" itemProp="description">
              Today gold rates in {config.name} are <strong>₹{perGram24k.toLocaleString('en-IN')} per gram for 24K</strong> (99.9% purity), <strong>₹{perGram22k.toLocaleString('en-IN')} per gram for 22K</strong> (91.6% purity), and <strong>₹{perGram18k.toLocaleString('en-IN')} per gram for 18K</strong> (75.0% purity). Silver rate is ₹{silverPerGram.toLocaleString('en-IN')} per gram. Prices updated <time dateTime={rates.dateISO}>{todayFormatted}</time>. For all-India benchmark tracking, see{" "}
              <Link href="/gold-rate-today" className="font-semibold text-amber-700 hover:text-amber-600">
                Gold rate today in India
              </Link>.
            </p>
            
            {/* Structured price table for AI extraction */}
            <div className="mt-4 overflow-x-auto" data-price-table="true">
              <table className="w-full text-sm border-collapse" itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
                <caption className="text-left font-semibold text-amber-800 mb-2">
                  Today&apos;s Gold & Silver Rates in {config.name}
                  {/* Schema.org metadata for AggregateOffer - using hidden spans instead of meta tags */}
                  <span itemProp="priceCurrency" className="sr-only">INR</span>
                  <span itemProp="lowPrice" className="sr-only">{perGram18k.toString()}</span>
                  <span itemProp="highPrice" className="sr-only">{perGram24k.toString()}</span>
                </caption>
                <thead>
                  <tr className="bg-amber-100 text-amber-900">
                    <th className="px-3 py-2 text-left border border-amber-200">Metal</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Purity</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per Gram</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per 8g</th>
                    <th className="px-3 py-2 text-left border border-amber-200">Rate per 10g</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 24K</td>
                    <td className="px-3 py-2 border border-amber-200">99.9%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="24k">₹{perGram24k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram24k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(rates.gold24k || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 22K</td>
                    <td className="px-3 py-2 border border-amber-200">91.6%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="22k">₹{perGram22k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram22k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(rates.gold22k || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Gold 18K</td>
                    <td className="px-3 py-2 border border-amber-200">75.0%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="18k">₹{perGram18k.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram18k * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(perGram18k * 10).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2 border border-amber-200 font-medium">Silver</td>
                    <td className="px-3 py-2 border border-amber-200">99.9%</td>
                    <td className="px-3 py-2 border border-amber-200 font-semibold" data-speakable-price="silver">₹{silverPerGram.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{(silverPerGram * 8).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 border border-amber-200">₹{Math.round((rates.silver1kg || 0) / 100).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <FreshnessTrustBar
              dateISO={rates.dateISO}
              dateLabel={todayFormatted}
              timeLabel={timeFormatted}
            />

            {/* SEO: Expanded intro paragraph (150-200 words) - Voice Search Optimized */}
            <div className="mt-4 pt-4 border-t border-amber-200 text-sm text-slate-600 leading-relaxed" data-speakable-summary="true">
              <p>{config.introParagraph1.replace(/{perGram22k}/g, perGram22k.toLocaleString('en-IN')).replace(/{perGram24k}/g, perGram24k.toLocaleString('en-IN')).replace(/{todayDate}/g, todayFormatted)}</p>
              <p className="mt-2">{config.introParagraph2.replace(/{perGram22k}/g, perGram22k.toLocaleString('en-IN')).replace(/{perGram24k}/g, perGram24k.toLocaleString('en-IN'))}</p>
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
              <Link href="/gold-rate-today" className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                Gold rate today India
              </Link>
              {config.relatedCities.map((relatedCity) => (
                <Link 
                  key={relatedCity.slug}
                  href={`/gold-rate/${relatedCity.slug}`} 
                  className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {relatedCity.name} gold rate
                </Link>
              ))}
              <Link href={`/silver-rate/${config.slug}`} className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                {config.name} silver rate
              </Link>
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
        periodPctChanges={periodPctChanges}
        hideAnswerBlock={true}
        localInfo={config.localInfo}
        faqs={faqs}
        similarCities={config.similarCities}
      >
        {/* City-specific static content for SEO */}
        {config.slug === 'chennai' && <ChennaiStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'mumbai' && <MumbaiStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'hyderabad' && <HyderabadStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'ahmedabad' && <AhmedabadStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'ayodhya' && <AyodhyaStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'bangalore' && <BangaloreStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'bhubaneswar' && <BhubaneswarStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'chandigarh' && <ChandigarhStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'coimbatore' && <CoimbatoreStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'delhi' && <DelhiStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'jaipur' && <JaipurStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'kerala' && <KeralaStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'kochi' && <KochiStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'kolkata' && <KolkataStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'lucknow' && <LucknowStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'madurai' && <MaduraiStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'mangalore' && <MangaloreStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'moodbidri' && <MoodbidriStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'mysore' && <MysoreStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'nagpur' && <NagpurStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'nashik' && <NashikStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'patna' && <PatnaStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'pune' && <PuneStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'rajkot' && <RajkotStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'salem' && <SalemStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'surat' && <SuratStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'tirunelveli' && <TirunelveliStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'trichy' && <TrichyStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'vadodara' && <VadodaraStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'vijayawada' && <VijayawadaStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
        {config.slug === 'visakhapatnam' && <VisakhapatnamStaticContent perGram22k={perGram22k} perGram24k={perGram24k} />}
      </CityPageShell>
      </>
    );
  } catch (error) {
    console.error(`[GoldRateCityPage] Render failed for city ${config.slug}:`, error);

    const fallbackRates = getFallbackRates();
    const fallbackFaqs = generateFAQs(
      config,
      Math.round(fallbackRates.gold24k / 10),
      Math.round(fallbackRates.gold22k / 10)
    );

    const fallbackPeriodPct = computeGoldPeriodPercentChanges({
      gold22k10g: fallbackRates.gold22k,
      gold24k10g: fallbackRates.gold24k,
      priceChange: fallbackRates.priceChange,
      history: fallbackRates.history,
      dateISO: fallbackRates.dateISO,
    });

    return (
      <CityPageShell
        city={config.name}
        intro={config.intro}
        updated={fallbackRates.date}
        dateISO={fallbackRates.dateISO}
        gold22k={fallbackRates.gold22k}
        gold24k={fallbackRates.gold24k}
        silver1kg={fallbackRates.silver1kg}
        priceChange={fallbackRates.priceChange}
        history={fallbackRates.history}
        periodPctChanges={fallbackPeriodPct}
        localInfo={config.localInfo}
        faqs={fallbackFaqs}
        similarCities={config.similarCities}
      />
    );
  }
}

// Tag-driven freshness via /api/revalidate-gold-rates; page is a 30m safety net during rollout.
export const revalidate = 1800;

