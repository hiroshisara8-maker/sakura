import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, Wind, Bell, Pause, Play } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AmbientPlayerProps {
  compact?: boolean;
}

export const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ compact = false }) => {
  const [currentTrack, setCurrentTrack] = useState<'rain' | 'cafe' | 'breeze' | 'windchime' | 'off'>('off');
  const [volume, setVolume] = useState<number>(0.4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const tracks = [
    { id: 'rain', label: 'Mưa rào', icon: CloudRain, sub: 'Rain noise' },
    { id: 'cafe', label: 'Quán cafe', icon: Coffee, sub: 'Warm lo-fi' },
    { id: 'breeze', label: 'Gió thoảng', icon: Wind, sub: 'Nature breeze' },
    { id: 'windchime', label: 'Chuông gió', icon: Bell, sub: 'Furin bell' },
  ] as const;

  const handleTrackSelect = (track: 'rain' | 'cafe' | 'breeze' | 'windchime') => {
    if (currentTrack === track && isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setCurrentTrack('off');
    } else {
      soundEngine.play(track);
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsMuted(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      const target = currentTrack === 'off' ? 'rain' : currentTrack;
      soundEngine.play(target);
      setCurrentTrack(target);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted) setIsMuted(false);
    soundEngine.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      soundEngine.setVolume(0);
    }
  };

  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF9F5] border border-[#F3E5DC] rounded-xl text-xs">
        <button
          onClick={togglePlayPause}
          className={`p-1.5 rounded-lg transition-colors ${
            isPlaying ? 'bg-[#FDA4AF] text-white' : 'text-[#786C67] hover:bg-[#F3E5DC]'
          }`}
          title={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền thư giãn'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <span className="text-[#8C7A73] font-medium truncate max-w-[80px]">
          {isPlaying ? (currentTrack === 'rain' ? 'Tiếng mưa' : currentTrack === 'cafe' ? 'Quán cafe' : currentTrack === 'breeze' ? 'Gió nhẹ' : 'Chuông gió') : 'Âm thanh'}
        </span>
        <button
          onClick={toggleMute}
          className="text-[#8C7A73] hover:text-[#4A3E3D] transition-colors p-1"
        >
          {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-[#FFFBF8] rounded-2xl border border-[#F3E5DC] shadow-[0_2px_8px_rgba(180,140,120,0.06)]">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#F43F5E] animate-pulse' : 'bg-[#D1C7BD]'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A756D]">
            Âm thanh thư giãn
          </span>
        </div>
        <button
          onClick={togglePlayPause}
          className={`p-1.5 rounded-lg transition-all ${
            isPlaying ? 'bg-[#F472B6] text-white shadow-sm' : 'bg-[#F5EBE6] text-[#786C67] hover:bg-[#EBDDD6]'
          }`}
          aria-label={isPlaying ? 'Dừng phát' : 'Bật âm thanh'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>

      {/* Sound Track Buttons */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {tracks.map((t) => {
          const Icon = t.icon;
          const active = isPlaying && currentTrack === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTrackSelect(t.id)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                active
                  ? 'bg-[#FFE4E6] text-[#BE123C] border border-[#FDA4AF] font-medium shadow-xs'
                  : 'bg-[#FAF4F0] text-[#6E5E58] hover:bg-[#F3E8E2] border border-transparent'
              }`}
            >
              <Icon size={14} className={active ? 'text-[#E11D48]' : 'text-[#9A8983]'} />
              <div className="overflow-hidden">
                <p className="text-[11px] leading-tight truncate">{t.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2 px-1">
        <button
          onClick={toggleMute}
          className="text-[#9A8983] hover:text-[#574B46] transition-colors shrink-0"
          aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
        >
          {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-[#EBDDD6] rounded-lg appearance-none cursor-pointer accent-[#F472B6]"
        />
        <span className="text-[10px] text-[#A89891] w-6 text-right font-mono tabular-nums">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>
    </div>
  );
};
