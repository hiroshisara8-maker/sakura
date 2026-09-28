/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  DiaryEntry,
  Goal,
  Habit,
  Memory,
  MoodType,
  Task,
  UserSettings,
} from './types';
import {
  loadEntries,
  saveEntries,
  loadTasks,
  saveTasks,
  loadHabits,
  saveHabits,
  loadMemories,
  saveMemories,
  loadGoals,
  saveGoals,
  loadSettings,
  saveSettings,
} from './utils/storage';
import { getTodayFormatted } from './data/constants';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { MemoryBoxView } from './components/MemoryBoxView';
import { TimelineView } from './components/TimelineView';
import { HabitsView } from './components/HabitsView';
import { TasksView } from './components/TasksView';
import { GoalsView } from './components/GoalsView';
import { StatisticsView } from './components/StatisticsView';
import { SearchView } from './components/SearchView';
import { ProfileView } from './components/ProfileView';
import { JournalEditorModal } from './components/JournalEditorModal';
import { DailyRecapModal } from './components/DailyRecapModal';
import { AmbientPlayer } from './components/AmbientPlayer';
import { PenTool, Sparkles } from 'lucide-react';

export default function App() {
  const [todayDate] = useState<string>(getTodayFormatted());
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');

  // Application Data States
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [memories, setMemories] = useState<Memory[]>(() => loadMemories());
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());

  // Modal States
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [targetDateForWrite, setTargetDateForWrite] = useState<string>(todayDate);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  // Sync to Storage
  const updateEntries = (newEntries: DiaryEntry[]) => {
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const updateHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const updateMemories = (newMemories: Memory[]) => {
    setMemories(newMemories);
    saveMemories(newMemories);
  };

  const updateGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const updateUserSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const reloadAllDataFromStorage = () => {
    setEntries(loadEntries());
    setTasks(loadTasks());
    setHabits(loadHabits());
    setMemories(loadMemories());
    setGoals(loadGoals());
    setSettings(loadSettings());
  };

  // Find today's entry
  const todayEntry = entries.find((e) => e.date === todayDate) || null;

  // Handlers for Entries
  const handleSaveEntry = (savedEntry: DiaryEntry) => {
    const existingIndex = entries.findIndex((e) => e.id === savedEntry.id || e.date === savedEntry.date);
    if (existingIndex >= 0) {
      const copy = [...entries];
      copy[existingIndex] = savedEntry;
      updateEntries(copy);
    } else {
      updateEntries([savedEntry, ...entries]);
    }
  };

  const handleOpenQuickWrite = (targetDate?: string) => {
    const d = targetDate || todayDate;
    const existing = entries.find((e) => e.date === d) || null;
    setEditingEntry(existing);
    setTargetDateForWrite(d);
    setIsWriteModalOpen(true);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setTargetDateForWrite(entry.date);
    setIsWriteModalOpen(true);
  };

  // Quick 1-tap mood for today
  const handleQuickMoodSelect = (moodId: MoodType) => {
    if (todayEntry) {
      const updated: DiaryEntry = {
        ...todayEntry,
        moodId,
      };
      handleSaveEntry(updated);
    } else {
      const newEntry: DiaryEntry = {
        id: `entry-${Date.now()}`,
        date: todayDate,
        createdAt: new Date().toISOString(),
        title: 'Nhật ký hôm nay 🌸',
        content: '',
        moodId,
        photos: [],
        tags: ['Nhật ký'],
        stickers: ['🌸'],
        gratitudeList: [],
      };
      handleSaveEntry(newEntry);
    }
  };

  // Quick answer update for daily question
  const handleUpdateDailyAnswer = (answer: string) => {
    if (todayEntry) {
      const updated: DiaryEntry = {
        ...todayEntry,
        dailyQuestionAnswer: answer,
      };
      handleSaveEntry(updated);
    } else {
      const newEntry: DiaryEntry = {
        id: `entry-${Date.now()}`,
        date: todayDate,
        createdAt: new Date().toISOString(),
        title: 'Nhật ký hôm nay 🌸',
        content: '',
        moodId: 'great',
        photos: [],
        tags: ['Nhật ký'],
        stickers: ['🌸'],
        gratitudeList: [],
        dailyQuestionAnswer: answer,
      };
      handleSaveEntry(newEntry);
    }
  };

  // Habit Handlers
  const handleToggleHabitDay = (habitId: string, date: string) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;
      const isCompleted = h.completedDates.includes(date);
      return {
        ...h,
        completedDates: isCompleted
          ? h.completedDates.filter((d) => d !== date)
          : [...h.completedDates, date],
      };
    });
    updateHabits(updated);
  };

  const handleToggleHabitToday = (habitId: string) => {
    handleToggleHabitDay(habitId, todayDate);
  };

  const handleAddHabit = (habit: Habit) => {
    updateHabits([...habits, habit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    updateHabits(habits.filter((h) => h.id !== habitId));
  };

  // Task Handlers
  const handleAddTask = (
    text: string,
    timeSlot: Task['timeSlot'],
    priority: Task['priority'],
    date?: string
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      date: date || todayDate,
      text,
      completed: false,
      priority,
      timeSlot,
    };
    updateTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    updateTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Memory Handlers
  const handleAddMemory = (memory: Memory) => {
    updateMemories([memory, ...memories]);
  };

  const handleDeleteMemory = (id: string) => {
    updateMemories(memories.filter((m) => m.id !== id));
  };

  const handleToggleSpecialMemory = (id: string) => {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, isSpecial: !m.isSpecial } : m
    );
    updateMemories(updated);
  };

  // Goal Handlers
  const handleAddGoal = (goal: Goal) => {
    updateGoals([...goals, goal]);
  };

  const handleUpdateGoalProgress = (goalId: string, progress: number) => {
    const updated = goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            progress: Math.min(100, Math.max(0, progress)),
            completed: progress >= 100,
          }
        : g
    );
    updateGoals(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    updateGoals(goals.filter((g) => g.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A3E3D] flex flex-col lg:flex-row relative overflow-x-hidden">
      
      {/* Decorative Falling Sakura Petal particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <span className="absolute left-[10%] text-sm animate-petal">🌸</span>
        <span className="absolute left-[35%] text-xs animate-petal" style={{ animationDelay: '3s' }}>🌸</span>
        <span className="absolute left-[65%] text-sm animate-petal" style={{ animationDelay: '6s' }}>🌸</span>
        <span className="absolute left-[85%] text-xs animate-petal" style={{ animationDelay: '9s' }}>🌸</span>
      </div>

      {/* Desktop Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickWrite={() => handleOpenQuickWrite(todayDate)}
        settings={settings}
        entryCount={entries.length}
        memoryCount={memories.length}
      />

      {/* Mobile Top Header (Sticky, <= 56px per mobile constitution) */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#FFFDFB]/95 backdrop-blur-md border-b border-[#F2E5DC] shadow-[0_1px_8px_rgba(200,160,140,0.06)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <span className="text-sm font-bold tracking-tight text-[#3E3432]">
            SAKURA DAY
          </span>
          <span className="text-[10px] text-[#E11D48] font-japanese font-semibold px-1.5 py-0.2 rounded-full bg-[#FFF1F2]">
            桜の日
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AmbientPlayer compact={true} />
          <button
            onClick={() => handleOpenQuickWrite(todayDate)}
            className="p-2 bg-[#E11D48] text-white rounded-xl shadow-xs"
            aria-label="Viết nhật ký"
          >
            <PenTool size={15} />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full z-10">
        {activeTab === 'today' && (
          <TodayView
            todayDate={todayDate}
            entry={todayEntry}
            tasks={tasks}
            habits={habits}
            settings={settings}
            onOpenWriteModal={() => handleOpenQuickWrite(todayDate)}
            onEditEntry={handleEditEntry}
            onQuickMoodSelect={handleQuickMoodSelect}
            onToggleHabit={handleToggleHabitToday}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateDailyAnswer={handleUpdateDailyAnswer}
            onOpenRecap={() => setIsRecapModalOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            entries={entries}
            tasks={tasks}
            habits={habits}
            memories={memories}
            onSelectDateToWrite={(date) => handleOpenQuickWrite(date)}
            onEditEntry={handleEditEntry}
          />
        )}

        {activeTab === 'memories' && (
          <MemoryBoxView
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            onToggleSpecial={handleToggleSpecialMemory}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            entries={entries}
            memories={memories}
            habits={habits}
            onSelectEntry={handleEditEntry}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            onToggleHabitDay={handleToggleHabitDay}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'stats' && (
          <StatisticsView
            entries={entries}
            habits={habits}
            memories={memories}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            entries={entries}
            memories={memories}
            onSelectEntry={handleEditEntry}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            settings={settings}
            onUpdateSettings={updateUserSettings}
            setActiveTab={setActiveTab}
            onDataReset={reloadAllDataFromStorage}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickWrite={() => handleOpenQuickWrite(todayDate)}
      />

      {/* Full Journal Editor Modal */}
      <JournalEditorModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
        targetDate={targetDateForWrite}
      />

      {/* Daily Recap Modal */}
      <DailyRecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        date={todayDate}
        entry={todayEntry}
        tasks={tasks}
        habits={habits}
        memories={memories}
        settings={settings}
      />
    </div>
  );
}
