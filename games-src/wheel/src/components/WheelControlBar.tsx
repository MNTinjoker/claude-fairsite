import React from 'react';
import { LanguageMode } from '../types/game';
import { Shuffle, CheckCircle, RotateCcw, RotateCw } from 'lucide-react';

interface Props {
  onShuffle: () => void;
  onValidate: () => void;
  totalPlacedCount: number;
  wheelRotation: number;
  onRotateWheel: (delta: number) => void;
  lang: LanguageMode;
}

export const WheelControlBar: React.FC<Props> = ({
  onShuffle,
  onValidate,
  totalPlacedCount,
  wheelRotation,
  onRotateWheel,
  lang,
}) => {
  const isComplete = totalPlacedCount === 20;

  return (
    <div
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-1 sm:mb-3.5 z-20 select-none px-1"
    >
      {/* SHUFFLE BUTTON (rounded-[9px] - 20% less round) */}
      <button
        onClick={onShuffle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[9px] bg-[#0e1b1f]/85 hover:bg-[#14282e] text-slate-200 hover:text-white border border-white/15 hover:border-emerald-400/40 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer active:scale-95"
        title={lang === 'fa' ? 'بر زدن کارت‌های شناور' : 'Shuffle Floating Cards'}
      >
        <Shuffle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="font-tech text-xs font-semibold tracking-wider uppercase">
          {lang === 'fa' ? 'بر زدن' : 'SHUFFLE'}
        </span>
      </button>

      {/* WHEEL ROTATION CONTROLS (rounded-[9px]) */}
      <div className="flex items-center rounded-[9px] bg-[#0e1b1f]/85 border border-white/15 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] overflow-hidden">
        <button
          onClick={() => onRotateWheel(-90)}
          className="p-1.5 sm:p-2 text-slate-300 hover:text-emerald-400 hover:bg-white/5 border-r border-white/10 transition-colors cursor-pointer"
          title="Rotate -90°"
          aria-label="Rotate Counter-Clockwise"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-xs font-semibold text-emerald-400 px-2 sm:px-3 tracking-wider">
          {((wheelRotation % 360) + 360) % 360}°
        </span>
        <button
          onClick={() => onRotateWheel(90)}
          className="p-1.5 sm:p-2 text-slate-300 hover:text-emerald-400 hover:bg-white/5 border-l border-white/10 transition-colors cursor-pointer"
          title="Rotate +90°"
          aria-label="Rotate Clockwise"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* EVALUATION & FINISH BUTTON (rounded-[9px]) */}
      <button
        onClick={onValidate}
        className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-[9px] border backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.4)] ${
          isComplete
            ? 'bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 border-emerald-400 font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            : 'bg-[#0e1b1f]/85 hover:bg-[#14282e] text-slate-200 hover:text-white border-white/15 hover:border-emerald-400/40'
        }`}
        title={lang === 'fa' ? 'پایان بازی و ارزیابی' : 'Evaluate & Score'}
      >
        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isComplete ? 'text-slate-950' : 'text-emerald-400'}`} />
        <span className="font-tech text-xs font-semibold tracking-wider uppercase">
          {lang === 'fa' ? 'ارزیابی نهایی' : 'EVALUATE'}
        </span>
        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-[5px] bg-black/40 text-emerald-300 leading-none">
          {totalPlacedCount}/20
        </span>
      </button>
    </div>
  );
};
