import { MongoClient } from 'mongodb';
import axios from 'axios';

const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

if (!MONGODB_URI || !GEMINI_API_KEY) {
  console.error('❌ Missing MONGODB_URI or GEMINI_API_KEY');
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
    // You can integrate with an economic calendar API here (e.g., tradingeconomics, forexfactory)
    // For now, placeholder
    return 'Check for Fed, ECB, or RBI announcements scheduled for today or tomorrow.';
  } catch (error) {
    console.warn('⚠️  Could not fetch economic events:', error);
    return 'No specific economic events tracked today.';
  }
}

async function fetchTwitterTrends(): Promise<string> {
  try {
    console.log('🐦 Fetching Twitter trends (simulated)...');
    // Twitter API requires bearer token; for now, return placeholder
    return 'Trending topics: #Gold, #Silver, #Inflation, #FedDecision';
  } catch (error) {
    console.warn('⚠️  Could not fetch Twitter trends:', error);
    return 'No trending data available';
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

  return text;
}

async function generateArticleWithGemini(
  goldData: string,
  silverData: string,
  newsHeadlines: string,
  twitterTrends: string,
  economicEvents: string
): Promise<GeneratedArticle> {
  const prompt = `You are a professional financial news writer for Goldmeter.in.

Your task is to create a unique, SEO-optimized article of at least 700 words based on the latest data provided below.

Requirements:
1. Write in a professional yet simple tone.
2. The article must be plagiarism-free and human-like.
3. Include a compelling SEO-friendly headline.
4. Include an engaging introduction.
5. Explain why gold and silver prices are moving today.
6. Mention global economic or geopolitical events affecting prices.
7. Mention central bank/Fed/inflation/interest rate updates if relevant.
8. Include India gold/silver price mentions if available.
9. Include expert-style analysis and possible future outlook.
10. End with a conclusion for investors/traders.
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

Data to use:
-------------------
Gold Price Data:
${goldData}

Silver Price Data:
${silverData}

Latest News Headlines:
${newsHeadlines}

Trending Topics / Twitter:
${twitterTrends}

Economic Events:
${economicEvents}
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
