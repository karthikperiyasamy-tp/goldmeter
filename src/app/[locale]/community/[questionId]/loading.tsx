export default function CommunityQuestionLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <section className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-7 w-4/5 rounded bg-slate-100" />
        <div className="mt-3 h-4 w-52 rounded bg-slate-100" />
        <div className="mt-5 space-y-3">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-11/12 rounded bg-slate-100" />
          <div className="h-4 w-10/12 rounded bg-slate-100" />
        </div>
      </section>
      <section className="mt-6 animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-6 w-36 rounded bg-slate-100" />
        <div className="mt-4 space-y-4">
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
