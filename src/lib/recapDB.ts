import { getDatabase } from './mongodb';
import { unstable_cache } from 'next/cache';
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

// Get date in IST timezone (India Standard Time = UTC+5:30)
function getDateInIST(date: Date = new Date()): Date {
  // Convert to IST by adding 5 hours 30 minutes
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + istOffset);
}

// Get yesterday's date in YYYY-MM-DD format (IST)
export function getYesterdayDate(): string {
  const nowIST = getDateInIST();
  const yesterday = new Date(nowIST);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  
  console.log(`📅 [RecapDB] Today (IST): ${nowIST.toISOString()}, Yesterday: ${year}-${month}-${day}`);
  
  return `${year}-${month}-${day}`;
}

// Get today's date in YYYY-MM-DD format (IST)
export function getTodayDate(): string {
  const nowIST = getDateInIST();
  const year = nowIST.getFullYear();
  const month = String(nowIST.getMonth() + 1).padStart(2, '0');
  const day = String(nowIST.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
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

// Get news articles from a specific date (IST)
export async function getNewsForDate(date: string): Promise<NewsArticle[]> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(NEWS_COLLECTION);

  // Parse the date string (YYYY-MM-DD) and create IST day boundaries
  // Convert IST boundaries to UTC for MongoDB query
  const [year, month, day] = date.split('-').map(Number);
  
  // Start of day in IST (00:00:00 IST = previous day 18:30:00 UTC)
  const startOfDayIST = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  // Subtract IST offset (5:30) to get UTC time
  startOfDayIST.setTime(startOfDayIST.getTime() - (5.5 * 60 * 60 * 1000));
  
  // End of day in IST (23:59:59 IST = same day 18:29:59 UTC)
  const endOfDayIST = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  endOfDayIST.setTime(endOfDayIST.getTime() - (5.5 * 60 * 60 * 1000));

  console.log(`📰 [RecapDB] Fetching news for ${date} (IST)`);
  console.log(`   UTC range: ${startOfDayIST.toISOString()} to ${endOfDayIST.toISOString()}`);

  const articles = await collection
    .find({
      publishedAt: {
        $gte: startOfDayIST,
        $lte: endOfDayIST,
      },
    })
    .sort({ publishedAt: -1 })
    .limit(20) // Get top 20 articles
    .toArray();

  console.log(`📰 [RecapDB] Found ${articles.length} articles for ${date}`);

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

// Get all recaps (for sitemap and listing) - internal uncached version
async function getAllRecapsUncached(limit: number = 30): Promise<DailyRecap[]> {
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

/**
 * Get all recaps with caching
 * Cache duration: 5 minutes (300 seconds)
 */
export async function getAllRecaps(limit: number = 30): Promise<DailyRecap[]> {
  const cachedFn = unstable_cache(
    () => getAllRecapsUncached(limit),
    [`all-recaps-${limit}`],
    {
      revalidate: 300, // Cache for 5 minutes
      tags: ['recaps'],
    }
  );
  
  const recaps = await cachedFn();
  
  // Convert date strings back to Date objects after cache retrieval
  return recaps.map(recap => ({
    ...recap,
    generatedAt: new Date(recap.generatedAt),
    publishedAt: new Date(recap.publishedAt),
  }));
}

/**
 * Get recent recaps for display with caching
 * Cache duration: 5 minutes (300 seconds)
 */
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

