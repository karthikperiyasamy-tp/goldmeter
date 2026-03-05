import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/server-analytics';
import { getCommunityStats } from '@/lib/community-stats';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '7d';

    const rangeMap: Record<string, number | string> = {
      '5m': 5 / 1440,
      '15m': 15 / 1440,
      '30m': 30 / 1440,
      '1h': 1 / 24,
      '4h': 4 / 24,
      '12h': 12 / 24,
      '24h': 1,
      'today': 'today',
      'yesterday': 'yesterday',
      '7d': 7,
      '30d': 30,
    };

    const days: number | string = rangeMap[range] || 7;

    const [data, communityStats] = await Promise.all([
      getAnalyticsSummary(days, range),
      getCommunityStats(),
    ]);

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...data, communityStats });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
