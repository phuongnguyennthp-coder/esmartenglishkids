import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Sparkles, Award, ArrowRight } from 'lucide-react';
import { DIGITAL_CITIZENSHIP_TOPICS } from '../../data/digitalCitizenshipData';
import { soundManager } from '../../utils/audio';

interface DigitalCitizenshipProps {
  onUnlockBadge: (badge: { id: string; title: string; description: string; icon: string }) => void;
  onReward: (stars: number, coins: number, xp: number) => void;
}

export const DigitalCitizenship: React.FC<DigitalCitizenshipProps> = ({
  onUnlockBadge,
  onReward,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number | null>(null);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);

  const currentTopic = DIGITAL_CITIZENSHIP_TOPICS[selectedTopicIndex] || DIGITAL_CITIZENSHIP_TOPICS[0];

  const handleSelectOption = (idx: number, isSafe: boolean) => {
    if (chosenOptionIndex !== null) return;
    setChosenOptionIndex(idx);

    if (isSafe) {
      soundManager.playVictory();
      if (!completedTopicIds.includes(currentTopic.id)) {
        const nextCompleted = [...completedTopicIds, currentTopic.id];
        setCompletedTopicIds(nextCompleted);
        onReward(3, 10, 30);

        if (nextCompleted.length === DIGITAL_CITIZENSHIP_TOPICS.length) {
          onUnlockBadge({
            id: 'b-citizen',
            title: 'Digital Citizen',
            description: 'Mastered all 6 2018 General Education Curriculum Digital Safety principles',
            icon: '🛡️',
          });
        }
      }
    } else {
      soundManager.playBuzzer();
    }
  };

  const handleNextTopic = () => {
    soundManager.playDing();
    setChosenOptionIndex(null);
    if (selectedTopicIndex + 1 < DIGITAL_CITIZENSHIP_TOPICS.length) {
      setSelectedTopicIndex((p) => p + 1);
    } else {
      setSelectedTopicIndex(0);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 3: COMMUNICATE</span>
            <span>·</span>
            <span>Module 8</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Digital Citizenship 🛡️
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            2018 General Education Curriculum Digital Literacy: Safety, Kindness, Copyright &amp; Responsible AI Use
          </p>
        </div>

        {/* Badge Progress Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>Completed: {completedTopicIds.length} / {DIGITAL_CITIZENSHIP_TOPICS.length}</span>
        </div>
      </div>

      {/* 6 Topic Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6">
        {DIGITAL_CITIZENSHIP_TOPICS.map((topic, idx) => {
          const isSelected = selectedTopicIndex === idx;
          const isDone = completedTopicIds.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => {
                soundManager.playDing();
                setSelectedTopicIndex(idx);
                setChosenOptionIndex(null);
              }}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm scale-102'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-white dark:bg-slate-800'
              }`}
            >
              <span className="text-2xl mb-1">{topic.iconEmoji}</span>
              <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 text-center line-clamp-1">
                {topic.title}
              </span>
              {isDone && (
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Done ✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Dilemma Interactive Card */}
      <div className="mt-8 max-w-2xl mx-auto">
        
        {/* Core Rule Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-2 border-indigo-200 dark:border-indigo-800 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{currentTopic.iconEmoji}</span>
            <div>
              <h3 className="font-display font-bold text-lg text-indigo-950 dark:text-indigo-100">
                {currentTopic.title} · <span className="text-sm font-normal text-slate-500">{currentTopic.titleVi}</span>
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
            "{currentTopic.coreRule}"
          </p>
          <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mt-1">
            🇻🇳 {currentTopic.coreRuleVi}
          </p>
        </div>

        {/* Story Context & Dilemma */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">
            Situation Scenario
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 italic">
            "{currentTopic.storyContext}"
          </p>

          <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">
            {currentTopic.dilemma.situation}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            🇻🇳 {currentTopic.dilemma.situationVi}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentTopic.dilemma.options.map((opt, idx) => {
              const isChosen = chosenOptionIndex === idx;
              const showSafe = isChosen && opt.isSafe;
              const showUnsafe = isChosen && !opt.isSafe;

              return (
                <div key={idx}>
                  <button
                    onClick={() => handleSelectOption(idx, opt.isSafe)}
                    disabled={chosenOptionIndex !== null}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-display font-bold text-sm transition-all cursor-pointer ${
                      showSafe
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : showUnsafe
                        ? 'bg-rose-50 border-rose-500 text-rose-900'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-400 hover:scale-101'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div>
                        <p>{opt.text}</p>
                        <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                          🇻🇳 {opt.textVi}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Feedback Card */}
                  {isChosen && (
                    <div
                      className={`mt-2 p-3.5 rounded-xl text-xs font-medium animate-fade-in ${
                        opt.isSafe
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {opt.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Tip Box */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center gap-2">
          <span>💡</span>
          <span>{currentTopic.smartTip}</span>
        </div>

        {/* Next Topic Button */}
        {chosenOptionIndex !== null && (
          <div className="text-center mt-6">
            <button
              onClick={handleNextTopic}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Explore Next Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
