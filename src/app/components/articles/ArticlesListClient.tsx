"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

type SortBy = "category" | "date" | "readTime";

interface Props {
  articles: ArticleMeta[];
  categories: { key: ArticleMeta["category"]; label: string; icon: string }[];
}

export default function ArticlesListClient({ articles, categories }: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("category");
  const [filterCat, setFilterCat] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = [...articles];
    if (filterCat !== "all") {
      list = list.filter((a) => a.category === filterCat);
    }
    if (sortBy === "date") {
      // Newest first — parse the "Updated Dec 14, 2025" format
      list.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortBy === "readTime") {
      // Shortest first
      list.sort(
        (a, b) =>
          parseInt(a.readTime) - parseInt(b.readTime)
      );
    }
    // "category" keeps the original order (grouped by category)
    return list;
  }, [articles, sortBy, filterCat]);

  // Group by category for the "category" sort view
  const grouped = useMemo(() => {
    if (sortBy !== "category") return null;
    return categories
      .map((cat) => ({
        ...cat,
        items: filtered.filter((a) => a.category === cat.key),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, filtered, sortBy]);

  return (
    <>
      {/* Sort & Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Filter by category */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCat("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterCat === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCat(cat.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filterCat === cat.key
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          >
            <option value="category">By Category</option>
            <option value="date">By Date</option>
            <option value="readTime">By Read Time</option>
          </select>
        </div>
      </div>

      {/* Articles */}
      {grouped ? (
        // Grouped by category
        grouped.map((cat) => (
          <section key={cat.key} className="mb-8">
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
              <span>{cat.icon}</span> {cat.label}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        ))
      ) : (
        // Flat sorted list
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-10">
          No articles match the selected filter.
        </p>
      )}
    </>
  );
}

function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="rounded-2xl border border-slate-100 bg-white p-5 hover:border-amber-200 hover:shadow-md transition-all group"
    >
      <h3 className="font-semibold text-charcoal group-hover:text-amber-700 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-xs text-slate-500 mt-2">
        {article.date} &middot; {article.readTime}
      </p>
      <p className="text-sm text-slate-600 mt-2 line-clamp-3">
        {article.preview}
      </p>
      <span className="inline-block mt-3 text-sm font-semibold text-amber-600 group-hover:text-amber-700">
        Read article →
      </span>
    </Link>
  );
}
