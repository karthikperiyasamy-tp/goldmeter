"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { getQuestion, incrementViewCount } from "@/lib/community/questions";
import type { Question } from "@/types/community";
import { QUESTION_CATEGORIES } from "@/types/community";
import AnswerSection from "@/app/components/community/AnswerSection";

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

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.questionId as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fbReady = isFirebaseConfigured();

  const loadQuestion = useCallback(async () => {
    if (!fbReady || !questionId) { setLoading(false); return; }
    try {
      const q = await getQuestion(questionId);
      if (!q) { setNotFound(true); return; }
      setQuestion(q);
      incrementViewCount(questionId).catch(() => {});
    } catch (err) {
      console.error("Failed to load question:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [fbReady, questionId]);

  useEffect(() => { loadQuestion(); }, [loadQuestion]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
        </div>
      </main>
    );
  }

  if (notFound || !question) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-lg font-semibold text-charcoal">Question not found</p>
          <Link href="/community" className="mt-4 inline-block text-sm text-amber-600 hover:text-amber-700 font-medium">
            ← Back to Community
          </Link>
        </div>
      </main>
    );
  }

  const catLabel = QUESTION_CATEGORIES.find((c) => c.value === question.category)?.label ?? question.category;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link href="/community" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            ← Back to Community
          </Link>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-charcoal leading-snug">{question.title}</h1>
          {question.body && (
            <p className="mt-3 text-sm text-slate-700 leading-7 whitespace-pre-wrap">{question.body}</p>
          )}
          <div className="mt-4 flex items-center gap-3 flex-wrap text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              {question.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={question.photoURL} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold inline-flex items-center justify-center">
                  {question.displayName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="font-medium text-charcoal">{question.displayName}</span>
            </span>
            <span>Asked {timeAgo(question.createdAt)}</span>
            <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-medium">{catLabel}</span>
            <span>{question.viewCount} {question.viewCount === 1 ? "view" : "views"}</span>
          </div>
        </div>

        {/* Answers */}
        <AnswerSection questionId={questionId} questionAuthorUid={question.uid} />
      </div>
    </main>
  );
}
