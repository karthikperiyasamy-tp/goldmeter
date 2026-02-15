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
    const collection = db.collection('analytics_pageviews');
    
    let startDate = new Date();
    
    // Handle special date ranges
    if (range === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Start of today
    } else if (range === 'yesterday') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0); // Start of yesterday
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999); // End of yesterday
      
      // For yesterday, we need to query between start and end of that day
      const totalViews = await collection.countDocuments({
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      const uniqueUsers = await collection.distinct('ip', {
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      const topPages = await collection.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray();
      
      const sources = await collection.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: {
              $cond: [
                { $ne: ['$utmSource', null] },
                '$utmSource',
                {
                  $cond: [
                    { $eq: ['$referrer', null] },
                    'direct',
                    {
                      $cond: [
                        // Check if referrer is from same domain (internal navigation)
                        { $regexMatch: { input: '$referrer', regex: 'goldmeter\\.in' } },
                        'direct', // Treat internal navigation as direct
                        {
                          $cond: [
                            // Google Search (more specific)
                            { $regexMatch: { input: '$referrer', regex: 'google\\.(com|co\\.in|co\\.uk)/search|google\\.(com|co\\.in)/url' } },
                            'google',
                            {
                              $cond: [
                                // Other search engines
                                { $regexMatch: { input: '$referrer', regex: 'bing\\.com|yahoo\\.com|duckduckgo\\.com|baidu\\.com' } },
                                'search',
                                {
                                  $cond: [
                                    // Social media
                                    { $regexMatch: { input: '$referrer', regex: 'facebook|fb\\.com|whatsapp|twitter|t\\.co|instagram|telegram|linkedin|reddit' } },
                                    'social',
                                    'referral'
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();
      
      const topCities = await collection.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate }, city: { $ne: null } } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray();
      
      const hourlyTraffic = await collection.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray();

      const sectionBreakdown = await collection.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $or: [{ $eq: ['$path', '/'] }, { $regexMatch: { input: '$path', regex: '^/gold-rate' } }] }, then: 'Gold Rate' },
                  { case: { $regexMatch: { input: '$path', regex: '^/silver-rate' } }, then: 'Silver Rate' },
                  { case: { $regexMatch: { input: '$path', regex: '^/portfolio' } }, then: 'Portfolio' },
                  { case: { $regexMatch: { input: '$path', regex: '^/articles' } }, then: 'Articles' },
                  { case: { $regexMatch: { input: '$path', regex: '^/news' } }, then: 'News' },
                  { case: { $regexMatch: { input: '$path', regex: '^/calculator' } }, then: 'Calculator' },
                  { case: { $regexMatch: { input: '$path', regex: '^/jewellers' } }, then: 'Jewellers' },
                  { case: { $regexMatch: { input: '$path', regex: '^/gold-comparison' } }, then: 'Compare' },
                ],
                default: 'Other'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();
      
      return {
        totalViews,
        uniqueUsers: uniqueUsers.length,
        topPages,
        sources,
        topCities,
        hourlyTraffic,
        sectionBreakdown,
      };
    } else if (typeof days === 'number') {
      // For fractional days (minutes/hours)
      if (days < 1) {
        const milliseconds = days * 24 * 60 * 60 * 1000;
        startDate = new Date(Date.now() - milliseconds);
      } else {
        startDate.setDate(startDate.getDate() - days);
      }
    } else {
      // Default to 7 days
      startDate.setDate(startDate.getDate() - 7);
    }
    
    // Get total pageviews
    const totalViews = await collection.countDocuments({
      timestamp: { $gte: startDate }
    });
    
    // Get unique IPs (approximate unique users)
    const uniqueUsers = await collection.distinct('ip', {
      timestamp: { $gte: startDate }
    });
    
    // Top pages
    const topPages = await collection.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    // Traffic sources
    const sources = await collection.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $cond: [
              { $ne: ['$utmSource', null] },
              '$utmSource',
              {
                $cond: [
                  { $eq: ['$referrer', null] },
                  'direct',
                  {
                    $cond: [
                      // Check if referrer is from same domain (internal navigation)
                      { $regexMatch: { input: '$referrer', regex: 'goldmeter\\.in' } },
                      'direct', // Treat internal navigation as direct
                      {
                        $cond: [
                          { $regexMatch: { input: '$referrer', regex: 'google' } },
                          'google',
                          {
                            $cond: [
                              { $regexMatch: { input: '$referrer', regex: 'facebook|whatsapp|twitter|instagram|telegram' } },
                              'social',
                              'referral'
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    // Top cities
    const topCities = await collection.aggregate([
      { $match: { timestamp: { $gte: startDate }, city: { $ne: null } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    // Time-based traffic (granularity depends on range)
    let timeFormat = '%Y-%m-%d %H:00'; // Default: hourly
    let timeLabel = 'Hourly';
    
    // For short ranges, show minute-level data
    if (typeof days === 'number' && days < 1) {
      if (days <= 1/24) { // 1 hour or less
        timeFormat = '%Y-%m-%d %H:%M'; // Every minute
        timeLabel = 'Per Minute';
      } else if (days <= 4/24) { // 4 hours or less
        timeFormat = '%Y-%m-%d %H:%M'; // Every minute (might group by 5 min in UI)
        timeLabel = 'Per 5 Minutes';
      } else {
        timeFormat = '%Y-%m-%d %H:00'; // Hourly
        timeLabel = 'Hourly';
      }
    }
    
    const hourlyTraffic = await collection.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: timeFormat, date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Section breakdown - aggregate all pages into sections
    const sectionBreakdown = await collection.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $or: [{ $eq: ['$path', '/'] }, { $regexMatch: { input: '$path', regex: '^/gold-rate' } }] }, then: 'Gold Rate' },
                { case: { $regexMatch: { input: '$path', regex: '^/silver-rate' } }, then: 'Silver Rate' },
                { case: { $regexMatch: { input: '$path', regex: '^/portfolio' } }, then: 'Portfolio' },
                { case: { $regexMatch: { input: '$path', regex: '^/articles' } }, then: 'Articles' },
                { case: { $regexMatch: { input: '$path', regex: '^/news' } }, then: 'News' },
                { case: { $regexMatch: { input: '$path', regex: '^/calculator' } }, then: 'Calculator' },
                { case: { $regexMatch: { input: '$path', regex: '^/jewellers' } }, then: 'Jewellers' },
                { case: { $regexMatch: { input: '$path', regex: '^/gold-comparison' } }, then: 'Compare' },
              ],
              default: 'Other'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    return {
      totalViews,
      uniqueUsers: uniqueUsers.length,
      topPages,
      sources,
      topCities,
      hourlyTraffic,
      sectionBreakdown,
    };
  } catch (error) {
    console.error('❌ [Analytics] Error getting summary:', error);
    return null;
  }
}
