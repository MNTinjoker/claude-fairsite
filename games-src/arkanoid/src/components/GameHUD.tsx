import React from 'react';
import { GameMetrics, PowerUpType } from '../game/types';
import { Volume2, VolumeX, Pause, Tv, BookOpen, Sliders, Activity } from 'lucide-react';

interface GameHUDProps {
  metrics: GameMetrics;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  lang: 'fa' | 'en';
  scanlines: boolean;
  onToggleScanlines: () => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
  onOpenDiagnostics?: () => void;
}

const POWERUP_NAMES: Record<PowerUpType, { nameEn: string; nameFa: string; color: string }> = {
  laser: { nameEn: 'LASER CANNON', nameFa: 'توپ لیزری', color: 'bg-red-500' },
  expand: { nameEn: 'EXPAND PADDLE', nameFa: 'افزایش طول راکت', color: 'bg-blue-500' },
  catch: { nameEn: 'MAGNET CATCH', nameFa: 'آهن‌ربا و گیرنده', color: 'bg-emerald-500' },
  slow: { nameEn: 'SLOW MOTION', nameFa: 'کاهش سرعت توپ', color: 'bg-amber-500' },
  multiball: { nameEn: 'MULTI-BALL', nameFa: 'توپ سه‌گانه', color: 'bg-cyan-500' },
  fireball: { nameEn: 'PLASMA FIREBALL', nameFa: 'توپ آتشین نفوذی', color: 'bg-orange-500' },
  life: { nameEn: '1-UP LIFE', nameFa: 'جان اضافه', color: 'bg-slate-300' },
  warp: { nameEn: 'WARP PORTAL', nameFa: 'پرتال جهش', color: 'bg-purple-500' },
};

export const GameHUD: React.FC<GameHUDProps> = ({
  metrics,
  isMuted,
  onToggleMute,
  onPause,
  lang,
  scanlines,
  onToggleScanlines,
  onOpenGuide,
  onOpenSettings,
  onOpenDiagnostics
}) => {
  const isFa = lang === 'fa';
  const activePowerInfo = metrics.activePowerUp ? POWERUP_NAMES[metrics.activePowerUp] : null;
  const hasDiagnosticAlert = Boolean(metrics.diagnostics?.lastError || (metrics.diagnostics?.recoveryCount || 0) > 0);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-3 sm:p-4 ${isFa ? 'font-vazir' : ''}`}
      dir={isFa ? 'rtl' : 'ltr'}
    >
      {/* Top Perimeter Status Cluster */}
      <div className="relative w-full flex items-center justify-between text-xs sm:text-sm">
        <img src="logo.png" alt="Pars Project" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 sm:h-11 opacity-90" />
        {/* Score & Combo */}
        <div className="flex flex-col bg-slate-950/80 border border-slate-800/80 rounded-lg px-3 py-1.5 backdrop-blur-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-xs tracking-wider">
              {isFa ? 'امتیاز' : 'SCORE'}
            </span>
            <span className="arcade-num text-cyan-400 font-bold tabular-nums text-sm sm:text-base">
              {metrics.score.toLocaleString()}
            </span>
          </div>
          {metrics.combo > 1 && (
            <div className="text-[10px] sm:text-xs text-amber-400 font-bold flex items-center gap-1 mt-0.5 arcade-num">
              <span>COMBO</span>
              <span>x{metrics.combo}</span>
            </div>
          )}
        </div>

        {/* Lives (Mini Vaus Icons) & Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Lives socket */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
            {Array.from({ length: Math.max(0, metrics.lives) }).map((_, i) => (
              <div 
                key={i} 
                className="w-4 sm:w-5 h-1.5 sm:h-2 rounded-xs bg-cyan-400 shadow-xs shadow-cyan-400/80 border border-cyan-200"
                title="Life"
              />
            ))}
            {metrics.lives <= 0 && (
              <span className="text-red-400 text-[10px] font-arcade">0</span>
            )}
          </div>

          {/* Diagnostics button */}
          {onOpenDiagnostics && (
            <button
              onClick={(e) => {
                onOpenDiagnostics();
                e.currentTarget.blur();
              }}
              tabIndex={-1}
              className={`hidden sm:block p-1.5 rounded-lg border transition cursor-pointer relative ${
                hasDiagnosticAlert
                  ? 'bg-amber-950/70 border-amber-500 text-amber-300 animate-pulse'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400'
              }`}
              aria-label="پایش سیستم / Diagnostics"
              title={isFa ? 'پایش عیب‌یابی و پایداری' : 'System Diagnostics'}
            >
              <Activity className="w-3.5 h-3.5" />
              {hasDiagnosticAlert && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
              )}
            </button>
          )}

          {/* Guide button */}
          {onOpenGuide && (
            <button
              onClick={(e) => {
                onOpenGuide();
                e.currentTarget.blur();
              }}
              tabIndex={-1}
              className="hidden sm:block p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
              aria-label="راهنما / Guide"
              title="Game Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          {/* Settings button */}
          {onOpenSettings && (
            <button
              onClick={(e) => {
                onOpenSettings();
                e.currentTarget.blur();
              }}
              tabIndex={-1}
              className="hidden sm:block p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-pink-400 transition cursor-pointer"
              aria-label="تنظیمات / Settings"
              title="Settings"
            >
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
            </button>
          )}

          {/* CRT scanline toggle */}
          <button
            onClick={(e) => {
              onToggleScanlines();
              e.currentTarget.blur();
            }}
            tabIndex={-1}
            className={`hidden sm:block p-1.5 rounded-lg border transition cursor-pointer ${
              scanlines ? 'bg-cyan-950/50 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            aria-label="CRT Mode"
            title="CRT Scanlines"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Mute button */}
          <button
            onClick={(e) => {
              onToggleMute();
              e.currentTarget.blur();
            }}
            tabIndex={-1}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
            aria-label={isMuted ? 'صدا وصل' : 'قطع صدا'}
            title="Mute / Unmute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Pause button */}
          <button
            onClick={(e) => {
              onPause();
              e.currentTarget.blur();
            }}
            tabIndex={-1}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
            aria-label="توقف / Pause"
            title="Pause (P / Esc)"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Power-up Pill Banner */}
      {activePowerInfo && (
        <div className="self-center mb-16 pointer-events-none">
          <div className="flex flex-col items-center bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-lg">
            <div className={`flex items-center gap-2 ${isFa ? 'font-vazir text-xs font-bold' : 'font-arcade text-xs font-bold tracking-wider'} text-slate-200`}>
              <span className={`w-2.5 h-2.5 rounded-full ${activePowerInfo.color} animate-pulse`} />
              <span>{isFa ? activePowerInfo.nameFa : activePowerInfo.nameEn}</span>
            </div>
            {/* Countdown Progress Bar */}
            <div className="w-28 sm:w-36 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full ${activePowerInfo.color} transition-all duration-100`}
                style={{ width: `${Math.min(100, (metrics.powerUpTimeLeft / 16) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty bottom spacer to allow unobstructed view */}
      <div />
    </div>
  );
};
