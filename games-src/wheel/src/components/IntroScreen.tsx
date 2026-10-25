import React from 'react';
import { ArrowLeft, ArrowRight, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageMode } from '../types/game';

interface Props {
  onEnter: () => void;
  lang: LanguageMode;
  onToggleLang: (lang: LanguageMode) => void;
}

export const IntroScreen: React.FC<Props> = ({ onEnter, lang, onToggleLang }) => {
  const isFa = lang === 'fa';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onClick={onEnter}
      dir={isFa ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full text-slate-100 flex flex-col justify-between p-4 sm:p-10 cursor-pointer select-none overflow-x-hidden overflow-y-auto"
    >
      {/* 100% ORIGINAL PICTURE BACKGROUND: No blur, No overall darkening */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="assets/aistudio/Carbon-Footprint-Reduction-BG_d0adbcc2.webp"
          alt="Carbon Footprint Biosphere"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Top Header Bar with readable frosted capsule (rounded-[14px]) */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between bg-[#070e11]/75 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-[14px] border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          {isFa ? (
            <span className="font-sans-persian text-xs sm:text-base font-bold text-emerald-300 drop-shadow-sm">
              مدل وایز · ارزیابی تأثیر پایداری پروژه (PSIA)
            </span>
          ) : (
            <span className="font-tech text-[10px] sm:text-sm font-bold tracking-widest uppercase text-emerald-300 drop-shadow-sm">
              WISE MODEL · PSIA SUSTAINABILITY CIRCLE
            </span>
          )}
        </div>

        {/* Language Switcher (rounded-[9px]) */}
        <div className="flex items-center gap-1 rounded-[9px] bg-[#0a1518]/90 border border-white/20 p-1 backdrop-blur-md shadow-md">
          <button
            onClick={() => onToggleLang('fa')}
            className={`px-2.5 sm:px-3 py-1 rounded-[7px] font-sans-persian text-xs font-bold transition-colors cursor-pointer ${
              isFa
                ? 'bg-emerald-500 text-slate-950 shadow-[0_2px_8px_rgba(34,197,94,0.3)]'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            فارسی
          </button>
          <button
            onClick={() => onToggleLang('en')}
            className={`px-2.5 sm:px-3 py-1 rounded-[7px] font-tech text-xs font-bold uppercase transition-colors cursor-pointer ${
              !isFa
                ? 'bg-emerald-500 text-slate-950 shadow-[0_2px_8px_rgba(34,197,94,0.3)]'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Core Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto py-6 sm:py-8 text-center sm:text-start">
        {/* Floating Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-[11px] border border-emerald-400/40 bg-[#070e11]/85 px-3.5 py-1.5 mb-4 sm:mb-5 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {isFa ? (
            <span className="font-sans-persian text-xs font-semibold text-emerald-300">
              چرخ جامع تأثیرات بر جامعه و محیط زیست
            </span>
          ) : (
            <span className="font-tech text-[10.5px] font-bold tracking-wider uppercase text-emerald-300">
              WHEEL OF IMPACTS ON SOCIETY & ENVIRONMENT
            </span>
          )}
        </div>

        {/* Title with strong text shadow */}
        <h1 className="font-tech text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
          {isFa
            ? 'مدل وایز و گردونه ارزیابی پایداری'
            : 'WISE Model: Project Sustainability Impact'}
        </h1>

        {/* Overview Box */}
        <div className="rounded-[18px] border border-white/20 bg-[#070e11]/85 p-5 sm:p-7 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] mb-6">
          {isFa ? (
            <p className="font-sans-persian text-sm sm:text-base text-slate-100 leading-relaxed text-justify font-normal">
              مدل وایز (WISE)، به معنای «چرخ تأثیرات بر جامعه و محیط زیست» است. هدف اصلی این مدل، فراتر رفتن از ارزیابی‌های تک‌بعدی و ارائه یک ارزیابی جامع و همه‌جانبه از تأثیرات یک پروژه است. این ابزار به عنوان یک بستر تعاملی برای انجام ارزیابی تأثیر پایداری پروژه بر اساس ۲۰ معیار بین‌المللی در ۴ بعد زیست‌محیطی، اجتماعی، اقتصادی و راهبری سازمانی عمل می‌کند.
            </p>
          ) : (
            <p className="font-tech text-xs sm:text-sm text-slate-200 font-normal leading-relaxed text-justify">
              The WISE model (Wheel of Impacts on Society and Environment) provides a comprehensive, multi-dimensional evaluation of project impacts across Environmental, Social, Economic, and Governance sectors through an interactive 20-criteria circular puzzle.
            </p>
          )}
        </div>



        {/* Enter CTA Button */}
        <div className="flex items-center justify-center sm:justify-start">
          <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-[13px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-tech font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_6px_30px_rgba(34,197,94,0.45)] hover:shadow-[0_8px_36px_rgba(34,197,94,0.6)] cursor-pointer active:scale-95">
            <Play className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>
              {isFa ? 'ورود به گردونه پازل' : 'ENTER PUZZLE WHEEL'}
            </span>
            {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center pt-2">
        <span className="font-tech text-xs text-slate-200 bg-[#070e11]/75 backdrop-blur-md px-4 py-1.5 rounded-[9px] border border-white/10 uppercase tracking-widest shadow-md">
          {isFa
            ? 'برای شروع هر کجای صفحه را لمس کنید'
            : 'Click Anywhere to Begin Playing'}
        </span>
      </div>
    </motion.div>
  );
};
