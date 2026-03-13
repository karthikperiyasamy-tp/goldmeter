"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { getQuestions } from "@/lib/community/questions";
import type { Question, QuestionCategory } from "@/types/community";
import { QUESTION_CATEGORIES } from "@/types/community";
import QuestionCard from "@/app/components/community/QuestionCard";
import WeeklyDiscussion from "@/app/components/community/WeeklyDiscussion";

export default function CommunityClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<QuestionCategory | "all">("all");

  const fbReady = isFirebaseConfigured();

  const loadQuestions = useCallback(async () => {
    if (!fbReady) { setLoading(false); return; }
    try {
      const cat = category === "all" ? undefined : category;
      setQuestions(await getQuestions(cat));
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  }, [fbReady, category]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  return (
    <>
      {/* Weekly Discussion */}
      <WeeklyDiscussion />

      {/* Q&A Section */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h2 className="text-xl font-bold text-charcoal">Gold Q&A</h2>
          <Link
            href="/community/ask"
            className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm"
          >
            Ask a Question
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              category === "all"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {QUESTION_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === cat.value
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Questions list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-charcoal">No questions yet</p>
            <p className="text-sm text-slate-500 mt-1">Be the first to start a discussion about gold!</p>
            <Link
              href="/community/ask"
              className="mt-4 inline-block rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Ask the first question
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
