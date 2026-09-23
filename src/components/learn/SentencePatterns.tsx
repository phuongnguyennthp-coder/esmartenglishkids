import React, { useState } from 'react';
import { Volume2, Play, CheckCircle2, RotateCcw, MessageSquare, Mic } from 'lucide-react';
import { SentencePattern, Unit } from '../../types/curriculum';
import { speakText, soundManager, createSpeechRecognizer } from '../../utils/audio';

interface SentencePatternsProps {
  unit: Unit;
  onActivityComplete: (xpGain: number) => void;
}

export const SentencePatterns: React.FC<SentencePatternsProps> = ({
  unit,
  onActivityComplete,
}) => {
  const currentPattern = unit.sentencePatterns[0];

  const [activeTab, setActiveTab] = useState<'dialogue' | 'build' | 'roleplay'>('dialogue');

  // Build Sentences State
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...currentPattern.scrambleWords].sort(() => Math.random() - 0.5));
  const [buildFeedback, setBuildFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Roleplay State
  const [isRecordingRoleplay, setIsRecordingRoleplay] = useState(false);
  const [roleplayPassed, setRoleplayPassed] = useState(false);

  const handleSpeak = (text: string) => {
    soundManager.playDing();
    speakText(text, 0.85);
  };

  // Sentence Reorder logic
  const handlePickWord = (word: string, index: number) => {
    soundManager.playDing();
    setSelectedWords([...selectedWords, word]);
    const updated = [...availableWords];
    updated.splice(index, 1);
    setAvailableWords(updated);
  };

  const handleRemoveWord = (word: string, index: number) => {
    soundManager.playDing();
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
    setAvailableWords([...availableWords, word]);
  };

  const handleResetBuild = () => {
    soundManager.playDing();
    setSelectedWords([]);
    setAvailableWords([...currentPattern.scrambleWords].sort(() => Math.random() - 0.5));
    setBuildFeedback(null);
  };

  const handleCheckBuild = () => {
    const isCorrect = selectedWords.join(' ') === currentPattern.correctOrder.join(' ');
    if (isCorrect) {
      soundManager.playVictory();
      setBuildFeedback({ isCorrect: true, message: 'Superb! You built the sentence perfectly! 🌟' });
      onActivityComplete(25);
    } else {
      soundManager.playBuzzer();
      setBuildFeedback({ isCorrect: false, message: 'Not quite! Check the word order and try again.' });
    }
  };

  // Roleplay Speaking
  const handleStartRoleplayRecord = () => {
    setIsRecordingRoleplay(true);
    soundManager.playDing();

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsRecordingRoleplay(false);
        soundManager.playVictory();
        setRoleplayPassed(true);
        onActivityComplete(30);
      },
      () => {
        // Fallback simulation
        setTimeout(() => {
          setIsRecordingRoleplay(false);
          soundManager.playVictory();
          setRoleplayPassed(true);
          onActivityComplete(30);
        }, 1500);
      }
    );

    if (!recognizer) {
      setTimeout(() => {
        setIsRecordingRoleplay(false);
        soundManager.playVictory();
        setRoleplayPassed(true);
        onActivityComplete(30);
      }, 1500);
      return;
    }

    try {
      recognizer.start();
    } catch {
      setTimeout(() => {
        setIsRecordingRoleplay(false);
        soundManager.playVictory();
        setRoleplayPassed(true);
        onActivityComplete(30);
      }, 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 1: LEARN</span>
            <span>·</span>
            <span>Module 2</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Sentence Patterns 💬
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key structures &amp; communicative dialogues for Unit {unit.unitNumber}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('dialogue');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dialogue'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            💬 Dialogue
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('build');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'build'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🧩 Build Sentences
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('roleplay');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'roleplay'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎭 Role Play
          </button>
        </div>
      </div>

      {/* TAB 1: ANIMATED DIALOGUE */}
      {activeTab === 'dialogue' && (
        <div className="mt-6 max-w-2xl mx-auto">
          {/* Key Structure Highlight Card */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center mb-6">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest">
              Target Communication Structure
            </span>
            <h3 className="font-display font-bold text-2xl text-amber-900 dark:text-amber-100 mt-1">
              "{currentPattern.pattern}"
            </h3>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1 font-medium">
              🇻🇳 Ý nghĩa: {currentPattern.patternVi}
            </p>
          </div>

          {/* Dialogue Conversation Bubbles */}
          <div className="space-y-4">
            {currentPattern.dialogue.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3.5 ${
                  idx % 2 === 1 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  {item.avatar}
                </div>

                <div
                  className={`max-w-md p-4 rounded-3xl relative shadow-xs border ${
                    idx % 2 === 1
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-right'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 justify-between">
                    <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">
                      {item.speaker}
                    </span>
                    <button
                      onClick={() => handleSpeak(item.audioText)}
                      className="p-1 rounded-full hover:bg-amber-200/60 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {item.textEn}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.textVi}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                soundManager.playDing();
                // Speak all lines in sequence
                speakText(currentPattern.dialogue.map((d) => `${d.speaker} says: ${d.textEn}`).join('. '));
                onActivityComplete(15);
              }}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-sm shadow-md shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4" />
              <span>Listen to Full Conversation</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: BUILD SENTENCES (WORD ORDER) */}
      {activeTab === 'build' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 mb-6">
            Tap the word bubbles below in the right order to form the complete sentence!
          </p>

          {/* Sentence Builder Slot Box */}
          <div className="min-h-24 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-amber-300 dark:border-slate-700 flex flex-wrap items-center justify-center gap-2 mb-6">
            {selectedWords.length === 0 ? (
              <span className="text-xs text-slate-400 font-medium italic">
                Tap words below to place them here...
              </span>
            ) : (
              selectedWords.map((word, i) => (
                <button
                  key={'sel-' + i}
                  onClick={() => handleRemoveWord(word, i)}
                  className="px-4 py-2 rounded-2xl bg-amber-500 text-white font-display font-bold text-base shadow-sm hover:bg-rose-500 transition-colors cursor-pointer"
                  title="Click to remove"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Available Word Bubbles */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {availableWords.map((word, i) => (
              <button
                key={'avail-' + i}
                onClick={() => handlePickWord(word, i)}
                className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-900 dark:text-white font-display font-bold text-base shadow-xs hover:scale-105 transition-all cursor-pointer"
              >
                {word}
              </button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetBuild}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleCheckBuild}
              disabled={selectedWords.length === 0}
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-display font-bold text-base shadow-md shadow-emerald-500/20 cursor-pointer transition-all hover:scale-105"
            >
              Check My Sentence
            </button>
          </div>

          {buildFeedback && (
            <div
              className={`mt-6 p-4 rounded-2xl font-bold text-sm animate-fade-in ${
                buildFeedback.isCorrect
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {buildFeedback.message}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ROLE PLAY */}
      {activeTab === 'roleplay' && (
        <div className="mt-6 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-4xl mx-auto mb-3">
            🦉
          </div>

          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Smarty the Owl says:
          </h3>
          <p className="text-xl font-bold text-amber-600 mt-2">
            "{currentPattern.rolePlayPrompts[0]?.prompt}"
          </p>

          <button
            onClick={() => handleSpeak(currentPattern.rolePlayPrompts[0]?.prompt || '')}
            className="mt-3 text-xs text-amber-700 font-bold underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen to Smarty</span>
          </button>

          <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Your Speaking Mission
            </span>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Say: "{currentPattern.rolePlayPrompts[0]?.expectedReply}"
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleStartRoleplayRecord}
              disabled={isRecordingRoleplay}
              className={`px-8 py-4 rounded-full font-display font-bold text-base text-white shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all hover:scale-105 ${
                isRecordingRoleplay
                  ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecordingRoleplay ? 'Smarty is listening...' : 'Tap & Reply to Smarty'}</span>
            </button>
          </div>

          {roleplayPassed && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 animate-fade-in font-bold text-base">
              🎉 Brilliant response! Smarty understood you completely!
            </div>
          )}
        </div>
      )}

    </div>
  );
};
