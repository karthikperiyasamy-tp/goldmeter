/**
 * Daily Recap Generator - Standalone Script for GitHub Actions
 * 
 * This script generates AI-powered daily recaps from news articles.
 * It runs independently of Next.js/Vercel and can be executed in GitHub Actions.
 * 
 * Usage: npx tsx generate-recap.ts
 * Required env: MONGODB_URI, GEMINI_API_KEY
 */

import * as cheerio from 'cheerio';
import https from 'https';
import { getDatabase, closeConnection } from './lib/mongodb.js';

// ============================================================================
// TYPES
// ============================================================================

interface NewsArticle {
  _id?: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: Date;
  fetchedAt: Date;
  slug: string;
  category: 'gold' | 'silver' | 'market' | 'general';
}

interface GoldRateSnapshot {
  gold22k: number;
  gold24k: number;
  gold18k?: number;
  silver1kg?: number | null;
  priceChange?: {
    gold22k: number;
    gold24k: number;
  };
}

interface DailyRecap {
  _id?: string;
  date: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  highlights: string[];
  sourcesCount: number;
  goldRates?: GoldRateSnapshot;
  generatedAt: Date;
  publishedAt: Date;
}

interface RSSFeed {
  name: string;
  url: string;
  category: NewsArticle['category'];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

const NEWS_COLLECTION = 'news';
const RECAP_COLLECTION = 'daily_recaps';
const GOLD_PRICES_COLLECTION = 'gold_prices';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDateInIST(date: Date = new Date()): Date {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utcTime + istOffset);
}

function getYesterdayDate(): string {
  const nowIST = getDateInIST();
  const yesterday = new Date(nowIST);
  yesterday.setDate(yesterday.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');

  console.log(`📅 [RecapDB] Today (IST): ${nowIST.toISOString()}, Yesterday: ${year}-${month}-${day}`);

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function generateSlug(date: string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  return `daily-recap-${day}-${month}-${year}`;
}

function generateNewsSlug(title: string): string {
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

// Fetch URL using https module
function fetchWithSSLBypass(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
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

    req.on('error', (error) => reject(error));
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

    if (!xml || xml.length < 100) {
      console.error(`   ❌ Empty or too short response`);
      return [];
    }

    const $ = cheerio.load(xml, { xmlMode: true });
    const articles: NewsArticle[] = [];

    let items = $('item');
    if (items.length === 0) {
      items = $('entry');
    }

    items.each((index, item) => {
      if (index >= 20) return;

      const $item = $(item);
      const rawTitle = $item.find('title').first().text().trim();

      let link = $item.find('link').first().text().trim();
      if (!link) {
        link = $item.find('link').attr('href') || '';
      }

      let description = $item.find('description').first().text().trim();
      if (!description) {
        description = $item.find('content').first().text().trim() || $item.find('summary').first().text().trim();
      }

      let pubDate = $item.find('pubDate').first().text().trim();
      if (!pubDate) {
        pubDate = $item.find('published').first().text().trim() || $item.find('updated').first().text().trim();
      }

      if (!rawTitle || !link) return;

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

      articles.push({
        title: cleanTitle,
        summary: cleanDescription || `Read the latest: ${cleanTitle}`,
        sourceUrl: link,
        sourceName: source,
        publishedAt: pubDate ? new Date(pubDate) : new Date(),
        fetchedAt: new Date(),
        slug: generateNewsSlug(cleanTitle) + '-' + Date.now().toString(36),
        category: feed.category,
      });
    });

    console.log(`   ✅ Parsed ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error(`   ❌ Error parsing ${feed.name}:`, error);
    return [];
  }
}

async function fetchAllRSSFeeds(): Promise<NewsArticle[]> {
  console.log('🔄 Fetching RSS feeds...');

  const allArticles: NewsArticle[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  for (const feed of RSS_FEEDS) {
    try {
      const articles = await parseFeed(feed);

      for (const article of articles) {
        const titleKey = article.title.toLowerCase().substring(0, 50);
        if (seenUrls.has(article.sourceUrl) || seenTitles.has(titleKey)) continue;
        seenUrls.add(article.sourceUrl);
        seenTitles.add(titleKey);
        allArticles.push(article);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error with feed ${feed.name}:`, error);
    }
  }

  allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  console.log(`✅ Total unique articles: ${allArticles.length}`);
  return allArticles;
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function ensureNewsIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection(NEWS_COLLECTION);

  await collection.createIndex({ sourceUrl: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });
  await collection.createIndex({ slug: 1 });

  console.log('✅ News indexes ensured');
}

async function saveArticles(articles: NewsArticle[]): Promise<{ inserted: number; skipped: number }> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(NEWS_COLLECTION);

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
    } catch {
      skipped++;
    }
  }

  console.log(`📊 News: ${inserted} new, ${skipped} skipped`);
  return { inserted, skipped };
}

