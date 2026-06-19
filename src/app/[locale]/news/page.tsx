import Link from "next/link";
import { Metadata } from "next";
import { locales } from "@/i18n/routing";
import { getGroupedNews, getRecentNews } from "@/lib/newsDB";
import { getRecentRecaps, formatDateForDisplay } from "@/lib/recapDB";
import NewsClient from "./NewsClient";
import InternalLinks from "@/app/components/InternalLinks";
import type { GroupedNews } from "@/lib/newsTypes";
import type { DailyRecap } from "@/lib/recapTypes";

export const metadata: Metadata = {
  title: "Gold News & Market Updates | GoldMeter",
  // Description: 145 chars (recommended: 110-160)
  description: "Stay updated with the latest gold news, price movements, and market analysis. Daily gold rate headlines for Indian investors and jewellery buyers.",
  alternates: {
    canonical: "https://goldmeter.in/news",
  },
  openGraph: {
    title: "Gold News & Market Updates | GoldMeter",
    description: "Stay updated with the latest gold news, price movements, and market analysis. Daily gold rate headlines for Indian investors and jewellery buyers.",
    type: "website",
    url: "https://goldmeter.in/news",
    siteName: "GoldMeter",
    locale: "en_IN",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gold News & Market Updates - GoldMeter",
      },
    ],
  },
};

// Recap card component
function RecapCard({ recap }: { recap: DailyRecap }) {
  const displayDate = formatDateForDisplay(recap.date);
  
  return (
    <Link
      href={`/news/recap/${recap.slug}`}
      className="group block rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50 p-5 hover:border-amber-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl">
          📊
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-semibold uppercase">
              Daily Recap
            </span>
            <span className="text-xs text-slate-500">{displayDate}</span>
          </div>
          <h3 className="text-base font-semibold text-charcoal line-clamp-2 group-hover:text-amber-700 transition-colors">
            {recap.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mt-1">
            {recap.summary}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span>📰 {recap.sourcesCount} sources</span>
            <span className="text-amber-600 font-medium group-hover:underline">
              Read full recap →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Server component that fetches initial data
export default async function NewsPage() {
  // Fetch news and recaps in parallel for faster page load.
  // Also fetch a larger archive list so crawlers can discover older article URLs.
  const [newsResult, recapsResult, archiveResult] = await Promise.allSettled([
    getGroupedNews(15, 0),
    getRecentRecaps(2), // Show max 2 recaps on news page
    getRecentNews(200),
  ]);

  const initialData = newsResult.status === 'fulfilled' 
    ? newsResult.value 
    : { groups: [], totalCount: 0, hasMore: false };
  
  const recaps = recapsResult.status === 'fulfilled' 
    ? recapsResult.value 
    : [];
  const archiveArticles = archiveResult.status === "fulfilled" ? archiveResult.value : [];

  if (newsResult.status === 'rejected') {
    console.error("Error fetching news:", newsResult.reason);
  }
  if (recapsResult.status === 'rejected') {
    console.error("Error fetching recaps:", recapsResult.reason);
  }
  if (archiveResult.status === "rejected") {
    console.error("Error fetching news archive:", archiveResult.reason);
  }

  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <section className="mx-auto max-w-4xl px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4"
        >
          ← Back to Home
        </Link>

        {/* Explicit deferral to city pages - tells AI this is NOT the answer page */}
        <div className="mb-6 rounded-2xl bg-amber-100 border border-amber-300 p-4">
          <p className="text-sm text-amber-900">
            <strong>Looking for today&apos;s gold rate?</strong>{' '}
            <Link href="/gold-rate-today" className="underline font-semibold hover:text-amber-700">
              Gold rate today in India
            </Link>
            . For city prices, see:{' '}
            <Link href="/gold-rate/chennai" className="underline font-semibold hover:text-amber-700">Gold Rate in Chennai</Link>,{' '}
            <Link href="/gold-rate/mumbai" className="underline font-semibold hover:text-amber-700">Gold Rate in Mumbai</Link>,{' '}
            <Link href="/gold-rate/delhi" className="underline font-semibold hover:text-amber-700">Gold Rate in Delhi</Link>, or{' '}
            <Link href="/gold-rate/bangalore" className="underline font-semibold hover:text-amber-700">Gold Rate in Bangalore</Link>.
          </p>
        </div>
        
        <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            News & Analysis
          </p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">
            Market headlines & expert commentary
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Daily updates on market movements, MCX trends, and investment insights.
          </p>
        </div>

        {/* Daily Recaps Section */}
        {recaps.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                📊 Daily Market Recaps
              </h2>
              <Link
                href="/news/recap"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View all daily recaps →
              </Link>
            </div>
            <div className="space-y-3">
              {recaps.map((recap) => (
                <RecapCard key={recap._id || recap.slug} recap={recap} />
              ))}
            </div>
          </div>
        )}

        {/* News Articles Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            📰 Latest Gold News Headlines
          </h2>
          <NewsClient 
            initialGroups={initialData.groups} 
            initialHasMore={initialData.hasMore}
            totalCount={initialData.totalCount}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <h2 className="font-semibold text-charcoal">📌 Key Market Indicators to Watch</h2>
          <ul className="mt-3 list-disc list-inside space-y-1">
            <li><strong>MCX Gold</strong> - Multi Commodity Exchange futures price</li>
            <li><strong>COMEX Gold</strong> - International gold futures benchmark</li>
            <li><strong>USD/INR Rate</strong> - Currency movements affect local gold prices</li>
            <li><strong>Federal Reserve</strong> - Interest rate decisions impact gold</li>
          </ul>
        </div>

        {archiveArticles.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-4">
            <h2 className="text-base font-semibold text-charcoal">News archive (latest 200)</h2>
            <p className="mt-1 text-xs text-slate-500">
              Direct links to recent article pages for easier crawling and discovery.
            </p>
            <ul className="mt-3 space-y-2">
              {archiveArticles.map((article) => (
                <li key={article._id || article.slug}>
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-sm text-slate-700 hover:text-amber-700 transition-colors"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <InternalLinks currentPath="/news" />
      </section>
    </main>
  );
}

// Tag-driven freshness via /api/revalidate-gold-rates (tag=news); 6h safety net.
// News is refreshed by GH Actions cron which busts the 'news' tag.
export const revalidate = 21600;

// Prerender one static (ISR) page per locale so this route is served from the CDN
// instead of invoking a function on every request.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
