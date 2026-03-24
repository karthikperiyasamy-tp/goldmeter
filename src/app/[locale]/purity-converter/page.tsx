"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CalculatorSwitcher from "@/app/components/CalculatorSwitcher";
import ToolFeedbackBar from "@/app/components/ToolFeedbackBar";

type CityRate = {
  name: string;
  gold22k: number;
  gold24k: number;
};

type WeightUnit = {
  id: string;
  toGrams: number;
  symbol: string;
};

const defaultCityRates: CityRate[] = [
  { name: "India", gold22k: 59200, gold24k: 64500 },
  { name: "Chennai", gold22k: 59680, gold24k: 64890 },
  { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
];

const weightUnits: WeightUnit[] = [
  { id: "grams", toGrams: 1, symbol: "g" },
  { id: "tola", toGrams: 11.6638, symbol: "tola" },
  { id: "mg", toGrams: 0.001, symbol: "mg" },
  { id: "oz", toGrams: 31.1035, symbol: "oz t" },
  { id: "kg", toGrams: 1000, symbol: "kg" },
];

const purityData = [
  { karat: "24K", percentage: 99.9, parts: "24/24", description: "Pure gold" },
  { karat: "23K", percentage: 95.8, parts: "23/24", description: "Very rare" },
  { karat: "22K", percentage: 91.6, parts: "22/24", description: "Standard Indian jewellery" },
  { karat: "21K", percentage: 87.5, parts: "21/24", description: "Common in Middle East" },
  { karat: "20K", percentage: 83.3, parts: "20/24", description: "Less common" },
  { karat: "18K", percentage: 75.0, parts: "18/24", description: "International standard" },
  { karat: "14K", percentage: 58.3, parts: "14/24", description: "Western jewellery" },
  { karat: "10K", percentage: 41.7, parts: "10/24", description: "Minimum legal standard (US)" },
  { karat: "9K", percentage: 37.5, parts: "9/24", description: "UK/Australia standard" },
];

type CalculationMode = "convert" | "analyze" | "make";

const ANALYTICS_PATH = "/purity-converter";

const FAQ_KEYS = [
  ["faq1Question", "faq1Answer"],
  ["faq2Question", "faq2Answer"],
  ["faq3Question", "faq3Answer"],
  ["faq4Question", "faq4Answer"],
  ["faq5Question", "faq5Answer"],
  ["faq6Question", "faq6Answer"],
] as const;

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const formatWeight = (value: number, decimals: number = 4) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });

function postToolEvent(eventName: string, metadata?: Record<string, unknown>) {
  void fetch("/api/tool-analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, path: ANALYTICS_PATH, metadata }),
  });
}

