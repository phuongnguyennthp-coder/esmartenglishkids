import { GradeLevel, ReflectionRecord, SpeakingAttempt } from './curriculum';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type GeminiModelId = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash';

export interface GeminiConfig {
  apiKey: string;
  selectedModel: GeminiModelId;
  fallbackModels: GeminiModelId[];
}

export interface StudentRecord {
  // Google Sheets columns:
  stt: number; // Số thứ tự trong danh sách lớp (1, 2, 3,...)
  studentId: string; // e.g. G1-001
  fullName: string; // e.g. Nguyen Minh Anh
  grade: GradeLevel; // 1 or 2
  className: string; // e.g. Class 1/1
  parentName: string; // e.g. Nguyen Van Minh
  parentEmail: string; // e.g. minh.parent@example.com
  parentPhone: string; // e.g. 0912345678
  status: 'Active' | 'Inactive' | 'Pending';
  assignedTeacher?: string; // e.g. Ms Thanh Thảo or Ms Hồng Phượng

  // Learning Progress Metrics:
  stars: number;
  coins: number;
  xp: number;
  level: number;
  completedUnits: number[]; // e.g. [1, 2]
  learningTimeMinutes: number;
  vocabLearnedCount: number;
  averageListeningScore: number;
  averageSpeakingScore: number;
  phonicsMasteryScore: number;
  digitalCitizenshipScore: number;

  // Artifacts & Logs
  badgesEarned: {
    id: string;
    title: string;
    description: string;
    earnedDate: string;
    icon: string;
  }[];
  speakingHistory: SpeakingAttempt[];
  reflections: ReflectionRecord[];
  praiseLetters: PraiseLetter[];
  certificates: Certificate[];
}

export interface PraiseLetter {
  id: string;
  date: string;
  recipient: string;
  headline: string;
  letterBody: string;
  keyHighlights: string[];
  encouragementQuote: string;
  signOff: string;
  verifiedBy: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  achievementTitle: string;
  grade: GradeLevel;
  className: string;
  issuedDate: string;
  qrVerificationUrl: string;
  leadTeacher: string;
  institution: string;
}

export interface GoogleSheetsSyncConfig {
  sheetUrl: string;
  sheetId: string;
  autoSyncIntervalMinutes: number;
  lastSyncTimestamp: string;
  syncStatus: 'synced' | 'syncing' | 'error' | 'idle';
  totalSyncedStudents: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  assignedClasses: string[];
}

export type TeacherId = 'thanh-thao' | 'hong-phuong';

export const TEACHERS: Record<string, TeacherProfile> = {
  'thanh-thao': {
    id: 't-thanh-thao',
    name: 'Ms Thanh Thảo',
    title: 'Primary English Specialist (Grade 1)',
    email: 'thanhthao.teacher@esmartkids.edu.vn',
    phone: '0901-234-567',
    assignedClasses: ['Class 1/1', 'Class 1/2'],
  },
  'hong-phuong': {
    id: 't-hong-phuong',
    name: 'Ms Hồng Phượng',
    title: 'Lead Primary English Specialist (Grade 2)',
    email: 'hongphuong.teacher@esmartkids.edu.vn',
    phone: '0912-345-678',
    assignedClasses: ['Class 2/3', 'Class 2/4'],
  },
};

export const TEACHER_LIST: TeacherProfile[] = Object.values(TEACHERS);

export function getTeacherForClass(className: string): TeacherProfile {
  if (className === 'Class 1/1' || className === 'Class 1/2') {
    return TEACHERS['thanh-thao'];
  }
  return TEACHERS['hong-phuong'];
}

