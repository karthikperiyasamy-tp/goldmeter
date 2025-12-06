import { MetadataRoute } from 'next'
import { getAllRecaps } from '@/lib/recapDB'

// Regenerate the sitemap periodically so lastModified timestamps stay fresh.
export const revalidate = 60 * 60 // 1 hour

const baseUrl = 'https://goldmeter.in'

// List of supported cities
const cities = [
  'ahmedabad',
  'bangalore',
  'chennai',
  'coimbatore',
  'delhi',
  'hyderabad',
  'kolkata',
  'mumbai',
  'pune',
  'vijayawada',
]

// List of static news article slugs
const newsArticles = [
  'gold-price-increase-today',
  'gold-rate-prediction-2025',
  '22k-vs-24k-guide',
]

// Silver rate supported cities (aligned with silver-rate/[city] pages)
const silverCities = [
  'chennai',
  'bangalore',
  'mumbai',
  'delhi',
  'hyderabad',
  'kolkata',
  'ahmedabad',
  'pune',
  'coimbatore',
  'vijayawada',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all recaps for sitemap
  let recaps: Array<{ slug: string; publishedAt: Date }> = []
  try {
    recaps = await getAllRecaps(60) // Get last 60 recaps
  } catch (error) {
    console.error('Error fetching recaps for sitemap:', error)
  }

  // Homepage
  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }

  // Calculator page
  const calculator = {
    url: `${baseUrl}/calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

  // Wastage calculator page
  const wastageCalculator = {
    url: `${baseUrl}/wastage-calculator`,
    lastModified: new Date(),
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

  // News index page
  const news = {
    url: `${baseUrl}/news`,
    lastModified: new Date(),
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

  // City pages
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
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
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.75,
  }))

  return [
    homepage,
    calculator,
    wastageCalculator,
    purityConverter,
    news,
    recapListing,
    ...newsPages,
    ...recapPages,
    ...cityPages,
    silverRateIndex,
    ...silverRateCityPages,
  ]
}
