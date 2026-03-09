import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-amber-700">404 - Page not found</p>
        <h1 className="mt-2 text-2xl font-bold text-charcoal">
          This page does not exist.
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          The link may be outdated, or the page may have moved.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Go to homepage
          </Link>
          <Link
            href="/gold-rate-today"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-300"
          >
            View gold rates
          </Link>
        </div>
      </section>
    </main>
  );
}
