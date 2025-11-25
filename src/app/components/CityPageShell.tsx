import Link from "next/link";

type PriceTableRow = {
  carat: string;
  values: {
    label: string;
    price: number;
  }[];
};

type LocalInfo = {
  title: string;
  description: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type CityPageShellProps = {
  city: string;
  updated: string;
  gold22k: number;
  gold24k: number;
  gramPrices: PriceTableRow[];
  todayVsYesterday: {
    gold22k: number;
    gold24k: number;
  };
  localInfo: LocalInfo[];
  faqs: FAQ[];
  similarCities: string[];
};

const inr = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export default function CityPageShell({
  city,
  updated,
  gold22k,
  gold24k,
  gramPrices,
  todayVsYesterday,
  localInfo,
  faqs,
  similarCities,
}: CityPageShellProps) {
  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-amber-700 font-medium hover:bg-amber-100 transition-colors"
          >
            ← Back to India Rates
          </Link>
          <button className="rounded-full border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50 transition-colors">
            Share
          </button>
        </div>

        <section className="mt-6 rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            {city} • Updated {updated}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">
            {city} Gold Rate Today
          </h1>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs text-slate-500">22K (per 10g)</p>
              <p className="text-3xl font-bold text-amber-700">
                ₹{inr.format(gold22k)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              <p className="text-xs text-white/80">24K (per 10g)</p>
              <p className="text-3xl font-bold">₹{inr.format(gold24k)}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Price Table</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-2 text-left font-semibold">Carat</th>
                  {gramPrices[0]?.values.map((value) => (
                    <th key={value.label} className="py-2 text-left font-semibold">
                      {value.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gramPrices.map((row) => (
                  <tr key={row.carat} className="border-t border-slate-100">
                    <td className="py-3 font-semibold">{row.carat}</td>
                    {row.values.map((value) => (
                      <td key={value.label} className="py-3">
                        ₹{inr.format(value.price)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-slate-500">
              Today vs Yesterday
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">
                22K: {todayVsYesterday.gold22k > 0 ? "+" : "-"}₹
                {Math.abs(todayVsYesterday.gold22k)}
              </div>
              <div className="rounded-2xl bg-rose-50 p-4 font-semibold text-rose-600">
                24K: {todayVsYesterday.gold24k > 0 ? "+" : "-"}₹
                {Math.abs(todayVsYesterday.gold24k)}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-slate-500">
              City Price Trend
            </p>
            <div className="mt-3 h-32 rounded-2xl bg-slate-100 text-center text-slate-400">
              30 day trend chart placeholder
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {localInfo.map((info) => (
            <div
              key={info.title}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft"
            >
              <p className="text-sm font-semibold text-charcoal">{info.title}</p>
              <p className="mt-2 text-sm text-slate-600">{info.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold">FAQs</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-100 p-4">
                <summary className="cursor-pointer font-semibold text-charcoal">
                  {faq.question}
                </summary>
                <p className="mt-2 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-slate-500">Similar cities</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {similarCities.map((cityItem) => (
              <Link
                key={cityItem}
                href={`/${cityItem.toLowerCase()}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-amber-200 hover:text-amber-600"
              >
                {cityItem}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

