import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/server-analytics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '7d';
    
    // Convert range to hours/days
    const rangeMap: Record<string, number | string> = {
      '5m': 5 / 1440,      // 5 minutes in days
      '15m': 15 / 1440,    // 15 minutes
      '30m': 30 / 1440,    // 30 minutes
      '1h': 1 / 24,        // 1 hour
      '4h': 4 / 24,        // 4 hours
      '12h': 12 / 24,      // 12 hours
      '24h': 1,            // 24 hours = 1 day
      'today': 'today',    // Special handling
      'yesterday': 'yesterday',  // Special handling
      '7d': 7,
      '30d': 30,
    };
    
    const days: number | string = rangeMap[range] || 7;
    const data = await getAnalyticsSummary(days, range);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
