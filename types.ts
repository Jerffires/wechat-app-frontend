
export type TagType = 'like' | 'hate' | 'have' | 'want';

export interface Tag {
  id: string;
  text: string;
  type: TagType;
  isPinned: boolean;
  createdAt: number;
}

// New Composition Structure (Ingredients)
export interface IngredientItem {
  percentage: number;
  label: string;
}

export interface Ingredient {
  id: string;
  category: string;
  items: [IngredientItem, IngredientItem, IngredientItem];
}

export interface PersonalInfo {
  nickname: string;
  avatar?: string;
  birthday: string;
  zodiac: string; // Calculated from birthday
  keywords: [string, string, string]; // 3 specific keywords
  mbti: string[]; // ['E', 'N', 'F', 'P']
  socialBattery: number; // 0-100
  ingredients: Ingredient[]; // Dynamic list of "My Composition"
}

// Interface for Question History
export interface QuestionRecord {
  id: string;
  questionId: string;
  questionText: string;
  answer: string;
  type: TagType;
  date: number;
}

export type ViewState = 'home' | 'lab' | 'tag-detail' | 'profile';