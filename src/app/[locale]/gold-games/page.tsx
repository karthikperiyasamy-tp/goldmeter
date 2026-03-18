import { Link } from "@/i18n/navigation";
import GoldBarStackGame from "@/app/components/games/GoldBarStackGame";
import InternalLinks from "@/app/components/InternalLinks";

export default function GoldGamesPage() {
  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <section className="mx-auto max-w-4xl px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
        >
          ← Back to Home
        </Link>

        <div className="mt-4 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gold Games</p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">Gold Bar Stack Challenge</h1>
          <p className="mt-2 text-sm text-slate-600">
            Drop bars like 8g and 16g into stacks. Match the top bar weight to clear it.
            Keep the board alive as long as possible and beat your best score.
          </p>
        </div>

        <div className="mt-6">
          <GoldBarStackGame />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
          <h2 className="font-semibold text-charcoal">Play and learn</h2>
          <p className="mt-2">
            After your run, check live rates and tools:
            {" "}
            <Link href="/gold-rate-today" className="text-amber-700 hover:underline">
              Gold rate today
            </Link>
            ,{" "}
            <Link href="/calculator" className="text-amber-700 hover:underline">
              gold calculator
            </Link>
            , and{" "}
            <Link href="/wastage-calculator" className="text-amber-700 hover:underline">
              wastage calculator
            </Link>
            .
          </p>
        </div>

        <InternalLinks currentPath="/gold-games" />
      </section>
    </main>
  );
}

