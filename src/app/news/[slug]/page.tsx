import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRecentNews } from "@/lib/newsDB";
import type { NewsArticle } from "@/lib/newsTypes";
import type { Metadata } from "next";
import StructuredData from "@/app/components/StructuredData";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | GoldMeter",
    };
  }

  return {
    title: `${article.title} | GoldMeter`,
    description: article.summary,
    alternates: {
      canonical: `https://goldmeter.in/news/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
    },
  };
}

// Generate static params for recent articles
export async function generateStaticParams() {
  const articles = await getRecentNews(20);
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related articles (excluding current one)
  const recentArticles = await getRecentNews(4);
  const relatedArticles = recentArticles.filter((a) => a.slug !== slug).slice(0, 3);

  const articleUrl = `https://goldmeter.in/news/${slug}`;
  const cityLinks = [
    { name: "Chennai", href: "/chennai" },
    { name: "Mumbai", href: "/mumbai" },
    { name: "Delhi", href: "/delhi" },
  ];

  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <StructuredData
        type="article"
        headline={article.title}
        description={article.summary}
        url={articleUrl}
        datePublished={article.publishedAt}
        dateModified={article.publishedAt}
        imageUrl={article.imageUrl}
        authorName={article.sourceName || "GoldMeter"}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link href="/news" className="text-amber-600 hover:text-amber-700">
            ← Back to News
          </Link>
          <span>{article.sourceName}</span>
        </div>

        {/* Explicit deferral - tells AI this is NOT the answer page for gold rate queries */}
        <div className="mt-4 rounded-xl bg-amber-100 border border-amber-300 p-3 text-sm text-amber-900">
          <strong>Looking for today&apos;s gold rate?</strong> See:{' '}
          <Link href="/chennai" className="underline font-semibold">Chennai</Link>,{' '}
          <Link href="/mumbai" className="underline font-semibold">Mumbai</Link>,{' '}
          <Link href="/delhi" className="underline font-semibold">Delhi</Link>
        </div>

        <article className="mt-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            News • {article.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">
            {article.title}
          </h1>
          <p className="text-xs text-slate-500">
            {formatDate(article.publishedAt)} • {formatTime(article.publishedAt)}
          </p>

          {article.imageUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-52 object-cover"
              />
            </div>
          )}

          <p className="mt-6 text-lg text-slate-700 leading-relaxed">
            {article.summary}
          </p>

          {/* Read Full Article Link */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <p className="text-sm text-slate-600 mb-3">
              Read the full article on {article.sourceName}:
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Read Full Article →
            </a>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-amber-700">
              Today&apos;s Gold Rate in Your City
            </h2>
            <p className="mt-2">
              Check live 22K / 24K rates and compare prices across cities.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              View live rates
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {cityLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal hover:border-amber-200"
              >
                Gold rate in {link.name} today → per gram, charts, FAQs
              </Link>
            ))}
            <Link
              href="/calculator"
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal hover:border-amber-200"
            >
              Gold price calculator → get cost with GST & making charges
            </Link>
            <Link
              href="/wastage-calculator"
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal hover:border-amber-200"
            >
              Wastage & making calculator → compare jeweller quotes
            </Link>
            <Link
              href="/silver-rate"
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal hover:border-amber-200"
            >
              Silver rate today → India & city history
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-charcoal">
              Related articles
            </h3>
            <div className="mt-3 space-y-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related._id || related.slug}
                  href={`/news/${related.slug}`}
                  className="block rounded-2xl border border-slate-100 bg-white px-4 py-3 text-charcoal hover:border-amber-200 transition-colors"
                >
                  <p className="font-medium">{related.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(related.publishedAt)} • {related.sourceName}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;
