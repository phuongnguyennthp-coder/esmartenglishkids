import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Star, Award, Heart, MessageSquare, ChevronRight } from 'lucide-react';
import { Unit, ReflectionRecord } from '../../types/curriculum';
import { soundManager } from '../../utils/audio';

interface UnitAssessmentProps {
  unit: Unit;
  studentName: string;
  onSaveReflection: (reflection: ReflectionRecord) => void;
  onCompleteUnit: () => void;
  onReward: (stars: number, coins: number, xp: number) => void;
}

export const UnitAssessment: React.FC<UnitAssessmentProps> = ({
  unit,
  studentName,
  onSaveReflection,
  onCompleteUnit,
  onReward,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<'well' | 'practice' | 'help'>('well');
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 5-Point Evaluation scores (demonstrated based on student's learning in this unit)
  const [competencyScores, setCompetencyScores] = useState({
    vocabulary: 95,
    sentencePatterns: 90,
    phonics: 94,
    listening: 92,
    speaking: 88,
  });

  const averageScore = Math.round(
    (competencyScores.vocabulary +
      competencyScores.sentencePatterns +
      competencyScores.phonics +
      competencyScores.listening +
      competencyScores.speaking) / 5
  );

  const handleSaveAndFinish = () => {
    soundManager.playVictory();

    const reflection: ReflectionRecord = {
      date: new Date().toISOString().split('T')[0],
      unitNumber: unit.unitNumber,
      grade: unit.grade,
      feeling: selectedFeeling,
      note: reflectionNote || 'I enjoyed learning English words with Smarty and Bimi!',
    };

    onSaveReflection(reflection);
    onCompleteUnit();
    onReward(5, 20, 50);
    setIsSaved(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 4: REFLECT</span>
            <span>·</span>
            <span>Module 9</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Unit Assessment &amp; Self-Reflection 🌟
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            5-Point Competency Evaluation &amp; Personal Reflection for Unit {unit.unitNumber}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>Overall Competency: {averageScore}%</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5-Point Evaluation Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
            5-Point Competency Evaluation (2018 General Education Curriculum)
          </h3>

          {/* 1. Vocabulary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">1. Vocabulary Mastery</span>
              <span className="text-emerald-600">{competencyScores.vocabulary}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${competencyScores.vocabulary}%` }} />
            </div>
          </div>

          {/* 2. Sentence Patterns */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">2. Sentence Structures &amp; Patterns</span>
              <span className="text-indigo-600">{competencyScores.sentencePatterns}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${competencyScores.sentencePatterns}%` }} />
            </div>
          </div>

          {/* 3. Phonics */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">3. Phonics &amp; Sound Blending</span>
              <span className="text-amber-600">{competencyScores.phonics}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${competencyScores.phonics}%` }} />
            </div>
          </div>

          {/* 4. Listening */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">4. Listening Comprehension</span>
              <span className="text-teal-600">{competencyScores.listening}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${competencyScores.listening}%` }} />
            </div>
          </div>

          {/* 5. Speaking */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">5. Spoken Communicative Production</span>
              <span className="text-rose-600">{competencyScores.speaking}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${competencyScores.speaking}%` }} />
            </div>
          </div>

          {/* AI Personalized Feedback Note */}
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Personalized AI Teacher Feedback</span>
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
              "Great job, {studentName}! You can identify words in {unit.title} accurately. Your pronunciation of initial sound {unit.phonics.sound} is very sharp. Keep practising your daily speaking question: '{unit.speakingPrompts[0]?.aiPrompt}'!"
            </p>
          </div>
        </div>

        {/* Right Self-Reflection Box */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-amber-300 dark:border-amber-700/60 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
              How did you feel about this unit? 😊
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Self-reflection helps you become an independent learner!
            </p>

            {/* 3 Emotion Feeling Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => {
                  soundManager.playDing();
                  setSelectedFeeling('well');
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  selectedFeeling === 'well'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-3xl">😊</span>
                <div className="text-left">
                  <p className="font-display font-bold text-sm">"I can do it well!"</p>
                  <p className="text-[11px] text-slate-500">I felt confident and enjoyed it!</p>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playDing();
                  setSelectedFeeling('practice');
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  selectedFeeling === 'practice'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-3xl">😐</span>
                <div className="text-left">
                  <p className="font-display font-bold text-sm">"I need more practice."</p>
                  <p className="text-[11px] text-slate-500">I want to repeat the games!</p>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playDing();
                  setSelectedFeeling('help');
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  selectedFeeling === 'help'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-3xl">😢</span>
                <div className="text-left">
                  <p className="font-display font-bold text-sm">"I need help."</p>
                  <p className="text-[11px] text-slate-500">I will ask teacher or parents!</p>
                </div>
              </button>
            </div>

            {/* Note input */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Share what you liked most:
              </label>
              <input
                type="text"
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="e.g. I liked talking with Smarty the Owl!"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSaveAndFinish}
            disabled={isSaved}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-bold text-base shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102 disabled:opacity-60"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Unit Completed &amp; Saved!</span>
              </>
            ) : (
              <>
                <span>Complete Unit &amp; Earn Stars</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
