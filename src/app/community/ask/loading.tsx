export default function CommunityAskLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <section className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-7 w-44 rounded bg-slate-100" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-100" />
        <div className="mt-6 space-y-4">
          <div>
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="mt-2 h-10 rounded-xl bg-slate-100" />
          </div>
          <div>
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="mt-2 h-28 rounded-2xl bg-slate-100" />
          </div>
          <div className="h-10 w-32 rounded-full bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
