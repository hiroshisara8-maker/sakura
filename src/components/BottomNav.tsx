import React from 'react';
import { Home, Calendar, Plus, Heart, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickWrite: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickWrite,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-md border-t border-[#F2E5DC] pb-safe px-3 shadow-[0_-4px_20px_rgba(200,160,140,0.1)]">
      <nav className="flex items-center justify-around h-16 max-w-md mx-auto">
        {/* Tab 1: Hôm nay */}
        <button
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] transition-colors ${
            activeTab === 'today' ? 'text-[#E11D48] font-semibold' : 'text-[#8E7E78]'
          }`}
          aria-label="Hôm nay"
        >
          <Home size={20} strokeWidth={activeTab === 'today' ? 2.5 : 1.8} />
          <span className="text-[10px] mt-1 tracking-tight">Hôm nay</span>
        </button>

        {/* Tab 2: Lịch */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] transition-colors ${
            activeTab === 'calendar' ? 'text-[#E11D48] font-semibold' : 'text-[#8E7E78]'
          }`}
          aria-label="Lịch"
        >
          <Calendar size={20} strokeWidth={activeTab === 'calendar' ? 2.5 : 1.8} />
          <span className="text-[10px] mt-1 tracking-tight">Lịch</span>
        </button>

        {/* Central Action Tab: ➕ Viết */}
        <div className="relative -top-3">
          <button
            onClick={onOpenQuickWrite}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#F43F5E] to-[#FB7185] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(244,63,94,0.4)] ring-4 ring-[#FFFDFB] active:scale-95 transition-transform cursor-pointer"
            aria-label="Viết nhật ký mới"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab 4: Kỷ niệm */}
        <button
          onClick={() => setActiveTab('memories')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] transition-colors ${
            activeTab === 'memories' ? 'text-[#E11D48] font-semibold' : 'text-[#8E7E78]'
          }`}
          aria-label="Kỷ niệm"
        >
          <Heart size={20} strokeWidth={activeTab === 'memories' ? 2.5 : 1.8} />
          <span className="text-[10px] mt-1 tracking-tight">Kỷ niệm</span>
        </button>

        {/* Tab 5: Cá nhân */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] transition-colors ${
            activeTab === 'profile' ? 'text-[#E11D48] font-semibold' : 'text-[#8E7E78]'
          }`}
          aria-label="Cá nhân"
        >
          <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />
          <span className="text-[10px] mt-1 tracking-tight">Cá nhân</span>
        </button>
      </nav>
    </div>
  );
};
