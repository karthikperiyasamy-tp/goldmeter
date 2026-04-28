import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { saveGoldRates } from '@/lib/goldRatesDB';
import { performScraping } from '../../scrape-rates/route';
import { saveInternationalRates } from '@/lib/internationalRatesDB';

/**
 * Manual trigger endpoint to scrape rates and save to MongoDB
 * Protected with CRON_SECRET for security
 * 
 * Usage:
 * POST /api/admin/scrape-and-save
 * Headers: { "Authorization": "Bearer YOUR_CRON_SECRET" }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
      console.log('❌ [Admin] Unauthorized access attempt');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔧 [Admin] Manual scrape-and-save triggered');
    
    // Perform scraping directly (no HTTP call)
    console.log('🌐 [Admin] Starting scraping...');
    const scrapedData = await performScraping();
    
    console.log('✅ [Admin] Scraping successful');
    
    // Save to database
    console.log('💾 [Admin] Saving rates to MongoDB...');
    const saveResult = await saveGoldRates(
      scrapedData.india,
      scrapedData.cities
    );

    if (scrapedData.international) {
      console.log('🌍 [Admin] Saving international rates...');
      await saveInternationalRates(scrapedData.international);
    } else {
      console.warn('⚠️  [Admin] No international rates to save');
    }

    // Bust cached latest rates so fresh silver/gold values show up immediately
    try {
      revalidateTag('gold-rates', 'max');
    } catch (e) {
      console.warn('⚠️  [Admin] revalidateTag failed:', e);
    }
    
    if (!saveResult.success) {
      throw new Error('Failed to save rates to database');
    }
    
    console.log(`✅ [Admin] Saved ${saveResult.saved} rates, skipped ${saveResult.skipped} (suspicious ₹10 diff)`);
    
    return NextResponse.json({
      success: true,
      message: 'Rates scraped and saved successfully',
      scraped: {
        india: scrapedData.india,
        citiesCount: Object.keys(scrapedData.cities).length,
      },
      saved: saveResult.saved,
      skipped: saveResult.skipped,
      errors: saveResult.errors,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ [Admin] Error in scrape-and-save:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Allow GET for easy testing in browser (still requires auth)
export async function GET(request: NextRequest) {
  return POST(request);
}

