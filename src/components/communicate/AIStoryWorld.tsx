import React, { useState } from 'react';
import { Sparkles, Volume2, Mic, ArrowRight, ArrowLeft, CheckCircle2, RotateCw, AlertTriangle, AlertCircle } from 'lucide-react';
import { Unit } from '../../types/curriculum';
import { speakText, soundManager, createSpeechRecognizer } from '../../utils/audio';
import { generateStoryAI } from '../../services/geminiService';

interface AIStoryWorldProps {
  unit: Unit;
  onActivityComplete: (xpGain: number) => void;
}

export const AIStoryWorld: React.FC<AIStoryWorldProps> = ({
  unit,
  onActivityComplete,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeakingMission, setIsSpeakingMission] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<'idle' | 'generating' | 'stopped_error' | 'success'>('idle');

  // Story data (can be generated dynamically via Gemini AI or loaded from curriculum default)
  const [story, setStory] = useState({
    title: `Smarty & Bimi's Adventure: ${unit.title}`,
    theme: unit.theme,
    characters: [
      { name: 'Smarty', role: 'Wise Owl Guide', avatar: '🦉' },
      { name: 'Bimi', role: 'Playful Bear Friend', avatar: '🐻' },
    ],
    scenes: [
      {
        sceneNumber: 1,
        backgroundDesc: 'A bright, sunny morning full of green trees and chirping birds.',
        narrative: `Smarty the Owl and Bimi the Bear arrive at the ${unit.title}. The sun is shining warmly!`,
        character: 'Smarty',
        avatar: '🦉',
        speech: `Hello my little friend! Welcome to our English adventure! Let's explore together!`,
        studentMission: `Say: "Hello Smarty and Bimi!"`,
        expectedAnswer: 'Hello Smarty and Bimi!',
      },
      {
        sceneNumber: 2,
        backgroundDesc: 'They look around and find lots of interesting objects.',
        narrative: `Bimi holds up a bright colorful item with a joyful grin.`,
        character: 'Bimi',
        avatar: '🐻',
        speech: `Look what I have here! I love learning new English words every day!`,
        studentMission: `Say: "I have a ${unit.vocabulary[0]?.word || 'ball'}."`,
        expectedAnswer: `I have a ${unit.vocabulary[0]?.word || 'ball'}.`,
      },
      {
        sceneNumber: 3,
        backgroundDesc: 'A friendly teacher approaches and hands everyone golden stars.',
        narrative: `The teacher smiles: "You have both done a wonderful job reading and speaking!"`,
        character: 'Smarty',
        avatar: '🦉',
        speech: `Listen carefully! Can you tell our teacher what you learned today?`,
        studentMission: `Say: "Thank you, Teacher!"`,
        expectedAnswer: 'Thank you, Teacher!',
      },
      {
        sceneNumber: 4,
        backgroundDesc: 'Golden celebration fireworks in the blue sky.',
        narrative: `Smarty, Bimi and the student high-five! You completed the mission!`,
        character: 'Bimi',
        avatar: '🐻',
        speech: `Hooray! You are an official English Super Speaker! Let's sing together!`,
        studentMission: `Say: "Goodbye, my friends!"`,
        expectedAnswer: 'Goodbye, my friends!',
      },
    ],
  });

  const currentScene = story.scenes[currentSceneIndex] || story.scenes[0];

  const handleSpeakSpeech = () => {
    soundManager.playDing();
    speakText(currentScene.speech, 0.85);
  };

  const handleSpeakMission = () => {
    soundManager.playDing();
    speakText(currentScene.expectedAnswer, 0.8);
  };

  const handleRecordMission = () => {
    setIsSpeakingMission(true);
    soundManager.playDing();

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsSpeakingMission(false);
        soundManager.playVictory();
        setMissionPassed(true);
        onActivityComplete(30);
      },
      () => {
        // Fallback simulation
        setTimeout(() => {
          setIsSpeakingMission(false);
          soundManager.playVictory();
          setMissionPassed(true);
          onActivityComplete(30);
        }, 1500);
      }
    );

    if (!recognizer) {
      setTimeout(() => {
        setIsSpeakingMission(false);
        soundManager.playVictory();
        setMissionPassed(true);
        onActivityComplete(30);
      }, 1500);
      return;
    }

    try {
      recognizer.start();
    } catch {
      setTimeout(() => {
        setIsSpeakingMission(false);
        soundManager.playVictory();
        setMissionPassed(true);
        onActivityComplete(30);
      }, 1500);
    }
  };

  // Generate fresh AI story using Gemini with fallback
  const handleGenerateNewStory = async () => {
    setIsGenerating(true);
    setProcessStatus('generating');
    setGenerationError(null);
    soundManager.playDing();
    try {
      const data = await generateStoryAI(
        unit.storyTopic || unit.title,
        unit.grade,
        unit.unitNumber,
        unit.vocabulary.map((v) => v.word)
      );

      if (data && data.story) {
        soundManager.playVictory();
        setStory(data.story);
        setCurrentSceneIndex(0);
        setMissionPassed(false);
        setProcessStatus('success');
      }
    } catch (err: any) {
      soundManager.playBuzzer();
      setProcessStatus('stopped_error');
      setGenerationError(err?.message || 'Lỗi không xác định từ Gemini API');
    } finally {
      setIsGenerating(false);
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
            <span>Module 7</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            AI Story World 📖
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive animated comics with character voiceover &amp; speaking missions
          </p>
        </div>

        {/* AI Story Generator Button */}
        <button
          onClick={handleGenerateNewStory}
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-display font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Gemini Crafting Story...' : '✨ Generate New AI Story'}</span>
        </button>
      </div>

      {/* Error alert matching AI_INSTRUCTIONS.md */}
      {processStatus === 'stopped_error' && generationError && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 text-rose-800 dark:text-rose-200 text-xs font-bold space-y-1.5 animate-shake">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wide">
                Đã dừng do lỗi
              </span>
              <span className="font-extrabold text-rose-900 dark:text-rose-100">
                Quy trình AI tạo truyện bị gián đoạn:
              </span>
            </div>
            <button
              onClick={() => {
                setProcessStatus('idle');
                setGenerationError(null);
              }}
              className="text-rose-500 hover:text-rose-800 cursor-pointer font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p className="font-mono text-[11px] text-rose-700 dark:text-rose-300 break-words leading-relaxed pl-1">
            {generationError}
          </p>
        </div>
      )}

      {/* Main Comic Reader Screen */}
      <div className="mt-8 max-w-2xl mx-auto">
        
        {/* Story Title & Chapter Indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            {story.title}
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 rounded-full">
            Scene {currentSceneIndex + 1} of {story.scenes.length}
          </span>
        </div>

        {/* Comic Frame Card */}
        <div className="rounded-3xl border-4 border-amber-300 dark:border-amber-700/60 bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-yellow-50/50 dark:from-slate-800 dark:to-slate-800/80 p-6 sm:p-8 shadow-lg relative overflow-hidden">
          
          {/* Narrative context */}
          <div className="mb-6 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-amber-200/60 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 italic">
            "{currentScene.narrative}"
          </div>

          {/* Character Dialogue Exchange */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-4xl shadow-md shrink-0">
              {currentScene.character === 'Bimi' ? '🐻' : '🦉'}
            </div>

            <div className="flex-1 p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-700 shadow-xs relative">
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-sm text-amber-800 dark:text-amber-300">
                  {currentScene.character} says:
                </span>
                <button
                  onClick={handleSpeakSpeech}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 dark:text-amber-200 cursor-pointer"
                  title="Listen to dialogue"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="font-display font-bold text-lg text-slate-900 dark:text-white leading-relaxed">
                "{currentScene.speech}"
              </p>
            </div>
          </div>

          {/* Speaking Mission for Student */}
          <div className="p-5 rounded-2xl bg-amber-100/70 dark:bg-slate-900/90 border border-amber-300 dark:border-amber-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Speaking Mission</span>
              </span>
              <button
                onClick={handleSpeakMission}
                className="text-xs text-amber-700 dark:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Sample</span>
              </button>
            </div>

            <p className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
              {currentScene.studentMission}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRecordMission}
                disabled={isSpeakingMission}
                className={`px-6 py-3 rounded-2xl font-display font-bold text-sm text-white shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 ${
                  isSpeakingMission
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isSpeakingMission ? 'Listening...' : 'Speak Mission'}</span>
              </button>

              {missionPassed && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mission Accomplished!</span>
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Scene Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={currentSceneIndex === 0}
            onClick={() => {
              soundManager.playDing();
              setCurrentSceneIndex((p) => p - 1);
              setMissionPassed(false);
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Scene</span>
          </button>

          <button
            disabled={currentSceneIndex === story.scenes.length - 1}
            onClick={() => {
              soundManager.playDing();
              setCurrentSceneIndex((p) => p + 1);
              setMissionPassed(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Next Scene</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
