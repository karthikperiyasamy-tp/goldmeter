"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side page view tracker
 * Sends page views to API route (which can use MongoDB)
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin/')) return;

    // Skip homepage tracking when a geo-redirect is pending.
    // Without stayOnIndia / geo_redirect_checked / preferredCity the user
    // will be redirected to a city page within milliseconds, which would
    // double-count the visit (once for "/" and once for "/gold-rate/{city}").
    if (pathname === '/') {
      const c = document.cookie;
      const willStay =
        c.includes('stayOnIndia=') ||
        c.includes('geo_redirect_checked=') ||
        c.includes('preferredCity=');
      if (!willStay) return;
    }

    const img = new Image(1, 1);
    img.src = `/api/track?path=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  return null;
}
