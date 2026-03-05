"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  onAuthChange,
} from "@/lib/firebase/client";
import {
  getActiveWeeklyPoll,
  voteWeeklyPoll,
  getWeeklyPollVote,
} from "@/lib/community/polls";
import type { WeeklyPoll } from "@/types/community";
import type { User } from "firebase/auth";
import CommentSection from "./CommentSection";

export default function WeeklyDiscussion() {
  const [user, setUser] = useState<User | null>(null);
  const [poll, setPoll] = useState<WeeklyPoll | null>(null);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fbReady = isFirebaseConfigured();

  useEffect(() => {
    if (!fbReady) return;
    const unsub = onAuthChange(setUser);
    return unsub;
  }, [fbReady]);

  const loadPoll = useCallback(async () => {
    if (!fbReady) { setLoading(false); return; }
    try {
      const p = await getActiveWeeklyPoll();
      setPoll(p);
      if (p && user) {
        const vote = await getWeeklyPollVote(p.id, user.uid);
        setMyVote(vote);
      }
    } catch (err) {
      console.error("Failed to load weekly poll:", err);
    } finally {
      setLoading(false);
    }
  }, [fbReady, user]);

  useEffect(() => { loadPoll(); }, [loadPoll]);

  const handleVote = async (index: number) => {
    if (!user || !poll || voting || myVote !== null) return;
    setVoting(true);
    try {
      const success = await voteWeeklyPoll(poll.id, user.uid, index);
      if (success) {
        setMyVote(index);
        await loadPoll();
      }
    } catch (err) {
      console.error("Failed to vote:", err);
    } finally {
      setVoting(false);
    }
  };

  if (!fbReady || loading) {
    return loading ? (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
      </div>
    ) : null;
  }

  if (!poll) return null;

  const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0);
  const hasVoted = myVote !== null;

  return (
    <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-amber-700 uppercase tracking-wide">Weekly Discussion</span>
        <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-semibold">AI Generated</span>
      </div>

      <h3 className="text-lg font-bold text-charcoal mt-2 leading-snug">{poll.question}</h3>

      {poll.context && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">Based on this week&apos;s gold news: {poll.context}</p>
      )}

      {/* Poll options */}
      <div className="mt-4 space-y-2">
        {poll.options.map((opt, i) => {
          const votes = poll.votes[i] ?? 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = myVote === i;

          if (hasVoted) {
            return (
              <div key={i} className="relative rounded-xl overflow-hidden">
                <div
                  className={`px-4 py-3 text-sm relative z-10 flex items-center justify-between ${
                    isSelected ? "font-bold text-amber-800" : "text-slate-600"
                  }`}
                >
                  <span>{opt}</span>
                  <span className="font-semibold tabular-nums text-xs">{pct}% <span className="text-slate-400 font-normal">({votes})</span></span>
                </div>
                <div
                  className={`absolute inset-0 ${isSelected ? "bg-amber-100" : "bg-slate-50"}`}
                  style={{ width: `${pct}%`, transition: "width 0.5s ease" }}
                />
              </div>
            );
          }

          return (
            <button
              key={i}
              onClick={() => user ? handleVote(i) : signInWithGoogle().catch(console.error)}
              disabled={voting}
              className="w-full rounded-xl border border-slate-100 px-4 py-3 text-sm text-slate-700 hover:border-amber-200 hover:bg-amber-50 transition-all text-left disabled:opacity-50"
            >
              {opt}
            </button>
          );
        })}
      </div>

      {totalVotes > 0 && (
        <p className="text-xs text-slate-400 mt-3">{totalVotes} {totalVotes === 1 ? "vote" : "votes"}</p>
      )}

      {!user && !hasVoted && (
        <div className="mt-3">
          <button onClick={() => signInWithGoogle().catch(console.error)}
            className="text-xs text-amber-600 font-medium hover:text-amber-700">
            Sign in to vote →
          </button>
        </div>
      )}

      {/* Discussion thread below poll */}
      <CommentSection target={`poll:${poll.id}`} />
    </section>
  );
}
