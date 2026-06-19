import { getDatabase } from './mongodb';
import { unstable_cache } from 'next/cache';
import type { NewsArticle, GroupedNews } from './newsTypes';

const COLLECTION_NAME = 'news';

// Save articles to database (with deduplication)
export async function saveArticles(articles: NewsArticle[]): Promise<{ inserted: number; skipped: number }> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(COLLECTION_NAME);

  let inserted = 0;
  let skipped = 0;

  for (const article of articles) {
    try {
      // Check if article already exists (by sourceUrl)
      const existing = await collection.findOne({ sourceUrl: article.sourceUrl });
      
      if (existing) {
        skipped++;
        continue;
      }

      await collection.insertOne(article);
      inserted++;
    } catch (error) {
      console.error('Error saving article:', error);
      skipped++;
    }
  }

  console.log(`📊 Saved ${inserted} new articles, skipped ${skipped} duplicates`);
  return { inserted, skipped };
}

// Get date label for grouping
function getDateLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const articleDate = new Date(date);
  const articleDay = new Date(articleDate.getFullYear(), articleDate.getMonth(), articleDate.getDate());

  if (articleDay.getTime() === today.getTime()) {
    return 'Today';
  } else if (articleDay.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    // Format as "25 Nov 2024"
    return articleDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

// Get ISO date string for sorting
function getDateKey(date: Date): string {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
}

// Fetch news from database with grouping (internal uncached version)
async function getGroupedNewsUncached(
  limit: number = 10,
  offset: number = 0
): Promise<{ groups: GroupedNews[]; totalCount: number; hasMore: boolean }> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(COLLECTION_NAME);

  // Run count and find queries in parallel for better performance
  const [totalCount, articles] = await Promise.all([
    collection.countDocuments(),
    collection
      .find({})
      .sort({ publishedAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
  ]);

  // Group by date
  const groupMap = new Map<string, GroupedNews>();

  for (const article of articles) {
    const dateKey = getDateKey(article.publishedAt);
    const label = getDateLabel(article.publishedAt);

    if (!groupMap.has(dateKey)) {
      groupMap.set(dateKey, {
        label,
        date: dateKey,
        articles: [],
      });
    }

    // Convert MongoDB document to plain object (with serializable dates for caching)
    const plainArticle: NewsArticle = {
      ...article,
      _id: article._id?.toString(),
      publishedAt: new Date(article.publishedAt),
      fetchedAt: new Date(article.fetchedAt),
    };

    groupMap.get(dateKey)!.articles.push(plainArticle);
  }

  // Convert map to array and sort by date (newest first)
  const groups = Array.from(groupMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const hasMore = offset + limit < totalCount;

  return { groups, totalCount, hasMore };
}

/**
 * Get grouped news with caching
 * Cache duration: 5 minutes (300 seconds)
 */
export async function getGroupedNews(
  limit: number = 10,
  offset: number = 0
): Promise<{ groups: GroupedNews[]; totalCount: number; hasMore: boolean }> {
  const cachedFn = unstable_cache(
    () => getGroupedNewsUncached(limit, offset),
    [`grouped-news-${limit}-${offset}`],
    {
      revalidate: 21600, // 6h safety net; busted on demand via 'news' tag when the cron fetches news.
      tags: ['news'],
    }
  );
  
  const result = await cachedFn();
  
  // Convert date strings back to Date objects after cache retrieval
  return {
    ...result,
    groups: result.groups.map(group => ({
      ...group,
      articles: group.articles.map(article => ({
        ...article,
        publishedAt: new Date(article.publishedAt),
        fetchedAt: new Date(article.fetchedAt),
      })),
    })),
  };
}

// Get recent news for homepage (flat list, limited) - internal uncached version
async function getRecentNewsUncached(limit: number = 5): Promise<NewsArticle[]> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(COLLECTION_NAME);

  const articles = await collection
    .find({})
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();

  return articles.map(article => ({
    ...article,
    _id: article._id?.toString(),
    publishedAt: new Date(article.publishedAt),
    fetchedAt: new Date(article.fetchedAt),
  }));
}

/**
 * Get recent news with caching
 * Cache duration: 5 minutes (300 seconds)
 */
export async function getRecentNews(limit: number = 5): Promise<NewsArticle[]> {
  const cachedFn = unstable_cache(
    () => getRecentNewsUncached(limit),
    [`recent-news-${limit}`],
    {
      revalidate: 21600, // 6h safety net; busted on demand via 'news' tag when the cron fetches news.
      tags: ['news'],
    }
  );
  
  const articles = await cachedFn();
  
  // Convert date strings back to Date objects after cache retrieval
  return articles.map(article => ({
    ...article,
    publishedAt: new Date(article.publishedAt),
    fetchedAt: new Date(article.fetchedAt),
  }));
}

// Get a single news article by slug
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(COLLECTION_NAME);

  const article = await collection.findOne({ slug });

  if (!article) {
    return null;
  }

  return {
    ...article,
    _id: article._id?.toString(),
    publishedAt: new Date(article.publishedAt),
    fetchedAt: new Date(article.fetchedAt),
  };
}

// Create indexes for better performance
export async function ensureIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndex({ sourceUrl: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });
  await collection.createIndex({ slug: 1 });
  
  console.log('✅ News collection indexes created');
}

