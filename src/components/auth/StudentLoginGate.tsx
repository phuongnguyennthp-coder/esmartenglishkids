import React, { useState } from 'react';
import { Shield, Sparkles, BookOpen, KeyRound, UserCheck, HelpCircle, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StudentRecord } from '../../types/user';
import { soundManager } from '../../utils/audio';

interface StudentLoginGateProps {
  students: StudentRecord[];
  onLoginSuccess: (student: StudentRecord) => void;
  onSwitchToTeacherMode?: () => void;
}

export const StudentLoginGate: React.FC<StudentLoginGateProps> = ({
  students,
  onLoginSuccess,
  onSwitchToTeacherMode,
}) => {
  const [fullNameInput, setFullNameInput] = useState('');
  const [sttInput, setSttInput] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoRoster, setShowDemoRoster] = useState(false);

  // Normalize string for comparison
  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = normalize(fullNameInput);
    const cleanSttStr = sttInput.trim();
    const cleanSttNum = parseInt(cleanSttStr.replace(/[^0-9]/g, ''), 10);

    if (!cleanName) {
      soundManager.playBuzzer();
      setErrorMessage('Con hãy nhập Họ và tên của mình nhé! 😊');
      return;
    }

    if (!cleanSttStr) {
      soundManager.playBuzzer();
      setErrorMessage('Con hãy nhập Số thứ tự (STT) cô giáo đã cấp nhé!');
      return;
    }

    const pool =
      selectedClass !== 'all'
        ? students.filter((s) => s.className.toLowerCase() === selectedClass.toLowerCase())
        : students;

    const matched = pool.find((s) => {
      const sName = normalize(s.fullName);
      const nameMatches = sName === cleanName || sName.includes(cleanName) || cleanName.includes(sName);

      const sttMatches =
        (!isNaN(cleanSttNum) && s.stt === cleanSttNum) ||
        s.studentId.toLowerCase() === cleanSttStr.toLowerCase() ||
        s.studentId.toLowerCase().includes(cleanSttStr.toLowerCase());

      return nameMatches && sttMatches;
    });

    if (matched) {
      soundManager.playVictory();
      onLoginSuccess(matched);
    } else {
      soundManager.playBuzzer();
      setErrorMessage(
        'Tên hoặc Số thứ tự (STT) chưa trùng khớp với danh sách lớp. Con hãy kiểm tra lại hoặc hỏi cô giáo nhé!'
      );
    }
  };

  const handleQuickDemoFill = (student: StudentRecord) => {
    setFullNameInput(student.fullName);
    setSttInput(String(student.stt));
    setSelectedClass(student.className);
    setErrorMessage(null);
    soundManager.playDing();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-300 dark:border-amber-800 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
        
        {/* Decorative Top Mascot Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 text-4xl shadow-xl shadow-amber-500/30 transform hover:scale-110 transition-transform">
            🦉
          </div>
          <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-black tracking-wider uppercase">
            ★ Cổng Vào Phòng Học Riêng Tư · E-SMART ENGLISH KIDS ★
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Chào Mừng Con Đến Lớp Học! 🌟
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto">
            Để bảo vệ bài học và điểm số của con không bị bạn khác xem nhầm, con hãy nhập <strong className="text-amber-600 dark:text-amber-400">Họ tên</strong> và <strong className="text-amber-600 dark:text-amber-400">Số thứ tự (STT)</strong> cô giáo cấp nhé!
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-sm">Chưa đăng nhập được:</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Class Filter Pills */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
              1. Con học lớp nào? (Tùy chọn)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playDing();
                  setSelectedClass('all');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  selectedClass === 'all'
                    ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                Tất cả
              </button>
              {['Class 1/1', 'Class 1/2', 'Class 2/3', 'Class 2/4'].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    soundManager.playDing();
                    setSelectedClass(cls);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cls.replace('Class ', 'Lớp ')}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
              2. Họ và tên của con:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyen Minh Anh, Le Gia Han..."
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                className="w-full text-base font-bold p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👤</span>
            </div>
          </div>

          {/* STT Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                3. Số thứ tự (STT) cô giáo cấp cho con:
              </label>
              <span className="text-[11px] text-amber-600 font-bold">
                (Ví dụ: 1, 2, 3 hoặc G1-001)
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Nhập số thứ tự (ví dụ: 1, 2, 3...)"
                value={sttInput}
                onChange={(e) => setSttInput(e.target.value)}
                className="w-full text-base font-mono font-bold p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔢</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-extrabold text-base sm:text-lg shadow-lg shadow-amber-500/30 transform hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>VÀO PHÒNG HỌC CỦA CON</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Helper Collapsible: Roster for Teachers & Evaluation Testing */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowDemoRoster(!showDemoRoster)}
            className="w-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Bảng tra cứu STT học sinh (Dành cho Giáo viên &amp; Thử nghiệm nhanh)</span>
            </span>
            <span>{showDemoRoster ? '▲ Đóng' : '▼ Xem danh sách'}</span>
          </button>

          {showDemoRoster && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in text-xs">
              <p className="text-slate-500 text-[11px]">
                💡 <em>Bấm vào tên học sinh bên dưới để tự động điền Tên &amp; STT thử nghiệm:</em>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {students.slice(0, 8).map((s) => (
                  <button
                    key={s.studentId}
                    type="button"
                    onClick={() => handleQuickDemoFill(s)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono font-bold text-[10px]">
                          STT: {s.stt}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {s.fullName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {s.className} · {s.studentId}
                      </span>
                    </div>
                    <span className="text-amber-500 font-bold text-[11px]">Thử ➜</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
