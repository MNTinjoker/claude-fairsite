import React from 'react';
import { GemType, SpecialType } from '../types/game';

interface KardoneGemProps {
  type: GemType;
  special?: SpecialType;
  isSelected?: boolean;
  isHinted?: boolean;
  isNew?: boolean;
  size?: number;
  className?: string;
}

export const GEM_PALETTES: Record<
  GemType,
  {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    vfxColor: string;
  }
> = {
  k_gem: {
    name: 'kardone',
    primary: '#00F0FF',
    secondary: '#FF007F',
    accent: '#FFAA00',
    glow: 'rgba(0, 240, 255, 0.65)',
    vfxColor: '#00F0FF',
  },
  rm_gem: {
    name: 'pm',
    primary: '#00FF66',
    secondary: '#84cc16',
    accent: '#a3e635',
    glow: 'rgba(0, 255, 102, 0.7)',
    vfxColor: '#00FF66',
  },
  waves_gem: {
    name: 'portal',
    primary: '#FF007F',
    secondary: '#4A0033',
    accent: '#FF69B4',
    glow: 'rgba(255, 0, 128, 0.65)',
    vfxColor: '#FF0080',
  },
  tm_gem: {
    name: 'tm',
    primary: '#f97316',
    secondary: '#eab308',
    accent: '#fde047',
    glow: 'rgba(249, 115, 22, 0.65)',
    vfxColor: '#F97316',
  },
  c_gem: {
    name: 'chatit',
    primary: '#00C6FF',
    secondary: '#7928CA',
    accent: '#60EFFF',
    glow: 'rgba(0, 198, 255, 0.65)',
    vfxColor: '#00C6FF',
  },
};

