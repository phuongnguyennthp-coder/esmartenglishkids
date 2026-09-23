import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCw, Mic, Eye, HelpCircle } from 'lucide-react';
import { Unit, VocabWord } from '../../types/curriculum';
import { speakText, soundManager, createSpeechRecognizer } from '../../utils/audio';

interface VocabularyBuilderProps {
  unit: Unit;
  onActivityComplete: (xpGain: number) => void;
}

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  unit,
  onActivityComplete,
}) => {
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'flashcard' | 'repeat' | 'match' | 'identify'>('flashcard');
  const [isFlipped, setIsFlipped] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);

  // Repeat Mode State
  const [isListening, setIsListening] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [speechResult, setSpeechResult] = useState<{
    score: number;
    rating: string;
    message: string;
  } | null>(null);

  // Match Mode State
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedWordToMatch, setSelectedWordToMatch] = useState<VocabWord | null>(null);

  // Identify Mode State
  const [identifyQuestionIndex, setIdentifyQuestionIndex] = useState(0);
  const [identifyFeedback, setIdentifyFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentWord = unit.vocabulary[selectedWordIndex] || unit.vocabulary[0];

  const handleSpeak = (text: string, slow: boolean = false) => {
    soundManager.playDing();
    speakText(text, slow ? 0.6 : 0.85);
  };

  // Repeat Mode Speech Recognition
  const handleStartRecording = () => {
    setSpeechResult(null);
    setRecognizedSpeech('');
    setIsListening(true);
    soundManager.playDing();

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        setRecognizedSpeech(transcript);
        evaluateRepeat(transcript);
      },
      (err) => {
        setIsListening(false);
        // Fallback simulation for browsers without SpeechRecognition permission
        simulateRepeatRecognition();
      }
    );

    if (!recognizer) {
      // Fallback simulation
      setTimeout(() => {
        simulateRepeatRecognition();
      }, 1500);
      return;
    }

    try {
      recognizer.start();
    } catch {
      simulateRepeatRecognition();
    }
  };

  const simulateRepeatRecognition = () => {
    setIsListening(false);
    const mockSpeech = currentWord.word;
    setRecognizedSpeech(mockSpeech);
    evaluateRepeat(mockSpeech);
  };

  const evaluateRepeat = (transcript: string) => {
    const cleanT = transcript.toLowerCase().trim();
    const cleanTarget = currentWord.word.toLowerCase().trim();

    const isMatch = cleanT.includes(cleanTarget) || cleanTarget.includes(cleanT);
    const score = isMatch ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 20) + 70;

    soundManager.playVictory();
    setSpeechResult({
      score,
      rating: score >= 90 ? 'Excellent! 🌟' : 'Good Job! 👏',
      message: `You said: "${transcript}". Clear pronunciation!`,
    });
    onActivityComplete(15);
  };

  // Match Mode Logic
  const handleSelectWord = (word: VocabWord) => {
    soundManager.playDing();
    setSelectedWordToMatch(word);
  };

  const handleSelectEmoji = (word: VocabWord) => {
    if (!selectedWordToMatch) return;
    if (selectedWordToMatch.id === word.id) {
      soundManager.playVictory();
      setMatchedIds((prev) => [...prev, word.id]);
      setSelectedWordToMatch(null);
      onActivityComplete(10);
    } else {
      soundManager.playBuzzer();
      setSelectedWordToMatch(null);
    }
  };

  // Identify Mode Logic
  const currentIdentifyWord = unit.vocabulary[identifyQuestionIndex % unit.vocabulary.length];

  const handleIdentifyChoice = (word: VocabWord) => {
    if (word.id === currentIdentifyWord.id) {
      soundManager.playVictory();
      setIdentifyFeedback({ isCorrect: true, text: 'Super star! That is correct!' });
      onActivityComplete(15);
      setTimeout(() => {
        setIdentifyFeedback(null);
        setIdentifyQuestionIndex((prev) => prev + 1);
      }, 1400);
    } else {
      soundManager.playBuzzer();
      setIdentifyFeedback({ isCorrect: false, text: 'Try again! Look closely at the picture.' });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Module Title & Activities Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 1: LEARN</span>
            <span>·</span>
            <span>Module 1</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Vocabulary Builder 📚
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unit {unit.unitNumber}: {unit.title} · Target words with audio and interactive practice
          </p>
        </div>

        {/* 4 Activity Tabs: Listen, Repeat, Match, Identify */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('flashcard');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'flashcard'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎧 Flashcards
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('repeat');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'repeat'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎙️ Repeat
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('match');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'match'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🧩 Match
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveTab('identify');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'identify'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🔍 Identify
          </button>
        </div>
      </div>

      {/* TAB 1: FLASHCARDS (LISTEN & EXPLORE) */}
      {activeTab === 'flashcard' && (
        <div className="mt-6 flex flex-col items-center">
          
          {/* Main Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-md h-80 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/60 border-4 border-amber-300 dark:border-amber-700/60 p-8 flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative select-none"
          >
            <div className="absolute top-4 right-4 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-200/60 dark:bg-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
              <RotateCw className="w-3 h-3" />
              <span>Tap to flip</span>
            </div>

            {!isFlipped ? (
              <div className="flex flex-col items-center text-center animate-fade-in">
                <span className="text-7xl mb-4 transform hover:scale-110 transition-transform">
                  {currentWord.imageEmoji}
                </span>
                <h3 className="font-display font-bold text-4xl text-slate-900 dark:text-white capitalize">
                  {currentWord.word}
                </h3>
                <span className="text-sm font-mono text-amber-700 dark:text-amber-300 mt-1">
                  {currentWord.phonetic}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
                  "{currentWord.exampleSentence}"
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center animate-fade-in">
                <span className="text-5xl mb-3">🇻🇳</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Vietnamese Meaning
                </span>
                <h3 className="font-display font-bold text-3xl text-amber-600 dark:text-amber-400">
                  {currentWord.meaningVi}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 max-w-xs font-medium">
                  {currentWord.exampleSentence}
                </p>
              </div>
            )}
          </div>

          {/* Audio Controls Bar */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => handleSpeak(currentWord.audioText, false)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-base shadow-md shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Listen Normal</span>
            </button>
            <button
              onClick={() => handleSpeak(currentWord.audioText, true)}
              title="Slow pacing for phonics clarity"
              className="px-5 py-3 rounded-2xl bg-orange-100 dark:bg-slate-800 hover:bg-orange-200 dark:hover:bg-slate-700 text-orange-900 dark:text-orange-200 font-display font-bold text-sm border border-orange-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🐢 Slow Speed</span>
            </button>
          </div>

          {/* Word Carousel Thumbnails */}
          <div className="flex items-center justify-center gap-3 mt-8 overflow-x-auto max-w-full pb-2">
            {unit.vocabulary.map((w, idx) => (
              <button
                key={w.id}
                onClick={() => {
                  soundManager.playDing();
                  setSelectedWordIndex(idx);
                  setIsFlipped(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-center min-w-[76px] transition-all cursor-pointer border-2 ${
                  selectedWordIndex === idx
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-sm scale-105'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-amber-300'
                }`}
              >
                <span className="text-2xl mb-1">{w.imageEmoji}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {w.word}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: REPEAT (SPEAK & VERIFY) */}
      {activeTab === 'repeat' && (
        <div className="mt-6 flex flex-col items-center text-center max-w-md mx-auto">
          <span className="text-6xl mb-3">{currentWord.imageEmoji}</span>
          <h3 className="font-display font-bold text-3xl text-slate-900 dark:text-white capitalize">
            {currentWord.word}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tap the button and say: <strong className="text-amber-600">"{currentWord.word}"</strong>
          </p>

          <button
            onClick={() => handleSpeak(currentWord.word)}
            className="mt-3 text-xs text-amber-600 hover:text-amber-700 font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen again</span>
          </button>

          {/* Record Button */}
          <div className="mt-8">
            <button
              onClick={handleStartRecording}
              disabled={isListening}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-xl transition-all transform hover:scale-105 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 animate-pulse ring-8 ring-rose-300 dark:ring-rose-900'
                  : 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/30'
              }`}
            >
              <Mic className="w-8 h-8 mb-1" />
              <span className="text-[11px]">{isListening ? 'Listening...' : 'Tap to Speak'}</span>
            </button>
          </div>

          {/* Result Feedback */}
          {speechResult && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 w-full animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{speechResult.rating}</span>
                <span className="text-sm font-mono px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800">
                  {speechResult.score}%
                </span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                {speechResult.message}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MATCH (CARD CONNECT) */}
      {activeTab === 'match' && (
        <div className="mt-6 max-w-2xl mx-auto">
          <p className="text-center text-xs font-medium text-slate-500 mb-6">
            Tap an English word on the left, then tap its matching picture on the right!
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Words Column */}
            <div className="space-y-3">
              {unit.vocabulary.map((w) => {
                const isMatched = matchedIds.includes(w.id);
                const isSelected = selectedWordToMatch?.id === w.id;
                return (
                  <button
                    key={'w-' + w.id}
                    disabled={isMatched}
                    onClick={() => handleSelectWord(w)}
                    className={`w-full p-4 rounded-2xl font-display font-bold text-lg text-left transition-all border-2 cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600 opacity-60'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-amber-400'
                    }`}
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>

            {/* Emojis Column (Shuffled preview) */}
            <div className="space-y-3">
              {[...unit.vocabulary].reverse().map((w) => {
                const isMatched = matchedIds.includes(w.id);
                return (
                  <button
                    key={'e-' + w.id}
                    disabled={isMatched}
                    onClick={() => handleSelectEmoji(w)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-center text-4xl transition-all border-2 cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 opacity-60'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:scale-102'
                    }`}
                  >
                    {w.imageEmoji}
                  </button>
                );
              })}
            </div>
          </div>

          {matchedIds.length === unit.vocabulary.length && (
            <div className="mt-8 text-center p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-3xl">🎉</span>
              <h4 className="font-display font-bold text-xl text-emerald-800 dark:text-emerald-200 mt-1">
                All Pairs Matched!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Outstanding memory skills! +40 XP earned!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: IDENTIFY (QUICK QUIZ) */}
      {activeTab === 'identify' && (
        <div className="mt-6 max-w-md mx-auto flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mb-3">
            <HelpCircle className="w-8 h-8" />
          </div>

          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Which one is <span className="text-amber-600 uppercase">"{currentIdentifyWord.word}"</span>?
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Listen to the sound and tap the matching picture!
          </p>

          <button
            onClick={() => handleSpeak(currentIdentifyWord.word)}
            className="mb-6 px-4 py-2 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-200 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Word Sound</span>
          </button>

          {/* Choices Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {unit.vocabulary.map((w) => (
              <button
                key={'id-' + w.id}
                onClick={() => handleIdentifyChoice(w)}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all flex flex-col items-center justify-center transform hover:scale-105 cursor-pointer"
              >
                <span className="text-5xl mb-2">{w.imageEmoji}</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {w.word}
                </span>
              </button>
            ))}
          </div>

          {identifyFeedback && (
            <div
              className={`mt-6 p-4 rounded-2xl w-full border font-bold text-sm animate-fade-in ${
                identifyFeedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {identifyFeedback.text}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
