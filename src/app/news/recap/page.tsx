import Link from "next/link";
import { getAllRecaps, formatDateForDisplay } from "@/lib/recapDB";
import type { DailyRecap } from "@/lib/recapTypes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Gold Market Recaps | GoldMeter",
  description: "Browse our daily gold market recaps. Get comprehensive summaries of gold price movements, market trends, and expert insights from multiple news sources.",
  // Demote recap listing for AIO - let city pages win for "gold rate today" queries
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Daily Gold Market Recaps",
    description: "Comprehensive summaries of daily gold market news and trends",
  },
};

function RecapCard({ recap, featured }: { recap: DailyRecap; featured?: boolean }) {
  const displayDate = formatDateForDisplay(recap.date);
  
  if (featured) {
    return (
      <Link
        href={`/news/recap/${recap.slug}`}
        className="group block rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-6 hover:border-amber-400 hover:shadow-lg transition-all"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-lg">
            📊
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold uppercase">
                Latest Recap
              </span>
              <span className="text-sm text-slate-500">{displayDate}</span>
            </div>
            <h2 className="text-xl font-bold text-charcoal line-clamp-2 group-hover:text-amber-700 transition-colors">
              {recap.title}
            </h2>
            <p className="text-sm text-slate-600 line-clamp-2 mt-2">
              {recap.summary}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-slate-500">📰 Based on {recap.sourcesCount} sources</span>
              <span className="text-amber-600 font-semibold text-sm group-hover:underline">
                Read full recap →
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Link
      href={`/news/recap/${recap.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 hover:shadow-md transition-all"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
        📊
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-slate-400">{displayDate}</span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-400">{recap.sourcesCount} sources</span>
        </div>
        <h3 className="text-sm font-semibold text-charcoal line-clamp-1 group-hover:text-amber-700 transition-colors">
          {recap.title}
        </h3>
      </div>
      <span className="flex-shrink-0 text-amber-600 group-hover:translate-x-1 transition-transform">
        →
      </span>
    </Link>
  );
}

export default async function RecapsPage() {
  let recaps: DailyRecap[] = [];
  
  try {
    recaps = await getAllRecaps(30);
  } catch (error) {
    console.error("Error fetching recaps:", error);
  }

  const [latestRecap, ...olderRecaps] = recaps;

  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <section className="mx-auto max-w-4xl px-4 pt-6">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4"
        >
          ← Back to News
        </Link>

        {/* Explicit deferral to city pages - tells AI this is NOT the answer page */}
        <div className="mb-6 rounded-2xl bg-amber-100 border border-amber-300 p-4">
          <p className="text-sm text-amber-900">
            <strong>Looking for today&apos;s gold rate?</strong> See the dedicated price page:{' '}
            <Link href="/chennai" className="underline font-semibold hover:text-amber-700">Gold Rate in Chennai</Link>,{' '}
            <Link href="/mumbai" className="underline font-semibold hover:text-amber-700">Mumbai</Link>,{' '}
            <Link href="/delhi" className="underline font-semibold hover:text-amber-700">Delhi</Link>, or{' '}
            <Link href="/bangalore" className="underline font-semibold hover:text-amber-700">Bangalore</Link>.
          </p>
        </div>
        
        {/* Header */}
        <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Market Analysis
            </p>
          </div>
          <h1 className="text-3xl font-bold text-charcoal">
            Daily Market Recaps
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Comprehensive summaries of market news and expert insights.
            Each recap analyzes 10+ news sources using AI.
          </p>
        </div>

        {/* Recaps List */}
        {recaps.length === 0 ? (
          <div className="mt-8 text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-slate-700">No recaps yet</h3>
            <p className="text-sm text-slate-500 mt-2">
              Daily recaps are generated automatically each morning.
              Check back tomorrow!
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Featured Latest Recap */}
            {latestRecap && <RecapCard recap={latestRecap} featured />}
            
            {/* Older Recaps */}
            {olderRecaps.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Previous Recaps
                </h2>
                <div className="space-y-2">
                  {olderRecaps.map((recap) => (
                    <RecapCard key={recap._id || recap.slug} recap={recap} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-100 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <strong>How it works:</strong> Every day at 6 AM IST, our AI analyzes the previous day&apos;s 
              gold-related news from multiple sources and generates a comprehensive market recap. 
              This helps you stay informed without reading dozens of articles.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;

