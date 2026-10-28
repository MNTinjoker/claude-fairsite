import React from 'react';
import { WordItem, LanguageMode } from '../types/game';
import { CategoryIcon } from './CategoryIcon';
import { X, BookOpen } from 'lucide-react';

interface Props {
  word: WordItem | null;
  onClose: () => void;
  lang?: LanguageMode;
}

export const TermDetailModal: React.FC<Props> = ({ word, onClose, lang = 'fa' }) => {
  if (!word) return null;

  const isFa = lang === 'fa';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none"
      onClick={onClose}
    >
      {/* Neutral Cyber-Glass Modal: Does NOT give away the segment name or segment color */}
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[18px] bg-[#0c181c]/95 border border-white/20 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl border-t-2 border-t-emerald-400/60"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 sm:top-5 ${isFa ? 'left-4 sm:left-5' : 'right-4 sm:right-5'} p-1.5 rounded-[9px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer`}
          title={isFa ? 'بستن' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Neutral Badge (No segment name or color giveaway) - ONLY chosen language */}
        <div className="flex items-center gap-2 mb-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          <span className="font-tech text-xs font-semibold tracking-wider uppercase text-emerald-300">
            {isFa ? 'شرح معیار پایداری سازمانی' : 'SUSTAINABILITY CRITERION EXPLANATION'}
          </span>
        </div>

        {/* Answer Title & Neutral Icon (Neutral color, NO segment color hint) */}
        <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b border-white/10">
          <div className="p-3 rounded-[13px] bg-white/5 border border-white/15 text-slate-200 flex items-center justify-center shrink-0 shadow-sm">
            <CategoryIcon name={word.iconName} className="w-6 h-6 text-emerald-300" />
          </div>
          <div className="min-w-0 flex-1">
            {/* ONLY one language at a time based on user choice */}
            <h3 className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-xl font-bold text-white leading-tight`}>
              {isFa ? word.fa : word.en}
            </h3>
            {word.tag && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-[5px] bg-white/5 border border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                {word.tag}
              </span>
            )}
          </div>
        </div>

        {/* Answer Concept Definition - ONLY in chosen language */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-slate-300 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-xs font-bold`}>
              {isFa ? 'تعریف و مفهوم سازمانی این معیار:' : 'Corporate Definition & Scope:'}
            </span>
          </div>
          <div className="p-4 rounded-[13px] bg-[#070e11]/90 border border-white/10 shadow-inner">
            <p className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-sm text-slate-200 leading-relaxed text-justify font-normal`}>
              {isFa ? word.descriptionFa : word.descriptionEn}
            </p>
          </div>
        </div>

        {/* Done / Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-[13px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_4px_16px_rgba(34,197,94,0.3)] cursor-pointer active:scale-95"
        >
          <span>{isFa ? 'متوجه شدم' : 'Got It'}</span>
        </button>
      </div>
    </div>
  );
};
