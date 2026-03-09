export default function PortfolioLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="animate-pulse rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft">
        <div className="h-7 w-60 rounded bg-emerald-100" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
        </div>
      </section>
      <section className="mt-6 animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-6 w-44 rounded bg-slate-100" />
        <div className="mt-4 h-44 rounded-2xl bg-slate-100" />
      </section>
    </main>
  );
}
