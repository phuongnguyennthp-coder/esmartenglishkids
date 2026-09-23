import React, { useState } from 'react';
import { Volume2, Mic, CheckCircle2, Sparkles, Activity, Layers, AudioWaveform, AlertCircle } from 'lucide-react';
import { Unit } from '../../types/curriculum';
import { speakText, soundManager, createSpeechRecognizer } from '../../utils/audio';
import { evaluateSpeechAI } from '../../services/geminiService';

interface PhonicsLabProps {
  unit: Unit;
  onActivityComplete: (xpGain: number) => void;
  onRecordAttempt?: (attempt: any) => void;
}

export const PhonicsLab: React.FC<PhonicsLabProps> = ({
  unit,
  onActivityComplete,
  onRecordAttempt,
}) => {
  const phonics = unit.phonics;

  const [activeMode, setActiveMode] = useState<'sound' | 'blend' | 'segment' | 'ai-lab'>('sound');

  // AI Pronunciation Engine State
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [phonicsError, setPhonicsError] = useState<string | null>(null);
  const [selectedWordToTest, setSelectedWordToTest] = useState<string>(unit.vocabulary[0]?.word || 'ball');
  const [evaluation, setEvaluation] = useState<{
    pronunciationScore: number;
    fluencyScore: number;
    accuracyScore: number;
    rating: 'Excellent' | 'Good Job' | 'Try Again' | 'Need More Practice';
    praiseMessage: string;
    tips: string;
  } | null>(null);

  const handleSpeak = (text: string, rate: number = 0.8) => {
    soundManager.playDing();
    speakText(text, rate);
  };

  // Blending playback: onset -> rime -> word
  const handlePlayBlend = (onset: string, rime: string, word: string) => {
    soundManager.playDing();
    speakText(onset, 0.7);
    setTimeout(() => {
      speakText(rime, 0.7);
      setTimeout(() => {
        soundManager.playVictory();
        speakText(word, 0.85);
      }, 700);
    }, 700);
  };

  // Segmenting playback: word -> sound by sound
  const handlePlaySegment = (word: string, sounds: string[]) => {
    soundManager.playDing();
    speakText(word, 0.85);
    setTimeout(() => {
      sounds.forEach((s, idx) => {
        setTimeout(() => {
          speakText(s.replace(/[\/ː]/g, ''), 0.7);
        }, idx * 600);
      });
    }, 800);
  };

  // AI Pronunciation Engine recording & evaluation
  const handleStartAIEvaluation = () => {
    setEvaluation(null);
    setIsRecording(true);
    soundManager.playDing();

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsRecording(false);
        sendToGeminiAI(transcript);
      },
      () => {
        // Fallback simulation
        setTimeout(() => {
          setIsRecording(false);
          sendToGeminiAI(selectedWordToTest);
        }, 1500);
      }
    );

    if (!recognizer) {
      setTimeout(() => {
        setIsRecording(false);
        sendToGeminiAI(selectedWordToTest);
      }, 1500);
      return;
    }

    try {
      recognizer.start();
    } catch {
      setTimeout(() => {
        setIsRecording(false);
        sendToGeminiAI(selectedWordToTest);
      }, 1500);
    }
  };

  const sendToGeminiAI = async (recognizedText: string) => {
    setIsAnalyzing(true);
    setPhonicsError(null);
    try {
      const data = await evaluateSpeechAI(
        selectedWordToTest,
        recognizedText,
        unit.grade,
        unit.title
      );

      setEvaluation(data);
      soundManager.playVictory();
      onActivityComplete(30);

      if (onRecordAttempt) {
        onRecordAttempt({
          id: 'attempt-' + Date.now(),
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          targetText: selectedWordToTest,
          recognizedText,
          pronunciationScore: data.pronunciationScore,
          fluencyScore: data.fluencyScore,
          accuracyScore: data.accuracyScore,
          rating: data.rating,
          feedbackTip: data.tips,
        });
      }
    } catch (err: any) {
      soundManager.playBuzzer();
      setPhonicsError(err?.message || 'Lỗi đánh giá âm ngữ Phonics từ Gemini API');
    } finally {
      setIsAnalyzing(false);
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
            <span>Module 3</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Phonics Lab 🔬
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Target Sound: <span className="font-bold text-amber-600 font-mono">{phonics.sound}</span> (Letter {phonics.letter})
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveMode('sound');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'sound'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🔤 Letter Sound
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveMode('blend');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'blend'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🔗 Blending
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveMode('segment');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'segment'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            ✂️ Segmenting
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveMode('ai-lab');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'ai-lab'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🤖 AI Pronunciation Engine
          </button>
        </div>
      </div>

      {/* Error alert matching AI_INSTRUCTIONS.md */}
      {phonicsError && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 text-rose-800 dark:text-rose-200 text-xs font-bold space-y-1.5 animate-shake">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wide">
                Đã dừng do lỗi
              </span>
              <span className="font-extrabold text-rose-900 dark:text-rose-100">
                Lỗi phân tích âm AI:
              </span>
            </div>
            <button
              onClick={() => setPhonicsError(null)}
              className="text-rose-500 hover:text-rose-800 cursor-pointer font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p className="font-mono text-[11px] text-rose-700 dark:text-rose-300 break-words leading-relaxed pl-1">
            {phonicsError}
          </p>
        </div>
      )}

      {/* MODE 1: LETTER SOUND */}
      {activeMode === 'sound' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-display font-bold text-6xl shadow-xl shadow-amber-500/20 mb-4 animate-bounce-subtle">
            {phonics.letter}
          </div>

          <h3 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
            Phonics Sound: <span className="text-amber-500 font-mono">{phonics.sound}</span>
          </h3>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 mt-4 text-xs font-medium">
            <p>💡 {phonics.soundTip}</p>
            <p className="mt-1 opacity-80">🇻🇳 {phonics.soundTipVi}</p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => handleSpeak(phonics.sound.replace(/[\/ː]/g, ''))}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-base shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Volume2 className="w-5 h-5" />
              <span>Listen to Sound: {phonics.sound}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: BLENDING */}
      {activeMode === 'blend' && (
        <div className="mt-6 max-w-2xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 mb-6">
            Blending puts sounds together to build words. Listen to how onset and rime merge!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {phonics.blendingExamples.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center shadow-xs hover:border-amber-400 transition-all"
              >
                <span className="text-5xl mb-3">{item.emoji}</span>
                <div className="flex items-center gap-1.5 font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
                  <span className="text-amber-600">{item.onset}</span>
                  <span className="text-slate-400">+</span>
                  <span className="text-indigo-600">{item.rime}</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-emerald-600">{item.word}</span>
                </div>

                <button
                  onClick={() => handlePlayBlend(item.onset, item.rime, item.word)}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Blend Sounds</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: SEGMENTING */}
      {activeMode === 'segment' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 mb-6">
            Segmenting breaks words apart into individual phoneme sounds.
          </p>

          <div className="space-y-4">
            {phonics.segmentingWords.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white text-left capitalize">
                    {item.word}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {item.sounds.map((s, si) => (
                      <span
                        key={si}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePlaySegment(item.word, item.sounds)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Segment</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: AI PRONUNCIATION ENGINE */}
      {activeMode === 'ai-lab' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-200 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Speech Assessment Engine</span>
          </div>

          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Practice Saying: <span className="text-amber-600 capitalize">"{selectedWordToTest}"</span>
          </h3>

          {/* Word Selector to Test */}
          <div className="flex items-center justify-center gap-2 mt-3 mb-6">
            {unit.vocabulary.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  soundManager.playDing();
                  setSelectedWordToTest(w.word);
                  setEvaluation(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedWordToTest === w.word
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {w.imageEmoji} {w.word}
              </button>
            ))}
          </div>

          {/* Record Button */}
          <div className="my-6">
            <button
              onClick={handleStartAIEvaluation}
              disabled={isRecording || isAnalyzing}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-2xl transition-all transform hover:scale-105 mx-auto cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 animate-pulse ring-8 ring-rose-300'
                  : isAnalyzing
                  ? 'bg-indigo-500 animate-spin'
                  : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 shadow-amber-500/40'
              }`}
            >
              <Mic className="w-9 h-9 mb-1" />
              <span className="text-xs">
                {isRecording ? 'Listening...' : isAnalyzing ? 'Evaluating...' : 'Tap to Speak'}
              </span>
            </button>
          </div>

          {/* 3 Metrics: Pronunciation Score, Fluency Score, Accuracy Score */}
          {evaluation && (
            <div className="mt-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-amber-300 dark:border-amber-700/60 animate-fade-in text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  {evaluation.rating === 'Excellent' ? '🌟 Excellent Pronunciation!' : '👏 Good Effort!'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-xs">
                  {evaluation.rating}
                </span>
              </div>

              {/* 3 Metric Progress Bars */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pronunciation
                  </span>
                  <span className="font-display font-bold text-2xl text-emerald-600">
                    {evaluation.pronunciationScore}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Fluency
                  </span>
                  <span className="font-display font-bold text-2xl text-indigo-600">
                    {evaluation.fluencyScore}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Accuracy
                  </span>
                  <span className="font-display font-bold text-2xl text-amber-600">
                    {evaluation.accuracyScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                💬 {evaluation.praiseMessage}
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 italic">
                💡 {evaluation.tips}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
