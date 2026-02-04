/**
 * Google Analytics helper functions
 * Track custom events, conversions, and user interactions
 */

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Track custom events in Google Analytics
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track page views (manual)
 */
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
      page_title: title,
    });
  }
};

/**
 * Track city selection
 */
export const trackCityChange = (cityName: string, source: 'dropdown' | 'auto-detect' | 'url') => {
  trackEvent('city_change', 'navigation', `${cityName} (${source})`);
};

/**
 * Track calculator usage
 */
export const trackCalculatorUse = (
  calculatorName: string,
  action: 'start' | 'calculate' | 'share' | 'print'
) => {
  trackEvent(`calculator_${action}`, 'calculator', calculatorName);
};

/**
 * Track gold rate comparison
 */
export const trackComparison = (compareType: string, cities: string[]) => {
  trackEvent('compare_rates', 'comparison', `${compareType}: ${cities.join(', ')}`);
};

/**
 * Track news article views
 */
export const trackNewsView = (articleTitle: string, category: string) => {
  trackEvent('view_article', 'news', `${category}: ${articleTitle}`);
};

/**
 * Track external link clicks
 */
export const trackOutboundLink = (url: string, linkText: string) => {
  trackEvent('click', 'outbound_link', `${linkText} -> ${url}`);
};

/**
 * Track search queries
 */
export const trackSearch = (searchQuery: string, resultCount: number) => {
  trackEvent('search', 'site_search', searchQuery, resultCount);
};

/**
 * Track user engagement milestones
 */
export const trackEngagement = (milestone: string, detail?: string) => {
  trackEvent('engagement', 'user_interaction', `${milestone}${detail ? `: ${detail}` : ''}`);
};

/**
 * Track errors for debugging
 */
export const trackError = (errorMessage: string, errorSource: string) => {
  trackEvent('error', 'exception', `${errorSource}: ${errorMessage}`);
};
