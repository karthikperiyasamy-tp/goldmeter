/**
 * Server-side analytics tracking
 * Stores in MongoDB - can't be blocked by ad blockers
 */

import { NextRequest } from "next/server";
import { getDatabase } from "./mongodb";

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

interface AnalyticsEvent {
  timestamp: Date;
  eventName: string;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  ip: string | null;
  country: string | null;
  city: string | null;
  metadata?: Record<string, unknown>;
}

type BucketItem = { _id: string; count: number };

export interface AnalyticsWindow {
  startDate: Date;
  endDate?: Date;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueUsers: number;
  topPages: BucketItem[];
  sources: BucketItem[];
  topCities: BucketItem[];
  hourlyTraffic: BucketItem[];
  sectionBreakdown: BucketItem[];
  deviceBreakdown: BucketItem[];
  browserBreakdown: BucketItem[];
  topArticles: BucketItem[];
  topRecaps: BucketItem[];
  calculatorBreakdown: BucketItem[];
  bounceRate: number;
  newUsers: number;
  returningUsers: number;
  realtimeUsers: number;
  avgSessionDurationSec: number;
  engagedUsers: number;
  gamesViews: number;
  gamesUniqueUsers: number;
  gamesRealtimeUsers: number;
  gamesShare: number;
  geoRedirectFunnel: {
    homeLandings: number;
    redirectExpected: number;
    redirectApplied: number;
    redirectSkipped: number;
    finalLandingPageviews: number;
  };
}

export interface SectionDetails {
  section: string;
  totalViews: number;
  uniqueUsers: number;
  topPages: BucketItem[];
  sources: BucketItem[];
  topCities: BucketItem[];
}

const LOCALE_PREFIX_PATTERN = "(?:hi/|ta/|te/)?";

function parseDeviceType(ua: string | null): string {
  if (!ua) return "unknown";
  const lower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(lower)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(lower))
    return "mobile";
  if (/bot|crawl|spider|slurp|lighthouse/i.test(lower)) return "bot";
  return "desktop";
}

function parseBrowser(ua: string | null): string {
  if (!ua) return "unknown";
  if (/edg(e|a|ios)?\/\d/i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/chrome\/\d/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/safari\/\d/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox\/\d/i.test(ua)) return "Firefox";
  if (/msie|trident/i.test(ua)) return "IE";
  if (/bot|crawl|spider/i.test(ua)) return "Bot";
  return "Other";
}

function getSourceExpr() {
  return {
    $cond: [
      { $ne: ["$utmSource", null] },
      "$utmSource",
      {
        $cond: [
          { $eq: ["$referrer", null] },
          "direct",
          {
            $cond: [
              { $regexMatch: { input: "$referrer", regex: "goldmeter\\.in" } },
              "direct",
              {
                $cond: [
                  { $regexMatch: { input: "$referrer", regex: "google" } },
                  "google",
                  {
                    $cond: [
                      {
                        $regexMatch: {
                          input: "$referrer",
                          regex: "bing\\.com|yahoo\\.com|duckduckgo\\.com",
                        },
                      },
                      "search",
                      {
                        $cond: [
                          {
                            $regexMatch: {
                              input: "$referrer",
                              regex:
                                "facebook|fb\\.com|whatsapp|twitter|t\\.co|instagram|telegram|linkedin|reddit",
                            },
                          },
                          "social",
                          "referral",
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
}

function getSectionSwitchBranches() {
  return [
    {
      case: {
        $or: [
          { $eq: ["$path", "/"] },
          { $regexMatch: { input: "$path", regex: "^/(hi|ta|te)/?$" } },
          {
            $regexMatch: {
              input: "$path",
              regex: `^/${LOCALE_PREFIX_PATTERN}gold-rate(?:$|/)`,
            },
          },
        ],
      },
      then: "Gold Rate",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}silver-rate(?:$|/)`,
        },
      },
      then: "Silver Rate",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}portfolio(?:$|/)`,
        },
      },
      then: "Portfolio",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}articles(?:$|/)`,
        },
      },
      then: "Articles",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}news(?:$|/)`,
        },
      },
      then: "News",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|wedding-gold-planner|sip-calculator|sip-calculator-with-step-up|swp-calculator-with-inflation|hallmark-guide)(?:$|/)`,
        },
      },
      then: "Calculator",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}community(?:$|/)`,
        },
      },
      then: "Community",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}jewellers(?:$|/)`,
        },
      },
      then: "Jewellers",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}gold-comparison(?:$|/)`,
        },
      },
      then: "Compare",
    },
    {
      case: {
        $regexMatch: {
          input: "$path",
          regex: `^/${LOCALE_PREFIX_PATTERN}games(?:$|/)`,
        },
      },
      then: "Games",
    },
  ];
}

