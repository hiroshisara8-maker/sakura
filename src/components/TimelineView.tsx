import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Calendar,
  Smile,
  Heart,
  ChevronRight,
  BookOpen,
  Filter,
} from 'lucide-react';
import { DiaryEntry, Habit, Memory, MoodType } from '../types';
import { MOODS } from '../data/constants';

interface TimelineViewProps {
  entries: DiaryEntry[];
  memories: Memory[];
  habits: Habit[];
  onSelectEntry: (entry: DiaryEntry) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  entries,
  memories,
  habits,
  onSelectEntry,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'entries' | 'memories'>('all');

  // Combine entries and memories into chronological events
  interface TimelineEvent {
    id: string;
    date: string;
    type: 'entry' | 'memory';
    data: DiaryEntry | Memory;
  }

  const events: TimelineEvent[] = [];

  if (filterType === 'all' || filterType === 'entries') {
    entries.forEach((e) => {
      events.push({
        id: `entry-${e.id}`,
        date: e.date,
        type: 'entry',
        data: e,
      });
    });
  }

  if (filterType === 'all' || filterType === 'memories') {
    memories.forEach((m) => {
      events.push({
        id: `mem-${m.id}`,
        date: m.date,
        type: 'memory',
        data: m,
      });
    });
  }

  // Sort newest first
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-[#3E3432] flex items-center gap-2">
            <Clock size={20} className="text-[#E11D48]" />
            <span>Timeline cuộc sống</span>
            <span className="text-xs text-[#E11D48] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#FFF1F2]">
              タイムライン
            </span>
          </h1>
          <p className="text-xs text-[#95837B]">
            Dòng chảy thời gian lưu giữ từng bước chân và cảm xúc của bạn
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF4F0] p-1 rounded-2xl border border-[#E8DCD4]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
              filterType === 'all'
                ? 'bg-white text-[#BE123C] shadow-xs'
                : 'text-[#73635C] hover:text-[#3E3432]'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType('entries')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
              filterType === 'entries'
                ? 'bg-white text-[#BE123C] shadow-xs'
                : 'text-[#73635C] hover:text-[#3E3432]'
            }`}
          >
            Nhật ký
          </button>
          <button
            onClick={() => setFilterType('memories')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-colors ${
              filterType === 'memories'
                ? 'bg-white text-[#BE123C] shadow-xs'
                : 'text-[#73635C] hover:text-[#3E3432]'
            }`}
          >
            Kỷ niệm
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#FDA4AF] before:via-[#EADBCE] before:to-transparent">
        {events.map((ev) => {
          const isEntry = ev.type === 'entry';
          const entry = isEntry ? (ev.data as DiaryEntry) : null;
          const memory = !isEntry ? (ev.data as Memory) : null;
          const mood = entry ? MOODS.find((m) => m.id === entry.moodId) : null;

          return (
            <div key={ev.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 w-5 h-5 rounded-full ring-4 ring-[#FAF7F2] flex items-center justify-center text-[10px] ${
                  isEntry
                    ? 'bg-[#E11D48] text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                    : 'bg-[#059669] text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]'
                }`}
              >
                {isEntry ? '🌸' : '💗'}
              </div>

              {/* Event Card */}
              {isEntry && entry ? (
                <div
                  onClick={() => onSelectEntry(entry)}
                  className="p-5 sm:p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] hover:shadow-[0_8px_24px_rgba(200,160,140,0.12)] transition-all cursor-pointer notebook-grid"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#E11D48] bg-[#FFE4E6] px-2 py-0.5 rounded-lg">
                        {entry.date}
                      </span>
                      {mood && (
                        <span className="text-xs text-[#7A6962] flex items-center gap-1">
                          <span>{mood.emoji}</span>
                          <span className="font-medium">{mood.name}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1 text-xs">
                      {entry.stickers?.map((st, i) => (
                        <span key={i}>{st}</span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#3E3432] group-hover:text-[#E11D48] transition-colors mb-2">
                    {entry.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#574843] leading-relaxed line-clamp-3 mb-3">
                    {entry.content}
                  </p>

                  {/* Photos */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                      {entry.photos.map((ph, idx) => (
                        <img
                          key={idx}
                          src={ph}
                          alt="Photo"
                          className="w-24 h-24 object-cover rounded-xl border border-[#EADBCE]"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}

                  {/* Gratitude & tags */}
                  {entry.gratitudeList && entry.gratitudeList.length > 0 && (
                    <p className="text-[11px] text-[#059669] italic bg-[#F0FDF4] px-3 py-1.5 rounded-xl border border-[#BBF7D0] mb-2 truncate">
                      🌱 Biết ơn: {entry.gratitudeList[0]}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#F5EDE8] text-[11px] text-[#A3928B]">
                    <span>Bấm để xem & chỉnh sửa nhật ký</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ) : memory ? (
                /* Memory Card */
                <div className="p-5 sm:p-6 bg-[#FFFDF9] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#059669] bg-[#DCFCE7] px-2 py-0.5 rounded-lg">
                      {memory.date}
                    </span>
                    <span className="text-[11px] font-medium text-[#A3928B]">
                      Hộp ký ức
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="aspect-4/3 rounded-xl overflow-hidden border border-[#EADBCE]">
                      <img
                        src={memory.photoUrl}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <h3 className="text-base font-bold text-[#3E3432]">
                        {memory.title}
                      </h3>
                      <p className="text-xs text-[#574843] leading-relaxed line-clamp-3">
                        {memory.story}
                      </p>
                      {memory.location && (
                        <p className="text-[11px] text-[#9E8E87] pt-1">
                          📍 {memory.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="py-16 text-center bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] text-xs text-[#8C7A73]">
          Chưa có sự kiện nào trong dòng thời gian.
        </div>
      )}
    </div>
  );
};
