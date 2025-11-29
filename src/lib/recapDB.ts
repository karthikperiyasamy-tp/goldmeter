import { getDatabase } from './mongodb';
import type { DailyRecap } from './recapTypes';
import type { NewsArticle } from './newsTypes';

const RECAP_COLLECTION = 'daily_recaps';
const NEWS_COLLECTION = 'news';

// Generate slug from date
function generateSlug(date: string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  return `daily-recap-${day}-${month}-${year}`;
}

// Get yesterday's date in YYYY-MM-DD format
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Format date for display (e.g., "28 November 2024")
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Get news articles from a specific date
export async function getNewsForDate(date: string): Promise<NewsArticle[]> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(NEWS_COLLECTION);

  // Get start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const articles = await collection
    .find({
      publishedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
    .sort({ publishedAt: -1 })
    .limit(20) // Get top 20 articles
    .toArray();

  return articles.map(article => ({
    ...article,
    _id: article._id?.toString(),
    publishedAt: new Date(article.publishedAt),
    fetchedAt: new Date(article.fetchedAt),
  }));
}

// Check if recap already exists for a date
export async function recapExists(date: string): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection(RECAP_COLLECTION);
  const existing = await collection.findOne({ date });
  return !!existing;
}

// Save a daily recap
export async function saveRecap(recap: Omit<DailyRecap, '_id'>): Promise<DailyRecap> {
  const db = await getDatabase();
  const collection = db.collection<DailyRecap>(RECAP_COLLECTION);

  // Check if recap already exists
  const existing = await collection.findOne({ date: recap.date });
  if (existing) {
    // Update existing recap
    await collection.updateOne(
      { date: recap.date },
      { $set: { ...recap, generatedAt: new Date() } }
    );
    return { ...recap, _id: existing._id?.toString() };
  }

  // Insert new recap
  const result = await collection.insertOne({
    ...recap,
    generatedAt: new Date(),
    publishedAt: new Date(),
  } as DailyRecap);

  return { ...recap, _id: result.insertedId.toString() };
}

// Get a recap by date
export async function getRecapByDate(date: string): Promise<DailyRecap | null> {
  const db = await getDatabase();
  const collection = db.collection<DailyRecap>(RECAP_COLLECTION);
  
  const recap = await collection.findOne({ date });
  if (!recap) return null;

  return {
    ...recap,
    _id: recap._id?.toString(),
  };
}

// Get a recap by slug
export async function getRecapBySlug(slug: string): Promise<DailyRecap | null> {
  const db = await getDatabase();
  const collection = db.collection<DailyRecap>(RECAP_COLLECTION);
  
  const recap = await collection.findOne({ slug });
  if (!recap) return null;

  return {
    ...recap,
    _id: recap._id?.toString(),
  };
}

// Get all recaps (for sitemap and listing)
export async function getAllRecaps(limit: number = 30): Promise<DailyRecap[]> {
  const db = await getDatabase();
  const collection = db.collection<DailyRecap>(RECAP_COLLECTION);
  
  const recaps = await collection
    .find({})
    .sort({ date: -1 })
    .limit(limit)
    .toArray();

  return recaps.map(recap => ({
    ...recap,
    _id: recap._id?.toString(),
  }));
}

// Get recent recaps for display
export async function getRecentRecaps(limit: number = 5): Promise<DailyRecap[]> {
  return getAllRecaps(limit);
}

// Create indexes
export async function ensureRecapIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection(RECAP_COLLECTION);

  await collection.createIndex({ date: 1 }, { unique: true });
  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });
  
  console.log('✅ Recap collection indexes created');
}

// Helper to generate slug
export { generateSlug };

