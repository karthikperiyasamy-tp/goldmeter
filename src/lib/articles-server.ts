import { getDatabase } from './mongodb';
import { unstable_cache } from 'next/cache';
import type { ArticleMeta } from './articles';

/**
 * SERVER-ONLY: Fetch trending articles from MongoDB
 * This module must never be imported on the client side
 */

// Fetch trending articles from MongoDB without parameters
// This ensures consistent caching behavior
const fetchTrendingArticlesFromDB = async (): Promise<ArticleMeta[]> => {
  try {
    const db = await getDatabase();
    const collection = db.collection('trending_articles');
    
    const articles = await collection
      .find({ isPublished: true })
      .sort({ date: -1 })
      .limit(50) // Fetch up to 50 articles
      .toArray();
    
    return articles.map((a: any) => ({
      slug: a.slug,
      title: a.title,
      date: new Date(a.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      preview: a.metaDescription,
      category: 'trending' as const,
      published: true,
      isAiGenerated: a.isAiGenerated || false,
    }));
  } catch (error) {
    console.warn('⚠️  Could not fetch trending articles:', error);
    return [];
  }
};

// Wrap with caching and revalidation tag
export const getTrendingArticles = unstable_cache(
  async (limit?: number) => {
    const articles = await fetchTrendingArticlesFromDB();
    return articles.slice(0, limit || 30);
  },
  ['trending-articles'],
  { 
    tags: ['trending-articles'],
    revalidate: 60 // Cache for 1 minute to ensure fresh data
  }
);

export async function getTrendingArticleBySlug(
  slug: string
): Promise<{ content: string; title: string; metaDescription: string; tags: string[] } | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection('trending_articles');
    
    console.log(`[getTrendingArticleBySlug] Looking for slug: ${slug}`);
    
    const article = await collection.findOne({ slug, isPublished: true });
    
    if (article) {
      console.log(`[getTrendingArticleBySlug] Found article: ${article.title}`);
      return {
        content: article.content || '',
        title: article.title || '',
        metaDescription: article.metaDescription || '',
        tags: article.tags || [],
      };
    }
    
    console.warn(`[getTrendingArticleBySlug] No article found for slug: ${slug}`);
    return null;
  } catch (error) {
    console.error(`❌ Could not fetch trending article ${slug}:`, error);
    return null;
  }
}

// Also provide a way to revalidate specific article if needed
export const revalidateTrendingArticlesTag = async () => {
  const { revalidateTag } = await import('next/cache');
  try {
    revalidateTag('trending-articles', 'default');
  } catch (error) {
    console.warn('Could not revalidate trending articles tag:', error);
  }
};