function getSectionPathRegex(section: string): string | null {
  switch (section) {
    case "Gold Rate":
      return "^/(?:$|(?:hi|ta|te)/?$|(?:hi/|ta/|te/)?gold-rate(?:$|/))";
    case "Silver Rate":
      return `^/${LOCALE_PREFIX_PATTERN}silver-rate(?:$|/)`;
    case "Portfolio":
      return `^/${LOCALE_PREFIX_PATTERN}portfolio(?:$|/)`;
    case "Articles":
      return `^/${LOCALE_PREFIX_PATTERN}articles(?:$|/)`;
    case "News":
      return `^/${LOCALE_PREFIX_PATTERN}news(?:$|/)`;
    case "Calculator":
      return `^/${LOCALE_PREFIX_PATTERN}(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|wedding-gold-planner|sip-calculator|sip-calculator-with-step-up|swp-calculator-with-inflation|hallmark-guide)(?:$|/)`;
    case "Community":
      return `^/${LOCALE_PREFIX_PATTERN}community(?:$|/)`;
    case "Jewellers":
      return `^/${LOCALE_PREFIX_PATTERN}jewellers(?:$|/)`;
    case "Compare":
      return `^/${LOCALE_PREFIX_PATTERN}gold-comparison(?:$|/)`;
    case "Games":
      return `^/${LOCALE_PREFIX_PATTERN}games(?:$|/)`;
    default:
      return null;
  }
}

export function getDaysValueFromRange(range: string): number | string {
  const rangeMap: Record<string, number | string> = {
    "5m": 5 / 1440,
    "15m": 15 / 1440,
    "30m": 30 / 1440,
    "1h": 1 / 24,
    "4h": 4 / 24,
    "12h": 12 / 24,
    "24h": 1,
    today: "today",
    yesterday: "yesterday",
    "7d": 7,
    "30d": 30,
  };
  return rangeMap[range] ?? 7;
}

export function getWindowForRange(range: string, now: Date = new Date()): AnalyticsWindow {
  const startDate = new Date(now);
  let endDate: Date | undefined;

  if (range === "today") {
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(now);
  } else if (range === "yesterday") {
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    const days = getDaysValueFromRange(range);
    if (typeof days === "number") {
      if (days < 1) {
        startDate.setTime(now.getTime() - days * 86_400_000);
      } else {
        startDate.setDate(startDate.getDate() - days);
      }
      endDate = new Date(now);
    } else {
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date(now);
    }
  }

  return { startDate, endDate };
}

export function getPreviousWindow(window: AnalyticsWindow): AnalyticsWindow {
  const currentEnd = window.endDate ?? new Date();
  const durationMs = Math.max(currentEnd.getTime() - window.startDate.getTime(), 60_000);
  const prevEnd = new Date(window.startDate.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  return { startDate: prevStart, endDate: prevEnd };
}

function getTimeFormatFromWindow(window: AnalyticsWindow): string {
  const end = window.endDate ?? new Date();
  const days = (end.getTime() - window.startDate.getTime()) / 86_400_000;
  if (days <= 4 / 24) return "%Y-%m-%d %H:%M";
  return "%Y-%m-%d %H:00";
}

function buildMatch(window: AnalyticsWindow) {
  const tsFilter: Record<string, unknown> = window.endDate
    ? { $gte: window.startDate, $lte: window.endDate }
    : { $gte: window.startDate };
  return { timestamp: tsFilter };
}

/**
 * Track page view server-side (can't be blocked)
 */
export async function trackServerPageView(request: NextRequest, path: string) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || null;

    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || request.headers.get("referrer");

    const url = new URL(request.url);
    const utmSource = url.searchParams.get("utm_source");
    const utmMedium = url.searchParams.get("utm_medium");
    const utmCampaign = url.searchParams.get("utm_campaign");

    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

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

    const db = await getDatabase();
    await db.collection("analytics_pageviews").insertOne(event);
  } catch (error) {
    // Fail silently - don't break user experience.
    console.error("❌ [Analytics] Error:", error);
  }
}

