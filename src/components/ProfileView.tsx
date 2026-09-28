import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Palette,
  Volume2,
  Globe,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  Sparkles,
  Camera,
  Heart,
  BarChart3,
  Target,
} from 'lucide-react';
import { ActiveTab, UserSettings } from '../types';
import { exportAllData, importAllData, resetAllData } from '../utils/storage';

interface ProfileViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onDataReset: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  onUpdateSettings,
  setActiveTab,
  onDataReset,
}) => {
  const [userName, setUserName] = useState(settings.userName);
  const [bio, setBio] = useState(settings.bio);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [language, setLanguage] = useState(settings.language);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled);
  const [isSaved, setIsSaved] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const presetAvatars = [
    '/src/assets/images/sakura_avatar_girl_1790563499979.jpg',
    '/src/assets/images/memory_tokyo_spring_1790563470050.jpg',
    '/src/assets/images/memory_cozy_cafe_1790563484408.jpg',
    '/src/assets/images/sakura_hero_cover_1790563457888.jpg',
  ];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatarUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSettings = {
      ...settings,
      userName: userName.trim() || 'Sakura Haru',
      bio: bio.trim(),
      avatarUrl,
      themeColor,
      language,
      reminderTime,
      reminderEnabled,
    };
    onUpdateSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    exportAllData();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importAllData(text);
      if (success) {
        setImportStatus('Phục hồi dữ liệu thành công!');
        onDataReset();
      } else {
        setImportStatus('Tệp sao lưu không hợp lệ. Vui lòng thử lại!');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục về dữ liệu mẫu ban đầu?')) {
      resetAllData();
      onDataReset();
    }
  };

  const testReminder = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('🌸 SAKURA DAY', {
            body: `Đã đến giờ viết nhật ký hôm nay rồi ${userName} san ơi!`,
            icon: avatarUrl,
          });
        } else {
          alert('Vui lòng bật quyền thông báo trong trình duyệt để nhận lời nhắc.');
        }
      });
    } else {
      alert('Trình duyệt không hỗ trợ thông báo tự động.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
          <User size={20} className="text-[#E11D48]" />
          <span>Trang cá nhân & Cài đặt</span>
          <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFE4E6]">
            設定
          </span>
        </h1>
        <p className="text-xs text-[#95837B]">
          Tùy chỉnh thông tin người dùng, giao diện, âm thanh và sao lưu dữ liệu
        </p>
      </div>

      {/* Quick Navigation Cards on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('habits')}
          className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EDE0D6] flex items-center gap-2.5 hover:bg-[#FAF5F0] transition-colors text-left"
        >
          <Sparkles size={16} className="text-[#059669]" />
          <div>
            <p className="text-xs font-bold text-[#3E3432]">Thói quen</p>
            <p className="text-[10px] text-[#8C7A73]">Habit Tracker</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EDE0D6] flex items-center gap-2.5 hover:bg-[#FAF5F0] transition-colors text-left"
        >
          <Check size={16} className="text-[#2563EB]" />
          <div>
            <p className="text-xs font-bold text-[#3E3432]">Công việc</p>
            <p className="text-[10px] text-[#8C7A73]">To-do list</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EDE0D6] flex items-center gap-2.5 hover:bg-[#FAF5F0] transition-colors text-left"
        >
          <Target size={16} className="text-[#D97706]" />
          <div>
            <p className="text-xs font-bold text-[#3E3432]">Mục tiêu</p>
            <p className="text-[10px] text-[#8C7A73]">Goals</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EDE0D6] flex items-center gap-2.5 hover:bg-[#FAF5F0] transition-colors text-left"
        >
          <BarChart3 size={16} className="text-[#E11D48]" />
          <div>
            <p className="text-xs font-bold text-[#3E3432]">Thống kê</p>
            <p className="text-[10px] text-[#8C7A73]">Statistics</p>
          </div>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#3E3432] flex items-center gap-2">
            <User size={16} className="text-[#E11D48]" />
            <span>Thông tin cá nhân</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar display & upload */}
            <div className="space-y-2 text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#FDA4AF] shadow-md mx-auto">
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <label className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#FAF5F0] border border-[#E3D3C8] rounded-xl text-xs font-medium text-[#7D6B64] cursor-pointer shadow-2xs">
                <Camera size={13} />
                <span>Đổi ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              {/* Avatar presets */}
              <div className="flex gap-1.5 justify-center pt-1">
                {presetAvatars.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(av)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-[#D5C5B9] hover:scale-110 transition-transform"
                  >
                    <img src={av} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Châm ngôn sống / Giới thiệu bản thân
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  placeholder="Ví dụ: Sống chậm lại, cảm nhận nhiều hơn 🌸"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme and Appearance */}
        <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#3E3432] flex items-center gap-2">
            <Palette size={16} className="text-[#E11D48]" />
            <span>Màu chủ đề & Giao diện</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#6E5D57] mb-2">
              Bảng màu chủ đạo (Theme Palette)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'sakura', name: 'Sakura Pink', color: '#F43F5E', bg: '#FFE4E6' },
                { id: 'matcha', name: 'Matcha Green', color: '#059669', bg: '#DCFCE7' },
                { id: 'yuzu', name: 'Yuzu Yellow', color: '#D97706', bg: '#FEF3C7' },
                { id: 'lavender', name: 'Hydrangea', color: '#7C3AED', bg: '#EDE9FE' },
                { id: 'peach', name: 'Sunset Peach', color: '#EA580C', bg: '#FFEDD5' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setThemeColor(th.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    themeColor === th.id
                      ? 'border-2 border-[#E11D48] bg-[#FFF1F2] shadow-xs'
                      : 'border-[#EDE0D6] bg-[#FAF5F0]'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full mb-2"
                    style={{ backgroundColor: th.color }}
                  />
                  <p className="text-xs font-bold text-[#3E3432]">{th.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                Ngôn ngữ giao diện
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="ja">日本語 (Tiếng Nhật)</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Reminder Setting */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#6E5D57]">
                  Nhắc nhở viết nhật ký mỗi ngày
                </label>
                <button
                  type="button"
                  onClick={testReminder}
                  className="text-[10px] text-[#E11D48] hover:underline"
                >
                  Thử thông báo
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
                <button
                  type="button"
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    reminderEnabled
                      ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                      : 'bg-[#F3E7DE] text-[#7A6962]'
                  }`}
                >
                  {reminderEnabled ? 'Bật' : 'Tắt'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings CTA */}
        <div className="flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                <Check size={14} /> Đã lưu cài đặt thành công!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Lưu thay đổi cài đặt
          </button>
        </div>
      </form>

      {/* Data Management & Backup Section */}
      <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#3E3432] flex items-center gap-2">
          <Database size={16} className="text-[#E11D48]" />
          <span>Quản lý & Sao lưu dữ liệu cá nhân</span>
        </h3>
        <p className="text-xs text-[#8C7A73]">
          Dữ liệu của bạn được lưu an toàn trực tiếp trên trình duyệt này. Bạn có thể xuất tệp JSON dự phòng bất cứ khi nào hoặc chuyển sang thiết bị khác.
        </p>

        {importStatus && (
          <div className="p-3 bg-[#DCFCE7] text-[#166534] rounded-xl text-xs font-medium border border-[#BBF7D0]">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="p-3.5 bg-[#FAF5F0] hover:bg-[#F3E7DE] border border-[#EDE0D6] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors cursor-pointer"
          >
            <Download size={18} className="text-[#059669]" />
            <span className="text-xs font-bold text-[#3E3432]">Xuất sao lưu JSON</span>
            <span className="text-[10px] text-[#8C7A73]">Tải dữ liệu về máy</span>
          </button>

          {/* Import JSON */}
          <label className="p-3.5 bg-[#FAF5F0] hover:bg-[#F3E7DE] border border-[#EDE0D6] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors cursor-pointer">
            <Upload size={18} className="text-[#2563EB]" />
            <span className="text-xs font-bold text-[#3E3432]">Phục hồi từ JSON</span>
            <span className="text-[10px] text-[#8C7A73]">Chọn tệp sao lưu đã lưu</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Reset sample data */}
          <button
            onClick={handleReset}
            className="p-3.5 bg-[#FAF5F0] hover:bg-[#FEE2E2] border border-[#EDE0D6] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors cursor-pointer"
          >
            <RefreshCw size={18} className="text-[#D97706]" />
            <span className="text-xs font-bold text-[#3E3432]">Khôi phục mẫu</span>
            <span className="text-[10px] text-[#8C7A73]">Đặt lại dữ liệu ban đầu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
