import { GradeLevel, Unit } from '../types/curriculum';
import { GRADE_1_UNITS, GRADE_2_UNITS } from '../data/curriculumData';
import { CurriculumImportSession, CurriculumUnitRecord, PublicationStatus, UnitConflict } from '../types/curriculumImport';

const STORAGE_KEYS = {
  UNITS: 'esk_curriculum_units_v1',
  HISTORY: 'esk_curriculum_history_v1',
  VERSION: 'esk_curriculum_version_v1',
};

/**
 * Loads all stored custom curriculum unit records (drafts, validated, approved, published)
 */
export function loadAllStoredUnits(): CurriculumUnitRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNITS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading stored curriculum units:', e);
    return [];
  }
}

/**
 * Saves custom curriculum unit records to localStorage
 */
export function saveAllStoredUnits(units: CurriculumUnitRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
    // Bump version trigger
    const currentVer = parseInt(localStorage.getItem(STORAGE_KEYS.VERSION) || '1', 10);
    localStorage.setItem(STORAGE_KEYS.VERSION, String(currentVer + 1));
  } catch (e) {
    console.error('Error saving stored curriculum units:', e);
  }
}

/**
 * Loads import session history
 */
export function loadImportHistory(): CurriculumImportSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves import session to audit history
 */
export function saveImportSession(session: CurriculumImportSession): void {
  if (typeof window === 'undefined') return;
  const history = loadImportHistory();
  const updatedHistory = [session, ...history.filter((s) => s.id !== session.id)].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Error saving import history:', e);
  }

  // Also merge/save session units into unit storage
  const existingUnits = loadAllStoredUnits();
  const unitMap = new Map<string, CurriculumUnitRecord>();
  existingUnits.forEach((u) => unitMap.set(u.id, u));
  session.importedUnits.forEach((u) => unitMap.set(u.id, u));
  saveAllStoredUnits(Array.from(unitMap.values()));
}

/**
 * Returns the definitive active units for student learning in Grade 1 or Grade 2.
 * Combines default textbook units with teacher-approved and published custom units.
 * If a custom unit is published for Unit 1, it safely overrides Unit 1.
 * If a custom unit is published for Unit 17, it appends Unit 17.
 */
export function getActiveUnits(grade: GradeLevel): Unit[] {
  const baseUnits: Unit[] = grade === 1 ? GRADE_1_UNITS : GRADE_2_UNITS;
  const stored = loadAllStoredUnits().filter((u) => u.grade === grade && u.status === 'published');

  if (stored.length === 0) {
    return baseUnits;
  }

  // Map keyed by unitNumber
  const unitMap = new Map<number, Unit>();

  // Populate base units first
  baseUnits.forEach((u) => unitMap.set(u.unitNumber, u));

  // Override or append with published units
  stored.forEach((customUnit) => {
    unitMap.set(customUnit.unitNumber, {
      id: customUnit.id,
      unitNumber: customUnit.unitNumber,
      grade: customUnit.grade,
      title: customUnit.title,
      titleVi: customUnit.titleVi,
      theme: customUnit.theme,
      themeEmoji: customUnit.themeEmoji,
      targetLetter: customUnit.targetLetter,
      phonicsSound: customUnit.phonicsSound,
      vocabulary: customUnit.vocabulary,
      sentencePatterns: customUnit.sentencePatterns,
      phonics: customUnit.phonics,
      listeningActivities: customUnit.listeningActivities,
      speakingPrompts: customUnit.speakingPrompts,
      storyTopic: customUnit.storyTopic,
      funTime: customUnit.funTime,
    });
  });

  return Array.from(unitMap.values()).sort((a, b) => a.unitNumber - b.unitNumber);
}

/**
 * Detects conflicts between incoming units and existing published units
 */
