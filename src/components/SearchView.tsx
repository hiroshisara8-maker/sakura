import React, { useState } from 'react';
import {
  Search as SearchIcon,
  Calendar,
  Smile,
  Tag,
  BookOpen,
  Heart,
  ChevronRight,
  X,
} from 'lucide-react';
import { DiaryEntry, Memory, MoodType } from '../types';
import { MOODS } from '../data/constants';

interface SearchViewProps {
  entries: DiaryEntry[];
  memories: Memory[];
  onSelectEntry: (entry: DiaryEntry) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  entries,
  memories,
  onSelectEntry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [contentType, setContentType] = useState<'all' | 'entries' | 'memories'>('all');

  const normalizedQuery = searchTerm.toLowerCase().trim();

  // Search Entries
  const matchedEntries = entries.filter((e) => {
    if (contentType === 'memories') return false;
    if (selectedMood !== 'all' && e.moodId !== selectedMood) return false;
    if (!normalizedQuery) return true;

    const inTitle = e.title.toLowerCase().includes(normalizedQuery);
    const inContent = e.content.toLowerCase().includes(normalizedQuery);
    const inReason = (e.moodReason || '').toLowerCase().includes(normalizedQuery);
    const inGratitude = e.gratitudeList?.some((g) => g.toLowerCase().includes(normalizedQuery));
    const inTags = e.tags?.some((t) => t.toLowerCase().includes(normalizedQuery));
    const inDate = e.date.includes(normalizedQuery);

    return inTitle || inContent || inReason || inGratitude || inTags || inDate;
  });

  // Search Memories
  const matchedMemories = memories.filter((m) => {
    if (contentType === 'entries') return false;
    if (selectedMood !== 'all') return false; // memories don't have mood
    if (!normalizedQuery) return true;

    const inTitle = m.title.toLowerCase().includes(normalizedQuery);
    const inStory = m.story.toLowerCase().includes(normalizedQuery);
    const inLocation = (m.location || '').toLowerCase().includes(normalizedQuery);
    const inDate = m.date.includes(normalizedQuery);

    return inTitle || inStory || inLocation || inDate;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <SearchIcon size={20} className="text-[#E11D48]" />
            <span>Tìm kiếm ký ức & nhật ký</span>
            <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFE4E6]">
              検索
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Tìm kiếm bằng từ khóa, ngày tháng, tâm trạng hoặc nhãn tag
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89891]" />
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm (ví dụ: hoa anh đào, trà, bài tập, Tokyo, 2026-09...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] text-[#4A3E3B] focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89891] hover:text-[#3E3432] p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Content Type Tabs */}
          <div className="flex items-center gap-1.5 bg-[#FAF4F0] p-1 rounded-2xl border border-[#E8DCD4]">
            <button
              onClick={() => setContentType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
                contentType === 'all' ? 'bg-white text-[#BE123C] shadow-xs' : 'text-[#73635C]'
              }`}
            >
              Tất cả ({matchedEntries.length + matchedMemories.length})
            </button>
            <button
              onClick={() => setContentType('entries')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
                contentType === 'entries' ? 'bg-white text-[#BE123C] shadow-xs' : 'text-[#73635C]'
              }`}
            >
              Nhật ký ({matchedEntries.length})
            </button>
            <button
              onClick={() => setContentType('memories')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
                contentType === 'memories' ? 'bg-white text-[#BE123C] shadow-xs' : 'text-[#73635C]'
              }`}
            >
              Kỷ niệm ({matchedMemories.length})
            </button>
          </div>

          {/* Mood Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedMood('all')}
              className={`px-2.5 py-1 text-xs rounded-xl transition-colors ${
                selectedMood === 'all'
                  ? 'bg-[#FFE4E6] text-[#BE123C] font-semibold'
                  : 'bg-[#FAF5F0] text-[#786C67]'
              }`}
            >
              Mọi tâm trạng
            </button>
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`p-1.5 rounded-xl text-sm transition-colors ${
                  selectedMood === m.id ? 'bg-[#FFE4E6] ring-1 ring-[#FDA4AF]' : 'bg-[#FAF5F0]'
                }`}
                title={m.name}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {/* Entries Results */}
        {matchedEntries.map((entry) => {
          const mood = MOODS.find((m) => m.id === entry.moodId);
          return (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="p-5 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs hover:shadow-md transition-all cursor-pointer notebook-grid"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#E11D48] bg-[#FFE4E6] px-2 py-0.5 rounded-lg">
                    {entry.date}
                  </span>
                  {mood && (
                    <span className="text-xs text-[#7A6962] flex items-center gap-1">
                      <span>{mood.emoji}</span>
                      <span>{mood.name}</span>
                    </span>
                  )}
                </div>

                <div className="flex gap-1 text-xs">
                  {entry.stickers?.map((st, i) => (
                    <span key={i}>{st}</span>
                  ))}
                </div>
              </div>

              <h3 className="text-base font-bold text-[#3E3432] mb-1">
                {entry.title}
              </h3>

              <p className="text-xs text-[#574843] leading-relaxed line-clamp-2">
                {entry.content}
              </p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {entry.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-[#8C7A73] bg-[#FAF5F0] px-2 py-0.5 rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Memories Results */}
        {matchedMemories.map((mem) => (
          <div
            key={mem.id}
            className="p-4 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-xs flex items-center gap-4"
          >
            <img
              src={mem.photoUrl}
              alt={mem.title}
              className="w-20 h-20 object-cover rounded-2xl border border-[#EADBCE] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-[#95837B] font-mono mb-0.5">
                <span>{mem.date}</span>
                <span>·</span>
                <span className="text-[#059669]">Kỷ niệm</span>
              </div>
              <h3 className="text-sm font-bold text-[#3E3432] truncate">
                {mem.title}
              </h3>
              <p className="text-xs text-[#6E5D57] line-clamp-2 mt-0.5">
                {mem.story}
              </p>
            </div>
          </div>
        ))}

        {matchedEntries.length === 0 && matchedMemories.length === 0 && (
          <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] text-xs text-[#8C7A73]">
            Không tìm thấy nhật ký hay kỷ niệm nào phù hợp với từ khóa này.
          </div>
        )}
      </div>
    </div>
  );
};
