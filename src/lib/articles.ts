/** Shared articles metadata — used by /articles page, city sidebar, footer, etc. */

export interface ArticleMeta {
  slug: string;
  title: string;
  shortTitle: string;
  date: string;
  readTime: string;
  preview: string;
  category: "education" | "investment" | "buying-tips";
  /** When false, the article is hidden from listings, sitemap, and search engines. */
  published?: boolean;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "gold-origins",
    title: "Where Does Gold Come From, and How Is It Formed in Nature?",
    shortTitle: "Where Does Gold Come From?",
    date: "Updated Dec 8, 2025",
    readTime: "8 min read",
    preview:
      "Gold is one of the oldest and most fascinating metals known to humankind. Long before it became jewellery, currency, or an investment asset, gold had an extraordinary journey that began far beyond Earth.",
    category: "education",
    published: true,
  },
  {
    slug: "gold-special",
    title: "What Makes Gold So Special and Sought After Compared to Other Metals?",
    shortTitle: "What Makes Gold So Special?",
    date: "Updated Dec 22, 2025",
    readTime: "7 min read",
    preview:
      "Gold has been valued by civilizations across the world for thousands of years. Discover the unique physical properties, rarity, and universal trust that set gold apart from all other metals.",
    category: "education",
    published: true,
  },
  {
    slug: "gold-hedge",
    title: "Why Do Investors Turn to Gold During Economic Uncertainty or as a Hedge Against Inflation?",
    shortTitle: "Gold During Economic Uncertainty",
    date: "Updated Jan 5, 2026",
    readTime: "8 min read",
    preview:
      "Gold has long been considered a safe and reliable asset during periods of economic stress. Learn why investors turn to gold as a hedge against inflation and currency devaluation.",
    category: "investment",
    published: true,
  },
  {
    slug: "gold-premiums",
    title: "How Do Spot Prices and Premiums Work When Buying Gold?",
    shortTitle: "Spot Prices & Premiums",
    date: "Updated Jan 18, 2026",
    readTime: "7 min read",
    preview:
      "Understand the difference between spot prices and the actual price you pay for gold, including how premiums work and why they vary for different gold products.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "gold-facts",
    title: "Fun and Interesting Facts About Gold",
    shortTitle: "Fun Facts About Gold",
    date: "Updated Jan 30, 2026",
    readTime: "6 min read",
    preview:
      "Discover fascinating facts about gold, from its cosmic origins to its surprising uses in technology, making it one of the most extraordinary elements on Earth.",
    category: "education",
    published: true,
  },
  {
    slug: "gold-hallmarking",
    title: "What Is the Process of Gold Hallmarking in India?",
    shortTitle: "Gold Hallmarking in India",
    date: "Updated Feb 15, 2026",
    readTime: "7 min read",
    preview:
      "Learn about BIS hallmarking in India, how it protects consumers, and why it's essential for ensuring the authenticity and purity of gold jewellery.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "22k-vs-24k-gold-india",
    title: "22K vs 24K Gold: Which Should You Buy in India?",
    shortTitle: "22K vs 24K Gold",
    date: "Updated Dec 15, 2025",
    readTime: "12 min read",
    preview:
      "Confused between 22K and 24K gold? Understand purity, pricing, usage, resale, and investment suitability to choose the right option in India.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "how-to-check-gold-purity-at-home",
    title: "How to Check Gold Purity at Home (Before You Buy or Sell)",
    shortTitle: "Check Gold Purity at Home",
    date: "Updated Dec 30, 2025",
    readTime: "12 min read",
    preview:
      "Learn practical home-level ways to verify gold purity, what tests are safe, what to avoid, and when to rely on BIS hallmarking and lab testing.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "making-charges-in-gold-explained",
    title: "Making Charges in Gold Explained: How Much Is Fair?",
    shortTitle: "Making Charges Explained",
    date: "Updated Jan 12, 2026",
    readTime: "11 min read",
    preview:
      "Understand fixed vs percentage making charges, how they impact your bill, and practical ways to compare and negotiate while buying gold jewellery.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "gold-gst-in-india-explained",
    title: "Gold GST in India Explained: Tax Rules Buyers Should Know",
    shortTitle: "Gold GST India",
    date: "Updated Jan 25, 2026",
    readTime: "12 min read",
    preview:
      "A clear guide to GST on gold in India, how it appears on invoices, and how tax plus charges can change your final payable amount.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "how-jewellers-calculate-gold-price",
    title: "How Jewellers Calculate Gold Price in India (Invoice Breakdown)",
    shortTitle: "How Jewellers Calculate Price",
    date: "Updated Feb 5, 2026",
    readTime: "12 min read",
    preview:
      "Step-by-step explanation of how jewellers derive final payable gold price from purity, weight, rate, making charges, wastage, and tax.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "kdm-vs-hallmark-gold",
    title: "KDM vs Hallmark Gold: Key Differences Every Buyer Must Know",
    shortTitle: "KDM vs Hallmark Gold",
    date: "Updated Feb 16, 2026",
    readTime: "11 min read",
    preview:
      "Know the practical differences between KDM and BIS hallmarked gold, what each term means, and how to reduce quality and pricing risk.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "how-to-avoid-gold-jewellery-scams",
    title: "How to Avoid Gold Jewellery Scams in India",
    shortTitle: "Avoid Gold Scams",
    date: "Updated Dec 19, 2025",
    readTime: "12 min read",
    preview:
      "Learn the most common jewellery scam patterns and a practical buyer checklist to verify purity, billing transparency, and safe purchase practices.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "why-gold-price-changes-daily-india",
    title: "Why Gold Price Changes Daily in India",
    shortTitle: "Why Gold Price Changes Daily",
    date: "Updated Jan 2, 2026",
    readTime: "12 min read",
    preview:
      "Understand daily gold price movement in India through global spot rates, USD-INR, local demand, import costs, and market sentiment.",
    category: "education",
    published: true,
  },
  {
    slug: "how-gold-rate-is-calculated-india",
    title: "How Gold Rate Is Calculated in India (Simple Formula + Example)",
    shortTitle: "Gold Rate Calculation India",
    date: "Updated Jan 15, 2026",
    readTime: "12 min read",
    preview:
      "A simplified breakdown of how international prices become local Indian rates, including conversion, duties, taxes, and jeweller-level adjustments.",
    category: "education",
    published: true,
  },
  {
    slug: "why-gold-price-differs-by-city",
    title: "Why Gold Price Differs by City in India",
    shortTitle: "Why Gold Price Differs by City",
    date: "Updated Jan 28, 2026",
    readTime: "11 min read",
    preview:
      "Gold rates are close but not identical across cities. Learn why city-level variation happens and how to compare effectively before buying.",
    category: "education",
    published: true,
  },
  // ── Batch 2: Remaining HIGH-PRIORITY (Price/Search Intent) ──
  {
    slug: "gold-wastage-charges-explained",
    title: "Gold Wastage Charges Explained: What They Mean and How to Reduce Them",
    shortTitle: "Gold Wastage Charges",
    date: "Updated Feb 9, 2026",
    readTime: "11 min read",
    preview:
      "Wastage charges are a hidden cost that can significantly inflate your gold jewellery bill. Learn what wastage means, how it is calculated, and practical ways to minimise it.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "best-day-to-buy-gold-india",
    title: "Best Day to Buy Gold in India: Auspicious Dates, Market Trends & Strategy",
    shortTitle: "Best Day to Buy Gold",
    date: "Updated Feb 16, 2026",
    readTime: "12 min read",
    preview:
      "Is there really a best day to buy gold in India? We analyse cultural timing, weekly trends, and market patterns to help you plan smarter purchases.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "best-time-of-year-to-buy-gold",
    title: "Best Time of Year to Buy Gold in India: Seasonal Price Patterns",
    shortTitle: "Best Time to Buy Gold",
    date: "Updated Dec 12, 2025",
    readTime: "12 min read",
    preview:
      "Gold prices in India follow seasonal patterns driven by weddings, festivals, and global demand cycles. Learn which months historically offer better buying opportunities.",
    category: "buying-tips",
    published: true,
  },
  {
    slug: "gold-price-prediction-2026",
    title: "Gold Price Prediction 2026: Expert Forecasts and Key Factors",
    shortTitle: "Gold Price Prediction 2026",
    date: "Updated Dec 26, 2025",
    readTime: "12 min read",
    preview:
      "What do experts predict for gold prices in 2026? We break down the macro factors, geopolitical risks, and demand trends shaping gold's trajectory this year.",
    category: "investment",
    published: true,
  },
  {
    slug: "will-gold-reach-2-lakhs",
    title: "Will Gold Reach ₹2 Lakhs per 10 Grams in India?",
    shortTitle: "Will Gold Reach ₹2 Lakhs?",
    date: "Updated Jan 8, 2026",
    readTime: "11 min read",
    preview:
      "With gold prices climbing rapidly, many wonder if ₹2 lakh per 10 grams is inevitable. We examine the factors that could drive or delay this milestone.",
    category: "investment",
    published: true,
  },
  {
    slug: "what-affects-gold-price-india",
    title: "What Affects Gold Price in India? 10 Key Factors Explained",
    shortTitle: "What Affects Gold Price",
    date: "Updated Jan 21, 2026",
    readTime: "12 min read",
    preview:
      "Gold price in India is influenced by global markets, currency movements, government policy, and local demand. Understand all the key drivers in one comprehensive guide.",
    category: "education",
    published: true,
  },
  // ── Batch 2: INVESTMENT ARTICLES ──
  {
    slug: "is-gold-good-investment-2026",
    title: "Is Gold a Good Investment in 2026? Pros, Cons & Analysis",
    shortTitle: "Is Gold a Good Investment?",
    date: "Updated Feb 2, 2026",
    readTime: "12 min read",
    preview:
      "Should you invest in gold in 2026? We weigh the pros and cons with data-driven analysis covering returns, inflation hedge, and portfolio diversification benefits.",
    category: "investment",
    published: true,
  },
  {
    slug: "gold-vs-fd-which-is-better",
    title: "Gold vs Fixed Deposit (FD): Which Is Better for Indian Investors?",
    shortTitle: "Gold vs FD",
    date: "Updated Feb 12, 2026",
    readTime: "12 min read",
    preview:
      "Gold and FDs are India's most popular savings options. Compare returns, risk, liquidity, and tax treatment to decide which suits your financial goals better.",
    category: "investment",
    published: true,
  },
  {
    slug: "gold-vs-mutual-funds",
    title: "Gold vs Mutual Funds: Where Should You Invest in 2026?",
    shortTitle: "Gold vs Mutual Funds",
    date: "Updated Feb 21, 2026",
    readTime: "12 min read",
    preview:
      "Compare gold and mutual funds across returns, risk, liquidity, and tax efficiency to build a smarter investment portfolio for 2026 and beyond.",
    category: "investment",
    published: true,
  },
  {
    slug: "sovereign-gold-bond-vs-physical-gold",
    title: "Sovereign Gold Bond (SGB) vs Physical Gold: Which Is Better?",
    shortTitle: "SGB vs Physical Gold",
    date: "Updated Jan 3, 2026",
    readTime: "12 min read",
    preview:
      "SGBs offer interest income and no storage hassle, while physical gold provides tangible ownership. Compare both to choose the right gold format for your needs.",
    category: "investment",
    published: true,
  },
  {
    slug: "digital-gold-vs-physical-gold",
    title: "Digital Gold vs Physical Gold: Pros, Cons & Which to Choose",
    shortTitle: "Digital vs Physical Gold",
    date: "Updated Jan 10, 2026",
    readTime: "11 min read",
    preview:
      "Digital gold lets you buy from ₹1, but is it as safe as physical gold? Compare convenience, costs, regulation, and liquidity to make an informed choice.",
    category: "investment",
    published: true,
  },
  {
    slug: "how-much-gold-should-you-own",
    title: "How Much Gold Should You Own? Portfolio Allocation Guide for India",
    shortTitle: "How Much Gold to Own",
    date: "Updated Jan 17, 2026",
    readTime: "11 min read",
    preview:
      "Financial experts recommend 5-15% gold allocation, but the right amount depends on your goals, risk profile, and life stage. Here's how to decide.",
    category: "investment",
    published: true,
  },
  {
    slug: "long-term-gold-returns-india",
    title: "Long-Term Gold Returns in India: 10, 20 & 30-Year Performance",
    shortTitle: "Long-Term Gold Returns",
    date: "Updated Jan 23, 2026",
    readTime: "12 min read",
    preview:
      "How has gold performed over 10, 20, and 30 years in India? We analyse historical data to put gold returns in perspective against inflation and other assets.",
    category: "investment",
    published: true,
  },
  {
    slug: "when-to-sell-gold",
    title: "When to Sell Gold: Timing, Tax Rules & Smart Exit Strategies",
    shortTitle: "When to Sell Gold",
    date: "Updated Feb 7, 2026",
    readTime: "11 min read",
    preview:
      "Knowing when to sell gold is as important as knowing when to buy. Learn about market timing signals, capital gains tax, and practical exit strategies for Indian investors.",
    category: "investment",
    published: true,
  },
  {
    slug: "how-to-build-gold-portfolio",
    title: "How to Build a Gold Portfolio: Step-by-Step Guide for Indian Investors",
    shortTitle: "Build a Gold Portfolio",
    date: "Updated Feb 14, 2026",
    readTime: "12 min read",
    preview:
      "Building a gold portfolio requires balancing physical gold, SGBs, ETFs, and digital gold. Follow this step-by-step guide to create a diversified gold strategy.",
    category: "investment",
    published: true,
  },
];

/** Only articles marked published: true — use this for public-facing pages, sitemap, etc. */
export const PUBLISHED_ARTICLES = ARTICLES.filter((a) => a.published === true);

/** Parse "Updated MMM DD, YYYY" → ISO date string (e.g. "2025-12-08") */
export function getArticleDateISO(article: ArticleMeta): string {
  const match = article.date.match(/Updated\s+(.+)/);
  if (!match) return new Date().toISOString().split("T")[0];
  const d = new Date(match[1]);
  return isNaN(d.getTime())
    ? new Date().toISOString().split("T")[0]
    : d.toISOString().split("T")[0];
}

export const ARTICLE_CATEGORIES: { key: ArticleMeta["category"]; label: string; icon: string }[] = [
  { key: "education", label: "Gold Education", icon: "📚" },
  { key: "investment", label: "Gold Investment Guides", icon: "📈" },
  { key: "buying-tips", label: "Gold Buying Tips", icon: "💡" },
];
