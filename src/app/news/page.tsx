import Link from "next/link";
import { getGroupedNews } from "@/lib/newsDB";
import { getRecentRecaps, formatDateForDisplay } from "@/lib/recapDB";
import NewsClient from "./NewsClient";
import type { GroupedNews } from "@/lib/newsTypes";
import type { DailyRecap } from "@/lib/recapTypes";

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
  let initialData: { groups: GroupedNews[]; totalCount: number; hasMore: boolean } = { 
    groups: [], 
    totalCount: 0, 
    hasMore: false 
  };
  
  let recaps: DailyRecap[] = [];
  
  try {
    initialData = await getGroupedNews(15, 0);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
  
  try {
    recaps = await getRecentRecaps(2); // Show max 2 recaps on news page
  } catch (error) {
    console.error("Error fetching recaps:", error);
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
        
        <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Gold News Desk
          </p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">
            Gold price headlines, expert views & MCX recap
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Short, daily updates for investors & jewellery shoppers. Bookmark for
            live coverage.
          </p>
        </div>

        {/* Daily Recaps Section */}
        {recaps.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                📰 Daily Market Recaps
              </h2>
              <Link
                href="/news/recap"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View all →
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
            📰 Latest Headlines
          </h2>
          <NewsClient 
            initialGroups={initialData.groups} 
            initialHasMore={initialData.hasMore}
            totalCount={initialData.totalCount}
          />
        </div>

        <div className="mt-10 rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-charcoal">Tools & links</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Gold price calculator</p>
              <p className="text-sm text-slate-600 mt-1">Enter grams → get cost with GST.</p>
            </Link>
            <Link href="/wastage-calculator" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Wastage & making</p>
              <p className="text-sm text-slate-600 mt-1">Estimate making + wastage charges.</p>
            </Link>
            <Link href="/purity-converter" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Purity converter</p>
              <p className="text-sm text-slate-600 mt-1">22K ↔ 24K instantly.</p>
            </Link>
            <Link href="/silver-rate" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Silver rate today</p>
              <p className="text-sm text-slate-600 mt-1">₹/kg with 30-day history.</p>
            </Link>
            <Link href="/chennai" className="rounded-2xl border border-slate-100 p-4 hover:border-amber-200">
              <p className="font-semibold text-charcoal">Gold rate in Chennai</p>
              <p className="text-sm text-slate-600 mt-1">Per gram, charts, FAQs.</p>
            </Link>
            <Link href="/mumbai" className="rounded-2xl border border-slate-100 p-4 hover-border-amber-200">
              <p className="font-semibold text-charcoal">Gold rate in Mumbai</p>
              <p className="text-sm text-slate-600 mt-1">22K / 24K per gram.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Fallback revalidation every 1 hour (on-demand revalidation handles freshness)
// The /api/fetch-news endpoint triggers revalidatePath('/news') when new articles are saved
export const revalidate = 3600;
