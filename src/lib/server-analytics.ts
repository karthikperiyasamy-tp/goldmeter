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
  section: string;
  pageType: string;
  locale: string;
  citySlug: string | null;
  calculatorType: string | null;
  referrerSource: string;
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
  section?: string;
  subSection?: string | null;
  pageType?: string | null;
  locale?: string;
  citySlug?: string | null;
  calculatorType?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  referrerSource?: string;
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
  marketPulseViews: number;
  marketPulseUniqueUsers: number;
  marketPulseRealtimeUsers: number;
  marketPulseShare: number;
  geoRedirectFunnel: {
    homeLandings: number;
    redirectExpected: number;
    redirectApplied: number;
    redirectSkipped: number;
    finalLandingPageviews: number;
  };
  sectionPerformance: SectionPerformanceItem[];
  calculatorInsights: CalculatorInsightItem[];
  jewellerInsights: JewellerInsightItem[];
  goldRateCityInsights: GoldRateCityInsightItem[];
  goldRateLocaleInsights: GoldRateLocaleInsightItem[];
  funnels: {
    calculators: SectionFunnel;
    jewellers: SectionFunnel;
    goldRateCities: SectionFunnel;
  };
}

export interface SectionFunnel {
  views: number;
  interactions: number;
  cta: number;
  conversions: number;
}

export interface AnalyticsFilters {
  locale?: string;
  device?: string;
  source?: string;
  city?: string;
  section?: string;
}

export interface SectionDetails {
  section: string;
  totalViews: number;
  uniqueUsers: number;
  topPages: BucketItem[];
  sources: BucketItem[];
  topCities: BucketItem[];
}

export interface SectionPerformanceItem {
  section: string;
  totalViews: number;
  uniqueUsers: number;
  avgEngagementSec: number;
  medianEngagementSec: number;
  bounceRate: number;
  ctaClicks: number;
  topPage: string;
  leastPage: string;
}

export interface CalculatorInsightItem {
  calculator: string;
  views: number;
  uniqueUsers: number;
  avgEngagementSec: number;
  medianEngagementSec: number;
  interactions: number;
  completionRate: number;
}

export interface JewellerInsightItem {
  page: string;
  views: number;
  uniqueUsers: number;
  avgEngagementSec: number;
  ctaClicks: number;
}

export interface GoldRateCityInsightItem {
  city: string;
  views: number;
  uniqueUsers: number;
  avgEngagementSec: number;
  medianEngagementSec: number;
}

export interface GoldRateLocaleInsightItem {
  locale: string;
  views: number;
  uniqueUsers: number;
  avgEngagementSec: number;
}

const LOCALE_PREFIX_PATTERN = "(?:hi/|ta/|te/)?";

const CALCULATOR_SLUGS = [
  "calculator",
  "wastage-calculator",
  "purity-converter",
  "investment-calculator",
  "gold-loan-calculator",
  "wedding-gold-planner",
  "sip-calculator",
  "sip-calculator-with-step-up",
  "swp-calculator-with-inflation",
  "hallmark-guide",
] as const;

function getLocaleFromPath(path: string): string {
  const m = path.match(/^\/(hi|ta|te)(?:\/|$)/);
  return m?.[1] ?? "en";
}

function stripLocalePrefix(path: string): string {
  return path.replace(/^\/(hi|ta|te)(?=\/|$)/, "") || "/";
}

function getSourceFromReferrer(referrer: string | null): string {
  if (!referrer) return "direct";
  if (/goldmeter\.in/i.test(referrer)) return "direct";
  if (/google/i.test(referrer)) return "google";
  if (/bing\.com|yahoo\.com|duckduckgo\.com/i.test(referrer)) return "search";
  if (/facebook|fb\.com|whatsapp|twitter|t\.co|instagram|telegram|linkedin|reddit/i.test(referrer)) return "social";
  return "referral";
}

