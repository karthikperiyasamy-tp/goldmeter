import Link from "next/link";
import { getGroupedNews } from "@/lib/newsDB";
import NewsClient from "./NewsClient";

// Server component that fetches initial data
export default async function NewsPage() {
  let initialData = { groups: [], totalCount: 0, hasMore: false };
  
  try {
    initialData = await getGroupedNews(15, 0);
  } catch (error) {
    console.error("Error fetching news:", error);
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

        <NewsClient 
          initialGroups={initialData.groups} 
          initialHasMore={initialData.hasMore}
          totalCount={initialData.totalCount}
        />
      </section>
    </main>
  );
}

// Revalidate every 30 minutes
export const revalidate = 1800;
