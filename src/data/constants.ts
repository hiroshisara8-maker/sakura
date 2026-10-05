import { Habit, Memory, MoodDefinition, Goal, DiaryEntry, Task, UserSettings, RoutineItem, ExpenseItem, DailyLivingLog } from '../types';

export const MOODS: MoodDefinition[] = [
  {
    id: 'great',
    emoji: '🌸',
    name: 'Tuyệt vời',
    japanese: '最高 (Saikō)',
    color: '#E11D48',
    bgColor: '#FFE4E6',
    borderColor: '#FDA4AF',
  },
  {
    id: 'happy',
    emoji: '😊',
    name: 'Hạnh phúc',
    japanese: '嬉しい (Ureshii)',
    color: '#D97706',
    bgColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  {
    id: 'peaceful',
    emoji: '🍵',
    name: 'Bình yên',
    japanese: '穏やか (Odayaka)',
    color: '#059669',
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  {
    id: 'neutral',
    emoji: '☁️',
    name: 'Bình thường',
    japanese: '普通 (Futsū)',
    color: '#4B5563',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  {
    id: 'tired',
    emoji: '🍃',
    name: 'Mệt mỏi',
    japanese: '疲れた (Tsukareta)',
    color: '#B45309',
    bgColor: '#FEF9C3',
    borderColor: '#FDE047',
  },
  {
    id: 'sad',
    emoji: '🌧️',
    name: 'Chùng chình',
    japanese: '悲しい (Kanashii)',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  {
    id: 'anxious',
    emoji: '⚡',
    name: 'Lo lắng',
    japanese: '不安 (Fuan)',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    borderColor: '#C4B5FD',
  },
];

export const WEATHER_OPTIONS = [
  { id: 'sunny', label: 'Nắng ấm', icon: '☀️' },
  { id: 'cloudy', label: 'Nhiều mây', icon: '⛅' },
  { id: 'rainy', label: 'Mưa rào', icon: '🌧️' },
  { id: 'windy', label: 'Gió nhẹ', icon: '🍃' },
  { id: 'snowy', label: 'Se lạnh', icon: '❄️' },
];

export const STICKERS = [
  '🌸', '🍵', '🍡', '🐱', '✨', '📖', '🎋', '☕', 
  '🌷', '🍙', '🎨', '🌙', '🧸', '🍓', '🎐', '🚲'
];

export const DAILY_QUESTIONS = [
  'Hôm nay điều gì đã làm bạn bất giác mỉm cười?',
  'Một tách trà hay cuốn sách nào đã đồng hành cùng bạn hôm nay?',
  'Bạn đã học được hoặc nhận ra điều gì mới mẻ ngày hôm nay?',
  'Nếu vẽ lại một màu sắc cho ngày hôm nay, bạn sẽ chọn màu gì?',
  'Ai là người bạn muốn gửi lời cảm ơn thầm lặng nhất lúc này?',
  'Khoảnh khắc yên bình nhất trong ngày của bạn diễn ra khi nào?',
  'Một mục tiêu nhỏ nào bạn đã nỗ lực hoàn thành hôm nay?',
  'Nếu gửi một lời nhắn cho chính mình của 5 năm sau, bạn sẽ viết gì?',
  'Điều dịu dàng nhất bạn dành cho bản thân hôm nay là gì?',
  'Mùi hương hay giai điệu nào khiến bạn cảm thấy dễ chịu nhất hôm nay?'
];

export const MEMORY_CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'travel', label: 'Du lịch & Khám phá' },
  { id: 'friends', label: 'Bạn bè & Trường lớp' },
  { id: 'family', label: 'Gia đình' },
  { id: 'achievement', label: 'Thành tựu' },
  { id: 'love', label: 'Tình cảm' },
  { id: 'cozy', label: 'Khoảnh khắc bình dị' },
];

// Helper to get formatted local date (YYYY-MM-DD)
export const getTodayFormatted = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDateFormatted = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Học tiếng Nhật 30 phút',
    icon: '🇯🇵',
    targetDaysPerWeek: 6,
    category: 'Học tập',
    completedDates: [getOffsetDateFormatted(-3), getOffsetDateFormatted(-2), getOffsetDateFormatted(-1), getTodayFormatted()],
    color: '#F472B6',
  },
  {
    id: 'habit-2',
    name: 'Đọc 10 trang sách',
    icon: '📚',
    targetDaysPerWeek: 7,
    category: 'Phát triển',
    completedDates: [getOffsetDateFormatted(-4), getOffsetDateFormatted(-2), getOffsetDateFormatted(-1), getTodayFormatted()],
    color: '#818CF8',
  },
  {
    id: 'habit-3',
    name: 'Uống 2 lít nước',
    icon: '💧',
    targetDaysPerWeek: 7,
    category: 'Sức khỏe',
    completedDates: [getOffsetDateFormatted(-3), getOffsetDateFormatted(-2), getOffsetDateFormatted(-1)],
    color: '#38BDF8',
  },
  {
    id: 'habit-4',
    name: 'Tập thể dục / Yoga nhẹ',
    icon: '🧘‍♀️',
    targetDaysPerWeek: 5,
    category: 'Thể thao',
    completedDates: [getOffsetDateFormatted(-2), getOffsetDateFormatted(-1), getTodayFormatted()],
    color: '#34D399',
  },
  {
    id: 'habit-5',
    name: 'Ngủ trước 23:00',
    icon: '🌙',
    targetDaysPerWeek: 6,
    category: 'Nghỉ ngơi',
    completedDates: [getOffsetDateFormatted(-3), getOffsetDateFormatted(-1)],
    color: '#A78BFA',
  },
  {
    id: 'habit-6',
    name: 'Dọn dẹp bàn học',
    icon: '🧹',
    targetDaysPerWeek: 5,
    category: 'Đời sống',
    completedDates: [getOffsetDateFormatted(-2), getTodayFormatted()],
    color: '#FBBF24',
  },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    date: getTodayFormatted(),
    text: 'Ôn tập 20 chữ Hán N4 (JLPT kanji)',
    completed: true,
    priority: 'urgent',
    timeSlot: 'morning',
  },
  {
    id: 'task-2',
    date: getTodayFormatted(),
    text: 'Mua sổ tay và bút lông Sakura Pigma Micron',
    completed: true,
    priority: 'normal',
    timeSlot: 'afternoon',
  },
  {
    id: 'task-3',
    date: getTodayFormatted(),
    text: 'Ghé quán cafe Kissaten đọc nốt chương 3',
    completed: false,
    priority: 'important',
    timeSlot: 'afternoon',
  },
  {
    id: 'task-4',
    date: getTodayFormatted(),
    text: 'Tưới nước chậu sen đá ngoài ban công',
    completed: false,
    priority: 'normal',
    timeSlot: 'evening',
  },
];

