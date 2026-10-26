import React, { useEffect } from 'react';
import { Play, Volume2, VolumeX, Globe } from 'lucide-react';
import { KardoneLogo } from './KardoneLogo';
import { KardoneGem } from './KardoneGem';
import { GameMode, GemType } from '../types/game';
import { sound } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface TitleScreenProps {
  lang: Language;
  onToggleLang: () => void;
  onStartGame: (mode: GameMode) => void;
}

/**
 * 5 Gems ordered so from RIGHT to LEFT they read:
 * 1. chatit (rightmost - c_gem)
 * 2. tm (2nd from right - tm_gem)
 * 3. portal (3rd from right / middle - waves_gem)
 * 4. pm (4th from right - rm_gem)
 * 5. kardone (leftmost - k_gem)
 */
const LOGO_SHOWCASE: { type: GemType; label: string }[] = [
  { type: 'k_gem', label: 'kardone' },
  { type: 'rm_gem', label: 'pm' },
  { type: 'waves_gem', label: 'portal' },
  { type: 'tm_gem', label: 'tm' },
  { type: 'c_gem', label: 'chatit' },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  lang,
  onToggleLang,
  onStartGame,
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

  // Keyboard shortcut: Space or Enter starts game immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onStartGame('RUSH');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      className={`relative w-full h-screen overflow-hidden flex flex-col justify-between items-center px-4 py-6 text-emerald-50 z-10 ${
        isFa ? 'font-persian' : ''
      }`}
    >
      {/* Clean Top Bar with only working controls */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between">
        <div dir="ltr">
          <KardoneLogo size={42} showWordmark={true} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#071c13] hover:bg-[#0d3322] border border-[#00ff66]/60 text-[#00ff66] text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.2)] transition-all active:scale-95 cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{t.langToggleLabel}</span>
          </button>

          <button
            onClick={handleToggleSound}
            aria-label="Toggle sound"
            className="w-10 h-10 rounded-xl bg-[#071c13] hover:bg-[#0d3322] border border-emerald-500/40 text-emerald-300 hover:border-[#00ff66] hover:text-[#00ff66] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-emerald-600" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Center Hero Section — Clean & Focused */}
      <main className="relative z-10 flex flex-col items-center justify-center max-w-md w-full text-center my-auto gap-7">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,255,102,0.35)]">
          {t.titlePart1}{' '}
          <span className="text-[#00ff66]">
            {t.titlePart2}
          </span>
        </h1>

        {/* 5 Gems Showcase (Right to Left: chatit, tm, portal, pm, kardone) */}
        <div
          dir="ltr"
          className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
        >
          {LOGO_SHOWCASE.map((item) => (
            <div
              key={item.type}
              className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 duration-150"
            >
              <div className="p-1.5 rounded-2xl bg-gradient-to-b from-[#0b291c] to-[#04110b] border border-emerald-500/45 shadow-[0_0_18px_rgba(0,255,102,0.2)]">
                <KardoneGem type={item.type} size={52} />
              </div>
              <span className="text-xs font-mono font-bold lowercase tracking-wider text-emerald-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Start Button ("START" / "بازی رو شروع کن!") */}
        <button
          onClick={() => onStartGame('RUSH')}
          className="group relative inline-flex items-center justify-center gap-3 w-full max-w-xs py-4 px-8 bg-gradient-to-r from-[#00ff66] via-[#10b981] to-[#a3e635] hover:from-[#34d399] hover:to-[#bef264] text-[#020805] text-xl font-black rounded-2xl shadow-[0_0_32px_rgba(0,255,102,0.5)] transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current shrink-0" />
          <span>{t.launchBtn}</span>
        </button>
      </main>

      {/* Minimal Bottom Spacer to keep hero vertically centered */}
      <div className="h-6" />
    </div>
  );
};
