import React from 'react';
import { WordItem, LanguageMode } from '../types/game';
import { motion } from 'motion/react';
import {
  Leaf,
  Users,
  Coins,
  ShieldCheck,
  TrendingUp,
  Award,
  Compass,
  Shuffle,
  Shield,
  Zap,
  RefreshCw,
  Flame,
  CloudRain,
  Trees,
  Heart,
  Briefcase,
  GraduationCap,
  Sparkles,
  Eye,
  FileCheck,
  Building,
  Scale,
  Lock,
} from 'lucide-react';

interface Props {
  word: WordItem;
  index: number;
  isSelected: boolean;
  isPlaced: boolean;
  onSelect: (word: WordItem) => void;
  onStartDrag?: (
    word: WordItem,
    e: React.PointerEvent | React.TouchEvent | { clientX: number; clientY: number; preventDefault?: () => void }
  ) => void;
  lang: LanguageMode;
}

// Icon mapper for scientific & ESG glyphs with neutral styling to avoid hinting category by color
const getCategoryIcon = (word: WordItem, color: string) => {
  const iconProps = { className: 'w-4 h-4 shrink-0 transition-transform duration-150', style: { color } };
  switch (word.iconName) {
    case 'TrendingUp': return <TrendingUp {...iconProps} />;
    case 'Award': return <Award {...iconProps} />;
    case 'Compass': return <Compass {...iconProps} />;
    case 'Shuffle': return <Shuffle {...iconProps} />;
    case 'Shield': return <Shield {...iconProps} />;
    case 'Zap': return <Zap {...iconProps} />;
    case 'RefreshCw': return <RefreshCw {...iconProps} />;
    case 'Flame': return <Flame {...iconProps} />;
    case 'CloudRain': return <CloudRain {...iconProps} />;
    case 'Trees': return <Trees {...iconProps} />;
    case 'Heart': return <Heart {...iconProps} />;
    case 'Briefcase': return <Briefcase {...iconProps} />;
    case 'GraduationCap': return <GraduationCap {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    case 'Eye': return <Eye {...iconProps} />;
    case 'FileCheck': return <FileCheck {...iconProps} />;
    case 'Building': return <Building {...iconProps} />;
    case 'Scale': return <Scale {...iconProps} />;
    case 'Lock': return <Lock {...iconProps} />;
    case 'Leaf': return <Leaf {...iconProps} />;
    case 'Users': return <Users {...iconProps} />;
    case 'Coins': return <Coins {...iconProps} />;
    case 'ShieldCheck': return <ShieldCheck {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const FloatingWordCard: React.FC<Props> = ({
  word,
  index,
  isSelected,
  isPlaced,
  onSelect,
  onStartDrag,
  lang,
}) => {
  // When placed in the wheel, disappear completely from floating area
  if (isPlaced) {
    return null;
  }

  // UNIFORM NEUTRAL COLOR: Do not hint the segment by category color when answers are floated
  const neutralIconColor = isSelected ? '#34D399' : '#94A3B8';

  // Gentle floating animation
  const duration = 3.6 + (index % 5) * 0.4;
  const delay = (index * 0.15) % 2.0;
  const yOffset = 3 + (index % 3) * 1.5;
  const xOffset = index % 2 === 0 ? 2 : -2;

  const text = lang === 'fa' ? word.fa : word.en;
  const isFa = lang === 'fa';
  const textLen = text.length;

  // DYNAMIC CARD LENGTH: Longer answers expand card size in length to keep font size consistent & legible!
  let minWidth = '130px';
  if (textLen > 24) {
    minWidth = '240px';
  } else if (textLen > 18) {
    minWidth = '205px';
  } else if (textLen > 12) {
    minWidth = '165px';
  }

  return (
    <motion.div
      dir={isFa ? 'rtl' : 'ltr'}
      animate={{
        y: [0, -yOffset, 0, yOffset * 0.6, 0],
        x: [0, xOffset, 0, -xOffset * 0.6, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      whileHover={{
        scale: 1.025,
        zIndex: 30,
        transition: { duration: 0.15 },
      }}
      onPointerDown={(e) => {
        if (onStartDrag) {
          try {
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          } catch (_) {}
          onStartDrag(word, e);
        }
      }}
      onTouchStart={(e) => {
        if (onStartDrag && e.touches.length > 0) {
          const touch = e.touches[0];
          onStartDrag(word, {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => {
              if (e.cancelable) e.preventDefault();
            },
          });
        }
      }}
      onClick={() => onSelect(word)}
      className={`group relative select-none cursor-grab active:cursor-grabbing touch-none transition-all duration-150 rounded-[13px] backdrop-blur-md ${
        isSelected
          ? 'bg-[#12242a] border border-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.25)] ring-1 ring-emerald-400/40'
          : 'bg-[#0d181c]/90 hover:bg-[#122327]/95 border border-white/15 hover:border-emerald-400/40 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
      }`}
      style={{
        padding: '7px 12px',
        minWidth,
        width: 'max-content',
        maxWidth: '300px',
        touchAction: 'none',
      }}
    >
      <div className="flex items-center gap-2.5 leading-none">
        {/* Uniform Neutral Glyph */}
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-[9px] shrink-0 transition-all duration-150 group-hover:scale-105 ${
            isSelected
              ? 'bg-emerald-500/15 border border-emerald-400/40'
              : 'bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
          }`}
        >
          {getCategoryIcon(word, neutralIconColor)}
        </div>

        {/* Word Text: font size remains consistent and legible without truncating */}
        <div className="min-w-0 text-start flex-1">
          {isFa ? (
            <span
              className="font-sans-persian text-xs sm:text-[13px] font-medium tracking-normal block leading-snug whitespace-nowrap text-slate-100 group-hover:text-white"
              title={word.fa}
            >
              {word.fa}
            </span>
          ) : (
            <span
              className="font-tech text-xs sm:text-[12px] font-semibold uppercase tracking-wider block leading-snug whitespace-nowrap text-slate-200 group-hover:text-white"
              title={word.en}
            >
              {word.en}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
