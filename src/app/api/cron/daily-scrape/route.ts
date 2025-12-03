import { NextRequest, NextResponse } from 'next/server';
import { saveGoldRates } from '@/lib/goldRatesDB';
import { performScraping } from '../../scrape-rates/route';

/**
 * Vercel Cron Job endpoint
 * This is triggered automatically by Vercel every hour between 7 AM and 7 PM IST
 * Vercel automatically adds the Authorization header for cron jobs
 * 
 * Schedule: 30 1-13 * * * (7 AM to 7 PM IST)
 * Configured in vercel.json
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
    
    // Perform scraping directly (no HTTP call)
    console.log('🌐 [Cron] Starting scraping...');
    const scrapedData = await performScraping();
    
    console.log('✅ [Cron] Scraping successful');
    console.log(`📊 [Cron] India: 22K=₹${scrapedData.india.gold22k}, 24K=₹${scrapedData.india.gold24k}`);
    
    // Save to MongoDB
    console.log('💾 [Cron] Saving rates to MongoDB...');
    const saveResult = await saveGoldRates(
      scrapedData.india,
      scrapedData.cities
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
        india: scrapedData.india,
        citiesCount: Object.keys(scrapedData.cities).length,
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

