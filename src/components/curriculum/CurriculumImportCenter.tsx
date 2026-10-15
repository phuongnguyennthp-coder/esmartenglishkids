import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Trash2,
  Check,
  Eye,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Download,
  Filter,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Layers,
  History,
  FileCode,
  Edit3,
  Save,
  X,
  Volume2,
} from 'lucide-react';
import { GradeLevel, Unit, VocabWord } from '../../types/curriculum';
import {
  CurriculumImportSession,
  CurriculumUnitRecord,
  PublicationStatus,
  SupportedFileType,
  UnitConflict,
  ValidationIssue,
} from '../../types/curriculumImport';
import { parseUploadedCurriculumFile, parseDelimitedText, mapTableRowsToCurriculumUnits, parseCurriculumJSON, parseStructuredTextCurriculum } from '../../utils/curriculumParser';
import {
  loadAllStoredUnits,
  saveAllStoredUnits,
  loadImportHistory,
  saveImportSession,
  getActiveUnits,
  detectConflicts,
  updateUnitPublicationStatus,
  bulkUpdateUnitStatus,
  deleteStoredUnit,
  resetGradeCurriculumToDefault,
  exportCurriculumBackup,
  restoreCurriculumFromBackup,
} from '../../utils/curriculumManager';
import { generateCurriculumCSVTemplate, generateCurriculumJSONTemplate } from '../../utils/curriculumTemplates';
import { soundManager, speakText } from '../../utils/audio';

interface CurriculumImportCenterProps {
  currentGrade: GradeLevel;
  teacherName?: string;
  onCurriculumChanged?: () => void;
  onClose?: () => void;
}