export const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'Mùa hoa anh đào bên dòng kênh Meguro',
    date: getOffsetDateFormatted(-2),
    story: 'Những cánh hoa sakura chớm nở phủ kín mặt nước như một dải lụa hồng phấn. Gió thoảng qua mang theo hương thơm nhàn nhạt của mùa xuân. Một khoảnh khắc bình yên mà mình muốn lưu giữ mãi mãi.',
    photoUrl: '/src/assets/images/memory_tokyo_spring_1790563470050.jpg',
    category: 'travel',
    isSpecial: true,
    location: 'Kênh Meguro, Tokyo',
  },
  {
    id: 'mem-2',
    title: 'Buổi chiều tĩnh lặng tại quán trà gỗ',
    date: getOffsetDateFormatted(-5),
    story: 'Một tách matcha latte nóng hổi cùng chiếc bánh dango ngọt dịu. Ngồi bên khung cửa sổ ngắm mưa phùn lất phất và viết lại những dòng suy nghĩ lấp lánh vào cuốn sổ tay.',
    photoUrl: '/src/assets/images/memory_cozy_cafe_1790563484408.jpg',
    category: 'cozy',
    isSpecial: true,
    location: 'Quán Kissaten xưa',
  },
  {
    id: 'mem-3',
    title: 'Gặp lại nhóm bạn thân thời cấp 3',
    date: getOffsetDateFormatted(-12),
    story: 'Sau bao ngày bận rộn thi cử, cả nhóm lại ngồi bên nhau cười vang cả góc phố. Tình bạn những năm tháng học trò luôn trong trẻo và quý giá như vậy.',
    photoUrl: '/src/assets/images/sakura_hero_cover_1790563457888.jpg',
    category: 'friends',
    isSpecial: false,
    location: 'Góc trà sữa kỷ niệm',
  },
];

