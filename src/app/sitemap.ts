import { MetadataRoute } from 'next'

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

// List of news article slugs
const newsArticles = [
  'gold-price-increase-today',
  'gold-rate-prediction-2025',
  '22k-vs-24k-guide',
]

export default function sitemap(): MetadataRoute.Sitemap {
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
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }

  // News article pages
  const newsPages = newsArticles.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // City pages
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [
    homepage,
    calculator,
    wastageCalculator,
    purityConverter,
    news,
    ...newsPages,
    ...cityPages,
  ]
}

