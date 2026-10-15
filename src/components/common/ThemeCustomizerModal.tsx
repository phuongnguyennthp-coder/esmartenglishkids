import React, { useState } from 'react';
import {
  ClassroomThemeConfig,
  COLOR_PALETTES,
  loadClassroomTheme,
  saveClassroomTheme,
  WALLPAPER_PRESETS,
} from '../../utils/themeManager';
import {
  getAllCustomAudios,
  getSavedSpeechRate,
  playWordAudio,
  removeCustomAudio,
  setCustomAudio,
  setSavedSpeechRate,
  soundManager,
  speakText,
} from '../../utils/audio';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChanged?: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  onThemeChanged,
}) => {
  const [config, setConfig] = useState<ClassroomThemeConfig>(() => loadClassroomTheme());
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'palette' | 'audio'>('wallpaper');
  const [customAudios, setCustomAudios] = useState<Record<string, string>>(() => getAllCustomAudios());
  const [newAudioWord, setNewAudioWord] = useState<string>('');
  const [testWord, setTestWord] = useState<string>('Hello! Welcome to Global Success Grade 1.');

  if (!isOpen) return null;

  const handleSelectWallpaper = (wpId: any) => {
    soundManager.playDing();
    const updated: ClassroomThemeConfig = { ...config, wallpaperId: wpId };
    setConfig(updated);
    saveClassroomTheme(updated);
    if (onThemeChanged) onThemeChanged();
  };

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có kích thước dưới 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updated: ClassroomThemeConfig = {
        ...config,
        wallpaperId: 'custom',
        customWallpaperUrl: dataUrl,
      };
      setConfig(updated);
      saveClassroomTheme(updated);
      soundManager.playStar();
      if (onThemeChanged) onThemeChanged();
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPalette = (palId: any) => {
    soundManager.playDing();
    const updated: ClassroomThemeConfig = { ...config, paletteId: palId };
    setConfig(updated);
    saveClassroomTheme(updated);
    if (onThemeChanged) onThemeChanged();
  };

  const handleChangeSpeechRate = (rate: number) => {
    soundManager.playDing();
    setSavedSpeechRate(rate);
    const updated: ClassroomThemeConfig = { ...config, speechRate: rate };
    setConfig(updated);
    saveClassroomTheme(updated);
  };

  const handleChangeVoiceLang = (lang: 'en-GB' | 'en-US') => {
    soundManager.playDing();
    const updated: ClassroomThemeConfig = { ...config, voiceLang: lang };
    setConfig(updated);
    saveClassroomTheme(updated);
  };

  const handleUploadCustomAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newAudioWord.trim()) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File ghi âm tối đa 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomAudio(newAudioWord.trim(), dataUrl);
      setCustomAudios(getAllCustomAudios());
      setNewAudioWord('');
      soundManager.playVictory();
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCustomAudio = (word: string) => {
    removeCustomAudio(word);
    setCustomAudios(getAllCustomAudios());
    soundManager.playDing();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-400 dark:border-amber-600 max-h-[90vh] flex flex-col overflow-hidden space-y-5 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl font-black shadow-md">
              🎨
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Tùy Biến Giao Diện & Âm Thanh Lớp Học
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Cá nhân hóa trải nghiệm học tập vui nhộn cho học sinh Lớp 1 & Lớp 2
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('wallpaper')}
            className={`flex-1 py-2 rounded-xl text-xs font-display font-black transition-all cursor-pointer ${
              activeTab === 'wallpaper'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            🖼️ Hình Nền
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('palette')}
            className={`flex-1 py-2 rounded-xl text-xs font-display font-black transition-all cursor-pointer ${
              activeTab === 'palette'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            🌈 Màu Sắc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 rounded-xl text-xs font-display font-black transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            🔊 Âm Thanh & Giọng Đọc
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: WALLPAPER */}
          {/* ========================================================================= */}
          {activeTab === 'wallpaper' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Chọn hình nền lớp học hoạt hình có sẵn:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WALLPAPER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectWallpaper(p.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      config.wallpaperId === p.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-400/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.previewGradient} border border-slate-300 shadow-inner`} />
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {p.nameVi}
                      </span>
                    </div>
                    {config.wallpaperId === p.id && (
                      <span className="text-amber-600 font-bold text-xs">✓ Đang dùng</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Upload Custom Wallpaper */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 block">
                  📤 Tải ảnh nền riêng của lớp (JPG/PNG tối đa 3MB):
                </span>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs cursor-pointer transition-colors">
                  <span>Chọn ảnh từ máy tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomWallpaperUpload}
                    className="hidden"
                  />
                </label>
                {config.wallpaperId === 'custom' && config.customWallpaperUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={config.customWallpaperUrl}
                      alt="Custom Wallpaper"
                      className="w-16 h-10 object-cover rounded-lg border border-slate-300 shadow-xs"
                    />
                    <span className="text-xs text-emerald-600 font-bold">✓ Đang dùng ảnh tùy chỉnh của cô</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PALETTE */}
          {/* ========================================================================= */}
          {activeTab === 'palette' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Chọn gam màu chủ đạo phù hợp lứa tuổi học sinh:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => handleSelectPalette(pal.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      config.paletteId === pal.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-400/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: pal.primaryHex }}
                      />
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {pal.nameVi}
                      </span>
                    </div>
                    {config.paletteId === pal.id && (
                      <span className="text-amber-600 font-bold text-xs">✓ Đang dùng</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: AUDIO & SPEECH */}
          {/* ========================================================================= */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              
              {/* Voice Pacing */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">
                    ⏱️ Tốc độ phát âm (Khuyến nghị 0.75x - 0.85x cho Lớp 1 & 2):
                  </span>
                  <span className="font-bold text-xs text-amber-600">
                    {getSavedSpeechRate()}x
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Chậm (0.75x)', rate: 0.75 },
                    { label: 'Tiêu chuẩn (0.85x)', rate: 0.85 },
                    { label: 'Nhanh (1.0x)', rate: 1.0 },
                  ].map((item) => (
                    <button
                      key={item.rate}
                      type="button"
                      onClick={() => handleChangeSpeechRate(item.rate)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        getSavedSpeechRate() === item.rate
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Preference */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 block">
                  🇬🇧 Giọng đọc chuẩn ưu tiên:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChangeVoiceLang('en-GB')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      config.voiceLang === 'en-GB'
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>🇬🇧 Anh - Anh (en-GB)</span>
                    <span className="text-[10px] bg-white/40 px-1 rounded-md">Chuẩn SGK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeVoiceLang('en-US')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      config.voiceLang === 'en-US'
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>🇺🇸 Anh - Mỹ (en-US)</span>
                  </button>
                </div>
              </div>

              {/* Test Audio Button */}
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={testWord}
                  onChange={(e) => setTestWord(e.target.value)}
                  className="flex-1 text-xs bg-transparent border-none outline-hidden text-slate-800 dark:text-slate-200"
                  placeholder="Nhập câu tiếng Anh để thử giọng..."
                />
                <button
                  type="button"
                  onClick={() => speakText(testWord, { rate: getSavedSpeechRate(), lang: config.voiceLang })}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-500 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>🔊</span>
                  <span>Nghe thử</span>
                </button>
              </div>

              {/* Teacher Custom Audio Recordings */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <div>
                  <span className="font-display font-black text-xs text-indigo-900 dark:text-indigo-300 block">
                    🎙️ Thư viện ghi âm riêng của Giáo viên:
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tải lên file giọng đọc của chính cô giáo cho từng từ. Ứng dụng sẽ ưu tiên phát giọng thật của cô trước khi dùng TTS máy.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nhập từ vựng (vd: book, pencil)..."
                    value={newAudioWord}
                    onChange={(e) => setNewAudioWord(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs cursor-pointer text-center whitespace-nowrap">
                    <span>Chọn file MP3/WAV</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleUploadCustomAudio}
                      disabled={!newAudioWord.trim()}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* List of custom audios */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 pt-1">
                  {Object.entries(customAudios).map(([word, url]) => (
                    <div
                      key={word}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {word}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => playWordAudio(word)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px]"
                        >
                          🔊 Nghe
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomAudio(word)}
                          className="text-rose-500 hover:text-rose-700 font-bold text-[10px]"
                        >
                          ✕ Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                  {Object.keys(customAudios).length === 0 && (
                    <span className="text-[11px] text-slate-400 italic block">
                      Chưa có từ nào được tải file ghi âm riêng.
                    </span>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-black text-xs shadow-md transition-all cursor-pointer"
          >
            Đóng & Lưu Cài Đặt ✓
          </button>
        </div>

      </div>
    </div>
  );
};
