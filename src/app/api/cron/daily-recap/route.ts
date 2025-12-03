import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { fetchAllRSSFeeds } from '@/lib/rssParser';
import { saveArticles, ensureIndexes } from '@/lib/newsDB';
import { generateDailyRecap } from '@/lib/gemini';
import { 
  getNewsForDate, 
  saveRecap, 
  recapExists, 
  getYesterdayDate,
  formatDateForDisplay,
  ensureRecapIndexes,
} from '@/lib/recapDB';

// Generate slug from date
function generateSlug(date: string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  return `daily-recap-${day}-${month}-${year}`;
}

// This cron job runs daily and does:
// 1. Fetch latest news from RSS
// 2. Generate AI recap for yesterday's news
export async function GET(request: NextRequest) {
  const results = {
    newsFetch: { success: false, message: '', inserted: 0 },
    recapGeneration: { success: false, message: '', title: '' },
  };

  try {
    console.log('🕐 Daily cron job started...');
    
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production') {
      const token = authHeader?.replace('Bearer ', '');
      if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
        console.log('❌ [Cron] Unauthorized access attempt');
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } else {
        console.log('🔧 [Cron] Running in development mode (auth check skipped)');
    }

    console.log(`📅 Current time: ${new Date().toISOString()}`);

    // ============================================
    // STEP 1: Fetch latest news from RSS
    // ============================================
    console.log('\n📰 STEP 1: Fetching news from RSS feeds...');
    
    try {
      await ensureIndexes();
      const articles = await fetchAllRSSFeeds();
      
      if (articles.length > 0) {
        const { inserted, skipped } = await saveArticles(articles);
        results.newsFetch = {
          success: true,
          message: `Fetched ${articles.length} articles, saved ${inserted} new, skipped ${skipped} duplicates`,
          inserted,
        };
        console.log(`✅ News fetch: ${results.newsFetch.message}`);
        
        // Revalidate news page if new articles
        if (inserted > 0) {
          revalidatePath('/news');
        }
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
      
      // Check if recap already exists
      if (await recapExists(yesterdayDate)) {
        results.recapGeneration = {
          success: true,
          message: `Recap already exists for ${yesterdayDate}`,
          title: 'Existing',
        };
        console.log(`⚠️ Recap already exists for ${yesterdayDate}, skipping`);
      } else {
        // Get yesterday's articles
        const articles = await getNewsForDate(yesterdayDate);
        console.log(`📰 Found ${articles.length} articles for recap`);

        if (articles.length >= 3) {
          // Prepare headlines
          const headlines = articles.slice(0, 15).map(article => ({
            title: article.title,
            source: article.sourceName,
            summary: article.summary,
          }));

          // Generate recap
          const displayDate = formatDateForDisplay(yesterdayDate);
          const generated = await generateDailyRecap(headlines, displayDate);

          // Save recap
          const recap = await saveRecap({
            date: yesterdayDate,
            title: generated.title,
            slug: generateSlug(yesterdayDate),
            summary: generated.summary,
            content: generated.content,
            highlights: generated.highlights,
            sourcesCount: articles.length,
            generatedAt: new Date(),
            publishedAt: new Date(),
          });

          results.recapGeneration = {
            success: true,
            message: `Generated recap for ${displayDate}`,
            title: recap.title,
          };
          console.log(`✅ Recap generated: "${recap.title}"`);

          // Revalidate pages
          revalidatePath('/news');
          revalidatePath(`/news/recap/${recap.slug}`);
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
    // Return combined results
    // ============================================
    console.log('\n✅ Daily cron job completed');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results,
      },
      { status: 500 }
    );
  }
}

