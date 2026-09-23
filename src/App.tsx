import React, { useState, useEffect } from 'react';
import { GradeLevel, SpeakingAttempt, ReflectionRecord } from './types/curriculum';
import { StudentRecord, UserRole, PraiseLetter, Certificate, GoogleSheetsSyncConfig, GeminiModelId } from './types/user';
import {
  loadStudents,
  saveStudents,
  loadCurrentStudentId,
  saveCurrentStudentId,
  loadCurrentRole,
  saveCurrentRole,
  loadCurrentGrade,
  saveCurrentGrade,
  loadThemeMode,
  saveThemeMode,
  loadLanguage,
  saveLanguage,
  loadSheetConfig,
  saveSheetConfig,
  addRewardsToStudent,
  markUnitCompleted,
  addSpeakingAttempt,
  addStudentReflection,
  addPraiseLetter,
  addCertificate,
  awardBadge,
  loadAuthStudentId,
  saveAuthStudentId,
  logoutStudent,
  loadUserApiKey,
  saveUserApiKey,
  loadSelectedModel,
  saveSelectedModel,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { Header } from './components/common/Header';
import { GradeSelector } from './components/common/GradeSelector';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { StudentLoginGate } from './components/auth/StudentLoginGate';
import { ApiKeyModal } from './components/common/ApiKeyModal';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>(() => loadStudents());
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => loadCurrentStudentId());
  const [authStudentId, setAuthStudentId] = useState<string | null>(() => loadAuthStudentId());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadCurrentRole());
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(() => loadCurrentGrade());
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => loadThemeMode());
  const [language, setLanguage] = useState<'en' | 'vi'>(() => loadLanguage());
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetsSyncConfig>(() => loadSheetConfig());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(() => !loadUserApiKey());
  const [userApiKey, setUserApiKey] = useState<string>(() => loadUserApiKey());
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>(() => loadSelectedModel());

  // Sync theme to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveThemeMode(themeMode);
  }, [themeMode]);

  // Sync sound manager
  useEffect(() => {
    soundManager.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  const currentStudent =
    (currentRole === 'student' && authStudentId
      ? students.find((s) => s.studentId === authStudentId)
      : null) ||
    students.find((s) => s.studentId === currentStudentId) ||
    students.find((s) => s.grade === currentGrade) ||
    students[0];

  // Grade selection handler
  const handleSelectGrade = (grade: GradeLevel) => {
    setCurrentGrade(grade);
    saveCurrentGrade(grade);

    // Auto-select a student matching the newly selected grade if current student belongs to other grade
    if (currentStudent.grade !== grade) {
      const match = students.find((s) => s.grade === grade);
      if (match) {
        setCurrentStudentId(match.studentId);
        saveCurrentStudentId(match.studentId);
      }
    }

    setShowGradeModal(false);
  };

  // Role selection
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    saveCurrentRole(role);
  };

  // Student selection
  const handleSelectStudent = (id: string) => {
    setCurrentStudentId(id);
    saveCurrentStudentId(id);
    const selected = students.find((s) => s.studentId === id);
    if (selected && selected.grade !== currentGrade) {
      setCurrentGrade(selected.grade);
      saveCurrentGrade(selected.grade);
    }
  };

  // Student mutations
  const handleReward = (stars: number, coins: number, xp: number) => {
    const updated = addRewardsToStudent(currentStudent.studentId, stars, coins, xp);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleCompleteUnit = (unitNumber: number) => {
    const updated = markUnitCompleted(currentStudent.studentId, unitNumber);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleRecordAttempt = (attempt: SpeakingAttempt) => {
    const updated = addSpeakingAttempt(currentStudent.studentId, attempt);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleSaveReflection = (reflection: ReflectionRecord) => {
    const updated = addStudentReflection(currentStudent.studentId, reflection);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleGeneratePraiseLetter = (studentId: string, letter: PraiseLetter) => {
    const updated = addPraiseLetter(studentId, letter);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleGenerateCertificate = (studentId: string, cert: Certificate) => {
    const updated = addCertificate(studentId, cert);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleUnlockBadge = (badge: { id: string; title: string; description: string; icon: string }) => {
    const updated = awardBadge(currentStudent.studentId, badge);
    if (updated) {
      setStudents(loadStudents());
    }
  };

  const handleUpdateSheetConfig = (config: GoogleSheetsSyncConfig) => {
    setSheetConfig(config);
    saveSheetConfig(config);
  };

  const handleUpdateStudents = (newStudents: StudentRecord[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Header Navigation */}
      <Header
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        currentGrade={currentGrade}
        onChangeGrade={() => setShowGradeModal(true)}
        currentStudent={currentStudent}
        students={students}
        onSelectStudent={handleSelectStudent}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        language={language}
        onToggleLanguage={() => {
          const next = language === 'en' ? 'vi' : 'en';
          setLanguage(next);
          saveLanguage(next);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        hasApiKey={Boolean(userApiKey && userApiKey.trim().length > 0)}
        isAuthenticatedStudent={Boolean(authStudentId)}
        onLogoutStudent={() => {
          logoutStudent();
          setAuthStudentId(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'student' && (
          !authStudentId ? (
            <StudentLoginGate
              students={students}
              onLoginSuccess={(loggedStudent) => {
                setAuthStudentId(loggedStudent.studentId);
                saveAuthStudentId(loggedStudent.studentId);
                setCurrentStudentId(loggedStudent.studentId);
                saveCurrentStudentId(loggedStudent.studentId);
                setCurrentGrade(loggedStudent.grade);
                saveCurrentGrade(loggedStudent.grade);
              }}
              onSwitchToTeacherMode={() => {
                handleSelectRole('teacher');
              }}
            />
          ) : (
            <StudentDashboard
              currentGrade={currentGrade}
              student={currentStudent}
              onReward={handleReward}
              onCompleteUnit={handleCompleteUnit}
              onRecordAttempt={handleRecordAttempt}
              onSaveReflection={handleSaveReflection}
              onGeneratePraiseLetter={(letter) => handleGeneratePraiseLetter(currentStudent.studentId, letter)}
              onGenerateCertificate={(cert) => handleGenerateCertificate(currentStudent.studentId, cert)}
              onUnlockBadge={handleUnlockBadge}
            />
          )
        )}

        {currentRole === 'teacher' && (
          <TeacherDashboard
            students={students}
            language={language}
            onSelectStudent={handleSelectStudent}
            onGeneratePraiseLetter={handleGeneratePraiseLetter}
            onIssueCertificate={handleGenerateCertificate}
          />
        )}

        {currentRole === 'parent' && (
          <ParentDashboard
            student={currentStudent}
            language={language}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard
            students={students}
            sheetConfig={sheetConfig}
            onUpdateSheetConfig={handleUpdateSheetConfig}
            onUpdateStudents={handleUpdateStudents}
          />
        )}
      </main>

      {/* Grade Selector Modal */}
      {showGradeModal && (
        <GradeSelector
          currentGrade={currentGrade}
          onSelectGrade={handleSelectGrade}
          onClose={() => setShowGradeModal(false)}
        />
      )}

      {/* Footer with Educational Accreditation & Competition Notes */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-8 transition-colors no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="text-xl">🦉</span>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                E-Smart English Kids · 2018 General Education Curriculum Innovation
              </p>
              <p className="text-[11px] text-slate-500">
                Aligned with Global Success Grade 1 &amp; Grade 2 · AI-Assisted Communicative Competence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold text-[11px]">
              ★ Educational Innovation Competition Edition
            </span>
          </div>
        </div>
      </footer>

      {/* Gemini API Key Configuration Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          apiKey={userApiKey}
          selectedModel={selectedModel}
          onSave={(key, model) => {
            setUserApiKey(key);
            saveUserApiKey(key);
            setSelectedModel(model);
            saveSelectedModel(model);
            setShowApiKeyModal(false);
          }}
          onClose={() => setShowApiKeyModal(false)}
        />
      )}

    </div>
  );
}
