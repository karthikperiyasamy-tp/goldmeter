import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { saveGoldRates } from '@/lib/goldRatesDB';
import { performScraping } from '../../scrape-rates/route';
import { saveInternationalRates } from '@/lib/internationalRatesDB';

/**
 * Vercel Cron Job endpoint
 * This is triggered automatically by Vercel once a day at 10:00 AM IST
 * Vercel automatically adds the Authorization header for cron jobs
 * 
 * Schedule: 30 4 * * * (10:00 AM IST)
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
    if (scrapedData.international) {
      console.log('🌍 [Cron] Saving international rates...');
      await saveInternationalRates(scrapedData.international);
    } else {
      console.warn('⚠️  [Cron] No international rates to save');
    }
    
    if (!saveResult.success) {
      throw new Error('Failed to save rates to database');
    }
    
    const successMessage = `Cron job completed: ${saveResult.saved} rates saved, ${saveResult.changed} changed, ${saveResult.skipped} skipped (suspicious ₹10 diff), ${saveResult.errors} errors`;
    console.log(`✅ [Cron] ${successMessage}`);
    
    // Only bust the cache when at least one rate value actually changed. Purging
    // when nothing changed would needlessly regenerate ~250 ISR pages (ISR Writes +
    // Fast Origin Transfer) for identical output.
    if (saveResult.changed > 0) {
      try {
        revalidateTag('gold-rates', { expire: 0 });
        console.log(`✅ [Cron] Busted gold-rates cache tag (${saveResult.changed} changed)`);
      } catch (e) {
        console.warn('⚠️  [Cron] revalidateTag failed:', e);
      }
    } else {
      console.log('⏭️  [Cron] No rate changes — skipping cache revalidation to save cost');
    }
    
    return NextResponse.json({
      success: true,
      message: successMessage,
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

