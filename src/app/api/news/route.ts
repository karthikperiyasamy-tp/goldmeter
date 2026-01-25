import { NextResponse } from 'next/server';
import { getGroupedNews } from '@/lib/newsDB';

// Cache news for 10 minutes - news doesn't change that frequently
export const revalidate = 600;

// GET /api/news - Get news articles grouped by date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '15');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { groups, totalCount, hasMore } = await getGroupedNews(limit, offset);

    return NextResponse.json({
      success: true,
      groups,
      totalCount,
      hasMore,
      limit,
      offset,
    }, {
      headers: {
        // Cache for 10 minutes at edge, serve stale for 20 more minutes while revalidating
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        groups: [],
        totalCount: 0,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}

