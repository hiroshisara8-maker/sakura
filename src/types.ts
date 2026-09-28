export type MoodType = 'great' | 'happy' | 'peaceful' | 'neutral' | 'tired' | 'sad' | 'anxious';

export interface MoodDefinition {
  id: MoodType;
  emoji: string;
  name: string;
  japanese: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  title: string;
  content: string;
  moodId: MoodType;
  moodReason?: string;
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'snowy';
  photos: string[];
  photoCaptions?: Record<string, string>;
  tags: string[];
  stickers: string[];
  gratitudeList: string[]; // 1-3 items
  dailyQuestionAnswer?: string;
  isFavorite?: boolean;
}

export interface Task {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  completed: boolean;
  priority: 'urgent' | 'important' | 'normal';
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  targetDaysPerWeek: number;
  category: string;
  completedDates: string[]; // List of YYYY-MM-DD
  color: string;
}

export type MemoryCategory = 'all' | 'family' | 'friends' | 'travel' | 'achievement' | 'love' | 'cozy';

export interface Memory {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  story: string;
  photoUrl: string;
  category: MemoryCategory;
  isSpecial: boolean;
  location?: string;
}

export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  progress: number; // 0-100
  target: string;
  completed: boolean;
  deadline?: string;
}

export interface UserSettings {
  userName: string;
  avatarUrl: string;
  bio: string;
  themeColor: 'sakura' | 'matcha' | 'yuzu' | 'lavender' | 'peach';
  soundVolume: number;
  soundTrack: 'rain' | 'cafe' | 'breeze' | 'windchime' | 'off';
  language: 'vi' | 'en' | 'ja';
  reminderTime: string;
  reminderEnabled: boolean;
}

export type ActiveTab = 'today' | 'calendar' | 'write' | 'memories' | 'timeline' | 'habits' | 'tasks' | 'goals' | 'stats' | 'search' | 'profile';
