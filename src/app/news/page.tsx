import Link from "next/link";

const articles = [
  {
    title: "Why Gold Price Increased Today?",
    date: "20 Nov 2025",
    city: "India",
    summary:
      "Gold rallied ₹180 as USD weakened and Middle-East tensions lifted safe-haven demand.",
    slug: "gold-price-increase-today",
  },
  {
    title: "Gold Rate Prediction 2025",
    date: "18 Nov 2025",
    city: "Mumbai",
    summary:
      "Analysts expect ₹70k targets if Fed cuts arrive early Q2. Check support levels.",
    slug: "gold-rate-prediction-2025",
  },
  {
    title: "22K vs 24K: What to Buy?",
    date: "15 Nov 2025",
    city: "Chennai",
    summary:
      "Understand purity, resale value, and making charges before selecting jewellery.",
    slug: "22k-vs-24k-guide",
  },
];

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <section className="mx-auto max-w-5xl px-4 py-10">
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

        <div className="mt-8 space-y-4">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">
                    {article.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {article.date} • {article.city}
                  </p>
                </div>
                <Link
                  href={`/news/${article.slug}`}
                  className="text-sm font-semibold text-amber-600"
                >
                  Read →
                </Link>
              </div>
              <p className="mt-3 text-sm text-slate-600">{article.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

