// Gold rate snapshot for a specific date
export interface GoldRateSnapshot {
  gold22k: number; // Price per 10 grams
  gold24k: number; // Price per 10 grams
  gold18k?: number; // Price per 10 grams (optional, can be calculated)
  silver1kg?: number | null; // Price per 1 kg
  priceChange?: {
    gold22k: number; // Change from previous day
    gold24k: number;
  };
}

// Daily recap article type
export interface DailyRecap {
  _id?: string;
  date: string; // Format: "2024-11-28"
  title: string;
  slug: string; // Format: "daily-recap-28-nov-2024"
  summary: string; // Short summary for preview
  content: string; // Full article content (markdown)
  highlights: string[]; // Key bullet points
  sourcesCount: number; // Number of articles summarized
  goldRates?: GoldRateSnapshot; // India gold rates for that day (SEO boost)
  generatedAt: Date;
  publishedAt: Date;
}

// API response type
export interface RecapResponse {
  success: boolean;
  recap?: DailyRecap;
  error?: string;
}

