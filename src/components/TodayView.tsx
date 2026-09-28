import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Smile,
  Heart,
  HelpCircle,
  BookOpen,
  Camera,
  Share2,
  Edit3,
  Check,
  ChevronRight,
  Flame,
  Clock,
  Tag,
} from 'lucide-react';
import { DiaryEntry, Habit, MoodType, Task, UserSettings } from '../types';
import { MOODS, DAILY_QUESTIONS, getTodayFormatted } from '../data/constants';

interface TodayViewProps {
  todayDate: string;
  entry: DiaryEntry | null;
  tasks: Task[];
  habits: Habit[];
  settings: UserSettings;
  onOpenWriteModal: () => void;
  onEditEntry: (entry: DiaryEntry) => void;
  onQuickMoodSelect: (mood: MoodType) => void;
  onToggleHabit: (habitId: string) => void;
  onAddTask: (text: string, timeSlot: Task['timeSlot'], priority: Task['priority']) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateDailyAnswer: (answer: string) => void;
  onOpenRecap: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  todayDate,
  entry,
  tasks,
  habits,
  settings,
  onOpenWriteModal,
  onEditEntry,
  onQuickMoodSelect,
  onToggleHabit,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateDailyAnswer,
  onOpenRecap,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTimeSlot, setNewTaskTimeSlot] = useState<Task['timeSlot']>('morning');
  const [dailyAnswerInput, setDailyAnswerInput] = useState(entry?.dailyQuestionAnswer || '');
  const [isAnswerSaved, setIsAnswerSaved] = useState(false);

  // Date formatting in Vietnamese & Japanese style
  const dateObj = new Date(todayDate);
  const dayOfWeekNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayOfWeekNames[dateObj.getDay()];
  const formattedDateVN = `${dayName}, ngày ${dateObj.getDate()} tháng ${dateObj.getMonth() + 1}, ${dateObj.getFullYear()}`;

  // Curated question
  const dayNum = parseInt(todayDate.slice(-2), 10) || 1;
  const currentQuestion = DAILY_QUESTIONS[dayNum % DAILY_QUESTIONS.length];

  // Current mood definition
  const currentMood = MOODS.find((m) => m.id === (entry?.moodId || 'great'));

  // Calculate habit stats for today
  const todayHabitsCompleted = habits.filter((h) => h.completedDates.includes(todayDate)).length;
  const habitPercentage = habits.length > 0 ? Math.round((todayHabitsCompleted / habits.length) * 100) : 0;

  // Filter tasks for today
  const todayTasks = tasks.filter((t) => t.date === todayDate);
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask(newTaskText.trim(), newTaskTimeSlot, 'normal');
    setNewTaskText('');
  };

  const handleSaveAnswer = () => {
    onUpdateDailyAnswer(dailyAnswerInput);
    setIsAnswerSaved(true);
    setTimeout(() => setIsAnswerSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Japanese Sakura Greeting Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-[#FFFDFB] to-[#FDF2F4] border border-[#F5E2DE] p-6 sm:p-8 shadow-[0_8px_30px_rgba(235,180,180,0.12)]">
        {/* Subtle background cover watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/sakura_hero_cover_1790563457888.jpg"
            alt="Sakura blossoms"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E11D48] bg-[#FFE4E6] px-3 py-1 rounded-full">
              Konnichiwa, {settings.userName} san
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#3A2F2D]">
            {formattedDateVN}
          </h1>

          <p className="text-sm text-[#87756F] leading-relaxed italic">
            "Mỗi khoảnh khắc trôi qua đều là một cánh hoa nở rộ, hãy giữ lại những kỷ niệm đẹp nhất cho riêng mình."
            <span className="block mt-1 font-japanese not-italic text-xs text-[#E11D48]">
              日日是好日 (Mỗi ngày đều là một ngày đẹp)
            </span>
          </p>

          {/* Quick Recap CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenWriteModal}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-[0_4px_14px_rgba(225,29,72,0.25)] hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 size={15} />
              <span>{entry ? 'Chỉnh sửa nhật ký hôm nay' : 'Viết nhật ký hôm nay'}</span>
            </button>

            <button
              onClick={onOpenRecap}
              className="px-4 py-2.5 bg-white text-[#7A6760] hover:text-[#3A2F2D] hover:bg-[#FDF6F2] rounded-xl text-xs font-semibold border border-[#EADBCE] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} className="text-[#E11D48]" />
              <span>Daily Recap (Tổng kết ngày)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Mood Tracker Bar */}
      <div className="p-4 sm:p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile size={16} className="text-[#E11D48]" />
            <h2 className="text-sm font-bold text-[#3E3432]">
              Tâm trạng của bạn lúc này
            </h2>
          </div>
          {currentMood && (
            <span className="text-xs text-[#8F7C75]">
              Hiện tại: <strong className="text-[#E11D48]">{currentMood.name}</strong> ({currentMood.japanese.split(' ')[0]})
            </span>
          )}
        </div>

        {/* 1-Tap Mood Selector */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {MOODS.map((m) => {
            const isSelected = entry?.moodId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onQuickMoodSelect(m.id)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFE4E6] border-2 border-[#E11D48] shadow-xs scale-105'
                    : 'bg-[#FAF5F0] border border-[#EDE0D6] hover:bg-[#F3E7DE]'
                }`}
                title={m.name}
              >
                <span className="text-xl sm:text-2xl">{m.emoji}</span>
                <span className="hidden sm:inline text-[11px] font-medium text-[#4A3E3B] mt-1">
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>

        {entry?.moodReason && (
          <p className="text-xs text-[#7A6962] bg-[#FAF5F0] px-3.5 py-2 rounded-xl border border-[#EFE2D8]">
            <span className="font-semibold text-[#3E3432]">Lý do: </span>
            {entry.moodReason}
          </p>
        )}
      </div>

      {/* 3. Habit Tracker Quick Check Bar */}
      <div className="p-4 sm:p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#059669]" />
            <h2 className="text-sm font-bold text-[#3E3432]">
              Thói quen hôm nay (Habit Tracker)
            </h2>
          </div>
          <span className="text-xs text-[#059669] font-semibold bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
            {todayHabitsCompleted}/{habits.length} hoàn thành ({habitPercentage}%)
          </span>
        </div>

        {/* Horizontal Tap-to-Check Habit Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(todayDate);
            return (
              <button
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                  isCompleted
                    ? 'bg-[#F0FDF4] border-[#86EFAC] shadow-xs'
                    : 'bg-[#FAF5F0] border-[#EDE0D6] hover:bg-[#F3E7DE]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{habit.icon}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? 'bg-[#059669] text-white' : 'bg-white border border-[#D5C5B9]'
                    }`}
                  >
                    {isCompleted && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#3C322E] truncate">
                    {habit.name}
                  </p>
                  <p className="text-[10px] text-[#8C7A73]">
                    {isCompleted ? 'Đã check' : 'Chưa làm'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Grid: Today's Tasks & Today's Journal Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: To-Do Tasks Management (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#3B82F6]" />
              <h2 className="text-sm font-bold text-[#3E3432]">
                Việc cần làm hôm nay
              </h2>
            </div>
            <span className="text-xs text-[#7A6962] font-mono tabular-nums">
              {completedTasksCount}/{todayTasks.length} xong
            </span>
          </div>

          {/* Add Task input */}
          <form onSubmit={handleCreateTask} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Thêm việc cần làm hôm nay..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
              />
              <button
                type="submit"
                className="p-2 bg-[#E11D48] text-white rounded-xl hover:bg-[#BE123C] transition-colors cursor-pointer shrink-0"
                title="Thêm việc"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Time Slot selector for task */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#7A6962]">
              <span className="font-medium">Khung giờ:</span>
              {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setNewTaskTimeSlot(slot)}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    newTaskTimeSlot === slot
                      ? 'bg-[#FFE4E6] text-[#BE123C] font-semibold'
                      : 'bg-[#FAF5F0] text-[#786C67] hover:bg-[#F3E7DE]'
                  }`}
                >
                  {slot === 'morning' ? 'Sáng' : slot === 'afternoon' ? 'Chiều' : 'Tối'}
                </button>
              ))}
            </div>
          </form>

          {/* Tasks List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {todayTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#A89891]">
                Chưa có công việc nào cho hôm nay. Thêm một việc để bắt đầu nhé! 🌸
              </div>
            ) : (
              todayTasks.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    t.completed
                      ? 'bg-[#F9F7F5] border-[#EAE0D8] opacity-75'
                      : 'bg-[#FFFDF9] border-[#EDE0D6] hover:border-[#DBC4B8]'
                  }`}
                >
                  <div
                    onClick={() => onToggleTask(t.id)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <button
                      type="button"
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        t.completed
                          ? 'bg-[#059669] text-white'
                          : 'border border-[#C9B9AF] hover:border-[#E11D48]'
                      }`}
                    >
                      {t.completed && <Check size={11} strokeWidth={3} />}
                    </button>
                    <span
                      className={`text-xs text-[#3E3432] truncate ${
                        t.completed ? 'line-through text-[#9E8E87]' : ''
                      }`}
                    >
                      {t.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] text-[#A3928B] bg-[#F5ECE5] px-1.5 py-0.5 rounded-md">
                      {t.timeSlot === 'morning' ? 'Sáng' : t.timeSlot === 'afternoon' ? 'Chiều' : 'Tối'}
                    </span>
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="text-[#BFAFA7] hover:text-red-500 p-1 transition-colors"
                      title="Xóa công việc"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Today's Diary / Scrapbook Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {entry ? (
            /* Written Diary Card */
            <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-[0_4px_16px_rgba(200,160,140,0.08)] relative overflow-hidden notebook-grid">
              
              {/* Cute Washi Tape Decor */}
              <div className="absolute -top-1 left-8 w-28 h-5 washi-tape-pink opacity-80" />

              <div className="flex items-start justify-between mb-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#95837B] font-mono">
                      {entry.date}
                    </span>
                    <span className="text-xs text-[#E11D48]">✦</span>
                    <div className="flex gap-1 text-sm">
                      {entry.stickers?.map((st, i) => (
                        <span key={i}>{st}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#3A2F2D]">
                    {entry.title}
                  </h3>
                </div>

                <button
                  onClick={() => onEditEntry(entry)}
                  className="p-2 text-[#8C7A73] hover:text-[#E11D48] hover:bg-[#FFE4E6] rounded-xl transition-colors cursor-pointer"
                  title="Chỉnh sửa nhật ký"
                >
                  <Edit3 size={16} />
                </button>
              </div>

              {/* Diary Content */}
              <p className="text-xs sm:text-sm text-[#4E413E] leading-relaxed whitespace-pre-line mb-4 font-normal">
                {entry.content}
              </p>

              {/* Photos inside journal */}
              {entry.photos && entry.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {entry.photos.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-xl shadow-xs border border-[#EAE0D8] transform rotate-[-0.5deg]"
                    >
                      <img
                        src={p}
                        alt="Diary"
                        className="w-full h-32 sm:h-40 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      {entry.photoCaptions && entry.photoCaptions[p] && (
                        <p className="text-[11px] text-[#7A6962] italic mt-1.5 text-center truncate">
                          {entry.photoCaptions[p]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Gratitude List Preview */}
              {entry.gratitudeList && entry.gratitudeList.length > 0 && (
                <div className="mt-4 p-3 bg-[#F2FBF6] rounded-2xl border border-[#D5EFE2] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                    <Heart size={12} />
                    Điều biết ơn hôm nay:
                  </span>
                  {entry.gratitudeList.map((g, i) => (
                    <p key={i} className="text-xs text-[#2F4F3E] pl-2 border-l-2 border-[#A7F3D0]">
                      {g}
                    </p>
                  ))}
                </div>
              )}

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-[#F2E5DC]">
                  {entry.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-[#8A756D] bg-[#FAF3ED] px-2 py-0.5 rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Prompt to write diary today */
            <div className="p-8 bg-[#FFFDF9] rounded-3xl border-2 border-dashed border-[#E8DCD4] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center text-3xl mx-auto shadow-xs">
                🌸
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#3E3432]">
                  Bạn chưa viết nhật ký hôm nay
                </h3>
                <p className="text-xs text-[#8C7A73] max-w-sm mx-auto">
                  Dành ra 3 phút lắng đọng để ghi lại những cảm xúc và câu chuyện đáng nhớ của ngày hôm nay nhé.
                </p>
              </div>
              <button
                onClick={onOpenWriteModal}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-[0_4px_12px_rgba(225,29,72,0.25)] hover:brightness-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Edit3 size={15} />
                <span>Viết ngay bây giờ</span>
              </button>
            </div>
          )}

          {/* Daily Question Answer Box */}
          <div className="p-5 bg-[#FFFBF8] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={15} className="text-[#BE123C]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#BE123C]">
                  Câu hỏi hôm nay (Daily Question)
                </h3>
              </div>
              {isAnswerSaved && (
                <span className="text-[11px] text-[#059669] font-medium animate-in fade-in">
                  ✓ Đã lưu câu trả lời
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#4A3D39] italic">
              "{currentQuestion}"
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Câu trả lời của bạn..."
                value={dailyAnswerInput}
                onChange={(e) => setDailyAnswerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAnswer();
                }}
                className="flex-1 px-3 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
              />
              <button
                onClick={handleSaveAnswer}
                className="px-3.5 py-2 bg-[#E11D48] text-white text-xs font-semibold rounded-xl hover:bg-[#BE123C] transition-colors shrink-0 cursor-pointer"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
