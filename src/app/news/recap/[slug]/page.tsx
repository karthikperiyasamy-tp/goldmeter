import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecapBySlug, getAllRecaps, formatDateForDisplay } from "@/lib/recapDB";
import type { Metadata } from "next";
import StructuredData from "@/app/components/StructuredData";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recap = await getRecapBySlug(slug);
  
  if (!recap) {
    return {
      title: "Recap Not Found | GoldMeter",
    };
  }

  return {
    title: `${recap.title} | GoldMeter`,
    description: recap.summary,
    openGraph: {
      title: recap.title,
      description: recap.summary,
      type: "article",
      publishedTime: recap.publishedAt.toISOString(),
    },
  };
}

// Generate static params for all existing recaps
export async function generateStaticParams() {
  const recaps = await getAllRecaps(30);
  return recaps.map((recap) => ({
    slug: recap.slug,
  }));
}

export default async function RecapPage({ params }: Props) {
  const { slug } = await params;
  const recap = await getRecapBySlug(slug);

  if (!recap) {
    notFound();
  }

  const displayDate = formatDateForDisplay(recap.date);
  const recapUrl = `https://goldmeter.in/news/recap/${slug}`;
  const cityLinks = [
    { name: "Chennai", href: "/chennai" },
    { name: "Mumbai", href: "/mumbai" },
    { name: "Delhi", href: "/delhi" },
  ];

  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <StructuredData
        type="article"
        headline={recap.title}
        description={recap.summary}
        url={recapUrl}
        datePublished={recap.publishedAt}
        dateModified={recap.publishedAt}
        authorName="GoldMeter"
      />
      <article className="mx-auto max-w-3xl px-4 pt-6">
        {/* Back Navigation */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-6"
        >
          ← Back to News
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold">
              Daily Recap
            </span>
            <span className="text-sm text-slate-500">{displayDate}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight mb-4">
            {recap.title}
          </h1>
          
          <p className="text-lg text-slate-600">
            {recap.summary}
          </p>

          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span>📰 Based on {recap.sourcesCount} news sources</span>
            <span>📊 Daily summary</span>
          </div>
        </header>

        {/* Key Highlights */}
        <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
          <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            ⚡ Key Highlights
          </h2>
          <ul className="space-y-3">
            {recap.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <span className="text-slate-700">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Main Content */}
        <section className="prose prose-slate max-w-none">
          <div className="rounded-2xl bg-white border border-slate-100 p-6 md:p-8 shadow-soft">
            {recap.content.split('\n\n').map((paragraph, index) => {
              // Handle headers
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl font-semibold text-charcoal mt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg font-semibold text-charcoal mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Handle bold text
              const formattedParagraph = paragraph.replace(
                /\*\*(.*?)\*\*/g, 
                '<strong>$1</strong>'
              );
              return (
                <p 
                  key={index} 
                  className="text-slate-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                />
              );
            })}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100 text-sm text-slate-600">
          <strong>Disclaimer:</strong> This is an AI-generated summary based on news headlines from {displayDate}. 
          For investment decisions, please consult with a financial advisor and verify information from primary sources.
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            View Today&apos;s Gold Rates →
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:border-amber-300 transition-colors"
          >
            More News →
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
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal hover-border-amber-200"
          >
            Wastage & making calculator → compare jeweller quotes
          </Link>
          <Link
            href="/silver-rate"
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal hover-border-amber-200"
          >
            Silver rate today → India & city history
          </Link>
        </div>
      </article>
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;

