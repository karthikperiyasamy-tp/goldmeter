import Link from "next/link";
import { notFound } from "next/navigation";

const articleMap = {
  "gold-price-increase-today": {
    title: "Why Gold Price Increased Today?",
    date: "20 Nov 2025",
    updated: "14:15 IST",
    city: "India",
    summary:
      "Gold rallied ₹180 as USD weakened and safe-haven demand returned ahead of the Fed minutes.",
    bulletPoints: [
      "USD index slipped below 104, lifting bullion bids.",
      "MCX Dec futures jumped 0.35% tracking COMEX overnight gains.",
      "Rupee at 83.4 adds ₹40 premium per 10g vs yesterday.",
    ],
  },
  "gold-rate-prediction-2025": {
    title: "Gold Rate Prediction 2025",
    date: "18 Nov 2025",
    updated: "11:00 IST",
    city: "Mumbai",
    summary:
      "Strategists expect ₹70k targets if Fed cuts arrive early Q2. ETF holdings back in focus.",
    bulletPoints: [
      "Societe Generale lifts FY25 target to $2,450/oz.",
      "Domestic fabrication demand remains seasonally strong.",
      "ETF inflows positive for the second consecutive week.",
    ],
  },
  "22k-vs-24k-guide": {
    title: "22K vs 24K: What to Buy?",
    date: "15 Nov 2025",
    updated: "09:45 IST",
    city: "Chennai",
    summary:
      "Jewellery buyers weigh purity vs durability. Here’s how to decide during wedding season.",
    bulletPoints: [
      "22K suits intricate jewellery; 24K better for coins.",
      "Wastage & making charges add 8%–12% to 22K ornaments.",
      "Check hallmarking & BIS stamp to avoid purity disputes.",
    ],
  },
} satisfies Record<
  string,
  {
    title: string;
    date: string;
    updated: string;
    city: string;
    summary: string;
    bulletPoints: string[];
  }
>;

type ArticleSlug = keyof typeof articleMap;

export async function generateStaticParams() {
  return Object.keys(articleMap).map((slug) => ({ slug }));
}

export default function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug as ArticleSlug;
  const article = articleMap[slug];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link href="/news" className="text-amber-600">
            ← Back
          </Link>
          <span>{article.city} coverage</span>
        </div>

        <article className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Gold News • {article.city}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">
            {article.title}
          </h1>
          <p className="text-xs text-slate-500">
            {article.date} • Updated {article.updated}
          </p>
          <div className="mt-6 h-52 rounded-3xl bg-slate-100 text-center text-slate-400">
            Hero image placeholder
          </div>
          <p className="mt-6 text-base text-slate-700">{article.summary}</p>

          <section className="mt-6 space-y-4 text-sm text-slate-600">
            <p>
              Today&apos;s gold price change: 22K +₹45 • 24K -₹30. Price
              movement was led by a weaker dollar and moderate ETF inflows. MCX
              December futures settled at ₹62,340 with open interest rising 2.1%.
            </p>
            <p>
              Global cues: US yields eased after the latest CPI print, while
              Asian equities remained choppy. Jewellery demand stayed resilient
              in southern cities thanks to the wedding calendar.
            </p>
            <p>
              Tomorrow&apos;s watchlist: US jobless claims, MCX expiry rollover,
              and RBI FX flows for rupee direction.
            </p>
          </section>

          <div className="mt-6 rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-amber-700">
              Today’s Gold Rate in Your City
            </h2>
            <p className="mt-2">
              Pick your city to compare 22K / 24K rates and set alerts.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
            >
              View live rates
            </Link>
          </div>
        </article>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-charcoal">
            Related articles
          </h3>
          <div className="mt-3 space-y-3 text-sm text-amber-600">
            {Object.entries(articleMap)
              .filter(([key]) => key !== slug)
              .map(([key, item]) => (
                <Link
                  key={key}
                  href={`/news/${key}`}
                  className="block rounded-2xl border border-slate-100 bg-white px-4 py-3 text-charcoal hover:border-amber-200"
                >
                  {item.title} →
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

