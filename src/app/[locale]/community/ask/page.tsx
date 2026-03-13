"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  onAuthChange,
} from "@/lib/firebase/client";
import { askQuestion } from "@/lib/community/questions";
import type { QuestionCategory } from "@/types/community";
import { QUESTION_CATEGORIES } from "@/types/community";
import type { User } from "firebase/auth";

export default function AskQuestionPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<QuestionCategory>("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fbReady = isFirebaseConfigured();

  useEffect(() => {
    if (!fbReady) { setAuthLoading(false); return; }
    const unsub = onAuthChange((u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, [fbReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const q = await askQuestion(
        user.uid,
        user.displayName || "User",
        user.photoURL,
        title.trim(),
        body.trim(),
        category
      );
      router.push(`/community/${q.id}`);
    } catch (err) {
      console.error("Failed to ask question:", err);
      setError("Failed to post question. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <Link href="/community" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            ← Back to Community
          </Link>
        </div>

        <h1 className="text-2xl font-extrabold text-charcoal tracking-tight mb-6">
          Ask a Question
        </h1>

        {authLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-8 text-center">
            <p className="text-base font-semibold text-charcoal mb-2">Sign in to ask a question</p>
            <p className="text-sm text-slate-600 mb-4">You need a Google account to participate in the community.</p>
            <button onClick={() => signInWithGoogle().catch(console.error)}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="q-title" className="block text-sm font-semibold text-charcoal mb-1.5">
                Question Title <span className="text-red-500">*</span>
              </label>
              <input
                id="q-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Is 22K gold better for daily wear jewellery?"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-charcoal placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label htmlFor="q-body" className="block text-sm font-semibold text-charcoal mb-1.5">
                Details <span className="text-xs text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="q-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add more context to help others understand your question..."
                rows={5}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-charcoal placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
              />
            </div>

            <div>
              <label htmlFor="q-category" className="block text-sm font-semibold text-charcoal mb-1.5">
                Category
              </label>
              <select
                id="q-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestionCategory)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-charcoal focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 bg-white"
              >
                {QUESTION_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting || !title.trim()}
                className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-40">
                {submitting ? "Posting..." : "Post Question"}
              </button>
              <Link href="/community"
                className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
