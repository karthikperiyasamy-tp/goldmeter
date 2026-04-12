import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { PUBLISHED_ARTICLES, ARTICLE_CATEGORIES, getArticleDateISO } from "@/lib/articles";
import ArticlesListClient from "@/app/components/articles/ArticlesListClient";

export default async function ArticlesPage() {
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen bg-[#fffdf7] pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-charcoal font-medium">Articles</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            Gold Knowledge Hub
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal">
            Gold Articles &amp; Guides
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            In-depth articles on gold investing, buying tips, hallmarking, spot
            prices, and everything you need to make smarter gold decisions in
            India.
          </p>
          <div className="mt-4 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p>
              Start with the live benchmark:{' '}
              <Link href="/gold-rate-today" className="font-semibold underline hover:text-amber-700">
                Gold rate today in India
              </Link>
              .
            </p>
            <p>
              {tc("worldGoldArticlesCalloutBefore")}{' '}
              <Link href="/world-gold-price" className="font-semibold underline hover:text-amber-700">
                {tc("worldGoldArticlesCalloutLink")}
              </Link>{' '}
              {tc("worldGoldArticlesCalloutAfter")}
            </p>
          </div>
        </header>

        {/* Client component handles sort + filter */}
        <ArticlesListClient
          articles={PUBLISHED_ARTICLES}
          categories={ARTICLE_CATEGORIES}
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Gold Articles & Guides",
              description:
                "In-depth articles on gold investing, buying tips, hallmarking, spot prices, and more.",
              url: "https://goldmeter.in/articles",
              publisher: {
                "@type": "Organization",
                name: "GoldMeter",
                url: "https://goldmeter.in",
              },
              mainEntity: PUBLISHED_ARTICLES.map((a) => {
                const isoDate = getArticleDateISO(a);
                return {
                  "@type": "Article",
                  headline: a.title,
                  description: a.preview,
                  url: `https://goldmeter.in/articles/${a.slug}`,
                  datePublished: isoDate,
                  dateModified: isoDate,
                  author: { "@type": "Organization", name: "GoldMeter" },
                };
              }),
            }),
          }}
        />
      </div>
    </div>
  );
}
