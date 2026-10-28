import React from 'react';
import { Play } from 'lucide-react';

interface Props {
  onResume: () => void;
  lang?: string;
}

export const PauseModal: React.FC<Props> = ({ onResume, lang = 'fa' }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer select-none"
      onClick={onResume}
    >
      {/* Dark Sci-Fi Frosted Glass Card (rounded-[18px] - 20% less round) */}
      <div
        dir={lang === 'fa' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-[18px] bg-[#0d1a1e]/95 border border-emerald-400/30 p-7 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] text-center cursor-default backdrop-blur-xl"
      >
        <h3 className="font-tech text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white mb-1.5">
          {lang === 'fa' ? 'بازی متوقف شد' : 'PAUSED'}
        </h3>
        <p className="font-tech text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-6">
          {lang === 'fa' ? 'برای ادامه کلیک کنید' : 'PRESS RESUME TO CONTINUE'}
        </p>

        {/* RESUME BUTTON (rounded-[13px] - 20% less round) */}
        <button
          onClick={onResume}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-[13px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-tech text-sm font-bold tracking-wider uppercase transition-all duration-150 shadow-[0_4px_16px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)] cursor-pointer active:scale-95"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{lang === 'fa' ? 'ادامه بازی' : 'RESUME'}</span>
        </button>
      </div>
    </div>
  );
};
