"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  onAuthChange,
} from "@/lib/firebase/client";
import {
  getAnswers,
  addAnswer,
  toggleAnswerLike,
  markHelpful,
} from "@/lib/community/questions";
import type { Answer } from "@/types/community";
import type { User } from "firebase/auth";

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

interface Props {
  questionId: string;
  questionAuthorUid: string;
}

export default function AnswerSection({ questionId, questionAuthorUid }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fbReady = isFirebaseConfigured();

  useEffect(() => {
    if (!fbReady) { setAuthLoading(false); return; }
    const unsub = onAuthChange((u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, [fbReady]);

  const loadAnswers = useCallback(async () => {
    if (!fbReady) { setLoading(false); return; }
    try {
      setAnswers(await getAnswers(questionId));
    } catch (err) {
      console.error("Failed to load answers:", err);
    } finally {
      setLoading(false);
    }
  }, [questionId, fbReady]);

  useEffect(() => { loadAnswers(); }, [loadAnswers]);

  const handleSubmit = async () => {
    if (!user || !text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addAnswer(questionId, user.uid, user.displayName || "User", user.photoURL, text.trim());
      setText("");
      await loadAnswers();
    } catch (err) {
      console.error("Failed to add answer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (answer: Answer) => {
    if (!user) return;
    const isLiked = answer.likedBy.includes(user.uid);
    try {
      await toggleAnswerLike(questionId, answer.id, user.uid, isLiked);
      await loadAnswers();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleMarkHelpful = async (answer: Answer) => {
    try {
      await markHelpful(questionId, answer.id, !answer.helpful);
      await loadAnswers();
    } catch (err) {
      console.error("Failed to mark helpful:", err);
    }
  };

  const isQuestionAuthor = user?.uid === questionAuthorUid;

  if (!fbReady) return null;

  return (
    <section className="mt-8">
      <h3 className="text-base font-bold text-charcoal mb-4">
        {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
        </div>
      ) : answers.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No answers yet. Be the first to help!</p>
      ) : (
        <div className="space-y-4">
          {answers.map((a) => {
            const liked = user ? a.likedBy.includes(user.uid) : false;
            return (
              <div key={a.id} className={`rounded-xl border p-4 ${a.helpful ? "border-green-200 bg-green-50/40" : "border-slate-100 bg-white"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button onClick={() => handleLike(a)} disabled={!user}
                      className={`text-lg transition-colors ${liked ? "text-amber-600" : "text-slate-300 hover:text-amber-600"} disabled:opacity-40`}>
                      ▲
                    </button>
                    <span className="text-xs font-bold text-charcoal">{a.likes}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-7">{a.text}</p>
                    <div className="mt-3 flex items-center gap-3 flex-wrap text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        {a.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.photoURL} alt="" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[8px] font-bold inline-flex items-center justify-center">
                            {a.displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                        {a.displayName}
                      </span>
                      <span>{timeAgo(a.createdAt)}</span>
                      {a.helpful && (
                        <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                          ✓ Marked as helpful
                        </span>
                      )}
                      {isQuestionAuthor && (
                        <button onClick={() => handleMarkHelpful(a)}
                          className={`font-medium transition-colors ${a.helpful ? "text-green-600 hover:text-slate-400" : "text-slate-400 hover:text-green-600"}`}>
                          {a.helpful ? "Unmark helpful" : "Mark as helpful"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer form */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h4 className="text-sm font-bold text-charcoal mb-3">Your Answer</h4>
        {authLoading ? null : user ? (
          <div>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-charcoal placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
              rows={5}
              placeholder="Write your answer..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button onClick={handleSubmit} disabled={submitting || !text.trim()}
                className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-40">
                {submitting ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-4 text-center">
            <p className="text-sm text-slate-600 mb-2">Sign in to answer this question</p>
            <button onClick={() => signInWithGoogle().catch(console.error)}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
