import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { speakText, soundManager } from '../../utils/audio';

interface MascotProps {
  type?: 'smarty' | 'bimi';
  message: string;
  audioText?: string;
  showAudioButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Mascot: React.FC<MascotProps> = ({
  type = 'smarty',
  message,
  audioText,
  showAudioButton = true,
  size = 'md',
}) => {
  const isSmarty = type === 'smarty';

  const avatar = isSmarty ? '🦉' : '🐻';
  const name = isSmarty ? 'Smarty the Owl' : 'Bimi the Bear';
  const role = isSmarty ? 'Wise Study Coach' : 'Playful Friend';
  const bgColor = isSmarty
    ? 'from-amber-400 to-orange-500 text-amber-950'
    : 'from-blue-400 to-indigo-500 text-indigo-950';

  const handleSpeak = () => {
    soundManager.playDing();
    speakText(audioText || message);
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-slate-800/80 dark:to-slate-800/60 rounded-3xl border-2 border-amber-200/80 dark:border-slate-700 shadow-xs relative">
      {/* Mascot Avatar */}
      <div
        onClick={handleSpeak}
        title="Click me to speak!"
        className="relative group cursor-pointer shrink-0"
      >
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${bgColor} flex items-center justify-center text-3xl shadow-md transform group-hover:scale-110 transition-transform`}
        >
          <span>{avatar}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-900 rounded-full border border-amber-300 dark:border-amber-600 flex items-center justify-center text-[10px] shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
              {name}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              · {role}
            </span>
          </div>

          {showAudioButton && (
            <button
              onClick={handleSpeak}
              title="Listen to mascot"
              className="p-1.5 rounded-full hover:bg-amber-200/60 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
          "{message}"
        </p>
      </div>
    </div>
  );
};
