export interface User {
  id: string;
  email: string;
  name: string;
  weddingDate?: string;
  partner?: string;
  styleProfile?: StyleProfile;
}

export interface StyleProfile {
  style: string;
  colors: string[];
  season: string;
  venue: string;
  budget: number;
  guestCount: number;
}

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

export interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  vendor?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  filename: string;
  size: number;
  category: string;
  caption?: string;
  tags: string[];
  isFavorite: boolean;
  uploadDate: Date;
  notes?: string;
}