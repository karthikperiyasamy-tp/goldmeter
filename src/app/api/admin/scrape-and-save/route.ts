import { NextRequest, NextResponse } from 'next/server';
import { saveGoldRates } from '@/lib/goldRatesDB';

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
    
    // Get the host for internal API call
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    
    // Call the scraping API
    console.log('🌐 [Admin] Calling scrape-rates API...');
    const scrapeResponse = await fetch(`${protocol}://${host}/api/scrape-rates`, {
      cache: 'no-store',
    });
    
    if (!scrapeResponse.ok) {
      throw new Error(`Scraping failed with status ${scrapeResponse.status}`);
    }
    
    const scrapedData = await scrapeResponse.json();
    
    if (!scrapedData.success) {
      throw new Error('Scraping returned unsuccessful response');
    }
    
    console.log('✅ [Admin] Scraping successful');
    
    // Save to database
    console.log('💾 [Admin] Saving rates to MongoDB...');
    const saveResult = await saveGoldRates(
      scrapedData.data.india,
      scrapedData.data.cities
    );
    
    if (!saveResult.success) {
      throw new Error('Failed to save rates to database');
    }
    
    console.log(`✅ [Admin] Saved ${saveResult.saved} rates to database`);
    
    return NextResponse.json({
      success: true,
      message: 'Rates scraped and saved successfully',
      scraped: {
        india: scrapedData.data.india,
        citiesCount: Object.keys(scrapedData.data.cities).length,
      },
      saved: saveResult.saved,
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

