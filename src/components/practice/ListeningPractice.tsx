import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { Unit } from '../../types/curriculum';
import { speakText, soundManager } from '../../utils/audio';

interface ListeningPracticeProps {
  unit: Unit;
  onActivityComplete: (xpGain: number) => void;
}

export const ListeningPractice: React.FC<ListeningPracticeProps> = ({
  unit,
  onActivityComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Generate 4 dynamic questions per unit (covering Choose, Match, Number, Point)
  const questions = [
    {
      id: 'q1',
      type: 'Listen and Choose',
      audioPrompt: unit.vocabulary[0]?.word || 'ball',
      questionPrompt: `Listen and choose the word you hear`,
      options: unit.vocabulary.slice(0, 3).map((w, idx) => ({
        id: w.id,
        text: w.word,
        emoji: w.imageEmoji,
        isCorrect: idx === 0,
      })),
    },
    {
      id: 'q2',
      type: 'Listen and Point',
      audioPrompt: unit.vocabulary[1]?.word || 'book',
      questionPrompt: `Listen and point to the correct picture`,
      options: [
        { id: 'opt-b1', text: unit.vocabulary[1]?.word || 'book', emoji: unit.vocabulary[1]?.imageEmoji || '📚', isCorrect: true },
        { id: 'opt-b2', text: unit.vocabulary[2]?.word || 'bike', emoji: unit.vocabulary[2]?.imageEmoji || '🚲', isCorrect: false },
      ],
    },
    {
      id: 'q3',
      type: 'Listen and Match',
      audioPrompt: unit.sentencePatterns[0]?.dialogue[0]?.textEn || 'Hello',
      questionPrompt: `Listen to the sentence and select the speaker`,
      options: [
        { id: 'opt-s1', text: unit.sentencePatterns[0]?.dialogue[0]?.speaker || 'Smarty', emoji: '🦉', isCorrect: true },
        { id: 'opt-s2', text: 'Bimi', emoji: '🐻', isCorrect: false },
      ],
    },
    {
      id: 'q4',
      type: 'Listen and Number',
      audioPrompt: `Number one: ${unit.vocabulary[0]?.word || 'ball'}. Number two: ${unit.vocabulary[1]?.word || 'book'}.`,
      questionPrompt: `Which item was Number One?`,
      options: [
        { id: 'opt-n1', text: unit.vocabulary[0]?.word || 'ball', emoji: unit.vocabulary[0]?.imageEmoji || '⚽', isCorrect: true },
        { id: 'opt-n2', text: unit.vocabulary[1]?.word || 'book', emoji: unit.vocabulary[1]?.imageEmoji || '📚', isCorrect: false },
      ],
    },
  ];

  const currentQ = questions[currentQuestionIndex % questions.length];

  const handlePlayAudio = () => {
    soundManager.playDing();
    speakText(currentQ.audioPrompt, 0.8);
  };

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (selectedOptionId) return;
    setSelectedOptionId(optId);

    if (isCorrect) {
      soundManager.playVictory();
      setScore((prev) => prev + 1);
      setFeedback({ isCorrect: true, text: 'Awesome! Your listening ear is sharp! 🌟' });
      onActivityComplete(20);
    } else {
      soundManager.playBuzzer();
      setFeedback({ isCorrect: false, text: 'Nice try! Listen once more and see.' });
    }

    setAnsweredCount((prev) => prev + 1);

    setTimeout(() => {
      setSelectedOptionId(null);
      setFeedback(null);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1800);
  };

  const handleRestart = () => {
    soundManager.playDing();
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredCount(0);
    setSelectedOptionId(null);
    setFeedback(null);
  };

  const listeningAccuracy = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 2: PRACTICE</span>
            <span>·</span>
            <span>Module 4</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Listening Practice 🎧
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Train your ears with native speaker pronunciation &amp; interactive challenges
          </p>
        </div>

        {/* Listening Accuracy Counter */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
          <span>Listening Accuracy:</span>
          <span className="font-mono text-sm">{listeningAccuracy}%</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="mt-8 max-w-xl mx-auto flex flex-col items-center text-center">
        
        <span className="px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-bold mb-3">
          Question {currentQuestionIndex + 1} of {questions.length} · {currentQ.type}
        </span>

        <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
          {currentQ.questionPrompt}
        </h3>

        {/* Audio Replay Button */}
        <button
          onClick={handlePlayAudio}
          className="my-6 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-display font-bold text-base shadow-lg shadow-amber-500/25 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
        >
          <Volume2 className="w-6 h-6 animate-pulse" />
          <span>Tap to Hear Audio</span>
        </button>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const showCorrect = selectedOptionId && opt.isCorrect;
            const showWrong = isSelected && !opt.isCorrect;

            return (
              <button
                key={opt.id}
                disabled={!!selectedOptionId}
                onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  showCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 scale-105 shadow-md'
                    : showWrong
                    ? 'bg-rose-100 border-rose-500 text-rose-900'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:scale-103'
                }`}
              >
                <span className="text-5xl mb-2">{opt.emoji}</span>
                <span className="font-display font-bold text-base text-slate-800 dark:text-slate-100 capitalize">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Banner */}
        {feedback && (
          <div
            className={`mt-6 p-4 rounded-2xl w-full font-bold text-sm animate-fade-in ${
              feedback.isCorrect
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Completion State */}
        {answeredCount >= questions.length && (
          <div className="mt-8 p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-center w-full animate-fade-in">
            <span className="text-4xl">🏆</span>
            <h4 className="font-display font-bold text-xl text-amber-900 dark:text-amber-100 mt-2">
              Listening Practice Complete!
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              You scored {score} out of {questions.length} ({listeningAccuracy}%)
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 mx-auto cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
