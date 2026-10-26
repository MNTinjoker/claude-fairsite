import React, { useState } from 'react';
import { CategoryId, WordItem, LanguageMode } from '../types/game';
import { CATEGORIES } from '../data/esgData';

interface Props {
  placedWords: Record<CategoryId, (WordItem | null)[]>;
  selectedWord: WordItem | null;
  onSlotClick: (categoryId: CategoryId, slotIndex: number) => void;
  onRemoveWord: (categoryId: CategoryId, slotIndex: number) => void;
  onMovePlacedWord?: (
    word: WordItem,
    fromCategory: CategoryId,
    fromSlot: number,
    toCategory: CategoryId,
    toSlot?: number
  ) => void;
  onInspectWord?: (word: WordItem) => void;
  onDropWordOnSector: (categoryId: CategoryId, slotIndex?: number, wordId?: string) => void;
  onStartDragPlaced?: (
    word: WordItem,
    categoryId: CategoryId,
    slotIndex: number,
    e: React.PointerEvent | React.TouchEvent | { clientX: number; clientY: number; preventDefault?: () => void }
  ) => void;
  activeHoverQuadrant?: CategoryId | null;
  activeHoverSlot?: number | null;
  wheelRotation: number;
  onRotateWheel: (delta: number) => void;
  lang: LanguageMode;
  isEvaluated?: boolean;
  isAllCorrect?: boolean;
  onTogglePause?: () => void;
  isPaused?: boolean;
  onQuadrantClick?: (categoryId: CategoryId) => void;
}

