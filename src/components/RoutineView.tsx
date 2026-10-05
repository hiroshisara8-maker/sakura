import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Check,
  Trash2,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Coffee,
  X,
} from 'lucide-react';
import { RoutineItem } from '../types';

interface RoutineViewProps {
  routines: RoutineItem[];
  onToggleRoutine: (id: string) => void;
  onAddRoutine: (routine: RoutineItem) => void;
  onDeleteRoutine: (id: string) => void;
  onResetDailyRoutines: () => void;
}

export const RoutineView: React.FC<RoutineViewProps> = ({
  routines,
  onToggleRoutine,
  onAddRoutine,
  onDeleteRoutine,
  onResetDailyRoutines,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<RoutineItem['period'] | 'all'>('all');

  // Form state
  const [time, setTime] = useState('07:00');
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<RoutineItem['period']>('morning');
  const [icon, setIcon] = useState('🌅');

  const availableIcons = ['🌅', '🍳', '💻', '🍱', '💧', '🏃‍♀️', '🥗', '🛁', '📖', '🌙', '🧹', '🍵', '🧘', '🧺'];

  const periods = [
    { id: 'all', label: 'Cả ngày', icon: Sparkles },
    { id: 'morning', label: 'Buổi sáng', icon: Sun },
    { id: 'afternoon', label: 'Buổi chiều', icon: Coffee },
    { id: 'evening', label: 'Buổi tối', icon: Sunset },
    { id: 'night', label: 'Đêm & Nghỉ ngơi', icon: Moon },
  ] as const;

  const filteredRoutines = routines.filter((r) =>
    selectedPeriod === 'all' ? true : r.period === selectedPeriod
  );

  const completedCount = routines.filter((r) => r.completed).length;
  const progressPct = routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRoutine: RoutineItem = {
      id: `rt-${Date.now()}`,
      time,
      title: title.trim(),
      period,
      completed: false,
      icon,
    };

    onAddRoutine(newRoutine);
    setIsAddOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={20} className="text-[#E11D48]" />
            <h1 className="text-xl font-bold text-[#3E3432]">
              Lịch trình sinh hoạt cá nhân (Daily Routine)
            </h1>
            <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFE4E6]">
              日課
            </span>
          </div>
          <p className="text-xs text-[#95837B]">
            Thiết lập nhịp sinh hoạt khoa học từ lúc thức dậy đến khi đi ngủ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDailyRoutines}
            className="px-3 py-2 text-xs font-semibold text-[#8C7A73] hover:text-[#3E3432] bg-[#FAF5F0] hover:bg-[#F3E7DE] rounded-xl border border-[#EDE0D6] transition-colors"
            title="Làm mới trạng thái tích chọn cho ngày mới"
          >
            Làm mới ngày mới
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm nhịp sinh hoạt</span>
          </button>
        </div>
      </div>

      {/* Routine Progress Hero Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#FFF5F7] via-[#FFFDFB] to-[#FAF5F0] rounded-3xl border border-[#F5E2DE] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-[11px] font-bold text-[#BE123C] uppercase tracking-wider">
              ✦ Nhịp sống hôm nay ✦
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#3E3432]">
              Đã hoàn thành {completedCount}/{routines.length} nhịp sinh hoạt ({progressPct}%)
            </h2>
          </div>
          <span className="text-xs font-japanese text-[#E11D48] bg-[#FFE4E6] px-3 py-1 rounded-full font-medium w-fit">
            {progressPct === 100 ? '🌸 Hoàn hảo! (完璧)' : progressPct >= 50 ? '🌱 Rất nhịp nhàng' : '☕ Khởi đầu ngày mới'}
          </span>
        </div>

        <div className="w-full bg-[#EADBCE] h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FB7185] via-[#F43F5E] to-[#059669] transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {periods.map((p) => {
          const Icon = p.icon;
          const isActive = selectedPeriod === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#FFE4E6] text-[#BE123C] border border-[#FDA4AF] shadow-xs'
                  : 'bg-white text-[#73635C] hover:bg-[#FAF5F0] border border-[#EADBCE]'
              }`}
            >
              <Icon size={14} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Routine Timeline Items */}
      <div className="space-y-3">
        {filteredRoutines.map((routine) => {
          const isDone = routine.completed;
          return (
            <div
              key={routine.id}
              className={`p-4 bg-[#FFFDF9] rounded-2xl border transition-all flex items-center justify-between ${
                isDone
                  ? 'bg-[#F0FDF4]/60 border-[#BBF7D0]'
                  : 'border-[#EDE0D6] hover:border-[#D5C5B9]'
              }`}
            >
              <div
                onClick={() => onToggleRoutine(routine.id)}
                className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
              >
                {/* Checkbox button */}
                <button
                  type="button"
                  className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isDone
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'border-2 border-[#D5C5B9] hover:border-[#059669] bg-white'
                  }`}
                >
                  {isDone && <Check size={14} strokeWidth={3} />}
                </button>

                <span className="text-2xl shrink-0">{routine.icon}</span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-bold text-[#E11D48] bg-[#FFE4E6] px-2 py-0.5 rounded-md">
                      {routine.time}
                    </span>
                    <span className="text-[10px] text-[#8C7A73] uppercase font-bold">
                      {routine.period === 'morning'
                        ? 'Sáng'
                        : routine.period === 'afternoon'
                        ? 'Chiều'
                        : routine.period === 'evening'
                        ? 'Tối'
                        : 'Đêm'}
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm text-[#3E3432] truncate ${
                      isDone ? 'line-through text-[#9E8E87]' : 'font-semibold'
                    }`}
                  >
                    {routine.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2 shrink-0">
                <button
                  onClick={() => onDeleteRoutine(routine.id)}
                  className="p-1.5 text-[#BFAFA7] hover:text-red-500 rounded-lg transition-colors"
                  title="Xóa nhịp sinh hoạt"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredRoutines.length === 0 && (
          <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] text-xs text-[#8C7A73]">
            Chưa có nhịp sinh hoạt nào trong khung giờ này.
          </div>
        )}
      </div>

      {/* Add Routine Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <h3 className="text-base font-bold text-[#3E3330]">
                  Thêm nhịp sinh hoạt mới
                </h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-[#8F7D75]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Nội dung sinh hoạt *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Skincare & dưỡng da, Đọc 10 trang sách, Uống nước..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                    Thời gian
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                    Buổi trong ngày
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  >
                    <option value="morning">Buổi sáng</option>
                    <option value="afternoon">Buổi chiều</option>
                    <option value="evening">Buổi tối</option>
                    <option value="night">Đêm / Nghỉ ngơi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Chọn biểu tượng
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                        icon === ic ? 'bg-[#FFE4E6] ring-2 ring-[#E11D48]' : 'bg-[#FAF5F0]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
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
                  className="px-5 py-2 bg-[#E11D48] text-white rounded-xl text-xs font-semibold"
                >
                  Lưu nhịp sinh hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
