export default function CommunityLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-7 w-56 rounded bg-slate-100" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="h-5 w-2/3 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-40 rounded bg-slate-100" />
            <div className="mt-4 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="h-5 w-3/5 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-36 rounded bg-slate-100" />
            <div className="mt-4 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-4/6 rounded bg-slate-100" />
          </div>
        </div>
      </section>
    </main>
  );
}
