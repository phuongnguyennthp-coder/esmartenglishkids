import { Unit, VocabWord, SentencePattern, PhonicsItem, ListeningActivity, UnitFunTime, GradeLevel } from './curriculum';

export type PublicationStatus = 'draft' | 'validated' | 'approved' | 'published';

export type SupportedFileType = 'xlsx' | 'xls' | 'csv' | 'tsv' | 'json' | 'docx' | 'txt' | 'pdf';

export interface ValidationIssue {
  id: string;
  level: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestion?: string;
}

export interface CurriculumUnitRecord extends Unit {
  sourceFileName: string;
  sourceFileType: SupportedFileType;
  status: PublicationStatus;
  importedAt: string;
  updatedAt: string;
  approvedBy?: string;
  publishedAt?: string;
  validationIssues: ValidationIssue[];
  isCustomOverride?: boolean; // true if this overrides an existing default unit
  originalUnitNumber?: number;
  officialSourceRef?: string; // e.g. "Global Success Grade 1 - NXB Giáo Dục Việt Nam"
}

export interface CurriculumImportSession {
  id: string;
  fileName: string;
  fileType: SupportedFileType;
  fileSize: number;
  grade: GradeLevel;
  importedAt: string;
  totalRecords: number;
  validRecords: number;
  warningsCount: number;
  errorsCount: number;
  status: PublicationStatus;
  importedUnits: CurriculumUnitRecord[];
  summary: string;
  rawTextPreview?: string;
}

export interface UnitConflict {
  unitNumber: number;
  grade: GradeLevel;
  existingTitle: string;
  newTitle: string;
  existingVocabCount: number;
  newVocabCount: number;
  hasPhonicsDiff: boolean;
  conflictType: 'override_default' | 'override_custom' | 'none';
}

export interface FieldMappingConfig {
  unitField: string;
  unitTitleField: string;
  unitTitleViField: string;
  themeField: string;
  wordField: string;
  meaningViField: string;
  phoneticField: string;
  exampleSentenceField: string;
  patternField: string;
  patternViField: string;
  phonicsLetterField: string;
  phonicsSoundField: string;
  chantLyricsField: string;
}
