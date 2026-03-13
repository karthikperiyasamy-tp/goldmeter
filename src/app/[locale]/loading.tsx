export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="animate-pulse rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
        <div className="h-6 w-1/2 rounded bg-amber-100" />
        <div className="mt-4 h-4 w-5/6 rounded bg-slate-100" />
        <div className="mt-2 h-4 w-4/6 rounded bg-slate-100" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
