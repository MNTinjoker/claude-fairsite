import React from 'react';
import { Pause, Volume2, VolumeX, RotateCcw, Globe, Flame } from 'lucide-react';
import { GAME_LOGO_SRC } from './KardoneLogo';
import { sound } from '../utils/audio';
import { Language, TRANSLATIONS, formatNumber } from '../utils/i18n';

interface GameHUDProps {
  lang: Language;
  onToggleLang: () => void;
  boardSize: number;
  score: number;
  movesLeft: number;
  timeLeft: number;
  combo: number;
  onPause: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  lang,
  onToggleLang,
  boardSize,
  score,
  movesLeft,
  timeLeft,
  combo,
  onPause,
  onRestart,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(sound.isMuted());

  const t = TRANSLATIONS[lang];
  const isFa = lang === 'fa';

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playSwap();
    }
  };

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      style={{ width: boardSize }}
      className={`mx-auto flex flex-col gap-1.5 shrink-0 select-none z-20 ${
        isFa ? 'font-persian' : ''
      }`}
    >
      {/* Compact Header Row matched to exact GameBoard width */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black border border-[#00ff66]/60 shadow-[0_0_10px_rgba(0,255,102,0.3)] overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={GAME_LOGO_SRC}
              alt="Candy Logo"
              className="w-full h-full object-contain p-0.5 pointer-events-none"
            />
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight text-emerald-50">
            {t.titlePart1}{' '}
            <span className="text-[#00ff66]">{t.titlePart2}</span>
          </span>
        </div>

        {/* Clean Functional Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 h-8 bg-[#071c13] hover:bg-[#0c2e1f] border border-[#00ff66]/60 text-[#00ff66] rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.langToggleLabel}</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="w-8 h-8 rounded-xl bg-[#071c13] hover:bg-[#0c2e1f] border border-emerald-500/40 text-emerald-300 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-emerald-600" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onRestart}
            className="w-8 h-8 rounded-xl bg-[#071c13] hover:bg-[#0c2e1f] border border-emerald-500/40 text-[#a3e635] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPause}
            className="w-8 h-8 rounded-xl bg-[#071c13] hover:bg-[#0c2e1f] border border-emerald-500/40 text-emerald-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compact Scoreboard Pod — Strictly constrained to boardSize so it's never bigger than the game board */}
      <div className="grid grid-cols-4 gap-1.5 bg-gradient-to-b from-[#092217]/95 to-[#030c08]/95 border border-[#00ff66]/40 rounded-2xl p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        {/* Score */}
        <div className="flex flex-col items-center justify-center bg-[#030c08]/90 border border-emerald-500/20 rounded-xl px-1.5 py-1">
          <span className="text-[9px] font-bold uppercase text-emerald-400">
            {t.hudScore}
          </span>
          <span className="text-sm sm:text-base font-black tabular-nums text-white leading-tight">
            {formatNumber(score, lang)}
          </span>
        </div>

        {/* Combo */}
        <div className="flex flex-col items-center justify-center bg-[#030c08]/90 border border-emerald-500/20 rounded-xl px-1.5 py-1">
          <span className="text-[9px] font-bold uppercase text-[#a3e635]">
            {t.hudCombo}
          </span>
          <div className="flex items-center gap-0.5 leading-tight" dir="ltr">
            <span className="text-sm sm:text-base font-black tabular-nums text-[#00ff66]">
              {formatNumber(combo, lang)}x
            </span>
            {combo > 1 && <Flame className="w-3.5 h-3.5 text-[#a3e635] fill-current" />}
          </div>
        </div>

        {/* Static 30 Moves */}
        <div className="flex flex-col items-center justify-center bg-[#030c08]/90 border border-emerald-500/25 rounded-xl px-1.5 py-1">
          <span className="text-[9px] font-bold uppercase text-[#00ff66]">
            {t.hudMoves}
          </span>
          <div className="flex items-baseline gap-0.5 leading-tight" dir="ltr">
            <span
              className={`text-sm sm:text-base font-black tabular-nums ${
                movesLeft <= 5 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {formatNumber(movesLeft, lang)}
            </span>
            <span className="text-[9px] text-emerald-500">/{formatNumber(30, lang)}</span>
          </div>
        </div>

        {/* Static 60s Time */}
        <div className="flex flex-col items-center justify-center bg-[#030c08]/90 border border-emerald-500/25 rounded-xl px-1.5 py-1">
          <span className="text-[9px] font-bold uppercase text-[#a3e635]">
            {t.hudTime}
          </span>
          <div className="flex items-baseline gap-0.5 leading-tight" dir="ltr">
            <span
              className={`text-sm sm:text-base font-black tabular-nums ${
                timeLeft <= 10 ? 'text-rose-400' : 'text-white'
              }`}
            >
              {formatNumber(timeLeft, lang)}s
            </span>
            <span className="text-[9px] text-emerald-500">/{formatNumber(60, lang)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
