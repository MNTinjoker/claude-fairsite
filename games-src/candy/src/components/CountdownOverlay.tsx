import React, { useEffect, useState } from 'react';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { GAME_LOGO_SRC } from './KardoneLogo';
import { KardoneGem } from './KardoneGem';
import { GemType } from '../types/game';
import { sound } from '../utils/audio';
import { vibrationSystem } from '../utils/vibration';

interface CountdownOverlayProps {
  isActive: boolean;
  lang: Language;
  onComplete: () => void;
}

type CountdownStep = 3 | 2 | 1 | 'GO';

const COUNTDOWN_GEMS: { type: GemType; name: string }[] = [
  { type: 'k_gem', name: 'kardone' },
  { type: 'rm_gem', name: 'pm' },
  { type: 'waves_gem', name: 'portal' },
  { type: 'tm_gem', name: 'tm' },
  { type: 'c_gem', name: 'chatit' },
];

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  isActive,
  lang,
  onComplete,
}) => {
  const [step, setStep] = useState<CountdownStep>(3);

  useEffect(() => {
    if (!isActive) return;

    setStep(3);
    sound.playCountdownTick(3);
    vibrationSystem.triggerMatchVibration(3, 1);

    const t1 = setTimeout(() => {
      setStep(2);
      sound.playCountdownTick(2);
      vibrationSystem.triggerMatchVibration(3, 1);
    }, 520);

    const t2 = setTimeout(() => {
      setStep(1);
      sound.playCountdownTick(1);
      vibrationSystem.triggerMatchVibration(4, 1);
    }, 1040);

    const t3 = setTimeout(() => {
      setStep('GO');
      sound.playCountdownBoom();
      vibrationSystem.triggerMatchVibration(6, 2);
    }, 1560);

    const t4 = setTimeout(() => {
      onComplete();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const t = TRANSLATIONS[lang];
  const isGo = step === 'GO';

  // How many of the 5 gems are lit up at each step (from right to left: chatit, tm, portal, pm, kardone)
  const litThreshold = step === 3 ? 3 : step === 2 ? 1 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010704]/85 backdrop-blur-md select-none pointer-events-auto">
      {/* Main Cyberpunk Countdown Module Card */}
      <div
        key={`card-${step}`}
        className={`relative w-full max-w-xs rounded-3xl p-6 flex flex-col items-center text-center bg-gradient-to-b from-[#0a291c] via-[#05160f] to-[#020906] border-2 transition-all ${
          isGo
            ? 'border-[#00ff66] shadow-[0_0_60px_rgba(0,255,102,0.55),inset_0_0_25px_rgba(0,255,102,0.25)] scale-105'
            : 'border-emerald-500/60 shadow-[0_0_40px_rgba(0,255,102,0.25)]'
        }`}
      >
        {/* Official Game Logo Badge at Top */}
        <div className="relative -mt-12 mb-3 w-16 h-16 rounded-2xl bg-black border-2 border-[#00ff66] shadow-[0_0_24px_rgba(0,255,102,0.45)] flex items-center justify-center overflow-hidden">
          <img
            src={GAME_LOGO_SRC}
            alt="Candy Logo"
            className="w-full h-full object-contain p-1"
          />
        </div>

        {/* Center Circular Cyber Reactor Display for 3 -> 2 -> 1 -> شروع! */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 my-2 flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="rgba(3, 12, 8, 0.9)"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={isGo ? '#00ff66' : '#a3e635'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="326.7"
              strokeDashoffset={
                step === 3 ? '217' : step === 2 ? '108' : step === 1 ? '35' : '0'
              }
              className="transition-all duration-300"
            />
          </svg>

          {/* Animated Number or "شروع!" */}
          <div
            key={`num-${step}`}
            className={`relative z-10 flex items-center justify-center ${
              isGo ? 'animate-boom-blast' : 'animate-countdown-pop'
            }`}
          >
            {isGo ? (
              <span
                dir={lang === 'fa' ? 'rtl' : 'ltr'}
                className="font-persian font-black text-4xl sm:text-5xl text-[#00ff66] tracking-normal drop-shadow-[0_0_18px_rgba(0,255,102,0.85)]"
              >
                {t.countdownGo}
              </span>
            ) : (
              <span
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                className="font-black text-7xl sm:text-8xl text-white tabular-nums leading-none drop-shadow-[0_0_20px_rgba(0,255,102,0.75)]"
              >
                {step}
              </span>
            )}
          </div>
        </div>

        {/* 3 - 2 - 1 - شروع! Step Indicator Pills */}
        <div
          dir="ltr"
          className="flex items-center justify-center gap-2 mt-2 mb-4 w-full"
        >
          {([3, 2, 1, 'GO'] as CountdownStep[]).map((s) => {
            const active = step === s;
            const passed =
              (s === 3 && (step === 2 || step === 1 || step === 'GO')) ||
              (s === 2 && (step === 1 || step === 'GO')) ||
              (s === 1 && step === 'GO');

            return (
              <div
                key={String(s)}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                  active
                    ? 'bg-[#00ff66] text-[#020805] scale-110 shadow-[0_0_14px_#00ff66]'
                    : passed
                    ? 'bg-emerald-500/25 text-[#00ff66] border border-[#00ff66]/40'
                    : 'bg-[#030c08] text-emerald-600 border border-emerald-900/50'
                } ${s === 'GO' ? 'font-persian' : 'font-mono'}`}
              >
                {s === 'GO' ? t.countdownGo : s}
              </div>
            );
          })}
        </div>

        {/* 5 Brand Gems Visual Bar (Right to Left: chatit, tm, portal, pm, kardone) */}
        <div
          dir="ltr"
          className="flex items-center justify-center gap-2 pt-3 border-t border-emerald-500/25 w-full"
        >
          {COUNTDOWN_GEMS.map((g, idx) => {
            const isLit = isGo || idx >= litThreshold;
            return (
              <div
                key={g.type}
                className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                  isLit ? 'scale-105 opacity-100' : 'scale-95 opacity-40'
                }`}
              >
                <div
                  className={`p-1 rounded-xl border ${
                    isLit
                      ? 'bg-[#0b291c] border-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.35)]'
                      : 'bg-[#04110b] border-emerald-900/40'
                  }`}
                >
                  <KardoneGem type={g.type} size={32} />
                </div>
                <span className="text-[8px] font-mono font-bold text-emerald-300/90 lowercase">
                  {g.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