// Polar to Cartesian coordinates (0 deg is Top / 12 o'clock)
export const polarToCartesian = (cx: number, cy: number, r: number, angleDegrees: number) => {
  const rad = ((angleDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

// Generates an exact SVG annular wedge sector path
export const describeWheelSegment = (
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
) => {
  const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, endAngle);
  const p3 = polarToCartesian(cx, cy, rInner, endAngle);
  const p4 = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
};

// Generates clean single circular arc path for text curved along circle
export const describeTextArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  counterClockwise = false
) => {
  const p1 = polarToCartesian(cx, cy, r, startAngle);
  const p2 = polarToCartesian(cx, cy, r, endAngle);
  const sweep = counterClockwise ? 0 : 1;
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${p2.x} ${p2.y}`;
};

// Dynamic font size calculator for placed answers inside the wheel wedge (using Sans font)
// Generously scaled so BOTH Persian and English answers utilize most of the radial depth in the wheel piece
export const getWheelAnswerFontSize = (text: string, isPersian: boolean): number => {
  const len = text.length;
  if (isPersian) {
    if (len <= 7) return 22;
    if (len <= 10) return 20.5;
    if (len <= 14) return 18.5;
    if (len <= 17) return 17;
    return 15.5;
  } else {
    if (len <= 8) return 17;
    if (len <= 12) return 15;
    if (len <= 17) return 13.5;
    if (len <= 22) return 12;
    return 11;
  }
};

// Pre-calculated gentle celebration particles around the wheel perimeter
const CELEBRATION_PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const angle = (i * 10 + (i % 3) * 3) * (Math.PI / 180);
  const baseR = 328 + (i % 5) * 10;
  const cx = 350;
  const cy = 350;
  const x = cx + baseR * Math.cos(angle);
  const y = cy + baseR * Math.sin(angle);
  const driftDist = 26 + (i % 4) * 8;
  const dx = Math.round(driftDist * Math.cos(angle));
  const dy = Math.round(driftDist * Math.sin(angle) - 10);
  // Quadrant colors: Green, Yellow, Blue, Pink
  const colors = ['#22C55E', '#FACC15', '#0EA5E9', '#F00F6F'];
  const color = colors[i % 4];
  const size = 2.5 + (i % 3) * 1.5;
  const dur = (3.2 + (i % 5) * 0.4).toFixed(1);
  const delay = ((i * 0.12) % 2.8).toFixed(2);
  const isSparkle = i % 4 === 0;
  return { id: i, x, y, dx, dy, color, size, dur, delay, isSparkle };
});

export const CircularWheel: React.FC<Props> = ({
  placedWords,
  selectedWord: _selectedWord,
  onSlotClick,
  onStartDragPlaced,
  activeHoverQuadrant,
  activeHoverSlot,
  lang,
  isEvaluated = false,
  isAllCorrect = false,
  onTogglePause,
  isPaused,
  onQuadrantClick,
}) => {
  const [internalHoveredCategory, setInternalHoveredCategory] = useState<CategoryId | null>(null);
  const [internalHoveredSlot, setInternalHoveredSlot] = useState<{ categoryId: CategoryId; index: number } | null>(null);

  const effectiveHoveredCategory = activeHoverQuadrant || internalHoveredCategory;
  const effectiveHoveredSlot =
    activeHoverSlot !== undefined && activeHoverSlot !== null && activeHoverQuadrant
      ? { categoryId: activeHoverQuadrant, index: activeHoverSlot }
      : internalHoveredSlot;

  const cx = 350;
  const cy = 350;

  // Geometry:
  // - Core radius: rCore = 58
  // - Slots: from rSlotsInner = 58 to rSlotsOuter = 285
  // - Outer Quadrant Arc rim: from rRimInner = 292 to rRimOuter = 326 (rRimMid = 309)
  const rCore = 58;
  const rSlotsInner = 58;
  const rSlotsOuter = 285;
  const rRimInner = 292;
  const rRimOuter = 326;
  const rRimMid = 309;

  // Concentric guide circle radii matching subtle technical rings
  const concentricRadii = [105, 150, 195, 240, 285];

  // 4 Quadrants:
  // - TOP: Environmental (315° to 45°)
  // - RIGHT: Social (45° to 135°)
  // - BOTTOM: Economic (135° to 225°)
  // - LEFT: Governance (225° to 315°)
  const quadrants: {
    id: CategoryId;
    startAngle: number;
    endAngle: number;
    centerAngle: number;
    titleEn: string;
    titleFa: string;
    textArcStart: number;
    textArcEnd: number;
    reverseTextArc: boolean;
  }[] = [
    {
      id: 'environmental',
      startAngle: 315,
      endAngle: 405,
      centerAngle: 360,
      titleEn: 'ENVIRONMENTAL',
      titleFa: 'زیست‌محیطی',
      textArcStart: 324,
      textArcEnd: 396,
      reverseTextArc: false,
    },
    {
      id: 'social',
      startAngle: 45,
      endAngle: 135,
      centerAngle: 90,
      titleEn: 'SOCIAL',
      titleFa: 'اجتماعی',
      textArcStart: 54,
      textArcEnd: 126,
      reverseTextArc: false,
    },
    {
      id: 'economic',
      startAngle: 135,
      endAngle: 225,
      centerAngle: 180,
      titleEn: 'ECONOMIC',
      titleFa: 'اقتصادی',
      textArcStart: 216,
      textArcEnd: 144,
      reverseTextArc: true,
    },
    {
      id: 'governance',
      startAngle: 225,
      endAngle: 315,
      centerAngle: 270,
      titleEn: 'GOVERNANCE',
      titleFa: 'راهبری',
      textArcStart: 306,
      textArcEnd: 234,
      reverseTextArc: true,
    },
  ];

  return (
    <div
      id="wheel-container-wrapper"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      className="relative flex flex-col items-center justify-center w-full max-w-[min(96vw,400px)] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[620px] aspect-square mx-auto select-none touch-none"
    >
      {/* SVG Playfield Canvas with smooth celebration breathing pulse */}
      <svg
        id="wheel-svg-canvas"
        viewBox="0 0 700 700"
        style={{ direction: lang === 'fa' ? 'rtl' : 'ltr' }}
        className={`w-full h-full overflow-visible transition-all duration-700 ${
          isAllCorrect
            ? 'animate-wheel-pulse drop-shadow-[0_0_35px_rgba(34,197,94,0.45)]'
            : 'drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
        }`}
      >
        <defs>
          {/* Soft Crisp Highlight Filter with reduced glow to lessen lights */}
          <filter id="soft-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Curved Text Paths for the 4 Quadrant Outer Rims */}
          {quadrants.map((quad) => (
            <path
              key={`text-path-${quad.id}`}
              id={`text-path-${quad.id}`}
              d={describeTextArc(
                cx,
                cy,
                rRimMid,
                quad.textArcStart,
                quad.textArcEnd,
                quad.reverseTextArc
              )}
              fill="none"
            />
          ))}
        </defs>

        {/* Ambient Dark Disc Dial Background */}
        <circle
          cx={cx}
          cy={cy}
          r={rRimOuter + 3}
          fill="#0a1417"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.2"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rSlotsOuter}
          fill="#0c181c"
          opacity="0.95"
        />

        {/* Concentric Guide Rings */}
        {concentricRadii.map((r, idx) => (
          <circle
            key={`guide-ring-${idx}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
            strokeDasharray={idx < 4 ? '3 3' : 'none'}
            pointerEvents="none"
          />
        ))}

        {/* 4 QUADRANTS WITH CONCENTRIC RADIAL WEDGE SLOTS */}
        {quadrants.map((quad) => {
          const category = CATEGORIES[quad.id];
          const isCategoryHovered = effectiveHoveredCategory === quad.id;
          const slots = placedWords[quad.id] || [null, null, null, null, null];
          const span = (quad.endAngle - quad.startAngle) / 5; // 18 deg per wedge

          return (
            <g key={quad.id} className="quadrant-group">
              {/* 5 Radial Wedge Slots inside this Quadrant */}
              {slots.map((wordItem, slotIdx) => {
                const wedgeStart = quad.startAngle + slotIdx * span;
                const wedgeEnd = wedgeStart + span;
                const wedgeMidAngle = wedgeStart + span / 2;

                const isSlotHovered =
                  effectiveHoveredSlot?.categoryId === quad.id &&
                  effectiveHoveredSlot?.index === slotIdx;

                const word = wordItem;
                const isFilled = word !== null;
                const isCorrect = isFilled && word.categoryId === quad.id;

                // Wedge arc surface path
                const wedgePath = describeWheelSegment(
                  cx,
                  cy,
                  rSlotsInner,
                  rSlotsOuter,
                  wedgeStart,
                  wedgeEnd
                );

                // Midpoint coordinates for placed word text / slot label centered along the radial wedge depth
                const rTextMid = (rSlotsInner + rSlotsOuter) / 2;
                const textPos = polarToCartesian(cx, cy, rTextMid, wedgeMidAngle);

                // Angle normalized to [0, 360) where 0 is 12 o'clock, 90 is 3 o'clock, 180 is 6 o'clock, 270 is 9 o'clock
                const normAngle = ((wedgeMidAngle % 360) + 360) % 360;

                // Left side vs Right side opposite facing:
                // Right side (0° to 180°): text rotates outward (normAngle - 90)
                // Left side (180° to 360°): opposite faced so characters are upright and easy to read, NOT upside down! (normAngle + 90)
                const isLeftSide = normAngle > 180 && normAngle < 360;
                const textRotation = isLeftSide ? normAngle + 90 : normAngle - 90;

                const isHighlighted = isSlotHovered;

                // ASSESSED STATE: When evaluated, strictly show ONLY Green (correct) and Red (incorrect)
                const wedgeFill = isEvaluated && isFilled
                  ? isCorrect
                    ? 'rgba(34, 197, 94, 0.35)'     // Bright Emerald Green fill for correct placement
                    : 'rgba(239, 68, 68, 0.35)'     // Bright Crimson Red fill for incorrect placement
                  : isHighlighted
                  ? `${category.color.primary}28`
                  : isFilled
                  ? `${category.color.primary}1c`
                  : isCategoryHovered
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(14, 25, 29, 0.65)';

                const wedgeStroke = isEvaluated && isFilled
                  ? isCorrect
                    ? '#22C55E'                      // Green outline for correct placement
                    : '#EF4444'                      // Red outline for incorrect placement
                  : isHighlighted
                  ? category.color.primary
                  : isFilled
                  ? `${category.color.primary}77`
                  : 'rgba(255, 255, 255, 0.1)';

                const wedgeStrokeWidth = isEvaluated && isFilled ? 2.5 : isHighlighted ? 2 : 1;

                return (
                  <g
                    key={`${quad.id}-slot-${slotIdx}`}
                    data-wheel-slot="true"
                    data-category-id={quad.id}
                    data-slot-index={slotIdx}
                    onPointerDown={(e) => {
                      if (isFilled && word && onStartDragPlaced) {
                        e.stopPropagation();
                        try {
                          (e.currentTarget as unknown as HTMLElement).setPointerCapture?.(e.pointerId);
                        } catch (_) {}
                        onStartDragPlaced(word, quad.id, slotIdx, e);
                      }
                    }}
                    onTouchStart={(e) => {
                      if (isFilled && word && onStartDragPlaced && e.touches.length > 0) {
                        e.stopPropagation();
                        const touch = e.touches[0];
                        onStartDragPlaced(word, quad.id, slotIdx, {
                          clientX: touch.clientX,
                          clientY: touch.clientY,
                          preventDefault: () => {
                            if (e.cancelable) e.preventDefault();
                          },
                        });
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlotClick(quad.id, slotIdx);
                    }}
                    onMouseEnter={() => setInternalHoveredSlot({ categoryId: quad.id, index: slotIdx })}
                    onMouseLeave={() => setInternalHoveredSlot(null)}
                    className="cursor-pointer transition-all duration-150 touch-none select-none"
                    style={{ pointerEvents: 'all', touchAction: 'none' }}
                  >
                    {/* Wedge Surface */}
                    <path
                      d={wedgePath}
                      fill={wedgeFill}
                      stroke={wedgeStroke}
                      strokeWidth={wedgeStrokeWidth}
                      filter={isHighlighted || (isEvaluated && isFilled) ? 'url(#soft-glow)' : undefined}
                      className="transition-colors duration-150"
                    />

                    {/* Radial separating line between slots (ONLY internal slot dividers, never crossing outer boundary) */}
                    {slotIdx < 4 && (
                      <line
                        x1={polarToCartesian(cx, cy, rSlotsInner, wedgeEnd).x}
                        y1={polarToCartesian(cx, cy, rSlotsInner, wedgeEnd).y}
                        x2={polarToCartesian(cx, cy, rSlotsOuter, wedgeEnd).x}
                        y2={polarToCartesian(cx, cy, rSlotsOuter, wedgeEnd).y}
                        stroke={isEvaluated ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'}
                        strokeWidth="1"
                      />
                    )}

                    {/* Slot Content: If Empty -> Show Slot Number (1, 2, 3, 4, 5) with clean sans font */}
                    {!isFilled && (
                      <text
                        x={textPos.x}
                        y={textPos.y + 4}
                        textAnchor="middle"
                        fill={isHighlighted ? category.color.primary : 'rgba(255, 255, 255, 0.3)'}
                        fontSize="14"
                        fontWeight="700"
                        fontFamily="Plus Jakarta Sans, Vazirmatn, sans-serif"
                        pointerEvents="none"
                      >
                        {slotIdx + 1}
                      </text>
                    )}

                    {/* If Placed -> Show Word Text spanning maximum length in wheel piece, properly faced on left and right sides */}
                    {isFilled && word && (
                      <g
                        transform={`translate(${textPos.x}, ${textPos.y}) rotate(${textRotation})`}
                        pointerEvents="none"
                      >
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={isEvaluated ? (isCorrect ? '#86EFAC' : '#FCA5A5') : '#FFFFFF'}
                          fontSize={getWheelAnswerFontSize(lang === 'fa' ? word.fa : word.en, lang === 'fa')}
                          fontWeight="700"
                          fontFamily={lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', sans-serif"}
                          direction={lang === 'fa' ? 'rtl' : 'ltr'}
                          unicodeBidi="isolate"
                          letterSpacing={lang === 'fa' ? '0' : '0.02em'}
                          style={{
                            direction: lang === 'fa' ? 'rtl' : 'ltr',
                            unicodeBidi: 'isolate',
                            letterSpacing: lang === 'fa' ? '0' : '0.02em',
                          }}
                        >
                          {lang === 'fa' ? word.fa : word.en}
                        </text>
                      </g>
                    )}

                    {/* Assessed State Indicator Badge: Green checkmark (✓) or Red cross (✕) placed near inner hub */}
                    {isEvaluated && isFilled && (
                      <g
                        transform={`translate(${polarToCartesian(cx, cy, rSlotsInner + 18, wedgeMidAngle).x}, ${polarToCartesian(cx, cy, rSlotsInner + 18, wedgeMidAngle).y})`}
                        pointerEvents="none"
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r="7"
                          fill={isCorrect ? '#22C55E' : '#EF4444'}
                          stroke="#0a1417"
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="2.5"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="900"
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                        >
                          {isCorrect ? '✓' : '✕'}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              <g
                data-wheel-quadrant="true"
                data-category-id={quad.id}
                onClick={() => {
                  if (onQuadrantClick) onQuadrantClick(quad.id);
                }}
                onMouseEnter={() => setInternalHoveredCategory(quad.id)}
                onMouseLeave={() => setInternalHoveredCategory(null)}
                className="cursor-pointer"
                style={{ pointerEvents: 'all' }}
              >
                {/* Curved outer band path - in assessed state stays clean neutral so only green & red pop */}
                <path
                  d={describeWheelSegment(cx, cy, rRimInner, rRimOuter, quad.startAngle, quad.endAngle)}
                  fill={
                    isEvaluated
                      ? 'rgba(255, 255, 255, 0.03)'
                      : isCategoryHovered
                      ? `${category.color.primary}25`
                      : `${category.color.primary}0f`
                  }
                  stroke={isEvaluated ? 'rgba(255, 255, 255, 0.22)' : category.color.primary}
                  strokeWidth={isCategoryHovered ? 2 : 1.5}
                  className="transition-all duration-150"
                />

                {/* Persian titles: straight text rotated to the arc (Safari scrambles RTL text on a textPath) */}
                {lang === 'fa' ? (() => {
                  const mid = (quad.textArcStart + quad.textArcEnd) / 2;
                  const p = polarToCartesian(cx, cy, rRimMid, mid);
                  const norm = ((mid % 360) + 360) % 360;
                  const rot = norm > 90 && norm < 270 ? mid - 180 : mid;
                  return (
                    <text
                      x={p.x}
                      y={p.y}
                      transform={`rotate(${rot} ${p.x} ${p.y})`}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="14"
                      fontWeight="800"
                      fontFamily="'Vazirmatn', sans-serif"
                      className="select-none pointer-events-none transition-colors duration-150"
                      style={{ fill: isEvaluated
                    ? 'rgba(255, 255, 255, 0.55)'
                    : isCategoryHovered
                    ? '#FFFFFF'
                    : category.color.primary }}
                    >
                      {quad.titleFa}
                    </text>
                  );
                })() : (
                <text
                  direction={lang === 'fa' ? 'rtl' : 'ltr'}
                  className="select-none pointer-events-none transition-colors duration-150"
                  style={{
                    direction: lang === 'fa' ? 'rtl' : 'ltr',
                    unicodeBidi: 'isolate',
                    fill: isEvaluated
                      ? 'rgba(255, 255, 255, 0.55)'
                      : isCategoryHovered
                      ? '#FFFFFF'
                      : category.color.primary,
                  }}
                >
                  <textPath
                    href={`#text-path-${quad.id}`}
                    startOffset="50%"
                    textAnchor="middle"
                    fontSize={lang === 'fa' ? '14' : '12'}
                    fontWeight="800"
                    fontFamily={lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', sans-serif"}
                    letterSpacing={lang === 'fa' ? '0' : '0.12em'}
                    style={{
                      letterSpacing: lang === 'fa' ? '0' : '0.12em',
                      direction: lang === 'fa' ? 'rtl' : 'ltr',
                    }}
                  >
                    {lang === 'fa' ? quad.titleFa : quad.titleEn}
                  </textPath>
                </text>
                )}
              </g>

              {/* Quadrant Dividing Spoke line runs STRICTLY between rSlotsInner and rSlotsOuter */}
              <line
                x1={polarToCartesian(cx, cy, rSlotsInner, quad.endAngle).x}
                y1={polarToCartesian(cx, cy, rSlotsInner, quad.endAngle).y}
                x2={polarToCartesian(cx, cy, rSlotsOuter, quad.endAngle).x}
                y2={polarToCartesian(cx, cy, rSlotsOuter, quad.endAngle).y}
                stroke={isEvaluated ? 'rgba(255, 255, 255, 0.18)' : category.color.primary}
                strokeWidth="1.5"
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* CENTER CORE: Static circular hub (no hover scaling/wobble) with single-language naming */}
        <g
          id="wheel-center-core"
          onClick={() => {
            if (onTogglePause) onTogglePause();
          }}
          className="cursor-pointer"
        >
          {/* Subtle Outer Core Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={rCore + 2}
            fill="none"
            stroke={isEvaluated ? '#22C55E' : '#10B981'}
            strokeWidth="1.2"
            opacity="0.45"
          />

          {/* Core Disc Body - Strictly Static */}
          <circle
            cx={cx}
            cy={cy}
            r={rCore}
            fill="#091417"
            stroke={isEvaluated ? '#22C55E' : '#10B981'}
            strokeWidth="1.5"
          />

          {/* Center Core Title: WISE WHEEL in English or گردونه پایداری in Persian, never both at the same time */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill={isEvaluated ? '#4ADE80' : '#34D399'}
            fontSize={lang === 'fa' ? '12.5' : '11.5'}
            fontWeight="800"
            fontFamily={lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', sans-serif"}
            direction={lang === 'fa' ? 'rtl' : 'ltr'}
            unicodeBidi="isolate"
            letterSpacing={lang === 'fa' ? '0' : '0.08em'}
            style={{ direction: lang === 'fa' ? 'rtl' : 'ltr', unicodeBidi: 'isolate' }}
            pointerEvents="none"
          >
            {lang === 'fa' ? 'گردونه پایداری' : 'WISE WHEEL'}
          </text>
          <text
            x={cx}
            y={cy + 13}
            textAnchor="middle"
            fill={isAllCorrect ? '#86EFAC' : 'rgba(255, 255, 255, 0.6)'}
            fontSize={lang === 'fa' ? '9.5' : '8.5'}
            fontWeight="600"
            fontFamily={lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', sans-serif"}
            direction={lang === 'fa' ? 'rtl' : 'ltr'}
            unicodeBidi="isolate"
            letterSpacing={lang === 'fa' ? '0' : '0.06em'}
            style={{ direction: lang === 'fa' ? 'rtl' : 'ltr', unicodeBidi: 'isolate' }}
            pointerEvents="none"
          >
            {isPaused
              ? (lang === 'fa' ? 'متوقف شده' : 'PAUSED')
              : isAllCorrect
              ? (lang === 'fa' ? 'هماهنگی کامل ۲۰/۲۰' : 'PERFECT 20/20')
              : isEvaluated
              ? (lang === 'fa' ? 'ارزیابی شد' : 'ASSESSED')
              : (lang === 'fa' ? 'مدل وایز' : 'PSIA MODEL')}
          </text>
        </g>

        {/* GENTLE CELEBRATION EFFECT: Soft glowing aura rings & drifting particles in quadrant colors */}
        {isAllCorrect && (
          <g id="celebration-particles-layer" pointerEvents="none">
            {/* Radiant soft aura rings */}
            <circle
              cx={cx}
              cy={cy}
              r={rRimOuter + 8}
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.55"
            />
            <circle
              cx={cx}
              cy={cy}
              r={rRimOuter + 18}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.35"
            />

            {/* 36 Gentle drifting celebration motes in Green, Yellow, Blue, Pink */}
            {CELEBRATION_PARTICLES.map((p) => (
              <g
                key={`particle-${p.id}`}
                className="celebration-particle"
                style={
                  {
                    '--dx': `${p.dx}px`,
                    '--dy': `${p.dy}px`,
                    '--dur': `${p.dur}s`,
                    '--delay': `${p.delay}s`,
                  } as React.CSSProperties
                }
              >
                {p.isSparkle ? (
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={p.color}
                    fontSize="11"
                    opacity="0.85"
                    fontWeight="bold"
                  >
                    ✦
                  </text>
                ) : (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.size}
                    fill={p.color}
                    opacity="0.8"
                    filter="url(#soft-glow)"
                  />
                )}
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};
