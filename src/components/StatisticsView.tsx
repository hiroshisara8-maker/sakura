import React from 'react';
import {
  BarChart3,
  Flame,
  BookOpen,
  Heart,
  Smile,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DiaryEntry, Habit, Memory } from '../types';
import { MOODS, getOffsetDateFormatted, getTodayFormatted } from '../data/constants';

interface StatisticsViewProps {
  entries: DiaryEntry[];
  habits: Habit[];
  memories: Memory[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  entries,
  habits,
  memories,
}) => {
  const today = getTodayFormatted();

  // 1. Calculate Diary Streak
  const entryDates = new Set(entries.map((e) => e.date));
  let currentStreak = 0;
  let offset = entryDates.has(today) ? 0 : -1;
  while (true) {
    const dStr = getOffsetDateFormatted(offset);
    if (entryDates.has(dStr)) {
      currentStreak++;
      offset--;
    } else {
      break;
    }
  }

  // 2. Mood Frequency Count
  const moodCounts: Record<string, number> = {};
  entries.forEach((e) => {
    moodCounts[e.moodId] = (moodCounts[e.moodId] || 0) + 1;
  });

  // 3. Habit Completion Rate for past 14 days
  let totalHabitOpportunities = habits.length * 14;
  let totalHabitCompletions = 0;
  for (let i = 0; i < 14; i++) {
    const dStr = getOffsetDateFormatted(-i);
    habits.forEach((h) => {
      if (h.completedDates.includes(dStr)) totalHabitCompletions++;
    });
  }
  const habitRate =
    totalHabitOpportunities > 0
      ? Math.round((totalHabitCompletions / totalHabitOpportunities) * 100)
      : 0;

  // 4. Past 28 days activity heatmap
  const past28Days = Array.from({ length: 28 }, (_, i) => {
    const dStr = getOffsetDateFormatted(-(27 - i));
    const hasEntry = entryDates.has(dStr);
    const dayHabits = habits.filter((h) => h.completedDates.includes(dStr)).length;
    return {
      dateStr: dStr,
      hasEntry,
      dayHabits,
    };
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
          <BarChart3 size={20} className="text-[#E11D48]" />
          <span>Thống kê cuộc sống (Statistics)</span>
          <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFE4E6]">
            統計
          </span>
        </h1>
        <p className="text-xs text-[#95837B]">
          Những con số biết nói về hành trình rèn luyện và cảm xúc của bạn
        </p>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="p-5 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#EA580C]">
            <Flame size={20} className="fill-[#EA580C]" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A69690]">
              Chuỗi ngày
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#3E3432] font-mono tabular-nums">
            {currentStreak} <span className="text-sm font-sans font-normal text-[#8C7A73]">ngày</span>
          </p>
          <p className="text-[11px] text-[#A69690]">Duy trì viết nhật ký liên tiếp</p>
        </div>

        {/* Metric 2: Total Entries */}
        <div className="p-5 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#E11D48]">
            <BookOpen size={20} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A69690]">
              Trang nhật ký
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#3E3432] font-mono tabular-nums">
            {entries.length} <span className="text-sm font-sans font-normal text-[#8C7A73]">bài</span>
          </p>
          <p className="text-[11px] text-[#A69690]">Đã được lưu giữ vào sổ</p>
        </div>

        {/* Metric 3: Habit Adherence */}
        <div className="p-5 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#059669]">
            <CheckCircle2 size={20} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A69690]">
              Thói quen
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#3E3432] font-mono tabular-nums">
            {habitRate}%
          </p>
          <p className="text-[11px] text-[#A69690]">Tỷ lệ hoàn thành 14 ngày qua</p>
        </div>

        {/* Metric 4: Memories */}
        <div className="p-5 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#BE123C]">
            <Heart size={20} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A69690]">
              Hộp ký ức
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#3E3432] font-mono tabular-nums">
            {memories.length} <span className="text-sm font-sans font-normal text-[#8C7A73]">khoảnh khắc</span>
          </p>
          <p className="text-[11px] text-[#A69690]">Hình ảnh & câu chuyện đặc biệt</p>
        </div>
      </div>

      {/* Activity Heatmap Grid (28 days) */}
      <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#3E3432] flex items-center gap-2">
            <Calendar size={16} className="text-[#E11D48]" />
            <span>Mức độ hoạt động 28 ngày qua (Activity Heatmap)</span>
          </h3>
          <span className="text-xs text-[#8C7A73]">
            🌸 Có viết nhật ký
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {past28Days.map((d, i) => {
            const hasWritten = d.hasEntry;
            return (
              <div
                key={d.dateStr}
                className={`p-2 rounded-xl text-center border transition-all ${
                  hasWritten
                    ? 'bg-[#FFE4E6] border-[#FDA4AF] shadow-xs'
                    : d.dayHabits > 0
                    ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                    : 'bg-[#FAF5F0] border-transparent opacity-60'
                }`}
                title={`Ngày ${d.dateStr}: ${hasWritten ? 'Đã viết nhật ký' : 'Chưa viết'} · ${d.dayHabits} thói quen`}
              >
                <p className="text-[9px] text-[#A69690] leading-none mb-1 font-mono">
                  {d.dateStr.slice(-2)}
                </p>
                <div className="text-xs">
                  {hasWritten ? '🌸' : d.dayHabits > 0 ? '🌱' : '·'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#3E3432] flex items-center gap-2">
          <Smile size={16} className="text-[#F43F5E]" />
          <span>Phân bổ tâm trạng thường gặp (Mood Breakdown)</span>
        </h3>

        <div className="space-y-2.5">
          {MOODS.map((m) => {
            const count = moodCounts[m.id] || 0;
            const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;

            return (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#4A3E3B]">
                    <span>{m.emoji}</span>
                    <span>{m.name}</span>
                    <span className="text-[10px] text-[#9E8E87] font-japanese">
                      ({m.japanese.split(' ')[0]})
                    </span>
                  </span>
                  <span className="font-mono text-[#7A6962] tabular-nums">
                    {count} lần ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-[#FAF5F0] h-2 rounded-full overflow-hidden border border-[#EADBCE]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
