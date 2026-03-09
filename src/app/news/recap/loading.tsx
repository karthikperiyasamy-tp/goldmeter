export default function RecapListLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="animate-pulse rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
        <div className="h-7 w-64 rounded bg-amber-100" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="h-28 rounded-2xl bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
