import React, { useState } from 'react';
import { Sparkles, Star, Trophy, Award, BookOpen, Volume2, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { GradeLevel, Unit, SpeakingAttempt, ReflectionRecord } from '../../types/curriculum';
import { StudentRecord, PraiseLetter, Certificate } from '../../types/user';
import { GRADE_1_UNITS, GRADE_2_UNITS } from '../../data/curriculumData';
import { Mascot } from '../common/Mascot';
import { VocabularyBuilder } from '../learn/VocabularyBuilder';
import { SentencePatterns } from '../learn/SentencePatterns';
import { PhonicsLab } from '../learn/PhonicsLab';
import { ListeningPractice } from '../practice/ListeningPractice';
import { AISpeakingCoach } from '../practice/AISpeakingCoach';
import { InteractiveGames } from '../practice/InteractiveGames';
import { AIStoryWorld } from '../communicate/AIStoryWorld';
import { DigitalCitizenship } from '../communicate/DigitalCitizenship';
import { UnitAssessment } from '../reflect/UnitAssessment';
import { StudentSuccessCenter } from '../grow/StudentSuccessCenter';
import { FunTimeHub } from '../funtime/FunTimeHub';
import { soundManager } from '../../utils/audio';

interface StudentDashboardProps {
  currentGrade: GradeLevel;
  student: StudentRecord;
  onReward: (stars: number, coins: number, xp: number) => void;
  onCompleteUnit: (unitNumber: number) => void;
  onRecordAttempt: (attempt: SpeakingAttempt) => void;
  onSaveReflection: (reflection: ReflectionRecord) => void;
  onGeneratePraiseLetter: (letter: PraiseLetter) => void;
  onGenerateCertificate: (cert: Certificate) => void;
  onUnlockBadge: (badge: { id: string; title: string; description: string; icon: string }) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentGrade,
  student,
  onReward,
  onCompleteUnit,
  onRecordAttempt,
  onSaveReflection,
  onGeneratePraiseLetter,
  onGenerateCertificate,
  onUnlockBadge,
}) => {
  // STRICT GRADE SEPARATION:
  // If currentGrade === 1, strictly use GRADE_1_UNITS
  // If currentGrade === 2, strictly use GRADE_2_UNITS
  const units = currentGrade === 1 ? GRADE_1_UNITS : GRADE_2_UNITS;

  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [activeModule, setActiveModule] = useState<number>(1); // 1 to 11
  const [showFunTimeHub, setShowFunTimeHub] = useState(false);

  const currentUnit = units[selectedUnitIndex] || units[0];

  const handleSelectModule = (modNumber: number) => {
    soundManager.playDing();
    if (modNumber === 11) {
      setShowFunTimeHub(true);
    } else {
      setShowFunTimeHub(false);
      setActiveModule(modNumber);
    }
  };

  const handleSelectUnit = (idx: number) => {
    soundManager.playDing();
    setSelectedUnitIndex(idx);
    setShowFunTimeHub(false);
    setActiveModule(1); // Reset to module 1 on unit change
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner: Child-Friendly Welcome & Mascot */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-slate-900 shadow-xl overflow-hidden border-4 border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider text-amber-950 mb-2">
              <span>🎈 Global Success Grade {currentGrade}</span>
              <span>·</span>
              <span>2018 General Education Curriculum</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-amber-950 tracking-tight">
              Hello, {student.fullName}! 🌟
            </h1>
            <p className="text-amber-950/90 text-sm sm:text-base font-medium mt-1 max-w-xl">
              Are you ready to explore Unit {currentUnit.unitNumber}: {currentUnit.title} with Smarty and Bimi today?
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-md border border-amber-200">
            <div className="text-center px-3">
              <span className="text-xs text-slate-500 font-bold block">Stars</span>
              <span className="font-display font-bold text-xl text-amber-600">⭐ {student.stars}</span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-3">
              <span className="text-xs text-slate-500 font-bold block">Coins</span>
              <span className="font-display font-bold text-xl text-yellow-600">🪙 {student.coins}</span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-3">
              <span className="text-xs text-slate-500 font-bold block">Level</span>
              <span className="font-display font-bold text-xl text-indigo-600">⚡ {student.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Animated Message */}
      <Mascot
        type={activeModule >= 7 ? 'bimi' : 'smarty'}
        message={
          showFunTimeHub
            ? `Welcome to Fun Time! Let's spin the Lucky Wheel, chant together, and race on the board game!`
            : activeModule === 1
            ? `Let's build vocabulary for Unit ${currentUnit.unitNumber}! Tap the flashcards to listen carefully!`
            : activeModule === 3
            ? `Phonics power! Let's master the /${currentUnit.phonics.sound}/ sound together!`
            : activeModule === 5
            ? `Ready to talk? I am your AI Speaking Coach! Let's roleplay together!`
            : activeModule === 8
            ? `Remember: Great digital citizens protect passwords and are kind online!`
            : `Keep going! Every word you speak builds your confidence!`
        }
      />

      {/* Fun Time Fast Access Banner */}
      <div
        onClick={() => {
          soundManager.playDing();
          setShowFunTimeHub(!showFunTimeHub);
        }}
        className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-lg cursor-pointer transform hover:scale-[1.01] transition-all border-2 border-pink-300 dark:border-pink-800"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0 animate-bounce">
            🎡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base sm:text-lg tracking-tight">
                🎉 SÂN CHƠI FUN TIME - GLOBAL SUCCESS LỚP {currentGrade}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-amber-950 font-black text-[10px]">
                MỚI NHẤT
              </span>
            </div>
            <p className="text-xs text-white/90 font-medium line-clamp-1 sm:line-clamp-none">
              Vòng quay may mắn ngữ âm · Hát vè Karaoke · Đua xúc xắc 3D · Mở rương phần thưởng
            </p>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-white text-indigo-700 font-display font-black text-xs shadow-md cursor-pointer"
        >
          {showFunTimeHub ? 'Quay lại bài học ◀' : 'VÀO CHƠI NGAY! 🚀'}
        </button>
      </div>

      {/* Unit Selector Strip (Grade 1 or Grade 2 Units) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Grade {currentGrade} Learning Journey
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
              16 Official Units
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active: Unit {currentUnit.unitNumber} ({currentUnit.title})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {units.map((u, idx) => {
            const isSelected = selectedUnitIndex === idx;
            const isCompleted = student.completedUnits.includes(u.unitNumber);

            return (
              <button
                key={u.id}
                onClick={() => handleSelectUnit(idx)}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md scale-102 ring-2 ring-amber-400/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{u.themeEmoji || u.vocabulary[0]?.imageEmoji || '🎈'}</span>
                  {isCompleted ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                      U{u.unitNumber}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                  {u.title}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Letter {u.phonics.letter}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5-Stage Learning Model Step Navigation */}
      {/* LEARN (1,2,3) -> PRACTICE (4,5,6) -> COMMUNICATE (7,8) -> REFLECT (9) -> GROW (10) */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            5-Stage Learning Model: LEARN → PRACTICE → COMMUNICATE → REFLECT → GROW
          </span>
          <span className="text-xs font-bold text-amber-600">
            Active: Module {activeModule} of 10
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {/* 1. Vocab */}
          <button
            onClick={() => handleSelectModule(1)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 1
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">📚</span>
            <span className="text-[10px] font-bold block truncate">1. Vocab</span>
          </button>

          {/* 2. Sentences */}
          <button
            onClick={() => handleSelectModule(2)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 2
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">💬</span>
            <span className="text-[10px] font-bold block truncate">2. Patterns</span>
          </button>

          {/* 3. Phonics */}
          <button
            onClick={() => handleSelectModule(3)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 3
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🔬</span>
            <span className="text-[10px] font-bold block truncate">3. Phonics</span>
          </button>

          {/* 4. Listening */}
          <button
            onClick={() => handleSelectModule(4)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 4
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🎧</span>
            <span className="text-[10px] font-bold block truncate">4. Listen</span>
          </button>

          {/* 5. Speaking Coach */}
          <button
            onClick={() => handleSelectModule(5)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 5
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🎙️</span>
            <span className="text-[10px] font-bold block truncate">5. Speak AI</span>
          </button>

          {/* 6. Games */}
          <button
            onClick={() => handleSelectModule(6)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 6
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🎮</span>
            <span className="text-[10px] font-bold block truncate">6. Games</span>
          </button>

          {/* 7. Story World */}
          <button
            onClick={() => handleSelectModule(7)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 7
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">📖</span>
            <span className="text-[10px] font-bold block truncate">7. Story</span>
          </button>

          {/* 8. Digital Citizen */}
          <button
            onClick={() => handleSelectModule(8)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 8
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🛡️</span>
            <span className="text-[10px] font-bold block truncate">8. Citizen</span>
          </button>

          {/* 9. Unit Assessment */}
          <button
            onClick={() => handleSelectModule(9)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              activeModule === 9
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🌟</span>
            <span className="text-[10px] font-bold block truncate">9. Reflect</span>
          </button>

          {/* 10. Success Center */}
          <button
            onClick={() => handleSelectModule(10)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              !showFunTimeHub && activeModule === 10
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <span className="text-lg block">🚀</span>
            <span className="text-[10px] font-bold block truncate">10. Grow</span>
          </button>

          {/* 11. Fun Time Milestone & Hub */}
          <button
            onClick={() => handleSelectModule(11)}
            className={`p-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
              showFunTimeHub
                ? 'border-pink-500 bg-pink-500 text-white shadow-xs'
                : 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:border-pink-400'
            }`}
          >
            <span className="text-lg block">🎡</span>
            <span className="text-[10px] font-bold block truncate">11. Fun Time</span>
          </button>
        </div>
      </div>

      {/* Render the Active Module Component or Fun Time Hub */}
      <div className="transition-all">
        {showFunTimeHub ? (
          <FunTimeHub
            currentGrade={currentGrade}
            activeUnit={currentUnit}
            onReward={onReward}
            onUnlockBadge={onUnlockBadge}
          />
        ) : (
          <>
            {activeModule === 1 && (
              <VocabularyBuilder
                unit={currentUnit}
                onActivityComplete={(xp) => onReward(1, 2, xp)}
              />
            )}

            {activeModule === 2 && (
              <SentencePatterns
                unit={currentUnit}
                onActivityComplete={(xp) => onReward(2, 4, xp)}
              />
            )}

            {activeModule === 3 && (
              <PhonicsLab
                unit={currentUnit}
                onActivityComplete={(xp) => onReward(2, 5, xp)}
                onRecordAttempt={onRecordAttempt}
              />
            )}

            {activeModule === 4 && (
              <ListeningPractice
                unit={currentUnit}
                onActivityComplete={(xp) => onReward(2, 4, xp)}
              />
            )}

            {activeModule === 5 && (
              <AISpeakingCoach
                unit={currentUnit}
                speakingHistory={student.speakingHistory || []}
                onRecordAttempt={onRecordAttempt}
                onActivityComplete={(xp) => onReward(3, 8, xp)}
              />
            )}

            {activeModule === 6 && (
              <InteractiveGames
                unit={currentUnit}
                onReward={onReward}
              />
            )}

            {activeModule === 7 && (
              <AIStoryWorld
                unit={currentUnit}
                onActivityComplete={(xp) => onReward(3, 10, xp)}
              />
            )}

            {activeModule === 8 && (
              <DigitalCitizenship
                onUnlockBadge={onUnlockBadge}
                onReward={onReward}
              />
            )}

            {activeModule === 9 && (
              <UnitAssessment
                unit={currentUnit}
                studentName={student.fullName}
                onSaveReflection={onSaveReflection}
                onCompleteUnit={() => onCompleteUnit(currentUnit.unitNumber)}
                onReward={onReward}
              />
            )}

            {activeModule === 10 && (
              <StudentSuccessCenter
                student={student}
                onGeneratePraiseLetter={onGeneratePraiseLetter}
                onGenerateCertificate={onGenerateCertificate}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
};
