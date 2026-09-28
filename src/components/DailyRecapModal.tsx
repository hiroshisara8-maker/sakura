import React from 'react';
import {
  X,
  Sparkles,
  Smile,
  CheckCircle2,
  Heart,
  HelpCircle,
  Share2,
  Calendar,
  Camera,
} from 'lucide-react';
import { DiaryEntry, Habit, Memory, Task, UserSettings } from '../types';
import { MOODS, getTodayFormatted } from '../data/constants';

interface DailyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  entry: DiaryEntry | null;
  tasks: Task[];
  habits: Habit[];
  memories: Memory[];
  settings: UserSettings;
}

export const DailyRecapModal: React.FC<DailyRecapModalProps> = ({
  isOpen,
  onClose,
  date,
  entry,
  tasks,
  habits,
  memories,
  settings,
}) => {
  if (!isOpen) return null;

  const todayTasks = tasks.filter((t) => t.date === date);
  const doneTasks = todayTasks.filter((t) => t.completed);
  const doneHabits = habits.filter((h) => h.completedDates.includes(date));
  const todayMemories = memories.filter((m) => m.date === date);
  const mood = entry ? MOODS.find((m) => m.id === entry.moodId) : null;

  const dateObj = new Date(date);
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const formattedDate = `${dayNames[dateObj.getDay()]}, ${dateObj.getDate()} tháng ${dateObj.getMonth() + 1}, ${dateObj.getFullYear()}`;

  const handlePrintOrShare = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <div>
              <h2 className="text-base font-bold text-[#3E3432]">
                Daily Recap · Tổng kết ngày
              </h2>
              <p className="text-xs text-[#95837B]">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrShare}
              className="p-2 text-[#7A6962] hover:text-[#3E3432] hover:bg-[#EFE3DB] rounded-full transition-colors text-xs flex items-center gap-1 font-medium"
              title="In hoặc lưu ảnh tổng kết"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Lưu / In</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7A6962] hover:text-[#3E3432] hover:bg-[#EFE3DB] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Recap Card Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto notebook-grid">
          {/* Top Washi tape decor */}
          <div className="washi-tape-pink w-36 h-5 mx-auto -mt-2 mb-2" />

          {/* User & Date Banner */}
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#E11D48] font-bold">
              ✦ SAKURA DAY JOURNEY ✦
            </span>
            <h1 className="text-2xl font-bold text-[#3E3432]">
              Hành trình ngày {date} của {settings.userName}
            </h1>
            <p className="text-xs text-[#8C7A73] italic">
              "Biết ơn những gì đã qua, trân trọng giây phút hiện tại và mỉm cười đón ngày mới."
            </p>
          </div>

          {/* Mood Section */}
          <div className="p-4 bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] flex items-center gap-4">
            <span className="text-4xl">{mood ? mood.emoji : '🌸'}</span>
            <div>
              <h3 className="text-sm font-bold text-[#3E3432]">
                Tâm trạng hôm nay: {mood ? `${mood.name} (${mood.japanese})` : 'Chưa ghi nhận'}
              </h3>
              <p className="text-xs text-[#7A6962] mt-0.5">
                {entry?.moodReason || 'Một ngày trôi qua với nhiều cảm xúc nhẹ nhàng.'}
              </p>
            </div>
          </div>

          {/* 2-column Grid: Tasks & Habits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Completed Tasks */}
            <div className="p-4 bg-[#FFFBF8] rounded-2xl border border-[#EDE0D6] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                Công việc hoàn thành ({doneTasks.length}/{todayTasks.length})
              </h4>
              {doneTasks.length > 0 ? (
                <ul className="space-y-1 text-xs text-[#4A3E3B]">
                  {doneTasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-1.5 truncate">
                      <span className="text-[#059669]">✓</span>
                      <span>{t.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#A89891]">Chưa có việc nào đánh dấu hoàn thành.</p>
              )}
            </div>

            {/* Completed Habits */}
            <div className="p-4 bg-[#FFFBF8] rounded-2xl border border-[#EDE0D6] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
                <Sparkles size={14} />
                Thói quen đã duy trì ({doneHabits.length})
              </h4>
              {doneHabits.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {doneHabits.map((h) => (
                    <span
                      key={h.id}
                      className="px-2 py-0.5 bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded-lg text-xs flex items-center gap-1"
                    >
                      <span>{h.icon}</span>
                      <span>{h.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A89891]">Chưa check thói quen nào hôm nay.</p>
              )}
            </div>
          </div>

          {/* Gratitude & Question */}
          <div className="space-y-4">
            {/* Gratitude */}
            {entry?.gratitudeList && entry.gratitudeList.length > 0 && (
              <div className="p-4 bg-[#F2FBF6] rounded-2xl border border-[#D5EFE2] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
                  <Heart size={14} />
                  Những điều biết ơn hôm nay
                </h4>
                <ul className="space-y-1 text-xs text-[#344C3F]">
                  {entry.gratitudeList.map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#059669] font-bold">🌸</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Daily Question */}
            {entry?.dailyQuestionAnswer && (
              <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#F5E2D6] space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#BE123C] flex items-center gap-1.5">
                  <HelpCircle size={14} />
                  Câu trả lời hôm nay
                </h4>
                <p className="text-xs text-[#52413C] leading-relaxed italic pl-2 border-l-2 border-[#FDA4AF]">
                  "{entry.dailyQuestionAnswer}"
                </p>
              </div>
            )}
          </div>

          {/* Highlight Photo */}
          {entry?.photos && entry.photos.length > 0 && (
            <div className="p-3 bg-white rounded-2xl border border-[#EADBCE] shadow-xs">
              <img
                src={entry.photos[0]}
                alt="Highlight of the day"
                className="w-full h-48 sm:h-64 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <p className="text-[11px] text-[#8C7A73] text-center mt-2 italic">
                {entry.photoCaptions?.[entry.photos[0]] || 'Khoảnh khắc đáng nhớ trong ngày 🌸'}
              </p>
            </div>
          )}

          {/* Footer stamp */}
          <div className="text-center pt-4 border-t border-[#F0E4DC]">
            <span className="text-sm font-japanese text-[#E11D48] font-bold">
              桜の日 · SAKURA DAY · おやすみなさい (Chúc ngủ ngon)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
