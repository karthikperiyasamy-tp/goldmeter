export default function CityGoldRateLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="animate-pulse rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
        <div className="h-7 w-64 rounded bg-amber-100" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
        </div>
      </section>
      <section className="mt-6 animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-6 w-48 rounded bg-slate-100" />
        <div className="mt-4 h-52 rounded-2xl bg-slate-100" />
      </section>
    </main>
  );
}
