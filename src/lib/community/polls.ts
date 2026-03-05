import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  increment,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import type { WeeklyPoll, SentimentPoll } from "@/types/community";
import { SENTIMENT_OPTIONS } from "@/types/community";

function weeklyPollsCol() {
  return collection(getFirebaseFirestore(), "weeklyPolls");
}

function sentimentPollsCol() {
  return collection(getFirebaseFirestore(), "sentimentPolls");
}

/** Get the most recent weekly poll */
export async function getActiveWeeklyPoll(): Promise<WeeklyPoll | null> {
  const q = query(weeklyPollsCol(), orderBy("createdAt", "desc"), firestoreLimit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as WeeklyPoll);
}

/** Vote on a weekly poll. Returns false if already voted. */
export async function voteWeeklyPoll(
  pollId: string,
  uid: string,
  optionIndex: number
): Promise<boolean> {
  const db = getFirebaseFirestore();
  const voterRef = doc(db, "weeklyPolls", pollId, "voters", uid);
  const existing = await getDoc(voterRef);
  if (existing.exists()) return false;

  await setDoc(voterRef, { optionIndex, votedAt: new Date().toISOString() });
  await updateDoc(doc(weeklyPollsCol(), pollId), {
    [`votes.${optionIndex}`]: increment(1),
  });
  return true;
}

/** Check if a user already voted on a weekly poll */
export async function getWeeklyPollVote(
  pollId: string,
  uid: string
): Promise<number | null> {
  const db = getFirebaseFirestore();
  const voterRef = doc(db, "weeklyPolls", pollId, "voters", uid);
  const snap = await getDoc(voterRef);
  return snap.exists() ? (snap.data().optionIndex as number) : null;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Get or create today's sentiment poll */
export async function getTodaySentiment(): Promise<SentimentPoll> {
  const key = todayKey();
  const ref = doc(sentimentPollsCol(), key);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as SentimentPoll;

  const poll: SentimentPoll = {
    date: key,
    options: SENTIMENT_OPTIONS,
    votes: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    totalVotes: 0,
  };
  await setDoc(ref, poll);
  return poll;
}

/** Vote on today's sentiment. Returns false if already voted. */
export async function voteSentiment(
  uid: string,
  optionIndex: number
): Promise<boolean> {
  const key = todayKey();
  const db = getFirebaseFirestore();
  const voterRef = doc(db, "sentimentPolls", key, "voters", uid);
  const existing = await getDoc(voterRef);
  if (existing.exists()) return false;

  await setDoc(voterRef, { optionIndex, votedAt: new Date().toISOString() });
  const pollRef = doc(sentimentPollsCol(), key);

  // Ensure the poll doc exists
  const pollSnap = await getDoc(pollRef);
  if (!pollSnap.exists()) {
    await setDoc(pollRef, {
      date: key,
      options: SENTIMENT_OPTIONS,
      votes: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
      totalVotes: 0,
    });
  }

  await updateDoc(pollRef, {
    [`votes.${optionIndex}`]: increment(1),
    totalVotes: increment(1),
  });
  return true;
}

/** Check if user already voted on today's sentiment */
export async function getSentimentVote(uid: string): Promise<number | null> {
  const key = todayKey();
  const db = getFirebaseFirestore();
  const voterRef = doc(db, "sentimentPolls", key, "voters", uid);
  const snap = await getDoc(voterRef);
  return snap.exists() ? (snap.data().optionIndex as number) : null;
}

/** Create a new weekly poll (called from cron) */
export async function createWeeklyPoll(
  question: string,
  options: string[],
  context: string
): Promise<WeeklyPoll> {
  const id = crypto.randomUUID();
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  const weekStart = monday.toISOString().slice(0, 10);

  const votes: Record<number, number> = {};
  options.forEach((_, i) => { votes[i] = 0; });

  const poll: WeeklyPoll = {
    id,
    question,
    context,
    options,
    votes,
    createdAt: now.toISOString(),
    weekStart,
  };
  await setDoc(doc(weeklyPollsCol(), id), poll);
  return poll;
}
