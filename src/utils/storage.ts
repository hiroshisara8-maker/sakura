import { DiaryEntry, Goal, Habit, Memory, Task, UserSettings } from '../types';
import {
  DEFAULT_ENTRIES,
  DEFAULT_GOALS,
  DEFAULT_HABITS,
  DEFAULT_MEMORIES,
  DEFAULT_SETTINGS,
  DEFAULT_TASKS,
} from '../data/constants';

const KEYS = {
  ENTRIES: 'sakura_day_entries_v1',
  TASKS: 'sakura_day_tasks_v1',
  HABITS: 'sakura_day_habits_v1',
  MEMORIES: 'sakura_day_memories_v1',
  GOALS: 'sakura_day_goals_v1',
  SETTINGS: 'sakura_day_settings_v1',
};

// Safe JSON Parse
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

// Entries
export const loadEntries = (): DiaryEntry[] => safeGet(KEYS.ENTRIES, DEFAULT_ENTRIES);
export const saveEntries = (entries: DiaryEntry[]): void => safeSet(KEYS.ENTRIES, entries);

// Tasks
export const loadTasks = (): Task[] => safeGet(KEYS.TASKS, DEFAULT_TASKS);
export const saveTasks = (tasks: Task[]): void => safeSet(KEYS.TASKS, tasks);

// Habits
export const loadHabits = (): Habit[] => safeGet(KEYS.HABITS, DEFAULT_HABITS);
export const saveHabits = (habits: Habit[]): void => safeSet(KEYS.HABITS, habits);

// Memories
export const loadMemories = (): Memory[] => safeGet(KEYS.MEMORIES, DEFAULT_MEMORIES);
export const saveMemories = (memories: Memory[]): void => safeSet(KEYS.MEMORIES, memories);

// Goals
export const loadGoals = (): Goal[] => safeGet(KEYS.GOALS, DEFAULT_GOALS);
export const saveGoals = (goals: Goal[]): void => safeSet(KEYS.GOALS, goals);

// Settings
export const loadSettings = (): UserSettings => safeGet(KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveSettings = (settings: UserSettings): void => safeSet(KEYS.SETTINGS, settings);

// Export all user data as JSON file download
export const exportAllData = (): void => {
  const data = {
    appName: 'SAKURA DAY',
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    entries: loadEntries(),
    tasks: loadTasks(),
    habits: loadHabits(),
    memories: loadMemories(),
    goals: loadGoals(),
    settings: loadSettings(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sakura_day_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Import user data from JSON file
export const importAllData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.entries) saveEntries(data.entries);
    if (data.tasks) saveTasks(data.tasks);
    if (data.habits) saveHabits(data.habits);
    if (data.memories) saveMemories(data.memories);
    if (data.goals) saveGoals(data.goals);
    if (data.settings) saveSettings(data.settings);
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
};

// Reset back to defaults
export const resetAllData = (): void => {
  safeSet(KEYS.ENTRIES, DEFAULT_ENTRIES);
  safeSet(KEYS.TASKS, DEFAULT_TASKS);
  safeSet(KEYS.HABITS, DEFAULT_HABITS);
  safeSet(KEYS.MEMORIES, DEFAULT_MEMORIES);
  safeSet(KEYS.GOALS, DEFAULT_GOALS);
  safeSet(KEYS.SETTINGS, DEFAULT_SETTINGS);
};
