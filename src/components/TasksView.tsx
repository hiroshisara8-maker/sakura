import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Check,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Task } from '../types';
import { getTodayFormatted } from '../data/constants';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (text: string, timeSlot: Task['timeSlot'], priority: Task['priority'], date?: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const today = getTodayFormatted();
  const [filter, setFilter] = useState<'today' | 'all' | 'pending' | 'completed'>('today');
  const [newText, setNewText] = useState('');
  const [newDate, setNewDate] = useState(today);
  const [newTimeSlot, setNewTimeSlot] = useState<Task['timeSlot']>('morning');
  const [newPriority, setNewPriority] = useState<Task['priority']>('normal');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'today') return t.date === today;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddTask(newText.trim(), newTimeSlot, newPriority, newDate);
    setNewText('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <CheckSquare size={20} className="text-[#3B82F6]" />
            <span>Quản lý công việc (To-Do)</span>
            <span className="text-xs text-[#2563EB] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#DBEAFE]">
              タスク
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Lên kế hoạch và theo dõi các công việc cần làm
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[#FAF4F0] p-1 rounded-2xl border border-[#E8DCD4]">
          {(['today', 'all', 'pending', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
                filter === mode
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-[#73635C] hover:text-[#3E3432]'
              }`}
            >
              {mode === 'today' ? 'Hôm nay' : mode === 'all' ? 'Tất cả' : mode === 'pending' ? 'Chưa xong' : 'Đã xong'}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Box */}
      <form
        onSubmit={handleCreateTask}
        className="p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Thêm công việc cần làm..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus size={16} />
            <span>Thêm</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A6962] pt-1">
          <div className="flex items-center gap-1.5">
            <span>Ngày:</span>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-2 py-1 bg-[#FAF5F0] rounded-lg border border-[#EDE0D6]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span>Buổi:</span>
            <select
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value as any)}
              className="px-2 py-1 bg-[#FAF5F0] rounded-lg border border-[#EDE0D6]"
            >
              <option value="morning">Sáng</option>
              <option value="afternoon">Chiều</option>
              <option value="evening">Tối</option>
              <option value="anytime">Bất kỳ</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Ưu tiên:</span>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="px-2 py-1 bg-[#FAF5F0] rounded-lg border border-[#EDE0D6]"
            >
              <option value="normal">Bình thường</option>
              <option value="important">Quan trọng</option>
              <option value="urgent">Gấp</option>
            </select>
          </div>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className={`p-3.5 bg-[#FFFDF9] rounded-2xl border transition-all flex items-center justify-between ${
              t.completed
                ? 'bg-[#FAF8F5] border-[#E8DFD8] opacity-75'
                : 'border-[#EDE0D6] hover:border-[#D5C5B9]'
            }`}
          >
            <div
              onClick={() => onToggleTask(t.id)}
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            >
              <button
                type="button"
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  t.completed
                    ? 'bg-[#059669] text-white'
                    : 'border border-[#C9B9AF] hover:border-[#2563EB]'
                }`}
              >
                {t.completed && <Check size={13} strokeWidth={3} />}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs sm:text-sm text-[#3E3432] truncate ${
                    t.completed ? 'line-through text-[#9E8E87]' : 'font-medium'
                  }`}
                >
                  {t.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#A69690] font-mono">
                  <span>{t.date}</span>
                  <span>·</span>
                  <span>
                    {t.timeSlot === 'morning' ? 'Buổi sáng' : t.timeSlot === 'afternoon' ? 'Buổi chiều' : t.timeSlot === 'evening' ? 'Buổi tối' : 'Bất kỳ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-3 shrink-0">
              {t.priority === 'urgent' && (
                <span className="text-[10px] text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full font-bold">
                  Gấp
                </span>
              )}
              {t.priority === 'important' && (
                <span className="text-[10px] text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full font-bold">
                  Quan trọng
                </span>
              )}

              <button
                onClick={() => onDeleteTask(t.id)}
                className="p-1 text-[#BFAFA7] hover:text-red-500 transition-colors"
                title="Xóa công việc"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] text-xs text-[#8C7A73]">
            Không có công việc nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
};
