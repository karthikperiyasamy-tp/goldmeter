export default function ArticleDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <article className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="h-8 w-5/6 rounded bg-slate-100" />
        <div className="mt-3 h-4 w-48 rounded bg-slate-100" />
        <div className="mt-6 h-40 rounded-2xl bg-slate-100" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-11/12 rounded bg-slate-100" />
          <div className="h-4 w-10/12 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-9/12 rounded bg-slate-100" />
        </div>
      </article>
    </main>
  );
}
