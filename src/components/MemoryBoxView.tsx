import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Camera,
  MapPin,
  Calendar,
  X,
  Trash2,
  Edit2,
  Sparkles,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Memory, MemoryCategory } from '../types';
import { MEMORY_CATEGORIES, getTodayFormatted } from '../data/constants';

interface MemoryBoxViewProps {
  memories: Memory[];
  onAddMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
  onToggleSpecial: (id: string) => void;
}

export const MemoryBoxView: React.FC<MemoryBoxViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  onToggleSpecial,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMemoryPreview, setActiveMemoryPreview] = useState<Memory | null>(null);

  // New memory form state
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState(getTodayFormatted());
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/sakura_hero_cover_1790563457888.jpg');
  const [category, setCategory] = useState<MemoryCategory>('travel');
  const [location, setLocation] = useState('');
  const [isSpecial, setIsSpecial] = useState(true);

  // Filter memories
  const filteredMemories = memories.filter((m) =>
    selectedCategory === 'all' ? true : m.category === selectedCategory
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      title: title.trim(),
      story: story.trim(),
      date,
      photoUrl,
      category,
      isSpecial,
      location: location.trim() || undefined,
    };

    onAddMemory(newMem);
    setIsAddModalOpen(false);

    // Reset form
    setTitle('');
    setStory('');
    setLocation('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <Heart size={20} className="text-[#E11D48]" />
            <span>Hộp ký ức (Memory Box)</span>
            <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFF1F2]">
              思い出の小箱
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Nơi cất giữ những khoảnh khắc lấp lánh và kỷ niệm quý giá nhất
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-[0_4px_12px_rgba(225,29,72,0.25)] hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm kỷ niệm mới</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MEMORY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as MemoryCategory)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#FFE4E6] text-[#BE123C] border border-[#FDA4AF] shadow-xs'
                : 'bg-white text-[#73635C] hover:bg-[#FAF5F0] border border-[#EADBCE]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((mem, index) => {
          // slight playful rotation for scrapbook feel
          const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[0.5deg]'];
          const rotClass = rotations[index % rotations.length];

          return (
            <div
              key={mem.id}
              className={`group bg-white p-3.5 pb-5 rounded-2xl shadow-[0_4px_20px_rgba(180,140,120,0.12)] border border-[#EADBCE] transition-all hover:shadow-[0_12px_30px_rgba(180,140,120,0.18)] hover:-translate-y-1 relative ${rotClass}`}
            >
              {/* Washi tape on top */}
              <div
                className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 opacity-80 z-10 ${
                  index % 2 === 0 ? 'washi-tape-pink' : 'washi-tape-matcha'
                }`}
              />

              {/* Photo Frame */}
              <div
                onClick={() => setActiveMemoryPreview(mem)}
                className="relative aspect-4/3 overflow-hidden rounded-xl bg-[#FAF5F0] mb-3 cursor-pointer"
              >
                <img
                  src={mem.photoUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Special Star Bookmark */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSpecial(mem.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-colors ${
                    mem.isSpecial
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-black/40 text-white/80 hover:text-white'
                  }`}
                  title={mem.isSpecial ? 'Bỏ ghim đặc biệt' : 'Ghim vào khoảnh khắc đặc biệt'}
                >
                  <Heart size={14} fill={mem.isSpecial ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Details & Handwritten Title */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between text-[11px] text-[#9E8E87] font-mono">
                  <span>{mem.date}</span>
                  {mem.location && (
                    <span className="flex items-center gap-0.5 truncate max-w-[130px]">
                      <MapPin size={10} className="text-[#E11D48] shrink-0" />
                      {mem.location}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => setActiveMemoryPreview(mem)}
                  className="text-sm font-bold text-[#3E3432] group-hover:text-[#E11D48] transition-colors cursor-pointer line-clamp-1"
                >
                  {mem.title}
                </h3>

                <p className="text-xs text-[#6B5A54] leading-relaxed line-clamp-2">
                  {mem.story}
                </p>

                {/* Card footer actions */}
                <div className="pt-2 flex items-center justify-between border-t border-[#F5EDE8]">
                  <span className="text-[10px] text-[#A69690] bg-[#FAF5F0] px-2 py-0.5 rounded-md font-medium">
                    {MEMORY_CATEGORIES.find((c) => c.id === mem.category)?.label || 'Kỷ niệm'}
                  </span>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="p-1 text-[#B8A7A0] hover:text-red-500 transition-colors"
                    title="Xóa kỷ niệm"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMemories.length === 0 && (
        <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] space-y-3">
          <div className="text-3xl">🌸</div>
          <p className="text-sm font-semibold text-[#3E3432]">
            Chưa có kỷ niệm nào trong danh mục này.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs text-[#E11D48] font-bold hover:underline"
          >
            + Bấm vào đây để tạo kỷ niệm đầu tiên
          </button>
        </div>
      )}

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl border border-[#F3E5DC] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DC] bg-[#FAF5F0]/70">
              <div className="flex items-center gap-2">
                <span className="text-xl">💗</span>
                <h3 className="text-base font-bold text-[#3E3330]">
                  Thêm kỷ niệm vào Hộp ký ức
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#8F7D75] hover:text-[#3E3330] rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewMemory} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Tiêu đề kỷ niệm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chuyến đi ngắm hoa anh đào, Lễ tốt nghiệp..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                    Ngày diễn ra
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                    Danh mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                  >
                    {MEMORY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Địa điểm (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tokyo, Góc quán cafe quen, Trường học..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
                />
              </div>

              {/* Photo Preview & Options */}
              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Hình ảnh kỷ niệm
                </label>
                <div className="aspect-16/9 rounded-xl overflow-hidden mb-2 border border-[#EDE0D6] bg-black/5">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-[#E3D3C8] rounded-xl text-xs font-medium text-[#7D6B64] hover:bg-[#FAF5F0] cursor-pointer">
                    <Camera size={14} />
                    <span>Tải ảnh từ máy tính/điện thoại</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset suggestions */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-[#A69690]">Chọn mẫu ảnh:</span>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('/src/assets/images/memory_tokyo_spring_1790563470050.jpg')}
                    className="text-[10px] bg-[#FFE4E6] text-[#BE123C] px-2 py-0.5 rounded-lg border border-[#FDA4AF]"
                  >
                    🌸 Hoa Tokyo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('/src/assets/images/memory_cozy_cafe_1790563484408.jpg')}
                    className="text-[10px] bg-[#DCFCE7] text-[#059669] px-2 py-0.5 rounded-lg border border-[#86EFAC]"
                  >
                    🍵 Quán Kissaten
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('/src/assets/images/sakura_hero_cover_1790563457888.jpg')}
                    className="text-[10px] bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-lg border border-[#FCD34D]"
                  >
                    ✨ Nắng xuân
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5D57] mb-1">
                  Câu chuyện kỷ niệm *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Kể lại khoảnh khắc đáng nhớ đó..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full p-3 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E4DC]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7D6B64] hover:bg-[#F3E7DE] rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Lưu vào hộp ký ức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Memory Preview */}
      {activeMemoryPreview && (
        <div
          onClick={() => setActiveMemoryPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white p-5 sm:p-7 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-[#EADBCE] space-y-4 relative"
          >
            <button
              onClick={() => setActiveMemoryPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF5F0] text-[#7A6962] hover:text-[#3E3432]"
            >
              <X size={18} />
            </button>

            <div className="washi-tape-pink w-28 h-5 mx-auto -mt-2 mb-2" />

            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={activeMemoryPreview.photoUrl}
                alt={activeMemoryPreview.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#95837B] font-mono">
                <span>{activeMemoryPreview.date}</span>
                {activeMemoryPreview.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#E11D48]" />
                    {activeMemoryPreview.location}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-[#3E3432]">
                {activeMemoryPreview.title}
              </h2>

              <p className="text-sm text-[#544641] leading-relaxed whitespace-pre-line">
                {activeMemoryPreview.story}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
