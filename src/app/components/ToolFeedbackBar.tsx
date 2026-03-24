"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  tool: string;
  locale: string;
};

export default function ToolFeedbackBar({ tool, locale }: Props) {
  const t = useTranslations("toolFeedback");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit() {
    if (helpful === null || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/tool-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          helpful,
          comment: comment.trim(),
          locale,
          website: honeypot,
        }),
      });
      if (!res.ok && res.status === 429) {
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
        {t("thankYou")}
      </div>
    );
  }

  return (
    <div className="relative mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
      <p className="text-sm font-medium text-slate-800">{t("wasThisHelpful")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setHelpful(true)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            helpful === true
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-amber-50"
          }`}
        >
          {t("yes")}
        </button>
        <button
          type="button"
          onClick={() => setHelpful(false)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            helpful === false
              ? "bg-slate-600 text-white shadow-sm"
              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
          }`}
        >
          {t("no")}
        </button>
      </div>

      <label className="sr-only" htmlFor="tool-feedback-hp">
        Website
      </label>
      <input
        id="tool-feedback-hp"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <label className="mt-4 block text-xs font-medium text-slate-600" htmlFor="tool-feedback-comment">
        {t("optionalComment")}
      </label>
      <textarea
        id="tool-feedback-comment"
        rows={2}
        maxLength={500}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={helpful === null || status === "sending"}
          onClick={() => void submit()}
          className="rounded-xl bg-charcoal px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "…" : t("submit")}
        </button>
        {status === "error" ? <span className="text-xs text-red-600">{t("submitError")}</span> : null}
        <span className="text-xs text-slate-500">
          {t("problemLink")}{" "}
          <Link href="/contact" className="font-medium text-amber-700 underline hover:text-amber-800">
            {t("contact")}
          </Link>
          {" · "}
          <Link href="/community" className="font-medium text-amber-700 underline hover:text-amber-800">
            {t("community")}
          </Link>
        </span>
      </div>
    </div>
  );
}
