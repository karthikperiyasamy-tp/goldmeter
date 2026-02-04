import { NextRequest, NextResponse } from 'next/server';
import { trackServerPageView } from '@/lib/server-analytics';

// API routes run in Node.js runtime (not Edge), so MongoDB works here
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;
    
    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 });
    }
    
    // Track the page view
    await trackServerPageView(request, path);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Track API] Error:', error);
    // Return success even on error - don't break user experience
    return NextResponse.json({ success: true });
  }
}

// Also support GET for simple tracking via img pixel
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';
    
    // Track the page view
    await trackServerPageView(request, path);
    
    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[Track API] Error:', error);
    // Return pixel even on error
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    return new NextResponse(pixel, {
      status: 200,
      headers: { 'Content-Type': 'image/gif' },
    });
  }
}
