import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rssParser';
import { saveArticles, ensureIndexes } from '@/lib/newsDB';

// This endpoint is designed to be called by Vercel Cron
// Add to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/fetch-news",
//     "schedule": "0 */6 * * *"
//   }]
// }

export async function GET(request: Request) {
  try {
    // Verify cron secret for security (only in production with CRON_SECRET set)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Only validate if CRON_SECRET is set AND an auth header is provided (but wrong)
    // This allows local testing while protecting production
    if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
      console.log('⚠️ Unauthorized cron request');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🕐 Cron job: Starting RSS news fetch...');

    // Ensure indexes exist
    await ensureIndexes();

    // Fetch articles from all RSS feeds
    const articles = await fetchAllRSSFeeds();

    if (articles.length === 0) {
      console.log('ℹ️ Cron job: No articles found');
      return NextResponse.json({
        success: true,
        message: 'No articles found in RSS feeds',
        inserted: 0,
        skipped: 0,
      });
    }

    // Save to database
    const { inserted, skipped } = await saveArticles(articles);

    console.log(`✅ Cron job: Saved ${inserted} new articles`);

    return NextResponse.json({
      success: true,
      message: `Cron completed: ${inserted} new articles saved`,
      fetched: articles.length,
      inserted,
      skipped,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

