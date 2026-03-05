"use client";

import { useEffect, useState } from "react";
import { collection, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { onAuthChange } from "@/lib/firebase/client";
import type { User } from "firebase/auth";

const FAKE_USERS = [
  { uid: "seed-user-ravi", displayName: "Ravi Shankar", photoURL: null },
  { uid: "seed-user-priya", displayName: "Priya Menon", photoURL: null },
  { uid: "seed-user-amit", displayName: "Amit Verma", photoURL: null },
  { uid: "seed-user-deepa", displayName: "Deepa Krishnan", photoURL: null },
  { uid: "seed-user-suresh", displayName: "Suresh Iyer", photoURL: null },
];

const SEED_DATA = {
  questions: [
    {
      id: "seed-q1",
      title: "Is it better to buy 22K or 24K gold for investment in India?",
      body: "I'm planning to invest around ₹5 lakhs in gold this year. My jeweller recommends 22K gold coins, but I've read that 24K is purer and better for investment. What are the pros and cons of each? Also, does purity affect resale value significantly?",
      category: "investment" as const,
      user: FAKE_USERS[0],
      viewCount: 147,
      answers: [
        {
          id: "seed-a1-1",
          user: FAKE_USERS[1],
          text: "For pure investment, 24K gold is the better choice. It has 99.9% purity so you get more gold per gram. 22K has copper/silver mixed in which brings the per-gram gold value down. However, 24K is softer and not suitable for jewellery. If you're buying coins or bars specifically for investment, go 24K. The resale value is always tied to purity — 24K commands the spot price directly.",
          likes: 8,
          helpful: true,
          daysAgo: 4,
        },
        {
          id: "seed-a1-2",
          user: FAKE_USERS[2],
          text: "I'd add that if you ever want the flexibility to convert your investment into jewellery, 22K makes more sense. Also check making charges — 24K coins from banks usually have lower making charges (2-5%) compared to 22K jewellery (8-25%). For ₹5 lakhs, I'd suggest splitting: 60% in 24K coins/bars and 40% in 22K if you want wearable options later.",
          likes: 5,
          helpful: false,
          daysAgo: 3,
        },
        {
          id: "seed-a1-3",
          user: FAKE_USERS[3],
          text: "Have you considered Sovereign Gold Bonds (SGBs)? You get 2.5% annual interest plus the gold price appreciation, and there's no making charge or storage worry. The downside is the 8-year lock-in (though you can sell on exchange after 5 years). For pure investment without physical possession needs, SGBs beat both 22K and 24K physical gold.",
          likes: 12,
          helpful: false,
          daysAgo: 2,
        },
      ],
      daysAgo: 5,
    },
    {
      id: "seed-q2",
      title: "Why does gold rate differ between Chennai and Mumbai?",
      body: "I noticed that the gold rate in Chennai is usually ₹100-200 higher than Mumbai on the same day. Both cities are major gold markets. What causes this price difference? Is it taxes, demand, or something else?",
      category: "rates" as const,
      user: FAKE_USERS[3],
      viewCount: 89,
      answers: [
        {
          id: "seed-a2-1",
          user: FAKE_USERS[4],
          text: "The main reasons are: (1) Local jeweller association pricing — each city's jewellers association sets their own rate based on IBJA guidelines plus local factors. (2) Transportation and logistics costs to move gold to that region. (3) State taxes and local levies that vary. (4) Demand-supply dynamics — Chennai and South India historically have higher gold demand (cultural reasons, weddings), which pushes prices slightly up. The ₹100-200 difference is normal and consistent.",
          likes: 6,
          helpful: true,
          daysAgo: 2,
        },
        {
          id: "seed-a2-2",
          user: FAKE_USERS[0],
          text: "Adding to the above — Mumbai has the advantage of being closer to the IBJA (India Bullion and Jewellers Association) which is headquartered there. Many large bullion dealers are based in Mumbai's Zaveri Bazaar, creating more competition and slightly lower margins. Chennai's gold market, while huge, has fewer large-scale bullion dealers compared to Mumbai.",
          likes: 3,
          helpful: false,
          daysAgo: 1,
        },
      ],
      daysAgo: 3,
    },
    {
      id: "seed-q3",
      title: "How do I verify if my gold jewellery is genuinely hallmarked?",
      body: "I bought a gold chain last month and it has a hallmark stamp, but a friend told me that fake hallmarks are common. How can I verify if the hallmark is genuine? Is there an online way to check? What should I look for in the hallmark?",
      category: "buying" as const,
      user: FAKE_USERS[2],
      viewCount: 213,
      answers: [
        {
          id: "seed-a3-1",
          user: FAKE_USERS[1],
          text: "Since July 2021, BIS (Bureau of Indian Standards) mandated HUID (Hallmark Unique ID) — a 6-digit alphanumeric code on every hallmarked piece. You can verify it on the BIS Care app or website (bis.gov.in). Enter the HUID and it will show the jeweller's name, purity, and date of hallmarking. If the HUID doesn't show up or details don't match, the hallmark could be fake. Old jewellery (pre-2021) won't have HUID but should have the BIS logo, purity mark (like 916 for 22K), and assaying centre mark.",
          likes: 15,
          helpful: true,
          daysAgo: 6,
        },
        {
          id: "seed-a3-2",
          user: FAKE_USERS[4],
          text: "Pro tip: Always insist on the hallmarking certificate along with the bill. Reputable jewellers provide both. If you're still unsure, you can get the gold tested at any BIS-recognised assaying centre — there are about 1,000+ across India. The testing fee is typically ₹200-500 and they'll give you a purity report. Also, the hallmark should have 4 marks: BIS logo, purity/fineness grade, HUID number, and the assaying centre's identification mark.",
          likes: 9,
          helpful: false,
          daysAgo: 5,
        },
      ],
      daysAgo: 7,
    },
  ],
  comments: [
    {
      id: "seed-c1",
      target: "article:22k-vs-24k-gold",
      user: FAKE_USERS[0],
      text: "Great article! I was confused between 22K and 24K for months. The comparison table really helped me decide. Went with 24K coins for my portfolio.",
      likes: 4,
      daysAgo: 3,
    },
    {
      id: "seed-c2",
      target: "article:22k-vs-24k-gold",
      user: FAKE_USERS[3],
      text: "One thing I'd add — if you're buying 22K jewellery, always negotiate the making charges. Most jewellers have a margin of 5-10% on making charges that they can reduce if you ask.",
      likes: 7,
      daysAgo: 2,
    },
    {
      id: "seed-c3",
      target: "article:gold-gst-india-explained",
      user: FAKE_USERS[1],
      text: "Very helpful breakdown of GST on gold. I didn't know that GST applies on making charges separately. This saved me from overpaying at the jeweller.",
      likes: 3,
      daysAgo: 4,
    },
    {
      id: "seed-c4",
      target: "article:how-gold-rate-calculated-india",
      user: FAKE_USERS[4],
      text: "Finally understood how IBJA pricing works! The international spot price to Indian retail price conversion was always confusing to me. Bookmarked this page.",
      likes: 5,
      daysAgo: 1,
    },
    {
      id: "seed-c5",
      target: "article:gold-price-prediction-2026",
      user: FAKE_USERS[2],
      text: "Interesting predictions. With the current geopolitical tensions and RBI's gold buying spree, I think gold could easily cross ₹85,000 per 10g by end of 2026. What do others think?",
      likes: 6,
      daysAgo: 2,
      replies: [
        {
          id: "seed-c5-r1",
          user: FAKE_USERS[0],
          text: "I agree — the trend is clearly upward. But I think ₹85K might be conservative. If the dollar weakens further, we could see even higher levels.",
          likes: 2,
          daysAgo: 1,
        },
      ],
    },
  ],
};

function daysAgoToISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));
  return d.toISOString();
}

