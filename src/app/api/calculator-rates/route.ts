import { NextResponse } from 'next/server';
import { getLatestGoldRates } from '@/lib/goldRatesDB';

/**
 * API endpoint to fetch all city rates for the calculator
 * Returns simplified data for dropdown usage
 */
export async function GET() {
  try {
    console.log('📊 [Calculator-Rates] Fetching rates...');
    
    // Try database first
    const dbData = await getLatestGoldRates();
    
    if (dbData.india && Object.keys(dbData.cities).length > 0) {
      console.log(`✅ [Calculator-Rates] Found ${Object.keys(dbData.cities).length} cities in DB`);
      
      // Format data for calculator
      const rates = Object.entries(dbData.cities).map(([name, rates]) => ({
        name,
        gold22k: rates.gold22k,
        gold24k: rates.gold24k,
      }));
      
      // Add India rate at the beginning
      rates.unshift({
        name: 'India',
        gold22k: dbData.india.gold22k,
        gold24k: dbData.india.gold24k,
      });
      
      return NextResponse.json({
        success: true,
        rates,
        source: 'database',
      });
    }
    
    // Fallback to default rates if DB is empty
    console.log('⚠️  [Calculator-Rates] No DB data, using fallback rates');
    return NextResponse.json({
      success: true,
      rates: [
        { name: "India", gold22k: 59200, gold24k: 64500 },
        { name: "Chennai", gold22k: 59680, gold24k: 64890 },
        { name: "Mumbai", gold22k: 59410, gold24k: 64600 },
        { name: "Bangalore", gold22k: 59720, gold24k: 64980 },
        { name: "Delhi", gold22k: 59540, gold24k: 64720 },
        { name: "Hyderabad", gold22k: 59390, gold24k: 64580 },
        { name: "Coimbatore", gold22k: 59610, gold24k: 64810 },
        { name: "Pune", gold22k: 59450, gold24k: 64650 },
        { name: "Kolkata", gold22k: 59680, gold24k: 64890 },
        { name: "Ahmedabad", gold22k: 59520, gold24k: 64700 },
        { name: "Vijayawada", gold22k: 59620, gold24k: 64820 },
      ],
      source: 'fallback',
    });
    
  } catch (error) {
    console.error('❌ [Calculator-Rates] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

