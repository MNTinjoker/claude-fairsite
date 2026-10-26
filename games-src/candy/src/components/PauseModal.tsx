import React, { useEffect } from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Globe } from 'lucide-react';
import { GAME_LOGO_SRC } from './KardoneLogo';
import { sound } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface PauseModalProps {
  lang: Language;
  onToggleLang: () => void;
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  lang,
  onToggleLang,
  isOpen,
  onResume,
  onRestart,
  onQuit,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(sound.isMuted());

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010503]/85 backdrop-blur-md animate-in fade-in duration-150 select-none ${
        isFa ? 'font-persian' : ''
      }`}
    >
      <div className="w-full max-w-xs bg-gradient-to-b from-[#082016] via-[#04120c] to-[#020805] border-2 border-[#00ff66]/50 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(0,255,102,0.25)] text-emerald-50">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-black border-2 border-[#00ff66]/70 shadow-[0_0_20px_rgba(0,255,102,0.35)] overflow-hidden flex items-center justify-center">
          <img
            src={GAME_LOGO_SRC}
            alt="Candy Logo"
            className="w-full h-full object-contain p-1"
          />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-5">
          {t.pauseTitle}
        </h2>

        {/* Working Quick Toggles */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-[#00ff66]/15 border-[#00ff66] text-[#00ff66]'
                : 'bg-[#030c08] border-emerald-900 text-emerald-600'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? t.audioOff : t.audioOn}</span>
          </button>

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border bg-[#071c13] border-[#00ff66]/60 text-[#00ff66] hover:bg-[#0d3322] transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{t.langToggleLabel}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#00ff66] via-[#10b981] to-[#a3e635] text-[#020805] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.resumeBtn}</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#071c13] hover:bg-[#0c2e1f] border border-emerald-500/40 text-emerald-100 font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#00ff66]" />
            <span>{t.restartBtn}</span>
          </button>

          <button
            onClick={onQuit}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#030c08] hover:bg-[#071c13] text-emerald-400 hover:text-white font-bold rounded-xl border border-emerald-900/60 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t.mainMenuBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