async function ensureRecapIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection(RECAP_COLLECTION);

  await collection.createIndex({ date: 1 }, { unique: true });
  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ publishedAt: -1 });

  console.log('✅ Recap indexes ensured');
}

async function recapExists(date: string): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection(RECAP_COLLECTION);
  const existing = await collection.findOne({ date });
  return !!existing;
}

async function getNewsForDate(date: string): Promise<NewsArticle[]> {
  const db = await getDatabase();
  const collection = db.collection<NewsArticle>(NEWS_COLLECTION);

  const [year, month, day] = date.split('-').map(Number);

  const startOfDayIST = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  startOfDayIST.setTime(startOfDayIST.getTime() - 5.5 * 60 * 60 * 1000);

  const endOfDayIST = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  endOfDayIST.setTime(endOfDayIST.getTime() - 5.5 * 60 * 60 * 1000);

  console.log(`📰 Fetching news for ${date} (IST)`);

  const articles = await collection
    .find({
      publishedAt: {
        $gte: startOfDayIST,
        $lte: endOfDayIST,
      },
    })
    .sort({ publishedAt: -1 })
    .limit(20)
    .toArray();

  console.log(`📰 Found ${articles.length} articles for ${date}`);
  return articles;
}

async function getGoldRatesForDate(dateString: string): Promise<GoldRateSnapshot | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection(GOLD_PRICES_COLLECTION);

    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const previousDate = new Date(targetDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const targetRate = await collection.findOne({ city: 'India', date: targetDate });
    if (!targetRate) return null;

    const previousRate = await collection.findOne({ city: 'India', date: previousDate });

    const priceChange = {
      gold22k: previousRate ? targetRate.gold_22k - previousRate.gold_22k : 0,
      gold24k: previousRate ? targetRate.gold_24k - previousRate.gold_24k : 0,
    };

    return {
      gold22k: targetRate.gold_22k,
      gold24k: targetRate.gold_24k,
      gold18k: targetRate.gold_18k,
      silver1kg: targetRate.silver_1kg || null,
      priceChange,
    };
  } catch (error) {
    console.error('Error fetching gold rates:', error);
    return null;
  }
}

async function saveRecap(recap: Omit<DailyRecap, '_id'>): Promise<DailyRecap> {
  const db = await getDatabase();
  const collection = db.collection<DailyRecap>(RECAP_COLLECTION);

  const existing = await collection.findOne({ date: recap.date });
  if (existing) {
    await collection.updateOne({ date: recap.date }, { $set: { ...recap, generatedAt: new Date() } });
    return { ...recap, _id: existing._id?.toString() };
  }

  const result = await collection.insertOne({
    ...recap,
    generatedAt: new Date(),
    publishedAt: new Date(),
  } as DailyRecap);

  return { ...recap, _id: result.insertedId.toString() };
}

// ============================================================================
// GEMINI AI
// ============================================================================

