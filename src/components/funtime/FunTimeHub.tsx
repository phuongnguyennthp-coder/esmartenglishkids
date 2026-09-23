import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Play, RotateCcw, Volume2, Mic, CheckCircle2, Star, Award, Dices, Music, Compass, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GradeLevel, FunTimeMilestone, Unit } from '../../types/curriculum';
import { GRADE_1_FUN_TIMES, GRADE_2_FUN_TIMES } from '../../data/curriculumData';
import { soundManager } from '../../utils/audio';

interface FunTimeHubProps {
  currentGrade: GradeLevel;
  activeUnit: Unit;
  onReward: (stars: number, coins: number, xp: number) => void;
  onUnlockBadge?: (badge: { id: string; title: string; description: string; icon: string }) => void;
}

export const FunTimeHub: React.FC<FunTimeHubProps> = ({
  currentGrade,
  activeUnit,
  onReward,
  onUnlockBadge,
}) => {
  const milestones = currentGrade === 1 ? GRADE_1_FUN_TIMES : GRADE_2_FUN_TIMES;

  // Determine active milestone based on activeUnit.unitNumber
  const defaultMilestoneIdx = Math.min(3, Math.floor((activeUnit.unitNumber - 1) / 4));
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState(defaultMilestoneIdx);
  const [activeTab, setActiveTab] = useState<'wheel' | 'chant' | 'board' | 'puzzle'>('wheel');

  const activeMilestone = milestones[selectedMilestoneIdx] || milestones[0];

  // 1. Lucky Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<{
    label: string;
    challenge: string;
    rewardStars: number;
    emoji: string;
  } | null>(null);

  // 2. Chant Karaoke State
  const [activeLyricLine, setActiveLyricLine] = useState<number>(-1);
  const [isPlayingChant, setIsPlayingChant] = useState(false);

  // 3. Board Game State
  const [boardPosition, setBoardPosition] = useState(0);
  const [lastDice, setLastDice] = useState<number | null>(null);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [boardCompleted, setBoardCompleted] = useState(false);

  // 4. Odd One Out Puzzle State
  const [selectedPuzzleOpt, setSelectedPuzzleOpt] = useState<number | null>(null);
  const [puzzleAnswered, setPuzzleAnswered] = useState(false);

  // Reset tab states when milestone changes
  useEffect(() => {
    setWheelResult(null);
    setActiveLyricLine(-1);
    setIsPlayingChant(false);
    setBoardPosition(0);
    setLastDice(null);
    setBoardCompleted(false);
    setSelectedPuzzleOpt(null);
    setPuzzleAnswered(false);
  }, [selectedMilestoneIdx]);

  // Spin Lucky Wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);
    soundManager.playDing();

    const segments = activeMilestone.wheelChallenge.segments;
    const randomTurns = 5 + Math.floor(Math.random() * 3);
    const chosenIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    const targetAngle = wheelRotation + randomTurns * 360 + chosenIndex * segmentAngle;

    setWheelRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const won = segments[chosenIndex];
      setWheelResult(won);
      soundManager.playStar();
      soundManager.playCoin();
      onReward(won.rewardStars, won.rewardStars * 3, 20);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 2500);
  };

  // Play Chant Line by Line
  const handlePlayChant = () => {
    if (isPlayingChant) return;
    setIsPlayingChant(true);
    setActiveLyricLine(0);
    soundManager.playDing();

    const lyrics = activeMilestone.chant.lyrics;
    lyrics.forEach((line, index) => {
      setTimeout(() => {
        setActiveLyricLine(index);
        soundManager.speakText(line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''));
        if (index === lyrics.length - 1) {
          setTimeout(() => {
            setIsPlayingChant(false);
            soundManager.playVictory();
            onReward(2, 5, 25);
            confetti({ particleCount: 60, spread: 70 });
          }, 2500);
        }
      }, index * 2600);
    });
  };

  // Roll 3D Dice for Board Game
  const handleRollDice = () => {
    if (isRollingDice || boardCompleted) return;
    setIsRollingDice(true);
    soundManager.playDing();

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 steps for primary kids
      setLastDice(dice);
      setIsRollingDice(false);

      const maxSteps = activeMilestone.boardGameTiles.length - 1;
      const nextPos = Math.min(maxSteps, boardPosition + dice);
      setBoardPosition(nextPos);

      const tile = activeMilestone.boardGameTiles[nextPos];
      soundManager.playCoin();
      onReward(1, 3, 15);

      if (nextPos >= maxSteps) {
        setBoardCompleted(true);
        soundManager.playVictory();
        onReward(5, 15, 50);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    }, 800);
  };

  // Handle Odd One Out Option
  const handleSelectPuzzle = (idx: number, isOdd: boolean) => {
    if (puzzleAnswered) return;
    setSelectedPuzzleOpt(idx);
    setPuzzleAnswered(true);

    if (isOdd) {
      soundManager.playVictory();
      soundManager.playStar();
      onReward(3, 8, 30);
      confetti({ particleCount: 40, spread: 60 });
    } else {
      soundManager.playBuzzer();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner: Global Success Fun Time Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white shadow-xl overflow-hidden border-4 border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-amber-950">
              <span>🎉 GLOBAL SUCCESS FUN TIME</span>
              <span>·</span>
              <span>GRADE {currentGrade} REVIEW SESSIONS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-amber-950 tracking-tight">
              Sân Chơi Vui Học: Fun Time {activeMilestone.milestoneNumber}! 🎡
            </h2>
            <p className="text-amber-950/90 text-xs sm:text-sm font-bold max-w-xl">
              {activeMilestone.titleVi} ({activeMilestone.coveredUnits}). Vừa chơi vừa tích lũy sao và huy hiệu vô địch!
            </p>
          </div>

          {/* Quick milestone selector pills */}
          <div className="flex flex-wrap md:flex-col gap-2 bg-white/20 p-2 rounded-2xl backdrop-blur-xs">
            {milestones.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  soundManager.playDing();
                  setSelectedMilestoneIdx(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMilestoneIdx === idx
                    ? 'bg-white text-amber-600 shadow-md scale-105'
                    : 'text-amber-950 hover:bg-white/40'
                }`}
              >
                <span>{m.themeEmoji}</span>
                <span>Fun Time {m.milestoneNumber}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Interactive Activity Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('wheel');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'wheel'
              ? 'bg-amber-500 text-white shadow-md scale-102'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🎡</span>
          <span>1. Vòng Quay May Mắn (Lucky Wheel)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('chant');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'chant'
              ? 'bg-amber-500 text-white shadow-md scale-102'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🎵</span>
          <span>2. Karaoke &amp; Hát Vè (Chant Sing-Along)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('board');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'board'
              ? 'bg-amber-500 text-white shadow-md scale-102'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🎲</span>
          <span>3. Đường Đua Xúc Xắc (Adventure Board Game)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('puzzle');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'puzzle'
              ? 'bg-amber-500 text-white shadow-md scale-102'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🧩</span>
          <span>4. Tìm Điểm Khác Biệt (Odd One Out)</span>
        </button>
      </div>

      {/* ACTIVITY 1: LUCKY WHEEL */}
      {activeTab === 'wheel' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎡 Vòng Quay May Mắn Ngữ Âm &amp; Từ Vựng</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm nút quay, khi kim dừng ở ô nào con hãy đọc to thử thách để nhận thưởng!
              </p>
            </div>
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSpinning ? '🌀 ĐANG QUAY...' : 'QUAY NGAY! 🚀'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Visual Spinning Wheel */}
            <div className="relative flex items-center justify-center p-4">
              {/* Wheel Pointer Arrow */}
              <div className="absolute top-2 z-20 w-8 h-8 flex items-center justify-center text-red-600 text-3xl font-black drop-shadow-md">
                ▼
              </div>

              {/* Rotating Wheel Container */}
              <div
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? 'transform 2.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-amber-300 dark:border-amber-700 shadow-2xl relative overflow-hidden bg-slate-100 flex items-center justify-center"
              >
                {activeMilestone.wheelChallenge.segments.map((seg, idx, arr) => {
                  const angle = 360 / arr.length;
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: seg.color,
                        transform: `rotate(${idx * angle}deg)`,
                        transformOrigin: '50% 100%',
                      }}
                      className="absolute top-0 left-1/2 -ml-16 w-32 h-36 flex flex-col items-center pt-3 text-white font-black text-xs shadow-inner"
                    >
                      <span className="text-xl mb-1">{seg.emoji}</span>
                      <span className="text-[11px] drop-shadow-md text-center px-1 font-display">
                        {seg.label}
                      </span>
                    </div>
                  );
                })}

                {/* Center Hub */}
                <div className="absolute z-10 w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-amber-400 flex items-center justify-center text-2xl shadow-lg">
                  🦉
                </div>
              </div>
            </div>

            {/* Wheel Result Card */}
            <div className="space-y-4">
              {wheelResult ? (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-300 dark:border-amber-700 space-y-4 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs">
                      ★ KẾT QUẢ VÒNG QUAY ★
                    </span>
                    <span className="text-2xl">{wheelResult.emoji}</span>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                      {wheelResult.label}
                    </h4>
                    <p className="text-amber-800 dark:text-amber-200 font-bold text-base mt-2">
                      Thử thách: &ldquo;{wheelResult.challenge}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => soundManager.speakText(wheelResult.challenge)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe Mẫu</span>
                    </button>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-emerald-500" />
                      <span>+{wheelResult.rewardStars} Sao &amp; +{wheelResult.rewardStars * 3} Xu!</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2">
                  <span className="text-4xl block">✨</span>
                  <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                    Bấm &ldquo;QUAY NGAY!&rdquo; để nhận thử thách vui nhộn
                  </p>
                  <p className="text-xs text-slate-400">
                    Mỗi lượt quay giúp con luyện phản xạ tiếng Anh và nhận thêm sao tích lũy.
                  </p>
                </div>
              )}

              {/* Segments Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeMilestone.wheelChallenge.segments.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span>{s.emoji}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY 2: KARAOKE CHANT SING-ALONG */}
      {activeTab === 'chant' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎵 {activeMilestone.chant.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đọc vè theo nhịp điệu tiếng Anh sôi động cùng Smarty và Bimi!
              </p>
            </div>
            <button
              onClick={handlePlayChant}
              disabled={isPlayingChant}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-display font-black text-sm sm:text-base shadow-lg shadow-indigo-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isPlayingChant ? 'ĐANG PHÁT NHỊP ĐIỆU...' : 'HÁT CÙNG SMARTY 🎤'}</span>
            </button>
          </div>

          <div className="max-w-xl mx-auto space-y-3 py-4">
            {activeMilestone.chant.lyrics.map((line, idx) => {
              const isActive = activeLyricLine === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    soundManager.playDing();
                    soundManager.speakText(line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''));
                    setActiveLyricLine(idx);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-md scale-102 ring-2 ring-indigo-400/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`font-display font-bold text-sm sm:text-base ${
                      isActive ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {line}
                    </span>
                  </div>
                  <Volume2 className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVITY 3: ADVENTURE BOARD GAME */}
      {activeTab === 'board' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎲 Đường Đua Tiếng Anh (Adventure Board Game)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đổ xúc xắc để di chuyển nhân vật về đích, hoàn thành từng ô thử thách tiếng Anh!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundManager.playDing();
                  setBoardPosition(0);
                  setBoardCompleted(false);
                  setLastDice(null);
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Chơi lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRollDice}
                disabled={isRollingDice || boardCompleted}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Dices className={`w-5 h-5 ${isRollingDice ? 'animate-spin' : ''}`} />
                <span>{isRollingDice ? 'ĐANG ĐỔ...' : `ĐỔ XÚC XẮC ${lastDice ? `(Vừa ra: ${lastDice})` : ''}`}</span>
              </button>
            </div>
          </div>

          {/* Board Game Track Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {activeMilestone.boardGameTiles.map((tile, idx) => {
              const isCurrent = boardPosition === idx;
              const isPast = boardPosition > idx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px] ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-100 dark:bg-amber-950/60 shadow-lg scale-105 ring-2 ring-amber-400'
                      : isPast
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Ô #{tile.step}
                    </span>
                    <span className="text-2xl">{tile.emoji}</span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {tile.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {tile.task}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-amber-500 text-white font-bold text-[9px] text-center uppercase tracking-wider">
                      ★ BẠN Ở ĐÂY ★
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {boardCompleted && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-white text-center space-y-2 animate-scale-in">
              <span className="text-4xl block">🏆</span>
              <h4 className="font-display font-black text-2xl">
                Chúc mừng con đã về đích xuất sắc!
              </h4>
              <p className="text-xs font-bold text-amber-950">
                Thưởng +5 Sao, +15 Xu và mở khóa Danh hiệu Vô Địch Đường Đua Fun Time!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACTIVITY 4: ODD ONE OUT PUZZLE */}
      {activeTab === 'puzzle' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>🧩 Đố Vui Nhanh: Tìm Từ Khác Biệt (Odd One Out)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeMilestone.oddOneOutPuzzle.question}
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playDing();
                setSelectedPuzzleOpt(null);
                setPuzzleAnswered(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Chơi lại
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activeMilestone.oddOneOutPuzzle.options.map((opt, idx) => {
              const isSelected = selectedPuzzleOpt === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPuzzle(idx, opt.isOdd)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isSelected
                      ? opt.isOdd
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 shadow-lg scale-105'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400'
                  }`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                    {opt.text}
                  </span>
                  {isSelected && (
                    <span className={`text-[11px] font-bold text-center ${
                      opt.isOdd ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}>
                      {opt.reason}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
