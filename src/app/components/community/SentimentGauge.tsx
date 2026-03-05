"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  onAuthChange,
} from "@/lib/firebase/client";
import {
  getTodaySentiment,
  voteSentiment,
  getSentimentVote,
} from "@/lib/community/polls";
import type { SentimentPoll } from "@/types/community";
import { SENTIMENT_OPTIONS } from "@/types/community";
import type { User } from "firebase/auth";

const OPTION_ICONS = ["🛒", "💰", "🤝", "⏳", "👀"];

export default function SentimentGauge() {
  const [user, setUser] = useState<User | null>(null);
  const [poll, setPoll] = useState<SentimentPoll | null>(null);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fbReady = isFirebaseConfigured();

  useEffect(() => {
    if (!fbReady) return;
    const unsub = onAuthChange(setUser);
    return unsub;
  }, [fbReady]);

  useEffect(() => {
    const saved = localStorage.getItem("sentimentGaugeCollapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const loadPoll = useCallback(async () => {
    if (!fbReady) { setLoading(false); return; }
    try {
      const data = await getTodaySentiment();
      setPoll(data);
      if (user) {
        const vote = await getSentimentVote(user.uid);
        setMyVote(vote);
      }
    } catch (err) {
      console.error("Failed to load sentiment poll:", err);
    } finally {
      setLoading(false);
    }
  }, [fbReady, user]);

  useEffect(() => { loadPoll(); }, [loadPoll]);

  const handleVote = async (index: number) => {
    if (!user || voting || myVote !== null) return;
    setVoting(true);
    try {
      const success = await voteSentiment(user.uid, index);
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

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sentimentGaugeCollapsed", String(next));
  };

  if (!fbReady || loading) return null;

  const hasVoted = myVote !== null;
  const totalVotes = poll?.totalVotes ?? 0;

  return (
    <div className="fixed bottom-20 right-4 z-40 print:hidden" style={{ maxWidth: "280px" }}>
      {/* Toggle button */}
      <button
        onClick={toggleCollapse}
        className="absolute -top-3 -right-1 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm text-xs text-slate-400 hover:text-charcoal transition-colors flex items-center justify-center"
        aria-label={collapsed ? "Expand sentiment gauge" : "Collapse sentiment gauge"}
      >
        {collapsed ? "▲" : "▼"}
      </button>

      {collapsed ? (
        <button
          onClick={toggleCollapse}
          className="rounded-2xl bg-white border border-slate-200 shadow-lg px-4 py-3 text-xs font-medium text-charcoal hover:border-amber-200 transition-all cursor-pointer"
        >
          📊 Gold Sentiment
        </button>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5">
            <p className="text-xs font-bold text-white">What&apos;s your gold move today?</p>
            {totalVotes > 0 && (
              <p className="text-[10px] text-amber-100 mt-0.5">{totalVotes} {totalVotes === 1 ? "vote" : "votes"} today</p>
            )}
          </div>

          <div className="p-3 space-y-1.5">
            {SENTIMENT_OPTIONS.map((opt, i) => {
              const votes = poll?.votes?.[i] ?? 0;
              const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const isSelected = myVote === i;

              if (hasVoted) {
                return (
                  <div key={i} className="relative">
                    <div
                      className={`rounded-lg px-3 py-2 text-[11px] relative z-10 flex items-center justify-between ${
                        isSelected ? "font-bold text-amber-800" : "text-slate-600"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {OPTION_ICONS[i]} {opt}
                      </span>
                      <span className="font-semibold tabular-nums">{pct}%</span>
                    </div>
                    <div
                      className={`absolute inset-0 rounded-lg ${isSelected ? "bg-amber-100" : "bg-slate-50"}`}
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
                  className="w-full rounded-lg border border-slate-100 px-3 py-2 text-[11px] text-slate-700 hover:border-amber-200 hover:bg-amber-50 transition-all text-left disabled:opacity-50 flex items-center gap-1.5"
                >
                  {OPTION_ICONS[i]} {opt}
                </button>
              );
            })}
          </div>

          {!user && !hasVoted && (
            <div className="border-t border-slate-100 px-3 py-2">
              <button
                onClick={() => signInWithGoogle().catch(console.error)}
                className="text-[10px] text-amber-600 font-medium hover:text-amber-700"
              >
                Sign in to vote →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