async function fetchWithRetry(prompt: string): Promise<Response> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (response.ok) return response;

    if (response.status === 429 && attempt < maxAttempts) {
      const delay = 500 * attempt;
      console.warn(`Gemini 429, retrying in ${delay}ms`);
      await new Promise((res) => setTimeout(res, delay));
      continue;
    }

    return response;
  }

  throw new Error('Gemini API retries exhausted');
}

async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  console.log(`🤖 Calling Gemini API (model: ${GEMINI_MODEL})...`);

  const response = await fetchWithRetry(prompt);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No content generated from Gemini');
  }

  console.log('✅ Gemini API response received');
  return text;
}

async function generateDailyRecap(
  headlines: Array<{ title: string; source: string; summary: string }>,
  date: string
): Promise<{ title: string; content: string; highlights: string[]; summary: string }> {
  const headlinesList = headlines.map((h, i) => `${i + 1}. "${h.title}" (${h.source})\n   ${h.summary}`).join('\n\n');

  const prompt = `You are a financial journalist writing a daily gold market recap for Indian investors and jewelry shoppers.

Based on these ${headlines.length} gold-related news headlines from ${date}:

${headlinesList}

Write a comprehensive daily recap article with the following structure:

1. **TITLE**: Create an engaging SEO-friendly title like "Gold Market Recap: [Key Event] on ${date}" or "Gold Prices [Direction]: What Happened on ${date}"

2. **SUMMARY**: Write a 2-sentence summary for preview cards (max 150 characters)

3. **HIGHLIGHTS**: List exactly 5 key bullet points (each 10-15 words)

4. **CONTENT**: Write a 300-400 word article in plain paragraphs (no headers or bullet points in content) covering:
   - Opening paragraph summarizing the day's main gold market movements
   - Key price movements and market trends  
   - Important news that affected gold prices
   - Closing paragraph with outlook for investors

Important guidelines:
- Write for Indian audience (use ₹, mention MCX, Indian cities)
- Keep it informative but accessible to general readers
- Focus on actionable insights for investors and jewelry buyers
- Use simple English, avoid jargon
- DO NOT make up prices or statistics not mentioned in headlines

Format your response EXACTLY like this:
---TITLE---
[Your title here]
---SUMMARY---
[Your 2-sentence summary here]
---HIGHLIGHTS---
• [Highlight 1]
• [Highlight 2]
• [Highlight 3]
• [Highlight 4]
• [Highlight 5]
---CONTENT---
[Your full article content here]`;

  const response = await generateWithGemini(prompt);

  const titleMatch = response.match(/---TITLE---\s*([\s\S]*?)\s*---SUMMARY---/);
  const summaryMatch = response.match(/---SUMMARY---\s*([\s\S]*?)\s*---HIGHLIGHTS---/);
  const highlightsMatch = response.match(/---HIGHLIGHTS---\s*([\s\S]*?)\s*---CONTENT---/);
  const contentMatch = response.match(/---CONTENT---\s*([\s\S]*?)$/);

  const title = titleMatch?.[1]?.trim() || `Gold Market Recap: ${date}`;
  const summary = summaryMatch?.[1]?.trim() || 'Daily gold market summary and analysis.';
  const highlightsText = highlightsMatch?.[1]?.trim() || '';
  const content = contentMatch?.[1]?.trim() || response;

  const highlights = highlightsText
    .split('\n')
    .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);

  return {
    title,
    summary,
    highlights:
      highlights.length > 0
        ? highlights
        : [
            'Gold prices showed movement today',
            'Market sentiment remained mixed',
            'Investors watched global cues',
            'MCX gold trading was active',
            'Jewelry demand stayed steady',
          ],
    content,
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 [Daily Recap] Starting daily recap generation...');
  console.log(`📅 [Daily Recap] Timestamp: ${new Date().toISOString()}`);

  const results = {
    newsFetch: { success: false, message: '', inserted: 0 },
    recapGeneration: { success: false, message: '', title: '' },
  };

  try {
    // ============================================
    // STEP 1: Fetch latest news from RSS
    // ============================================
    console.log('\n📰 STEP 1: Fetching news from RSS feeds...');

    try {
      await ensureNewsIndexes();
      const articles = await fetchAllRSSFeeds();

      if (articles.length > 0) {
        const { inserted, skipped } = await saveArticles(articles);
        results.newsFetch = {
          success: true,
          message: `Fetched ${articles.length} articles, saved ${inserted} new, skipped ${skipped} duplicates`,
          inserted,
        };
        console.log(`✅ News fetch: ${results.newsFetch.message}`);
      } else {
        results.newsFetch = {
          success: true,
          message: 'No articles found in RSS feeds',
          inserted: 0,
        };
      }
    } catch (newsError) {
      console.error('❌ News fetch error:', newsError);
      results.newsFetch = {
        success: false,
        message: newsError instanceof Error ? newsError.message : 'Unknown error',
        inserted: 0,
      };
    }

    // ============================================
    // STEP 2: Generate AI recap for yesterday
    // ============================================
    console.log('\n🤖 STEP 2: Generating AI recap for yesterday...');

    const yesterdayDate = getYesterdayDate();
    console.log(`📅 Target date: ${yesterdayDate}`);

    try {
      await ensureRecapIndexes();

      if (await recapExists(yesterdayDate)) {
        results.recapGeneration = {
          success: true,
          message: `Recap already exists for ${yesterdayDate}`,
          title: 'Existing',
        };
        console.log(`⚠️ Recap already exists for ${yesterdayDate}, skipping`);
      } else {
        const articles = await getNewsForDate(yesterdayDate);
        console.log(`📰 Found ${articles.length} articles for recap`);

        if (articles.length >= 3) {
          const headlines = articles.slice(0, 15).map((article) => ({
            title: article.title,
            source: article.sourceName,
            summary: article.summary,
          }));

          const displayDate = formatDateForDisplay(yesterdayDate);
          const generated = await generateDailyRecap(headlines, displayDate);

          let goldRates: GoldRateSnapshot | undefined;
          try {
            const ratesData = await getGoldRatesForDate(yesterdayDate);
            if (ratesData) {
              goldRates = ratesData;
              console.log(`💰 Fetched gold rates: 22K=₹${ratesData.gold22k}, 24K=₹${ratesData.gold24k}`);
            }
          } catch (ratesError) {
            console.warn('⚠️ Could not fetch gold rates:', ratesError);
          }

          const recap = await saveRecap({
            date: yesterdayDate,
            title: generated.title,
            slug: generateSlug(yesterdayDate),
            summary: generated.summary,
            content: generated.content,
            highlights: generated.highlights,
            sourcesCount: articles.length,
            goldRates,
            generatedAt: new Date(),
            publishedAt: new Date(),
          });

          results.recapGeneration = {
            success: true,
            message: `Generated recap for ${displayDate}${goldRates ? ' (with gold rates)' : ''}`,
            title: recap.title,
          };
          console.log(`✅ Recap generated: "${recap.title}"`);
        } else {
          results.recapGeneration = {
            success: false,
            message: `Not enough articles (${articles.length}) for recap`,
            title: '',
          };
          console.log(`⚠️ Not enough articles for recap`);
        }
      }
    } catch (recapError) {
      console.error('❌ Recap generation error:', recapError);
      results.recapGeneration = {
        success: false,
        message: recapError instanceof Error ? recapError.message : 'Unknown error',
        title: '',
      };
    }

    // ============================================
    // Return results
    // ============================================
    console.log('\n✅ Daily recap job completed');
    console.log(`📊 News: ${results.newsFetch.message}`);
    console.log(`📊 Recap: ${results.recapGeneration.message}`);

    await closeConnection();

    // Exit with error if recap generation failed critically
    if (!results.recapGeneration.success && results.recapGeneration.message.includes('error')) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ [Daily Recap] Fatal error:', error);
    await closeConnection();
    process.exit(1);
  }
}

// Run the script
main();
