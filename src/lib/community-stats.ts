/**
 * Server-side community stats via Firestore REST API.
 * Uses public reads (no firebase-admin required).
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "goldmeter-5a8f0";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function countCollection(collectionId: string): Promise<number> {
  try {
    const url = `${BASE}:runAggregationQuery`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredAggregationQuery: {
          structuredQuery: { from: [{ collectionId }] },
          aggregations: [{ alias: "cnt", count: {} }],
        },
      }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const val = data?.[0]?.result?.aggregateFields?.cnt?.integerValue;
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

async function getTodaySentimentVotes(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = await fetch(`${BASE}/sentimentPolls/${today}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const tv = data?.fields?.totalVotes?.integerValue;
    return tv ? parseInt(tv, 10) : 0;
  } catch {
    return 0;
  }
}

export interface CommunityStats {
  totalComments: number;
  totalQuestions: number;
  todaySentimentVotes: number;
}

export async function getCommunityStats(): Promise<CommunityStats> {
  const [totalComments, totalQuestions, todaySentimentVotes] = await Promise.all([
    countCollection("comments"),
    countCollection("questions"),
    getTodaySentimentVotes(),
  ]);
  return { totalComments, totalQuestions, todaySentimentVotes };
}
