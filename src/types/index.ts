/**
 * Represents a user of the application.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  weddingDate?: string;
  partner?: string;
  styleProfile?: StyleProfile;
  tier?: 'free' | 'pro';
}

/**
 * Defines the user's aesthetic and planning preferences.
 */
export interface StyleProfile {
  style: string;
  colors: string[];
  season: string;
  venue: string;
  budget: number;
  guestCount: number;
  aiInsights?: any; // To store AI-generated enhancements
}

/**
 * Represents a single item in the wedding checklist.
 */
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  timeframe: string;
}

/**
 * Represents a single item in the budget tracker.
 */
export interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  vendor?: string;
  notes?: string;
}

/**
 * Represents a single message in the AI chat.
 */
export interface ChatMessage {
  id:string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

/**
 * Represents an uploaded image in the inspiration gallery or vision board.
 * This is the single source of truth for photo-related data.
 */
export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  filename: string;
  size: number;
  category: string;
  tags: string[];
  isFavorite: boolean;
  uploadDate: Date;
  source: 'device' | 'instagram' | 'facebook';
  caption?: string;
  notes?: string;
  analysis?: any;
  edits?: {
    brightness: number;
    contrast: number;
    saturation: number;
    filter: string;
    crop?: { x: number; y: number; width: number; height: number };
  };
}