export const DEFAULT_ENTRIES: DiaryEntry[] = [
  {
    id: 'entry-1',
    date: getTodayFormatted(),
    createdAt: new Date().toISOString(),
    title: 'Một ngày dịu dàng như hoa nở',
    content: 'Sáng nay mình dậy sớm hơn thường lệ, mở cửa sổ đón làn gió mát lành. Nắng vàng rót nhẹ xuống bàn học, mình pha một ly trà hoa cúc và bắt đầu ngày mới thật thư thái. Dù có một vài bài tập khó nhưng sau khi ngồi tập trung ở quán nhỏ, mọi thứ đều đã hoàn thành êm đẹp. Cảm giác nhẹ nhõm và tràn đầy năng lượng tích cực.',
    moodId: 'great',
    moodReason: 'Hoàn thành bài vở sớm và được thưởng thức một ly trà ngon',
    weather: 'sunny',
    photos: ['/src/assets/images/sakura_hero_cover_1790563457888.jpg'],
    photoCaptions: {
      '/src/assets/images/sakura_hero_cover_1790563457888.jpg': 'Góc bàn nhỏ sáng sớm ngập tràn ánh nắng',
    },
    tags: ['Bình yên', 'Học tập', 'Sakura'],
    stickers: ['🌸', '🍵', '✨'],
    gratitudeList: [
      'Ánh nắng ban mai ấm áp chiếu qua khung cửa sổ',
      'Lời động viên bất ngờ từ người bạn thân',
      'Một buổi sáng khỏe mạnh và tràn đầy cảm hứng'
    ],
    dailyQuestionAnswer: 'Hôm nay điều làm mình vui nhất là khi nhìn thấy những bông hoa giấy đầu ngõ nở rực rỡ dưới nắng.',
    isFavorite: true,
  },
  {
    id: 'entry-2',
    date: getOffsetDateFormatted(-1),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    title: 'Dạo bước sau cơn mưa chiều',
    content: 'Cơn mưa rào bất chợt làm dịu đi không khí oi bức. Đường phố lấp lánh phản chiếu ánh đèn đường. Mình đi bộ chậm rãi dưới tán ô, lắng nghe tiếng nước róc rách và cảm nhận sự tươi mới của cỏ cây.',
    moodId: 'peaceful',
    moodReason: 'Không khí trong lành sau mưa và tâm trạng rất tĩnh tại',
    weather: 'rainy',
    photos: ['/src/assets/images/memory_cozy_cafe_1790563484408.jpg'],
    photoCaptions: {
      '/src/assets/images/memory_cozy_cafe_1790563484408.jpg': 'Ghé vào quán trú mưa và gọi một tách latte ấm',
    },
    tags: ['Mưa', 'Tản bộ', 'Thư giãn'],
    stickers: ['🌧️', '☕', '🍃'],
    gratitudeList: [
      'Chiếc ô che mưa nhỏ gọn luôn ở trong balo',
      'Tách latte ngọt ngào sưởi ấm bàn tay'
    ],
    dailyQuestionAnswer: 'Mùi hương của đất ẩm sau cơn mưa khiến tâm trí mình lắng đọng nhất.',
    isFavorite: false,
  },
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Thuộc 100 từ vựng JLPT trong tháng',
    type: 'monthly',
    progress: 72,
    target: '100 từ vựng',
    completed: false,
    deadline: 'Cuối tháng này',
  },
  {
    id: 'goal-2',
    title: 'Đọc hết cuốn "Cây cam ngọt của tôi"',
    type: 'weekly',
    progress: 85,
    target: '220 trang',
    completed: false,
    deadline: 'Chủ nhật tới',
  },
  {
    id: 'goal-3',
    title: 'Uống đủ 2L nước mỗi ngày trong tuần',
    type: 'daily',
    progress: 100,
    target: '7 ngày liên tục',
    completed: true,
    deadline: 'Hôm nay',
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Sakura Haru',
  avatarUrl: '/src/assets/images/sakura_avatar_girl_1790563499979.jpg',
  bio: 'Sống chậm lại, cảm nhận nhiều hơn mỗi ngày 🌸 日日是好日',
  themeColor: 'sakura',
  soundVolume: 0.4,
  soundTrack: 'rain',
  language: 'vi',
  reminderTime: '21:30',
  reminderEnabled: true,
  dailyWaterTarget: 2000,
  dailySleepTarget: 8,
};

