import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add tracking headers to pass data to API route
  // (Edge Runtime can't use MongoDB directly)
  const path = request.nextUrl.pathname;
  const isPageView = 
    !path.startsWith('/api/') &&
    !path.startsWith('/_next/') &&
    !path.startsWith('/admin/') &&
    !path.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|map)$/);
  
  if (isPageView) {
    // Set a header to indicate this is a tracked page view
    response.headers.set('x-track-pageview', 'true');
  }
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
