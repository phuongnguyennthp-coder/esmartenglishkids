import React, { useState } from 'react';
import { Settings, Users, Database, RefreshCw, Sparkles, CheckCircle2, Download, Upload, Shield, AlertCircle, Plus, BookOpen, GraduationCap } from 'lucide-react';
import { StudentRecord, GoogleSheetsSyncConfig, getTeacherForClass, TEACHERS } from '../../types/user';
import { soundManager } from '../../utils/audio';
import { parseGoogleSheetCSV, exportStudentsToCSV, downloadCSV, generateSampleGoogleSheetCSV, fetchGoogleSheetOnline } from '../../utils/googleSheets';
import { restoreDefault140Students } from '../../utils/storage';
import { INITIAL_STUDENTS } from '../../data/initialStudents';
import { CurriculumImportCenter } from '../curriculum/CurriculumImportCenter';

interface AdminDashboardProps {
  students: StudentRecord[];
  sheetConfig: GoogleSheetsSyncConfig;
  onUpdateSheetConfig: (config: GoogleSheetsSyncConfig) => void;
  onUpdateStudents: (students: StudentRecord[]) => void;
  onCurriculumChanged?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  sheetConfig,
  onUpdateSheetConfig,
  onUpdateStudents,
  onCurriculumChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'students' | 'teachers' | 'ai' | 'curriculum' | 'system'>('sync');
  const [sheetUrlInput, setSheetUrlInput] = useState(sheetConfig.sheetUrl);
  const [syncInterval, setSyncInterval] = useState(sheetConfig.autoSyncIntervalMinutes);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // New Student Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    stt: 1,
    studentId: '',
    fullName: '',
    grade: 1 as 1 | 2,
    className: 'Class 1/1',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
  });

  // Paste Direct Sheet Modal
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState('');

  // AI Configuration State
  const [aiSettings, setAiSettings] = useState({
    model: 'gemini-3-flash-preview',
    strictness: 'encouraging',
    languageEnforcement: '100% English for Kids',
    praiseLetterSigner: 'Assigned Class Teacher (Ms Thanh Thảo / Ms Hồng Phượng)',
  });

  // One-click restore 140 students
  const handleRestoreDefault140 = () => {
    soundManager.playVictory();
    const restored = restoreDefault140Students();
    onUpdateStudents(restored);
    const updatedConfig: GoogleSheetsSyncConfig = {
      ...sheetConfig,
      lastSyncTimestamp: new Date().toISOString(),
      syncStatus: 'synced',
      totalSyncedStudents: restored.length,
    };
    onUpdateSheetConfig(updatedConfig);
    setSyncToast('⚡ Đã nạp thành công trọn vẹn 140 học sinh chuẩn từ Lớp 1/1 đến Lớp 2/4 theo STT 1 đến 140!');
    setTimeout(() => setSyncToast(null), 6000);
  };

  // Direct paste import
  const handleApplyPastedData = () => {
    if (!pasteText.trim()) return;
    const rows = parseGoogleSheetCSV(pasteText);
    if (rows.length === 0) {
      soundManager.playBuzzer();
      alert('Không nhận diện được học sinh nào từ nội dung đã dán. Vui lòng kiểm tra lại định dạng bảng!');
      return;
    }

    const merged: StudentRecord[] = rows.map((r, i) => {
      const existing = students.find(
        (s) => s.studentId === r.studentId || (s.fullName === r.fullName && s.className === r.className)
      );
      if (existing) {
        return {
          ...existing,
          stt: r.stt || i + 1,
          fullName: r.fullName,
          grade: r.grade,
          className: r.className,
          parentName: r.parentName,
          parentEmail: r.parentEmail,
          parentPhone: r.parentPhone,
          status: r.status,
        };
      }
      return {
        stt: r.stt || i + 1,
        studentId: r.studentId,
        fullName: r.fullName,
        grade: r.grade,
        className: r.className,
        parentName: r.parentName,
        parentEmail: r.parentEmail,
        parentPhone: r.parentPhone,
        status: r.status,
        stars: 30,
        coins: 60,
        xp: 120,
        level: 1,
        completedUnits: [1],
        learningTimeMinutes: 45,
        vocabLearnedCount: 6,
        averageListeningScore: 88,
        averageSpeakingScore: 85,
        phonicsMasteryScore: 88,
        digitalCitizenshipScore: 95,
        badgesEarned: [],
        speakingHistory: [],
        reflections: [],
        praiseLetters: [],
        certificates: [],
      };
    });

    onUpdateStudents(merged);
    const updatedConfig: GoogleSheetsSyncConfig = {
      ...sheetConfig,
      lastSyncTimestamp: new Date().toISOString(),
      syncStatus: 'synced',
      totalSyncedStudents: merged.length,
    };
    onUpdateSheetConfig(updatedConfig);
    soundManager.playVictory();
    setShowPasteModal(false);
    setPasteText('');
    setSyncToast(`Đã nạp thành công ${merged.length} học sinh từ bảng tính dán trực tiếp!`);
    setTimeout(() => setSyncToast(null), 5000);
  };

  // Trigger Google Sheet Sync
  const handleSyncNow = async () => {
    setIsSyncing(true);
    soundManager.playDing();
    setSyncToast(null);

    try {
      const res = await fetchGoogleSheetOnline(sheetUrlInput);
      if (!res.success || !res.rows) {
        throw new Error(res.error || 'Lỗi đồng bộ Google Sheets');
      }

      const rows = res.rows;
      // Reconcile / Merge rows with existing students
      const merged: StudentRecord[] = rows.map((r, i) => {
        const existing = students.find(
          (s) => s.studentId === r.studentId || (s.fullName === r.fullName && s.className === r.className)
        );
        if (existing) {
          return {
            ...existing,
            stt: r.stt || existing.stt || i + 1,
            studentId: r.studentId,
            fullName: r.fullName,
            grade: r.grade,
            className: r.className,
            parentName: r.parentName,
            parentEmail: r.parentEmail,
            parentPhone: r.parentPhone,
            status: r.status,
          };
        }
        return {
          stt: r.stt || i + 1,
          studentId: r.studentId,
          fullName: r.fullName,
          grade: r.grade,
          className: r.className,
          parentName: r.parentName,
          parentEmail: r.parentEmail,
          parentPhone: r.parentPhone,
          status: r.status,
          stars: 20,
          coins: 50,
          xp: 100,
          level: 1,
          completedUnits: [],
          learningTimeMinutes: 20,
          vocabLearnedCount: 4,
          averageListeningScore: 85,
          averageSpeakingScore: 80,
          phonicsMasteryScore: 85,
          digitalCitizenshipScore: 90,
          badgesEarned: [],
          speakingHistory: [],
          reflections: [],
          praiseLetters: [],
          certificates: [],
        };
      });

      onUpdateStudents(merged);

      const updatedConfig: GoogleSheetsSyncConfig = {
        ...sheetConfig,
        sheetUrl: sheetUrlInput,
        autoSyncIntervalMinutes: syncInterval,
        lastSyncTimestamp: new Date().toISOString(),
        syncStatus: 'synced',
        totalSyncedStudents: merged.length,
      };

      onUpdateSheetConfig(updatedConfig);
      soundManager.playVictory();
      setSyncToast(`Đồng bộ Google Sheets trực tuyến thành công! Đã cập nhật ${merged.length} học sinh với STT chuẩn.`);
      setTimeout(() => setSyncToast(null), 5000);
    } catch (err: any) {
      soundManager.playBuzzer();
      setSyncToast(`Lỗi kết nối: ${err.message || 'Vui lòng kiểm tra quyền chia sẻ bảng tính'}`);
      setTimeout(() => setSyncToast(null), 6000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Download Sample Google Sheets Template
  const handleDownloadTemplate = () => {
    soundManager.playDing();
    const sampleCSV = generateSampleGoogleSheetCSV();
    downloadCSV('E-Smart-Kids-Google-Sheets-Template.csv', sampleCSV);
  };

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const rows = parseGoogleSheetCSV(text);
        if (rows.length > 0) {
          const merged: StudentRecord[] = rows.map((r, i) => {
            const existing = students.find((s) => s.studentId === r.studentId);
            if (existing) return existing;
            return {
              ...r,
              stars: 20,
              coins: 50,
              xp: 100,
              level: 1,
              completedUnits: [],
              learningTimeMinutes: 20,
              vocabLearnedCount: 4,
              averageListeningScore: 85,
              averageSpeakingScore: 80,
              phonicsMasteryScore: 85,
              digitalCitizenshipScore: 90,
              badgesEarned: [],
              speakingHistory: [],
              reflections: [],
              praiseLetters: [],
              certificates: [],
            };
          });

          onUpdateStudents(merged);
          soundManager.playVictory();
          setSyncToast(`Imported ${rows.length} students from CSV file!`);
          setTimeout(() => setSyncToast(null), 3000);
        }
      }
    };
    reader.readAsText(file);
  };

  // Add Manual Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.studentId || !newStudent.fullName) return;

    const created: StudentRecord = {
      stt: newStudent.stt || students.length + 1,
      studentId: newStudent.studentId,
      fullName: newStudent.fullName,
      grade: newStudent.grade,
      className: newStudent.className,
      parentName: newStudent.parentName || 'Parent',
      parentEmail: newStudent.parentEmail || 'parent@example.com',
      parentPhone: newStudent.parentPhone || '0900000000',
      status: 'Active',
      stars: 10,
      coins: 30,
      xp: 50,
      level: 1,
      completedUnits: [],
      learningTimeMinutes: 10,
      vocabLearnedCount: 2,
      averageListeningScore: 80,
      averageSpeakingScore: 80,
      phonicsMasteryScore: 80,
      digitalCitizenshipScore: 90,
      badgesEarned: [],
      speakingHistory: [],
      reflections: [],
      praiseLetters: [],
      certificates: [],
    };

    onUpdateStudents([created, ...students]);
    soundManager.playVictory();
    setShowAddModal(false);
    setNewStudent({
      stt: students.length + 2,
      studentId: '',
      fullName: '',
      grade: 1,
      className: 'Class 1/1',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
    });
  };

  // Toggle student status
  const handleToggleStatus = (studentId: string) => {
    soundManager.playDing();
    const updated = students.map((s) => {
      if (s.studentId === studentId) {
        return {
          ...s,
          status: s.status === 'Active' ? ('Inactive' as const) : ('Active' as const),
        };
      }
      return s;
    });
    onUpdateStudents(updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Administrator Portal</span>
              <span>·</span>
              <span>System &amp; Sync Control</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              E-Smart Kids Management Console ⚙️
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Google Sheets student sync, user database management, and Gemini AI educational model controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Google Sheets Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Toast */}
      {syncToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('sync');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sync'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🔄 Google Sheets Sync Engine
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('students');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          👥 Student Database ({students.length})
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('teachers');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          👩‍🏫 Teachers &amp; Classes (4 Classes)
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('ai');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🤖 Gemini AI Settings
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('curriculum');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📚 Quản Lý Giáo Trình
        </button>
      </div>

      {/* TAB 1: GOOGLE SHEETS SYNC ENGINE */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Google Sheets Synchronization Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronize student lists, class assignments, and parent contact information with school spreadsheets
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected &amp; Synced</span>
              </span>
            </div>

            {/* Google Sheets URL Configuration */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Published Google Sheets CSV Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sheetUrlInput}
                    onChange={(e) => setSheetUrlInput(e.target.value)}
                    className="flex-1 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Sync URL
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">
                    Auto-Sync Interval
                  </span>
                  <select
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(Number(e.target.value))}
                    className="mt-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 w-full"
                  >
                    <option value={1}>Every 1 minute</option>
                    <option value={5}>Every 5 minutes (Recommended)</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={60}>Every hour</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">
                    Last Successful Sync
                  </span>
                  <span className="font-display font-bold text-sm text-slate-900 dark:text-white mt-1 block">
                    {new Date(sheetConfig.lastSyncTimestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">
                    Synced Records
                  </span>
                  <span className="font-display font-bold text-sm text-emerald-600 mt-1 block">
                    {students.length} Student Profiles
                  </span>
                </div>
              </div>
            </div>

            {/* Template & Manual Upload Tools */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRestoreDefault140}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Nạp 140 Học Sinh Chuẩn (Lớp 1/1 đến 2/4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasteModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Database className="w-4 h-4" />
                  <span>📋 Dán Dữ Liệu Bảng Tính (Quick Paste)</span>
                </button>

                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Mẫu Schema (.CSV)</span>
                </button>

                <label className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải Lên Tệp CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <span className="text-xs text-slate-400 italic">
                Các cột chuẩn: STT, Họ và chữ đệm, Tên, Nữ (x), Lớp (1/1 - 2/4), Phụ huynh, SĐT, Email
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DATABASE CRUD */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Student Master Database
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3 text-center">STT</th>
                    <th className="py-3 px-4">Mã HS</th>
                    <th className="py-3 px-4">Họ và Tên</th>
                    <th className="py-3 px-4">Khối</th>
                    <th className="py-3 px-4">Lớp</th>
                    <th className="py-3 px-4">Giáo viên phụ trách</th>
                    <th className="py-3 px-4">Phụ huynh</th>
                    <th className="py-3 px-4">SĐT</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((s) => (
                    <tr key={s.studentId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                          {s.stt ?? '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{s.studentId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{s.fullName}</td>
                      <td className="py-3 px-4">Khối {s.grade}</td>
                      <td className="py-3 px-4">{s.className}</td>
                      <td className="py-3 px-4 font-medium text-teal-600 dark:text-teal-400">
                        {getTeacherForClass(s.className).name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.parentName}</td>
                      <td className="py-3 px-4 font-mono">{s.parentPhone}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(s.studentId)}
                          className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          {s.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEACHERS & CLASS ALLOCATIONS */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Teacher Allocations &amp; Curriculum Governance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official class distribution strictly aligned with the 2018 General Education Curriculum (16 Units per Grade)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                4 Active Classes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher 1: Ms Thanh Thảo */}
              <div className="p-6 rounded-3xl border-2 border-teal-200 dark:border-teal-800/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-sm">
                      👩‍🏫
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {TEACHERS['thanh-thao'].name}
                      </h4>
                      <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                        {TEACHERS['thanh-thao'].title}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-700">
                    Grade 1
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Assigned Classes:
                    </span>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 font-bold text-teal-800 dark:text-teal-200">
                        Class 1/1
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 font-bold text-teal-800 dark:text-teal-200">
                        Class 1/2
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Curriculum Scope:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Global Success Grade 1 · Full 16 Units (In the School Playground → At the Campsite)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>✉️ {TEACHERS['thanh-thao'].email}</span>
                    <span>📞 {TEACHERS['thanh-thao'].phone}</span>
                  </div>
                </div>
              </div>

              {/* Teacher 2: Ms Hồng Phượng */}
              <div className="p-6 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-sm">
                      👩‍🏫
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {TEACHERS['hong-phuong'].name}
                      </h4>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                        {TEACHERS['hong-phuong'].title}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
                    Grade 2
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Assigned Classes:
                    </span>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 font-bold text-indigo-800 dark:text-indigo-200">
                        Class 2/3
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 font-bold text-indigo-800 dark:text-indigo-200">
                        Class 2/4
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Curriculum Scope:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Global Success Grade 2 · Full 16 Units (At My Birthday Party → At the Animal Camp)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>✉️ {TEACHERS['hong-phuong'].email}</span>
                    <span>📞 {TEACHERS['hong-phuong'].phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GEMINI AI SETTINGS */}
      {activeTab === 'ai' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Educational AI Engine Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure Google Gen AI SDK model parameters for speech evaluation and story generation
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Gemini Model Alias
              </label>
              <input
                type="text"
                disabled
                value={aiSettings.model}
                className="w-full text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Primary multimodal model used for speech evaluation, story generation, and praise letters
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                AI Evaluation Feedback Tone
              </label>
              <select
                value={aiSettings.strictness}
                onChange={(e) => setAiSettings({ ...aiSettings, strictness: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="encouraging">Positive Encouraging (Best for Grade 1 &amp; 2 Beginners)</option>
                <option value="balanced">Balanced Assessment</option>
                <option value="strict">Strict Native Phoneme Standards</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Language Policy Enforcement
              </label>
              <input
                type="text"
                disabled
                value="Student: 100% English · Teacher/Parent: VN + EN"
                className="w-full text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-500"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  soundManager.playVictory();
                  setSyncToast('AI settings updated successfully!');
                  setTimeout(() => setSyncToast(null), 3000);
                }}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Save AI Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CURRICULUM MANAGEMENT & CONTENT INGESTION */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <CurriculumImportCenter
            currentGrade={1}
            teacherName="Admin Quản Trị"
            onCurriculumChanged={() => {
              onCurriculumChanged?.();
            }}
          />
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleAddStudentSubmit}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-700 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Enroll New Student
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  STT (Số thứ tự lớp) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="1, 2, 3..."
                  value={newStudent.stt || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, stt: Number(e.target.value) || 1 })}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mã học sinh (ID) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. G1-004"
                  value={newStudent.studentId}
                  onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hoang Minh Tri"
                value={newStudent.fullName}
                onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Grade Level
                </label>
                <select
                  value={newStudent.grade}
                  onChange={(e) => {
                    const g = Number(e.target.value) as 1 | 2;
                    setNewStudent({
                      ...newStudent,
                      grade: g,
                      className: g === 1 ? 'Class 1/1' : 'Class 2/3',
                    });
                  }}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value={1}>Grade 1 (Ms Thanh Thảo)</option>
                  <option value={2}>Grade 2 (Ms Hồng Phượng)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Assigned Class
                </label>
                <select
                  value={newStudent.className}
                  onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  {newStudent.grade === 1 ? (
                    <>
                      <option value="Class 1/1">Class 1/1 (Ms Thanh Thảo)</option>
                      <option value="Class 1/2">Class 1/2 (Ms Thanh Thảo)</option>
                    </>
                  ) : (
                    <>
                      <option value="Class 2/3">Class 2/3 (Ms Hồng Phượng)</option>
                      <option value="Class 2/4">Class 2/4 (Ms Hồng Phượng)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Parent Name
              </label>
              <input
                type="text"
                placeholder="e.g. Hoang Van Duc"
                value={newStudent.parentName}
                onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Parent Phone
                </label>
                <input
                  type="text"
                  placeholder="0912..."
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Parent Email
                </label>
                <input
                  type="email"
                  placeholder="parent@..."
                  value={newStudent.parentEmail}
                  onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer shadow-md"
              >
                Create Student Profile
              </button>
            </div>
          </form>
        </div>
      {/* Quick Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Dán Dữ Liệu Bảng Tính Trực Tiếp (Quick Paste 140 Học Sinh)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mở bảng Google Sheets hoặc Excel của bạn, chọn tất cả (Ctrl+A / Cmd+A) rồi sao chép (Ctrl+C / Cmd+C) và dán vào đây!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Nội dung sao chép từ Google Sheets / Excel:
              </label>
              <textarea
                rows={8}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Dán nội dung vào đây (hỗ trợ cả định dạng CSV và copy trực tiếp từ bảng tính)..."
                className="w-full text-xs font-mono p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Live Preview of parsed rows */}
            {pasteText.trim() && (
              <div className="space-y-2">
                {(() => {
                  const previewRows = parseGoogleSheetCSV(pasteText);
                  return (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Hệ thống nhận diện: {previewRows.length} học sinh
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Hiển thị 5 học sinh đầu tiên:
                        </span>
                      </div>
                      {previewRows.length > 0 ? (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                              <tr>
                                <th className="p-2">STT</th>
                                <th className="p-2">Mã HS</th>
                                <th className="p-2">Họ và tên</th>
                                <th className="p-2">Lớp</th>
                                <th className="p-2">Khối</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {previewRows.slice(0, 5).map((r) => (
                                <tr key={r.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                  <td className="p-2 font-mono font-bold text-amber-600">{r.stt}</td>
                                  <td className="p-2 font-mono">{r.studentId}</td>
                                  <td className="p-2 font-bold">{r.fullName}</td>
                                  <td className="p-2">{r.className}</td>
                                  <td className="p-2">Lớp {r.grade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-rose-500 font-bold">
                          Chưa nhận diện được học sinh nào. Hãy đảm bảo bạn sao chép cả dòng tiêu đề cột hoặc dán nội dung CSV chuẩn.
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleApplyPastedData}
                disabled={!pasteText.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-md shadow-emerald-600/20"
              >
                Lưu và Cập Nhật Danh Sách
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
