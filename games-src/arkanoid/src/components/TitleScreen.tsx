import React from 'react';
import { Play, Volume2, VolumeX, BookOpen, Sliders, Trophy, Tv } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  highScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: 'fa' | 'en';
  onToggleLang: () => void;
  scanlines: boolean;
  onToggleScanlines: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  highScore,
  isMuted,
  onToggleMute,
  lang,
  onToggleLang,
  scanlines,
  onToggleScanlines,
  onOpenGuide,
  onOpenSettings
}) => {
  const isFa = lang === 'fa';

  return (
    <div 
      className={`absolute inset-0 flex flex-col items-center justify-between p-6 z-20 pointer-events-auto bg-slate-950/80 backdrop-blur-xs select-none ${isFa ? 'font-vazir' : ''}`}
      dir={isFa ? 'rtl' : 'ltr'}
    >
      {/* Top Bar Utilities */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/80 hover:border-cyan-500 hover:text-cyan-400 transition cursor-pointer text-xs font-semibold font-arcade flex items-center gap-1.5"
            aria-label="Toggle Language"
          >
            <span>{isFa ? 'EN' : 'FA'}</span>
            <span className="text-[10px] text-slate-400">🌐</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/80 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            aria-label="راهنمای بازی / Game Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFa ? 'راهنما' : 'Guide'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/80 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            aria-label="تنظیمات / Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span>{isFa ? 'تنظیمات' : 'Settings'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleScanlines}
            className={`px-2.5 py-1.5 rounded border transition cursor-pointer flex items-center gap-1.5 ${
              scanlines ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            aria-label="CRT Scanlines"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CRT {scanlines ? (isFa ? 'روشن' : 'ON') : (isFa ? 'خاموش' : 'OFF')}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 transition cursor-pointer"
            aria-label={isMuted ? 'صدا وصل' : 'قطع صدا'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Main Centerpiece: Bespoke Title Lockup */}
      <div className="flex flex-col items-center text-center my-auto max-w-lg">
        <img src="logo.png" alt="Pars Project" className="h-16 sm:h-20 mb-4 drop-shadow-[0_0_12px_rgba(57,255,106,0.4)]" />
        {/* Retro SVG Emblem */}
        <div className="relative mb-6">
          <svg className="w-64 sm:w-84 h-24 sm:h-28" viewBox="0 0 340 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arkanoidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background Vaus paddle with ball resting directly on top */}
            <rect x="70" y="78" width="200" height="12" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <rect x="66" y="79" width="8" height="10" rx="3" fill="#ef4444" />
            <rect x="266" y="79" width="8" height="10" rx="3" fill="#ef4444" />
            <line x1="140" y1="84" x2="200" y2="84" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            {/* Energy ball resting on paddle (paddle top is y=78, ball r=7, cy=71) */}
            <circle cx="170" cy="71" r="7" fill="#ffffff" filter="url(#neonGlow)" />
            <circle cx="170" cy="71" r="5" fill="#38bdf8" opacity="0.8" />
            <circle cx="168" cy="69" r="2" fill="#ffffff" />
            {/* Title Text */}
            <text
              x="170"
              y="50"
              textAnchor="middle"
              className="font-arcade"
              fill="url(#arkanoidGrad)"
              filter="url(#neonGlow)"
              fontSize="34"
              letterSpacing="3"
            >
              ARKANOID
            </text>
          </svg>

        {/* Persian / English Sub-Emblem */}
        <div className={`mt-1 font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 ${
          isFa ? 'font-vazir text-base sm:text-lg tracking-wide' : 'font-arcade text-xs sm:text-sm tracking-widest'
        }`}>
          {isFa ? 'بازی کلاسیک پارانوئید (آرکانوید)' : 'RETRO SPACE BRICK BREAKER'}
        </div>
      </div>

      {/* High Score Badge */}
      {highScore > 0 && (
        <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 text-xs sm:text-sm">
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className={isFa ? 'font-vazir font-bold' : 'font-arcade'}>
            {isFa ? 'رکورد بازی: ' : 'HIGH SCORE: '}
          </span>
          <span className="font-bold text-amber-300 tabular-nums arcade-num">{highScore.toLocaleString()}</span>
        </div>
      )}

      {/* Start Game CTA */}
      <div className="flex flex-col items-center">
        <button
          onClick={onStart}
          data-start="true"
          className={`group relative px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3 border border-cyan-300/40 ${
            isFa ? 'font-vazir font-black text-base sm:text-lg' : 'font-arcade font-bold text-sm sm:text-base'
          }`}
        >
          <Play className="w-4 h-4 fill-current transition group-hover:translate-x-0.5" />
          <span>{isFa ? 'شروع بازی' : 'START GAME'}</span>
        </button>

        <p className="mt-3 text-xs text-slate-400 font-medium">
          {isFa ? 'برای شروع کلید Space، Enter یا دکمه بالا را بزنید' : 'Press Space, Enter or Tap Button to Start'}
        </p>
      </div>
      </div>

      {/* Flat Control Hints in Bottom Safe Margin */}
      <div className="w-full text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4 max-w-xl font-medium">
        {isFa ? (
          <p className="tracking-wide font-vazir leading-relaxed">
            ماوس یا لمس برای جابجایی · کلیک، لمس یا Space برای شلیک و پرتاب · کلید P برای توقف
          </p>
        ) : (
          <p className="tracking-wider font-medium">
            Mouse / Touch Move · Click / Space / Tap Launch & Fire · P / Esc Pause
          </p>
        )}
      </div>
    </div>
  );
};