export function detectConflicts(incomingUnits: CurriculumUnitRecord[], grade: GradeLevel): UnitConflict[] {
  const active = getActiveUnits(grade);
  const stored = loadAllStoredUnits().filter((u) => u.grade === grade);

  return incomingUnits.map((inc) => {
    const existingActive = active.find((a) => a.unitNumber === inc.unitNumber);
    const existingCustom = stored.find((s) => s.unitNumber === inc.unitNumber);

    if (existingCustom) {
      return {
        unitNumber: inc.unitNumber,
        grade,
        existingTitle: existingCustom.title,
        newTitle: inc.title,
        existingVocabCount: existingCustom.vocabulary.length,
        newVocabCount: inc.vocabulary.length,
        hasPhonicsDiff: existingCustom.targetLetter !== inc.targetLetter,
        conflictType: 'override_custom',
      };
    }

    if (existingActive) {
      return {
        unitNumber: inc.unitNumber,
        grade,
        existingTitle: existingActive.title,
        newTitle: inc.title,
        existingVocabCount: existingActive.vocabulary.length,
        newVocabCount: inc.vocabulary.length,
        hasPhonicsDiff: existingActive.targetLetter !== inc.targetLetter,
        conflictType: 'override_default',
      };
    }

    return {
      unitNumber: inc.unitNumber,
      grade,
      existingTitle: '',
      newTitle: inc.title,
      existingVocabCount: 0,
      newVocabCount: inc.vocabulary.length,
      hasPhonicsDiff: false,
      conflictType: 'none',
    };
  });
}

/**
 * Transitions a unit along the publication workflow:
 * DRAFT -> VALIDATED -> TEACHER APPROVED -> PUBLISHED
 */
export function updateUnitPublicationStatus(
  unitId: string,
  newStatus: PublicationStatus,
  teacherName: string
): CurriculumUnitRecord | null {
  const units = loadAllStoredUnits();
  const index = units.findIndex((u) => u.id === unitId);
  if (index === -1) return null;

  const current = units[index];
  const now = new Date().toISOString();

  const updated: CurriculumUnitRecord = {
    ...current,
    status: newStatus,
    updatedAt: now,
    approvedBy: newStatus === 'approved' || newStatus === 'published' ? teacherName : current.approvedBy,
    publishedAt: newStatus === 'published' ? now : current.publishedAt,
  };

  units[index] = updated;
  saveAllStoredUnits(units);
  return updated;
}

/**
 * Bulk updates publication status for multiple units
 */
export function bulkUpdateUnitStatus(
  unitIds: string[],
  newStatus: PublicationStatus,
  teacherName: string
): void {
  const units = loadAllStoredUnits();
  const idSet = new Set(unitIds);
  const now = new Date().toISOString();

  const updated = units.map((u) => {
    if (idSet.has(u.id)) {
      return {
        ...u,
        status: newStatus,
        updatedAt: now,
        approvedBy: newStatus === 'approved' || newStatus === 'published' ? teacherName : u.approvedBy,
        publishedAt: newStatus === 'published' ? now : u.publishedAt,
      };
    }
    return u;
  });

  saveAllStoredUnits(updated);
}

/**
 * Deletes a stored custom unit (reverts to default if it was overriding a default unit)
 */
export function deleteStoredUnit(unitId: string): void {
  const units = loadAllStoredUnits();
  saveAllStoredUnits(units.filter((u) => u.id !== unitId));
}

/**
 * Completely resets a grade's curriculum to the factory default Global Success units
 */
export function resetGradeCurriculumToDefault(grade: GradeLevel): void {
  const units = loadAllStoredUnits();
  saveAllStoredUnits(units.filter((u) => u.grade !== grade));
}

/**
 * Exports all custom curriculum data & import history as JSON backup string
 */
export function exportCurriculumBackup(): string {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    schoolYear: '2025-2026',
    curriculumEdition: 'Global Success English 2018 GEC',
    units: loadAllStoredUnits(),
    history: loadImportHistory(),
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Restores custom curriculum from a backup JSON string
 */
export function restoreCurriculumFromBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.units || !Array.isArray(data.units)) {
      return { success: false, message: 'Dữ liệu sao lưu không đúng định dạng E-Smart English Kids.' };
    }

    saveAllStoredUnits(data.units);
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    }

    return {
      success: true,
      message: `Đã khôi phục thành công ${data.units.length} Unit chương trình học!`,
    };
  } catch (e: any) {
    return { success: false, message: `Lỗi đọc file sao lưu: ${e.message}` };
  }
}
