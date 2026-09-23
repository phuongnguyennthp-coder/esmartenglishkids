import React, { useState } from 'react';
import { KeyRound, Sparkles, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { GeminiModelId } from '../../types/user';
import { soundManager } from '../../utils/audio';
import { testGeminiApiKey } from '../../services/geminiService';

interface ApiKeyModalProps {
  apiKey: string;
  selectedModel: GeminiModelId;
  onSave: (apiKey: string, model: GeminiModelId) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  apiKey,
  selectedModel,
  onSave,
  onClose,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [modelInput, setModelInput] = useState<GeminiModelId>(selectedModel);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const modelOptions: { id: GeminiModelId; label: string; badge: string; desc: string }[] = [
    {
      id: 'gemini-3-flash-preview',
      label: 'Gemini 3 Flash Preview',
      badge: 'Mặc định (Khuyên dùng)',
      desc: 'Tốc độ phản hồi tức thì, tối ưu nhất cho học sinh chấm phát âm và hội thoại.',
    },
    {
      id: 'gemini-3-pro-preview',
      label: 'Gemini 3 Pro Preview',
      badge: 'Chuyên sâu',
      desc: 'Mô hình suy luận mạnh mẽ, viết thư khen và phân tích sư phạm chi tiết.',
    },
    {
      id: 'gemini-2.5-flash',
      label: 'Gemini 2.5 Flash',
      badge: 'Ổn định',
      desc: 'Mô hình dự phòng ổn định cao, tiết kiệm tài nguyên và độ trễ thấp.',
    },
  ];

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput.trim();

    if (!cleanKey) {
      soundManager.playBuzzer();
      setStatusMessage('Vui lòng nhập API key của bạn!');
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Đang kiểm tra kết nối Google AI Studio...');
    soundManager.playDing();

    try {
      const result = await testGeminiApiKey(cleanKey, modelInput);

      if (!result.success) {
        setTestStatus('error');
        setStatusMessage(`Kiểm tra thất bại. Nguyên văn lỗi: ${result.error}`);
        soundManager.playBuzzer();
        return;
      }

      setTestStatus('success');
      setStatusMessage('Kết nối Gemini AI thành công! Đã lưu cài đặt.');
      soundManager.playVictory();

      setTimeout(() => {
        onSave(cleanKey, modelInput);
        onClose();
      }, 1000);
    } catch (err: any) {
      setTestStatus('error');
      setStatusMessage(`Lỗi xác thực: ${err?.message || 'Không thể kết nối'}`);
      soundManager.playBuzzer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Thiết Lập Model &amp; Gemini API Key
              </h2>
              <p className="text-xs text-slate-500">
                Tuân thủ quy chuẩn AI Instructions · Tự động fallback khi lỗi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner with link to aistudio */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Hướng dẫn lấy Google Gemini API Key miễn phí:</span>
            </span>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Mở Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            1. Đăng nhập vào <strong className="text-indigo-600">aistudio.google.com/api-keys</strong> bằng tài khoản Google.<br />
            2. Bấm <strong>Create API key</strong>, sao chép mã khóa và dán vào ô bên dưới.<br />
            3. Key được lưu an toàn trực tiếp trên trình duyệt của bạn (Local Storage) để chạy ứng dụng.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave} className="space-y-5">
          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Khóa API Key của bạn (Bắt buộc để sử dụng AI):
            </label>
            <input
              type="password"
              required
              placeholder="Dán API key bắt đầu bằng AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full text-xs font-mono p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Model Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Chọn Model AI Ưu Tiên (Thứ tự hiển thị theo quy chuẩn):
            </label>
            <div className="space-y-2.5">
              {modelOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    soundManager.playDing();
                    setModelInput(opt.id);
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    modelInput === opt.id
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-amber-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs text-slate-900 dark:text-white">
                        {opt.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        opt.id === 'gemini-3-flash-preview'
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {opt.desc}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="modelSelection"
                    checked={modelInput === opt.id}
                    onChange={() => setModelInput(opt.id)}
                    className="mt-1 text-amber-500 focus:ring-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fallback & Rate limit note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cơ chế dự phòng thông minh (Auto-Fallback):</span>
            </span>
            <p>
              Nếu model được chọn gặp lỗi hoặc cạn hạn mức (429 Resource Exhausted), hệ thống sẽ tự động thử lại với các model tiếp theo: <em>gemini-3-flash-preview → gemini-3-pro-preview → gemini-2.5-flash</em>.
            </p>
          </div>

          {/* Status feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : testStatus === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={testStatus === 'testing'}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              {testStatus === 'testing' ? 'Đang kiểm tra...' : 'Lưu Cài Đặt API Key'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
