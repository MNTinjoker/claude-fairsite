import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CategoryId, WordItem, GameMode, AppState, GameStats, LanguageMode } from './types/game';
import { CATEGORIES, WORD_ITEMS } from './data/esgData';
import { sound } from './utils/audio';
import { GameHUD } from './components/GameHUD';
import { CircularWheel } from './components/CircularWheel';
import { WheelControlBar } from './components/WheelControlBar';
import { FloatingWordCard } from './components/FloatingWordCard';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { TermDetailModal } from './components/TermDetailModal';
import { SegmentDetailModal } from './components/SegmentDetailModal';
import { IntroScreen } from './components/IntroScreen';
import { motion } from 'motion/react';

// Fisher-Yates array shuffling
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface DragSession {
  word: WordItem;
  fromCategory?: CategoryId;
  fromSlot?: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  hasMoved: boolean;
  targetCategory: CategoryId | null;
  targetSlot: number | null;
  isOverWheel: boolean;
}

export default function App() {
  // App begins on the Intro / Explanation Home Screen
  const [appState, setAppState] = useState<AppState>('TITLE');
  const [language, setLanguage] = useState<LanguageMode>('fa');
  const [gameMode] = useState<GameMode>('zen');

  // Wheel state: 4 sectors, 5 slots each
  const [placedWords, setPlacedWords] = useState<Record<CategoryId, (WordItem | null)[]>>({
    economic: [null, null, null, null, null],
    environmental: [null, null, null, null, null],
    social: [null, null, null, null, null],
    governance: [null, null, null, null, null],
  });

  // Floating word bank: all 20 corporate sustainability terms
  const [displayedWords, setDisplayedWords] = useState<WordItem[]>(() => shuffleArray(WORD_ITEMS));
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);

  // Wheel rotation angle
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const wheelRotationRef = useRef<number>(0);
  useEffect(() => {
    wheelRotationRef.current = wheelRotation;
  }, [wheelRotation]);

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const placedWordsRef = useRef(placedWords);
  useEffect(() => {
    placedWordsRef.current = placedWords;
  }, [placedWords]);

  // Evaluation state
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [finalCorrectCount, setFinalCorrectCount] = useState<number>(0);

  // Check if all 20 items are placed and correctly categorized
  const isAllCorrect = React.useMemo(() => {
    const cats: CategoryId[] = ['environmental', 'social', 'economic', 'governance'];
    return cats.every((catId) => {
      const slots = placedWords[catId];
      return slots && slots.length === 5 && slots.every((w) => w !== null && w.categoryId === catId);
    });
  }, [placedWords]);

  // One-time gentle audio chime when user reaches all 20 correct placements
  const prevAllCorrectRef = useRef<boolean>(false);
  useEffect(() => {
    if (isAllCorrect && !prevAllCorrectRef.current) {
      sound.playSuccess();
    }
    prevAllCorrectRef.current = isAllCorrect;
  }, [isAllCorrect]);

  // Modals & detail view
  const [inspectedWord, setInspectedWord] = useState<WordItem | null>(null);
  const [inspectedCategory, setInspectedCategory] = useState<CategoryId | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Drag Engine Visual State
  const [dragPreview, setDragPreview] = useState<{
    word: WordItem;
    x: number;
    y: number;
    fromCategory?: CategoryId;
  } | null>(null);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<CategoryId | null>(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);
  const [isOverWheel, setIsOverWheel] = useState<boolean>(false);

  const dragSessionRef = useRef<DragSession | null>(null);
  const lastDragEndTimestampRef = useRef<number>(0);

  // Stats tracking
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 1,
    maxCombo: 1,
    correctCount: 0,
    mistakesCount: 0,
    startTime: Date.now(),
    elapsedSeconds: 0,
    hintsUsed: 0,
  });

  // Action feedback omitted per user request
  const showFeedback = useCallback((_fa: string, _en: string, _type: 'success' | 'error' | 'info' = 'info') => {
    // Popup notifications omitted in both versions
  }, []);

  // Initialize or restart puzzle
  const startGame = useCallback((mode: GameMode) => {
    setPlacedWords({
      economic: [null, null, null, null, null],
      environmental: [null, null, null, null, null],
      social: [null, null, null, null, null],
      governance: [null, null, null, null, null],
    });
    const shuffled = shuffleArray(WORD_ITEMS);
    setDisplayedWords(shuffled);
    setSelectedWord(null);
    setIsEvaluated(false);
    setShowResultsModal(false);
    setFinalScore(0);
    setFinalCorrectCount(0);
    setStats({
      score: 0,
      combo: 1,
      maxCombo: 1,
      correctCount: 0,
      mistakesCount: 0,
      startTime: Date.now(),
      elapsedSeconds: 0,
      hintsUsed: 0,
    });
    setAppState('PLAYING');
    sound.playTap();
  }, []);

  // Audio mute toggle
  const toggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Game timer loop
  useEffect(() => {
    if (appState !== 'PLAYING' || isEvaluated) return;

    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [appState, isEvaluated]);

  // Keyboard shortcut listener for Esc pause and keys 1-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (appState === 'PLAYING') {
          setAppState('PAUSED');
        } else if (appState === 'PAUSED') {
          setAppState('PLAYING');
        } else if (inspectedWord) {
          setInspectedWord(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, inspectedWord]);

  // Rotate wheel handler
  const handleRotateWheel = (delta: number) => {
    sound.playRotate();
    setWheelRotation((prev) => prev + delta);
  };

  // Check if a specific word is placed on the wheel
  const isWordPlaced = useCallback((wordId: string) => {
    return Object.values(placedWords).some((slots) => slots.some((w) => w?.id === wordId));
  }, [placedWords]);

  // Place a specific word into a target category and slot
  const placeWordWithItem = useCallback(
    (wordToPlace: WordItem, targetCategory: CategoryId, targetSlotIndex?: number) => {
      sound.playTap();

      setPlacedWords((prev) => {
        let slotIdx = targetSlotIndex;
        if (slotIdx === undefined || prev[targetCategory][slotIdx] !== null) {
          const freeSlot = prev[targetCategory].findIndex((w) => w === null);
          if (freeSlot !== -1) {
            slotIdx = freeSlot;
          } else if (slotIdx === undefined) {
            slotIdx = 0;
          }
        }

        // Clean out any duplicate of this word from all sectors
        const updated: Record<CategoryId, (WordItem | null)[]> = {
          economic: prev.economic.map((w) => (w?.id === wordToPlace.id ? null : w)),
          environmental: prev.environmental.map((w) => (w?.id === wordToPlace.id ? null : w)),
          social: prev.social.map((w) => (w?.id === wordToPlace.id ? null : w)),
          governance: prev.governance.map((w) => (w?.id === wordToPlace.id ? null : w)),
        };

        const targetSlots = [...updated[targetCategory]];
        targetSlots[slotIdx] = wordToPlace;
        updated[targetCategory] = targetSlots;

        const totalPlaced = Object.values(updated).reduce(
          (acc, list) => acc + list.filter((w) => w !== null).length,
          0
        );

        if (totalPlaced === 20) {
          showFeedback(
            'هر ۲۰ واژه در گردونه قرار گرفتند! دکمه پایان و ارزیابی را بزنید.',
            'All 20 terms placed! Click FINISH & SCORE on top.',
            'success'
          );
        } else {
          showFeedback(
            `واژه در قطاع ${CATEGORIES[targetCategory].fa} قرار گرفت (${totalPlaced}/20).`,
            `Placed in ${CATEGORIES[targetCategory].en} (${totalPlaced}/20).`,
            'info'
          );
        }

        return updated;
      });

      setSelectedWord(null);
      if (isEvaluated) setIsEvaluated(false);
    },
    [isEvaluated, showFeedback]
  );

  // Move a placed card from one segment to another
  const handleMovePlacedWord = useCallback(
    (
      word: WordItem,
      fromCategory: CategoryId,
      fromSlot: number,
      toCategory: CategoryId,
      toSlot?: number
    ) => {
      sound.playTap();

      setPlacedWords((prev) => {
        const sourceSlots = [...prev[fromCategory]];
        sourceSlots[fromSlot] = null;

        const targetSlots = [...(fromCategory === toCategory ? sourceSlots : prev[toCategory])];
        let targetIdx = toSlot;
        if (targetIdx === undefined || targetSlots[targetIdx] !== null) {
          const freeIdx = targetSlots.findIndex((w) => w === null);
          if (freeIdx !== -1) {
            targetIdx = freeIdx;
          } else if (targetIdx !== undefined && targetSlots[targetIdx] !== null) {
            // Swap places between source and target!
            const displaced = targetSlots[targetIdx];
            targetSlots[targetIdx] = word;
            sourceSlots[fromSlot] = displaced;
            showFeedback('جایگاه دو واژه با موفقیت جابجا شد.', 'Words swapped between slots.', 'info');
            return {
              ...prev,
              [fromCategory]: sourceSlots,
              [toCategory]: targetSlots,
            };
          } else {
            targetIdx = 0;
          }
        }

        targetSlots[targetIdx] = word;

        return {
          ...prev,
          [fromCategory]: fromCategory === toCategory ? targetSlots : sourceSlots,
          [toCategory]: targetSlots,
        };
      });

      if (isEvaluated) setIsEvaluated(false);

      showFeedback(
        `واژه به قطاع ${CATEGORIES[toCategory].fa} منتقل شد.`,
        `Word moved to ${CATEGORIES[toCategory].en}.`,
        'info'
      );
    },
    [isEvaluated, showFeedback]
  );

  // Remove a word from the wheel back to floating unplaced pool
  const handleRemoveWord = useCallback((categoryId: CategoryId, slotIndex: number) => {
    sound.playTap();
    setPlacedWords((prev) => {
      const newSlots = [...prev[categoryId]];
      newSlots[slotIndex] = null;
      return {
        ...prev,
        [categoryId]: newSlots,
      };
    });

    if (isEvaluated) {
      setIsEvaluated(false);
    }
    showFeedback('واژه از گردونه خارج شد و به کارت‌های شناور بازگشت.', 'Word returned to floating cards.', 'info');
  }, [isEvaluated, showFeedback]);

  // Handle clicking a slot directly on the wheel
  const handleSlotClick = useCallback((categoryId: CategoryId, slotIndex: number) => {
    if (Date.now() - lastDragEndTimestampRef.current < 250) return;

    sound.playTap();
    const existing = placedWordsRef.current[categoryId][slotIndex];

    if (selectedWord) {
      placeWordWithItem(selectedWord, categoryId, slotIndex);
    } else if (existing) {
      setInspectedWord(existing);
    }
  }, [selectedWord, placeWordWithItem]);

  // Drop word on sector or slot (from drag or active selection)
  const handleDropWordOnSector = useCallback((categoryId: CategoryId, slotIndex?: number, wordId?: string) => {
    const wordToPlace = wordId
      ? WORD_ITEMS.find((w) => w.id === wordId)
      : selectedWord;
    if (wordToPlace) {
      placeWordWithItem(wordToPlace, categoryId, slotIndex);
    }
  }, [selectedWord, placeWordWithItem]);

  // Shuffle floating words around the wheel
  const handleShuffle = () => {
    sound.playRotate();
    setDisplayedWords((prev) => shuffleArray(prev));
    showFeedback('موقعیت کارت‌های شناور بر زده شد.', 'Floating cards shuffled around the wheel.', 'info');
  };

  // Check answers and calculate score after words are placed
  const handleValidateAndScore = () => {
    sound.playTap();
    const totalPlaced = Object.values(placedWords).reduce(
      (acc, list) => acc + list.filter((w) => w !== null).length,
      0
    );

    if (totalPlaced < 20) {
      showFeedback(
        `لطفاً ابتدا تمامی ۲۰ واژه را در گردونه قرار دهید (${totalPlaced} از ۲۰ جایگذاری شده است).`,
        `Please place all 20 terms first (${totalPlaced}/20 placed).`,
        'info'
      );
      return;
    }

    // Evaluate all 20 slots against host quadrant
    let correct = 0;
    (['economic', 'environmental', 'social', 'governance'] as CategoryId[]).forEach((catId) => {
      placedWords[catId].forEach((w) => {
        if (w && w.categoryId === catId) {
          correct++;
        }
      });
    });

    const score = correct * 100 + Math.max(0, 1000 - stats.elapsedSeconds * 5);
    setFinalScore(score);
    setFinalCorrectCount(correct);
    setIsEvaluated(true);
    // Report result to the host site (scored once, server-side)
    window.parent?.postMessage({ type: 'game-result', percent: Math.round((correct / 20) * 100) }, '*');
    // Non-intrusive celebration on the wheel: no popup modal
    setShowResultsModal(false);

    if (correct === 20) {
      sound.playSuccess();
    } else {
      sound.playError();
      // Let the red/green marks show for a moment, then move wrong answers to their right segments.
      setTimeout(runCorrection, 1400);
    }
  };

  // After assessment: fly each wrong card out of its wedge into a wedge of its correct segment
  // (swapping with a card that is also wrong there), one swap at a time, until everything is correct.
  const runCorrection = () => {
    const cats = ['economic', 'environmental', 'social', 'governance'] as CategoryId[];
    const blocker = document.createElement('div');
    blocker.style.cssText = 'position:fixed;inset:0;z-index:9998;';
    document.body.appendChild(blocker);

    const slotCenter = (cat: CategoryId, idx: number) => {
      const el = document.querySelector(`[data-category-id="${cat}"][data-slot-index="${idx}"]`);
      const r = el?.getBoundingClientRect();
      return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
    };
    const flyer = (word: WordItem, from: { x: number; y: number }, to: { x: number; y: number }) => {
      const d = document.createElement('div');
      d.textContent = language === 'fa' ? word.fa : word.en;
      d.style.cssText = `position:fixed;left:${from.x}px;top:${from.y}px;z-index:9999;transform:translate(-50%,-50%) scale(1);
        padding:6px 12px;border-radius:999px;background:rgba(10,20,14,.92);color:#bbf7d0;font:700 13px Vazirmatn,sans-serif;
        border:1.5px solid #4ade80;box-shadow:0 0 14px rgba(74,222,128,.6);white-space:nowrap;pointer-events:none;
        transition:left .8s cubic-bezier(.4,0,.2,1),top .8s cubic-bezier(.4,0,.2,1),transform .8s;`;
      document.body.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        d.style.left = `${to.x}px`; d.style.top = `${to.y}px`; d.style.transform = 'translate(-50%,-50%) scale(1.08)';
      }));
      return d;
    };

    const step = () => {
      const board = placedWordsRef.current;
      let src: { cat: CategoryId; idx: number; word: WordItem } | null = null;
      for (const c of cats) board[c].forEach((w, i) => { if (!src && w && w.categoryId !== c) src = { cat: c, idx: i, word: w }; });
      if (!src) { blocker.remove(); sound.playSuccess(); return; }
      const { cat, idx, word } = src as { cat: CategoryId; idx: number; word: WordItem };
      const target = word.categoryId;
      let j = board[target].findIndex((w) => !w || w.categoryId !== target);
      if (j < 0) j = 0;
      const other = board[target][j];
      const a = slotCenter(cat, idx), b = slotCenter(target, j);
      const f1 = flyer(word, a, b);
      const f2 = other ? flyer(other, b, a) : null;
      sound.playTap();
      setTimeout(() => {
        setPlacedWords((prev) => {
          const next = { ...prev, [cat]: [...prev[cat]], [target]: [...prev[target]] };
          next[target][j] = word;
          next[cat][idx] = other;
          return next;
        });
        f1.remove(); f2?.remove();
        setTimeout(step, 250);
      }, 850);
    };
    step();
  };

  // --- RE-ENGINEERED DIRECT-POINTER ENGINE FOR ROCK-SOLID DRAG & DROP & DRAG-OUT ---
  const testWheelHit = (
    clientX: number,
    clientY: number,
    currentRotation: number
  ): { isOverWheel: boolean; categoryId: CategoryId | null; slotIndex: number | null } => {
    // 1. Element lookup using data-attributes
    const el = document.elementFromPoint(clientX, clientY);
    if (el) {
      const slotEl = el.closest('[data-wheel-slot]');
      if (slotEl) {
        const cat = slotEl.getAttribute('data-category-id') as CategoryId;
        const idxStr = slotEl.getAttribute('data-slot-index');
        const idx = idxStr !== null ? parseInt(idxStr, 10) : null;
        if (cat) return { isOverWheel: true, categoryId: cat, slotIndex: idx };
      }

      const quadEl = el.closest('[data-wheel-quadrant]');
      if (quadEl) {
        const cat = quadEl.getAttribute('data-category-id') as CategoryId;
        if (cat) return { isOverWheel: true, categoryId: cat, slotIndex: null };
      }
    }

    // 2. High-precision geometric wheel boundary testing
    const wrapper = document.getElementById('wheel-container-wrapper');
    if (!wrapper) return { isOverWheel: false, categoryId: null, slotIndex: null };

    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    // Wheel dial limits: inner hub cutoff at 14% radius, outer rim at 96% radius
    const maxR = (rect.width / 2) * 0.98;
    const minR = (rect.width / 2) * 0.14;

    if (dist < minR || dist > maxR) {
      // Unambiguously OUTSIDE the wheel!
      return { isOverWheel: false, categoryId: null, slotIndex: null };
    }

    // Inside the wheel dial: calculate quadrant and slot index
    const screenAngle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360;
    const wheelAngle = (screenAngle - currentRotation + 3600) % 360;

    let quadId: CategoryId;
    let quadStart: number;
    if (wheelAngle >= 315 || wheelAngle < 45) {
      quadId = 'economic';
      quadStart = 315;
    } else if (wheelAngle >= 45 && wheelAngle < 135) {
      quadId = 'environmental';
      quadStart = 45;
    } else if (wheelAngle >= 135 && wheelAngle < 225) {
      quadId = 'social';
      quadStart = 135;
    } else {
      quadId = 'governance';
      quadStart = 225;
    }

    const offsetAngle = (wheelAngle - quadStart + 360) % 360;
    const slotIdx = Math.min(4, Math.max(0, Math.floor(offsetAngle / 18)));

    return { isOverWheel: true, categoryId: quadId, slotIndex: slotIdx };
  };

  const startDragEngine = (
    word: WordItem,
    fromCategory?: CategoryId,
    fromSlot?: number,
    clientX: number = 0,
    clientY: number = 0
  ) => {
    dragSessionRef.current = {
      word,
      fromCategory,
      fromSlot,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      hasMoved: false,
      targetCategory: null,
      targetSlot: null,
      isOverWheel: false,
    };

    const handleMoveCoord = (clientX: number, clientY: number) => {
      const session = dragSessionRef.current;
      if (!session) return;

      const dist = Math.hypot(clientX - session.startX, clientY - session.startY);
      if (!session.hasMoved && dist > 4) {
        session.hasMoved = true;
      }

      session.currentX = clientX;
      session.currentY = clientY;

      if (session.hasMoved) {
        setDragPreview({
          word: session.word,
          x: clientX,
          y: clientY,
          fromCategory: session.fromCategory,
        });

        const hit = testWheelHit(clientX, clientY, wheelRotationRef.current);
        session.isOverWheel = hit.isOverWheel;
        session.targetCategory = hit.categoryId;
        session.targetSlot = hit.slotIndex;

        setIsOverWheel(hit.isOverWheel);
        setHoveredQuadrant(hit.categoryId);
        setHoveredSlotIndex(hit.slotIndex);
      }
    };

    const handleEndDrag = (clientX: number, clientY: number) => {
      cleanupListeners();

      const session = dragSessionRef.current;
      if (!session) return;
      dragSessionRef.current = null;

      setDragPreview(null);
      setIsOverWheel(false);
      setHoveredQuadrant(null);
      setHoveredSlotIndex(null);

      if (!session.hasMoved) {
        // Was simply a tap/click:
        if (session.fromCategory === undefined) {
          // Click on floating card
          setSelectedWord((prev) => (prev?.id === session.word.id ? null : session.word));
        } else {
          // Click on placed card
          handleSlotClick(session.fromCategory, session.fromSlot!);
        }
        return;
      }

      // Mark that a drag was just completed to block following synthetic click
      lastDragEndTimestampRef.current = Date.now();

      // Final hit-test on drop
      const hit = testWheelHit(clientX, clientY, wheelRotationRef.current);

      if (hit.isOverWheel && hit.categoryId) {
        // --- 1. DROPPED ONTO THE WHEEL ---
        if (session.fromCategory !== undefined && session.fromSlot !== undefined) {
          // Move from one segment to another
          handleMovePlacedWord(
            session.word,
            session.fromCategory,
            session.fromSlot,
            hit.categoryId,
            hit.slotIndex !== null ? hit.slotIndex : undefined
          );
        } else {
          // Place floating card onto wheel
          placeWordWithItem(
            session.word,
            hit.categoryId,
            hit.slotIndex !== null ? hit.slotIndex : undefined
          );
        }
      } else {
        // --- 2. DROPPED OUTSIDE THE WHEEL ---
        if (session.fromCategory !== undefined && session.fromSlot !== undefined) {
          // DRAG OUT OF WHEEL: Return to floating pool!
          handleRemoveWord(session.fromCategory, session.fromSlot);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      handleMoveCoord(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      handleEndDrag(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      // Crucial on iOS Safari: completely prevent page scroll hijacking during drag
      if (e.cancelable) {
        e.preventDefault();
      }
      if (e.touches && e.touches.length > 0) {
        handleMoveCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const session = dragSessionRef.current;
      const finalX = session ? session.currentX : (e.changedTouches?.[0]?.clientX ?? 0);
      const finalY = session ? session.currentY : (e.changedTouches?.[0]?.clientY ?? 0);
      handleEndDrag(finalX, finalY);
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
  };

  const handleStartDragFloating = (
    word: WordItem,
    e: React.PointerEvent | React.TouchEvent | { clientX: number; clientY: number; preventDefault?: () => void }
  ) => {
    if ('preventDefault' in e && typeof e.preventDefault === 'function') {
      try {
        e.preventDefault();
      } catch (_) {}
    }
    if (dragSessionRef.current) return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e && 'clientY' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    startDragEngine(word, undefined, undefined, clientX, clientY);
  };

  const handleStartDragPlaced = (
    word: WordItem,
    categoryId: CategoryId,
    slotIndex: number,
    e: React.PointerEvent | React.TouchEvent | { clientX: number; clientY: number; preventDefault?: () => void }
  ) => {
    if ('preventDefault' in e && typeof e.preventDefault === 'function') {
      try {
        e.preventDefault();
      } catch (_) {}
    }
    if (dragSessionRef.current) return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e && 'clientY' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    startDragEngine(word, categoryId, slotIndex, clientX, clientY);
  };

  // Total placed counter
  const totalPlacedCount = Object.values(placedWords).reduce(
    (acc, list) => acc + list.filter((w) => w !== null).length,
    0
  );

  // Stable categorized distribution matching reference screenshot flanks
  const unplacedWords = displayedWords.filter((w) => !isWordPlaced(w.id));
  const leftFlankWords = unplacedWords.filter(
    (w) => w.categoryId === 'environmental' || w.categoryId === 'governance'
  );
  const rightFlankWords = unplacedWords.filter(
    (w) => w.categoryId === 'social' || w.categoryId === 'economic'
  );

  return (
    <div
      dir={language === 'fa' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070e11] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden overflow-y-auto"
    >
      {/* Ambient Emerald Vignette Glow centered behind Wheel (lessened lights) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/4 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-cyan-500/3 blur-[90px]" />
      </div>

      {/* Screen 1: Intro / Explanation Screen */}
      {appState === 'TITLE' && (
        <IntroScreen
          onEnter={() => startGame('zen')}
          lang={language}
          onToggleLang={(newLang) => setLanguage(newLang)}
        />
      )}

      {/* Screen 2: Main Puzzle Dial Playfield */}
      {(appState === 'PLAYING' || appState === 'PAUSED') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col w-full relative z-10"
        >
          {/* Wheel Page Blurred and Darkened Background Artwork (clearly visible) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="assets/aistudio/Carbon-Footprint-Reduction-BG_d0adbcc2.webp"
              alt="Carbon Footprint Biosphere"
              className="w-full h-full object-cover object-center scale-105 filter blur-[6px] brightness-75 contrast-105"
            />
            {/* Gentle dark overlay to keep image prominently visible while guaranteeing text & wheel legibility */}
            <div className="absolute inset-0 bg-[#070e11]/50" />
          </div>

          {/* Top Game HUD Header: Floating Capsule matching screenshot */}
          <GameHUD
            mode={gameMode}
            stats={stats}
            totalWords={20}
            placedCount={totalPlacedCount}
            isMuted={isMuted}
            onToggleSound={toggleSound}
            onPause={() => setAppState('PAUSED')}
            onOpenIntro={() => setAppState('TITLE')}
            lang={language}
            onToggleLang={(newLang) => setLanguage(newLang)}
            isPaused={appState === 'PAUSED'}
          />

          {/* Main Puzzle Playfield */}
          <main className="flex-1 w-full max-w-[1600px] mx-auto px-1 xs:px-2 sm:px-6 py-1 sm:py-2 flex flex-col items-center justify-start lg:justify-center relative">
            {/* The Shuffle, Check / Score, and Rotate controls */}
            <WheelControlBar
              onShuffle={handleShuffle}
              onValidate={handleValidateAndScore}
              totalPlacedCount={totalPlacedCount}
              wheelRotation={wheelRotation}
              onRotateWheel={handleRotateWheel}
              lang={language}
            />

            {/* Central Stage: Flanking Floating Cards & Central Circular Wheel (optimized for dynamic card lengths & mobile scrolling) */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2.5 sm:gap-4 xl:gap-8 relative pb-4 sm:pb-8">
              {/* Left Flank: Floating Unplaced Answer Cards (cards expand in length dynamically based on text) */}
              <div className="w-full lg:w-[300px] xl:w-[420px] 2xl:w-[460px] lg:shrink-0 flex flex-wrap justify-center items-center content-center gap-1.5 sm:gap-2.5 py-1 sm:py-2 z-10 max-w-full order-2 lg:order-1">
                {leftFlankWords.map((word, idx) => (
                  <FloatingWordCard
                    key={word.id}
                    word={word}
                    index={idx}
                    isSelected={selectedWord?.id === word.id}
                    isPlaced={false}
                    onSelect={(w) => {
                      if (Date.now() - lastDragEndTimestampRef.current < 250) return;
                      if (selectedWord?.id === w.id) {
                        setSelectedWord(null);
                      } else {
                        setSelectedWord(w);
                      }
                    }}
                    onStartDrag={handleStartDragFloating}
                    lang={language}
                  />
                ))}
              </div>

              {/* Center: The Precision Circular Wheel Dial (order-1 on mobile, order-2 on lg) */}
              <div className="relative flex items-center justify-center shrink-0 w-full max-w-[min(96vw,400px)] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[620px] aspect-square order-1 lg:order-2 my-0.5 sm:my-2 lg:my-0">
                <CircularWheel
                  placedWords={placedWords}
                  selectedWord={selectedWord}
                  onSlotClick={handleSlotClick}
                  onRemoveWord={handleRemoveWord}
                  onMovePlacedWord={handleMovePlacedWord}
                  onInspectWord={setInspectedWord}
                  onQuadrantClick={(catId) => setInspectedCategory(catId)}
                  onDropWordOnSector={handleDropWordOnSector}
                  onStartDragPlaced={handleStartDragPlaced}
                  activeHoverQuadrant={hoveredQuadrant}
                  activeHoverSlot={hoveredSlotIndex}
                  wheelRotation={wheelRotation}
                  onRotateWheel={handleRotateWheel}
                  lang={language}
                  isEvaluated={isEvaluated}
                  isAllCorrect={isAllCorrect}
                  onTogglePause={() => setAppState((prev) => (prev === 'PAUSED' ? 'PLAYING' : 'PAUSED'))}
                  isPaused={appState === 'PAUSED'}
                />
              </div>

              {/* Right Flank: Floating Unplaced Answer Cards (order-3) */}
              <div className="w-full lg:w-[300px] xl:w-[420px] 2xl:w-[460px] lg:shrink-0 flex flex-wrap justify-center items-center content-center gap-1.5 sm:gap-2.5 py-1 sm:py-2 z-10 max-w-full order-3">
                {rightFlankWords.map((word, idx) => (
                  <FloatingWordCard
                    key={word.id}
                    word={word}
                    index={idx + 10}
                    isSelected={selectedWord?.id === word.id}
                    isPlaced={false}
                    onSelect={(w) => {
                      if (Date.now() - lastDragEndTimestampRef.current < 250) return;
                      if (selectedWord?.id === w.id) {
                        setSelectedWord(null);
                      } else {
                        setSelectedWord(w);
                      }
                    }}
                    onStartDrag={handleStartDragFloating}
                    lang={language}
                  />
                ))}
              </div>
            </div>
          </main>
        </motion.div>
      )}

      {/* GLOBAL DIRECT-POINTER DRAG PREVIEW AVATAR (rounded-[13px] - 20% less round) */}
      {dragPreview && (
        <div
          dir={language === 'fa' ? 'rtl' : 'ltr'}
          style={{
            position: 'fixed',
            left: dragPreview.x,
            top: dragPreview.y - 28,
            transform: 'translate(-50%, -50%) scale(1.05)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
          className="rounded-[13px] bg-[#0e1b20]/95 border border-emerald-400 shadow-[0_6px_24px_rgba(0,0,0,0.7)] px-4 py-2.5 text-white select-none whitespace-nowrap min-w-[150px] backdrop-blur-md text-start"
        >
          <div className="flex items-center gap-2">
            <span
              className={
                language === 'fa'
                  ? 'font-sans-persian text-sm font-bold leading-none'
                  : 'font-tech text-xs font-semibold uppercase tracking-wider'
              }
            >
              {language === 'fa' ? dragPreview.word.fa : dragPreview.word.en}
            </span>
          </div>
          <div className="mt-1 text-[9.5px] font-tech font-bold uppercase tracking-wider text-emerald-400">
            {isOverWheel
              ? language === 'fa'
                ? 'رهاسازی جهت جایگذاری در گردونه'
                : 'RELEASE TO PLACE IN WHEEL'
              : dragPreview.fromCategory !== undefined
              ? language === 'fa'
                ? 'رهاسازی جهت خروج از گردونه'
                : 'RELEASE TO REMOVE FROM WHEEL'
              : language === 'fa'
              ? 'بکشید روی گردونه'
              : 'DRAG ONTO WHEEL'}
          </div>
        </div>
      )}

      {/* Modals */}
      {/* 1. Evaluation & Score Modal - strictly single language */}
      {showResultsModal && (
        <VictoryModal
          placedWords={placedWords}
          score={finalScore}
          correctCount={finalCorrectCount}
          elapsedSeconds={stats.elapsedSeconds}
          onPlayAgain={() => startGame(gameMode)}
          onReviewDial={() => setShowResultsModal(false)}
          lang={language}
        />
      )}

      {/* 2. Pause Modal: ONLY Pause and Resume */}
      {appState === 'PAUSED' && (
        <PauseModal
          onResume={() => setAppState('PLAYING')}
          lang={language}
        />
      )}

      {/* 3. Answer Term Explanation Modal (does not give away segment name or color, single language) */}
      {inspectedWord && (
        <TermDetailModal
          word={inspectedWord}
          onClose={() => setInspectedWord(null)}
          lang={language}
        />
      )}

      {/* 4. Segment Name Explanation Modal (when clicking quadrant rim on wheel) */}
      {inspectedCategory && (
        <SegmentDetailModal
          categoryId={inspectedCategory}
          onClose={() => setInspectedCategory(null)}
          lang={language}
        />
      )}
    </div>
  );
}
