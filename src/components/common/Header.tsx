import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Sparkles, KeyRound, LogOut, ShieldCheck, Lock } from 'lucide-react';
import { StudentRecord, UserRole } from '../../types/user';
import { soundManager } from '../../utils/audio';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentGrade: 1 | 2;
  onChangeGrade: () => void;
  currentStudent: StudentRecord;
  students: StudentRecord[];
  onSelectStudent: (studentId: string) => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  language: 'en' | 'vi';
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  isAuthenticatedStudent: boolean;
  onLogoutStudent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  currentGrade,
  onChangeGrade,
  currentStudent,
  students,
  onSelectStudent,
  themeMode,
  onToggleTheme,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  onOpenApiKeyModal,
  hasApiKey,
  isAuthenticatedStudent,
  onLogoutStudent,
}) => {
  const [showTeacherPinModal, setShowTeacherPinModal] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole>('teacher');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleRoleClick = (role: UserRole) => {
    // If student clicks teacher or admin, protect with PIN 1234
    if (currentRole === 'student' && (role === 'teacher' || role === 'admin')) {
      soundManager.playDing();
      setTargetRole(role);
      setPinInput('');
      setPinError(false);
      setShowTeacherPinModal(true);
      return;
    }
    soundManager.playDing();
    onSelectRole(role);
  };

  const handleVerifyTeacherPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234' || pinInput.trim() === 'admin') {
      soundManager.playVictory();
      setShowTeacherPinModal(false);
      onSelectRole(targetRole);
    } else {
      soundManager.playBuzzer();
      setPinError(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/60 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 font-display font-bold text-2xl tracking-tighter transform hover:scale-105 transition-transform cursor-pointer">
              🦉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  E-SMART <span className="text-amber-500">ENGLISH</span> KIDS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Chương trình GDPT 2018 · Global Success Lớp 1 &amp; Lớp 2
              </p>
            </div>
          </div>

          {/* Center Area: Grade Switcher & Student Identity */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playDing();
                onChangeGrade();
              }}
              title="Chuyển đổi Lộ trình Lớp 1 hoặc Lớp 2"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-bold hover:shadow-xs hover:border-amber-400 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{currentGrade === 1 ? '🌟 Khối 1' : '🚀 Khối 2'}</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 underline font-normal ml-1">
                Đổi
              </span>
            </button>

            {/* PRIVACY PROTECTION IN STUDENT MODE:
                In Student Mode, HIDE open dropdown so students cannot view each other's data!
                Show individual student badge with STT and Logout button. */}
            {currentRole === 'student' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-950 dark:text-amber-200 shadow-xs">
                <span className="px-1.5 py-0.2 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-mono text-[10px]">
                  STT: {currentStudent.stt || 1}
                </span>
                <span className="font-extrabold max-w-[130px] truncate">{currentStudent.fullName}</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-normal">
                  ({currentStudent.className})
                </span>
                <button
                  onClick={() => {
                    soundManager.playDing();
                    onLogoutStudent();
                  }}
                  title="Đổi học sinh khác để bảo vệ sự riêng tư"
                  className="ml-1 text-[11px] font-black text-rose-600 hover:text-rose-700 hover:underline cursor-pointer bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900"
                >
                  🚪 Thoát
                </button>
              </div>
            ) : (
              /* In Teacher/Parent/Admin Mode: Teacher can pick any student to evaluate */
              <div className="relative">
                <select
                  value={currentStudent.studentId}
                  onChange={(e) => {
                    soundManager.playDing();
                    onSelectStudent(e.target.value);
                  }}
                  className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      [STT {s.stt}] {s.fullName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Gamification Counters (For Student Role) */}
          {currentRole === 'student' && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-full border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <span className="text-sm">⭐</span>
                <span>{currentStudent.stars}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-950/40 rounded-full border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 text-xs font-bold">
                <span className="text-sm">🪙</span>
                <span>{currentStudent.coins}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                <span className="text-sm">⚡</span>
                <span>Lv. {currentStudent.level}</span>
              </div>
            </div>
          )}

          {/* Right Controls: Red API Key Reminder + Role Switcher + Sound + Theme */}
          <div className="flex items-center gap-2">
            
            {/* MANDATORY AI_INSTRUCTIONS: Settings (API Key) button with red text 'Lấy API key để sử dụng app' always displayed */}
            <button
              onClick={() => {
                soundManager.playDing();
                onOpenApiKeyModal();
              }}
              title="Cài đặt Settings (Gemini API Key & Model)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span className="text-[11px] font-black text-rose-600 dark:text-rose-300">
                Lấy API key để sử dụng app
              </span>
              {hasApiKey ? (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold" title="API key đã lưu và đang hoạt động">
                  ĐÃ LƯU
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {/* Role Switcher Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleRoleClick('student')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentRole === 'student'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Góc học sinh"
              >
                🎒 <span className="hidden sm:inline">Học sinh</span>
              </button>
              <button
                onClick={() => handleRoleClick('teacher')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentRole === 'teacher'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Cổng Giáo viên"
              >
                👩‍🏫 <span className="hidden sm:inline">Giáo viên</span>
              </button>
              <button
                onClick={() => handleRoleClick('parent')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentRole === 'parent'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Góc Phụ huynh"
              >
                👨‍👩‍👧 <span className="hidden sm:inline">Phụ huynh</span>
              </button>
              <button
                onClick={() => handleRoleClick('admin')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Quản trị viên & Google Sheets"
              >
                ⚙️ <span className="hidden sm:inline">Quản trị</span>
              </button>
            </div>

            {/* Language Toggle for Teacher/Parent */}
            {(currentRole === 'teacher' || currentRole === 'parent') && (
              <button
                onClick={() => {
                  soundManager.playDing();
                  onToggleLanguage();
                }}
                title={`Chuyển ngôn ngữ (Hiện tại: ${language.toUpperCase()})`}
                className="px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                🌐 {language === 'en' ? 'EN' : 'VI'}
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) soundManager.playDing();
              }}
              title={soundEnabled ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                soundManager.playDing();
                onToggleTheme();
              }}
              title={themeMode === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {themeMode === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

          </div>
        </div>
      </div>

      {/* Teacher/Admin Access Verification Modal */}
      {showTeacherPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleVerifyTeacherPin}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Xác Nhận Quyền Giáo Viên
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dành riêng cho giáo viên &amp; quản trị viên
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nhập mã PIN Giáo viên (Mặc định: 1234):
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Nhập 1234..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-lg font-mono font-bold p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              {pinError && (
                <span className="text-[11px] font-bold text-rose-600 mt-1 block">
                  Mã PIN chưa đúng! Vui lòng thử lại với mã 1234.
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTeacherPinModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Xác Nhận
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};
