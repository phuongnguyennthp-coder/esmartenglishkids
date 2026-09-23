import React, { useState } from 'react';
import {
  Search,
  Download,
  Award,
  Sparkles,
  Filter,
  CheckCircle2,
  User,
  ChevronRight,
  Eye,
  RefreshCw,
  BarChart2,
  Shield,
  Volume2,
  Copy,
  Check,
  FileText,
  Printer,
} from 'lucide-react';
import { StudentRecord, PraiseLetter, Certificate, TEACHERS, getTeacherForClass } from '../../types/user';
import { soundManager, speakText } from '../../utils/audio';
import { exportStudentsToCSV, downloadCSV } from '../../utils/googleSheets';
import { GRADE_1_UNITS, GRADE_2_UNITS, GRADE_1_FUN_TIMES, GRADE_2_FUN_TIMES } from '../../data/curriculumData';
import { generatePraiseLetterAI } from '../../services/geminiService';

interface TeacherDashboardProps {
  students: StudentRecord[];
  language: 'en' | 'vi';
  onSelectStudent: (studentId: string) => void;
  onGeneratePraiseLetter: (studentId: string, letter: PraiseLetter) => void;
  onIssueCertificate: (studentId: string, cert: Certificate) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  language,
  onSelectStudent,
  onGeneratePraiseLetter,
  onIssueCertificate,
}) => {
  const isVi = language === 'vi';

  const [selectedTeacherId, setSelectedTeacherId] = useState<'all' | 'thanh-thao' | 'hong-phuong'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '1' | '2'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectStudent, setInspectStudent] = useState<StudentRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [praiseError, setPraiseError] = useState<string | null>(null);
  const [showWorksheetModal, setShowWorksheetModal] = useState<boolean>(false);
  const [worksheetGrade, setWorksheetGrade] = useState<1 | 2>(1);
  const [worksheetMilestoneIdx, setWorksheetMilestoneIdx] = useState<number>(0);

  // Determine active teacher object if single teacher selected
  const activeTeacher = selectedTeacherId !== 'all' ? TEACHERS[selectedTeacherId] : null;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeacher =
      selectedTeacherId === 'all' ||
      (activeTeacher && activeTeacher.assignedClasses.includes(s.className));

    const matchesClass = selectedClass === 'all' || s.className === selectedClass;
    const matchesGrade = selectedGrade === 'all' || s.grade.toString() === selectedGrade;
    return matchesSearch && matchesTeacher && matchesClass && matchesGrade;
  });

  // Calculate Class Analytics
  const totalStudents = filteredStudents.length;
  const avgSpeaking = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.averageSpeakingScore, 0) / (totalStudents || 1)
  );
  const avgListening = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.averageListeningScore, 0) / (totalStudents || 1)
  );
  const avgPhonics = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.phonicsMasteryScore, 0) / (totalStudents || 1)
  );

  // Export to CSV
  const handleExportCSV = () => {
    soundManager.playDing();
    const csvData = exportStudentsToCSV(filteredStudents);
    downloadCSV(`E-Smart-Kids-Roster-${new Date().toISOString().slice(0, 10)}.csv`, csvData);
  };

  // Copy STT roster for parents
  const handleCopySTTRoster = () => {
    soundManager.playDing();
    const sorted = [...filteredStudents].sort((a, b) => (a.stt ?? 999) - (b.stt ?? 999));
    const classNameText = selectedClass === 'all' ? 'Tất cả các lớp' : selectedClass;
    const rosterLines = sorted
      .map((s) => {
        const sttText = s.stt !== undefined ? `STT ${String(s.stt).padStart(2, '0')}` : 'STT --';
        return `📌 ${sttText}: ${s.fullName} (${s.className} - Mã HS: ${s.studentId})`;
      })
      .join('\n');

    const fullMessage =
`🌟 E-SMART ENGLISH KIDS - DANH SÁCH SỐ THỨ TỰ (STT) ĐĂNG NHẬP 🌟
🏫 Lớp: ${classNameText}
📅 Ngày cập nhật: ${new Date().toLocaleDateString('vi-VN')}
--------------------------------------------------
${rosterLines}
--------------------------------------------------
👉 HƯỚNG DẪN DÀNH CHO PHỤ HUYNH VÀ HỌC SINH:
1. Mở ứng dụng E-SMART ENGLISH KIDS.
2. Tại màn hình đăng nhập, nhập đúng "Họ và tên" cùng "Số thứ tự (STT)" của con như danh sách trên.
3. Nhấn "Vào Học Ngay" để vào góc học tập riêng biệt (bảo mật tuyệt đối thông tin, điểm số, và thành tích học tập)!`;

    navigator.clipboard
      .writeText(fullMessage)
      .then(() => {
        soundManager.playVictory();
        setCopyToast(isVi ? 'Đã sao chép danh sách STT để gửi phụ huynh!' : 'Copied student STT roster to clipboard!');
        setTimeout(() => setCopyToast(null), 3500);
      })
      .catch(() => {
        setCopyToast('Không thể tự động sao chép. Vui lòng thử lại.');
        setTimeout(() => setCopyToast(null), 3000);
      });
  };

  // Generate AI Praise Letter for a student with fallback
  const handleGenerateAIForStudent = async (student: StudentRecord) => {
    setIsGenerating(student.studentId);
    setPraiseError(null);
    soundManager.playDing();
    const assignedTeacher = getTeacherForClass(student.className);

    try {
      const data = await generatePraiseLetterAI(
        student.fullName,
        student.grade,
        student.completedUnits.length,
        student.averageSpeakingScore,
        student.averageListeningScore,
        student.badgesEarned.length,
        assignedTeacher.name
      );

      if (data && data.praiseLetter) {
        soundManager.playVictory();
        onGeneratePraiseLetter(student.studentId, data.praiseLetter);
      }
    } catch (err: any) {
      soundManager.playBuzzer();
      setPraiseError(`Lỗi tạo thư khen cho học sinh ${student.fullName}: ${err?.message || 'Gemini API thất bại'}`);
    } finally {
      setIsGenerating(null);
    }
  };

  // Issue Certificate for a student
  const handleIssueCertificateForStudent = (student: StudentRecord) => {
    soundManager.playVictory();
    const assignedTeacher = getTeacherForClass(student.className);
    const certNumber = `ESK-2026-G${student.grade}-${student.studentId}`;
    const cert: Certificate = {
      id: 'cert-' + Date.now(),
      certificateNumber: certNumber,
      studentName: student.fullName,
      achievementTitle: `Excellence in English Communicative Competence - Grade ${student.grade}`,
      grade: student.grade,
      className: student.className,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      qrVerificationUrl: `https://esmartkids.edu.vn/verify/${certNumber}`,
      leadTeacher: assignedTeacher.name,
      institution: 'E-Smart English Kids · 2018 General Education Curriculum Innovation',
    };
    onIssueCertificate(student.studentId, cert);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Teacher Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <span>👩‍🏫 {isVi ? 'Bảng Điều Khiển Giáo Viên' : 'Teacher Dashboard'}</span>
            <span>·</span>
            <span>2018 General Education Curriculum Analytics</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            {selectedTeacherId === 'thanh-thao'
              ? (isVi ? 'Chào cô Thanh Thảo' : 'Welcome, Ms Thanh Thảo')
              : selectedTeacherId === 'hong-phuong'
              ? (isVi ? 'Chào cô Hồng Phượng' : 'Welcome, Ms Hồng Phượng')
              : (isVi ? 'Ban Giảng Dạy Tiếng Anh Tiểu Học' : 'Primary English Teaching Department')} 🌟
          </h1>
          <p className="text-teal-100 text-sm mt-1 max-w-xl font-medium">
            {selectedTeacherId === 'thanh-thao'
              ? (isVi
                  ? 'Phụ trách giảng dạy: Lớp 1/1 và Lớp 1/2 (Chương trình Tiếng Anh Global Success Lớp 1).'
                  : 'In charge of Class 1/1 & Class 1/2 (Global Success Grade 1 Curriculum).')
              : selectedTeacherId === 'hong-phuong'
              ? (isVi
                  ? 'Phụ trách giảng dạy: Lớp 2/3 và Lớp 2/4 (Chương trình Tiếng Anh Global Success Lớp 2).'
                  : 'In charge of Class 2/3 & Class 2/4 (Global Success Grade 2 Curriculum).')
              : (isVi
                  ? '4 lớp chính khoá: 1/1, 1/2 (Cô Thanh Thảo) & 2/3, 2/4 (Cô Hồng Phượng).'
                  : '4 assigned classes: 1/1, 1/2 (Ms Thanh Thảo) & 2/3, 2/4 (Ms Hồng Phượng).')}
          </p>

          {/* Teacher Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={() => {
                soundManager.playDing();
                setSelectedTeacherId('all');
                setSelectedClass('all');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTeacherId === 'all'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'bg-teal-600/60 hover:bg-teal-600 text-white'
              }`}
            >
              {isVi ? 'Tất Cả Giáo Viên (4 Lớp)' : 'All Teachers (4 Classes)'}
            </button>
            <button
              onClick={() => {
                soundManager.playDing();
                setSelectedTeacherId('thanh-thao');
                setSelectedClass('all');
                setSelectedGrade('1');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTeacherId === 'thanh-thao'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'bg-teal-600/60 hover:bg-teal-600 text-white'
              }`}
            >
              Ms Thanh Thảo (1/1, 1/2)
            </button>
            <button
              onClick={() => {
                soundManager.playDing();
                setSelectedTeacherId('hong-phuong');
                setSelectedClass('all');
                setSelectedGrade('2');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTeacherId === 'hong-phuong'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'bg-teal-600/60 hover:bg-teal-600 text-white'
              }`}
            >
              Ms Hồng Phượng (2/3, 2/4)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCopySTTRoster}
            title={isVi ? 'Sao chép danh sách STT kèm hướng dẫn gửi Zalo cho phụ huynh' : 'Copy student STT roster for parents'}
            className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isVi ? '📋 Sao Chép STT Phụ Huynh' : 'Copy STT Roster'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playDing();
              setShowWorksheetModal(true);
            }}
            title={isVi ? 'Xem và in phiếu bài tập ôn tập Fun Time Global Success' : 'Printable Fun Time worksheets'}
            className="px-3.5 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-display font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isVi ? '📝 Phiếu Bài Tập Ôn Tập' : 'Worksheets'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-display font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isVi ? 'Xuất Excel/CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Copy Toast Alert */}
      {copyToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{copyToast}</span>
          </div>
          <button
            onClick={() => setCopyToast(null)}
            className="text-emerald-200 hover:text-white cursor-pointer px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Praise Error alert matching AI_INSTRUCTIONS.md */}
      {praiseError && (
        <div className="p-3.5 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-shake">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white text-rose-700 font-extrabold text-[10px] uppercase">
              Đã dừng do lỗi
            </span>
            <span className="font-mono text-xs">{praiseError}</span>
          </div>
          <button
            onClick={() => setPraiseError(null)}
            className="text-rose-200 hover:text-white cursor-pointer px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Class Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {isVi ? 'Tổng số học sinh' : 'Total Students'}
          </span>
          <span className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1 block">
            {totalStudents}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">100% {isVi ? 'Hoạt động' : 'Active'}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {isVi ? 'Phát âm & Nói TB' : 'Avg Speaking Fluency'}
          </span>
          <span className="font-display font-bold text-3xl text-emerald-600 mt-1 block">
            {avgSpeaking}%
          </span>
          <span className="text-[11px] text-slate-500">{isVi ? 'Đánh giá AI' : 'AI Evaluated'}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {isVi ? 'Nghe hiểu TB' : 'Avg Listening Comprehension'}
          </span>
          <span className="font-display font-bold text-3xl text-teal-600 mt-1 block">
            {avgListening}%
          </span>
          <span className="text-[11px] text-slate-500">{isVi ? '4 Dạng bài tập' : '4 Activity Types'}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {isVi ? 'Ngữ âm Phonics TB' : 'Avg Phonics Mastery'}
          </span>
          <span className="font-display font-bold text-3xl text-amber-600 mt-1 block">
            {avgPhonics}%
          </span>
          <span className="text-[11px] text-slate-500">{isVi ? 'Âm & Ghép vần' : 'Sound & Blending'}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isVi ? 'Tìm học sinh theo tên, mã số, hoặc lớp...' : 'Search student by name, ID, or class...'}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="all">{isVi ? 'Tất cả Khối' : 'All Grades'}</option>
            <option value="1">Grade 1 (Lớp 1)</option>
            <option value="2">Grade 2 (Lớp 2)</option>
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="all">{isVi ? 'Tất cả Lớp' : 'All Classes'}</option>
            <option value="Class 1/1">Class 1/1 (Ms Thanh Thảo)</option>
            <option value="Class 1/2">Class 1/2 (Ms Thanh Thảo)</option>
            <option value="Class 2/3">Class 2/3 (Ms Hồng Phượng)</option>
            <option value="Class 2/4">Class 2/4 (Ms Hồng Phượng)</option>
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-3 text-center">{isVi ? 'STT' : 'No.'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Mã HS' : 'Student ID'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Họ và Tên' : 'Full Name'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Lớp / Khối' : 'Class / Grade'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Số Bài Hoàn Thành' : 'Completed Units'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Điểm Nói AI' : 'Speaking Score'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Điểm Nghe' : 'Listening Score'}</th>
                <th className="py-3.5 px-4">{isVi ? 'Huy Hiệu' : 'Badges'}</th>
                <th className="py-3.5 px-4 text-right">{isVi ? 'Thao Tác Sư Phạm' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s) => (
                <tr
                  key={s.studentId}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                      {s.stt ?? '-'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                    {s.studentId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {s.fullName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {s.className} (Grade {s.grade})
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold">
                      {s.completedUnits.length} Units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                    {s.averageSpeakingScore}%
                  </td>
                  <td className="py-3.5 px-4 font-bold text-teal-600 font-mono">
                    {s.averageListeningScore}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-base">
                      {s.badgesEarned.map((b) => b.icon).join(' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          soundManager.playDing();
                          setInspectStudent(s);
                        }}
                        title={isVi ? 'Xem Hồ Sơ Chi Tiết' : 'View Detailed Portfolio'}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleGenerateAIForStudent(s)}
                        disabled={isGenerating === s.studentId}
                        title={isVi ? 'Tạo Thư Khen AI (Tiếng Anh)' : 'Generate AI Praise Letter (English)'}
                        className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Sparkles className={`w-3 h-3 ${isGenerating === s.studentId ? 'animate-spin' : ''}`} />
                        <span>{isVi ? 'Thư Khen' : 'Praise'}</span>
                      </button>

                      <button
                        onClick={() => handleIssueCertificateForStudent(s)}
                        title={isVi ? 'Cấp Chứng Nhận Hoàn Thành' : 'Issue Certificate of Achievement'}
                        className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Award className="w-3 h-3" />
                        <span>{isVi ? 'Chứng Chỉ' : 'Cert'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detailed Portfolio Drawer Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {isVi ? 'Hồ Sơ Năng Lực Học Sinh' : 'Student Competency Portfolio'}
                </span>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                  {inspectStudent.fullName} ({inspectStudent.studentId})
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    STT: {inspectStudent.stt ?? '-'}
                  </span>
                  <span>{inspectStudent.className}</span>
                  <span>·</span>
                  <span>Grade {inspectStudent.grade}</span>
                  <span>·</span>
                  <span>GV: {getTeacherForClass(inspectStudent.className).name}</span>
                  <span>·</span>
                  <span>PH: {inspectStudent.parentName} ({inspectStudent.parentPhone})</span>
                </p>
              </div>

              <button
                onClick={() => setInspectStudent(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Speaking Recordings Playback */}
            <div className="mb-6">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>{isVi ? 'Lịch Sử Bản Ghi Âm Luyện Nói AI' : 'AI Speaking Attempts & Audio Log'}</span>
              </h4>

              <div className="space-y-2">
                {(inspectStudent.speakingHistory || []).map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">"{h.targetText}"</p>
                      <p className="text-[11px] text-slate-500">
                        {h.date} · {isVi ? 'Điểm phát âm' : 'Pronunciation'}: {h.pronunciationScore}% · {h.rating}
                      </p>
                    </div>

                    <button
                      onClick={() => speakText(h.targetText)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isVi ? 'Phát Lại' : 'Play Audio'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Praise Letters List */}
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isVi ? 'Thư Khen Đã Cấp' : 'Issued Praise Letters'} ({inspectStudent.praiseLetters?.length || 0})</span>
              </h4>

              {inspectStudent.praiseLetters && inspectStudent.praiseLetters.length > 0 ? (
                <div className="space-y-3">
                  {inspectStudent.praiseLetters.map((pl) => (
                    <div
                      key={pl.id}
                      className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs"
                    >
                      <span className="font-bold text-amber-900 dark:text-amber-100 block mb-1">
                        {pl.headline}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line text-[11px] line-clamp-3">
                        {pl.letterBody}
                      </p>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block mt-2">
                        Issued: {pl.date} by {pl.verifiedBy}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {isVi ? 'Chưa có thư khen nào được tạo.' : 'No praise letters generated yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Printable Worksheet Modal (Pedagogical official review sheets) */}
      {showWorksheetModal && (() => {
        const milestones = worksheetGrade === 1 ? GRADE_1_FUN_TIMES : GRADE_2_FUN_TIMES;
        const currentMilestone = milestones[worksheetMilestoneIdx] || milestones[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-700 shadow-2xl max-h-[92vh] flex flex-col">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <FileText className="w-4 h-4" />
                    <span>{isVi ? 'Xuất Phiếu Bài Tập Ôn Tập Chuẩn Sư Phạm' : 'Official Pedagogical Review Worksheets'}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                    {currentMilestone.title} - {currentMilestone.titleVi}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isVi ? 'In Phiếu Bài Tập (Print / PDF)' : 'Print Worksheet'}</span>
                  </button>
                  <button
                    onClick={() => setShowWorksheetModal(false)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="py-3 flex flex-wrap items-center gap-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-500">{isVi ? 'Chọn Khối:' : 'Select Grade:'}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playDing();
                      setWorksheetGrade(1);
                      setWorksheetMilestoneIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      worksheetGrade === 1 ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Lớp 1 (Global Success 1)
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playDing();
                      setWorksheetGrade(2);
                      setWorksheetMilestoneIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      worksheetGrade === 2 ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Lớp 2 (Global Success 2)
                  </button>
                </div>

                <span className="font-bold text-slate-500 ml-2">{isVi ? 'Chọn đợt ôn tập:' : 'Milestone:'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {milestones.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        soundManager.playDing();
                        setWorksheetMilestoneIdx(idx);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                        worksheetMilestoneIdx === idx
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {m.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printable Content Paper Preview */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl mt-4">
                <div className="max-w-3xl mx-auto bg-white text-slate-900 p-8 rounded-2xl shadow-md border border-slate-200 print:border-none print:shadow-none print:p-0">
                  
                  {/* Official Header */}
                  <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
                    <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
                      BỘ GIÁO DỤC VÀ ĐÀO TẠO · TIỂU HỌC NĂNG ĐỘNG
                    </p>
                    <h2 className="font-display font-extrabold text-2xl text-slate-900 uppercase mt-1">
                      PHIẾU ÔN TẬP VÀ ĐÁNH GIÁ NĂNG LỰC TIẾNG ANH
                    </h2>
                    <p className="text-sm font-bold text-indigo-700 mt-1">
                      {currentMilestone.title}: {currentMilestone.titleVi.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      Chương trình GDPT 2018 · Global Success Lớp {worksheetGrade} · {currentMilestone.coveredUnits.join(' - ')}
                    </p>
                  </div>

                  {/* Student Info Lines */}
                  <div className="grid grid-cols-12 gap-3 text-xs font-semibold pb-4 border-b border-dashed border-slate-300 mb-6">
                    <div className="col-span-6">
                      Họ và tên: <span className="border-b border-dotted border-slate-400 inline-block w-48">&nbsp;</span>
                    </div>
                    <div className="col-span-3">
                      Lớp: <span className="border-b border-dotted border-slate-400 inline-block w-16">&nbsp;</span>
                    </div>
                    <div className="col-span-3">
                      STT: <span className="border-b border-dotted border-slate-400 inline-block w-16">&nbsp;</span>
                    </div>
                  </div>

                  {/* Activity 1: Chant Tracing & Reading */}
                  <div className="mb-6">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                      <span>Sing &amp; Trace the Karaoke Chant:</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs font-mono leading-relaxed space-y-1">
                      {currentMilestone.chantLyrics.map((line, lIdx) => (
                        <p key={lIdx} className="text-slate-800">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Activity 2: Vocabulary & Logic Matching */}
                  <div className="mb-6">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                      <span>Odd One Out Puzzle (Khoanh tròn từ khác loại):</span>
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 italic">
                      Câu hỏi: {currentMilestone.oddOneOutPuzzle.question}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {currentMilestone.oddOneOutPuzzle.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-3 rounded-xl border border-slate-300 text-center space-y-1.5"
                        >
                          <span className="text-2xl block">{opt.emoji}</span>
                          <span className="font-bold text-xs block text-slate-800">{opt.text}</span>
                          <div className="w-4 h-4 rounded-full border border-slate-400 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity 3: Board Game Missions */}
                  <div className="mb-6">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
                      <span>Adventure Journey Challenges (Đọc to và hoàn thành các nhiệm vụ):</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {currentMilestone.boardGameTiles.slice(0, 4).map((tile) => (
                        <div key={tile.step} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                          <span className="font-bold text-[11px] text-teal-700 block">Bước {tile.step}: {tile.title}</span>
                          <p className="text-[11px] text-slate-600 mt-1">{tile.task}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{tile.emoji}</span>
                            <span>[ ] Đã đạt</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teacher & Parent Sign-off */}
                  <div className="pt-4 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-600 mt-8">
                    <div>
                      <p className="font-bold text-slate-800">Ý kiến của Phụ huynh</p>
                      <p className="text-[11px] italic mt-1">(Ký và ghi rõ họ tên)</p>
                      <div className="h-16" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Nhận xét của Giáo viên bộ môn</p>
                      <p className="text-[11px] italic mt-1">E-Smart English Kids Certification</p>
                      <div className="h-16" />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
