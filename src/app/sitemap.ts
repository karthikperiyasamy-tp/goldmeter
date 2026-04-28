import { MetadataRoute } from 'next'
import { getAllRecaps } from '@/lib/recapDB'
import { GOLD_RATE_CITIES, SILVER_RATE_CITIES, getCitySlug } from '@/lib/cities'
import { getAllJewellerSlugs } from '@/lib/jewellerConfig'
import { PUBLISHED_ARTICLES, getArticleDateISO, getTrendingArticles } from '@/lib/articles'
import { getRecentNews } from '@/lib/newsDB'

export const revalidate = 3600

const baseUrl = 'https://goldmeter.in'
const nonDefaultLocales = ['hi', 'ta', 'te'] as const

const cities = GOLD_RATE_CITIES.map(getCitySlug)
const silverCities = SILVER_RATE_CITIES.map(getCitySlug)

function withLocaleAlternates(path: string) {
  return {
    languages: Object.fromEntries([
      ['en', `${baseUrl}${path}`],
      ...nonDefaultLocales.map((l) => [l, `${baseUrl}/${l}${path}`]),
    ]),
  }
}

function localeEntries(
  path: string,
  options: { lastModified: Date; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }
): MetadataRoute.Sitemap {
  return nonDefaultLocales.map((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: withLocaleAlternates(path),
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch recaps, news articles, and trending articles from DB in parallel
  let recaps: Array<{ slug: string; publishedAt: Date }> = []
  let newsArticles: Array<{ slug: string; publishedAt: Date }> = []
  let trendingArticles: Array<{ slug: string; date: Date }> = []
  try {
    const [recapsResult, newsResult, trendingResult] = await Promise.allSettled([
      getAllRecaps(60),
      getRecentNews(100),
      getTrendingArticles(50),
    ])
    if (recapsResult.status === 'fulfilled') recaps = recapsResult.value
    if (newsResult.status === 'fulfilled') {
      newsArticles = newsResult.value
        .filter((a) => a.slug)
        .map((a) => ({ slug: a.slug, publishedAt: new Date(a.publishedAt) }))
    }
    if (trendingResult.status === 'fulfilled') {
      trendingArticles = trendingResult.value.map((a) => ({
        slug: a.slug,
        date: new Date(a.date),
      }))
    }
  } catch (error) {
    console.error('Error fetching data for sitemap:', error)
  }

  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 1,
    alternates: withLocaleAlternates('/'),
  }

  const goldRateToday = {
    url: `${baseUrl}/gold-rate-today`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 1,
    alternates: withLocaleAlternates('/gold-rate-today'),
  }

  const calculator = {
    url: `${baseUrl}/calculator`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/calculator'),
  }

  const wastageCalculator = {
    url: `${baseUrl}/wastage-calculator`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/wastage-calculator'),
  }

  const purityConverter = {
    url: `${baseUrl}/purity-converter`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/purity-converter'),
  }

  const investmentCalculator = {
    url: `${baseUrl}/investment-calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/investment-calculator'),
  }

  const goldLoanCalculator = {
    url: `${baseUrl}/gold-loan-calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/gold-loan-calculator'),
  }

  const weddingGoldPlanner = {
    url: `${baseUrl}/wedding-gold-planner`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/wedding-gold-planner'),
  }

  const articlesHub = {
    url: `${baseUrl}/articles`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    alternates: withLocaleAlternates('/articles'),
  }

  const worldGoldPrice = {
    url: `${baseUrl}/world-gold-price`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.88,
    alternates: withLocaleAlternates('/world-gold-price'),
  }

  const articlePages = PUBLISHED_ARTICLES.map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(getArticleDateISO(a)),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates(`/articles/${a.slug}`),
  }))

  // Trending articles (AI-generated, from MongoDB)
  const trendingArticlePages = trendingArticles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.date,
    changeFrequency: 'monthly' as const,
    priority: 0.75, // Slightly lower than static articles
    alternates: withLocaleAlternates(`/articles/${article.slug}`),
  }))

  const hallmarkGuide = {
    url: `${baseUrl}/hallmark-guide`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/hallmark-guide'),
  }

  const sipCalculator = {
    url: `${baseUrl}/sip-calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/sip-calculator'),
  }

  const sipCalculatorStepUp = {
    url: `${baseUrl}/sip-calculator-with-step-up`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/sip-calculator-with-step-up'),
  }

  const swpCalculator = {
    url: `${baseUrl}/swp-calculator-with-inflation`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/swp-calculator-with-inflation'),
  }

  const games = {
    url: `${baseUrl}/games`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: withLocaleAlternates('/games'),
  }

  const portfolio = {
    url: `${baseUrl}/portfolio`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/portfolio'),
  }

  const news = {
    url: `${baseUrl}/news`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'daily' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/news'),
  }

  const recapListing = {
    url: `${baseUrl}/news/recap`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/news/recap'),
  }

  // Dynamic news article pages (from DB)
  const newsPages = newsArticles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt),
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
    alternates: withLocaleAlternates(`/gold-rate/${city}`),
  }))

  const silverRateIndex = {
    url: `${baseUrl}/silver-rate`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/silver-rate'),
  }

  // Silver rate city pages
  const silverRateCityPages = silverCities.map((city) => ({
    url: `${baseUrl}/silver-rate/${city}`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'daily' as const,
    priority: 0.75,
    alternates: withLocaleAlternates(`/silver-rate/${city}`),
  }))

  const jewellersIndex = {
    url: `${baseUrl}/jewellers`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: withLocaleAlternates('/jewellers'),
  }

  const jewellersBuyingGuide = {
    url: `${baseUrl}/jewellers/buying-guide`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
    alternates: withLocaleAlternates('/jewellers/buying-guide'),
  }

  const jewellerPages = getAllJewellerSlugs().map((slug) => ({
    url: `${baseUrl}/jewellers/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: withLocaleAlternates(`/jewellers/${slug}`),
  }))

  const footerPaths = ['/about', '/contact', '/privacy', '/terms', '/disclaimer']
  const footerPages = footerPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    priority: path === '/about' || path === '/contact' ? 0.5 : 0.3,
    lastModified: new Date('2024-12-29'),
    changeFrequency: 'yearly' as const,
    alternates: withLocaleAlternates(path),
  }))

  // Locale variant URLs for all translatable pages (hi, ta, te)
  const now = new Date()
  const toolDate = new Date('2025-12-18')

  const localePages = [
    // High-priority pages
    ...localeEntries('/', { lastModified: now, changeFrequency: 'hourly', priority: 1 }),
    ...localeEntries('/gold-rate-today', { lastModified: now, changeFrequency: 'hourly', priority: 1 }),
    ...localeEntries('/world-gold-price', { lastModified: now, changeFrequency: 'hourly', priority: 0.85 }),
    // Gold rate city pages
    ...cities.flatMap((city) =>
      localeEntries(`/gold-rate/${city}`, { lastModified: now, changeFrequency: 'hourly', priority: 0.9 })
    ),
    // Silver rate pages
    ...localeEntries('/silver-rate', { lastModified: now, changeFrequency: 'daily', priority: 0.75 }),
    ...silverCities.flatMap((city) =>
      localeEntries(`/silver-rate/${city}`, { lastModified: toolDate, changeFrequency: 'daily', priority: 0.7 })
    ),
    // Calculator & tool pages
    ...localeEntries('/calculator', { lastModified: toolDate, changeFrequency: 'monthly', priority: 0.8 }),
    ...localeEntries('/wastage-calculator', { lastModified: toolDate, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/purity-converter', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/investment-calculator', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/gold-loan-calculator', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/wedding-gold-planner', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/hallmark-guide', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/sip-calculator', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/sip-calculator-with-step-up', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/swp-calculator-with-inflation', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    ...localeEntries('/games', { lastModified: now, changeFrequency: 'weekly', priority: 0.7 }),
    // Content pages
    ...localeEntries('/articles', { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
    ...localeEntries('/news', { lastModified: toolDate, changeFrequency: 'daily', priority: 0.75 }),
    ...localeEntries('/news/recap', { lastModified: now, changeFrequency: 'daily', priority: 0.75 }),
    ...localeEntries('/portfolio', { lastModified: now, changeFrequency: 'monthly', priority: 0.75 }),
    // Jewellers
    ...localeEntries('/jewellers', { lastModified: now, changeFrequency: 'weekly', priority: 0.75 }),
    ...localeEntries('/jewellers/buying-guide', { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }),
    ...getAllJewellerSlugs().flatMap((slug) =>
      localeEntries(`/jewellers/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.65 })
    ),
  ]

  return [
    // English (default) pages
    homepage,
    goldRateToday,
    worldGoldPrice,
    ...cityPages,
    calculator,
    wastageCalculator,
    purityConverter,
    investmentCalculator,
    goldLoanCalculator,
    weddingGoldPlanner,
    articlesHub,
    ...articlePages,
    ...trendingArticlePages,
    hallmarkGuide,
    sipCalculator,
    sipCalculatorStepUp,
    swpCalculator,
    games,
    portfolio,
    news,
    recapListing,
    ...newsPages,
    ...recapPages,
    silverRateIndex,
    ...silverRateCityPages,
    jewellersIndex,
    jewellersBuyingGuide,
    ...jewellerPages,
    ...footerPages,
    // Hindi, Tamil, Telugu locale pages
    ...localePages,
  ]
}
