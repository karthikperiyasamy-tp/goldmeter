import type { Comment } from "@/types/community";

/** Prefix for demo comments merged into article discussions (read-only in UI). */
export function isSeedComment(c: Comment): boolean {
  return c.id.startsWith("seed-");
}

const T0 = "2026-04-02T08:12:00.000Z";
const T1 = "2026-04-02T09:40:00.000Z";
const T2 = "2026-04-02T11:05:00.000Z";
const T3 = "2026-04-03T06:20:00.000Z";
const T4 = "2026-04-03T14:30:00.000Z";
const T5 = "2026-04-04T10:00:00.000Z";

function seed(
  id: string,
  uid: string,
  displayName: string,
  text: string,
  createdAt: string,
  parentId: string | null = null,
  likes = 0
): Comment {
  return {
    id,
    target: "", // filled per map entry
    parentId,
    uid,
    displayName,
    photoURL: null,
    text,
    createdAt,
    updatedAt: createdAt,
    likes,
    likedBy: [],
    reported: false,
    reportedBy: [],
  };
}

function forTarget(target: string, items: Omit<Comment, "target">[]): Comment[] {
  return items.map((c) => ({ ...c, target }));
}

/** Demo threads keyed by CommentSection `target` (e.g. article:slug). */
export function getArticleSeedComments(target: string): Comment[] {
  const map: Record<string, Comment[]> = {
    "article:central-bank-gold-demand-sentiment-2026": forTarget(target, [
      seed(
        "seed-cb-1",
        "demo-user-aditi",
        "Aditi K.",
        "The point about official-sector demand being *sticky* matches what I have been reading—banks do not flip-flop quarter to quarter. Does anyone track how much of this is reported vs estimated in India-specific research?",
        T0,
        null,
        4
      ),
      seed(
        "seed-cb-2",
        "demo-user-rohan",
        "Rohan Desai",
        "Useful framing. I still worry that when everyone talks about central banks buying, retail gets FOMO and over-allocates. The article’s warning about not treating flows as a price guarantee is the line people skip.",
        T1
      ),
      seed(
        "seed-cb-3",
        "demo-user-meera",
        "Meera N.",
        "As a jeweller’s CA client, I see families ask whether ‘global banks buying’ means they should stretch the wedding budget. I send them articles like this—macro tailwind is not the same as invoice fairness on 22K.",
        T2,
        null,
        7
      ),
      seed(
        "seed-cb-4",
        "demo-user-vikram",
        "Vikram S.",
        "Exactly—hallmark and making charges still dominate your outcome. I replied here because the parent comment needed that nuance for non-investors.",
        T3,
        "seed-cb-3",
        2
      ),
      seed(
        "seed-cb-5",
        "demo-user-elena",
        "Elena M.",
        "From overseas: the reserve diversification story is everywhere in sell-side notes. Good that you cite it as sentiment + structure, not a permanent bid at any price.",
        T4,
        null,
        3
      ),
      seed(
        "seed-cb-6",
        "demo-user-karthik",
        "Karthik R.",
        "I would love a follow-up on how RBI reporting differs from World Gold Council methodology—small differences change how dramatic headlines sound.",
        T5
      ),
    ]),
    "article:gold-etf-safe-haven-sentiment-2026": forTarget(target, [
      seed(
        "seed-etf-1",
        "demo-user-pooja",
        "Pooja Verma",
        "ETF section resonated. My question: when articles mention record inflows, is that *net* of outflows the same month? Retail headlines rarely say.",
        T0,
        null,
        5
      ),
      seed(
        "seed-etf-2",
        "demo-user-amit",
        "Amit P.",
        "Good reminder that safe-haven demand can vanish quickly when equities rip higher. I sold some gold ETF last year and regretted the timing—this piece argues for rules, not vibes.",
        T1
      ),
      seed(
        "seed-etf-3",
        "demo-user-sarah",
        "Sarah L.",
        "Geopolitical risk premium is impossible to model. I treat gold as insurance with a fixed % of portfolio, rebalance yearly. Boring but slept better.",
        T2,
        null,
        6
      ),
      seed(
        "seed-etf-4",
        "demo-user-nikhil",
        "Nikhil B.",
        "+1 on rebalance rules. Chasing headlines after missile news is how people buy highs.",
        T3,
        "seed-etf-3",
        1
      ),
      seed(
        "seed-etf-5",
        "demo-user-deepa",
        "Deepa Iyer",
        "Does anyone compare gold ETF expense ratios in India side by side? Fees feel small until you hold a decade.",
        T4
      ),
      seed(
        "seed-etf-6",
        "demo-user-hassan",
        "Hassan K.",
        "Solid macro read. Wish more fin-influencers distinguished *investment* gold from bridal purchases—same metal, totally different decision tree.",
        T5,
        null,
        4
      ),
    ]),
    "article:gold-usd-real-yields-sentiment": forTarget(target, [
      seed(
        "seed-macro-1",
        "demo-user-manish",
        "Manish T.",
        "Real yields explanation was clearer than most YouTube takes. Still confused: if the Fed cuts and dollar falls, why doesn’t gold *always* rally?",
        T0,
        null,
        8
      ),
      seed(
        "seed-macro-2",
        "demo-user-ananya",
        "Ananya Ghosh",
        "Because other variables jump in—risk appetite, positioning, CB flows. The article’s ‘dashboard not single dial’ metaphor helped me.",
        T1,
        "seed-macro-1",
        3
      ),
      seed(
        "seed-macro-3",
        "demo-user-jason",
        "Jason W.",
        "As an NRI, DXY vs INR adds a second layer. I hedge mentally with a simple spreadsheet; would love GoldMeter to link more NRI-specific tools.",
        T2
      ),
      seed(
        "seed-macro-4",
        "demo-user-lakshmi",
        "Lakshmi P.",
        "The section on forward guidance vs actual cuts is underrated. Markets move on *change in expectations*, not just today’s rate.",
        T3,
        null,
        5
      ),
      seed(
        "seed-macro-5",
        "demo-user-omar",
        "Omar H.",
        "CPI prints still whipsaw gold intraday. For buyers in India, maybe ignore the hourly chart and focus on invoice discipline—agree?",
        T4,
        null,
        2
      ),
      seed(
        "seed-macro-6",
        "demo-user-sneha",
        "Sneha Kulkarni",
        "100%. My mother tracks USD gold; I track Mumbai 22K with GST. Same story, different volatility surface.",
        T5,
        "seed-macro-5",
        4
      ),
    ]),
    "article:india-gold-market-sentiment-2026": forTarget(target, [
      seed(
        "seed-in-1",
        "demo-user-ravi",
        "Ravi Krishnan",
        "Wedding season + global rally is a painful combo for budgets. Article captures why ‘duty unchanged’ still doesn’t mean stable retail bills.",
        T0,
        null,
        9
      ),
      seed(
        "seed-in-2",
        "demo-user-fathima",
        "Fathima S.",
        "Urban vs tier-2 demand difference is real—we see more lightweight pieces when rates spike; sentiment shifts to ‘grams over grandeur’.",
        T1
      ),
      seed(
        "seed-in-3",
        "demo-user-gautam",
        "Gautam L.",
        "SGB vs physical debate in the comments everywhere. This piece stays neutral but pushes documentation—thank you.",
        T2,
        null,
        3
      ),
      seed(
        "seed-in-4",
        "demo-user-neha",
        "Neha Chopra",
        "Could we get a short sidebar on gold loan sentiment when prices are elevated? Collateral value feels great until repayment stress hits.",
        T3,
        null,
        1
      ),
      seed(
        "seed-in-5",
        "demo-user-suresh",
        "Suresh Patil",
        "Collateral LTV rules matter more than spot. Banks do not mark your jewellery at full sentimental value anyway.",
        T4,
        "seed-in-4",
        2
      ),
      seed(
        "seed-in-6",
        "demo-user-divya",
        "Divya Menon",
        "Loved the cultural honesty—gold here is not only an ‘asset class’ slide in a deck. It’s family security theatre and that affects timing.",
        T5
      ),
    ]),
  };

  return map[target] ?? [];
}
