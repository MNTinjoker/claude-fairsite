import React from 'react';
import { GameMode, GameStats, LanguageMode } from '../types/game';
import { Volume2, VolumeX, Pause, Play, Home } from 'lucide-react';

interface Props {
  mode: GameMode;
  stats: GameStats;
  totalWords: number;
  placedCount: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  lang: LanguageMode;
  onToggleLang: (lang: LanguageMode) => void;
  onOpenIntro: () => void;
  lives?: number;
  timeRemaining?: number;
  isPaused?: boolean;
}

export const GameHUD: React.FC<Props> = ({
  stats,
  totalWords,
  placedCount,
  isMuted,
  onToggleSound,
  onPause,
  lang,
  onToggleLang,
  onOpenIntro,
  isPaused = false,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      className="relative w-full px-2 sm:px-8 pt-3 sm:pt-4 pb-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 z-30 select-none"
    >
      {/* Home Button (rounded-[9px] - 20% less round) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenIntro}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[9px] bg-[#0f1f23]/90 hover:bg-[#152c32] border border-white/15 hover:border-emerald-400/30 text-slate-300 hover:text-white transition-all duration-150 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
          title={lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
        >
          <Home className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline font-tech text-xs font-semibold tracking-wider uppercase">
            {lang === 'fa' ? 'صفحه اصلی' : 'HOME'}
          </span>
        </button>
        <img src="logo.png" alt="Pars Project" className="h-9 sm:h-12 shrink-0 drop-shadow-[0_0_10px_rgba(57,255,106,0.4)]" />
      </div>

      {/* TOP CENTER: FLOATING GLASS CAPSULE HUD WITH 20% LESS ROUND CORNERS (rounded-[14px]) */}
      <div className="flex-1 flex justify-center order-3 sm:order-2 w-full sm:w-auto">
        <div className="inline-flex items-center rounded-[14px] bg-[#122327]/90 border border-emerald-400/25 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] px-3 sm:px-6 py-1.5 sm:py-2">
          {/* Placed metric */}
          <div className="flex items-center gap-1 px-2 sm:px-3.5 font-tech text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-slate-200">
            <span className="text-emerald-400 font-bold">
              {lang === 'fa' ? 'جایگذاری:' : 'PLACED:'}
            </span>
            <span className="text-white font-bold font-mono">
              {placedCount}/{totalWords}
            </span>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-3 sm:h-3.5 bg-white/15" />

          {/* Score metric */}
          <div className="flex items-center gap-1 px-2 sm:px-3.5 font-tech text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-slate-200">
            <span className="text-emerald-400 font-bold">
              {lang === 'fa' ? 'امتیاز:' : 'SCORE:'}
            </span>
            <span className="text-white font-bold font-mono">
              {stats.score}
            </span>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-3 sm:h-3.5 bg-white/15" />

          {/* Timer metric */}
          <div className="flex items-center gap-1 px-2 sm:px-3.5 font-tech text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-slate-200">
            <span className="text-emerald-400 font-bold">
              {lang === 'fa' ? 'زمان:' : 'TIMER:'}
            </span>
            <span className="text-white font-bold font-mono">
              {formatTime(stats.elapsedSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: Dark glass controls (rounded-[9px]) */}
      <div className="flex items-center gap-1.5 sm:gap-2 order-2 sm:order-3">
        {/* Language switch */}
        <button
          onClick={() => onToggleLang(lang === 'fa' ? 'en' : 'fa')}
          className="px-2 sm:px-2.5 py-1.5 rounded-[9px] bg-[#0f1f23]/90 hover:bg-[#152c32] border border-white/15 hover:border-emerald-400/30 text-slate-300 hover:text-white font-tech text-xs font-semibold tracking-wider transition-all duration-150 backdrop-blur-md cursor-pointer"
          title="Toggle Language"
        >
          {lang === 'fa' ? 'EN' : 'فا'}
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 sm:p-2 rounded-[9px] bg-[#0f1f23]/90 hover:bg-[#152c32] border border-white/15 hover:border-emerald-400/30 text-slate-300 hover:text-white transition-all duration-150 backdrop-blur-md cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />}
        </button>

        {/* Pause button */}
        <button
          onClick={onPause}
          className="p-1.5 sm:p-2 rounded-[9px] bg-[#0f1f23]/90 hover:bg-[#152c32] border border-white/15 hover:border-emerald-400/30 text-slate-300 hover:text-white transition-all duration-150 backdrop-blur-md cursor-pointer"
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        </button>
      </div>
    </header>
  );
};
