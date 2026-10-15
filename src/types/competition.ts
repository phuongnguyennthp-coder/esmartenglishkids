export type TeamId = 'lions' | 'dolphins' | 'eagles' | 'pandas';

export interface TeamInfo {
  id: TeamId;
  nameEn: string;
  nameVi: string;
  emoji: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export const TEAMS: Record<TeamId, TeamInfo> = {
  lions: {
    id: 'lions',
    nameEn: 'Brave Lions',
    nameVi: 'Sư Tử Dũng Mãnh',
    emoji: '🦁',
    colorBg: 'bg-amber-100 dark:bg-amber-950/50',
    colorBorder: 'border-amber-400',
    colorText: 'text-amber-800 dark:text-amber-300',
  },
  dolphins: {
    id: 'dolphins',
    nameEn: 'Smart Dolphins',
    nameVi: 'Cá Heo Thông Thái',
    emoji: '🐬',
    colorBg: 'bg-sky-100 dark:bg-sky-950/50',
    colorBorder: 'border-sky-400',
    colorText: 'text-sky-800 dark:text-sky-300',
  },
  eagles: {
    id: 'eagles',
    nameEn: 'Flying Eagles',
    nameVi: 'Đại Bàng Vút Bay',
    emoji: '🦅',
    colorBg: 'bg-purple-100 dark:bg-purple-950/50',
    colorBorder: 'border-purple-400',
    colorText: 'text-purple-800 dark:text-purple-300',
  },
  pandas: {
    id: 'pandas',
    nameEn: 'Hardworking Pandas',
    nameVi: 'Gấu Trúc Chăm Chỉ',
    emoji: '🐼',
    colorBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    colorBorder: 'border-emerald-400',
    colorText: 'text-emerald-800 dark:text-emerald-300',
  },
};

export interface DojoCategory {
  id: string;
  titleVi: string;
  titleEn: string;
  delta: number;
  emoji: string;
  type: 'positive' | 'needs_work';
  color: string;
}

export const DOJO_CATEGORIES: DojoCategory[] = [
  // Positive Behaviors
  { id: 'p_speak', titleVi: 'Hăng hái phát biểu', titleEn: 'Active Participation', delta: 1, emoji: '🙋‍♂️', type: 'positive', color: 'emerald' },
  { id: 'p_homework', titleVi: 'Hoàn thành bài tập về nhà', titleEn: 'Completed Homework', delta: 3, emoji: '📝', type: 'positive', color: 'blue' },
  { id: 'p_pronounce', titleVi: 'Phát âm chuẩn xác', titleEn: 'Accurate Pronunciation', delta: 2, emoji: '🗣️', type: 'positive', color: 'indigo' },
  { id: 'p_helping', titleVi: 'Giúp đỡ bạn bè', titleEn: 'Helping Others', delta: 1, emoji: '🤝', type: 'positive', color: 'pink' },
  { id: 'p_teamwork', titleVi: 'Tinh thần đồng đội', titleEn: 'Team Spirit', delta: 2, emoji: '⭐', type: 'positive', color: 'amber' },
  { id: 'p_creative', titleVi: 'Sáng tạo trong học tập', titleEn: 'Creative Thinking', delta: 2, emoji: '💡', type: 'positive', color: 'violet' },
  { id: 'p_polite', titleVi: 'Lễ phép & ngăn nắp', titleEn: 'Polite & Organized', delta: 1, emoji: '🌸', type: 'positive', color: 'rose' },

  // Constructive / Needs Work
  { id: 'n_focus', titleVi: 'Cần tập trung chú ý hơn', titleEn: 'Needs Focus', delta: -1, emoji: '👀', type: 'needs_work', color: 'amber' },
  { id: 'n_prep', titleVi: 'Cần chuẩn bị bài kỹ hơn', titleEn: 'Needs Preparation', delta: -1, emoji: '📖', type: 'needs_work', color: 'orange' },
  { id: 'n_unfinish', titleVi: 'Chưa hoàn thành nhiệm vụ', titleEn: 'Unfinished Task', delta: -1, emoji: '⏳', type: 'needs_work', color: 'rose' },
  { id: 'n_distracted', titleVi: 'Làm việc riêng trong giờ', titleEn: 'Off-task behavior', delta: -1, emoji: '🤫', type: 'needs_work', color: 'red' },
];

export interface PointTransaction {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  className: string;
  teamId: TeamId;
  categoryId: string;
  categoryTitle: string;
  delta: number;
  emoji: string;
  awardedBy: string; // Teacher name
  note?: string;
}

export interface StudentDojoSummary {
  studentId: string;
  fullName: string;
  className: string;
  teamId: TeamId;
  totalPoints: number;
  positiveCount: number;
  needsWorkCount: number;
  lastAwardedAt?: string;
}