export const CurriculumImportCenter: React.FC<CurriculumImportCenterProps> = ({
  currentGrade: initialGrade,
  teacherName = 'Cô Hồng Phượng',
  onCurriculumChanged,
  onClose,
}) => {
  // Navigation Tabs: 'import' | 'review' | 'inventory' | 'history'
  const [activeTab, setActiveTab] = useState<'import' | 'review' | 'inventory' | 'history'>('import');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);

  // Upload & Parser State
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Paste Text State
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [pasteFormat, setPasteFormat] = useState<'csv' | 'json' | 'text'>('csv');

  // Staged Session for Review before commit
  const [currentSession, setCurrentSession] = useState<CurriculumImportSession | null>(null);
  const [stagedUnits, setStagedUnits] = useState<CurriculumUnitRecord[]>([]);
  const [selectedUnitIdx, setSelectedUnitIdx] = useState<number>(0);
  const [conflicts, setConflicts] = useState<UnitConflict[]>([]);

  // Editing State
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CurriculumUnitRecord>>({});

  // Feedback Toasts & Confirmation Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // History & Stored Units
  const [historyList, setHistoryList] = useState<CurriculumImportSession[]>([]);
  const [storedUnits, setStoredUnits] = useState<CurriculumUnitRecord[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stored data on mount
  useEffect(() => {
    refreshData();
  }, [selectedGrade]);

  const refreshData = () => {
    setHistoryList(loadImportHistory());
    setStoredUnits(loadAllStoredUnits());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // ==============================================================
  // FILE HANDLING & PARSING
  // ==============================================================
  const handleProcessFile = async (file: File) => {
    soundManager.playDing();
    setIsProcessing(true);
    setUploadError(null);
    setProcessingProgress(20);
    setProcessingStatus(`Đang đọc tệp "${file.name}"...`);

    try {
      setProcessingProgress(50);
      setProcessingStatus(`Đang phân tích cú pháp cấu trúc bài học và từ vựng...`);

      const result = await parseUploadedCurriculumFile(file, selectedGrade);

      setProcessingProgress(80);
      setProcessingStatus(`Đang kiểm tra tính hợp lệ và phát hiện xung đột dữ liệu...`);

      if (result.units.length === 0) {
        throw new Error('Không thể nhận diện nội dung bài học nào từ file đã tải lên. Vui lòng kiểm tra lại cấu trúc file.');
      }

      // Check conflicts
      const detectedConflicts = detectConflicts(result.units, selectedGrade);
      setConflicts(detectedConflicts);

      const totalItems = result.units.length;
      const validItems = result.units.filter((u) => u.status === 'validated').length;
      const warningsCount = result.units.reduce(
        (sum, u) => sum + u.validationIssues.filter((i) => i.level === 'warning').length,
        0
      );
      const errorsCount = result.units.reduce(
        (sum, u) => sum + u.validationIssues.filter((i) => i.level === 'error').length,
        0
      );

      const session: CurriculumImportSession = {
        id: `sess-${Date.now()}`,
        fileName: file.name,
        fileType: result.fileType,
        fileSize: file.size,
        grade: selectedGrade,
        importedAt: new Date().toISOString(),
        totalItems,
        validItems,
        warningsCount,
        errorsCount,
        status: errorsCount > 0 ? 'draft' : 'validated',
        importedUnits: result.units,
        summary: result.summary,
      };

      setProcessingProgress(100);
      setCurrentSession(session);
      setStagedUnits(result.units);
      setSelectedUnitIdx(0);
      setActiveTab('review');
      soundManager.playVictory();
      showToast(`⚡ Đã trích xuất thành công ${result.units.length} Unit từ "${file.name}".`);
    } catch (err: any) {
      soundManager.playBuzzer();
      setUploadError(err.message || 'Đã xảy ra lỗi trong quá trình xử lý tệp.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualPasteSubmit = () => {
    if (!pastedContent.trim()) {
      setUploadError('Vui lòng dán nội dung bảng hoặc văn bản.');
      return;
    }

    try {
      setIsProcessing(true);
      let units: CurriculumUnitRecord[] = [];
      let fileType: SupportedFileType = 'txt';

      if (pasteFormat === 'json') {
        units = parseCurriculumJSON(pastedContent, selectedGrade, 'Dán trực tiếp.json');
        fileType = 'json';
      } else if (pasteFormat === 'csv') {
        const rows = parseDelimitedText(pastedContent);
        units = mapTableRowsToCurriculumUnits(rows, selectedGrade, 'Dán trực tiếp.csv', 'csv');
        fileType = 'csv';
      } else {
        units = parseStructuredTextCurriculum(pastedContent, selectedGrade, 'Dán trực tiếp.txt', 'txt');
        fileType = 'txt';
      }

      if (units.length === 0) {
        throw new Error('Không bóc tách được bài học nào từ nội dung đã dán.');
      }

      const detectedConflicts = detectConflicts(units, selectedGrade);
      setConflicts(detectedConflicts);

      const session: CurriculumImportSession = {
        id: `sess-${Date.now()}`,
        fileName: `Dán thủ công (${pasteFormat.toUpperCase()})`,
        fileType,
        fileSize: new Blob([pastedContent]).size,
        grade: selectedGrade,
        importedAt: new Date().toISOString(),
        totalItems: units.length,
        validItems: units.filter((u) => u.status === 'validated').length,
        warningsCount: units.reduce((s, u) => s + u.validationIssues.filter((i) => i.level === 'warning').length, 0),
        errorsCount: units.reduce((s, u) => s + u.validationIssues.filter((i) => i.level === 'error').length, 0),
        status: units.some((u) => u.status === 'draft') ? 'draft' : 'validated',
        importedUnits: units,
        summary: `Đã bóc tách thành công ${units.length} Unit từ nội dung dán thủ công.`,
      };

      setCurrentSession(session);
      setStagedUnits(units);
      setSelectedUnitIdx(0);
      setShowPasteBox(false);
      setPastedContent('');
      setActiveTab('review');
      soundManager.playVictory();
      showToast(`⚡ Đã bóc tách ${units.length} Unit thành công.`);
    } catch (e: any) {
      soundManager.playBuzzer();
      setUploadError(e.message || 'Lỗi xử lý nội dung đã dán.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ==============================================================
  // WORKFLOW: DRAFT -> VALIDATED -> TEACHER APPROVED -> PUBLISHED
  // ==============================================================
  const handleApproveUnit = (unitId: string) => {
    soundManager.playDing();
    const updated = stagedUnits.map((u) => (u.id === unitId ? { ...u, status: 'approved' as PublicationStatus } : u));
    setStagedUnits(updated);
    updateUnitPublicationStatus(unitId, 'approved', teacherName);
    refreshData();
    showToast(`✓ Đã duyệt nội dung bài học!`);
  };

  const handleBulkApproveAll = () => {
    soundManager.playDing();
    const updated = stagedUnits.map((u) => ({ ...u, status: 'approved' as PublicationStatus }));
    setStagedUnits(updated);
    bulkUpdateUnitStatus(
      stagedUnits.map((u) => u.id),
      'approved',
      teacherName
    );
    refreshData();
    showToast(`✓ Đã duyệt toàn bộ ${stagedUnits.length} Unit!`);
  };

  const handleConfirmPublish = () => {
    soundManager.playVictory();
    // Save import session to audit log
    if (currentSession) {
      saveImportSession({
        ...currentSession,
        status: 'published',
        importedUnits: stagedUnits.map((u) => ({
          ...u,
          status: 'published',
          publishedAt: new Date().toISOString(),
          approvedBy: teacherName,
        })),
      });
    }

    // Set all staged units to published
    bulkUpdateUnitStatus(
      stagedUnits.map((u) => u.id),
      'published',
      teacherName
    );

    setShowConfirmPublishModal(false);
    refreshData();
    onCurriculumChanged?.();
    setActiveTab('inventory');
    showToast(`🎉 Đã xuất bản chính thức ${stagedUnits.length} Unit cho học sinh Lớp ${selectedGrade}!`);
  };

  const handleUnpublishUnit = (unitId: string) => {
    soundManager.playDing();
    updateUnitPublicationStatus(unitId, 'approved', teacherName);
    refreshData();
    onCurriculumChanged?.();
    showToast(`Đã thu hồi xuất bản Unit.`);
  };

  const handleDeleteStagedUnit = (idx: number) => {
    soundManager.playDing();
    const updated = stagedUnits.filter((_, i) => i !== idx);
    setStagedUnits(updated);
    if (selectedUnitIdx >= updated.length) {
      setSelectedUnitIdx(Math.max(0, updated.length - 1));
    }
  };

  // In-line Edit Handler
  const handleStartEdit = (unit: CurriculumUnitRecord) => {
    setEditingUnitId(unit.id);
    setEditFormData({
      title: unit.title,
      titleVi: unit.titleVi,
      targetLetter: unit.targetLetter,
      phonicsSound: unit.phonicsSound,
      vocabulary: [...unit.vocabulary],
    });
  };

  const handleSaveEdit = (unitId: string) => {
    soundManager.playDing();
    const updated = stagedUnits.map((u) => {
      if (u.id === unitId) {
        return {
          ...u,
          title: editFormData.title || u.title,
          titleVi: editFormData.titleVi || u.titleVi,
          targetLetter: editFormData.targetLetter || u.targetLetter,
          phonicsSound: editFormData.phonicsSound || u.phonicsSound,
          vocabulary: editFormData.vocabulary || u.vocabulary,
          updatedAt: new Date().toISOString(),
        };
      }
      return u;
    });

    setStagedUnits(updated);
    setEditingUnitId(null);
    showToast('Đã lưu chỉnh sửa nội dung bài học.');
  };

  // Download Templates
  const handleDownloadTemplate = (format: 'csv' | 'json') => {
    soundManager.playDing();
    const content = format === 'csv' ? generateCurriculumCSVTemplate(selectedGrade) : generateCurriculumJSONTemplate(selectedGrade);
    const mime = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mau_Nhap_Global_Success_Lop_${selectedGrade}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Backup & Restore
  const handleExportBackup = () => {
    soundManager.playDing();
    const jsonStr = exportCurriculumBackup();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `E-Smart-Curriculum-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống tệp sao lưu chương trình học.');
  };

  const handleResetToDefault = () => {
    soundManager.playVictory();
    resetGradeCurriculumToDefault(selectedGrade);
    setShowResetConfirmModal(false);
    refreshData();
    onCurriculumChanged?.();
    showToast(`Đã khôi phục chương trình Lớp ${selectedGrade} về nguyên bản SGK Global Success.`);
  };

  const activeUnitsForInventory = getActiveUnits(selectedGrade);
  const currentViewingUnit = stagedUnits[selectedUnitIdx];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all animate-fade-in">
      
      {/* ============================================================== */}
      {/* HEADER BAR */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <span>📚 Cổng Quản Lý Chương Trình &amp; Nhập Liệu</span>
            <span>·</span>
            <span>Global Success (2018 GEC)</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight flex items-center gap-2">
            <span>Curriculum Management &amp; Content Ingestion</span>
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            Tải lên giáo trình có sẵn, thẩm định dữ liệu theo quy trình{' '}
            <span className="font-bold underline">DRAFT → VALIDATED → APPROVED → PUBLISHED</span> và xuất bản chính thức vào ứng dụng.
          </p>
        </div>

        {/* Grade Selector & Close */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center bg-black/20 p-1 rounded-2xl border border-white/20">
            <button
              onClick={() => {
                soundManager.playDing();
                setSelectedGrade(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                selectedGrade === 1 ? 'bg-white text-amber-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Lớp 1 (Grade 1)
            </button>
            <button
              onClick={() => {
                soundManager.playDing();
                setSelectedGrade(2);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                selectedGrade === 2 ? 'bg-white text-amber-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Lớp 2 (Grade 2)
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all"
              title="Đóng trung tâm nhập liệu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* NAVIGATION TABS */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-2 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('import');
            }}
            className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>1. Tải Lên &amp; Bóc Tách</span>
          </button>

          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('review');
            }}
            className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'review'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Xem Trước &amp; Thẩm Định</span>
            {stagedUnits.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {stagedUnits.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('inventory');
            }}
            className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Danh Mục Đang Hoạt Động</span>
          </button>

          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('history');
            }}
            className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>4. Lịch Sử Nhập Liệu ({historyList.length})</span>
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            title="Tải tệp JSON sao lưu toàn bộ chương trình học và lịch sử"
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sao Lưu</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="m-4 p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white px-2">
            ✕
          </button>
        </div>
      )}

      {/* Error Alert */}
      {uploadError && (
        <div className="m-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-extrabold uppercase text-[11px]">Thông Báo Lỗi Nhập Liệu</p>
            <p className="mt-0.5 font-mono">{uploadError}</p>
          </div>
          <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-800">
            ✕
          </button>
        </div>
      )}

      {/* Processing Progress Bar */}
      {isProcessing && (
        <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              {processingStatus}
            </span>
            <span>{processingProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-amber-200 dark:bg-amber-900/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: UPLOAD & PARSE */}
      {/* ============================================================== */}
      {activeTab === 'import' && (
        <div className="p-6 sm:p-8 space-y-8 animate-fade-in">
          
          {/* Instructions Banner */}
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <span>📁 Hỗ Trợ Đầy Đủ Các Định Dạng Tệp Giáo Viên Sẵn Có</span>
              </h4>
              <p className="text-xs text-amber-900/80 dark:text-amber-300 font-medium leading-relaxed">
                Hệ thống tự động nhận diện và bóc tách bảng từ vựng, mẫu câu, âm ngữ âm (Phonics), lời bài vè (Chant) từ các tệp Excel (<strong>.xlsx</strong>), 
                bảng tính (<strong>.csv</strong>), <strong>.json</strong>, tài liệu Word (<strong>.docx</strong>), văn bản (<strong>.txt</strong>).
              </p>
            </div>

            {/* Template Download Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownloadTemplate('csv')}
                className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Mẫu Excel/CSV</span>
              </button>
              <button
                onClick={() => handleDownloadTemplate('json')}
                className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileCode className="w-3.5 h-3.5 text-orange-600" />
                <span>Mẫu JSON</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-3 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
              accept=".xlsx,.xls,.csv,.tsv,.json,.docx,.txt,.pdf"
              className="hidden"
            />

            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Kéo thả tệp kiến thức vào đây hoặc bấm để chọn tệp từ máy tính
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Đang chọn nhập cho khối: <strong className="text-amber-600 uppercase font-black">LỚP {selectedGrade}</strong> (Global Success). 
              Hỗ trợ: .xlsx, .csv, .json, .docx, .txt (Tối đa 15MB).
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" /> XLSX / CSV
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" /> JSON Schema
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> DOCX / Text
              </span>
            </div>
          </div>

          {/* Alternative: Direct Text / Table Paste Option */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Hoặc Dán Trực Tiếp Nội Dung Bảng Từ Google Sheets / Word
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Không cần lưu thành tệp, bạn có thể bôi đen copy các dòng trong Excel/Google Sheets rồi dán vào đây.
                </p>
              </div>

              <button
                onClick={() => setShowPasteBox(!showPasteBox)}
                className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 cursor-pointer shadow-xs"
              >
                {showPasteBox ? 'Đóng Ô Dán' : 'Mở Ô Dán Dữ Liệu'}
              </button>
            </div>

            {showPasteBox && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Định dạng nội dung:</span>
                  <button
                    onClick={() => setPasteFormat('csv')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                      pasteFormat === 'csv' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Bảng tính (CSV / Tab)
                  </button>
                  <button
                    onClick={() => setPasteFormat('json')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                      pasteFormat === 'json' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setPasteFormat('text')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                      pasteFormat === 'text' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Văn bản bài học (.txt)
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder={
                    pasteFormat === 'csv'
                      ? 'Dán các dòng copy từ Excel/Google Sheets vào đây...\nUnit\tTitle\tWord\tMeaningVi\n1\tIn the Playground\tball\tquả bóng\n1\t\tbook\tquyển sách'
                      : pasteFormat === 'json'
                      ? 'Dán JSON mảng Unit vào đây...'
                      : 'Dán nội dung giáo án dạng văn bản vào đây...'
                  }
                  className="w-full text-xs font-mono p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />

                <button
                  onClick={handleManualPasteSubmit}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Trích Xuất &amp; Thẩm Định Ngay</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PREVIEW & VALIDATION MATRIX */}
      {/* ============================================================== */}
      {activeTab === 'review' && (
        <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
          
          {stagedUnits.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-500">Chưa có tệp nào được trích xuất.</p>
              <button
                onClick={() => setActiveTab('import')}
                className="px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-bold cursor-pointer"
              >
                ← Quay lại bước 1 để tải tệp
              </button>
            </div>
          ) : (
            <>
              {/* Review Top Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Bảng Thẩm Định Dữ Liệu ({stagedUnits.length} Unit đã nhận diện)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-black">
                      Lớp {selectedGrade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Xem trước chi tiết từng Unit, kiểm tra lỗi, sửa trực tiếp hoặc xác nhận duyệt trước khi xuất bản.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleBulkApproveAll}
                    className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-display font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Duyệt Tất Cả ({stagedUnits.length} Unit)</span>
                  </button>

                  <button
                    onClick={() => setShowConfirmPublishModal(true)}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>XUẤT BẢN CHÍNH THỨC</span>
                  </button>
                </div>
              </div>

              {/* Conflicts Summary Alert if any */}
              {conflicts.some((c) => c.conflictType !== 'none') && (
                <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Phát hiện Unit đã tồn tại trong chương trình học:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {conflicts
                      .filter((c) => c.conflictType !== 'none')
                      .map((c) => (
                        <span key={c.unitNumber} className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 text-[11px] font-bold">
                          Unit {c.unitNumber}: "{c.newTitle}" (Ghi đè: {c.conflictType === 'override_default' ? 'SGK mặc định' : 'Bản giáo viên trước'})
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Two Column Layout: Unit Selector on Left, Detailed Inspector on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Units Navigation List */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Danh Sách Unit Trong Tệp
                  </span>
                  <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                    {stagedUnits.map((u, idx) => {
                      const hasError = u.validationIssues.some((i) => i.level === 'error');
                      const hasWarning = u.validationIssues.some((i) => i.level === 'warning');
                      const isSelected = selectedUnitIdx === idx;

                      return (
                        <div
                          key={u.id || idx}
                          onClick={() => {
                            soundManager.playDing();
                            setSelectedUnitIdx(idx);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 font-display font-black text-xs flex items-center justify-center text-slate-800 dark:text-white">
                              {u.unitNumber}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                                {u.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {u.titleVi || 'Chưa có tên tiếng Việt'} · {u.vocabulary.length} từ vựng
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {hasError ? (
                              <span title="Có lỗi cần bổ sung" className="text-rose-500 font-bold text-xs">
                                🔴
                              </span>
                            ) : hasWarning ? (
                              <span title="Có cảnh báo nhỏ" className="text-amber-500 font-bold text-xs">
                                🟡
                              </span>
                            ) : (
                              <span title="Hợp lệ" className="text-emerald-500 font-bold text-xs">
                                🟢
                              </span>
                            )}

                            {u.status === 'approved' && (
                              <span className="px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-[9px] font-bold uppercase">
                                Đã Duyệt
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Detailed Unit Inspector & Quick Editor */}
                <div className="lg:col-span-8">
                  {currentViewingUnit && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                      
                      {/* Top Bar of Current Unit */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-display font-black text-xs">
                              UNIT {currentViewingUnit.unitNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              Lớp {currentViewingUnit.grade} · Âm: {currentViewingUnit.phonicsSound || 'Chưa rõ'}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                            {currentViewingUnit.title}
                          </h3>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {currentViewingUnit.titleVi}
                          </p>
                        </div>

                        {/* Status Badge & Approve Action */}
                        <div className="flex items-center gap-2">
                          {currentViewingUnit.status !== 'approved' ? (
                            <button
                              onClick={() => handleApproveUnit(currentViewingUnit.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Xác Nhận Duyệt Unit Này</span>
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold text-xs flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã Thẩm Định Hợp Lệ</span>
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteStagedUnit(selectedUnitIdx)}
                            className="p-1.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 cursor-pointer"
                            title="Xóa Unit này khỏi danh sách tải lên"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Validation Issues for this Unit */}
                      {currentViewingUnit.validationIssues.length > 0 && (
                        <div className="space-y-1.5">
                          {currentViewingUnit.validationIssues.map((issue) => (
                            <div
                              key={issue.id}
                              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                                issue.level === 'error'
                                  ? 'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200'
                                  : issue.level === 'warning'
                                  ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-amber-800 dark:text-amber-200'
                                  : 'bg-blue-50 dark:bg-blue-950/50 border border-blue-300 text-blue-800 dark:text-blue-200'
                              }`}
                            >
                              <span>{issue.level === 'error' ? '🔴' : issue.level === 'warning' ? '🟡' : 'ℹ️'}</span>
                              <span>{issue.message}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Vocabulary Words Table */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                            Từ Vựng Trọng Tâm ({currentViewingUnit.vocabulary.length} từ)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentViewingUnit.vocabulary.map((w, wIdx) => (
                            <div
                              key={w.id || wIdx}
                              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{w.imageEmoji || '✨'}</span>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-display font-black text-sm text-slate-900 dark:text-white">
                                      {w.word}
                                    </span>
                                    {w.phonetic && (
                                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                                        {w.phonetic}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => speakText(w.word)}
                                      className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer"
                                    >
                                      <Volume2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-500">{w.meaningVi}</p>
                                  {w.exampleSentence && (
                                    <p className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1">
                                      VD: "{w.exampleSentence}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sentence Patterns */}
                      <div className="space-y-2">
                        <span className="font-display font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                          Mẫu Câu Giao Tiếp
                        </span>
                        {currentViewingUnit.sentencePatterns.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Chưa có mẫu câu.</p>
                        ) : (
                          <div className="space-y-2">
                            {currentViewingUnit.sentencePatterns.map((p, pIdx) => (
                              <div
                                key={p.id || pIdx}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                      {p.pattern}
                                    </span>
                                    <button
                                      onClick={() => speakText(p.pattern)}
                                      className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer"
                                    >
                                      <Volume2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-500">{p.patternVi}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Phonics & Chant summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                            Ngữ Âm (Phonics)
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">
                            Chữ cái: <span className="text-amber-600 font-black">{currentViewingUnit.targetLetter || 'N/A'}</span> · Âm:{' '}
                            <span className="font-mono text-amber-600">{currentViewingUnit.phonicsSound || 'N/A'}</span>
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                            Hoạt Động Fun Time &amp; Chant
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                            {currentViewingUnit.funTime?.chantLyrics?.join(' ') || 'Đã tích hợp bài vè vui nhộn chuẩn SGK.'}
                          </p>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ACTIVE CURRICULUM INVENTORY */}
      {/* ============================================================== */}
      {activeTab === 'inventory' && (
        <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Danh Mục Chương Trình Đang Xuất Bản (Lớp {selectedGrade})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {activeUnitsForInventory.length} Units Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Đây là các bài học chính thức mà học sinh nhìn thấy khi học trên giao diện ứng dụng.
              </p>
            </div>

            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3.5 py-2 rounded-2xl border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi Phục Về Mặc Định SGK</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeUnitsForInventory.map((unit) => {
              const isCustom = storedUnits.some((s) => s.grade === selectedGrade && s.unitNumber === unit.unitNumber && s.status === 'published');

              return (
                <div
                  key={unit.unitNumber}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-display font-black text-xs">
                      UNIT {unit.unitNumber}
                    </span>

                    {isCustom ? (
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold">
                        ★ Đã Thẩm Định &amp; Xuất Bản
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold">
                        SGK Chuẩn (2018 GEC)
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                      {unit.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{unit.titleVi}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>
                      {unit.vocabulary.length} từ vựng · Âm {unit.phonicsSound || 'N/A'}
                    </span>

                    {isCustom && (
                      <button
                        onClick={() => handleUnpublishUnit(`cur-g${selectedGrade}-u${unit.unitNumber}`)}
                        className="text-xs text-amber-600 hover:underline font-bold cursor-pointer"
                      >
                        Thu hồi
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: IMPORT AUDIT & HISTORY */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Nhật Ký &amp; Lịch Sử Nhập Liệu Giáo Trình
              </h3>
              <p className="text-xs text-slate-500">
                Lưu vết toàn bộ các phiên nhập tệp từ trước đến nay, bảo vệ tính toàn vẹn dữ liệu.
              </p>
            </div>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có phiên nhập liệu nào được ghi nhận.
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((hist) => (
                <div
                  key={hist.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs uppercase">
                      {hist.fileType}
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {hist.fileName}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        {new Date(hist.importedAt).toLocaleString('vi-VN')} · {hist.totalItems} Unit · Lớp {hist.grade}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        hist.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hist.status === 'published' ? 'Đã Xuất Bản' : 'Bản Thẩm Định'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRM PUBLISH MODAL */}
      {/* ============================================================== */}
      {showConfirmPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="w-14 h-14 rounded-3xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Xác Nhận Xuất Bản Giáo Trình Chính Thức
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Toàn bộ {stagedUnits.length} Unit của <strong>Lớp {selectedGrade}</strong> sẽ được cập nhật trực tiếp vào ứng dụng học tập của học sinh.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
              <p className="font-bold">Quy tắc an toàn dữ liệu:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Tiến trình học tập và huy hiệu của học sinh được bảo toàn 100%.</li>
                <li>Bạn luôn có thể thu hồi hoặc hoàn tác về SGK mặc định bất kỳ lúc nào.</li>
                <li>Người xác nhận duyệt: <strong>{teacherName}</strong>.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmPublishModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmPublish}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-display font-black text-xs shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                Xác Nhận Xuất Bản Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRM RESET MODAL */}
      {/* ============================================================== */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="text-center space-y-1">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Khôi phục về mặc định SGK Lớp {selectedGrade}?
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ nội dung bài học ghi đè sẽ được gỡ bỏ và khôi phục 16 bài học SGK Global Success gốc.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleResetToDefault}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Xác Nhận Khôi Phục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
