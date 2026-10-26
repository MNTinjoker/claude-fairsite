import React from 'react';
import { GameMetrics, GameState } from '../game/types';
import { Play, RotateCcw, Home, Trophy, Award, Flame, Target } from 'lucide-react';

interface StatusModalsProps {
  state: GameState;
  metrics: GameMetrics;
  onResume: () => void;
  onRestart: () => void;
  onNextLevel: () => void;
  onToTitle: () => void;
  lang: 'fa' | 'en';
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
}

export const StatusModals: React.FC<StatusModalsProps> = ({
  state,
  metrics,
  onResume,
  onRestart,
  onNextLevel,
  onToTitle,
  lang,
  onOpenGuide,
  onOpenSettings
}) => {
  if (state === 'title' || state === 'playing') return null;

  const isFa = lang === 'fa';
  const isNewHighScore = metrics.score > 0 && metrics.score >= metrics.highScore;

  return (
    <div 
      className={`fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none ${isFa ? 'font-vazir' : ''}`}
      dir={isFa ? 'rtl' : 'ltr'}
    >
      {/* PAUSE MODAL */}
      {state === 'paused' && (
        <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center mb-4 text-cyan-400">
            <span className="font-arcade text-lg font-bold">||</span>
          </div>

          <h2 className={`text-xl font-bold tracking-wider mb-2 ${isFa ? 'font-vazir text-cyan-400' : 'font-arcade text-slate-100'}`}>
            {isFa ? 'بازی متوقف شد' : 'GAME PAUSED'}
          </h2>
          <p className="text-xs text-slate-400 mb-6 font-vazir">
            {isFa ? 'برای ادامه کلید Space یا دکمه زیر را فشار دهید' : 'Press Space to Resume or choose an option'}
          </p>

          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={onResume}
              data-start="true"
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                isFa ? 'font-vazir text-sm' : 'font-arcade text-xs'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isFa ? 'ادامه بازی' : 'RESUME'}</span>
            </button>

            <button
              onClick={onRestart}
              className={`w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700 ${
                isFa ? 'font-vazir text-xs' : 'font-arcade text-xs'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isFa ? 'شروع مجدد' : 'RESTART RUN'}</span>
            </button>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="w-full py-2 rounded-xl bg-slate-950/50 hover:bg-slate-800 text-slate-300 hover:text-white font-medium transition cursor-pointer flex items-center justify-center gap-2 border border-slate-800 text-xs font-vazir"
              >
                <span>⚙️</span>
                <span>{isFa ? 'تنظیمات ظاهر و پس‌زمینه' : 'Visual Settings'}</span>
              </button>
            )}

            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="w-full py-2 rounded-xl bg-slate-950/50 hover:bg-slate-800 text-slate-300 hover:text-white font-medium transition cursor-pointer flex items-center justify-center gap-2 border border-slate-800 text-xs font-vazir"
              >
                <span>📖</span>
                <span>{isFa ? 'راهنمای پاورآپ‌ها و بازی' : 'Game Guide'}</span>
              </button>
            )}

            <button
              onClick={onToTitle}
              className={`w-full py-2.5 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
                isFa ? 'font-vazir text-xs' : 'font-arcade text-xs'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{isFa ? 'منوی اصلی' : 'MAIN MENU'}</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER (DEFEAT) MODAL */}
      {state === 'gameover' && (
        <div className="w-full max-w-sm bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center mb-3 text-red-400">
            <Flame className="w-6 h-6" />
          </div>

          <h2 className={`text-xl font-bold tracking-wider mb-1 text-red-400 ${isFa ? 'font-vazir' : 'font-arcade'}`}>
            {isFa ? 'شکست خوردی!' : 'GAME OVER'}
          </h2>
          <p className="text-xs text-slate-400 mb-5 font-vazir">
            {isFa ? 'تمام جان‌های راکت به پایان رسید' : 'All Vaus units destroyed in sector'}
          </p>

          {/* High Score Banner */}
          {isNewHighScore && (
            <div className="w-full mb-4 py-1.5 px-3 rounded-lg bg-amber-950/50 border border-amber-500/50 text-amber-300 text-xs flex items-center justify-center gap-1.5 animate-pulse">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className={isFa ? 'font-vazir font-bold' : 'font-arcade'}>
                {isFa ? 'رکورد جدید ثبت شد!' : 'NEW HIGH SCORE!'}
              </span>
            </div>
          )}

          {/* Stat Tiles */}
          <div className="w-full grid grid-cols-2 gap-2 mb-6 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'امتیاز نهایی' : 'FINAL SCORE'}</span>
              <span className="font-arcade text-cyan-400 text-sm font-bold tabular-nums arcade-num">
                {metrics.score.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'بخش رسیده' : 'SECTOR'}</span>
              <span className="font-arcade text-pink-400 text-sm font-bold tabular-nums arcade-num">
                {metrics.level}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'آجرها شکسته' : 'BRICKS'}</span>
              <span className="font-arcade text-emerald-400 text-sm font-bold tabular-nums arcade-num">
                {metrics.bricksDestroyed}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'بزرگترین کمبو' : 'MAX COMBO'}</span>
              <span className="font-arcade text-amber-400 text-sm font-bold tabular-nums arcade-num">
                x{metrics.highestCombo}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={onRestart}
              data-start="true"
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 ${
                isFa ? 'font-vazir text-sm' : 'font-arcade text-xs'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isFa ? 'تلاش دوباره' : 'TRY AGAIN'}</span>
            </button>

            <button
              onClick={onToTitle}
              className={`w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700 ${
                isFa ? 'font-vazir text-xs' : 'font-arcade text-xs'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{isFa ? 'منوی اصلی' : 'MAIN MENU'}</span>
            </button>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {state === 'victory' && (
        <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mb-3 text-emerald-400">
            <Award className="w-6 h-6 animate-bounce" />
          </div>

          <h2 className={`text-xl font-bold tracking-wider mb-1 text-emerald-400 ${isFa ? 'font-vazir' : 'font-arcade'}`}>
            {isFa ? 'پیروزی کامل!' : 'VICTORY!'}
          </h2>
          <p className="text-xs text-slate-400 mb-5 font-vazir">
            {isFa ? 'تمام بخش‌ها با موفقیت پاکسازی شدند!' : 'All sectors cleared! The galaxy is liberated!'}
          </p>

          {/* Stat Tiles */}
          <div className="w-full grid grid-cols-2 gap-2 mb-6 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'امتیاز نهایی' : 'TOTAL SCORE'}</span>
              <span className="font-arcade text-cyan-400 text-sm font-bold tabular-nums arcade-num">
                {metrics.score.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'آجرهای منهدم' : 'BRICKS CLEARED'}</span>
              <span className="font-arcade text-pink-400 text-sm font-bold tabular-nums arcade-num">
                {metrics.bricksDestroyed}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'جان‌های باقیمانده' : 'LIVES REMAINING'}</span>
              <span className="font-arcade text-emerald-400 text-sm font-bold tabular-nums arcade-num">
                {metrics.lives}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-slate-400 text-[11px] mb-1 font-vazir">{isFa ? 'بزرگترین کمبو' : 'MAX COMBO'}</span>
              <span className="font-arcade text-amber-400 text-sm font-bold tabular-nums arcade-num">
                x{metrics.highestCombo}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5">

            <button
              onClick={onToTitle}
              className={`w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer flex items-center justify-center gap-2 border border-slate-700 ${
                isFa ? 'font-vazir text-xs' : 'font-arcade text-xs'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{isFa ? 'منوی اصلی' : 'MAIN MENU'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
