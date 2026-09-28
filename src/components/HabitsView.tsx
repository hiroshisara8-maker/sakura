import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Check,
  Flame,
  Trash2,
  Calendar,
  X,
  Award,
} from 'lucide-react';
import { Habit } from '../types';
import { getOffsetDateFormatted, getTodayFormatted } from '../data/constants';

interface HabitsViewProps {
  habits: Habit[];
  onToggleHabitDay: (habitId: string, date: string) => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onToggleHabitDay,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍵');
  const [category, setCategory] = useState('Đời sống');
  const [targetDays, setTargetDays] = useState(7);

  // Generate last 7 days for tracker header
  const days = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const dateStr = getOffsetDateFormatted(offset);
    const d = new Date(dateStr);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return {
      dateStr,
      label: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      isToday: offset === 0,
    };
  });

  const availableIcons = ['🍵', '📚', '🇯🇵', '💧', '🏃‍♀️', '🌙', '🧹', '🎨', '🧘', '✏️', '🥗', '🌿'];

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name: name.trim(),
      icon,
      category,
      targetDaysPerWeek: targetDays,
      completedDates: [],
      color: '#F472B6',
    };

    onAddHabit(newHabit);
    setIsAddOpen(false);
    setName('');
  };

  // Helper to calculate habit streak
  const calculateStreak = (completedDates: string[]): number => {
    let streak = 0;
    let checkDate = new Date();

    // Check if today or yesterday is completed
    const todayStr = getTodayFormatted();
    const yesterdayStr = getOffsetDateFormatted(-1);

    if (!completedDates.includes(todayStr) && !completedDates.includes(yesterdayStr)) {
      return 0;
    }

    let offset = completedDates.includes(todayStr) ? 0 : -1;
    while (true) {
      const dStr = getOffsetDateFormatted(offset);
      if (completedDates.includes(dStr)) {
        streak++;
        offset--;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <Sparkles size={20} className="text-[#059669]" />
            <span>Theo dõi thói quen (Habit Tracker)</span>
            <span className="text-xs text-[#059669] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#DCFCE7]">
              習慣
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Xây dựng nếp sống tích cực qua từng hành động nhỏ mỗi ngày
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#34D399] to-[#059669] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm thói quen mới</span>
        </button>
      </div>

      {/* Habits Table / Card Layout */}
      <div className="p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
        {/* Date Headers */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 items-center pb-3 border-b border-[#F0E4DC] text-xs font-bold text-[#8C7A73]">
          <div className="sm:col-span-5">Thói quen</div>
          <div className="sm:col-span-2 text-center">Chuỗi ngày (Streak)</div>
          <div className="sm:col-span-5 flex justify-around">
            {days.map((d) => (
              <div
                key={d.dateStr}
                className={`text-center flex flex-col items-center ${
                  d.isToday ? 'text-[#E11D48] font-bold' : ''
                }`}
              >
                <span className="text-[10px] uppercase">{d.label}</span>
                <span className="font-mono text-xs">{d.dayNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Rows */}
        <div className="space-y-3">
          {habits.map((habit) => {
            const streak = calculateStreak(habit.completedDates);
            return (
              <div
                key={habit.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE2D8] hover:border-[#DFCFC4] transition-all grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Info */}
                <div className="sm:col-span-5 flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#3E3432]">
                        {habit.name}
                      </h4>
                      <span className="text-[10px] text-[#9E8E87] bg-white px-2 py-0.5 rounded-md">
                        {habit.category} · {habit.targetDaysPerWeek} ngày/tuần
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="sm:hidden text-[#BFAFA7] hover:text-red-500 p-1"
                    title="Xóa thói quen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Streak */}
                <div className="sm:col-span-2 flex items-center justify-start sm:justify-center gap-1.5 text-xs font-bold text-[#D97706]">
                  <Flame size={15} className={streak > 0 ? 'text-[#EA580C] fill-[#EA580C]' : 'text-[#D1C7BD]'} />
                  <span>{streak} ngày liên tiếp</span>
                </div>

                {/* 7 Days Checkboxes */}
                <div className="sm:col-span-5 flex items-center justify-around pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFE2D8]">
                  {days.map((d) => {
                    const isChecked = habit.completedDates.includes(d.dateStr);
                    return (
                      <div key={d.dateStr} className="flex flex-col items-center gap-1">
                        <span className="sm:hidden text-[9px] text-[#A69690]">{d.label}</span>
                        <button
                          onClick={() => onToggleHabitDay(habit.id, d.dateStr)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#059669] text-white shadow-xs scale-105'
                              : 'bg-white border border-[#D5C5B9] hover:border-[#059669]'
                          }`}
                          title={`Ngày ${d.dateStr}: ${isChecked ? 'Đã hoàn thành' : 'Chưa hoàn thành'}`}
                        >
                          {isChecked && <Check size={16} strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="hidden sm:block text-[#BFAFA7] hover:text-red-500 p-1.5 ml-2 transition-colors"
                    title="Xóa thói quen"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]">
              <h3 className="text-base font-bold text-[#3E3330]">
                Tạo thói quen mới
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-[#8F7D75]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Tên thói quen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đọc sách, Học tiếng Nhật, Uống nước..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Biểu tượng
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                        icon === ic ? 'bg-[#DCFCE7] ring-2 ring-[#059669]' : 'bg-[#FAF5F0]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                    Mục tiêu (ngày/tuần)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={targetDays}
                    onChange={(e) => setTargetDays(parseInt(e.target.value, 10) || 7)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E4DC]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7D6B64]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#059669] text-white rounded-xl text-xs font-semibold"
                >
                  Lưu thói quen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