const KardoneGemComponent: React.FC<KardoneGemProps> = ({
  type,
  special = 'none',
  isSelected = false,
  isHinted = false,
  isNew = false,
  size = 54,
  className = '',
}) => {
  const palette = GEM_PALETTES[type] || GEM_PALETTES.k_gem;
  const isBlasterH = special === 'blaster_h';
  const isBlasterV = special === 'blaster_v';
  const isRectPrize = isBlasterH || isBlasterV;
  const isMega5 = special === 'mega_5';
  const isSupernova6 = special === 'supernova_6';

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl select-none will-change-transform ${
        isNew ? 'animate-gem-rush' : ''
      } ${isSelected ? 'scale-108 z-20' : ''} ${isHinted ? 'animate-pulse scale-105' : ''} ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Active / Hint / Special Cyber Halo */}
      {(isSelected || isHinted || special !== 'none') && (
        <div
          className="absolute -inset-1 rounded-xl opacity-90 blur-xs pointer-events-none"
          style={{
            background: isSupernova6
              ? 'radial-gradient(circle, rgba(0,255,102,0.85), rgba(163,230,53,0.7), rgba(0,240,255,0.7))'
              : isMega5
              ? 'radial-gradient(circle, rgba(0,255,102,0.85), rgba(16,185,129,0.55))'
              : isRectPrize
              ? 'radial-gradient(circle, rgba(163,230,53,0.75), rgba(0,255,102,0.45))'
              : palette.glow,
          }}
        />
      )}

      {/* Dark Cyberpunk Tile Pedestal with Emerald & Lime Shades */}
      <div
        className={`absolute inset-0 rounded-xl ${
          isSelected
            ? 'bg-gradient-to-br from-[#0f3826] via-[#092418] to-[#04120c] ring-2 ring-[#00ff66] border border-[#a3e635] shadow-[0_0_14px_rgba(0,255,102,0.55)]'
            : isSupernova6
            ? 'bg-gradient-to-br from-[#123d2b] via-[#09261b] to-[#030e09] border-2 border-[#00ff66] shadow-[0_0_16px_rgba(0,255,102,0.5)]'
            : isMega5
            ? 'bg-gradient-to-br from-[#113626] via-[#082016] to-[#030d08] border-2 border-[#a3e635] shadow-[0_0_12px_rgba(163,230,53,0.4)]'
            : isRectPrize
            ? 'bg-gradient-to-br from-[#0e3222] via-[#071d14] to-[#030c08] border-2 border-[#34d399] shadow-[0_0_10px_rgba(52,211,153,0.35)]'
            : 'bg-gradient-to-br from-[#0a2218]/90 via-[#06150f]/95 to-[#030a07] border border-emerald-500/25 hover:border-emerald-400/55'
        }`}
      />

      {/* =================================================================
          SPECIAL 1: 4-GEM RECTANGULAR LINE-BLASTER PRIZE (blaster_h / v)
          ================================================================= */}
      {isRectPrize && (
        <div className="absolute inset-0 rounded-xl pointer-events-none z-20 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-1 rounded-md border-2 border-[#a3e635] bg-[#00ff66]/10 animate-rect-scan" />

          <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00ff66]" />
          <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00ff66]" />
          <div className="absolute bottom-0.5 left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00ff66]" />
          <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00ff66]" />

          {isBlasterH && (
            <div className="absolute inset-x-0.5 h-2 bg-gradient-to-r from-[#00ff66] via-white to-[#00ff66] opacity-90 flex items-center justify-between px-1">
              <span className="w-1.5 h-1.5 rotate-45 bg-white" />
              <span className="w-1.5 h-1.5 rotate-45 bg-white" />
            </div>
          )}
          {isBlasterV && (
            <div className="absolute inset-y-0.5 w-2 bg-gradient-to-b from-[#00ff66] via-white to-[#00ff66] opacity-90 flex flex-col items-center justify-between py-1">
              <span className="w-1.5 h-1.5 rotate-45 bg-white" />
              <span className="w-1.5 h-1.5 rotate-45 bg-white" />
            </div>
          )}

          <div className="absolute bottom-0.5 inset-x-1 flex justify-center">
            <span className="px-1 py-[1px] text-[7px] font-black font-mono uppercase tracking-wider bg-[#020805]/95 text-[#a3e635] border border-[#00ff66]/70 rounded-xs">
              RECT PRIZE
            </span>
          </div>
        </div>
      )}

      {/* =================================================================
          SPECIAL 2: 5-GEM MEGA GEM (mega_5) - 5x5 Area Detonator
          ================================================================= */}
      {isMega5 && (
        <div className="absolute inset-0 rounded-xl pointer-events-none flex items-center justify-center z-20 overflow-hidden">
          <div className="absolute inset-0.5 rounded-lg border-2 border-[#a3e635] animate-ping opacity-40" />
          <div className="absolute inset-1 rounded-lg border border-[#00ff66] bg-gradient-to-tr from-[#00ff66]/25 via-transparent to-[#a3e635]/30 animate-cyber-pulse" />
          <div className="absolute top-0.5 right-0.5 px-1 py-[1px] rounded-xs bg-[#00ff66] text-[#020805] font-mono font-black text-[7px] tracking-tighter">
            MEGA
          </div>
        </div>
      )}

      {/* =================================================================
          SPECIAL 3: 6-GEM SUPERNOVA (supernova_6) - Color Matrix Wipe
          ================================================================= */}
      {isSupernova6 && (
        <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff66]/40 via-[#00f0ff]/35 to-[#a3e635]/40 animate-rainbow" />
          <div className="absolute inset-0.5 border-2 border-[#ecfdf5] rounded-xl" />
          <div className="absolute inset-1.5 rounded-full border border-dashed border-[#a3e635] animate-spin" />
          <div className="absolute top-0.5 left-0.5 px-1 py-[1px] rounded-xs bg-gradient-to-r from-[#00ff66] to-[#a3e635] text-[#020805] font-mono font-black text-[7px] tracking-tighter">
            NOVA
          </div>
        </div>
      )}

      {/* =================================================================
          EXACT 5 BRAND GEM LOGOS (Preserved Margins & Proportions)
          ================================================================= */}
      <div className="relative z-10 flex items-center justify-center p-1 w-full h-full pointer-events-none">
        {/* 1. K GEM: Glossy Ribbon K Logo */}
        {type === 'k_gem' && (
          <svg
            width={Math.round(size * 0.82)}
            height={Math.round(size * 0.82)}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="k-cyan-shared" x1="15" y1="20" x2="52" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#0099FF" />
                <stop offset="100%" stopColor="#0066FF" />
              </linearGradient>
              <linearGradient id="k-purple-shared" x1="18" y1="50" x2="48" y2="82" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0077FE" />
                <stop offset="40%" stopColor="#7928CA" />
                <stop offset="100%" stopColor="#FF0080" />
              </linearGradient>
              <linearGradient id="k-warm-shared" x1="42" y1="46" x2="82" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8A00E6" />
                <stop offset="25%" stopColor="#FF007F" />
                <stop offset="65%" stopColor="#FF5500" />
                <stop offset="100%" stopColor="#FFB800" />
              </linearGradient>
              <linearGradient id="k-blue-shared" x1="44" y1="46" x2="80" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0052D4" />
                <stop offset="50%" stopColor="#4364F7" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
              <linearGradient id="k-gloss-shared" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <path
              d="M44 48 C 48 44 54 44 58 48 L 74 64 C 79 69 79 77 74 82 C 69 87 61 87 56 82 L 40 66 Z"
              fill="url(#k-blue-shared)"
            />
            <path
              d="M38 52 C 42 46 48 40 54 34 L 68 20 C 74 14 82 16 86 22 C 90 28 88 36 82 42 L 58 66 Z"
              fill="url(#k-warm-shared)"
            />
            <path
              d="M20 22 C 20 18 24 15 28 17 L 50 30 C 56 34 56 42 50 46 L 36 55 C 30 59 20 54 20 46 Z"
              fill="url(#k-cyan-shared)"
            />
            <path
              d="M20 44 C 20 38 28 34 34 38 L 52 50 C 58 54 56 64 50 68 L 36 78 C 28 84 20 78 20 68 Z"
              fill="url(#k-purple-shared)"
            />
            <path
              d="M26 19 L 46 31 C 49 33 50 37 47 40"
              stroke="url(#k-gloss-shared)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M56 32 L 78 19"
              stroke="url(#k-gloss-shared)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 2. RM GEM: Vibrant Green Ribbon Monogram Logo */}
        {type === 'rm_gem' && (
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src="assets/gems/gem_rm_green.png"
              alt="RM Gem"
              width={Math.round(size * 0.84)}
              height={Math.round(size * 0.84)}
              decoding="async"
              className="object-contain pointer-events-none select-none"
              style={{
                maxWidth: Math.round(size * 0.84),
                maxHeight: Math.round(size * 0.84),
              }}
            />
          </div>
        )}

        {/* 3. WAVES GEM: 3D Magenta/Violet Wave Ribbons */}
        {type === 'waves_gem' && (
          <svg
            width={Math.round(size * 0.86)}
            height={Math.round(size * 0.86)}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="wave-grad-shared" x1="10" y1="15" x2="90" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF1493" />
                <stop offset="45%" stopColor="#E00078" />
                <stop offset="75%" stopColor="#7B004F" />
                <stop offset="100%" stopColor="#2E0025" />
              </linearGradient>
              <linearGradient id="wave-edge-shared" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFA6D5" />
                <stop offset="50%" stopColor="#FF3399" />
                <stop offset="100%" stopColor="#FF80BF" />
              </linearGradient>
            </defs>

            {[
              { y: 15, h: 7 },
              { y: 27, h: 7 },
              { y: 39, h: 7 },
              { y: 51, h: 7 },
              { y: 63, h: 7 },
              { y: 75, h: 7 },
            ].map((ribbon, idx) => (
              <g key={idx}>
                <path
                  d={`M 14 ${ribbon.y + ribbon.h + 2} 
                      C 34 ${ribbon.y + ribbon.h - 5}, 46 ${ribbon.y + ribbon.h + 9}, 60 ${ribbon.y + ribbon.h - 1} 
                      C 72 ${ribbon.y + ribbon.h - 8}, 80 ${ribbon.y + ribbon.h + 1}, 86 ${ribbon.y + ribbon.h + 2}
                      L 86 ${ribbon.y + ribbon.h + 4}
                      C 80 ${ribbon.y + ribbon.h + 3}, 72 ${ribbon.y + ribbon.h - 6}, 60 ${ribbon.y + ribbon.h + 1}
                      C 46 ${ribbon.y + ribbon.h + 11}, 34 ${ribbon.y + ribbon.h - 3}, 14 ${ribbon.y + ribbon.h + 4} Z`}
                  fill="#1C0018"
                  opacity="0.8"
                />
                <path
                  d={`M 14 ${ribbon.y} 
                      C 34 ${ribbon.y - 7}, 46 ${ribbon.y + 7}, 60 ${ribbon.y - 3} 
                      C 72 ${ribbon.y - 10}, 80 ${ribbon.y - 1}, 86 ${ribbon.y} 
                      L 86 ${ribbon.y + ribbon.h} 
                      C 80 ${ribbon.y + ribbon.h - 1}, 72 ${ribbon.y + ribbon.h - 10}, 60 ${ribbon.y + ribbon.h - 3} 
                      C 46 ${ribbon.y + ribbon.h + 7}, 34 ${ribbon.y + ribbon.h - 7}, 14 ${ribbon.y + ribbon.h} Z`}
                  fill="url(#wave-grad-shared)"
                />
                <path
                  d={`M 15 ${ribbon.y + 0.5} 
                      C 34 ${ribbon.y - 6.5}, 46 ${ribbon.y + 7.5}, 60 ${ribbon.y - 2.5} 
                      C 72 ${ribbon.y - 9.5}, 80 ${ribbon.y - 0.5}, 85 ${ribbon.y + 0.5}`}
                  stroke="url(#wave-edge-shared)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </g>
            ))}
          </svg>
        )}

        {/* 4. TM GEM: Radiant Sunset Orange & Gold Ribbon Monogram Logo (Pixel-Centered) */}
        {type === 'tm_gem' && (
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src="assets/gems/gem_tm_orange.png"
              alt="TM Gem"
              width={Math.round(size * 0.84)}
              height={Math.round(size * 0.84)}
              decoding="async"
              className="object-contain pointer-events-none select-none"
              style={{
                maxWidth: Math.round(size * 0.84),
                maxHeight: Math.round(size * 0.84),
              }}
            />
          </div>
        )}

        {/* 5. C GEM: ChatIt Speech Bubble Ribbon 'C' in Cyan to Violet */}
        {type === 'c_gem' && (
          <svg
            width={Math.round(size * 0.86)}
            height={Math.round(size * 0.86)}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="c-outer-shared" x1="20" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="30%" stopColor="#0091FF" />
                <stop offset="65%" stopColor="#2E5BFF" />
                <stop offset="90%" stopColor="#7928CA" />
                <stop offset="100%" stopColor="#9B51E0" />
              </linearGradient>
              <linearGradient id="c-inner-shared" x1="30" y1="20" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="50%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#581C87" />
              </linearGradient>
              <linearGradient id="c-gloss-shared" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <path
              d="M62 28 C 42 22 28 36 28 54 C 28 66 36 74 46 76 L 36 84 C 22 76 18 58 22 42 C 26 26 44 14 66 18 Z"
              fill="url(#c-inner-shared)"
              opacity="0.85"
            />
            <path
              d="M72 22 
                 C 46 10 18 24 16 52 
                 C 15 62 18 70 24 76 
                 L 22 88 
                 C 28 85 36 82 42 80 
                 C 58 84 82 78 88 56 
                 C 89 52 86 48 82 49 
                 C 78 50 75 54 74 58 
                 C 70 70 52 74 40 70 
                 C 32 68 28 60 28 52 
                 C 28 34 46 22 68 28 
                 C 74 30 76 24 72 22 Z"
              fill="url(#c-outer-shared)"
            />
            <path
              d="M26 36 C 32 24 48 16 66 22"
              stroke="url(#c-gloss-shared)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle cx="82" cy="54" r="3.5" fill="#C084FC" opacity="0.6" />
            <path
              d="M23 78 L 22 86 L 28 83"
              stroke="#00E5FF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        )}
      </div>

      {/* Mega 5 Center Cyber Core Indicator */}
      {isMega5 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-5 h-5 rounded-md rotate-45 bg-[#00ff66]/90 border border-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        </div>
      )}

      {/* Supernova 6 Star Flare */}
      {isSupernova6 && (
        <div className="absolute bottom-0.5 right-0.5 pointer-events-none z-20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#00FF66" className="animate-spin">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const KardoneGem = React.memo(
  KardoneGemComponent,
  (prev, next) =>
    prev.type === next.type &&
    prev.special === next.special &&
    prev.isSelected === next.isSelected &&
    prev.isHinted === next.isHinted &&
    prev.isNew === next.isNew &&
    prev.size === next.size
);
