/** Shared articles metadata — used by /articles page, city sidebar, footer, etc. */

export interface ArticleMeta {
  slug: string;
  title: string;
  shortTitle: string;
  date: string;
  readTime: string;
  preview: string;
  category: "education" | "investment" | "buying-tips" | "tax-gst";
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "gold-origins",
    title: "Where Does Gold Come From, and How Is It Formed in Nature?",
    shortTitle: "Where Does Gold Come From?",
    date: "Updated Dec 14, 2025",
    readTime: "8 min read",
    preview:
      "Gold is one of the oldest and most fascinating metals known to humankind. Long before it became jewellery, currency, or an investment asset, gold had an extraordinary journey that began far beyond Earth.",
    category: "education",
  },
  {
    slug: "gold-special",
    title: "What Makes Gold So Special and Sought After Compared to Other Metals?",
    shortTitle: "What Makes Gold So Special?",
    date: "Updated Dec 14, 2025",
    readTime: "7 min read",
    preview:
      "Gold has been valued by civilizations across the world for thousands of years. Discover the unique physical properties, rarity, and universal trust that set gold apart from all other metals.",
    category: "education",
  },
  {
    slug: "gold-hedge",
    title: "Why Do Investors Turn to Gold During Economic Uncertainty or as a Hedge Against Inflation?",
    shortTitle: "Gold During Economic Uncertainty",
    date: "Updated Dec 14, 2025",
    readTime: "8 min read",
    preview:
      "Gold has long been considered a safe and reliable asset during periods of economic stress. Learn why investors turn to gold as a hedge against inflation and currency devaluation.",
    category: "investment",
  },
  {
    slug: "gold-premiums",
    title: "How Do Spot Prices and Premiums Work When Buying Gold?",
    shortTitle: "Spot Prices & Premiums",
    date: "Updated Dec 14, 2025",
    readTime: "7 min read",
    preview:
      "Understand the difference between spot prices and the actual price you pay for gold, including how premiums work and why they vary for different gold products.",
    category: "buying-tips",
  },
  {
    slug: "gold-facts",
    title: "Fun and Interesting Facts About Gold",
    shortTitle: "Fun Facts About Gold",
    date: "Updated Dec 14, 2025",
    readTime: "6 min read",
    preview:
      "Discover fascinating facts about gold, from its cosmic origins to its surprising uses in technology, making it one of the most extraordinary elements on Earth.",
    category: "education",
  },
  {
    slug: "gold-hallmarking",
    title: "What Is the Process of Gold Hallmarking in India?",
    shortTitle: "Gold Hallmarking in India",
    date: "Updated Dec 14, 2025",
    readTime: "7 min read",
    preview:
      "Learn about BIS hallmarking in India, how it protects consumers, and why it's essential for ensuring the authenticity and purity of gold jewellery.",
    category: "buying-tips",
  },
];

export const ARTICLE_CATEGORIES: { key: ArticleMeta["category"]; label: string; icon: string }[] = [
  { key: "education", label: "Gold Education", icon: "📚" },
  { key: "investment", label: "Gold Investment Guides", icon: "📈" },
  { key: "buying-tips", label: "Gold Buying Tips", icon: "💡" },
  { key: "tax-gst", label: "Tax & GST on Gold", icon: "🧾" },
];
