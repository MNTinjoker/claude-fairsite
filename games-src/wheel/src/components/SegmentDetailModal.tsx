import React from 'react';
import { CategoryId, LanguageMode } from '../types/game';
import { CATEGORIES } from '../data/esgData';
import { CategoryIcon } from './CategoryIcon';
import { Info } from 'lucide-react';

interface Props {
  categoryId: CategoryId | null;
  onClose: () => void;
  lang: LanguageMode;
}

export const SegmentDetailModal: React.FC<Props> = ({ categoryId, onClose, lang }) => {
  if (!categoryId) return null;

  const cat = CATEGORIES[categoryId];
  if (!cat) return null;

  const isFa = lang === 'fa';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none"
      onClick={onClose}
    >
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[18px] bg-[#0c181c]/95 border border-white/20 p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl"
        style={{
          borderTop: `4px solid ${cat.color.primary}`,
        }}
      >
        {/* Segment Title & Icon (Header pill omitted as requested) */}
        <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b border-white/10">
          <div
            className="p-3 rounded-[13px] flex items-center justify-center shrink-0 shadow-md"
            style={{
              backgroundColor: `${cat.color.primary}20`,
              border: `1.5px solid ${cat.color.primary}50`,
              color: cat.color.primary,
            }}
          >
            <CategoryIcon name={cat.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h3
              className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-xl font-bold leading-tight`}
              style={{ color: cat.color.primary }}
            >
              {isFa ? `بخش ${cat.fa}` : `${cat.en} Sector`}
            </h3>
            <p className="font-sans-persian text-xs text-slate-300 font-medium mt-1">
              {isFa ? cat.taglineFa : cat.taglineEn}
            </p>
          </div>
        </div>

        {/* Detailed Explanation - ONLY in the chosen language */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-slate-300 mb-2">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-xs font-bold`}>
              {isFa ? 'شرح و مأموریت این قطاع در ارزیابی پایداری:' : 'Sector Scope & Role in Sustainability:'}
            </span>
          </div>
          <div className="p-4 rounded-[13px] bg-[#070e11]/90 border border-white/10 shadow-inner">
            <p className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-sm text-slate-100 leading-relaxed text-justify font-normal`}>
              {isFa ? cat.explanationFa : cat.explanationEn}
            </p>
          </div>
        </div>

        {/* Got It Button (without close text, and cancel button omitted as requested) */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-[13px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_4px_16px_rgba(34,197,94,0.3)] cursor-pointer active:scale-95"
        >
          <span>{isFa ? 'متوجه شدم' : 'Got It'}</span>
        </button>
      </div>
    </div>
  );
};