export const DEFAULT_ROUTINES: RoutineItem[] = [
  {
    id: 'rt-1',
    time: '06:30',
    title: 'Thức dậy & uống 1 ly nước ấm thanh lọc',
    period: 'morning',
    completed: true,
    icon: '🌅',
  },
  {
    id: 'rt-2',
    time: '07:15',
    title: 'Vệ sinh cá nhân, skincare & ăn sáng',
    period: 'morning',
    completed: true,
    icon: '🍳',
  },
  {
    id: 'rt-3',
    time: '08:00',
    title: 'Tập trung học tập / làm việc ca sáng',
    period: 'morning',
    completed: true,
    icon: '💻',
  },
  {
    id: 'rt-4',
    time: '12:00',
    title: 'Ăn trưa bổ dưỡng & nghỉ trưa 20 phút',
    period: 'afternoon',
    completed: true,
    icon: '🍱',
  },
  {
    id: 'rt-5',
    time: '14:00',
    title: 'Ca chiều & bổ sung 1 ly nước mát',
    period: 'afternoon',
    completed: false,
    icon: '💧',
  },
  {
    id: 'rt-6',
    time: '17:30',
    title: 'Tập thể dục nhẹ / Yoga / Tản bộ',
    period: 'afternoon',
    completed: false,
    icon: '🧘‍♀️',
  },
  {
    id: 'rt-7',
    time: '19:00',
    title: 'Ăn tối & dọn dẹp không gian sinh hoạt',
    period: 'evening',
    completed: false,
    icon: '🥗',
  },
  {
    id: 'rt-8',
    time: '21:30',
    title: 'Tắm nước ấm, skincare & dưỡng ẩm',
    period: 'night',
    completed: false,
    icon: '🛁',
  },
  {
    id: 'rt-9',
    time: '22:15',
    title: 'Viết nhật ký SAKURA & đọc sách',
    period: 'night',
    completed: false,
    icon: '📖',
  },
  {
    id: 'rt-10',
    time: '22:45',
    title: 'Tắt thiết bị điện tử & đi ngủ đúng giờ',
    period: 'night',
    completed: false,
    icon: '🌙',
  },
];

export const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    date: getTodayFormatted(),
    amount: 35000,
    category: 'food',
    note: 'Bánh mì ngũ cốc & sữa đậu nành buổi sáng',
    time: '07:30',
  },
  {
    id: 'exp-2',
    date: getTodayFormatted(),
    amount: 55000,
    category: 'food',
    note: 'Cơm trưa văn phòng & canh rong biển',
    time: '12:15',
  },
  {
    id: 'exp-3',
    date: getTodayFormatted(),
    amount: 25000,
    category: 'living',
    note: 'Mua nước khoáng & giấy lau bàn',
    time: '15:20',
  },
  {
    id: 'exp-4',
    date: getOffsetDateFormatted(-1),
    amount: 45000,
    category: 'food',
    note: 'Tách matcha latte tại quán cafe',
    time: '16:00',
  },
  {
    id: 'exp-5',
    date: getOffsetDateFormatted(-1),
    amount: 60000,
    category: 'study',
    note: 'Mua bút lông và sổ ghi chép',
    time: '18:30',
  },
];

export const DEFAULT_LIVING_LOG: DailyLivingLog = {
  date: getTodayFormatted(),
  waterMl: 1500,
  targetWaterMl: 2000,
  sleepHours: 7.5,
  bedTime: '23:00',
  wakeTime: '06:30',
  sleepQuality: 'great',
  meals: {
    breakfast: 'Bánh mì mè đen, trứng ốp la & sữa chua hoa quả',
    lunch: 'Cơm cá hồi áp chảo, rau luộc & canh miso',
    dinner: 'Salad ức gà sốt mè rang thanh đạm',
    snack: 'Táo tươi và 1 tách trà xanh',
  },
  workoutMinutes: 25,
  roomCleaned: true,
  personalNotes: 'Hôm nay cảm thấy cơ thể nhẹ nhõm, nhịp sinh hoạt rất đều đặn 🌸',
};

