import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalGoldRates } from '@/lib/goldRatesDB';

// Cache response for 30 minutes (browser + CDN)
const CACHE_MAX_AGE = 1800;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'India';
  const range = searchParams.get('range') || '7D';

  // Convert range to days
  const days = range === '7D' ? 7 : range === '30D' ? 30 : 365;

  try {
    const data = await getHistoricalGoldRates(city, days);

    // Return with cache headers
    return NextResponse.json(
      {
        success: true,
        city,
        range,
        data,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE * 2}`,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch historical prices' },
      { status: 500 }
    );
  }
}

