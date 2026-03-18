import { NextRequest, NextResponse } from 'next/server';
import {
  getAnalyticsSummary,
  getDaysValueFromRange,
  getSectionDetails,
  getWindowForRange,
  getPreviousWindow,
} from '../../../../lib/server-analytics';
import { getCommunityStats } from '@/lib/community-stats';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '7d';
    const compare = url.searchParams.get('compare') === '1';
    const section = url.searchParams.get('section') || '';
    const days = getDaysValueFromRange(range);
    const currentWindow = getWindowForRange(range);

    const [current, previous, communityStats, sectionDetails] = await Promise.all([
      getAnalyticsSummary(days, range, currentWindow),
      compare ? getAnalyticsSummary(days, range, getPreviousWindow(currentWindow)) : Promise.resolve(null),
      getCommunityStats(),
      section ? getSectionDetails(days, range, section, currentWindow) : Promise.resolve(null),
    ]);

    if (!current) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    const percentDelta = (curr: number, prev: number) => {
      if (!prev && !curr) return 0;
      if (!prev && curr > 0) return 100;
      if (!prev) return 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    const deltas = previous
      ? {
          totalViews: percentDelta(current.totalViews, previous.totalViews),
          uniqueUsers: percentDelta(current.uniqueUsers, previous.uniqueUsers),
          bounceRate: Number((current.bounceRate - previous.bounceRate).toFixed(1)),
          newUsers: percentDelta(current.newUsers, previous.newUsers),
          returningUsers: percentDelta(current.returningUsers, previous.returningUsers),
          gamesViews: percentDelta(current.gamesViews, previous.gamesViews),
          avgSessionDurationSec: percentDelta(
            current.avgSessionDurationSec,
            previous.avgSessionDurationSec
          ),
        }
      : null;

    return NextResponse.json({
      ...current,
      communityStats,
      previous,
      deltas,
      sectionDetails,
      compareEnabled: compare,
      selectedSection: section || null,
    });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
