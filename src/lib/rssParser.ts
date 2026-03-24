import * as cheerio from 'cheerio';
import https from 'https';
import type { NewsArticle, RSSFeed } from './newsTypes';

// RSS feeds for gold news in India
export const RSS_FEEDS: RSSFeed[] = [
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

// Generate a URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/^-|-$/g, '');
}

// Extract source name from Google News title (format: "Title - Source")
function extractSource(title: string): { cleanTitle: string; source: string } {
  const parts = title.split(' - ');
  if (parts.length > 1) {
    const source = parts.pop() || 'Unknown';
    const cleanTitle = parts.join(' - ');
    return { cleanTitle, source };
  }
  return { cleanTitle: title, source: 'Unknown' };
}

// Fetch URL using https module (bypasses SSL issues in corporate environments)
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
      rejectUnauthorized: false, // Bypass SSL verification for corporate proxies
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

// Parse a single RSS feed
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

    // Try different item selectors (RSS 2.0 vs Atom)
    let items = $('item');
    if (items.length === 0) {
      items = $('entry'); // Atom format
    }

    console.log(`   📰 Found ${items.length} items`);

    items.each((index, item) => {
      if (index >= 20) return; // Limit to 20 per feed

      const $item = $(item);
      
      // Try different tag names for title
      const rawTitle = $item.find('title').first().text().trim();
      
      // Try different tag names for link
      let link = $item.find('link').first().text().trim();
      if (!link) {
        link = $item.find('link').attr('href') || '';
      }
      
      // Description: prefer HTML inner parse (Google News etc. wrap text in tags)
      const $desc = $item.find('description').first();
      const descHtml = $desc.html()?.trim() || '';
      const descPlain = $desc.text().replace(/\s+/g, ' ').trim();
      let description = descPlain;
      if (descHtml && descHtml.includes('<')) {
        const $inner = cheerio.load(descHtml, { xmlMode: false });
        const fromTags = $inner.text().replace(/\s+/g, ' ').trim();
        if (fromTags.length > descPlain.length) {
          description = fromTags;
        }
      }
      if (!description) {
        description = $item.find('content').first().text().trim();
        if (!description) {
          description = $item.find('summary').first().text().trim();
        }
      }
      
      // Try different tag names for date
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
      
      // Clean up description (remove HTML tags and entities)
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

// Fetch all RSS feeds and return unique articles
export async function fetchAllRSSFeeds(): Promise<NewsArticle[]> {
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
        // Skip duplicates by URL or similar title
        const titleKey = article.title.toLowerCase().substring(0, 50);
        if (seenUrls.has(article.sourceUrl) || seenTitles.has(titleKey)) {
          continue;
        }
        seenUrls.add(article.sourceUrl);
        seenTitles.add(titleKey);
        allArticles.push(article);
      }
      
      // Small delay between feeds to be nice to servers
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error with feed ${feed.name}:`, error);
    }
  }

  // Sort by published date (newest first)
  allArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  console.log(`✅ Total unique articles: ${allArticles.length}`);
  return allArticles;
}
