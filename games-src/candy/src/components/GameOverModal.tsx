import React from 'react';
import { RotateCcw, Home, Flame, Zap, Timer } from 'lucide-react';
import { GAME_LOGO_SRC } from './KardoneLogo';
import { Language, TRANSLATIONS, formatNumber } from '../utils/i18n';

interface GameOverModalProps {
  lang: Language;
  isOpen: boolean;
  score: number;
  maxCombo: number;
  movesLeft: number;
  timeLeft: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  lang,
  isOpen,
  score,
  maxCombo,
  movesLeft,
  timeLeft,
  onPlayAgain,
  onMainMenu,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const isFa = lang === 'fa';
  const movesUsed = Math.max(0, 30 - movesLeft);

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010503]/85 backdrop-blur-md animate-in fade-in duration-200 select-none ${
        isFa ? 'font-persian' : ''
      }`}
    >
      <div className="w-full max-w-sm bg-gradient-to-b from-[#082016] via-[#04120c] to-[#020805] border-2 border-[#00ff66]/55 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(0,255,102,0.28)] relative overflow-hidden text-emerald-50">
        {/* Ambient Cyber Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-24 bg-[#00ff66]/15 blur-2xl pointer-events-none" />

        {/* Official Game Logo Emblem */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-black border-2 border-[#00ff66] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.35)] overflow-hidden">
          <img
            src={GAME_LOGO_SRC}
            alt="Candy Logo"
            className="w-full h-full object-contain p-1"
          />
        </div>

        {/* Main End Message: "عالی بازی کردی!" */}
        <h2
          dir="rtl"
          className="font-persian text-3xl sm:text-4xl font-black tracking-tight text-white mb-5 drop-shadow-[0_0_16px_rgba(0,255,102,0.4)]"
        >
          عالی بازی کردی!
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#030c08]/90 border border-emerald-500/30 rounded-2xl mb-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400">
              {t.hudScore}
            </div>
            <div className="text-xl sm:text-2xl font-black tabular-nums text-[#00ff66] mt-0.5">
              {formatNumber(score, lang)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400">
              {t.statMovesTime}
            </div>
            <div
              dir="ltr"
              className="text-sm font-black tabular-nums text-white mt-1.5 flex items-center justify-center gap-1"
            >
              <span className="flex items-center gap-0.5 text-emerald-200">
                <Zap className="w-3.5 h-3.5 text-[#00ff66]" />
                {formatNumber(movesUsed, lang)}
              </span>
              <span className="text-emerald-600">·</span>
              <span className="flex items-center gap-0.5 text-[#a3e635]">
                <Timer className="w-3.5 h-3.5" />
                {formatNumber(timeLeft, lang)}s
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400">
              {t.statMaxCombo}
            </div>
            <div
              dir="ltr"
              className="text-xl sm:text-2xl font-black tabular-nums text-[#a3e635] mt-0.5 flex items-center justify-center gap-0.5"
            >
              <Flame className="w-4 h-4" />
              <span>{formatNumber(maxCombo, lang)}x</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-[#00ff66] via-[#10b981] to-[#a3e635] text-[#020805] font-black text-base rounded-xl transition-all shadow-[0_0_24px_rgba(0,255,102,0.35)] cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.playAgainBtn}</span>
          </button>

          <button
            onClick={onMainMenu}
            className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-[#030c08] hover:bg-[#071c13] text-emerald-300 hover:text-white font-bold text-sm rounded-xl border border-emerald-800/60 transition-colors cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>{t.mainMenuShort}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
