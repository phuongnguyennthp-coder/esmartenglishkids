import React from 'react';
import { Sparkles, BookOpen, Star, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface GradeSelectorProps {
  currentGrade: 1 | 2;
  onSelectGrade: (grade: 1 | 2) => void;
  onClose?: () => void;
  isMandatorySelection?: boolean;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  currentGrade,
  onSelectGrade,
  onClose,
  isMandatorySelection = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-300 dark:border-amber-700/60 overflow-hidden">
        
        {/* Background playful glow circles */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-orange-400/20 blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>2018 General Education Curriculum · Global Success English</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Choose Your Learning Adventure! 🎒
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Select your grade level to enter your personalized English learning path.
          </p>
        </div>

        {/* Grade Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* GRADE 1 CARD */}
          <div
            onClick={() => {
              soundManager.playVictory();
              onSelectGrade(1);
            }}
            className={`group relative rounded-3xl p-6 sm:p-8 cursor-pointer transition-all transform hover:-translate-y-1.5 border-4 ${
              currentGrade === 1
                ? 'border-emerald-500 bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 shadow-xl shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-emerald-400'
            }`}
          >
            {/* Mascot & Icon Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-5xl group-hover:scale-110 transition-transform">🎈</span>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-xs">
                GRADE 1
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
              Global Success Grade 1
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Perfect for young beginners starting their English journey.
            </p>

            {/* Highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-emerald-600">✓</span>
                <span>All 16 Units: Letters B, C, A, D, I, E, G, P, O, Z, U, L, N, T, F, H</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-emerald-600">✓</span>
                <span>Playground, Bedroom, Market, Zoo, & Canteen themes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-emerald-600">✓</span>
                <span>Classes 1/1 & 1/2 guided by Ms Thanh Thảo</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-base shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span>Start Grade 1 Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* GRADE 2 CARD */}
          <div
            onClick={() => {
              soundManager.playVictory();
              onSelectGrade(2);
            }}
            className={`group relative rounded-3xl p-6 sm:p-8 cursor-pointer transition-all transform hover:-translate-y-1.5 border-4 ${
              currentGrade === 2
                ? 'border-indigo-500 bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 shadow-xl shadow-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-400'
            }`}
          >
            {/* Mascot & Icon Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-5xl group-hover:scale-110 transition-transform">🚀</span>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-indigo-500 text-white shadow-xs">
                GRADE 2
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
              Global Success Grade 2
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Expanding communicative confidence and creative speaking.
            </p>

            {/* Highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-indigo-600">✓</span>
                <span>All 16 Units: Letters M, K, S, H, T, F, J, V, Y, W, R, C, N, P, Sh, St</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-indigo-600">✓</span>
                <span>Birthday, Seaside, Farm, Village, Cafe, & Campsite</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-indigo-600">✓</span>
                <span>Classes 2/3 & 2/4 guided by Ms Hồng Phượng</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-base shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span>Start Grade 2 Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Close Button if optional */}
        {!isMandatorySelection && onClose && (
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium cursor-pointer"
            >
              Continue with current selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
