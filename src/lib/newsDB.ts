import { getDatabase } from './mongodb';
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

// Fetch news from database with grouping
export async function getGroupedNews(
  limit: number = 10,
  offset: number = 0
): Promise<{ groups: GroupedNews[]; totalCount: number; hasMore: boolean }> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(COLLECTION_NAME);

  // Get total count
  const totalCount = await collection.countDocuments();

  // Fetch articles sorted by published date
  const articles = await collection
    .find({})
    .sort({ publishedAt: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

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

    // Convert MongoDB document to plain object
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

// Get recent news for homepage (flat list, limited)
export async function getRecentNews(limit: number = 5): Promise<NewsArticle[]> {
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

// Create indexes for better performance
export async function ensureIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndex({ sourceUrl: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });
  await collection.createIndex({ slug: 1 });
  
  console.log('✅ News collection indexes created');
}

