import { INITIAL_STUDENTS } from '../data/initialStudents';
import { GradeLevel, ReflectionRecord, SpeakingAttempt } from '../types/curriculum';
import { Certificate, GoogleSheetsSyncConfig, PraiseLetter, StudentRecord, UserRole, GeminiModelId } from '../types/user';

const STORAGE_KEYS = {
  STUDENTS: 'esk_students_v3',
  CURRENT_STUDENT_ID: 'esk_current_student_id_v3',
  AUTH_STUDENT_ID: 'esk_authenticated_student_id_v3',
  CURRENT_ROLE: 'esk_current_role_v1',
  CURRENT_GRADE: 'esk_current_grade_v1',
  THEME_MODE: 'esk_theme_mode_v1',
  LANGUAGE: 'esk_ui_language_v1',
  SHEET_CONFIG: 'esk_sheet_config_v3',
  USER_API_KEY: 'esk_user_gemini_api_key_v1',
  SELECTED_MODEL: 'esk_selected_gemini_model_v1',
};

export const DEFAULT_SHEET_CONFIG: GoogleSheetsSyncConfig = {
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1E-SMART-ENGLISH-KIDS-2018GEC/export?format=csv',
  sheetId: '1E-SMART-ENGLISH-KIDS-2018GEC',
  autoSyncIntervalMinutes: 5,
  lastSyncTimestamp: new Date().toISOString(),
  syncStatus: 'synced',
  totalSyncedStudents: INITIAL_STUDENTS.length,
};

export function loadUserApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.USER_API_KEY) || '';
}

export function saveUserApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_API_KEY, key.trim());
}

export function loadSelectedModel(): GeminiModelId {
  if (typeof window === 'undefined') return 'gemini-3-flash-preview';
  const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) as GeminiModelId;
  if (saved === 'gemini-3-flash-preview' || saved === 'gemini-3-pro-preview' || saved === 'gemini-2.5-flash') {
    return saved;
  }
  return 'gemini-3-flash-preview';
}

export function saveSelectedModel(model: GeminiModelId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
}

export function loadAuthStudentId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEYS.AUTH_STUDENT_ID) || localStorage.getItem(STORAGE_KEYS.AUTH_STUDENT_ID);
}

export function saveAuthStudentId(studentId: string | null): void {
  if (typeof window === 'undefined') return;
  if (studentId) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_STUDENT_ID, studentId);
    localStorage.setItem(STORAGE_KEYS.AUTH_STUDENT_ID, studentId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, studentId);
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STUDENT_ID);
  }
}

export function logoutStudent(): void {
  saveAuthStudentId(null);
}

/**
 * Normalizes text to lowercase without diacritics / accents
 */
export function normalizeName(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Authenticates a student by their Name and assigned Roll Number (STT) or Student ID
 */
export function authenticateStudent(
  nameInput: string,
  sttInput: string | number,
  classFilter?: string
): { success: boolean; student?: StudentRecord; message?: string } {
  const students = loadStudents();
  const cleanName = normalizeName(nameInput || '');
  const cleanSttStr = String(sttInput || '').trim();
  const cleanSttNum = parseInt(cleanSttStr.replace(/[^0-9]/g, ''), 10);

  if (!cleanName) {
    return { success: false, message: 'Vui lòng nhập Họ và tên của con!' };
  }
  if (!cleanSttStr) {
    return { success: false, message: 'Vui lòng nhập Số thứ tự (STT) được cô giáo cấp!' };
  }

  // Filter by class if selected
  const candidatePool = classFilter && classFilter !== 'all'
    ? students.filter((s) => s.className.toLowerCase() === classFilter.toLowerCase())
    : students;

  const found = candidatePool.find((s) => {
    const sName = normalizeName(s.fullName);
    const nameMatches = sName === cleanName || sName.includes(cleanName) || cleanName.includes(sName);

    // Match by numerical STT or exact studentId
    const sttMatches =
      (!isNaN(cleanSttNum) && s.stt === cleanSttNum) ||
      s.studentId.toLowerCase() === cleanSttStr.toLowerCase() ||
      s.studentId.toLowerCase().includes(cleanSttStr.toLowerCase());

    return nameMatches && sttMatches;
  });

  if (found) {
    saveAuthStudentId(found.studentId);
    saveCurrentStudentId(found.studentId);
    return { success: true, student: found };
  }

  return {
    success: false,
    message: 'Tên hoặc Số thứ tự (STT) chưa trùng khớp với danh sách của cô giáo. Con hãy kiểm tra lại nhé!',
  };
}

export function loadStudents(): StudentRecord[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      saveStudents(INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: StudentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students:', e);
  }
}

export function loadCurrentStudentId(): string {
  if (typeof window === 'undefined') return 'G1-001';
  return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_ID) || 'G1-001';
}

