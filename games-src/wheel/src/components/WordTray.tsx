import React, { useState } from 'react';
import { LanguageMode, WordItem } from '../types/game';
import { Search, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  unplacedWords: WordItem[];
  selectedWord: WordItem | null;
  onSelectWord: (word: WordItem | null) => void;
  onShuffle: () => void;
  onValidate: () => void;
  totalPlacedCount: number;
  lang: LanguageMode;
}

export const WordTray: React.FC<Props> = ({
  unplacedWords,
  selectedWord,
  onSelectWord,
  onShuffle,
  onValidate,
  totalPlacedCount,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = unplacedWords.filter((w) => {
    return (
      w.fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.en.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const isComplete = totalPlacedCount === 20;

  return (
    <div
      className="flex flex-col items-center w-full max-w-[340px] select-none"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* WORD BANK Card Container (Sharp rectilinear border, zero rounded curves, strong contrast) */}
      <div className="w-full bg-white border-2 border-black shadow-[6px_6px_0px_#000000] p-5 flex flex-col">
        {/* Header Title: Clean Word Bank heading (NO second language toggle here) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
          <h2 className="font-tech text-sm font-black text-black tracking-widest uppercase">
            {lang === 'fa' ? 'بانک واژگان پایداری' : 'WORD BANK'}
          </h2>
          <span className="font-tech text-xs font-black text-black bg-slate-100 border border-black px-2 py-0.5">
            {unplacedWords.length}
          </span>
        </div>

        {/* Search input with sharp edges */}
        {unplacedWords.length > 5 && (
          <div className="relative w-full mb-3">
            <Search className={`w-4 h-4 text-black absolute top-1/2 -translate-y-1/2 ${
              lang === 'fa' ? 'right-2.5' : 'left-2.5'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجوی واژه...' : 'Search term...'}
              dir={lang === 'fa' ? 'rtl' : 'ltr'}
              className={`w-full py-1.5 text-xs font-bold font-tech bg-white border-2 border-black text-black placeholder-slate-500 focus:outline-none focus:bg-slate-50 ${
                lang === 'fa' ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'
              }`}
            />
          </div>
        )}

        {/* Scrollable Word Cards List (Sharp geometric cards, strong contrast, Jomhuria font) */}
        <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto px-1 py-1">
          {filteredWords.length === 0 ? (
            <div className="py-10 text-center text-xs text-black flex flex-col items-center gap-2">
              {unplacedWords.length === 0 ? (
                <div className="p-4 border-2 border-black bg-emerald-50 w-full text-center">
                  <CheckSquare className="w-8 h-8 text-black mx-auto mb-2" />
                  <span className="font-jomhuria text-2xl font-bold text-black block leading-none">
                    {lang === 'fa'
                      ? 'تمامی ۲۰ واژه در گردونه قرار گرفتند'
                      : 'All 20 terms placed on the wheel'}
                  </span>
                  <span className="font-tech text-[10px] font-black text-black uppercase tracking-wider block mt-1">
                    {lang === 'fa' ? 'آماده برای ثبت و ارزیابی' : 'Ready for scoring'}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-slate-700">
                  {lang === 'fa' ? 'واژه‌ای با این عنوان یافت نشد.' : 'No matching terms.'}
                </span>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredWords.map((word) => {
                const isSelected = selectedWord?.id === word.id;

                return (
                  <motion.div
                    layout
                    key={word.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    draggable
                    onDragStart={(e: unknown) => {
                      const dragEvent = e as React.DragEvent;
                      if (dragEvent?.dataTransfer) {
                        dragEvent.dataTransfer.setData('text/plain', word.id);
                      }
                      onSelectWord(word);
                    }}
                    onClick={() => {
                      if (selectedWord?.id === word.id) {
                        onSelectWord(null);
                      } else {
                        onSelectWord(word);
                      }
                    }}
                    className={`relative w-full py-2.5 px-3 border-2 transition-all cursor-pointer select-none text-center ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_#10b981] translate-x-[-2px]'
                        : 'bg-white text-black border-black hover:bg-slate-100 shadow-[3px_3px_0px_#000000]'
                    }`}
                  >
                    {/* Clean Language Separation: in Farsi mode, ONLY Persian title, ZERO English text! */}
                    <div className="flex flex-col items-center justify-center leading-none">
                      {lang === 'fa' ? (
                        <span
                          className={`font-jomhuria text-2xl sm:text-[26px] font-bold tracking-normal leading-tight ${
                            isSelected ? 'text-white' : 'text-black'
                          }`}
                        >
                          {word.fa}
                        </span>
                      ) : (
                        <span
                          className={`font-tech text-xs sm:text-sm font-black uppercase tracking-wider py-0.5 ${
                            isSelected ? 'text-white' : 'text-black'
                          }`}
                        >
                          {word.en}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Action Buttons Below Word Bank: Zero Curves, Heavy Black Borders, High Contrast */}
      <div className="flex flex-col gap-2.5 w-full mt-4">
        {/* SHUFFLE BUTTON */}
        <button
          onClick={onShuffle}
          disabled={unplacedWords.length <= 1}
          className="w-full py-2.5 px-4 border-2 border-black bg-white hover:bg-slate-100 text-black transition-all shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 cursor-pointer text-center"
        >
          {lang === 'fa' ? (
            <span className="font-jomhuria text-2xl font-bold leading-none">
              بر زدن واژه‌ها
            </span>
          ) : (
            <span className="font-tech text-xs font-black uppercase tracking-widest">
              SHUFFLE TERMS
            </span>
          )}
        </button>

        {/* CHECK ANSWERS BUTTON */}
        <button
          onClick={onValidate}
          className={`w-full py-3 px-4 border-2 border-black transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
            isComplete
              ? 'bg-[#15803d] text-white shadow-[4px_4px_0px_#000000] hover:bg-[#166534]'
              : 'bg-black text-white shadow-[3px_3px_0px_#000000] hover:bg-slate-800'
          }`}
        >
          {lang === 'fa' ? (
            <span className="font-jomhuria text-2xl font-bold leading-none">
              بررسی و محاسبه امتیاز
            </span>
          ) : (
            <span className="font-tech text-xs font-black uppercase tracking-widest">
              CHECK ANSWERS & SCORE
            </span>
          )}
          <span className="font-mono text-xs font-black bg-white text-black px-1.5 py-0.2">
            {totalPlacedCount}/20
          </span>
        </button>
      </div>
    </div>
  );
};
