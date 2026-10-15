import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  UserPlus,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  Lock,
  User,
  School,
  KeyRound,
} from 'lucide-react';
import { StudentRecord } from '../../types/user';
import { soundManager } from '../../utils/audio';
import { authenticateStudent } from '../../utils/storage';
import { DictionaryModal } from '../common/DictionaryModal';

const normalizeName = (str: string): string =>
  (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

interface StudentLoginGateProps {
  students: StudentRecord[];
  onLoginSuccess: (student: StudentRecord) => void;
  onSwitchToTeacherMode?: () => void;
  onRegisterStudent?: (student: StudentRecord) => void;
}

export const StudentLoginGate: React.FC<StudentLoginGateProps> = ({
  students,
  onLoginSuccess,
  onSwitchToTeacherMode,
  onRegisterStudent,
}) => {
  // Tabs: 'student' | 'register' | 'teacher'
  const [activeTab, setActiveTab] = useState<'student' | 'register' | 'teacher'>('student');

  // Student Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [studentPassword, setStudentPassword] = useState('123');
  const [showStudentPass, setShowStudentPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Student Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regClass, setRegClass] = useState('Class 1/1');
  const [regSchool, setRegSchool] = useState('Tiểu học Lê Văn Tám');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('123');
  const [regConfirmPassword, setRegConfirmPassword] = useState('123');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Teacher Login Form State
  const [teacherUser, setTeacherUser] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [showTeacherPass, setShowTeacherPass] = useState(false);
  const [teacherError, setTeacherError] = useState<string | null>(null);

  // Dictionary Modal State
  const [showDictionary, setShowDictionary] = useState(false);

  // Available classes
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.className && s.className !== 'x' && !s.className.toLowerCase().includes('(x)')) {
        set.add(s.className);
      }
    });
    const arr = Array.from(set);
    return arr.length > 0 ? arr.sort() : ['Class 1/1', 'Class 1/2', 'Class 2/3', 'Class 2/4'];
  }, [students]);

  // Demo Students for 1-Click Quick Testing
  const demoAccounts = useMemo(() => {
    const list = [
      { name: 'Nguyễn Bùi Khả Vy', class: 'Class 1/1', stt: 1, avatar: '👧', username: 'khavy' },
      { name: 'Đỗ Minh Khang', class: 'Class 1/2', stt: 48, avatar: '👨‍🎓', username: 'minhkhang' },
      { name: 'Vũ Thùy Linh', class: 'Class 1/2', stt: 37, avatar: '👩‍🎓', username: 'thaolinh' },
      { name: 'Bùi Quốc Bảo', class: 'Class 2/4', stt: 106, avatar: '👦', username: 'quocbao' },
    ];
    return list;
  }, []);

  // Handle Student Login
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = loginIdentifier.trim();
    if (!cleanInput) {
      soundManager.playBuzzer();
      setLoginError('Con hãy nhập Tên đăng nhập hoặc Họ và tên của mình nhé!');
      return;
    }

    // Attempt 1: Authenticate by STT or Name
    const result = authenticateStudent(cleanInput, cleanInput);
    if (result.success && result.student) {
      soundManager.playVictory();
      onLoginSuccess(result.student);
      return;
    }

    // Attempt 2: Check matching username or name keywords
    const norm = normalizeName(cleanInput);
    const matched = students.find((s) => {
      const sNorm = normalizeName(s.fullName);
      const usernameCandidate = normalizeName(s.fullName.replace(/\s+/g, ''));
      return (
        sNorm.includes(norm) ||
        norm.includes(sNorm) ||
        usernameCandidate.includes(norm) ||
        norm.includes(usernameCandidate)
      );
    });

    if (matched) {
      soundManager.playVictory();
      onLoginSuccess(matched);
      return;
    }

    soundManager.playBuzzer();
    setLoginError('Tên đăng nhập hoặc Họ và tên chưa tìm thấy trong danh sách. Con hãy kiểm tra lại nhé!');
  };

  // Quick 1-Click Demo Fill & Login
  const handleQuickDemoClick = (account: (typeof demoAccounts)[0]) => {
    soundManager.playDing();
    setLoginIdentifier(account.name);
    setStudentPassword('123');

    const found = students.find((s) => s.stt === account.stt || s.fullName === account.name);
    if (found) {
      soundManager.playVictory();
      onLoginSuccess(found);
    }
  };

  // Handle Student Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regFullName.trim()) {
      soundManager.playBuzzer();
      setRegError('Vui lòng nhập Họ và tên của học sinh!');
      return;
    }
    if (!regUsername.trim()) {
      soundManager.playBuzzer();
      setRegError('Vui lòng nhập Tên đăng nhập (viết liền không dấu)!');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      soundManager.playBuzzer();
      setRegError('Mật khẩu và Nhập lại mật khẩu không trùng khớp!');
      return;
    }

    const grade: 1 | 2 = regClass.includes('2/') ? 2 : 1;
    const newStt = students.length + 1;
    const newStudentId = `G${grade}-${String(newStt).padStart(3, '0')}`;

    const createdStudent: StudentRecord = {
      stt: newStt,
      studentId: newStudentId,
      fullName: regFullName.trim(),
      grade,
      className: regClass,
      parentName: `Phụ huynh em ${regFullName.trim()}`,
      parentEmail: `${regUsername.trim()}@esmart.edu.vn`,
      parentPhone: '0900000000',
      status: 'Active',
      assignedTeacher: grade === 1 ? 'Ms Thanh Thảo' : 'Ms Hồng Phượng',
      stars: 30,
      coins: 60,
      xp: 120,
      level: 1,
      completedUnits: [1],
      learningTimeMinutes: 30,
      vocabLearnedCount: 4,
      averageListeningScore: 85,
      averageSpeakingScore: 85,
      phonicsMasteryScore: 85,
      digitalCitizenshipScore: 95,
      badgesEarned: [],
      speakingHistory: [],
      reflections: [],
      praiseLetters: [],
      certificates: [],
    };

    if (onRegisterStudent) {
      onRegisterStudent(createdStudent);
    }

    soundManager.playVictory();
    setRegSuccess(`Đăng ký thành công tài khoản cho em ${regFullName}! Đang vào phòng học...`);
    setTimeout(() => {
      onLoginSuccess(createdStudent);
    }, 1200);
  };

  // Handle Teacher Login
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError(null);

    const cleanPass = teacherPass.trim();
    if (cleanPass === '1234' || cleanPass === 'admin') {
      soundManager.playVictory();
      if (onSwitchToTeacherMode) {
        onSwitchToTeacherMode();
      }
    } else {
      soundManager.playBuzzer();
      setTeacherError('Mật khẩu quản trị chưa chính xác. (Mặc định: 1234)');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 animate-fade-in relative">
      
      {/* Top Floating Dictionary Button */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => {
            soundManager.playDing();
            setShowDictionary(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 shadow-md hover:shadow-lg text-amber-900 dark:text-amber-200 text-xs font-black hover:border-amber-400 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>📖 Tra Cứu Từ Điển</span>
        </button>
      </div>

      {/* Main Glass Card */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border-2 border-amber-200 dark:border-amber-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-3xl shadow-xl shadow-amber-500/25 transform hover:scale-105 transition-transform cursor-pointer">
            🦉
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            VUI HỌC TIẾNG ANH CÙNG <span className="text-amber-500">E-SMART KIDS!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5">
            <span>🌸</span>
            <span>Hệ thống học Tiếng Anh Lớp 1 &amp; Lớp 2 Global Success</span>
          </p>
        </div>

        {/* 3 Main Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              soundManager.playDing();
              setActiveTab('student');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>HỌC SINH</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playDing();
              setActiveTab('register');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ĐĂNG KÝ MỚI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playDing();
              setActiveTab('teacher');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GIÁO VIÊN</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: STUDENT LOGIN */}
        {/* ============================================================== */}
        {activeTab === 'student' && (
          <div className="space-y-5 animate-fade-in">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">{loginError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {/* Username or Name Input */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  TÊN ĐĂNG NHẬP HOẶC HỌ VÀ TÊN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Ví dụ: minhkhang, Nguyễn Gia Huy, Thục Phương..."
                    className="w-full text-sm font-bold p-3.5 pl-11 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  💡 Em có thể nhập Tên đăng nhập hoặc Họ và tên (có dấu hoặc không dấu đều được).
                </p>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  MẬT KHẨU
                </label>
                <div className="relative">
                  <input
                    type={showStudentPass ? 'text' : 'password'}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Mật khẩu mặc định là 123..."
                    className="w-full text-sm font-bold p-3.5 pl-11 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowStudentPass(!showStudentPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showStudentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-base shadow-lg shadow-amber-500/30 transform hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>➜| VÀO HỌC NGAY ➜</span>
              </button>
            </form>

            {/* Quick Demo Test Accounts */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>✨</span>
                <span>Tài khoản học sinh mẫu (thử nghiệm nhanh):</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.name}
                    type="button"
                    onClick={() => handleQuickDemoClick(acc)}
                    className="p-2.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-amber-400 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                        {acc.avatar}
                      </span>
                      <div>
                        <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-amber-600">
                          {acc.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {acc.class} · pass: 123
                        </p>
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ⚡
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: REGISTER NEW STUDENT */}
        {/* ============================================================== */}
        {activeTab === 'register' && (
          <div className="space-y-4 animate-fade-in">
            {regError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{regSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  HỌ VÀ TÊN HỌC SINH *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => {
                    setRegFullName(e.target.value);
                    if (!regUsername) {
                      setRegUsername(normalizeName(e.target.value).replace(/\s+/g, ''));
                    }
                  }}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full text-xs font-bold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Class & School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    LỚP *
                  </label>
                  <select
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  >
                    {availableClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls.replace('Class ', 'Lớp ')} ({cls.includes('1/') ? 'Khối 1' : 'Khối 2'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    TRƯỜNG *
                  </label>
                  <input
                    type="text"
                    required
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Tiểu học Lê Văn Tám"
                    className="w-full text-xs font-bold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  TÊN ĐĂNG NHẬP *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="Viết liền không dấu (ví dụ: nguyenan42)"
                  className="w-full text-xs font-mono font-bold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    MẬT KHẨU *
                  </label>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mật khẩu..."
                    className="w-full text-xs font-bold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    NHẬP LẠI MẬT KHẨU *
                  </label>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Nhập lại..."
                    className="w-full text-xs font-bold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-sm shadow-lg shadow-amber-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>TẠO TÀI KHOẢN HỌC SINH</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
              >
                Đã có tài khoản? Đăng nhập tại đây
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TEACHER / ADMIN LOGIN */}
        {/* ============================================================== */}
        {activeTab === 'teacher' && (
          <div className="space-y-4 animate-fade-in">
            {teacherError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{teacherError}</span>
              </div>
            )}

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  TÊN ĐĂNG NHẬP GIÁO VIÊN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={teacherUser}
                    onChange={(e) => setTeacherUser(e.target.value)}
                    placeholder="Nhập tên đăng nhập giáo viên (thanhthao, hongphuong, admin)..."
                    className="w-full text-xs font-bold p-3.5 pl-11 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  />
                  <ShieldCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  MẬT KHẨU QUẢN TRỊ
                </label>
                <div className="relative">
                  <input
                    type={showTeacherPass ? 'text' : 'password'}
                    required
                    value={teacherPass}
                    onChange={(e) => setTeacherPass(e.target.value)}
                    placeholder="Nhập mật khẩu quản trị (1234)..."
                    className="w-full text-xs font-bold p-3.5 pl-11 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  />
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowTeacherPass(!showTeacherPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showTeacherPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-display font-black text-sm shadow-lg shadow-amber-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ĐĂNG NHẬP GIÁO VIÊN</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className="text-xs font-bold text-slate-500 hover:text-amber-600 cursor-pointer"
              >
                ← Quay lại Cổng đăng nhập Học sinh
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Dictionary Modal */}
      {showDictionary && (
        <DictionaryModal
          isOpen={showDictionary}
          onClose={() => setShowDictionary(false)}
        />
      )}

    </div>
  );
};
