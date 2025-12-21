import { NextResponse } from 'next/server';
import { getGroupedNews } from '@/lib/newsDB';

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

