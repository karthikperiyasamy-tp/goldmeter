import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getHistoricalGoldRates } from "@/lib/goldRatesDB";
import {
  computeAllIndicators,
  computeChartData,
  type PricePoint,
  type AllIndicators,
} from "@/lib/goldIndicators";
import CalculatorSwitcher from "@/app/components/CalculatorSwitcher";
import MarketPulseCharts from "@/app/components/MarketPulseCharts";

export const revalidate = 1800;

type PageProps = { params: Promise<{ locale: string }> };

function sentimentColor(sentiment: string) {
  switch (sentiment) {
    case "Strong Bullish":
      return "text-emerald-700";
    case "Bullish":
      return "text-green-700";
    case "Neutral":
      return "text-amber-700";
    case "Bearish":
      return "text-orange-700";
    case "Strong Bearish":
      return "text-red-700";
    default:
      return "text-slate-700";
  }
}

function sentimentBg(sentiment: string) {
  switch (sentiment) {
    case "Strong Bullish":
      return "bg-emerald-500";
    case "Bullish":
      return "bg-green-500";
    case "Neutral":
      return "bg-amber-500";
    case "Bearish":
      return "bg-orange-500";
    case "Strong Bearish":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
}

function cardColor(signal: string) {
  if (signal.includes("Bullish") || signal === "Overbought") return "border-green-200 bg-green-50/50";
  if (signal.includes("Bearish") || signal === "Oversold") return "border-orange-200 bg-orange-50/50";
  return "border-slate-200 bg-slate-50/50";
}

function formatINR(n: number | null) {
  if (n === null) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

function pct(n: number | null) {
  if (n === null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n}%`;
}

export default async function GoldMarketPulsePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "goldMarketPulse" });

  const history = await getHistoricalGoldRates("India", 365);

  const data: PricePoint[] = (history ?? []).map((d) => ({
    date: d.date,
    price: d.gold24k / 10,
    timestamp: d.timestamp,
  }));

  const result = computeAllIndicators(data);

  if (!result) {
    return (
      <main className="min-h-screen bg-amber-50 py-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-2xl font-bold text-charcoal">{t("title")}</h1>
          <p className="mt-4 text-slate-600">{t("noData")}</p>
          <Link href="/gold-rate-today" className="mt-4 inline-block text-amber-700 underline">
            {t("checkGoldRate")}
          </Link>
        </div>
      </main>
    );
  }

  const { currentPrice, dataPoints, composite, indicators } = result;
  const ind = indicators as AllIndicators;
  const chartData = computeChartData(data, 90);

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-amber-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-amber-600"
              >
                {t("backHome")}
              </Link>
              <p className="text-xs uppercase tracking-widest text-slate-500">{t("goldTools")}</p>
              <h1 className="mt-2 text-3xl font-bold text-charcoal">{t("title")}</h1>
              <p className="text-sm text-slate-600">
                {t("subtitle", { date: todayFormatted })}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t("basedOn", { points: String(dataPoints) })} ·{" "}
                <Link href="/gold-rate-today" className="font-medium text-amber-700 underline">
                  {t("checkGoldRate")}
                </Link>
              </p>

              {/* Current price */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
                <div>
                  <p className="text-xs text-slate-500">{t("currentPrice")}</p>
                  <p className="text-2xl font-bold text-charcoal">{formatINR(currentPrice)}/g</p>
                </div>
                <p className="text-xs text-slate-500">24K · India</p>
              </div>

              {/* Disclaimer */}
              <div className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                <p className="text-xs font-semibold text-yellow-900">{t("disclaimerShort")}</p>
              </div>
            </div>

            {/* Interactive Charts — gauge + price trend */}
            <MarketPulseCharts
              chartData={chartData}
              compositeScore={composite.score}
              compositeSentiment={
                t(("sentiment_" + composite.sentiment.replace(/ /g, "")) as "sentiment_Neutral")
              }
              rsiValue={ind.rsi.value}
              bollingerUpper={ind.bollinger.upper}
              bollingerLower={ind.bollinger.lower}
              support={ind.supportResistance.support}
              resistance={ind.supportResistance.resistance}
            />

            {/* Indicator Cards — 2×3 grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* RSI */}
              <div className={`rounded-2xl border p-4 ${cardColor(ind.rsi.signal)}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("rsiTitle")}</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{ind.rsi.value ?? "—"}</p>
                <p className={`text-sm font-medium ${sentimentColor(ind.rsi.signal.includes("Bullish") ? "Bullish" : ind.rsi.signal.includes("Bearish") ? "Bearish" : "Neutral")}`}>
                  {ind.rsi.signal}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">{t("rsiExplain")}</p>
              </div>

              {/* MACD */}
              <div className={`rounded-2xl border p-4 ${cardColor(ind.macd.trend)}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("macdTitle")}</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{ind.macd.histogram ?? "—"}</p>
                <p className={`text-sm font-medium ${sentimentColor(ind.macd.trend)}`}>{ind.macd.trend}</p>
                <div className="mt-2 flex gap-3 text-[11px] text-slate-500">
                  <span>MACD: {ind.macd.macd ?? "—"}</span>
                  <span>Signal: {ind.macd.signal ?? "—"}</span>
                </div>
              </div>

              {/* Momentum */}
              <div className={`rounded-2xl border p-4 ${cardColor(ind.momentum.direction === "up" ? "Bullish" : ind.momentum.direction === "down" ? "Bearish" : "Neutral")}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("momentumTitle")}</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{pct(ind.momentum.roc30d)}</p>
                <p className="text-sm font-medium text-slate-600">{t("thirtyDayROC")}</p>
                <p className="mt-2 text-[11px] text-slate-500">{t("sevenDayROC")}: {pct(ind.momentum.roc7d)}</p>
              </div>

              {/* Bollinger */}
              <div className={`rounded-2xl border p-4 ${cardColor(ind.bollinger.percentB !== null && ind.bollinger.percentB > 0.5 ? "Bullish" : "Bearish")}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("bollingerTitle")}</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{ind.bollinger.percentB !== null ? `${Math.round(ind.bollinger.percentB * 100)}%` : "—"}</p>
                <p className="text-sm font-medium text-slate-600">%B ({t("bandPosition")})</p>
                <div className="mt-2 flex gap-3 text-[11px] text-slate-500">
                  <span>{t("upper")}: {formatINR(ind.bollinger.upper)}</span>
                  <span>{t("lower")}: {formatINR(ind.bollinger.lower)}</span>
                </div>
              </div>

              {/* Volatility */}
              <div className={`rounded-2xl border p-4 ${cardColor("Neutral")}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("volatilityTitle")}</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">
                  {ind.volatility.annualized !== null ? `${ind.volatility.annualized}%` : "—"}
                </p>
                <p className="text-sm font-medium text-slate-600">{t("annualized")}</p>
                <p className="mt-2 text-[11px] text-slate-500">
                  {t("volatilityLevel")}: {ind.volatility.level === "low" ? t("low") : ind.volatility.level === "high" ? t("high") : t("normalLevel")}
                </p>
              </div>

              {/* Support / Resistance */}
              <div className={`rounded-2xl border p-4 ${cardColor("Neutral")}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("supportResistance")}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600 font-medium">{t("resistance")}</span>
                    <span className="text-sm font-bold">{formatINR(ind.supportResistance.resistance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">{t("currentLabel")}</span>
                    <span className="text-sm font-bold text-amber-800">{formatINR(currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600 font-medium">{t("support")}</span>
                    <span className="text-sm font-bold">{formatINR(ind.supportResistance.support)}</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">{t("sixtyDayRange")}</p>
              </div>
            </div>

            {/* Moving Averages Detail */}
            <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
              <h2 className="text-sm font-semibold text-charcoal">{t("movingAverages")}</h2>
              <p className="mt-1 text-xs text-slate-500">{t("movingAveragesDesc")}</p>
              <div className="mt-4 space-y-3">
                {([
                  ["SMA-7", ind.sma.sma7, ind.priceVsMA.aboveSMA7],
                  ["SMA-20", ind.sma.sma20, ind.priceVsMA.aboveSMA20],
                  ["SMA-50", ind.sma.sma50, ind.priceVsMA.aboveSMA50],
                  ["SMA-200", ind.sma.sma200, ind.priceVsMA.aboveSMA200],
                ] as [string, number | null, boolean | null][]).map(([label, value, above]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {above !== null ? (
                        <span className={`text-lg ${above ? "text-green-600" : "text-orange-600"}`}>
                          {above ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span className="text-lg text-slate-300">—</span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-charcoal">{label}</p>
                        <p className="text-xs text-slate-500">
                          {above !== null
                            ? above
                              ? t("priceAbove")
                              : t("priceBelow")
                            : t("insufficientData")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-charcoal">{value !== null ? formatINR(Math.round(value)) : "—"}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
                <p className="text-sm font-semibold text-amber-900">
                  {t("overallMASignal")}: <span className={sentimentColor(ind.priceVsMA.maSignal)}>{ind.priceVsMA.maSignal}</span>
                </p>
              </div>
            </div>

            {/* Education Accordions */}
            <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
              <h2 className="text-sm font-semibold text-charcoal">{t("whatIndicatorsMean")}</h2>
              <div className="mt-4 space-y-2">
                {(["rsi", "macd", "bollinger", "momentum", "volatility", "supportResistanceEdu"] as const).map((key) => (
                  <details key={key} className="rounded-xl border border-slate-200">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      {t(("edu_" + key + "Title") as "edu_rsiTitle")}
                    </summary>
                    <p className="px-4 pb-3 text-xs leading-relaxed text-slate-600">
                      {t(("edu_" + key + "Body") as "edu_rsiBody")}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* How We Calculate */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6">
              <h2 className="text-sm font-semibold text-blue-900">{t("howWeCalculateTitle")}</h2>
              <p className="mt-2 text-xs text-blue-800">{t("howWeCalculateBody")}</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-blue-800">
                <li>{t("howBullet1")}</li>
                <li>{t("howBullet2")}</li>
                <li>{t("howBullet3")}</li>
                <li>{t("howBullet4")}</li>
              </ul>
            </div>

            {/* Related Tools */}
            <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4">
              <h2 className="text-sm font-semibold text-green-900">{t("relatedTools")}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/gold-rate-today" className="text-xs text-green-700 hover:underline">{t("goldRateToday")}</Link>
                <span className="text-slate-300">·</span>
                <Link href="/calculator" className="text-xs text-green-700 hover:underline">{t("goldCalculator")}</Link>
                <span className="text-slate-300">·</span>
                <Link href="/purity-converter" className="text-xs text-green-700 hover:underline">{t("purityConverter")}</Link>
                <span className="text-slate-300">·</span>
                <Link href="/investment-calculator" className="text-xs text-green-700 hover:underline">{t("investmentCalc")}</Link>
                <span className="text-slate-300">·</span>
                <Link href="/world-gold-price" className="text-xs text-green-700 hover:underline">{t("worldGoldChartTool")}</Link>
              </div>
            </div>

            {/* Full Disclaimer */}
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
              <h2 className="text-sm font-semibold text-red-900">{t("disclaimerTitle")}</h2>
              <p className="mt-2 text-xs leading-relaxed text-red-800">{t("disclaimerFull")}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <CalculatorSwitcher />
          </div>
        </div>
      </div>
    </main>
  );
}
