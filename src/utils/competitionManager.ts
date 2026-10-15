import { DojoCategory, PointTransaction, StudentDojoSummary, TeamId, TEAMS } from '../types/competition';
import { StudentRecord } from '../types/user';
import { loadStudents, saveStudents } from './storage';

const TRANSACTIONS_KEY = 'esmart_dojo_transactions_v1';
const STUDENT_TEAMS_KEY = 'esmart_student_teams_v1';

// Default team assignment based on STT or ID modulo
export function getDefaultTeamForStudent(student: StudentRecord): TeamId {
  const customMap = getCustomStudentTeams();
  if (customMap[student.studentId]) {
    return customMap[student.studentId];
  }
  const index = (student.stt || 1) % 4;
  if (index === 0) return 'lions';
  if (index === 1) return 'dolphins';
  if (index === 2) return 'eagles';
  return 'pandas';
}

export function getCustomStudentTeams(): Record<string, TeamId> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STUDENT_TEAMS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setStudentTeam(studentId: string, teamId: TeamId): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getCustomStudentTeams();
    map[studentId] = teamId;
    localStorage.setItem(STUDENT_TEAMS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to set student team:', e);
  }
}

export function loadTransactions(): PointTransaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(txs: PointTransaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
}

/**
 * Award points to a single student
 */
export function awardDojoPoint(
  student: StudentRecord,
  category: DojoCategory,
  awardedBy: string,
  note?: string
): PointTransaction {
  const teamId = getDefaultTeamForStudent(student);
  const tx: PointTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    studentId: student.studentId,
    studentName: student.fullName,
    className: student.className,
    teamId,
    categoryId: category.id,
    categoryTitle: category.titleVi,
    delta: category.delta,
    emoji: category.emoji,
    awardedBy,
    note,
  };

  const all = loadTransactions();
  all.unshift(tx);
  saveTransactions(all);

  // Sync with student stars/coins if positive
  try {
    const students = loadStudents();
    const targetIdx = students.findIndex((s) => s.studentId === student.studentId);
    if (targetIdx !== -1) {
      if (category.delta > 0) {
        students[targetIdx].stars = (students[targetIdx].stars || 0) + category.delta;
        students[targetIdx].coins = (students[targetIdx].coins || 0) + (category.delta * 2);
        students[targetIdx].xp = (students[targetIdx].xp || 0) + (category.delta * 10);
      }
      saveStudents(students);
    }
  } catch (err) {
    console.warn('Could not sync student storage:', err);
  }

  return tx;
}

/**
 * Award points to an entire Team in a class
 */
export function awardTeamPoints(
  studentsInTeam: StudentRecord[],
  category: DojoCategory,
  awardedBy: string
): PointTransaction[] {
  return studentsInTeam.map((s) => awardDojoPoint(s, category, awardedBy, `Điểm thi đua nhóm ${TEAMS[getDefaultTeamForStudent(s)].nameVi}`));
}

/**
 * Award points to an entire Class
 */
export function awardClassPoints(
  studentsInClass: StudentRecord[],
  category: DojoCategory,
  awardedBy: string
): PointTransaction[] {
  return studentsInClass.map((s) => awardDojoPoint(s, category, awardedBy, `Điểm khen ngợi tập thể ${s.className}`));
}

/**
 * Calculate summary of all students with dojo points
 */
export function getStudentSummaries(students: StudentRecord[]): StudentDojoSummary[] {
  const txs = loadTransactions();

  // Aggregate points by studentId
  const pointMap: Record<string, { total: number; positive: number; needsWork: number; lastTime?: string }> = {};

  txs.forEach((tx) => {
    if (!pointMap[tx.studentId]) {
      pointMap[tx.studentId] = { total: 0, positive: 0, needsWork: 0 };
    }
    pointMap[tx.studentId].total += tx.delta;
    if (tx.delta > 0) {
      pointMap[tx.studentId].positive += 1;
    } else {
      pointMap[tx.studentId].needsWork += 1;
    }
    if (!pointMap[tx.studentId].lastTime) {
      pointMap[tx.studentId].lastTime = tx.timestamp;
    }
  });

  return students.map((s) => {
    const agg = pointMap[s.studentId] || { total: 0, positive: 0, needsWork: 0 };
    return {
      studentId: s.studentId,
      fullName: s.fullName,
      className: s.className,
      teamId: getDefaultTeamForStudent(s),
      totalPoints: agg.total,
      positiveCount: agg.positive,
      needsWorkCount: agg.needsWork,
      lastAwardedAt: agg.lastTime,
    };
  });
}

/**
 * Team Standings calculation
 */
export interface TeamStanding {
  teamId: TeamId;
  nameVi: string;
  nameEn: string;
  emoji: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  totalPoints: number;
  studentCount: number;
  averagePoints: number;
}

export function getTeamStandings(students: StudentRecord[]): TeamStanding[] {
  const summaries = getStudentSummaries(students);
  const teamMap: Record<TeamId, { total: number; count: number }> = {
    lions: { total: 0, count: 0 },
    dolphins: { total: 0, count: 0 },
    eagles: { total: 0, count: 0 },
    pandas: { total: 0, count: 0 },
  };

  summaries.forEach((s) => {
    teamMap[s.teamId].total += s.totalPoints;
    teamMap[s.teamId].count += 1;
  });

  const list: TeamStanding[] = (Object.keys(TEAMS) as TeamId[]).map((tid) => {
    const info = TEAMS[tid];
    const data = teamMap[tid];
    const avg = data.count > 0 ? Math.round((data.total / data.count) * 10) / 10 : 0;
    return {
      teamId: tid,
      nameVi: info.nameVi,
      nameEn: info.nameEn,
      emoji: info.emoji,
      colorBg: info.colorBg,
      colorBorder: info.colorBorder,
      colorText: info.colorText,
      totalPoints: data.total,
      studentCount: data.count,
      averagePoints: avg,
    };
  });

  return list.sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * Clear point transactions (Teacher reset)
 */
export function resetCompetitionPoints(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRANSACTIONS_KEY);
}
