import { MongoClient } from 'mongodb';
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Try models in order of preference (newest first)
const GEMINI_MODELS = ['gemini-3-flash', 'gemini-2.5-flash'];
let GEMINI_MODEL = GEMINI_MODELS[0];
let GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

if (!MONGODB_URI || !GEMINI_API_KEY) {
  console.error('❌ Missing MONGODB_URI or GEMINI_API_KEY');
  console.error('   MONGODB_URI:', MONGODB_URI ? '✓ set' : '✗ missing');
  console.error('   GEMINI_API_KEY:', GEMINI_API_KEY ? '✓ set' : '✗ missing');
  console.error('   Looked in:', path.join(__dirname, '..', '.env.local'));
  process.exit(1);
}

interface GeneratedArticle {
  title: string;
  metaDescription: string;
  body: string;
  tags: string[];
}

async function fetchGoldPriceData(): Promise<string> {
  try {
    console.log('📊 Fetching gold price data...');
    const res = await axios.get('https://goldmeter.in/api/ticker-rates', {
      timeout: 5000,
    });
    const { india } = res.data;
    if (india) {
      return `
Gold Prices Today (22K & 24K):
- 22K Gold: ₹${india.gold_22k} per 10g
- 24K Gold: ₹${india.gold_24k} per 10g
- Timestamp: ${new Date().toISOString()}
      `.trim();
    }
    return 'Gold price data unavailable';
  } catch (error) {
    console.warn('⚠️  Could not fetch gold prices:', error);
    return 'Gold price data unavailable';
  }
}

async function fetchSilverPriceData(): Promise<string> {
  try {
    console.log('📊 Fetching silver price data...');
    const res = await axios.get('https://goldmeter.in/api/ticker-rates', {
      timeout: 5000,
    });
    const { india } = res.data;
    if (india?.silver_1kg) {
      return `
Silver Prices Today:
- Silver: ₹${india.silver_1kg} per kg
- Timestamp: ${new Date().toISOString()}
      `.trim();
    }
    return 'Silver price data unavailable';
  } catch (error) {
    console.warn('⚠️  Could not fetch silver prices:', error);
    return 'Silver price data unavailable';
  }
}

