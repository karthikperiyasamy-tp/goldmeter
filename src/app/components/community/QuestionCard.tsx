"use client";

import Link from "next/link";
import type { Question } from "@/types/community";
import { QUESTION_CATEGORIES } from "@/types/community";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function QuestionCard({ question }: { question: Question }) {
  const catLabel = QUESTION_CATEGORIES.find((c) => c.value === question.category)?.label ?? question.category;

  return (
    <Link
      href={`/community/${question.id}`}
      className="block rounded-2xl border border-slate-100 bg-white p-5 hover:border-amber-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-charcoal group-hover:text-amber-700 transition-colors line-clamp-2">
            {question.title}
          </h3>
          {question.body && (
            <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{question.body}</p>
          )}
          <div className="mt-3 flex items-center gap-3 flex-wrap text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              {question.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={question.photoURL} alt="" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[8px] font-bold inline-flex items-center justify-center">
                  {question.displayName.charAt(0).toUpperCase()}
                </span>
              )}
              {question.displayName}
            </span>
            <span>{timeAgo(question.createdAt)}</span>
            <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-medium">{catLabel}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-700 font-bold text-lg">
            {question.answerCount}
          </div>
          <span className="text-[10px] text-slate-400">{question.answerCount === 1 ? "answer" : "answers"}</span>
        </div>
      </div>
    </Link>
  );
}
