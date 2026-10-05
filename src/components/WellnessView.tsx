import React, { useState } from 'react';
import {
  Droplet,
  Moon,
  Utensils,
  Dumbbell,
  Sparkles,
  Heart,
  Check,
  Plus,
  Minus,
  RefreshCw,
  Sun,
  Smile,
} from 'lucide-react';
import { DailyLivingLog, UserSettings } from '../types';

interface WellnessViewProps {
  livingLog: DailyLivingLog;
  onUpdateLivingLog: (updated: DailyLivingLog) => void;
  settings: UserSettings;
}

export const WellnessView: React.FC<WellnessViewProps> = ({
  livingLog,
  onUpdateLivingLog,
  settings,
}) => {
  const targetWater = settings.dailyWaterTarget || 2000;
  const currentWater = livingLog.waterMl || 0;
  const waterPct = Math.min(100, Math.round((currentWater / targetWater) * 100));
  const glassCount = Math.floor(currentWater / 250);

  const [mealInput, setMealInput] = useState({
    breakfast: livingLog.meals?.breakfast || '',
    lunch: livingLog.meals?.lunch || '',
    dinner: livingLog.meals?.dinner || '',
    snack: livingLog.meals?.snack || '',
  });

  const [bedTime, setBedTime] = useState(livingLog.bedTime || '23:00');
  const [wakeTime, setWakeTime] = useState(livingLog.wakeTime || '06:30');
  const [sleepHours, setSleepHours] = useState(livingLog.sleepHours || 7.5);
  const [sleepQuality, setSleepQuality] = useState(livingLog.sleepQuality || 'great');
  const [workoutMin, setWorkoutMin] = useState(livingLog.workoutMinutes || 20);
  const [roomCleaned, setRoomCleaned] = useState(livingLog.roomCleaned ?? true);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Quick water adjustments
  const addWater = (ml: number) => {
    const updated = {
      ...livingLog,
      waterMl: Math.max(0, currentWater + ml),
    };
    onUpdateLivingLog(updated);
  };

  const resetWater = () => {
    onUpdateLivingLog({
      ...livingLog,
      waterMl: 0,
    });
  };

  const handleSaveWellness = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: DailyLivingLog = {
      ...livingLog,
      waterMl: currentWater,
      sleepHours: Number(sleepHours),
      bedTime,
      wakeTime,
      sleepQuality,
      meals: mealInput,
      workoutMinutes: Number(workoutMin),
      roomCleaned,
    };
    onUpdateLivingLog(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  // Lifestyle Balance Score Calculation (0-100%)
  const calculateLifestyleScore = () => {
    let score = 0;
    // 1. Water: up to 25 pts
    score += Math.min(25, Math.round((currentWater / targetWater) * 25));
    // 2. Sleep: up to 25 pts
    if (sleepHours >= 7 && sleepHours <= 9) score += 25;
    else if (sleepHours >= 6) score += 18;
    else score += 10;
    // 3. Meals logged: up to 20 pts (5 each)
    if (mealInput.breakfast.trim()) score += 5;
    if (mealInput.lunch.trim()) score += 5;
    if (mealInput.dinner.trim()) score += 5;
    if (mealInput.snack.trim()) score += 5;
    // 4. Workout & Room: up to 30 pts
    if (workoutMin >= 15) score += 15;
    else if (workoutMin > 0) score += 8;
    if (roomCleaned) score += 15;

    return Math.min(100, Math.max(0, score));
  };

  const lifestyleScore = calculateLifestyleScore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)]">
        <div className="flex items-center gap-2 mb-1">
          <Droplet size={20} className="text-[#38BDF8]" />
          <h1 className="text-xl font-bold text-[#3E3432]">
            Theo dõi sức khỏe & Thể chất sinh hoạt
          </h1>
          <span className="text-xs text-[#059669] font-japanese font-medium px-2 py-0.5 rounded-full bg-[#DCFCE7]">
            健康管理
          </span>
        </div>
        <p className="text-xs text-[#95837B]">
          Chăm sóc giấc ngủ, bổ sung đủ nước, dinh dưỡng bữa ăn và vận động hằng ngày
        </p>
      </div>

      {/* Lifestyle Score Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#F0FDF4] via-[#FFFDF9] to-[#FFF5F7] rounded-3xl border border-[#D5EFE2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} />
            Chỉ số cân bằng sinh hoạt hôm nay
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2A4134]">
            {lifestyleScore}% · {lifestyleScore >= 80 ? 'Rất lành mạnh & Điều độ 🌸' : lifestyleScore >= 50 ? 'Khá tốt, hãy uống thêm nước nhé 🌱' : 'Cần chú ý nghỉ ngơi và ăn uống đều đặn 🍵'}
          </h2>
          <p className="text-xs text-[#6B8576]">
            Được tổng hợp từ giấc ngủ ({sleepHours}h), nước uống ({currentWater}/{targetWater}ml), 3 bữa ăn và vận động.
          </p>
        </div>

        <div className="w-20 h-20 rounded-full border-4 border-[#86EFAC] bg-white flex flex-col items-center justify-center shrink-0 shadow-sm mx-auto sm:mx-0">
          <span className="text-xl font-bold font-mono text-[#059669]">{lifestyleScore}%</span>
          <span className="text-[9px] text-[#8C7A73]">Điểm sống</span>
        </div>
      </div>

      {/* Grid: Water Tracker & Sleep Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Water Intake Tracker */}
        <div className="p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <Droplet size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3E3432]">Uống đủ 2L nước</h3>
                <p className="text-[11px] text-[#8C7A73]">Mục tiêu: {targetWater}ml / ngày</p>
              </div>
            </div>
            <button
              onClick={resetWater}
              className="p-1.5 text-[#A89891] hover:text-[#3E3432] rounded-lg"
              title="Đặt lại về 0"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Water progress display */}
          <div className="p-4 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] text-center space-y-2">
            <p className="text-3xl font-bold text-[#0369A1] font-mono tabular-nums">
              {currentWater} <span className="text-sm font-normal text-[#64748B]">/ {targetWater} ml</span>
            </p>
            <p className="text-xs font-semibold text-[#0284C7]">
              {waterPct}% mục tiêu · tương đương {glassCount} ly nước (250ml)
            </p>
            {/* Visual water fill bar */}
            <div className="w-full bg-[#E0F2FE] h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] transition-all duration-300 rounded-full"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => addWater(-250)}
              className="px-3 py-2 bg-[#FAF5F0] hover:bg-[#F3E7DE] text-[#7A6962] rounded-xl text-xs font-semibold transition-colors"
            >
              -250ml
            </button>
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-2 px-3 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>+ 1 Ly (250ml)</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-2 px-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>+ 1 Bình (500ml)</span>
            </button>
          </div>
        </div>

        {/* 2. Sleep & Rest Tracker */}
        <div className="p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <Moon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#3E3432]">Giấc ngủ & Nghỉ ngơi</h3>
              <p className="text-[11px] text-[#8C7A73]">Đảm bảo ngủ đủ 7-8 tiếng mỗi ngày</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#7A6962] mb-1">
                Giờ đi ngủ tối qua
              </label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A6962] mb-1">
                Giờ thức dậy sáng nay
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-[#6E5D57]">Thời lượng ngủ:</span>
              <span className="font-mono text-[#7C3AED] font-bold">{sleepHours} tiếng</span>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8DDD4] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
            />
          </div>

          {/* Sleep Quality */}
          <div>
            <label className="block text-[11px] font-bold text-[#7A6962] mb-1.5">
              Cảm giác sau khi ngủ dậy:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'great', label: 'Êm ái & Tỉnh táo', icon: '🌸' },
                { id: 'normal', label: 'Bình thường', icon: '☁️' },
                { id: 'poor', label: 'Chập chờn / Mệt', icon: '🌧️' },
              ].map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSleepQuality(q.id as any)}
                  className={`p-2 rounded-xl text-center text-xs font-medium border transition-all ${
                    sleepQuality === q.id
                      ? 'bg-[#EDE9FE] border-[#C4B5FD] text-[#5B21B6] font-bold'
                      : 'bg-[#FAF5F0] border-transparent text-[#73635C]'
                  }`}
                >
                  <span className="block text-base">{q.icon}</span>
                  <span className="text-[10px] leading-tight">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Daily Meals & Nutrition */}
      <div className="p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Utensils size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3E3432]">Nhật ký 3 bữa ăn sinh hoạt</h3>
            <p className="text-[11px] text-[#8C7A73]">Ăn đúng giờ và đầy đủ dưỡng chất mỗi ngày</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#7A6962] mb-1">
              🍳 Bữa sáng (Breakfast)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Bánh mì ngũ cốc, trứng ốp la, sữa chua..."
              value={mealInput.breakfast}
              onChange={(e) => setMealInput({ ...mealInput, breakfast: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7A6962] mb-1">
              🍱 Bữa trưa (Lunch)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Cơm cá hồi, rau luộc & canh miso..."
              value={mealInput.lunch}
              onChange={(e) => setMealInput({ ...mealInput, lunch: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7A6962] mb-1">
              🥗 Bữa tối (Dinner)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Salad ức gà sốt mè rang thanh đạm..."
              value={mealInput.dinner}
              onChange={(e) => setMealInput({ ...mealInput, dinner: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7A6962] mb-1">
              🍵 Bữa phụ & Trà chiều (Snack)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: 1 quả táo tươi, 1 tách trà thảo mộc..."
              value={mealInput.snack}
              onChange={(e) => setMealInput({ ...mealInput, snack: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF5F0] rounded-xl border border-[#EDE0D6] text-[#4A3E3B]"
            />
          </div>
        </div>
      </div>

      {/* 4. Workout & Space Tidying */}
      <div className="p-5 sm:p-6 bg-[#FFFDFB] rounded-3xl border border-[#F2E5DC] shadow-[0_2px_12px_rgba(200,160,140,0.06)] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#059669] flex items-center justify-center">
            <Dumbbell size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3E3432]">Vận động & Chăm sóc không gian sống</h3>
            <p className="text-[11px] text-[#8C7A73]">Giữ cơ thể linh hoạt và căn phòng gọn gàng ngăn nắp</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#FAF5F0] rounded-2xl border border-[#EDE0D6] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#6E5D57]">Thời gian tập thể dục / Yoga:</span>
              <span className="font-mono text-[#059669] font-bold">{workoutMin} phút</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={workoutMin}
              onChange={(e) => setWorkoutMin(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#E8DDD4] rounded-lg appearance-none cursor-pointer accent-[#059669]"
            />
            <p className="text-[10px] text-[#8C7A73]">Gợi ý: 20-30 phút vận động nhẹ giúp giải tỏa stress rất tốt.</p>
          </div>

          <div
            onClick={() => setRoomCleaned(!roomCleaned)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              roomCleaned
                ? 'bg-[#F0FDF4] border-[#86EFAC]'
                : 'bg-[#FAF5F0] border-[#EDE0D6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧹</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#3E3432]">
                  Dọn dẹp bàn học & phòng ngủ
                </p>
                <p className="text-[11px] text-[#8C7A73]">
                  {roomCleaned ? 'Đã dọn dẹp sạch sẽ, thơm tho' : 'Chưa dọn dẹp hôm nay'}
                </p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors ${
                roomCleaned ? 'bg-[#059669] text-white' : 'border border-[#C9B9AF] bg-white'
              }`}
            >
              {roomCleaned && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F2E5DC]">
          <div>
            {isSavedToast && (
              <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                <Check size={14} /> Đã lưu thông tin sức khỏe sinh hoạt!
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleSaveWellness()}
            className="px-6 py-2.5 bg-gradient-to-r from-[#34D399] to-[#059669] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Lưu cập nhật thể chất
          </button>
        </div>
      </div>
    </div>
  );
};