export default function SeedPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>("Checking auth...");
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    return onAuthChange((u) => {
      setUser(u);
      setStatus(u ? `Signed in as ${u.displayName}` : "Not signed in — please sign in first");
    });
  }, []);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  async function seed() {
    if (!user) return;
    setRunning(true);
    const db = getFirebaseFirestore();

    try {
      for (const q of SEED_DATA.questions) {
        const createdAt = daysAgoToISO(q.daysAgo);
        const questionDoc = {
          id: q.id,
          uid: q.user.uid,
          displayName: q.user.displayName,
          photoURL: q.user.photoURL,
          title: q.title,
          body: q.body,
          category: q.category,
          createdAt,
          updatedAt: createdAt,
          answerCount: q.answers.length,
          viewCount: q.viewCount,
          tags: [],
        };
        await setDoc(doc(collection(db, "questions"), q.id), questionDoc);
        addLog(`Question: "${q.title.slice(0, 50)}..."`);

        for (const a of q.answers) {
          const ansCreatedAt = daysAgoToISO(a.daysAgo);
          const answerDoc = {
            id: a.id,
            uid: a.user.uid,
            displayName: a.user.displayName,
            photoURL: a.user.photoURL,
            text: a.text,
            createdAt: ansCreatedAt,
            updatedAt: ansCreatedAt,
            likes: a.likes,
            likedBy: [],
            helpful: a.helpful,
          };
          await setDoc(
            doc(collection(db, "questions", q.id, "answers"), a.id),
            answerDoc
          );
          addLog(`  Answer by ${a.user.displayName}`);
        }
      }

      for (const c of SEED_DATA.comments) {
        const createdAt = daysAgoToISO(c.daysAgo);
        const commentDoc = {
          id: c.id,
          target: c.target,
          parentId: null,
          uid: c.user.uid,
          displayName: c.user.displayName,
          photoURL: c.user.photoURL,
          text: c.text,
          createdAt,
          updatedAt: createdAt,
          likes: c.likes,
          likedBy: [],
          reported: false,
          reportedBy: [],
        };
        await setDoc(doc(collection(db, "comments"), c.id), commentDoc);
        addLog(`Comment on ${c.target}: "${c.text.slice(0, 40)}..."`);

        if ("replies" in c && c.replies) {
          for (const r of c.replies) {
            const replyCreatedAt = daysAgoToISO(r.daysAgo);
            const replyDoc = {
              id: r.id,
              target: c.target,
              parentId: c.id,
              uid: r.user.uid,
              displayName: r.user.displayName,
              photoURL: r.user.photoURL,
              text: r.text,
              createdAt: replyCreatedAt,
              updatedAt: replyCreatedAt,
              likes: r.likes,
              likedBy: [],
              reported: false,
              reportedBy: [],
            };
            await setDoc(doc(collection(db, "comments"), r.id), replyDoc);
            addLog(`  Reply by ${r.user.displayName}`);
          }
        }
      }

      addLog("--- All seed data written successfully! ---");
      setDone(true);
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Community Seed Data</h1>
      <p className="text-sm text-gray-500 mb-2">
        This page seeds realistic questions, answers, and comments into Firestore.
        <br />
        <strong>Delete this page after use.</strong>
      </p>

      <div className="mb-4 p-3 rounded bg-gray-100 dark:bg-gray-800 text-sm">
        Status: {status}
      </div>

      {user && !done && (
        <button
          onClick={seed}
          disabled={running}
          className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 disabled:opacity-50"
        >
          {running ? "Seeding..." : "Seed Community Data"}
        </button>
      )}

      {done && (
        <div className="p-3 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold">
          Done! Visit <a href="/community" className="underline">/community</a> to see the data.
          You can now delete this page.
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 p-4 bg-black text-green-400 rounded font-mono text-xs max-h-96 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}