export default function PurityConverterPage() {
  const t = useTranslations("purityConverter");
  const tTools = useTranslations("tools");
  const tFooter = useTranslations("footer");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [cityRates, setCityRates] = useState<CityRate[]>(defaultCityRates);
  const [city, setCity] = useState<CityRate>(defaultCityRates[0]);
  const [fromPurity, setFromPurity] = useState("22K");
  const [toPurity, setToPurity] = useState("24K");
  const [weightValue, setWeightValue] = useState(10);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(weightUnits[0]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<CalculationMode>("convert");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const ratesEventSent = useRef(false);

  const unitName = useCallback(
    (id: string) => {
      const map: Record<string, string> = {
        grams: t("gramsUnit"),
        tola: t("tolaUnit"),
        mg: t("mgUnit"),
        oz: t("ozUnit"),
        kg: t("kgUnit"),
      };
      return map[id] ?? id;
    },
    [t],
  );

  const modes = useMemo(
    () =>
      [
        { id: "convert" as const, icon: "⚖️", name: t("modeConvert"), description: t("modeConvertDesc") },
        { id: "analyze" as const, icon: "🔍", name: t("modeAnalyze"), description: t("modeAnalyzeDesc") },
        { id: "make" as const, icon: "🛠️", name: t("modeMake"), description: t("modeMakeDesc") },
      ] as const,
    [t],
  );

  const faqItems = useMemo(
    () =>
      FAQ_KEYS.map(([qk, ak]) => ({
        question: t(qk),
        answer: t(ak),
      })),
    [t],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("mode");
    const initial: CalculationMode =
      raw === "convert" || raw === "analyze" || raw === "make" ? raw : "convert";
    setMode(initial);
    if (raw !== initial) {
      router.replace(`${pathname}?mode=${initial}`);
    }
  }, [pathname, router]);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("/api/calculator-rates");
        const data = await response.json();
        if (data.success && data.rates && data.rates.length > 0) {
          setCityRates(data.rates);
          setCity(data.rates[0]);
          if (!ratesEventSent.current) {
            ratesEventSent.current = true;
            postToolEvent("purity_converter_rates_loaded", {
              count: data.rates.length,
              source: data.source,
            });
          }
        }
      } catch {
        /* keep defaults */
      } finally {
        setLoading(false);
      }
    }
    void fetchRates();
  }, []);

  const selectMode = (next: CalculationMode) => {
    setMode(next);
    postToolEvent("purity_converter_mode_changed", { mode: next });
    router.replace(`${pathname}?mode=${next}`);
  };

  const grams = weightValue * weightUnit.toGrams;
  const fromPurityData = purityData.find((p) => p.karat === fromPurity);
  const toPurityData = purityData.find((p) => p.karat === toPurity);

  const fromPureGold = fromPurityData ? (grams * fromPurityData.percentage) / 100 : 0;
  const fromAlloyContent = grams - fromPureGold;
  const toEquivalentGrams = toPurityData ? (fromPureGold * 100) / toPurityData.percentage : 0;
  const toAlloyContent = toEquivalentGrams - fromPureGold;
  const makeTargetWeight = toPurityData ? (fromPureGold * 100) / toPurityData.percentage : 0;
  const alloyToAdd = makeTargetWeight - grams;

  const price24PerGram = city.gold24k / 10;
  const approxMetalValue = fromPureGold * price24PerGram;

  const getFormulaText = () => {
    switch (mode) {
      case "convert":
        return `Weight × (${fromPurity} purity ÷ ${toPurity} purity) = ${formatWeight(toEquivalentGrams, 2)}g`;
      case "analyze":
        return `${weightValue} ${weightUnit.symbol} × (${fromPurityData?.percentage || 0}% ÷ 100) = ${formatWeight(fromPureGold, 2)}g pure gold`;
      case "make":
        return `Pure gold (${formatWeight(fromPureGold, 2)}g) ÷ (${toPurityData?.percentage || 0}% ÷ 100) = ${formatWeight(makeTargetWeight, 2)}g total`;
      default:
        return "";
    }
  };

  const buildCopyText = () => {
    const lines: string[] = [t("title"), ""];
    lines.push(`${t("selectCity")}: ${city.name}`);
    lines.push(`${t("purity")}: ${fromPurity} · ${t("weight")}: ${weightValue} ${weightUnit.symbol}`);
    if (mode === "convert" && toPurityData) {
      lines.push(`${t("to")}: ${toPurity}`);
      lines.push(`${t("equivalentWeight")} ${formatWeight(toEquivalentGrams, 2)}g`);
      lines.push(`${t("approximateValue")} ₹${formatCurrency(approxMetalValue)}`);
    } else if (mode === "analyze") {
      lines.push(`${t("pureGold24k")}: ${formatWeight(fromPureGold, 2)}g`);
      lines.push(`${t("alloyMetals")}: ${formatWeight(fromAlloyContent, 2)}g`);
      lines.push(`${t("approximateValue")} ₹${formatCurrency(approxMetalValue)}`);
    } else if (mode === "make" && toPurityData && fromPurityData && toPurityData.percentage < fromPurityData.percentage) {
      lines.push(`${t("alloyToAdd")} ${formatWeight(alloyToAdd, 2)}g`);
      lines.push(`${t("totalResultGold", { purity: toPurity })} ${formatWeight(makeTargetWeight, 2)}g`);
    }
    lines.push("", `${t("formulaUsed")}: ${getFormulaText()}`);
    return lines.join("\n");
  };

  const handleCopy = async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      postToolEvent("purity_converter_copy_clicked", { mode, length: text.length });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const applyPresetGrams = (g: number) => {
    const gramsUnit = weightUnits[0];
    setWeightUnit(gramsUnit);
    setWeightValue(g);
  };

  const fromSectionLabel =
    mode === "analyze" ? t("yourGold") : mode === "make" ? t("sourceGold") : t("from");

  const stickySummary = (() => {
    if (mode === "convert" && toPurityData) {
      return `${toPurity} · ${formatWeight(toEquivalentGrams, 2)}g · ₹${formatCurrency(approxMetalValue)}`;
    }
    if (mode === "analyze") {
      return `${formatWeight(fromPureGold, 2)}g ${t("pureGold24k")} · ₹${formatCurrency(approxMetalValue)}`;
    }
    if (mode === "make" && toPurityData && fromPurityData && toPurityData.percentage < fromPurityData.percentage) {
      return `+${formatWeight(alloyToAdd, 2)}g → ${formatWeight(makeTargetWeight, 2)}g ${toPurity}`;
    }
    return t("subtitle");
  })();

  return (
    <main className="min-h-screen bg-amber-50 py-10 pb-28 md:pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-amber-600"
            >
              {t("backHome")}
            </Link>
            <p className="text-xs uppercase tracking-widest text-slate-500">{t("goldTools")}</p>
            <h1 className="mt-2 text-3xl font-bold text-charcoal">{t("title")}</h1>
            <p className="text-sm text-slate-600">{t("subtitle")}</p>
            <p className="mt-3 text-sm text-amber-800">
              {t("checkBenchmark")}{" "}
              <Link href="/gold-rate-today" className="font-semibold underline hover:text-amber-700">
                {t("goldRateTodayLink")}
              </Link>
              .
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              >
                {copied ? t("copied") : t("copyResult")}
              </button>
            </div>

            {loading ? <div className="mt-4 text-sm text-amber-600">{t("loadingRates")}</div> : null}

            <div className="mt-6 grid grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMode(m.id)}
                  className={`rounded-xl px-3 py-3 text-center transition-all ${
                    mode === m.id
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="block text-lg">{m.icon}</span>
                  <span className="mt-1 block text-xs font-medium">{m.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">{modes.find((m) => m.id === mode)?.description}</p>

            <div className="mt-6 grid gap-4">
              <label className="text-sm font-medium text-slate-600">
                {t("selectCity")}
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={city.name}
                  onChange={(event) => {
                    const selected = cityRates.find((item) => item.name === event.target.value);
                    if (selected) setCity(selected);
                  }}
                >
                  {cityRates.map((cityOption) => (
                    <option key={cityOption.name} value={cityOption.name}>
                      {cityOption.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">{fromSectionLabel}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-600">
                    {t("purity")}
                    <select
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                      value={fromPurity}
                      onChange={(event) => setFromPurity(event.target.value)}
                    >
                      {purityData.map((p) => (
                        <option key={p.karat} value={p.karat}>
                          {p.karat} ({p.percentage}%)
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium text-slate-600">
                      {t("weight")}
                      <input
                        type="number"
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={weightValue}
                        onChange={(event) => setWeightValue(Number(event.target.value) || 0)}
                        min={0.01}
                        step={0.01}
                      />
                    </label>
                    <label className="text-sm font-medium text-slate-600">
                      {t("unit")}
                      <select
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={weightUnit.id}
                        onChange={(event) => {
                          const selected = weightUnits.find((u) => u.id === event.target.value);
                          if (selected) setWeightUnit(selected);
                        }}
                      >
                        {weightUnits.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unitName(unit.id)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <p className="mt-3 text-xs font-medium text-slate-600">{t("quickWeights")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPresetGrams(8)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50"
                  >
                    {t("preset8g")}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetGrams(10)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50"
                  >
                    {t("preset10g")}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetGrams(100)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50"
                  >
                    {t("preset100g")}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetGrams(11.6638)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-50"
                  >
                    {t("preset1tola")}
                  </button>
                </div>

                {fromPurityData ? (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>{t("pureGoldContent")}</span>
                      <span className="font-semibold text-amber-700">{formatWeight(fromPureGold, 2)}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{t("alloyContent")}</span>
                      <span className="font-semibold text-slate-500">{formatWeight(fromAlloyContent, 2)}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{t("approximateValue")}</span>
                      <span className="font-semibold">₹{formatCurrency(approxMetalValue)}</span>
                    </div>
                    <p className="pt-1 text-xs leading-relaxed text-slate-500">
                      {t.rich("valueDisclaimer", {
                        city: city.name,
                        calc: (c) => (
                          <Link href="/calculator" className="font-semibold text-amber-700 underline hover:text-amber-800">
                            {c}
                          </Link>
                        ),
                        wastage: (c) => (
                          <Link
                            href="/wastage-calculator"
                            className="font-semibold text-amber-700 underline hover:text-amber-800"
                          >
                            {c}
                          </Link>
                        ),
                      })}
                    </p>
                    {mode === "convert" && toPurityData ? (
                      <div className="rounded-xl border border-amber-100 bg-white/80 px-3 py-2 text-xs text-slate-700">
                        <span className="font-semibold text-amber-900">{t("atAGlance")}: </span>
                        {t("equalsInTarget", {
                          weight: formatWeight(toEquivalentGrams, 2),
                          purity: toPurity,
                        })}
                      </div>
                    ) : null}
                    {weightUnit.id !== "grams" ? (
                      <div className="flex justify-between border-t border-slate-200 pt-1 text-xs text-slate-500">
                        <span>{t("weightInGrams")}</span>
                        <span>{formatWeight(grams, 2)}g</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {mode === "convert" ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="rounded-full border-2 border-amber-300 bg-white p-3 shadow-md transition-colors hover:bg-amber-50"
                    onClick={() => {
                      const temp = fromPurity;
                      setFromPurity(toPurity);
                      setToPurity(temp);
                    }}
                  >
                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </button>
                </div>
              ) : null}

              {mode === "convert" ? (
                <div className="rounded-3xl border-2 border-green-200 bg-green-50/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-800">{t("to")}</p>
                  <div className="mt-3">
                    <label className="text-sm font-medium text-slate-600">
                      {t("purity")}
                      <select
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={toPurity}
                        onChange={(event) => setToPurity(event.target.value)}
                      >
                        {purityData.map((p) => (
                          <option key={p.karat} value={p.karat}>
                            {p.karat} ({p.percentage}%)
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {toPurityData ? (
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>{t("equivalentWeight")}</span>
                        <span className="font-semibold text-green-700">{formatWeight(toEquivalentGrams, 2)}g</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>{t("alloyInResult")}</span>
                        <span className="font-semibold text-slate-500">{formatWeight(toAlloyContent, 2)}g</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>{t("approximateValue")}</span>
                        <span className="font-semibold text-green-700">₹{formatCurrency(approxMetalValue)}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {mode === "analyze" && fromPurityData ? (
                <div className="rounded-3xl border-2 border-purple-200 bg-purple-50/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">{t("analysisResult")}</p>
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                        <p className="text-xs uppercase text-slate-500">{t("pureGold24k")}</p>
                        <p className="text-2xl font-bold text-amber-600">{formatWeight(fromPureGold, 2)}g</p>
                        <p className="text-xs text-slate-500">{fromPurityData.percentage}% of total</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                        <p className="text-xs uppercase text-slate-500">{t("alloyMetals")}</p>
                        <p className="text-2xl font-bold text-slate-600">{formatWeight(fromAlloyContent, 2)}g</p>
                        <p className="text-xs text-slate-500">{(100 - fromPurityData.percentage).toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="mb-2 text-xs uppercase text-slate-500">{t("compositionBreakdown")}</p>
                      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                          style={{ width: `${fromPurityData.percentage}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs">
                        <span className="text-amber-600">Gold: {fromPurityData.percentage}%</span>
                        <span className="text-slate-500">Alloy: {(100 - fromPurityData.percentage).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between rounded-xl border border-purple-100 bg-white/80 px-3 py-2 text-sm">
                      <span className="text-slate-600">{t("approximateValue")}</span>
                      <span className="font-bold text-purple-800">₹{formatCurrency(approxMetalValue)}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {mode === "make" ? (
                <div className="rounded-3xl border-2 border-blue-200 bg-blue-50/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">{t("targetKarat")}</p>
                  <div className="mt-3">
                    <label className="text-sm font-medium text-slate-600">
                      {t("targetPurity")}
                      <select
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        value={toPurity}
                        onChange={(event) => setToPurity(event.target.value)}
                      >
                        {purityData
                          .filter((p) => p.percentage < (fromPurityData?.percentage || 100))
                          .map((p) => (
                            <option key={p.karat} value={p.karat}>
                              {p.karat} ({p.percentage}%)
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>

                  {toPurityData && fromPurityData && toPurityData.percentage < fromPurityData.percentage ? (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="mb-3 text-xs uppercase text-slate-500">{t("toMakeGold", { purity: toPurity })}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">{t("yourGoldGrams", { purity: fromPurity })}</span>
                            <span className="font-semibold">{formatWeight(grams, 2)}g</span>
                          </div>
                          <div className="flex items-center justify-between text-blue-700">
                            <span>{t("alloyToAdd")}</span>
                            <span className="text-lg font-bold">{formatWeight(alloyToAdd, 2)}g</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                            <span className="text-slate-600">{t("totalResultGold", { purity: toPurity })}</span>
                            <span className="text-lg font-bold text-green-700">{formatWeight(makeTargetWeight, 2)}g</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{t("makeNote")}</p>
                    </div>
                  ) : null}
                  {toPurityData && fromPurityData && toPurityData.percentage >= fromPurityData.percentage ? (
                    <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-sm text-yellow-800">{t("makeWarning", { purity: fromPurity })}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <details className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800">{t("howWeCalculate")}</summary>
              <p className="mt-2 text-xs text-slate-600">{t("howWeCalculateIntro")}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-600">
                <li>{t("howWeCalculateBullet1")}</li>
                <li>{t("howWeCalculateBullet2")}</li>
                <li>{t("howWeCalculateBullet3")}</li>
              </ul>
            </details>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm">📐</span>
                <h3 className="text-sm font-semibold text-slate-700">{t("formulaUsed")}</h3>
              </div>
              <code className="block rounded-lg bg-white p-3 font-mono text-xs text-slate-600">{getFormulaText()}</code>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <h2 className="text-sm font-semibold text-blue-900">{t("understandingTitle")}</h2>
              <p className="mt-2 text-xs text-blue-800">{t("understandingIntro")}</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-blue-800">
                <li>
                  {t.rich("bullet24k", {
                    investment: (c) => (
                      <Link href="/investment-calculator" className="text-amber-600 hover:underline">
                        {c}
                      </Link>
                    ),
                  })}
                </li>
                <li>{t("bullet22k")}</li>
                <li>{t("bullet18k")}</li>
                <li>{t("bullet14k")}</li>
                <li>{t("bullet9k")}</li>
              </ul>
              <p className="mt-3 text-xs text-blue-700">
                {t.rich("understandingFooter", {
                  calc: (c) => (
                    <Link href="/calculator" className="text-amber-600 hover:underline">
                      {c}
                    </Link>
                  ),
                  hallmark: (c) => (
                    <Link href="/hallmark-guide" className="text-amber-600 hover:underline">
                      {c}
                    </Link>
                  ),
                })}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">{t("tableTitle")}</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">{t("tableKarat")}</th>
                      <th className="px-4 py-3 text-left font-semibold">{t("tablePurity")}</th>
                      <th className="px-4 py-3 text-left font-semibold">{t("tableParts")}</th>
                      <th className="px-4 py-3 text-left font-semibold">{t("tableUsage")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purityData.map((p) => (
                      <tr key={p.karat} className="transition-colors hover:bg-amber-50/30">
                        <td className="px-4 py-3 font-medium text-amber-900">{p.karat}</td>
                        <td className="px-4 py-3">{p.percentage}%</td>
                        <td className="px-4 py-3 text-slate-600">{p.parts}</td>
                        <td className="px-4 py-3 text-slate-600">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50/50 p-4">
              <h2 className="text-sm font-semibold text-green-900">{t("relatedTools")}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/calculator" className="text-xs text-green-700 hover:underline">
                  {tTools("goldCalculator")}
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/wastage-calculator" className="text-xs text-green-700 hover:underline">
                  {tTools("wastageCalculator")}
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/hallmark-guide" className="text-xs text-green-700 hover:underline">
                  {tTools("hallmarkVerifier")}
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/investment-calculator" className="text-xs text-green-700 hover:underline">
                  {tTools("investmentCalculator")}
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/gold-rate-today" className="text-xs text-green-700 hover:underline">
                  {tFooter("goldRateToday")}
                </Link>
              </div>
            </div>

            <ToolFeedbackBar tool="purity-converter" locale={locale} />

            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">{t("faqTitle")}</h2>
              <div className="space-y-2">
                {faqItems.map((faq, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="text-sm font-medium text-slate-700">{faq.question}</span>
                      <svg
                        className={`h-5 w-5 text-slate-400 transition-transform ${faqOpen === index ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {faqOpen === index ? (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-slate-600">{faq.answer}</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <CalculatorSwitcher />
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-200/80 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-center text-xs font-semibold text-amber-950">{stickySummary}</p>
      </div>
    </main>
  );
}
