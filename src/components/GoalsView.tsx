import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import { Goal } from '../types';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoalProgress: (goalId: string, progress: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onUpdateGoalProgress,
  onDeleteGoal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [type, setType] = useState<Goal['type']>('monthly');
  const [deadline, setDeadline] = useState('');

  const filteredGoals = goals.filter((g) =>
    filterType === 'all' ? true : g.type === filterType
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      type,
      progress: 0,
      target: target.trim() || 'Mục tiêu hoàn thành',
      completed: false,
      deadline: deadline || undefined,
    };

    onAddGoal(newGoal);
    setIsAddOpen(false);
    setTitle('');
    setTarget('');
    setDeadline('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <Target size={20} className="text-[#E11D48]" />
            <span>Mục tiêu cá nhân (Goals)</span>
            <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFE4E6]">
              目標
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Hiện thực hóa ước mơ bằng các mục tiêu ngày, tuần và tháng
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Đặt mục tiêu mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'daily', 'weekly', 'monthly'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterType === t
                ? 'bg-[#FFE4E6] text-[#BE123C] border border-[#FDA4AF] shadow-xs'
                : 'bg-white text-[#73635C] hover:bg-[#FAF5F0] border border-[#EADBCE]'
            }`}
          >
            {t === 'all' ? 'Tất cả' : t === 'daily' ? 'Ngày' : t === 'weekly' ? 'Tuần' : 'Tháng'}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-3.5">
        {filteredGoals.map((goal) => {
          const isDone = goal.progress >= 100;
          return (
            <div
              key={goal.id}
              className={`p-5 bg-[#FFFDF9] rounded-3xl border transition-all ${
                isDone
                  ? 'border-[#BBF7D0] bg-[#F0FDF4]/60'
                  : 'border-[#EDE0D6] hover:border-[#D5C5B9]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#E11D48] bg-[#FFE4E6] px-2 py-0.5 rounded-md">
                      {goal.type === 'daily' ? 'Mục tiêu ngày' : goal.type === 'weekly' ? 'Mục tiêu tuần' : 'Mục tiêu tháng'}
                    </span>
                    {goal.deadline && (
                      <span className="text-[11px] text-[#8C7A73]">
                        Hạn: {goal.deadline}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#3E3432]">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-[#8C7A73]">
                    Chỉ tiêu: {goal.target}
                  </p>
                </div>

                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-[#BFAFA7] hover:text-red-500 p-1 transition-colors"
                  title="Xóa mục tiêu"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Progress Bar & Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#6B5A54]">Tiến độ thực hiện:</span>
                  <span className={isDone ? 'text-[#059669]' : 'text-[#E11D48]'}>
                    {goal.progress}% {isDone && '✓ Hoàn thành'}
                  </span>
                </div>

                <div className="w-full bg-[#EADBCE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDone
                        ? 'bg-gradient-to-r from-[#34D399] to-[#059669]'
                        : 'bg-gradient-to-r from-[#FB7185] to-[#E11D48]'
                    }`}
                    style={{ width: `${Math.min(100, goal.progress)}%` }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goal.progress}
                    onChange={(e) =>
                      onUpdateGoalProgress(goal.id, parseInt(e.target.value, 10))
                    }
                    className="flex-1 h-1 bg-[#E8DDD4] rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
                  />
                  <button
                    onClick={() => onUpdateGoalProgress(goal.id, 100)}
                    className="text-[11px] font-semibold text-[#059669] hover:underline"
                  >
                    Đánh dấu 100%
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredGoals.length === 0 && (
          <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] text-xs text-[#8C7A73]">
            Chưa có mục tiêu nào trong mục này.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]">
              <h3 className="text-base font-bold text-[#3E3330]">
                Đặt mục tiêu mới
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-[#8F7D75]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Tiêu đề mục tiêu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đọc 20 trang sách mỗi ngày, Thuộc bảng chữ cái Kanji..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Loại mục tiêu
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                >
                  <option value="daily">Hằng ngày (Daily)</option>
                  <option value="weekly">Hằng tuần (Weekly)</option>
                  <option value="monthly">Hằng tháng (Monthly)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Chỉ tiêu cụ thể
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 100 từ vựng, 5km chạy bộ, 2 lít nước..."
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Hạn chót (Deadline)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cuối tuần này, Ngày 30/10..."
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
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
                  Tạo mục tiêu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
