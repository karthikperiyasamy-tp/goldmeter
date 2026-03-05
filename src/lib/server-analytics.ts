/**
 * Server-side analytics tracking
 * Stores in MongoDB - can't be blocked by ad blockers
 */

import { NextRequest } from 'next/server';
import { getDatabase } from './mongodb';

interface PageViewEvent {
  timestamp: Date;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  ip: string | null;
  country: string | null;
  city: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  deviceType: string;
  browser: string;
}

function parseDeviceType(ua: string | null): string {
  if (!ua) return 'unknown';
  const lower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(lower)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(lower)) return 'mobile';
  if (/bot|crawl|spider|slurp|lighthouse/i.test(lower)) return 'bot';
  return 'desktop';
}

function parseBrowser(ua: string | null): string {
  if (!ua) return 'unknown';
  if (/edg(e|a|ios)?\/\d/i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/chrome\/\d/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
  if (/safari\/\d/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/firefox\/\d/i.test(ua)) return 'Firefox';
  if (/msie|trident/i.test(ua)) return 'IE';
  if (/bot|crawl|spider/i.test(ua)) return 'Bot';
  return 'Other';
}

/**
 * Track page view server-side (can't be blocked)
 */
export async function trackServerPageView(request: NextRequest, path: string) {
  try {
    // Extract metadata
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || null;
    
    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || request.headers.get("referrer");
    
    // Extract UTM parameters from URL
    const url = new URL(request.url);
    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');
    
    // Get geo data from Vercel headers (free)
    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;
    
    const event: PageViewEvent = {
      timestamp: new Date(),
      path,
      referrer,
      userAgent,
      ip,
      country,
      city,
      utmSource,
      utmMedium,
      utmCampaign,
      deviceType: parseDeviceType(userAgent),
      browser: parseBrowser(userAgent),
    };
    
    // Store in MongoDB
    const db = await getDatabase();
    await db.collection('analytics_pageviews').insertOne(event);
    
    console.log(`📊 [Analytics] Tracked: ${path} from ${ip || 'unknown'}`);
  } catch (error) {
    // Fail silently - don't break the page
    console.error('❌ [Analytics] Error:', error);
  }
}

/**
 * Get analytics summary for admin dashboard
 */
export async function getAnalyticsSummary(days: number | string = 7, range?: string) {
  try {
    const db = await getDatabase();
    const col = db.collection('analytics_pageviews');

    // --- resolve date window ---
    let startDate = new Date();
    let endDate: Date | undefined;

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (typeof days === 'number') {
      if (days < 1) {
        startDate = new Date(Date.now() - days * 86_400_000);
      } else {
        startDate.setDate(startDate.getDate() - days);
      }
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    const tsFilter: Record<string, unknown> = endDate
      ? { $gte: startDate, $lte: endDate }
      : { $gte: startDate };
    const match = { timestamp: tsFilter };

    // --- time format for hourly chart ---
    let timeFormat = '%Y-%m-%d %H:00';
    if (typeof days === 'number' && days < 1) {
      timeFormat = days <= 4 / 24 ? '%Y-%m-%d %H:%M' : '%Y-%m-%d %H:00';
    }

    // --- source classification expression (reused) ---
    const sourceExpr = {
      $cond: [
        { $ne: ['$utmSource', null] },
        '$utmSource',
        {
          $cond: [
            { $eq: ['$referrer', null] },
            'direct',
            {
              $cond: [
                { $regexMatch: { input: '$referrer', regex: 'goldmeter\\.in' } },
                'direct',
                {
                  $cond: [
                    { $regexMatch: { input: '$referrer', regex: 'google' } },
                    'google',
                    {
                      $cond: [
                        { $regexMatch: { input: '$referrer', regex: 'bing\\.com|yahoo\\.com|duckduckgo\\.com' } },
                        'search',
                        {
                          $cond: [
                            { $regexMatch: { input: '$referrer', regex: 'facebook|fb\\.com|whatsapp|twitter|t\\.co|instagram|telegram|linkedin|reddit' } },
                            'social',
                            'referral',
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const sectionSwitchBranches = [
      { case: { $or: [{ $eq: ['$path', '/'] }, { $regexMatch: { input: '$path', regex: '^/gold-rate' } }] }, then: 'Gold Rate' },
      { case: { $regexMatch: { input: '$path', regex: '^/silver-rate' } }, then: 'Silver Rate' },
      { case: { $regexMatch: { input: '$path', regex: '^/portfolio' } }, then: 'Portfolio' },
      { case: { $regexMatch: { input: '$path', regex: '^/articles' } }, then: 'Articles' },
      { case: { $regexMatch: { input: '$path', regex: '^/news' } }, then: 'News' },
      { case: { $regexMatch: { input: '$path', regex: '^/calculator|^/wastage-calculator|^/purity-converter|^/investment-calculator|^/gold-loan-calculator' } }, then: 'Calculator' },
      { case: { $regexMatch: { input: '$path', regex: '^/community' } }, then: 'Community' },
      { case: { $regexMatch: { input: '$path', regex: '^/jewellers' } }, then: 'Jewellers' },
      { case: { $regexMatch: { input: '$path', regex: '^/gold-comparison' } }, then: 'Compare' },
    ];

    // --- run all queries in parallel ---
    const [
      totalViews,
      uniqueIPs,
      topPages,
      sources,
      topCities,
      hourlyTraffic,
      sectionBreakdown,
      deviceBreakdown,
      browserBreakdown,
      topArticles,
      topRecaps,
      calculatorBreakdown,
      bounceData,
      newVsReturningData,
      realtimeIPs,
    ] = await Promise.all([
      // 1 total views
      col.countDocuments(match),
      // 2 unique IPs
      col.distinct('ip', match),
      // 3 top pages
      col.aggregate([
        { $match: match },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]).toArray(),
      // 4 sources
      col.aggregate([
        { $match: match },
        { $group: { _id: sourceExpr, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      // 5 top cities
      col.aggregate([
        { $match: { ...match, city: { $ne: null } } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),
      // 6 hourly traffic
      col.aggregate([
        { $match: match },
        { $group: { _id: { $dateToString: { format: timeFormat, date: '$timestamp' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]).toArray(),
      // 7 section breakdown
      col.aggregate([
        { $match: match },
        { $group: { _id: { $switch: { branches: sectionSwitchBranches, default: 'Other' } }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      // 8 device breakdown (new)
      col.aggregate([
        { $match: match },
        { $group: { _id: { $ifNull: ['$deviceType', 'unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      // 9 browser breakdown (new)
      col.aggregate([
        { $match: match },
        { $group: { _id: { $ifNull: ['$browser', 'unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      // 10 top articles (new)
      col.aggregate([
        { $match: { ...match, path: { $regex: '^/articles/' } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),
      // 11 top recaps (new)
      col.aggregate([
        { $match: { ...match, path: { $regex: '^/news/recap/' } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),
      // 12 calculator breakdown (new)
      col.aggregate([
        { $match: { ...match, path: { $regex: '^/(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|swp-calculator|sip-calculator)' } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      // 13 bounce rate: IPs with exactly 1 page view
      col.aggregate([
        { $match: match },
        { $group: { _id: '$ip', views: { $sum: 1 } } },
        { $group: { _id: null, total: { $sum: 1 }, bounced: { $sum: { $cond: [{ $eq: ['$views', 1] }, 1, 0] } } } },
      ]).toArray(),
      // 14 new vs returning: IPs whose first-ever visit is within this period
      col.aggregate([
        { $group: { _id: '$ip', firstSeen: { $min: '$timestamp' } } },
        {
          $group: {
            _id: null,
            newUsers: { $sum: { $cond: [{ $gte: ['$firstSeen', startDate] }, 1, 0] } },
            returning: { $sum: { $cond: [{ $lt: ['$firstSeen', startDate] }, 1, 0] } },
          },
        },
      ]).toArray(),
      // 15 realtime (always last 5 min regardless of selected range)
      col.distinct('ip', { timestamp: { $gte: new Date(Date.now() - 5 * 60_000) } }),
    ]);

    const bounce = bounceData[0] || { total: 0, bounced: 0 };
    const bounceRate = bounce.total > 0 ? Math.round((bounce.bounced / bounce.total) * 100) : 0;
    const nvr = newVsReturningData[0] || { newUsers: 0, returning: 0 };

    return {
      totalViews,
      uniqueUsers: uniqueIPs.length,
      topPages,
      sources,
      topCities,
      hourlyTraffic,
      sectionBreakdown,
      deviceBreakdown,
      browserBreakdown,
      topArticles,
      topRecaps,
      calculatorBreakdown,
      bounceRate,
      newUsers: nvr.newUsers,
      returningUsers: nvr.returning,
      realtimeUsers: realtimeIPs.length,
    };
  } catch (error) {
    console.error('❌ [Analytics] Error getting summary:', error);
    return null;
  }
}