function getCalculatorType(path: string): string | null {
  const normalized = stripLocalePrefix(path);
  const slug = normalized.split("/").filter(Boolean)[0] || "";
  return CALCULATOR_SLUGS.includes(slug as (typeof CALCULATOR_SLUGS)[number]) ? slug : null;
}

function getPathSection(path: string): string {
  const normalized = stripLocalePrefix(path);
  if (normalized === "/" || normalized.startsWith("/gold-rate") || normalized.startsWith("/gold-rate-today")) return "Gold Rate";
  if (normalized.startsWith("/silver-rate")) return "Silver Rate";
  if (normalized.startsWith("/gold-market-pulse")) return "Market Pulse";
  if (normalized.startsWith("/portfolio")) return "Portfolio";
  if (normalized.startsWith("/articles")) return "Articles";
  if (normalized.startsWith("/news")) return "News";
  if (normalized.startsWith("/community")) return "Community";
  if (normalized.startsWith("/jewellers")) return "Jewellers";
  if (normalized.startsWith("/gold-comparison")) return "Compare";
  if (normalized.startsWith("/games")) return "Games";
  if (getCalculatorType(path)) return "Calculator";
  return "Other";
}

function getPageType(path: string): string {
  const normalized = stripLocalePrefix(path);
  if (/^\/gold-rate\/[^/]+$/.test(normalized)) return "gold_rate_city";
  if (/^\/silver-rate\/[^/]+$/.test(normalized)) return "silver_rate_city";
  if (normalized.startsWith("/gold-rate")) return "gold_rate";
  if (normalized.startsWith("/silver-rate")) return "silver_rate";
  if (normalized.startsWith("/jewellers/")) return "jeweller_detail";
  if (normalized.startsWith("/jewellers")) return "jeweller_list";
  if (normalized.startsWith("/articles/")) return "article_detail";
  if (normalized.startsWith("/articles")) return "article_list";
  if (normalized.startsWith("/news/recap/")) return "recap_detail";
  if (normalized.startsWith("/news/")) return "news_detail";
  if (normalized.startsWith("/news")) return "news_list";
  return "general";
}

function getCitySlug(path: string): string | null {
  const normalized = stripLocalePrefix(path);
  const goldMatch = normalized.match(/^\/gold-rate\/([^/]+)$/);
  if (goldMatch?.[1]) return goldMatch[1].toLowerCase();
  const silverMatch = normalized.match(/^\/silver-rate\/([^/]+)$/);
  if (silverMatch?.[1]) return silverMatch[1].toLowerCase();
  return null;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

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
              regex: `^/${LOCALE_PREFIX_PATTERN}gold-rate(-today)?(?:$|/)`,
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
          regex: `^/${LOCALE_PREFIX_PATTERN}gold-market-pulse(?:$|/)`,
        },
      },
      then: "Market Pulse",
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
      return "^/(?:$|(?:hi|ta|te)/?$|(?:hi/|ta/|te/)?gold-rate(-today)?(?:$|/))";
    case "Silver Rate":
      return `^/${LOCALE_PREFIX_PATTERN}silver-rate(?:$|/)`;
    case "Market Pulse":
      return `^/${LOCALE_PREFIX_PATTERN}gold-market-pulse(?:$|/)`;
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

function buildMatch(
  window: AnalyticsWindow,
  filters?: AnalyticsFilters,
  target: "pageviews" | "events" = "pageviews"
) {
  const tsFilter: Record<string, unknown> = window.endDate
    ? { $gte: window.startDate, $lte: window.endDate }
    : { $gte: window.startDate };
  const match: Record<string, unknown> = { timestamp: tsFilter };
  if (!filters) return match;

  if (filters.locale) match.locale = filters.locale;
  if (filters.device && target === "pageviews") match.deviceType = filters.device;
  if (filters.source) match.referrerSource = filters.source;
  if (filters.city) {
    match.$or = [
      { citySlug: filters.city },
      { path: { $regex: `^/(?:hi/|ta/|te/)?(?:gold-rate|silver-rate)/${filters.city}(?:$|/)` } },
    ];
  }
  if (filters.section) {
    if (target === "events") {
      match.section = filters.section;
    } else {
      const sectionRegex = getSectionPathRegex(filters.section);
      if (sectionRegex) {
        match.path = { $regex: sectionRegex };
      }
    }
  }

  return match;
}

