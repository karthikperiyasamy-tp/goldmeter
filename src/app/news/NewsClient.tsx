"use client";

import { useState } from "react";
import type { GroupedNews, NewsArticle } from "@/lib/newsTypes";

type NewsClientProps = {
  initialGroups: GroupedNews[];
  initialHasMore: boolean;
  totalCount: number;
};

function ArticleCard({ article }: { article: NewsArticle }) {
  const timeAgo = getTimeAgo(new Date(article.publishedAt));

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-charcoal leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {article.sourceName} • {timeAgo}
          </p>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">
            {article.summary}
          </p>
        </div>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors whitespace-nowrap"
        >
          Read full article →
        </a>
      </div>
    </article>
  );
}

function DateGroup({ group }: { group: GroupedNews }) {
  const isToday = group.label === "Today";
  const isYesterday = group.label === "Yesterday";

  return (
    <div className="mt-8 first:mt-6">
      {/* Date Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
            isToday
              ? "bg-amber-500 text-white"
              : isYesterday
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {group.label}
        </div>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">
          {group.articles.length} article{group.articles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {group.articles.map((article, index) => (
          <ArticleCard key={article._id || index} article={article} />
        ))}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function NewsClient({
  initialGroups,
  initialHasMore,
  totalCount,
}: NewsClientProps) {
  const [groups, setGroups] = useState<GroupedNews[]>(initialGroups);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(15);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/news?limit=15&offset=${offset}`);
      const data = await res.json();

      if (data.success && data.groups.length > 0) {
        // Merge new groups with existing ones
        setGroups((prevGroups) => {
          const mergedGroups = [...prevGroups];

          for (const newGroup of data.groups) {
            const existingIndex = mergedGroups.findIndex(
              (g) => g.date === newGroup.date
            );

            if (existingIndex >= 0) {
              // Merge articles into existing group
              const existingIds = new Set(
                mergedGroups[existingIndex].articles.map((a) => a._id)
              );
              const newArticles = newGroup.articles.filter(
                (a: NewsArticle) => !existingIds.has(a._id)
              );
              mergedGroups[existingIndex].articles.push(...newArticles);
            } else {
              // Add new group
              mergedGroups.push(newGroup);
            }
          }

          // Sort groups by date (newest first)
          mergedGroups.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          return mergedGroups;
        });

        setOffset((prev) => prev + 15);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show empty state if no articles
  if (groups.length === 0) {
    return (
      <div className="mt-8 text-center py-12">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-lg font-semibold text-slate-700">No news yet</h3>
        <p className="text-sm text-slate-500 mt-2">
          News articles will appear here once fetched from sources.
        </p>
        <p className="text-xs text-slate-400 mt-4">
          Admin: Visit{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">/api/fetch-news</code>{" "}
          to fetch articles
        </p>
      </div>
    );
  }

  const displayedCount = groups.reduce((sum, g) => sum + g.articles.length, 0);

  return (
    <div>
      {/* News Groups */}
      {groups.map((group) => (
        <DateGroup key={group.date} group={group} />
      ))}

      {/* View More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Loading...
              </>
            ) : (
              <>
                View More Articles
                <span className="text-xs text-slate-400">
                  ({displayedCount} of {totalCount})
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* End of articles message */}
      {!hasMore && groups.length > 0 && (
        <div className="mt-8 text-center py-6">
          <p className="text-sm text-slate-500">
            ✓ You&apos;ve seen all {totalCount} articles
          </p>
        </div>
      )}
    </div>
  );
}

