import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rssParser';
import { saveArticles, ensureIndexes } from '@/lib/newsDB';

// POST /api/fetch-news - Fetch news from RSS feeds and save to database
export async function POST() {
  try {
    console.log('🚀 Starting RSS news fetch...');

    // Ensure indexes exist
    await ensureIndexes();

    // Fetch articles from all RSS feeds
    const articles = await fetchAllRSSFeeds();

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No articles found in RSS feeds',
        inserted: 0,
        skipped: 0,
      });
    }

    // Save to database
    const { inserted, skipped } = await saveArticles(articles);

    return NextResponse.json({
      success: true,
      message: `Fetched ${articles.length} articles, saved ${inserted} new, skipped ${skipped} duplicates`,
      fetched: articles.length,
      inserted,
      skipped,
    });
  } catch (error) {
    console.error('❌ Error in fetch-news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/fetch-news - Also allow GET for easy testing
export async function GET() {
  // Create a mock request for the POST handler
  const mockRequest = new Request('http://localhost/api/fetch-news', {
    method: 'POST',
  });
  return POST(mockRequest);
}

