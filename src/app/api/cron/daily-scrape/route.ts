import { NextRequest, NextResponse } from 'next/server';
import { saveGoldRates } from '@/lib/goldRatesDB';

/**
 * Vercel Cron Job endpoint
 * This is triggered automatically by Vercel at scheduled times
 * Vercel automatically adds the Authorization header for cron jobs
 * 
 * Scheduled in vercel.json
 */
export async function GET(request: NextRequest) {
  try {
    console.log('⏰ [Cron] Daily scrape job started');
    
    // Verify this is coming from Vercel Cron
    // Vercel adds this header to cron requests
    const authHeader = request.headers.get('authorization');
    
    if (process.env.NODE_ENV === 'production') {
      // In production, verify it's from Vercel Cron
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
    
    // Get the host for internal API call
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    
    // Call the scraping API
    console.log('🌐 [Cron] Fetching rates from scraping API...');
    const scrapeResponse = await fetch(`${protocol}://${host}/api/scrape-rates`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'GoldRate-Cron/1.0',
      },
    });
    
    if (!scrapeResponse.ok) {
      throw new Error(`Scraping failed with status ${scrapeResponse.status}`);
    }
    
    const scrapedData = await scrapeResponse.json();
    
    if (!scrapedData.success) {
      throw new Error('Scraping returned unsuccessful response');
    }
    
    console.log('✅ [Cron] Scraping successful');
    console.log(`📊 [Cron] India: 22K=₹${scrapedData.data.india.gold22k}, 24K=₹${scrapedData.data.india.gold24k}`);
    
    // Save to MongoDB
    console.log('💾 [Cron] Saving rates to MongoDB...');
    const saveResult = await saveGoldRates(
      scrapedData.data.india,
      scrapedData.data.cities
    );
    
    if (!saveResult.success) {
      throw new Error('Failed to save rates to database');
    }
    
    const successMessage = `Cron job completed: ${saveResult.saved} rates saved, ${saveResult.errors} errors`;
    console.log(`✅ [Cron] ${successMessage}`);
    
    return NextResponse.json({
      success: true,
      message: successMessage,
      scraped: {
        india: scrapedData.data.india,
        citiesCount: Object.keys(scrapedData.data.cities).length,
      },
      saved: saveResult.saved,
      errors: saveResult.errors,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [Cron] Error in daily scrape:', errorMessage);
    
    // Still return 200 to prevent Vercel from retrying
    // (we don't want infinite retry loops for transient errors)
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}

