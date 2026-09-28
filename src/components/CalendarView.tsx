import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Smile,
  CheckCircle2,
  Heart,
  Edit3,
  Plus,
  BookOpen,
  Calendar as CalIcon,
} from 'lucide-react';
import { DiaryEntry, Habit, Memory, MoodType, Task } from '../types';
import { MOODS, getTodayFormatted } from '../data/constants';

interface CalendarViewProps {
  entries: DiaryEntry[];
  tasks: Task[];
  habits: Habit[];
  memories: Memory[];
  onSelectDateToWrite: (date: string) => void;
  onEditEntry: (entry: DiaryEntry) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  tasks,
  habits,
  memories,
  onSelectDateToWrite,
  onEditEntry,
}) => {
  const today = getTodayFormatted();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-11

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonthDate(new Date());
    setSelectedDate(today);
  };

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  // Convert so Monday is 0, Sunday is 6
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Selected date data lookups
  const selectedEntry = entries.find((e) => e.date === selectedDate);
  const selectedTasks = tasks.filter((t) => t.date === selectedDate);
  const selectedMemories = memories.filter((m) => m.date === selectedDate);
  const selectedHabits = habits.filter((h) => h.completedDates.includes(selectedDate));
  const selectedMood = selectedEntry ? MOODS.find((m) => m.id === selectedEntry.moodId) : null;

  const monthNamesVN = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <CalIcon size={20} className="text-[#E11D48]" />
            <span>Lịch cá nhân</span>
            <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFF1F2]">
              カレンダー
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Nhìn lại nhật ký, công việc, thói quen và cảm xúc theo từng ngày
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#F3E7DE] text-xs font-semibold text-[#73635C] rounded-xl border border-[#E8DCD4] transition-colors"
          >
            Hôm nay
          </button>
          <div className="flex items-center gap-1 bg-[#FAF4F0] p-1 rounded-2xl border border-[#E8DCD4]">
            <button
              onClick={prevMonth}
              className="p-1.5 text-[#73635C] hover:text-[#3E3432] hover:bg-white rounded-xl transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-bold text-[#3E3432] min-w-[110px] text-center">
              {monthNamesVN[month]} / {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-[#73635C] hover:text-[#3E3432] hover:bg-white rounded-xl transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left (7 cols), Selected Day Details on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
              <div
                key={d}
                className={`py-2 text-[11px] font-bold ${
                  i === 6 ? 'text-[#E11D48]' : 'text-[#8E7E78]'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Previous month padding days */}
            {Array.from({ length: startOffset }).map((_, i) => {
              const dayNum = daysInPrevMonth - startOffset + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-20 sm:h-24 p-1.5 rounded-2xl bg-[#FAF8F5]/50 border border-transparent text-[#C2B4AC] text-xs flex flex-col justify-between opacity-50"
                >
                  <span className="font-mono">{dayNum}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEntry = entries.find((e) => e.date === formattedDateStr);
              const dayMemories = memories.filter((m) => m.date === formattedDateStr);
              const dayHabits = habits.filter((h) => h.completedDates.includes(formattedDateStr));
              const dayMood = dayEntry ? MOODS.find((m) => m.id === dayEntry.moodId) : null;
              const isSelected = selectedDate === formattedDateStr;
              const isToday = today === formattedDateStr;

              return (
                <button
                  key={formattedDateStr}
                  onClick={() => setSelectedDate(formattedDateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#FFF1F2] border-2 border-[#E11D48] shadow-xs'
                      : isToday
                      ? 'bg-[#FAF4F0] border-[#E8D0C7]'
                      : 'bg-[#FFFDFB] border-[#F0E6DF] hover:bg-[#FDF7F3]'
                  }`}
                >
                  {/* Day number & indicators */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-[10px]'
                          : isSelected
                          ? 'text-[#BE123C]'
                          : 'text-[#4A3E3B]'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Mood emoji if logged */}
                    {dayMood && (
                      <span className="text-xs" title={`Tâm trạng: ${dayMood.name}`}>
                        {dayMood.emoji}
                      </span>
                    )}
                  </div>

                  {/* Badges / dots in cell */}
                  <div className="space-y-1 w-full">
                    {dayEntry && (
                      <div className="w-full text-[9px] text-[#A64B62] truncate bg-[#FFE4E6] px-1 py-0.5 rounded font-medium">
                        {dayEntry.title || 'Nhật ký'}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {dayMemories.length > 0 && (
                        <span className="text-[10px]" title="Có kỷ niệm lưu giữ">
                          💗
                        </span>
                      )}
                      {dayHabits.length > 0 && (
                        <span className="text-[9px] text-[#059669] bg-[#DCFCE7] px-1 rounded-full font-mono">
                          {dayHabits.length}🌱
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-3">
            <div>
              <span className="text-xs font-mono text-[#95837B]">Chi tiết ngày</span>
              <h2 className="text-base font-bold text-[#3E3432]">
                {selectedDate}
              </h2>
            </div>

            {selectedEntry ? (
              <button
                onClick={() => onEditEntry(selectedEntry)}
                className="px-3 py-1.5 bg-[#FAF4F0] hover:bg-[#F3E7DE] text-[#BE123C] rounded-xl text-xs font-semibold border border-[#E8DCD4] transition-colors flex items-center gap-1.5"
              >
                <Edit3 size={13} />
                <span>Sửa nhật ký</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectDateToWrite(selectedDate)}
                className="px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Viết cho ngày này</span>
              </button>
            )}
          </div>

          {/* Mood on this date */}
          {selectedMood ? (
            <div className="p-3 bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] flex items-center gap-3">
              <span className="text-3xl">{selectedMood.emoji}</span>
              <div>
                <p className="text-xs font-bold text-[#3E3432]">
                  Tâm trạng: {selectedMood.name} ({selectedMood.japanese})
                </p>
                {selectedEntry?.moodReason && (
                  <p className="text-[11px] text-[#7A6962] italic">
                    "{selectedEntry.moodReason}"
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#FAF5F0] rounded-2xl text-center text-xs text-[#A89891]">
              Chưa ghi nhận tâm trạng ngày này.
            </div>
          )}

          {/* Diary Entry for this date */}
          {selectedEntry ? (
            <div className="p-4 bg-[#FFFBF8] notebook-grid rounded-2xl border border-[#EDE0D6] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#3E3432]">
                  {selectedEntry.title}
                </span>
                <div className="flex gap-1 text-xs">
                  {selectedEntry.stickers?.map((st, idx) => (
                    <span key={idx}>{st}</span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#524440] leading-relaxed line-clamp-4">
                {selectedEntry.content}
              </p>

              {/* Photos preview */}
              {selectedEntry.photos && selectedEntry.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {selectedEntry.photos.map((ph, idx) => (
                    <img
                      key={idx}
                      src={ph}
                      alt="Thumbnail"
                      className="w-full h-24 object-cover rounded-xl border border-[#E8DCD4]"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#FAF5F0] rounded-2xl text-center text-xs text-[#A89891] space-y-2">
              <p>Chưa có bài viết nhật ký cho ngày này.</p>
              <button
                onClick={() => onSelectDateToWrite(selectedDate)}
                className="text-xs text-[#E11D48] font-semibold hover:underline"
              >
                + Bấm vào đây để viết nhật ký
              </button>
            </div>
          )}

          {/* Habits completed on this date */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6962]">
              Thói quen đã hoàn thành ({selectedHabits.length})
            </span>
            {selectedHabits.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedHabits.map((h) => (
                  <span
                    key={h.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded-xl text-xs font-medium"
                  >
                    <span>{h.icon}</span>
                    <span>{h.name}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A89891]">Không có thói quen nào được check.</p>
            )}
          </div>

          {/* Memories on this date */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6962]">
              Kỷ niệm trong ngày ({selectedMemories.length})
            </span>
            {selectedMemories.length > 0 ? (
              <div className="space-y-2">
                {selectedMemories.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-2 bg-[#FFFBF8] rounded-xl border border-[#EDE0D6]"
                  >
                    <img
                      src={m.photoUrl}
                      alt={m.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#3E3432] truncate">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-[#8C7A73] truncate">
                        {m.story}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A89891]">Không có kỷ niệm lưu trữ.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