async function fetchNewsHeadlines(): Promise<string> {
  try {
    console.log('📰 Fetching latest news headlines...');
    const client = new MongoClient(MONGODB_URI!);
    await client.connect();
    const db = client.db('goldmeter');
    const articles = await db
      .collection('news_articles')
      .find({ is_published: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .toArray();
    await client.close();

    if (articles.length > 0) {
      return articles
        .map((a: any, i: number) => `${i + 1}. ${a.title}`)
        .join('\n');
    }
    return 'No recent news available';
  } catch (error) {
    console.warn('⚠️  Could not fetch news:', error);
    return 'No recent news available';
  }
}

async function fetchEconomicEvents(): Promise<string> {
  try {
    console.log('📅 Fetching economic events...');
    // Placeholder - Gemini will incorporate current context in the article
    return 'Current date: ' + new Date().toISOString().split('T')[0];
  } catch (error) {
    console.warn('⚠️  Could not fetch economic events:', error);
    return '';
  }
}

async function fetchTwitterTrends(): Promise<string> {
  try {
    console.log('🐦 Fetching Twitter trends (Gemini will incorporate current trends)...');
    // Let Gemini handle current trends in the article based on its knowledge
    return 'Current date: ' + new Date().toISOString().split('T')[0];
  } catch (error) {
    console.warn('⚠️  Could not fetch Twitter trends:', error);
    return '';
  }
}

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

    // Try next model if current one is not available (404)
    if (response.status === 404) {
      console.warn(`⚠️  Model ${GEMINI_MODEL} not available, trying next...`);
      const nextModelIndex = GEMINI_MODELS.indexOf(GEMINI_MODEL) + 1;
      if (nextModelIndex < GEMINI_MODELS.length) {
        GEMINI_MODEL = GEMINI_MODELS[nextModelIndex];
        GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
        console.log(`✅ Switched to model: ${GEMINI_MODEL}`);
        attempt--; // Don't count this as an attempt
        continue;
      }
    }

    // Rate limiting - retry with backoff
    if (response.status === 429 && attempt < maxAttempts) {
      const delay = 500 * attempt;
      console.warn(`⚠️  Gemini 429 (rate limit), retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      continue;
    }

    // Server temporarily unavailable - retry with backoff
    if (response.status === 503 && attempt < maxAttempts) {
      const delay = 1000 * attempt;
      console.warn(`⚠️  Gemini 503 (unavailable), retrying in ${delay}ms...`);
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

  return text;
}

async function generateArticleWithGemini(
  goldData: string,
  silverData: string,
  newsHeadlines: string,
  twitterTrends: string,
  economicEvents: string
): Promise<GeneratedArticle> {
  const prompt = `You are a professional financial news writer for Goldmeter.in with access to current information.

Your task is to create a unique, SEO-optimized article of at least 700 words about gold and silver markets today.

IMPORTANT: Use your knowledge of current events, market trends, and real-world developments to enhance this article. If you know of relevant:
- Central bank decisions or announcements (Fed, ECB, RBI, etc.)
- Geopolitical events affecting precious metals
- Currency movements (especially USD/INR)
- Inflation or interest rate developments
- Market sentiment or trending topics on financial platforms

...please naturally incorporate them into the article.

Requirements:
1. Write in a professional yet simple tone, suitable for Indian gold investors.
2. The article must be plagiarism-free and human-like.
3. Include a compelling SEO-friendly headline.
4. Include an engaging introduction.
5. Explain why gold and silver prices are moving today (use real current knowledge).
6. Mention relevant global economic or geopolitical events (research these if needed).
7. Mention central bank/Fed/inflation/interest rate updates if relevant today.
8. Include India gold/silver price mentions with the data provided.
9. Include expert-style analysis and possible future outlook.
10. End with a conclusion for investors/traders in India.
11. Use short paragraphs for readability.
12. Naturally include SEO keywords such as:
    "gold price today",
    "silver price today",
    "gold rate in India",
    "silver rate in India",
    "why gold price is falling",
    "why gold price is rising",
    "why silver price is falling",
    "why silver price is rising"

TODAY'S DATA TO REFERENCE:
-------------------
Gold Price Data (India):
${goldData}

Silver Price Data (India):
${silverData}

Recent News Headlines:
${newsHeadlines}
-------------------

IMPORTANT: Format your response EXACTLY as follows, with these sections clearly marked:

## TITLE
[Write the SEO-friendly title here]

## META_DESCRIPTION
[Write 150-160 character meta description here]

## ARTICLE_BODY
[Write the full article body here - minimum 700 words]

## TAGS
[Write 5 SEO tags comma-separated, like: gold-price,silver-today,india-rates,precious-metals,market-analysis]

Do not include any other text outside these sections.`;

  const text = await generateWithGemini(prompt);

  const titleMatch = text.match(/## TITLE\n(.*?)(?=##|$)/s);
  const metaMatch = text.match(/## META_DESCRIPTION\n(.*?)(?=##|$)/s);
  const bodyMatch = text.match(/## ARTICLE_BODY\n(.*?)(?=##|$)/s);
  const tagsMatch = text.match(/## TAGS\n(.*?)(?=##|$)/s);

  const title = titleMatch ? titleMatch[1].trim() : 'Gold & Silver Market Update';
  const metaDescription = metaMatch
    ? metaMatch[1].trim().substring(0, 160)
    : 'Latest gold and silver prices with market analysis.';
  const body = bodyMatch ? bodyMatch[1].trim() : text;
  const tagsString = tagsMatch ? tagsMatch[1].trim() : 'gold-price,silver-today,market-analysis';
  const tags = tagsString
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);

  return { title, metaDescription, body, tags };
}

async function saveArticleToMongoDB(article: GeneratedArticle): Promise<string> {
  const client = new MongoClient(MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db('goldmeter');
    const collection = db.collection('trending_articles');

    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueSlug = `${slug}-${today.getTime()}`;

    const doc = {
      title: article.title,
      slug: uniqueSlug,
      metaDescription: article.metaDescription,
      content: article.body,
      tags: article.tags,
      date: today,
      publishedAt: new Date(),
      isPublished: true,
      isAiGenerated: true,
      source: 'daily-auto-generation',
    };

    const result = await collection.insertOne(doc);
    console.log(`✅ Article saved to MongoDB with ID: ${result.insertedId}`);
    return uniqueSlug;
  } finally {
    await client.close();
  }
}

async function triggerVercelRevalidation(): Promise<void> {
  try {
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    const revalidateUrl = process.env.REVALIDATE_URL || 'https://goldmeter.in/api/revalidate-gold-rates';

    if (!REVALIDATE_SECRET) {
      console.warn('⚠️  REVALIDATE_SECRET not set, skipping Vercel revalidation');
      return;
    }

    console.log('🔄 Triggering Vercel ISR revalidation...');
    const response = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': REVALIDATE_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: 'trending-articles', // Revalidate trending articles cache tag
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Vercel revalidation triggered:', data);
    } else {
      console.warn('⚠️  Vercel revalidation failed:', response.status);
    }
  } catch (error) {
    console.warn('⚠️  Could not trigger Vercel revalidation:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting daily article generation...');

    const goldData = await fetchGoldPriceData();
    const silverData = await fetchSilverPriceData();
    const newsHeadlines = await fetchNewsHeadlines();
    const twitterTrends = await fetchTwitterTrends();
    const economicEvents = await fetchEconomicEvents();

    const article = await generateArticleWithGemini(
      goldData,
      silverData,
      newsHeadlines,
      twitterTrends,
      economicEvents
    );

    const slug = await saveArticleToMongoDB(article);

    // Trigger Vercel revalidation to update the articles page
    await triggerVercelRevalidation();

    console.log(`
✅ Daily article generation completed successfully!
   Title: ${article.title}
   Slug: ${slug}
   Tags: ${article.tags.join(', ')}
    `);
  } catch (error) {
    console.error('❌ Error generating article:', error);
    process.exit(1);
  }
}

main();
