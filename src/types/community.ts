/** Community feature types: comments, Q&A, polls */

export interface Comment {
  id: string;
  /** Target identifier, e.g. "article:gold-origins" or "recap:daily-recap-3-mar-2026" or "poll:abc123" */
  target: string;
  /** null for top-level comments, parent comment id for replies */
  parentId: string | null;
  uid: string;
  displayName: string;
  photoURL: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
  reported: boolean;
  reportedBy: string[];
}

export interface Question {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  title: string;
  body: string;
  category: QuestionCategory;
  createdAt: string;
  updatedAt: string;
  answerCount: number;
  viewCount: number;
  tags: string[];
}

export type QuestionCategory = "general" | "buying" | "investment" | "rates";

export const QUESTION_CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "buying", label: "Buying" },
  { value: "investment", label: "Investment" },
  { value: "rates", label: "Rates & Prices" },
];

export interface Answer {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
  helpful: boolean;
}

export interface WeeklyPoll {
  id: string;
  question: string;
  context: string;
  options: string[];
  votes: Record<number, number>;
  createdAt: string;
  weekStart: string;
}

export interface SentimentPoll {
  date: string;
  options: string[];
  votes: Record<number, number>;
  totalVotes: number;
}

export const SENTIMENT_OPTIONS = [
  "Buying gold today",
  "Selling / booking profits",
  "Holding steady",
  "Waiting for a dip",
  "Just watching prices",
];
