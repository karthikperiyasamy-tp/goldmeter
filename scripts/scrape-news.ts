/**
 * News RSS Scraper - Standalone Script for GitHub Actions
 * 
 * This script fetches news from RSS feeds and saves them to MongoDB.
 * It runs independently of Next.js/Vercel and can be executed in GitHub Actions.
 * 
 * Usage: npx tsx scrape-news.ts
 * Required env: MONGODB_URI
 */

import * as cheerio from 'cheerio';
import https from 'https';
import { appendFileSync } from 'fs';
import { getDatabase, closeConnection } from './lib/mongodb.js';

/**
 * Expose whether new articles were added so the GitHub Action can conditionally
 * revalidate the site cache (avoids regenerating news pages when nothing changed).
 */
function emitNewsChanged(changed: boolean): void {
  const value = changed ? 'true' : 'false';
  console.log(`::news-changed::${value}`);
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    try {
      appendFileSync(outputFile, `changed=${value}\n`);
    } catch (e) {
      console.warn('⚠️  [News Scraper] Could not write GITHUB_OUTPUT:', e);
    }
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface NewsArticle {
  _id?: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl?: string;
  publishedAt: Date;
  fetchedAt: Date;
  slug: string;
  category: 'gold' | 'silver' | 'market' | 'general';
}

interface RSSFeed {
  name: string;
  url: string;
  category: NewsArticle['category'];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const RSS_FEEDS: RSSFeed[] = [
  {
    name: 'Google News - Gold India',
    url: 'https://news.google.com/rss/search?q=gold+price+india&hl=en-IN&gl=IN&ceid=IN:en',
    category: 'gold',
  },
  {
    name: 'Google News - Gold Rate',
    url: 'https://news.google.com/rss/search?q=gold+rate+today&hl=en-IN&gl=IN&ceid=IN:en',
    category: 'gold',
  },
  {
    name: 'Google News - MCX Gold',
    url: 'https://news.google.com/rss/search?q=MCX+gold+futures&hl=en-IN&gl=IN&ceid=IN:en',
    category: 'market',
  },
];

const COLLECTION_NAME = 'news';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/^-|-$/g, '');
}

function extractSource(title: string): { cleanTitle: string; source: string } {
  const parts = title.split(' - ');
  if (parts.length > 1) {
    const source = parts.pop() || 'Unknown';
    const cleanTitle = parts.join(' - ');
    return { cleanTitle, source };
  }
  return { cleanTitle: title, source: 'Unknown' };
}

// Fetch URL using https module (bypasses SSL issues)
function fetchWithSSLBypass(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// ============================================================================
// RSS PARSING
// ============================================================================

async function parseFeed(feed: RSSFeed): Promise<NewsArticle[]> {
  console.log(`📡 Fetching: ${feed.name}`);

  try {
    const xml = await fetchWithSSLBypass(feed.url);
    console.log(`   📄 Received ${xml.length} bytes`);

    if (!xml || xml.length < 100) {
      console.error(`   ❌ Empty or too short response`);
      return [];
    }

    const $ = cheerio.load(xml, { xmlMode: true });
    const articles: NewsArticle[] = [];

    let items = $('item');
    if (items.length === 0) {
      items = $('entry'); // Atom format
    }

    console.log(`   📰 Found ${items.length} items`);

    items.each((index, item) => {
      if (index >= 20) return; // Limit to 20 per feed

      const $item = $(item);

      const rawTitle = $item.find('title').first().text().trim();

      let link = $item.find('link').first().text().trim();
      if (!link) {
        link = $item.find('link').attr('href') || '';
      }

      let description = $item.find('description').first().text().trim();
      if (!description) {
        description = $item.find('content').first().text().trim();
        if (!description) {
          description = $item.find('summary').first().text().trim();
        }
      }

      let pubDate = $item.find('pubDate').first().text().trim();
      if (!pubDate) {
        pubDate = $item.find('published').first().text().trim();
        if (!pubDate) {
          pubDate = $item.find('updated').first().text().trim();
        }
      }

      if (!rawTitle || !link) {
        return;
      }

      const { cleanTitle, source } = extractSource(rawTitle);

      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

      const article: NewsArticle = {
        title: cleanTitle,
        summary: cleanDescription || `Read the latest: ${cleanTitle}`,
        sourceUrl: link,
        sourceName: source,
        publishedAt: pubDate ? new Date(pubDate) : new Date(),
        fetchedAt: new Date(),
        slug: generateSlug(cleanTitle) + '-' + Date.now().toString(36),
        category: feed.category,
      };

      articles.push(article);
    });

    console.log(`   ✅ Parsed ${articles.length} articles from ${feed.name}`);
    return articles;
  } catch (error) {
    console.error(`   ❌ Error parsing ${feed.name}:`, error);
    return [];
  }
}

async function fetchAllRSSFeeds(): Promise<NewsArticle[]> {
  console.log('🔄 Starting RSS feed fetch...');
  console.log(`   Feeds configured: ${RSS_FEEDS.length}`);

  const allArticles: NewsArticle[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  // Fetch feeds sequentially to avoid rate limiting
  for (const feed of RSS_FEEDS) {
    try {
      const articles = await parseFeed(feed);

      for (const article of articles) {
        const titleKey = article.title.toLowerCase().substring(0, 50);
        if (seenUrls.has(article.sourceUrl) || seenTitles.has(titleKey)) {
          continue;
        }
        seenUrls.add(article.sourceUrl);
        seenTitles.add(titleKey);
        allArticles.push(article);
      }

      // Small delay between feeds
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error with feed ${feed.name}:`, error);
    }
  }

  // Sort by published date (newest first)
  allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  console.log(`✅ Total unique articles: ${allArticles.length}`);
  return allArticles;
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function ensureIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndex({ sourceUrl: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });
  await collection.createIndex({ slug: 1 });

  console.log('✅ News collection indexes ensured');
}

async function saveArticles(articles: NewsArticle[]): Promise<{ inserted: number; skipped: number }> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(COLLECTION_NAME);

  let inserted = 0;
  let skipped = 0;

  for (const article of articles) {
    try {
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

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 [News Scraper] Starting RSS news fetch...');
  console.log(`📅 [News Scraper] Timestamp: ${new Date().toISOString()}`);

  try {
    // Ensure indexes exist
    await ensureIndexes();

    // Fetch articles from all RSS feeds
    const articles = await fetchAllRSSFeeds();

    if (articles.length === 0) {
      console.log('ℹ️ [News Scraper] No articles found');
      emitNewsChanged(false);
      await closeConnection();
      process.exit(0);
    }

    // Save to database
    const { inserted, skipped } = await saveArticles(articles);

    console.log('✅ [News Scraper] News fetch completed');
    console.log(`📊 [News Scraper] Final: ${inserted} new articles saved, ${skipped} skipped`);

    // Only revalidate when at least one new article was actually inserted.
    emitNewsChanged(inserted > 0);
    if (inserted === 0) {
      console.log('⏭️  [News Scraper] No new articles — revalidation should be skipped');
    }

    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ [News Scraper] Fatal error:', error);
    await closeConnection();
    process.exit(1);
  }
}

// Run the script
main();