export function saveCurrentStudentId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, id);
}

export function loadCurrentRole(): UserRole {
  if (typeof window === 'undefined') return 'student';
  return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as UserRole) || 'student';
}

export function saveCurrentRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
}

export function loadCurrentGrade(): GradeLevel {
  if (typeof window === 'undefined') return 1;
  const val = localStorage.getItem(STORAGE_KEYS.CURRENT_GRADE);
  return val === '2' ? 2 : 1;
}

export function saveCurrentGrade(grade: GradeLevel): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_GRADE, grade.toString());
}

export function loadThemeMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(STORAGE_KEYS.THEME_MODE) as 'light' | 'dark') || 'light';
}

export function saveThemeMode(mode: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
}

export function loadLanguage(): 'en' | 'vi' {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'en' | 'vi') || 'en';
}

export function saveLanguage(lang: 'en' | 'vi'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function loadSheetConfig(): GoogleSheetsSyncConfig {
  if (typeof window === 'undefined') return DEFAULT_SHEET_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHEET_CONFIG);
    if (!raw) return DEFAULT_SHEET_CONFIG;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SHEET_CONFIG;
  }
}

export function saveSheetConfig(config: GoogleSheetsSyncConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SHEET_CONFIG, JSON.stringify(config));
}

// Student mutation helpers
export function addRewardsToStudent(studentId: string, stars: number, coins: number, xp: number): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  const newXp = current.xp + xp;
  const newLevel = Math.floor(newXp / 250) + 1;

  const updated: StudentRecord = {
    ...current,
    stars: current.stars + stars,
    coins: current.coins + coins,
    xp: newXp,
    level: newLevel,
    learningTimeMinutes: current.learningTimeMinutes + 5,
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

export function markUnitCompleted(studentId: string, unitNumber: number): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  const completed = new Set(current.completedUnits);
  completed.add(unitNumber);

  const updated: StudentRecord = {
    ...current,
    completedUnits: Array.from(completed).sort((a, b) => a - b),
    vocabLearnedCount: current.vocabLearnedCount + 4,
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

export function addSpeakingAttempt(studentId: string, attempt: SpeakingAttempt): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  const history = [attempt, ...(current.speakingHistory || [])];

  // Recalculate average speaking score
  const totalScore = history.reduce((sum, a) => sum + a.pronunciationScore, 0);
  const avgSpeaking = Math.round(totalScore / history.length);

  const updated: StudentRecord = {
    ...current,
    speakingHistory: history,
    averageSpeakingScore: avgSpeaking,
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

export function addStudentReflection(studentId: string, reflection: ReflectionRecord): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  const reflections = [reflection, ...(current.reflections || [])];

  const updated: StudentRecord = {
    ...current,
    reflections,
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

export function addPraiseLetter(studentId: string, letter: PraiseLetter): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  const updated: StudentRecord = {
    ...current,
    praiseLetters: [letter, ...(current.praiseLetters || [])],
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

export function addCertificate(studentId: string, cert: Certificate): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  const updated: StudentRecord = {
    ...current,
    certificates: [cert, ...(current.certificates || [])],
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

export function awardBadge(studentId: string, badge: { id: string; title: string; description: string; icon: string }): StudentRecord | null {
  const students = loadStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return null;

  const current = students[index];
  if (current.badgesEarned.some((b) => b.id === badge.id)) return current;

  const newBadge = {
    ...badge,
    earnedDate: new Date().toISOString().split('T')[0],
  };

  const updated: StudentRecord = {
    ...current,
    badgesEarned: [...current.badgesEarned, newBadge],
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}
