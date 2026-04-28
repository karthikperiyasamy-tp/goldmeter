import { getDatabase } from './mongodb';
import type { ArticleMeta } from './articles';

/**
 * SERVER-ONLY: Fetch trending articles from MongoDB
 * This module must never be imported on the client side
 */

export async function getTrendingArticles(limit: number = 30): Promise<ArticleMeta[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection('trending_articles');
    
    const articles = await collection
      .find({ isPublished: true })
      .sort({ date: -1 })
      .limit(limit)
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
}

export async function getTrendingArticleBySlug(
  slug: string
): Promise<{ content: string; title: string; metaDescription: string; tags: string[] } | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection('trending_articles');
    
    const article = await collection.findOne({ slug, isPublished: true });
    
    if (article) {
      return {
        content: article.content,
        title: article.title,
        metaDescription: article.metaDescription,
        tags: article.tags || [],
      };
    }
    return null;
  } catch (error) {
    console.warn(`⚠️  Could not fetch trending article ${slug}:`, error);
    return null;
  }
}
