// News article type for database storage
export interface NewsArticle {
  _id?: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl?: string;
  publishedAt: Date;
  fetchedAt: Date;
  slug: string;
  category: 'gold' | 'silver' | 'market' | 'general';
}

// RSS feed configuration
export interface RSSFeed {
  name: string;
  url: string;
  category: NewsArticle['category'];
}

// Grouped news for display
export interface GroupedNews {
  label: string; // "Today", "Yesterday", "25 Nov 2024"
  date: string; // ISO date string for sorting
  articles: NewsArticle[];
}

// API response type
export interface NewsResponse {
  success: boolean;
  groups: GroupedNews[];
  totalCount: number;
  hasMore: boolean;
}

