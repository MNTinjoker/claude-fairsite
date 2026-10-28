import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CategoryId, WordItem, LanguageMode } from '../types/game';
import { CATEGORIES } from '../data/esgData';
import { RotateCcw, Eye, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  placedWords: Record<CategoryId, (WordItem | null)[]>;
  score: number;
  correctCount: number;
  elapsedSeconds: number;
  onPlayAgain: () => void;
  onReviewDial: () => void;
  lang?: LanguageMode;
}

export const VictoryModal: React.FC<Props> = ({
  placedWords,
  score,
  correctCount,
  elapsedSeconds,
  onPlayAgain,
  onReviewDial,
  lang = 'fa',
}) => {
  const isFa = lang === 'fa';

  useEffect(() => {
    if (correctCount >= 14) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#22C55E', '#0EA5E9', '#F00F6F'],
      });
    }
  }, [correctCount]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const accuracyPercent = Math.round((correctCount / 20) * 100);

  const getRank = (acc: number) => {
    if (acc === 100) return { titleFa: 'استاد پایداری سازمانی (ESG Master)', titleEn: 'Master of Corporate Sustainability (100%)' };
    if (acc >= 85) return { titleFa: 'مدیر ارشد پایداری (CSO)', titleEn: 'Chief Sustainability Officer' };
    if (acc >= 70) return { titleFa: 'کارشناس خبره ESG', titleEn: 'Senior ESG Specialist' };
    if (acc >= 50) return { titleFa: 'پژوهشگر پایداری', titleEn: 'Sustainability Researcher' };
    return { titleFa: 'نوآموز مفاهیم پایداری', titleEn: 'ESG Apprentice' };
  };

  const rank = getRank(accuracyPercent);

  const quadrantStats = (['environmental', 'social', 'economic', 'governance'] as CategoryId[]).map((catId) => {
    const slots = placedWords[catId] || [];
    const correctInThisQuad = slots.filter((w) => w !== null && w.categoryId === catId).length;
    return {
      catId,
      category: CATEGORIES[catId],
      slots,
      correctCount: correctInThisQuad,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        className="relative w-full max-w-2xl rounded-[18px] bg-[#0c181c]/95 border border-emerald-400/30 p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] text-center my-auto backdrop-blur-xl"
      >
        {/* Title - ONLY chosen language */}
        <h2 className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-white mb-2`}>
          {isFa ? 'کارنامه نهایی گردونه پایداری' : 'ESG WHEEL EVALUATION & FINAL SCORE'}
        </h2>

        {/* Rank Badge - ONLY chosen language */}
        <div className="inline-block rounded-[12px] border border-emerald-400/25 bg-[#122428] px-4 py-1.5 font-sans-persian text-sm sm:text-base font-bold text-emerald-300 mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          {isFa ? rank.titleFa : rank.titleEn}
        </div>

        {/* Score & Key Metrics Row (rounded-[13px]) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <div className="p-3 sm:p-3.5 rounded-[13px] bg-[#0e1f24]/80 border border-white/10">
            <span className="font-tech text-[10.5px] sm:text-xs font-medium text-slate-400 block mb-1">
              {isFa ? 'امتیاز نهایی' : 'FINAL SCORE'}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-white">
              {score}
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-[13px] bg-[#0e1f24]/80 border border-emerald-400/30">
            <span className="font-tech text-[10.5px] sm:text-xs font-medium text-emerald-300 block mb-1">
              {isFa ? 'دقت پاسخ‌ها' : 'ACCURACY'}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-emerald-400">
              {correctCount}/20 ({accuracyPercent}%)
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-[13px] bg-[#0e1f24]/80 border border-white/10">
            <span className="font-tech text-[10.5px] sm:text-xs font-medium text-slate-400 block mb-1">
              {isFa ? 'مدت زمان' : 'ELAPSED TIME'}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-white">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* 4 Quadrants Detailed Review Breakdown */}
        <div className={`${isFa ? 'text-right' : 'text-left'} mb-6`}>
          <div className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-sm font-bold text-slate-200 mb-2`}>
            {isFa ? 'ارزیابی بخش‌های ۴ گانه:' : 'SECTOR EVALUATION BREAKDOWN:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-h-56 overflow-y-auto px-1">
            {quadrantStats.map(({ catId, category, slots, correctCount: quadCorrect }) => (
              <div
                key={catId}
                className={`p-3 rounded-[13px] bg-[#0a1518]/80 border border-white/10 ${isFa ? 'text-right' : 'text-left'}`}
              >
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {quadCorrect}/5 {isFa ? 'صحیح' : 'Correct'}
                  </span>
                  <span
                    className={`${isFa ? 'font-sans-persian' : 'font-tech'} text-sm font-bold leading-none`}
                    style={{ color: category.color.primary }}
                  >
                    {isFa ? category.fa : category.en}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {slots.map((word, idx) => {
                    if (!word) {
                      return (
                        <div key={idx} className="text-slate-500 text-xs font-sans-persian px-2 py-1">
                          {isFa ? `جایگاه ${idx + 1}: خالی` : `Slot ${idx + 1}: Empty`}
                        </div>
                      );
                    }
                    const isRight = word.categoryId === catId;
                    const wordTitle = isFa ? word.fa : word.en;
                    return (
                      <div
                        key={word.id}
                        className={`flex items-center justify-between p-2 rounded-[9px] border text-xs ${
                          isRight
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                            : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isRight ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span className="truncate font-sans-persian">{wordTitle}</span>
                        </div>
                        <span className="text-[10px] shrink-0 font-medium font-sans-persian">
                          {isRight ? (isFa ? 'صحیح' : 'Correct') : (isFa ? `مربوط به ${CATEGORIES[word.categoryId]?.fa}` : `Belongs to ${CATEGORIES[word.categoryId]?.en}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons (rounded-[13px]) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-[13px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-tech text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-[0_4px_16px_rgba(34,197,94,0.3)] cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isFa ? 'شروع مجدد' : 'PLAY AGAIN'}</span>
          </button>
          <button
            onClick={onReviewDial}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-[13px] bg-[#0f1f23] hover:bg-[#152c32] text-slate-200 hover:text-white border border-white/10 hover:border-emerald-400/30 font-tech text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>{isFa ? 'مشاهده گردونه' : 'REVIEW WHEEL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