/**
 * Track lightweight analytics events (funnel/behavior events)
 */
export async function trackServerAnalyticsEvent(
  request: NextRequest,
  eventName: string,
  path: string,
  metadata?: Record<string, unknown>
) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || null;

    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || request.headers.get("referrer");
    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

    const event: AnalyticsEvent = {
      timestamp: new Date(),
      eventName,
      path,
      referrer,
      userAgent,
      ip,
      country,
      city,
      metadata,
    };

    const db = await getDatabase();
    await db.collection("analytics_events").insertOne(event);
  } catch (error) {
    // Fail silently - analytics events must never break UX.
    console.error("❌ [Analytics Events] Error:", error);
  }
}

/**
 * Get analytics summary for admin dashboard
 */
export async function getAnalyticsSummary(
  days: number | string = 7,
  range?: string,
  windowOverride?: AnalyticsWindow
): Promise<AnalyticsSummary | null> {
  try {
    const db = await getDatabase();
    const col = db.collection("analytics_pageviews");
    const eventsCol = db.collection("analytics_events");

    const computedWindow =
      windowOverride ??
      (range
        ? getWindowForRange(range)
        : typeof days === "number"
          ? { startDate: new Date(Date.now() - days * 86_400_000), endDate: new Date() }
          : getWindowForRange("7d"));

    const timestampFilter = computedWindow.endDate
      ? { $gte: computedWindow.startDate, $lte: computedWindow.endDate }
      : { $gte: computedWindow.startDate };
    const match = { timestamp: timestampFilter };
    const timeFormat = getTimeFormatFromWindow(computedWindow);
    const sourceExpr = getSourceExpr();
    const sectionSwitchBranches = getSectionSwitchBranches();
    const gamesRegex = `^/${LOCALE_PREFIX_PATTERN}games(?:$|/)`;

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
      realtimeIPs,
      engagementData,
      gamesViews,
      gamesUniqueIPs,
      gamesRealtimeIPs,
      geoEvents,
    ] = await Promise.all([
      col.countDocuments(match),
      col.distinct("ip", match),
      col
        .aggregate<BucketItem>([
          { $match: match },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: match },
          { $group: { _id: sourceExpr, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: { ...match, city: { $ne: null } } },
          { $group: { _id: "$city", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: match },
          {
            $group: {
              _id: { $dateToString: { format: timeFormat, date: "$timestamp" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: match },
          {
            $group: {
              _id: { $switch: { branches: sectionSwitchBranches, default: "Other" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: match },
          { $group: { _id: { $ifNull: ["$deviceType", "unknown"] }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: match },
          { $group: { _id: { $ifNull: ["$browser", "unknown"] }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: { ...match, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}articles/` } } },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: { ...match, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}news/recap/` } } },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          {
            $match: {
              ...match,
              path: {
                $regex: `^/${LOCALE_PREFIX_PATTERN}(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|wedding-gold-planner|sip-calculator|sip-calculator-with-step-up|swp-calculator-with-inflation|hallmark-guide)`,
              },
            },
          },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      col
        .aggregate([
          { $match: match },
          { $group: { _id: "$ip", views: { $sum: 1 } } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              bounced: { $sum: { $cond: [{ $eq: ["$views", 1] }, 1, 0] } },
            },
          },
        ])
        .toArray(),
      col
        .distinct("ip", { timestamp: { $gte: new Date(Date.now() - 5 * 60_000) } }),
      col
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: "$ip",
              firstTs: { $min: "$timestamp" },
              lastTs: { $max: "$timestamp" },
              views: { $sum: 1 },
            },
          },
          {
            $project: {
              views: 1,
              durationSec: {
                $min: [
                  1800,
                  {
                    $max: [
                      0,
                      { $divide: [{ $subtract: ["$lastTs", "$firstTs"] }, 1000] },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgSessionDurationSec: { $avg: "$durationSec" },
              engagedUsers: { $sum: { $cond: [{ $gte: ["$views", 2] }, 1, 0] } },
            },
          },
        ])
        .toArray(),
      col.countDocuments({ ...match, path: { $regex: gamesRegex } }),
      col.distinct("ip", { ...match, path: { $regex: gamesRegex } }),
      col.distinct("ip", {
        timestamp: { $gte: new Date(Date.now() - 5 * 60_000) },
        path: { $regex: gamesRegex },
      }),
      eventsCol
        .aggregate<BucketItem>([
          {
            $match: {
              timestamp: timestampFilter,
              eventName: {
                $in: [
                  "home_landing_detected",
                  "geo_redirect_expected",
                  "geo_redirect_applied",
                  "geo_redirect_skipped",
                  "final_landing_pageview",
                ],
              },
            },
          },
          { $group: { _id: "$eventName", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

    const bounce = (bounceData[0] as { total: number; bounced: number } | undefined) ?? {
      total: 0,
      bounced: 0,
    };
    const bounceRate = bounce.total > 0 ? Math.round((bounce.bounced / bounce.total) * 100) : 0;

    // New vs returning should be computed only for users active in the selected window.
    const activeIpList = (uniqueIPs as Array<string | null>).filter(
      (ip): ip is string => typeof ip === "string" && ip.length > 0
    );
    const firstSeenByActive = activeIpList.length
      ? await col
          .aggregate<{ _id: string; firstSeen: Date }>([
            { $match: { ip: { $in: activeIpList } } },
            { $group: { _id: "$ip", firstSeen: { $min: "$timestamp" } } },
          ])
          .toArray()
      : [];
    const nvr = firstSeenByActive.reduce(
      (acc, row) => {
        if (row.firstSeen >= computedWindow.startDate) {
          acc.newUsers += 1;
        } else {
          acc.returning += 1;
        }
        return acc;
      },
      {
        newUsers: 0,
        returning: 0,
      }
    );

    const engagement = (engagementData[0] as { avgSessionDurationSec: number; engagedUsers: number } | undefined) ?? {
      avgSessionDurationSec: 0,
      engagedUsers: 0,
    };
    const geoMap = new Map((geoEvents as BucketItem[]).map((i) => [i._id, i.count]));

    return {
      totalViews,
      uniqueUsers: activeIpList.length,
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
      avgSessionDurationSec: Math.round(engagement.avgSessionDurationSec || 0),
      engagedUsers: engagement.engagedUsers || 0,
      gamesViews,
      gamesUniqueUsers: gamesUniqueIPs.length,
      gamesRealtimeUsers: gamesRealtimeIPs.length,
      gamesShare: totalViews > 0 ? Number(((gamesViews / totalViews) * 100).toFixed(1)) : 0,
      geoRedirectFunnel: {
        homeLandings: geoMap.get("home_landing_detected") || 0,
        redirectExpected: geoMap.get("geo_redirect_expected") || 0,
        redirectApplied: geoMap.get("geo_redirect_applied") || 0,
        redirectSkipped: geoMap.get("geo_redirect_skipped") || 0,
        finalLandingPageviews: geoMap.get("final_landing_pageview") || 0,
      },
    };
  } catch (error) {
    console.error("❌ [Analytics] Error getting summary:", error);
    return null;
  }
}

export async function getSectionDetails(
  days: number | string = 7,
  range?: string,
  section?: string,
  windowOverride?: AnalyticsWindow
): Promise<SectionDetails | null> {
  try {
    if (!section) return null;

    const sectionRegex = getSectionPathRegex(section);
    if (!sectionRegex) return null;

    const db = await getDatabase();
    const col = db.collection("analytics_pageviews");
    const sourceExpr = getSourceExpr();

    const computedWindow =
      windowOverride ??
      (range
        ? getWindowForRange(range)
        : typeof days === "number"
          ? { startDate: new Date(Date.now() - days * 86_400_000), endDate: new Date() }
          : getWindowForRange("7d"));

    const match = buildMatch(computedWindow);
    const sectionMatch = { ...match, path: { $regex: sectionRegex } };

    const [totalViews, uniqueIPs, topPages, sources, topCities] = await Promise.all([
      col.countDocuments(sectionMatch),
      col.distinct("ip", sectionMatch),
      col
        .aggregate<BucketItem>([
          { $match: sectionMatch },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 12 },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: sectionMatch },
          { $group: { _id: sourceExpr, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
      col
        .aggregate<BucketItem>([
          { $match: { ...sectionMatch, city: { $ne: null } } },
          { $group: { _id: "$city", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
    ]);

    return {
      section,
      totalViews,
      uniqueUsers: uniqueIPs.length,
      topPages,
      sources,
      topCities,
    };
  } catch (error) {
    console.error("❌ [Analytics] Error getting section details:", error);
    return null;
  }
}

