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
    // Skip tracking for admin pages
    if (pathname.startsWith('/admin/')) {
      return;
    }

    // Track via simple img pixel (works even with JS blockers)
    const img = new Image(1, 1);
    img.src = `/api/track?path=${encodeURIComponent(pathname)}`;
    
    // Alternatively, could use fetch (but img is more lightweight)
    // fetch('/api/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ path: pathname }),
    // }).catch(() => {}); // Silent fail

  }, [pathname]);

  return null; // This component renders nothing
}
