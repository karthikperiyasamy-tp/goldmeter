import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/lib/articles";
import { ARTICLE_CONTENT_MAP } from "@/app/components/articles/ArticleContentMap";

type Props = { params: Promise<{ slug: string }> };

/** Static generation for all known articles */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

/** Per-article SEO metadata */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — GoldMeter`,
    description: article.preview,
    alternates: { canonical: `/articles/${slug}` },
    keywords: [
      article.shortTitle,
      "gold",
      "gold guide",
      "gold india",
      article.category,
    ],
    openGraph: {
      title: article.title,
      description: article.preview,
      url: `https://goldmeter.in/articles/${slug}`,
      siteName: "GoldMeter",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.preview,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  const content = ARTICLE_CONTENT_MAP[slug];

  if (!article || !content) notFound();

  // Suggest related articles (same category, exclude current)
  const related = ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== slug
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fffdf7] pb-12">
      <div className="mx-auto max-w-3xl px-4 pt-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link
            href="/articles"
            className="hover:text-amber-600 transition-colors"
          >
            Articles
          </Link>
          <span className="mx-2">›</span>
          <span className="text-charcoal font-medium">{article.shortTitle}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mt-4 text-sm text-slate-500">
            <span>{article.date}</span>
            <span>&middot;</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none text-slate-700 prose-headings:text-charcoal prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:my-4">
          {content}
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-bold text-charcoal mb-4">
              Related Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/articles/${r.slug}`}
                  className="rounded-2xl border border-slate-100 bg-white p-5 hover:border-amber-200 hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-charcoal group-hover:text-amber-700 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {r.readTime}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {r.preview}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/articles"
              className="mt-6 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              ← View all articles
            </Link>
          </section>
        )}

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.preview,
              datePublished: "2025-12-14",
              dateModified: "2025-12-14",
              url: `https://goldmeter.in/articles/${slug}`,
              author: { "@type": "Organization", name: "GoldMeter" },
              publisher: {
                "@type": "Organization",
                name: "GoldMeter",
                url: "https://goldmeter.in",
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
