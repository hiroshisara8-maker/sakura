import React from 'react';
import {
  Calendar as CalendarIcon,
  BookOpen,
  Heart,
  Clock,
  Camera,
  CheckSquare,
  Sparkles,
  BarChart3,
  Search,
  Settings,
  Target,
  PenTool,
} from 'lucide-react';
import { ActiveTab, UserSettings } from '../types';
import { AmbientPlayer } from './AmbientPlayer';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickWrite: () => void;
  settings: UserSettings;
  entryCount: number;
  memoryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickWrite,
  settings,
  entryCount,
  memoryCount,
}) => {
  const navItems = [
    { id: 'today' as ActiveTab, label: 'Hôm nay', icon: BookOpen, badge: null },
    { id: 'calendar' as ActiveTab, label: 'Lịch cá nhân', icon: CalendarIcon, badge: null },
    { id: 'memories' as ActiveTab, label: 'Hộp ký ức', icon: Heart, badge: memoryCount },
    { id: 'timeline' as ActiveTab, label: 'Dòng thời gian', icon: Clock, badge: entryCount },
    { id: 'habits' as ActiveTab, label: 'Thói quen', icon: Sparkles, badge: null },
    { id: 'tasks' as ActiveTab, label: 'Công việc', icon: CheckSquare, badge: null },
    { id: 'goals' as ActiveTab, label: 'Mục tiêu', icon: Target, badge: null },
    { id: 'stats' as ActiveTab, label: 'Thống kê', icon: BarChart3, badge: null },
    { id: 'search' as ActiveTab, label: 'Tìm kiếm', icon: Search, badge: null },
    { id: 'profile' as ActiveTab, label: 'Cá nhân & Cài đặt', icon: Settings, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-[#FFFDF9] border-r border-[#F0E6DF] p-5 justify-between overflow-y-auto shadow-[1px_0_12px_rgba(200,160,140,0.05)] select-none">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FDA4AF] to-[#F43F5E] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(244,63,94,0.25)] ring-2 ring-[#FFE4E6]">
            <span className="text-xl">🌸</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-[#3E3432]">
                SAKURA DAY
              </h1>
              <span className="text-[10px] text-[#E11D48] font-japanese font-medium px-1.5 py-0.5 rounded-full bg-[#FFF1F2]">
                桜の日
              </span>
            </div>
            <p className="text-[11px] text-[#9C8B84] truncate max-w-[150px]">
              Nhật ký cuộc sống cá nhân
            </p>
          </div>
        </div>

        {/* Primary CTA: Viết nhật ký */}
        <button
          onClick={onOpenQuickWrite}
          className="w-full mb-6 py-2.5 px-4 bg-gradient-to-r from-[#FB7185] via-[#F43F5E] to-[#E11D48] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(244,63,94,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
        >
          <PenTool size={16} />
          <span>Viết nhật ký mới</span>
          <span className="text-xs opacity-80">✦</span>
        </button>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left ${
                  isActive
                    ? 'bg-[#FFE4E6] text-[#BE123C] font-semibold shadow-xs'
                    : 'text-[#6C5E58] hover:bg-[#F8EFE9] hover:text-[#382E2C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={isActive ? 'text-[#E11D48]' : 'text-[#96867F]'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full tabular-nums ${
                      isActive
                        ? 'bg-[#FDA4AF] text-[#881337]'
                        : 'bg-[#F2E5DC] text-[#7E6E66]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Ambient Sound Player & User Profile Card */}
      <div className="pt-4 border-t border-[#F0E6DF] space-y-3">
        {/* Ambient Sound widget */}
        <AmbientPlayer />

        {/* User Card */}
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8EFE9] transition-colors cursor-pointer"
        >
          <img
            src={settings.avatarUrl}
            alt={settings.userName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FDA4AF] shadow-xs"
            onError={(e) => {
              // Fallback
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#3C3230] truncate">
              {settings.userName}
            </p>
            <p className="text-[10px] text-[#A3928B] truncate">
              {settings.bio || '🌸 日日是好日'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
