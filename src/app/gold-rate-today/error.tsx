"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GoldRateTodayError({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14">
      <section className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 shadow-soft">
        <p className="text-sm font-semibold text-rose-700">Unable to load gold rates</p>
        <h1 className="mt-2 text-2xl font-bold text-charcoal">
          Gold rate today is temporarily unavailable.
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Try refreshing this page. You can also view city-wise prices from the homepage.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Retry
          </button>
          <a
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-300"
          >
            Go to homepage
          </a>
        </div>
        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-5 overflow-auto rounded-xl border border-rose-100 bg-white p-3 text-xs text-rose-700">
            {error.message}
          </pre>
        )}
      </section>
    </main>
  );
}
