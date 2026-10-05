import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Calendar,
  Tag,
  DollarSign,
  TrendingDown,
  X,
  ShoppingBag,
  Coffee,
  Bus,
  Home,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { ExpenseItem } from '../types';
import { getTodayFormatted } from '../data/constants';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const today = getTodayFormatted();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'today' | 'all'>('today');

  // Form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(today);

  const categories = [
    { id: 'food', label: 'Ăn uống', icon: Coffee, color: '#D97706', bg: '#FEF3C7' },
    { id: 'living', label: 'Đồ sinh hoạt', icon: Home, color: '#059669', bg: '#DCFCE7' },
    { id: 'transport', label: 'Đi lại & Xăng xe', icon: Bus, color: '#2563EB', bg: '#DBEAFE' },
    { id: 'study', label: 'Học tập & Sách', icon: BookOpen, color: '#7C3AED', bg: '#EDE9FE' },
    { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag, color: '#E11D48', bg: '#FFE4E6' },
    { id: 'other', label: 'Khác', icon: Sparkles, color: '#4B5563', bg: '#F3F4F6' },
  ] as const;

  const filteredExpenses = expenses.filter((e) =>
    selectedFilter === 'today' ? e.date === today : true
  );

  const totalToday = expenses
    .filter((e) => e.date === today)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalAll = expenses.reduce((sum, item) => sum + item.amount, 0);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/\D/g, ''), 10);
    if (!num || isNaN(num)) return;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      amount: num,
      category,
      note: note.trim() || 'Chi tiêu sinh hoạt',
      date,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddExpense(newExpense);
    setIsAddOpen(false);
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={20} className="text-[#D97706]" />
            <h1 className="text-xl font-bold text-[#3E3432]">
              Quản lý chi tiêu sinh hoạt (Daily Expenses)
            </h1>
            <span className="text-xs text-[#D97706] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FEF3C7]">
              家計簿
            </span>
          </div>
          <p className="text-xs text-[#95837B]">
            Ghi chép các khoản chi tiêu nhỏ hằng ngày để kiểm soát tài chính sinh hoạt hợp lý
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm khoản chi</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Today total */}
        <div className="p-5 bg-gradient-to-br from-[#FEF3C7] via-[#FFFDF9] to-[#FFF5F7] rounded-3xl border border-[#FDE68A] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
            Chi tiêu hôm nay ({today})
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-[#78350F] font-mono tabular-nums">
            {formatVND(totalToday)}
          </p>
          <p className="text-xs text-[#92400E]">
            {filteredExpenses.length} khoản chi trong ngày hôm nay
          </p>
        </div>

        {/* All / Week total */}
        <div className="p-5 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#6E5D57] uppercase tracking-wider">
            Tổng chi các ngày đã ghi nhận
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-[#3E3432] font-mono tabular-nums">
            {formatVND(totalAll)}
          </p>
          <p className="text-xs text-[#8C7A73]">
            {expenses.length} tổng số khoản chi trong sổ chi tiêu
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedFilter('today')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            selectedFilter === 'today'
              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] shadow-xs'
              : 'bg-white text-[#73635C] hover:bg-[#FAF5F0] border border-[#EADBCE]'
          }`}
        >
          Hôm nay
        </button>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] shadow-xs'
              : 'bg-white text-[#73635C] hover:bg-[#FAF5F0] border border-[#EADBCE]'
          }`}
        >
          Tất cả các ngày
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.map((exp) => {
          const catInfo = categories.find((c) => c.id === exp.category) || categories[0];
          const Icon = catInfo.icon;
          return (
            <div
              key={exp.id}
              className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#EDE0D6] hover:border-[#D5C5B9] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: catInfo.bg, color: catInfo.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#3E3432] truncate">
                      {exp.note}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{ backgroundColor: catInfo.bg, color: catInfo.color }}
                    >
                      {catInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#9E8E87] font-mono mt-0.5">
                    <span>{exp.date}</span>
                    {exp.time && <span>· {exp.time}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-2 shrink-0">
                <span className="text-sm sm:text-base font-bold text-[#BE123C] font-mono tabular-nums">
                  -{formatVND(exp.amount)}
                </span>
                <button
                  onClick={() => onDeleteExpense(exp.id)}
                  className="p-1 text-[#BFAFA7] hover:text-red-500 rounded-lg transition-colors"
                  title="Xóa khoản chi"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] text-xs text-[#8C7A73]">
            Chưa có khoản chi tiêu nào được ghi nhận.
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h3 className="text-base font-bold text-[#3E3330]">
                  Ghi chép khoản chi mới
                </h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-[#8F7D75]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Số tiền (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 35000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Mục chi tiêu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-2 border-[#D97706] bg-[#FEF3C7] text-[#92400E] shadow-2xs'
                            : 'border-[#EDE0D6] bg-[#FAF5F0] text-[#73635C]'
                        }`}
                      >
                        <Icon size={15} style={{ color: cat.color }} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Nội dung chi tiêu
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bánh mì sáng, Cơm trưa, Xăng xe, Mua bút..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Ngày chi tiêu
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
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
                  className="px-5 py-2 bg-[#D97706] text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Lưu khoản chi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
