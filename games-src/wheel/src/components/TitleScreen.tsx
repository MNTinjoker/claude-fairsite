import React, { useEffect } from 'react';
import { GameMode } from '../types/game';
import { CATEGORIES } from '../data/esgData';
import { Play, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';

interface Props {
  onStart: (mode: GameMode) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  onStart,
  selectedMode,
  onSelectMode,
  isMuted,
  onToggleSound,
}) => {
  // Listen for Enter or Space to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStart(selectedMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, selectedMode]);

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full bg-white text-black p-6 md:p-12 overflow-hidden select-none">
      {/* Precision Technical Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full border-b border-black grid grid-cols-6 grid-rows-6">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border-r border-t border-black/20" />
          ))}
        </div>
      </div>

      {/* Top Header Row with Sound Toggle */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <div className="font-tech flex items-center gap-2 text-xs font-black text-black">
          <span>REVOLVE · ESG & ECONOMIC MATRIX</span>
        </div>
        <button
          onClick={onToggleSound}
          className="p-1.5 text-black hover:bg-slate-100 border-2 border-black transition-colors cursor-pointer"
          title={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Center Interactive Hero Centerpiece & Title Lockup */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-3xl">
        {/* Bespoke Sharp Wheel Title Lockup */}
        <div className="relative w-40 h-40 mb-4">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#000000" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="#000000" strokeWidth="2" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="#000000" strokeWidth="2" />
            <rect x="75" y="75" width="50" height="50" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-jomhuria text-3xl font-black text-black">
            ESG
          </div>
        </div>

        {/* Title in Jomhuria Font */}
        <h1 className="font-jomhuria text-5xl sm:text-6xl md:text-7xl font-black tracking-normal text-black mb-1 leading-none">
          گردونه پازل پایداری سازمانی
        </h1>
        <p className="font-tech text-sm sm:text-base text-black font-black uppercase tracking-wider mb-2">
          Circular Target Puzzle of Corporate ESG & Economics
        </p>
        <p className="font-jomhuria text-xl sm:text-2xl text-slate-800 max-w-xl mx-auto leading-relaxed mb-6">
          ۲۰ واژه کلیدی را در قطاع‌های ۴ گانه جایگذاری کنید تا شکل واقعی قطعات گردونه کامل شود.
        </p>

        {/* 4 Pillars Preview in Sharp Rectangles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl mb-6">
          {Object.values(CATEGORIES).map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000]"
            >
              <span className="font-jomhuria text-2xl font-bold text-black leading-none">{cat.fa}</span>
              <span className="font-tech text-[10px] font-black text-black uppercase">{cat.en}</span>
              <span className="font-tech text-[9px] font-bold text-slate-600 mt-1">۵ واژه</span>
            </div>
          ))}
        </div>

        {/* Start Game CTA (Zero curves, heavy border, high contrast) */}
        <button
          onClick={() => onStart(selectedMode)}
          className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-black hover:bg-slate-800 text-white font-tech font-black text-sm uppercase tracking-widest border-2 border-black shadow-[5px_5px_0px_#15803d] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START PUZZLE (شروع پازل)</span>
        </button>
      </div>

      {/* Flat Control Hint Line */}
      <div className="relative z-10 w-full text-center pt-4 border-t-2 border-black">
        <p className="font-tech text-xs font-black text-black tracking-wider uppercase">
          Drag or Click to Slot · 1-4 Rotate Quadrant · Space/Enter Start · Esc Pause
        </p>
      </div>
    </div>
  );
};
