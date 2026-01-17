import { MetadataRoute } from 'next'
import { getAllRecaps } from '@/lib/recapDB'
import { GOLD_RATE_CITIES, SILVER_RATE_CITIES, getCitySlug } from '@/lib/cities'
import { getAllJewellerSlugs } from '@/lib/jewellerConfig'

// Regenerate the sitemap periodically so lastModified timestamps stay fresh
// and new recap pages appear promptly for search engines.
export const revalidate = 3600 // 1 hour

const baseUrl = 'https://goldmeter.in'

// Use shared city config (converted to lowercase slugs)
const cities = GOLD_RATE_CITIES.map(getCitySlug)
const silverCities = SILVER_RATE_CITIES.map(getCitySlug)

// List of static news article slugs
// Note: Only include articles that actually exist to avoid 404 errors
// Removed: 'gold-price-increase-today', 'gold-rate-prediction-2025', '22k-vs-24k-guide' (404)
const newsArticles: string[] = []

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all recaps for sitemap
  let recaps: Array<{ slug: string; publishedAt: Date }> = []
  try {
    recaps = await getAllRecaps(60) // Get last 60 recaps
  } catch (error) {
    console.error('Error fetching recaps for sitemap:', error)
  }

  // Homepage (with https://goldmeter.in/ canonical)
  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 1,
  }

  // Gold Rate Today - Primary landing page for "gold rate today" query
  const goldRateToday = {
    url: `${baseUrl}/gold-rate-today`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 1,
  }

  // Calculator page
  const calculator = {
    url: `${baseUrl}/calculator`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // Wastage calculator page
  const wastageCalculator = {
    url: `${baseUrl}/wastage-calculator`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // Purity converter page
  const purityConverter = {
    url: `${baseUrl}/purity-converter`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // Investment calculator page
  const investmentCalculator = {
    url: `${baseUrl}/investment-calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // Gold loan calculator page
  const goldLoanCalculator = {
    url: `${baseUrl}/gold-loan-calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // Wedding gold planner page
  const weddingGoldPlanner = {
    url: `${baseUrl}/wedding-gold-planner`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // News index page
  const news = {
    url: `${baseUrl}/news`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }

  // Recap listing page
  const recapListing = {
    url: `${baseUrl}/news/recap`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }

  // Static news article pages
  const newsPages = newsArticles.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Daily recap pages (AI-generated)
  const recapPages = recaps.map((recap) => ({
    url: `${baseUrl}/news/recap/${recap.slug}`,
    lastModified: new Date(recap.publishedAt),
    changeFrequency: 'yearly' as const, // Recaps don't change once published
    priority: 0.7,
  }))

  // City pages - high priority with hourly updates for freshness signals
  // URL structure: /gold-rate/{city} for consistency with /silver-rate/{city}
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/gold-rate/${city}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.95,
  }))

  // Silver rate index page
  const silverRateIndex = {
    url: `${baseUrl}/silver-rate`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }

  // Silver rate city pages
  const silverRateCityPages = silverCities.map((city) => ({
    url: `${baseUrl}/silver-rate/${city}`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'daily' as const,
    priority: 0.75,
  }))

  // Jewellers index page
  const jewellersIndex = {
    url: `${baseUrl}/jewellers`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }

  // Individual jeweller pages
  const jewellerPages = getAllJewellerSlugs().map((slug) => ({
    url: `${baseUrl}/jewellers/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Footer/Legal pages
  const footerPages = [
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, priority: 0.3 },
  ].map((page) => ({
    ...page,
    lastModified: new Date('2024-12-29'),
    changeFrequency: 'yearly' as const,
  }))

  return [
    homepage,
    goldRateToday,
    ...cityPages,
    calculator,
    wastageCalculator,
    purityConverter,
    investmentCalculator,
    goldLoanCalculator,
    weddingGoldPlanner,
    news,
    recapListing,
    ...newsPages,
    ...recapPages,
    silverRateIndex,
    ...silverRateCityPages,
    jewellersIndex,
    ...jewellerPages,
    ...footerPages,
  ]
}
