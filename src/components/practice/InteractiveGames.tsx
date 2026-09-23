import React, { useState } from 'react';
import { Trophy, Star, Sparkles, RefreshCw, Zap, Timer, Check, Award } from 'lucide-react';
import { Unit } from '../../types/curriculum';
import { speakText, soundManager } from '../../utils/audio';

interface InteractiveGamesProps {
  unit: Unit;
  onReward: (stars: number, coins: number, xp: number) => void;
}

export const InteractiveGames: React.FC<InteractiveGamesProps> = ({
  unit,
  onReward,
}) => {
  const [activeGame, setActiveGame] = useState<'memory' | 'drag' | 'hunt' | 'race'>('memory');

  // GAME 1: MEMORY GAME STATE
  const [memoryCards, setMemoryCards] = useState<any[]>(() => initMemoryCards(unit));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // GAME 2: DRAG / TAP BASKET SORTING
  const [basketTarget, setBasketTarget] = useState<string>(unit.phonics.letter);
  const [sortedItems, setSortedItems] = useState<string[]>([]);

  // GAME 3: VOCABULARY HUNT STATE
  const [huntFound, setHuntFound] = useState<string[]>([]);

  // GAME 4: PHONICS RACE
  const [raceScore, setRaceScore] = useState(0);
  const [raceActive, setRaceActive] = useState(false);

  function initMemoryCards(u: Unit) {
    const pairs: any[] = [];
    u.vocabulary.slice(0, 3).forEach((w) => {
      pairs.push({ id: w.id + '-txt', key: w.id, content: w.word, type: 'text' });
      pairs.push({ id: w.id + '-img', key: w.id, content: w.imageEmoji, type: 'emoji' });
    });
    return pairs.sort(() => Math.random() - 0.5);
  }

  // Handle Memory Card Flip
  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;
    soundManager.playDing();

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = memoryCards[firstIdx];
      const card2 = memoryCards[secondIdx];

      if (card1.key === card2.key) {
        soundManager.playVictory();
        setMatchedPairs((prev) => [...prev, card1.key]);
        setFlippedIndices([]);
        onReward(2, 5, 20);
      } else {
        setTimeout(() => {
          soundManager.playBuzzer();
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const handleResetMemory = () => {
    soundManager.playDing();
    setMemoryCards(initMemoryCards(unit));
    setFlippedIndices([]);
    setMatchedPairs([]);
  };

  // Drag / Sort handler
  const handleSortItem = (word: string, belongs: boolean) => {
    if (belongs) {
      soundManager.playVictory();
      setSortedItems((prev) => [...prev, word]);
      onReward(1, 3, 15);
    } else {
      soundManager.playBuzzer();
    }
  };

  // Vocab Hunt handler
  const handleHuntWord = (word: string) => {
    if (huntFound.includes(word)) return;
    soundManager.playVictory();
    setHuntFound((prev) => [...prev, word]);
    speakText(word);
    onReward(2, 4, 15);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 2: PRACTICE</span>
            <span>·</span>
            <span>Module 6</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Interactive Games 🎮
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Earn Stars, Coins, XP &amp; unlock champion badges
          </p>
        </div>

        {/* 4 Games Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveGame('memory');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'memory'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🃏 Memory Flip
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveGame('drag');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'drag'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🧺 Basket Sort
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveGame('hunt');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'hunt'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🔎 Word Hunt
          </button>
          <button
            onClick={() => {
              soundManager.playDing();
              setActiveGame('race');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'race'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            ⚡ Phonics Race
          </button>
        </div>
      </div>

      {/* GAME 1: MEMORY CARD FLIP */}
      {activeGame === 'memory' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-slate-500">
              Flip two cards to match the word with its picture!
            </p>
            <button
              onClick={handleResetMemory}
              className="text-xs text-amber-600 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Game</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {memoryCards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.key);
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-28 rounded-3xl border-4 flex items-center justify-center transition-all transform cursor-pointer ${
                    isFlipped
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 scale-102 shadow-md'
                      : 'bg-gradient-to-tr from-amber-400 to-orange-500 border-amber-300 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  {isFlipped ? (
                    <span className={card.type === 'emoji' ? 'text-4xl' : 'font-display font-bold text-lg text-slate-900 dark:text-white capitalize'}>
                      {card.content}
                    </span>
                  ) : (
                    <span className="font-display font-bold text-3xl">⭐</span>
                  )}
                </button>
              );
            })}
          </div>

          {matchedPairs.length === 3 && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              🎉 Congratulations! You found all pairs! +60 XP &amp; 15 Coins awarded!
            </div>
          )}
        </div>
      )}

      {/* GAME 2: BASKET SORT */}
      {activeGame === 'drag' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 mb-6">
            Tap words that start with target sound <strong className="text-amber-600">{basketTarget}</strong> to drop them into Smarty's basket!
          </p>

          {/* Basket Box */}
          <div className="p-8 rounded-3xl bg-amber-50 dark:bg-slate-800/60 border-4 border-dashed border-amber-400 flex flex-col items-center justify-center mb-6">
            <span className="text-6xl mb-2">🧺</span>
            <h4 className="font-display font-bold text-2xl text-amber-900 dark:text-amber-100">
              Smarty's Letter "{basketTarget}" Basket
            </h4>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {sortedItems.length === 0 ? (
                <span className="text-xs text-amber-700/60 dark:text-slate-400 italic">
                  Basket is waiting for correct words...
                </span>
              ) : (
                sortedItems.map((item, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full bg-amber-500 text-white font-display font-bold text-sm shadow-xs animate-fade-in"
                  >
                    ✓ {item}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Word Options */}
          <div className="flex flex-wrap gap-3 justify-center">
            {unit.vocabulary.map((w) => {
              const alreadySorted = sortedItems.includes(w.word);
              return (
                <button
                  key={w.id}
                  disabled={alreadySorted}
                  onClick={() => handleSortItem(w.word, true)}
                  className={`px-5 py-3 rounded-2xl border-2 font-display font-bold text-base transition-all cursor-pointer ${
                    alreadySorted
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 hover:bg-amber-100 border-slate-200 hover:border-amber-500 text-slate-800 dark:text-white hover:scale-105 shadow-xs'
                  }`}
                >
                  {w.imageEmoji} {w.word}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME 3: WORD HUNT */}
      {activeGame === 'hunt' && (
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 mb-6">
            Hunt and tap each hidden vocabulary item to reveal its English pronunciation!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {unit.vocabulary.map((w) => {
              const isFound = huntFound.includes(w.word);
              return (
                <button
                  key={'hunt-' + w.id}
                  onClick={() => handleHuntWord(w.word)}
                  className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isFound
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 scale-102 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:scale-105'
                  }`}
                >
                  <span className="text-5xl mb-2">{w.imageEmoji}</span>
                  <span className="font-display font-bold text-sm text-slate-800 dark:text-white capitalize">
                    {isFound ? w.word : '???'}
                  </span>
                  {isFound && <span className="text-[10px] text-emerald-600 font-bold mt-1">Found! ✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME 4: PHONICS RACE */}
      {activeGame === 'race' && (
        <div className="mt-6 max-w-md mx-auto text-center">
          <p className="text-xs font-medium text-slate-500 mb-6">
            Quickly tap the correct sound when you see the word appear on screen!
          </p>

          <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 text-center mb-6">
            <span className="text-5xl mb-2 block">{unit.vocabulary[0]?.imageEmoji}</span>
            <h4 className="font-display font-bold text-3xl text-indigo-900 dark:text-indigo-100">
              "{unit.vocabulary[0]?.word}"
            </h4>
            <span className="text-xs text-indigo-600 dark:text-indigo-300 font-bold mt-2 block">
              What is its initial phonics sound?
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                soundManager.playVictory();
                setRaceScore((p) => p + 1);
                onReward(2, 5, 20);
              }}
              className="p-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              {unit.phonics.sound}
            </button>
            <button
              onClick={() => soundManager.playBuzzer()}
              className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-display font-bold text-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              /z/
            </button>
          </div>

          {raceScore > 0 && (
            <div className="mt-6 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">
              ⚡ Streak Score: {raceScore} | Keep racing!
            </div>
          )}
        </div>
      )}

    </div>
  );
};
