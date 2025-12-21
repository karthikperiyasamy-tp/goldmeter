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
  generatedAt: Date;
  publishedAt: Date;
}

// API response type
export interface RecapResponse {
  success: boolean;
  recap?: DailyRecap;
  error?: string;
}

