import React, { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, X, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { GRADE_1_UNITS, GRADE_2_UNITS } from '../../data/curriculumData';
import { getActiveUnits } from '../../utils/curriculumManager';
import { speakText, soundManager } from '../../utils/audio';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGrade?: 1 | 2;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose,
  initialGrade = 1,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '1' | '2'>(String(initialGrade) as '1' | '2');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Aggregate all words across units (combining default and published units)
  const allWords = useMemo(() => {
    const list: Array<{
      id: string;
      word: string;
      meaningVi: string;
      phonetic: string;
      letter: string;
      imageEmoji: string;
      exampleSentence: string;
      audioText: string;
      grade: 1 | 2;
      unitNumber: number;
      unitTitle: string;
      unitTitleVi: string;
    }> = [];

    const units = [...getActiveUnits(1), ...getActiveUnits(2)];
    units.forEach((u) => {
      u.vocabulary.forEach((v) => {
        list.push({
          ...v,
          grade: u.grade,
          unitNumber: u.unitNumber,
          unitTitle: u.title,
          unitTitleVi: u.titleVi,
        });
      });
    });

    return list;
  }, []);

  // Filter words
  const filteredWords = useMemo(() => {
    return allWords.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.word.toLowerCase().includes(q) ||
        item.meaningVi.toLowerCase().includes(q) ||
        item.unitTitle.toLowerCase().includes(q) ||
        item.letter.toLowerCase() === q;

      const matchesGrade = selectedGrade === 'all' || String(item.grade) === selectedGrade;
      const matchesUnit = selectedUnit === 'all' || String(item.unitNumber) === selectedUnit;

      return matchesQuery && matchesGrade && matchesUnit;
    });
  }, [allWords, searchQuery, selectedGrade, selectedUnit]);

  if (!isOpen) return null;

  const handleSpeak = (text: string, wordId: string) => {
    setPlayingWord(wordId);
    speakText(text, 'en-US');
    setTimeout(() => setPlayingWord(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg text-2xl">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  Từ Điển Nhí Thông Minh Global Success
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold">
                  Lớp 1 &amp; Lớp 2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tra cứu từ vựng chuẩn SGK, phát âm bản xứ, hình ảnh sinh động và câu mẫu
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playDing();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập từ tiếng Anh hoặc nghĩa tiếng Việt (ví dụ: ball, quả bóng, cake, cat...)"
              className="w-full text-sm font-medium pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕ Xóa
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Grade Pills */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400 mr-1">Khối:</span>
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedGrade === 'all'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Tất cả ({allWords.length})
              </button>
              <button
                onClick={() => setSelectedGrade('1')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedGrade === '1'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Lớp 1
              </button>
              <button
                onClick={() => setSelectedGrade('2')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedGrade === '2'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Lớp 2
              </button>
            </div>

            {/* Quick Count Info */}
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Tìm thấy <strong className="text-amber-600 dark:text-amber-400">{filteredWords.length}</strong> từ vựng
            </span>
          </div>
        </div>

        {/* Word Grid List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {filteredWords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWords.map((item) => (
                <div
                  key={`${item.grade}-${item.id}`}
                  className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Emoji & Unit Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl p-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                        {item.imageEmoji || '🌟'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                        Lớp {item.grade} · U{item.unitNumber}
                      </span>
                    </div>

                    {/* Word & Phonetic */}
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display font-extrabold text-xl text-slate-900 dark:text-white capitalize">
                        {item.word}
                      </h4>
                      <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        {item.phonetic}
                      </span>
                    </div>

                    {/* Meaning */}
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">
                      {item.meaningVi}
                    </p>

                    {/* Example Sentence */}
                    {item.exampleSentence && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        "{item.exampleSentence}"
                      </p>
                    )}
                  </div>

                  {/* Audio Button */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {item.unitTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(item.audioText || item.word, item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                        playingWord === item.id
                          ? 'bg-amber-500 text-white scale-105'
                          : 'bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Phát âm</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <span className="text-5xl">🔍</span>
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Không tìm thấy từ vựng nào khớp với từ khóa "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs cursor-pointer"
              >
                Xem tất cả từ vựng
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>📚 Bám sát Chương trình GDPT 2018 - SGK Tiếng Anh 1 &amp; 2 Global Success</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
          >
            Đóng từ điển
          </button>
        </div>

      </div>
    </div>
  );
};
