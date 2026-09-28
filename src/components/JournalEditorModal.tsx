import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Tag,
  Smile,
  CloudSun,
  Check,
  Trash2,
  HelpCircle,
  Heart,
  Sparkles,
} from 'lucide-react';
import { DiaryEntry, MoodType } from '../types';
import { MOODS, WEATHER_OPTIONS, STICKERS, DAILY_QUESTIONS, getTodayFormatted } from '../data/constants';

interface JournalEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: DiaryEntry) => void;
  initialEntry?: DiaryEntry | null;
  targetDate?: string;
}

export const JournalEditorModal: React.FC<JournalEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
  targetDate,
}) => {
  const [date, setDate] = useState<string>(targetDate || getTodayFormatted());
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [moodId, setMoodId] = useState<MoodType>('great');
  const [moodReason, setMoodReason] = useState<string>('');
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'windy' | 'snowy'>('sunny');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [stickers, setStickers] = useState<string[]>([]);
  const [gratitudeList, setGratitudeList] = useState<string[]>(['', '', '']);
  const [dailyQuestion, setDailyQuestion] = useState<string>('');
  const [dailyQuestionAnswer, setDailyQuestionAnswer] = useState<string>('');

  useEffect(() => {
    if (initialEntry) {
      setDate(initialEntry.date);
      setTitle(initialEntry.title);
      setContent(initialEntry.content);
      setMoodId(initialEntry.moodId);
      setMoodReason(initialEntry.moodReason || '');
      setWeather(initialEntry.weather || 'sunny');
      setPhotos(initialEntry.photos || []);
      setPhotoCaptions(initialEntry.photoCaptions || {});
      setTags(initialEntry.tags || []);
      setStickers(initialEntry.stickers || []);
      const grats = initialEntry.gratitudeList || [];
      setGratitudeList([grats[0] || '', grats[1] || '', grats[2] || '']);
      setDailyQuestionAnswer(initialEntry.dailyQuestionAnswer || '');
    } else {
      setDate(targetDate || getTodayFormatted());
      setTitle('');
      setContent('');
      setMoodId('great');
      setMoodReason('');
      setWeather('sunny');
      setPhotos([]);
      setPhotoCaptions({});
      setTags(['Nhật ký']);
      setStickers(['🌸']);
      setGratitudeList(['', '', '']);
      setDailyQuestionAnswer('');
    }

    // Pick question of the day based on date day
    const dayNum = parseInt((targetDate || getTodayFormatted()).slice(-2), 10) || 1;
    setDailyQuestion(DAILY_QUESTIONS[dayNum % DAILY_QUESTIONS.length]);
  }, [initialEntry, targetDate, isOpen]);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add preset sakura image
  const handleAddPresetPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const removePhoto = (index: number) => {
    const photoToRemove = photos[index];
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoCaptions((prev) => {
      const copy = { ...prev };
      delete copy[photoToRemove];
      return copy;
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleSticker = (sticker: string) => {
    if (stickers.includes(sticker)) {
      setStickers(stickers.filter((s) => s !== sticker));
    } else {
      if (stickers.length < 5) {
        setStickers([...stickers, sticker]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const filteredGratitude = gratitudeList.map((g) => g.trim()).filter(Boolean);

    const savedEntry: DiaryEntry = {
      id: initialEntry ? initialEntry.id : `entry-${Date.now()}`,
      date,
      createdAt: initialEntry ? initialEntry.createdAt : new Date().toISOString(),
      title: title.trim() || 'Ghi chép một ngày bình yên 🌸',
      content: content.trim(),
      moodId,
      moodReason: moodReason.trim(),
      weather,
      photos,
      photoCaptions,
      tags: tags.length > 0 ? tags : ['Nhật ký'],
      stickers,
      gratitudeList: filteredGratitude,
      dailyQuestionAnswer: dailyQuestionAnswer.trim(),
      isFavorite: initialEntry ? initialEntry.isFavorite : false,
    };

    onSave(savedEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_20px_60px_rgba(160,120,100,0.2)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]/70">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#3E3330]">
                {initialEntry ? 'Chỉnh sửa nhật ký' : 'Viết nhật ký mới'}
              </h2>
              <p className="text-xs text-[#95837B]">
                Lưu giữ những điều nhỏ bé và dịu dàng trong ngày
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-[#8F7D75] hover:text-[#3E3330] hover:bg-[#EFE3DB] rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6">
          
          {/* Date & Weather Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#FAF3ED] rounded-2xl border border-[#EDE0D6]">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[#7A6962] whitespace-nowrap">
                Ngày:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-[#463B37] border border-[#E3D3C8] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
              />
            </div>

            {/* Weather */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#7A6962] font-semibold mr-1">Thời tiết:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E3D3C8]">
                {WEATHER_OPTIONS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeather(w.id as any)}
                    title={w.label}
                    className={`px-2 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                      weather === w.id
                        ? 'bg-[#FFE4E6] text-[#BE123C] font-semibold'
                        : 'text-[#85746E] hover:bg-[#F8EFE9]'
                    }`}
                  >
                    <span>{w.icon}</span>
                    <span className="hidden sm:inline text-[11px]">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mood Tracker Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A6962] flex items-center gap-1.5">
                <Smile size={14} className="text-[#F43F5E]" />
                Tâm trạng của bạn hôm nay
              </label>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {MOODS.map((m) => {
                const isSelected = moodId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMoodId(m.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFE4E6] border-2 border-[#F43F5E] shadow-xs scale-102 font-semibold'
                        : 'bg-[#FAF5F0] border border-[#EDE0D6] hover:bg-[#F3E7DE] text-[#695B55]'
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{m.name}</span>
                    <span className="text-[10px] text-[#A3928B] leading-none truncate max-w-full font-japanese">
                      {m.japanese.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mood reason */}
            <input
              type="text"
              placeholder="Vì sao bạn có tâm trạng này? (ví dụ: Được ăn món yêu thích, bài tập thuận lợi...)"
              value={moodReason}
              onChange={(e) => setMoodReason(e.target.value)}
              className="w-full mt-2 px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] placeholder-[#B5A59E] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
            />
          </div>

          {/* Title & Body */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tiêu đề nhật ký hôm nay..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-base sm:text-lg font-bold text-[#3E3330] placeholder-[#BFB0A9] bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
            />

            <div className="relative">
              <textarea
                rows={7}
                placeholder="Hôm nay của bạn thế nào? Viết lại những suy nghĩ, câu chuyện, hay bất kỳ điều gì bạn muốn lưu lại nhé..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 text-sm leading-relaxed text-[#4A3E3B] placeholder-[#B8A7A0] bg-[#FFFBF8] notebook-grid rounded-2xl border border-[#EDE0D6] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF] resize-y"
              />
            </div>
          </div>

          {/* Photos & Captions */}
          <div className="space-y-3 p-4 bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A6962] flex items-center gap-1.5">
                <Camera size={14} className="text-[#F43F5E]" />
                Hình ảnh nhật ký (Photo Diary)
              </label>

              {/* Photo presets button */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#A6958E]">Gợi ý ảnh đẹp:</span>
                <button
                  type="button"
                  onClick={() => handleAddPresetPhoto('/src/assets/images/sakura_hero_cover_1790563457888.jpg')}
                  className="px-2 py-0.5 text-[11px] bg-white text-[#BE123C] rounded-lg border border-[#FDA4AF] hover:bg-[#FFE4E6]"
                >
                  🌸 Hoa anh đào
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetPhoto('/src/assets/images/memory_cozy_cafe_1790563484408.jpg')}
                  className="px-2 py-0.5 text-[11px] bg-white text-[#059669] rounded-lg border border-[#86EFAC] hover:bg-[#DCFCE7]"
                >
                  🍵 Cafe & Sổ
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-[#E8DCD3] shadow-xs">
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden mb-2 bg-[#F3EBE4]">
                      <img
                        src={p}
                        alt="Diary photo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Chú thích cho bức ảnh này..."
                      value={photoCaptions[p] || ''}
                      onChange={(e) =>
                        setPhotoCaptions({ ...photoCaptions, [p]: e.target.value })
                      }
                      className="w-full px-2.5 py-1 text-xs bg-[#FAF5F0] rounded-lg border border-[#E8DCD3] text-[#4A3E3B] focus:outline-none focus:ring-1 focus:ring-[#FDA4AF]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-[#FFF9F5] border-2 border-dashed border-[#DFCFC4] rounded-xl cursor-pointer transition-colors text-xs font-medium text-[#7D6B64]">
              <ImageIcon size={16} className="text-[#FDA4AF]" />
              <span>Tải ảnh lên từ máy tính hoặc điện thoại</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Daily Question */}
          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#F5E2D6] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#BE123C]">
              <HelpCircle size={14} />
              <span>Câu hỏi mỗi ngày (Daily Question)</span>
            </div>
            <p className="text-sm font-semibold text-[#4A3A35] italic">
              "{dailyQuestion}"
            </p>
            <textarea
              rows={2}
              placeholder="Chia sẻ câu trả lời của bạn vào đây..."
              value={dailyQuestionAnswer}
              onChange={(e) => setDailyQuestionAnswer(e.target.value)}
              className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#E8D9CE] text-[#4A3E3B] placeholder-[#BFAFA7] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
            />
          </div>

          {/* Gratitude (1-3 Things) */}
          <div className="p-4 bg-[#F2FBF6] rounded-2xl border border-[#D1F2E0] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <Heart size={14} />
              <span>3 Điều biết ơn trong ngày (Gratitude)</span>
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#A7F3D0] text-[#065F46] font-mono text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    placeholder={
                      i === 0
                        ? 'Điều làm bạn mỉm cười hôm nay...'
                        : i === 1
                        ? 'Người bạn cảm thấy trân trọng...'
                        : 'Một điều nhỏ bé bạn biết ơn...'
                    }
                    value={gratitudeList[i]}
                    onChange={(e) => {
                      const updated = [...gratitudeList];
                      updated[i] = e.target.value;
                      setGratitudeList(updated);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-[#BDEBD3] text-[#344C3F] focus:outline-none focus:ring-2 focus:ring-[#34D399]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stickers & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stickers */}
            <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A6962] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#F43F5E]" />
                Sticker trang trí nhật ký
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STICKERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSticker(s)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform ${
                      stickers.includes(s)
                        ? 'bg-[#FFE4E6] scale-110 shadow-xs ring-2 ring-[#FDA4AF]'
                        : 'bg-white hover:bg-[#F3E7DE]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A6962] flex items-center gap-1.5">
                <Tag size={13} className="text-[#F43F5E]" />
                Chủ đề / Nhãn tag
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Thêm nhãn tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1 text-xs bg-[#E8DDD4] hover:bg-[#DFCFC4] text-[#4A3E3B] rounded-xl font-medium"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-[#73635C] rounded-lg text-xs border border-[#E3D3C8]"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="sticky bottom-0 pt-4 pb-2 bg-[#FFFDF9] border-t border-[#F0E4DC] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#7D6B64] hover:bg-[#F3E7DE] rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-[0_4px_12px_rgba(225,29,72,0.3)] hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={16} />
              <span>Lưu nhật ký</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
