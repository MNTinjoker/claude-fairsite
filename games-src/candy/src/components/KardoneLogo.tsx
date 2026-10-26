import React from 'react';

export const GAME_LOGO_SRC = 'assets/aistudio/PARS_PROJECT_Wave_Emblem_Logo_1d8f2b1e.png';

interface KardoneLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

/**
 * Official Candy Logo Brand Lockup
 * Uses the official PARS PROJECT Wave Emblem game logo everywhere across the UI
 * paired with the neon cyberpunk "CANDY LOGO" wordmark.
 */
export const KardoneLogo: React.FC<KardoneLogoProps> = ({
  className = '',
  size = 52,
  showWordmark = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Game Logo Emblem with Cyberpunk Neon Green Frame */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-black border border-[#00ff66]/55 shadow-[0_0_18px_rgba(0,255,102,0.32)] overflow-hidden"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff66]/15 via-transparent to-[#a3e635]/15 pointer-events-none" />
        <img
          src={GAME_LOGO_SRC}
          alt="Candy Logo Official Emblem"
          width={size}
          height={size}
          className="w-full h-full object-contain p-0.5 pointer-events-none select-none"
        />
      </div>

      {/* Signature "Candy Logo" Cyberpunk Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline tracking-tight">
          <span className="font-black text-2xl tracking-[-0.03em] text-emerald-50 drop-shadow-[0_0_10px_rgba(0,255,102,0.3)]">
            CANDY{' '}
            <span className="bg-gradient-to-r from-[#00ff66] via-[#34d399] to-[#a3e635] bg-clip-text text-transparent">
              LOGO
            </span>
          </span>
          <span className="inline-block w-2 h-2 ml-1.5 rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />
        </div>
      )}
    </div>
  );
};