async function getDetailedInsights(
  window: AnalyticsWindow,
  pageviewsCol: any,
  eventsCol: any,
  filters?: AnalyticsFilters
): Promise<{
  sectionPerformance: SectionPerformanceItem[];
  calculatorInsights: CalculatorInsightItem[];
  jewellerInsights: JewellerInsightItem[];
  goldRateCityInsights: GoldRateCityInsightItem[];
  goldRateLocaleInsights: GoldRateLocaleInsightItem[];
  funnels: {
    calculators: SectionFunnel;
    jewellers: SectionFunnel;
    goldRateCities: SectionFunnel;
  };
}> {
  const match = buildMatch(window, filters, "pageviews");
  const eventMatch = buildMatch(window, filters, "events");

  const [sectionViewsRaw, sectionUniqueRaw, sectionBounceRaw, sectionPageRaw, sectionCtaRaw, heartbeatRaw, calculatorViewRaw, calculatorUniqueRaw, calculatorEventRaw, calculatorHeartbeatRaw, jewellerPageRaw, jewellerUniqueRaw, jewellerCtaRaw, jewellerHeartbeatRaw, goldCityViewsRaw, goldCityUniqueRaw, goldLocaleViewsRaw, goldLocaleUniqueRaw, goldHeartbeatRaw, calcInteractionsCountRaw, calcCtaCountRaw, calcConversionsCountRaw, jewellerInteractionsCountRaw, jewellerCtaCountRaw, jewellerConversionsCountRaw, goldInteractionsCountRaw, goldCtaCountRaw, goldConversionsCountRaw] = await Promise.all([
    pageviewsCol
      .aggregate([
        { $match: match },
        { $project: { path: 1 } },
        {
          $addFields: {
            section: {
              $switch: {
                branches: getSectionSwitchBranches(),
                default: "Other",
              },
            },
          },
        },
        { $group: { _id: "$section", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, ip: { $ne: null } } },
        {
          $addFields: {
            section: {
              $switch: {
                branches: getSectionSwitchBranches(),
                default: "Other",
              },
            },
          },
        },
        { $group: { _id: { section: "$section", ip: "$ip" } } },
        { $group: { _id: "$_id.section", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, ip: { $ne: null } } },
        {
          $addFields: {
            section: {
              $switch: {
                branches: getSectionSwitchBranches(),
                default: "Other",
              },
            },
          },
        },
        { $group: { _id: { section: "$section", ip: "$ip" }, views: { $sum: 1 } } },
        {
          $group: {
            _id: "$_id.section",
            total: { $sum: 1 },
            bounced: { $sum: { $cond: [{ $eq: ["$views", 1] }, 1, 0] } },
          },
        },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: match },
        {
          $addFields: {
            section: {
              $switch: {
                branches: getSectionSwitchBranches(),
                default: "Other",
              },
            },
          },
        },
        { $group: { _id: { section: "$section", path: "$path" }, count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, eventName: { $in: ["cta_click", "outbound_click", "jeweller_profile_click", "calculator_complete"] } } },
        { $group: { _id: { $ifNull: ["$section", "Other"] }, count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, eventName: "engagement_heartbeat", sessionId: { $ne: null } } },
        { $group: { _id: { section: { $ifNull: ["$section", "Other"] }, sessionId: "$sessionId" }, beats: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        {
          $match: {
            ...match,
            path: {
              $regex: `^/${LOCALE_PREFIX_PATTERN}(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|wedding-gold-planner|sip-calculator|sip-calculator-with-step-up|swp-calculator-with-inflation|hallmark-guide)(?:$|/)`,
            },
          },
        },
        {
          $project: {
            calc: {
              $replaceOne: {
                input: {
                  $replaceOne: {
                    input: {
                      $replaceOne: {
                        input: "$path",
                        find: "/hi/",
                        replacement: "/",
                      },
                    },
                    find: "/ta/",
                    replacement: "/",
                  },
                },
                find: "/te/",
                replacement: "/",
              },
            },
          },
        },
        { $project: { calc: { $arrayElemAt: [{ $split: ["$calc", "/"] }, 1] } } },
        { $group: { _id: "$calc", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        {
          $match: {
            ...match,
            ip: { $ne: null },
            path: {
              $regex: `^/${LOCALE_PREFIX_PATTERN}(calculator|wastage-calculator|purity-converter|investment-calculator|gold-loan-calculator|wedding-gold-planner|sip-calculator|sip-calculator-with-step-up|swp-calculator-with-inflation|hallmark-guide)(?:$|/)`,
            },
          },
        },
        {
          $project: {
            ip: 1,
            calc: {
              $replaceOne: {
                input: {
                  $replaceOne: {
                    input: {
                      $replaceOne: {
                        input: "$path",
                        find: "/hi/",
                        replacement: "/",
                      },
                    },
                    find: "/ta/",
                    replacement: "/",
                  },
                },
                find: "/te/",
                replacement: "/",
              },
            },
          },
        },
        { $project: { ip: 1, calc: { $arrayElemAt: [{ $split: ["$calc", "/"] }, 1] } } },
        { $group: { _id: { calc: "$calc", ip: "$ip" } } },
        { $group: { _id: "$_id.calc", count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, calculatorType: { $ne: null }, eventName: { $in: ["tool_interaction", "calculator_complete"] }, sessionId: { $ne: null } } },
        { $group: { _id: { calculatorType: "$calculatorType", eventName: "$eventName", sessionId: "$sessionId" } } },
        { $group: { _id: { calculatorType: "$_id.calculatorType", eventName: "$_id.eventName" }, count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, eventName: "engagement_heartbeat", calculatorType: { $ne: null }, sessionId: { $ne: null } } },
        { $group: { _id: { calculatorType: "$calculatorType", sessionId: "$sessionId" }, beats: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}jewellers/[^/]+$` } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, ip: { $ne: null }, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}jewellers/[^/]+$` } } },
        { $group: { _id: { path: "$path", ip: "$ip" } } },
        { $group: { _id: "$_id.path", count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, section: "Jewellers", eventName: { $in: ["outbound_click", "jeweller_profile_click", "cta_click"] } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, eventName: "engagement_heartbeat", section: "Jewellers", sessionId: { $ne: null } } },
        { $group: { _id: { page: "$path", sessionId: "$sessionId" }, beats: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}gold-rate/[^/]+$` } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, ip: { $ne: null }, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}gold-rate/[^/]+$` } } },
        { $group: { _id: { path: "$path", ip: "$ip" } } },
        { $group: { _id: "$_id.path", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}gold-rate/[^/]+$` } } },
        {
          $project: {
            locale: {
              $switch: {
                branches: [
                  { case: { $regexMatch: { input: "$path", regex: "^/hi/" } }, then: "hi" },
                  { case: { $regexMatch: { input: "$path", regex: "^/ta/" } }, then: "ta" },
                  { case: { $regexMatch: { input: "$path", regex: "^/te/" } }, then: "te" },
                ],
                default: "en",
              },
            },
          },
        },
        { $group: { _id: "$locale", count: { $sum: 1 } } },
      ])
      .toArray(),
    pageviewsCol
      .aggregate([
        { $match: { ...match, ip: { $ne: null }, path: { $regex: `^/${LOCALE_PREFIX_PATTERN}gold-rate/[^/]+$` } } },
        {
          $project: {
            ip: 1,
            locale: {
              $switch: {
                branches: [
                  { case: { $regexMatch: { input: "$path", regex: "^/hi/" } }, then: "hi" },
                  { case: { $regexMatch: { input: "$path", regex: "^/ta/" } }, then: "ta" },
                  { case: { $regexMatch: { input: "$path", regex: "^/te/" } }, then: "te" },
                ],
                default: "en",
              },
            },
          },
        },
        { $group: { _id: { locale: "$locale", ip: "$ip" } } },
        { $group: { _id: "$_id.locale", count: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol
      .aggregate([
        { $match: { ...eventMatch, eventName: "engagement_heartbeat", section: "Gold Rate", citySlug: { $ne: null }, sessionId: { $ne: null } } },
        { $group: { _id: { citySlug: "$citySlug", locale: { $ifNull: ["$locale", "en"] }, sessionId: "$sessionId" }, beats: { $sum: 1 } } },
      ])
      .toArray(),
    eventsCol.countDocuments({ ...eventMatch, eventName: "tool_interaction", calculatorType: { $ne: null } }),
    eventsCol.countDocuments({ ...eventMatch, section: "Calculator", eventName: { $in: ["cta_click", "outbound_click"] } }),
    eventsCol.countDocuments({ ...eventMatch, eventName: "calculator_complete", calculatorType: { $ne: null } }),
    eventsCol.countDocuments({ ...eventMatch, section: "Jewellers", eventName: "jeweller_profile_click" }),
    eventsCol.countDocuments({ ...eventMatch, section: "Jewellers", eventName: { $in: ["cta_click", "outbound_click"] } }),
    eventsCol.countDocuments({ ...eventMatch, section: "Jewellers", eventName: "outbound_click" }),
    eventsCol.countDocuments({ ...eventMatch, section: "Gold Rate", citySlug: { $ne: null }, eventName: "scroll_depth" }),
    eventsCol.countDocuments({ ...eventMatch, section: "Gold Rate", citySlug: { $ne: null }, eventName: "cta_click" }),
    eventsCol.countDocuments({ ...eventMatch, section: "Gold Rate", citySlug: { $ne: null }, eventName: "outbound_click" }),
  ]);

  const sectionViews = new Map<string, number>(sectionViewsRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const sectionUnique = new Map<string, number>(sectionUniqueRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const sectionCta = new Map<string, number>(sectionCtaRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const sectionBounce = new Map<string, { total: number; bounced: number }>(
    sectionBounceRaw.map((i: any) => [String(i._id), { total: Number(i.total ?? 0), bounced: Number(i.bounced ?? 0) }])
  );
  const sectionPages = new Map<string, Array<{ path: string; count: number }>>();
  for (const item of sectionPageRaw) {
    const section = item._id.section;
    const list = sectionPages.get(section) ?? [];
    list.push({ path: item._id.path, count: item.count });
    sectionPages.set(section, list);
  }
  const sectionHeartbeatSeconds = new Map<string, number[]>();
  for (const hb of heartbeatRaw) {
    const sec = hb._id.section || "Other";
    const list = sectionHeartbeatSeconds.get(sec) ?? [];
    list.push(hb.beats * 15);
    sectionHeartbeatSeconds.set(sec, list);
  }
  const sections = new Set<string>([
    ...sectionViews.keys(),
    ...sectionUnique.keys(),
    ...sectionPages.keys(),
    ...sectionHeartbeatSeconds.keys(),
  ]);
  const sectionPerformance: SectionPerformanceItem[] = [...sections].map((section) => {
    const pages = (sectionPages.get(section) ?? []).sort((a, b) => b.count - a.count);
    const bounce = sectionBounce.get(section);
    const heartbeat = sectionHeartbeatSeconds.get(section) ?? [];
    return {
      section,
      totalViews: sectionViews.get(section) ?? 0,
      uniqueUsers: sectionUnique.get(section) ?? 0,
      avgEngagementSec: heartbeat.length ? Math.round(heartbeat.reduce((s, n) => s + n, 0) / heartbeat.length) : 0,
      medianEngagementSec: median(heartbeat),
      bounceRate: bounce && bounce.total ? Number(((bounce.bounced / bounce.total) * 100).toFixed(1)) : 0,
      ctaClicks: sectionCta.get(section) ?? 0,
      topPage: pages[0]?.path ?? "-",
      leastPage: pages.at(-1)?.path ?? "-",
    };
  }).sort((a, b) => b.totalViews - a.totalViews);

  const calcViews = new Map<string, number>(calculatorViewRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const calcUnique = new Map<string, number>(calculatorUniqueRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const calcInteractions = new Map<string, number>();
  const calcCompletions = new Map<string, number>();
  for (const i of calculatorEventRaw) {
    if (i._id.eventName === "tool_interaction") calcInteractions.set(i._id.calculatorType, i.count);
    if (i._id.eventName === "calculator_complete") calcCompletions.set(i._id.calculatorType, i.count);
  }
  const calcHeartbeat = new Map<string, number[]>();
  for (const hb of calculatorHeartbeatRaw) {
    const list = calcHeartbeat.get(hb._id.calculatorType) ?? [];
    list.push(hb.beats * 15);
    calcHeartbeat.set(hb._id.calculatorType, list);
  }
  const calculatorTypes = new Set<string>([
    ...calcViews.keys(),
    ...calcUnique.keys(),
    ...calcInteractions.keys(),
    ...calcCompletions.keys(),
    ...calcHeartbeat.keys(),
  ]);
  const calculatorInsights: CalculatorInsightItem[] = [...calculatorTypes].map((calc) => {
    const hb = calcHeartbeat.get(calc) ?? [];
    const starts = calcInteractions.get(calc) ?? 0;
    const completes = calcCompletions.get(calc) ?? 0;
    return {
      calculator: calc,
      views: calcViews.get(calc) ?? 0,
      uniqueUsers: calcUnique.get(calc) ?? 0,
      avgEngagementSec: hb.length ? Math.round(hb.reduce((s, n) => s + n, 0) / hb.length) : 0,
      medianEngagementSec: median(hb),
      interactions: starts,
      completionRate: starts ? Number(((completes / starts) * 100).toFixed(1)) : 0,
    };
  }).sort((a, b) => b.views - a.views);

  const jewellerViews = new Map<string, number>(jewellerPageRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const jewellerUnique = new Map<string, number>(jewellerUniqueRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const jewellerCtas = new Map<string, number>(jewellerCtaRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const jewellerHeartbeat = new Map<string, number[]>();
  for (const hb of jewellerHeartbeatRaw) {
    const list = jewellerHeartbeat.get(hb._id.page) ?? [];
    list.push(hb.beats * 15);
    jewellerHeartbeat.set(hb._id.page, list);
  }
  const jewellerPages = new Set<string>([
    ...jewellerViews.keys(),
    ...jewellerUnique.keys(),
    ...jewellerCtas.keys(),
    ...jewellerHeartbeat.keys(),
  ]);
  const jewellerInsights: JewellerInsightItem[] = [...jewellerPages].map((page) => {
    const hb = jewellerHeartbeat.get(page) ?? [];
    return {
      page,
      views: jewellerViews.get(page) ?? 0,
      uniqueUsers: jewellerUnique.get(page) ?? 0,
      avgEngagementSec: hb.length ? Math.round(hb.reduce((s, n) => s + n, 0) / hb.length) : 0,
      ctaClicks: jewellerCtas.get(page) ?? 0,
    };
  }).sort((a, b) => b.views - a.views).slice(0, 20);

  const cityViews = new Map<string, number>();
  for (const i of goldCityViewsRaw) {
    const city = getCitySlug(i._id);
    if (!city) continue;
    cityViews.set(city, (cityViews.get(city) ?? 0) + i.count);
  }
  const cityUnique = new Map<string, number>();
  for (const i of goldCityUniqueRaw) {
    const city = getCitySlug(i._id);
    if (!city) continue;
    cityUnique.set(city, (cityUnique.get(city) ?? 0) + i.count);
  }
  const cityHeartbeat = new Map<string, number[]>();
  const localeHeartbeat = new Map<string, number[]>();
  for (const hb of goldHeartbeatRaw) {
    const city = hb._id.citySlug?.toLowerCase();
    if (!city) continue;
    const seconds = hb.beats * 15;
    const list = cityHeartbeat.get(city) ?? [];
    list.push(seconds);
    cityHeartbeat.set(city, list);
    const l = hb._id.locale || "en";
    const localeList = localeHeartbeat.get(l) ?? [];
    localeList.push(seconds);
    localeHeartbeat.set(l, localeList);
  }
  const goldCities = new Set<string>([...cityViews.keys(), ...cityUnique.keys(), ...cityHeartbeat.keys()]);
  const goldRateCityInsights: GoldRateCityInsightItem[] = [...goldCities].map((city) => {
    const hb = cityHeartbeat.get(city) ?? [];
    return {
      city,
      views: cityViews.get(city) ?? 0,
      uniqueUsers: cityUnique.get(city) ?? 0,
      avgEngagementSec: hb.length ? Math.round(hb.reduce((s, n) => s + n, 0) / hb.length) : 0,
      medianEngagementSec: median(hb),
    };
  }).sort((a, b) => b.views - a.views);

  const localeViews = new Map<string, number>(goldLocaleViewsRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const localeUnique = new Map<string, number>(goldLocaleUniqueRaw.map((i: any) => [String(i._id), Number(i.count)]));
  const locales = new Set<string>([...localeViews.keys(), ...localeUnique.keys(), ...localeHeartbeat.keys()]);
  const goldRateLocaleInsights: GoldRateLocaleInsightItem[] = [...locales].map((locale) => {
    const hb = localeHeartbeat.get(locale) ?? [];
    return {
      locale,
      views: localeViews.get(locale) ?? 0,
      uniqueUsers: localeUnique.get(locale) ?? 0,
      avgEngagementSec: hb.length ? Math.round(hb.reduce((s, n) => s + n, 0) / hb.length) : 0,
    };
  }).sort((a, b) => b.views - a.views);

  const funnels = {
    calculators: {
      views: calculatorInsights.reduce((s, c) => s + c.views, 0),
      interactions: Number(calcInteractionsCountRaw || 0),
      cta: Number(calcCtaCountRaw || 0),
      conversions: Number(calcConversionsCountRaw || 0),
    },
    jewellers: {
      views: jewellerInsights.reduce((s, c) => s + c.views, 0),
      interactions: Number(jewellerInteractionsCountRaw || 0),
      cta: Number(jewellerCtaCountRaw || 0),
      conversions: Number(jewellerConversionsCountRaw || 0),
    },
    goldRateCities: {
      views: goldRateCityInsights.reduce((s, c) => s + c.views, 0),
      interactions: Number(goldInteractionsCountRaw || 0),
      cta: Number(goldCtaCountRaw || 0),
      conversions: Number(goldConversionsCountRaw || 0),
    },
  };

  return {
    sectionPerformance,
    calculatorInsights,
    jewellerInsights,
    goldRateCityInsights,
    goldRateLocaleInsights,
    funnels,
  };
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
      section: getPathSection(path),
      pageType: getPageType(path),
      locale: getLocaleFromPath(path),
      citySlug: getCitySlug(path),
      calculatorType: getCalculatorType(path),
      referrerSource: getSourceFromReferrer(referrer),
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

    const sectionFromPath = getPathSection(path);
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
      section: (typeof metadata?.section === "string" ? metadata.section : sectionFromPath) || "Other",
      subSection: typeof metadata?.subSection === "string" ? metadata.subSection : null,
      pageType: typeof metadata?.pageType === "string" ? metadata.pageType : getPageType(path),
      locale: typeof metadata?.locale === "string" ? metadata.locale : getLocaleFromPath(path),
      citySlug: typeof metadata?.citySlug === "string" ? metadata.citySlug : getCitySlug(path),
      calculatorType:
        typeof metadata?.calculatorType === "string" ? metadata.calculatorType : getCalculatorType(path),
      sessionId: typeof metadata?.sessionId === "string" ? metadata.sessionId : null,
      userId: typeof metadata?.userId === "string" ? metadata.userId : null,
      referrerSource: getSourceFromReferrer(referrer),
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
  windowOverride?: AnalyticsWindow,
  filters?: AnalyticsFilters
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
    const match = buildMatch(computedWindow, filters, "pageviews");
    const eventMatch = buildMatch(computedWindow, filters, "events");
    const timeFormat = getTimeFormatFromWindow(computedWindow);
    const sourceExpr = getSourceExpr();
    const sectionSwitchBranches = getSectionSwitchBranches();
    const gamesRegex = `^/${LOCALE_PREFIX_PATTERN}games(?:$|/)`;
    const marketPulseRegex = `^/${LOCALE_PREFIX_PATTERN}gold-market-pulse(?:$|/)`;

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
      marketPulseViews,
      marketPulseUniqueIPs,
      marketPulseRealtimeIPs,
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
        .distinct("ip", buildMatch({ startDate: new Date(Date.now() - 5 * 60_000), endDate: new Date() }, filters, "pageviews")),
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
        ...buildMatch({ startDate: new Date(Date.now() - 5 * 60_000), endDate: new Date() }, filters, "pageviews"),
        path: { $regex: gamesRegex },
      }),
      eventsCol
        .aggregate<BucketItem>([
          {
            $match: {
              ...eventMatch,
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
      col.countDocuments({ ...match, path: { $regex: marketPulseRegex } }),
      col.distinct("ip", { ...match, path: { $regex: marketPulseRegex } }),
      col.distinct("ip", {
        ...buildMatch({ startDate: new Date(Date.now() - 5 * 60_000), endDate: new Date() }, filters, "pageviews"),
        path: { $regex: marketPulseRegex },
      }),
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
    const detailedInsights = await getDetailedInsights(computedWindow, col, eventsCol, filters);

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
      marketPulseViews,
      marketPulseUniqueUsers: marketPulseUniqueIPs.length,
      marketPulseRealtimeUsers: marketPulseRealtimeIPs.length,
      marketPulseShare: totalViews > 0 ? Number(((marketPulseViews / totalViews) * 100).toFixed(1)) : 0,
      geoRedirectFunnel: {
        homeLandings: geoMap.get("home_landing_detected") || 0,
        redirectExpected: geoMap.get("geo_redirect_expected") || 0,
        redirectApplied: geoMap.get("geo_redirect_applied") || 0,
        redirectSkipped: geoMap.get("geo_redirect_skipped") || 0,
        finalLandingPageviews: geoMap.get("final_landing_pageview") || 0,
      },
      sectionPerformance: detailedInsights.sectionPerformance,
      calculatorInsights: detailedInsights.calculatorInsights,
      jewellerInsights: detailedInsights.jewellerInsights,
      goldRateCityInsights: detailedInsights.goldRateCityInsights,
      goldRateLocaleInsights: detailedInsights.goldRateLocaleInsights,
      funnels: detailedInsights.funnels,
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
  windowOverride?: AnalyticsWindow,
  filters?: AnalyticsFilters
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

    const match = buildMatch(computedWindow, filters, "pageviews");
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

