import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gem, GameMode } from '../types/game';
import {
  GRID_SIZE,
  createInitialBoard,
  createGemId,
  getRandomGemType,
  checkMatches,
  isAdjacent,
  hasValidMoves,
  getHint,
  shuffleBoard,
} from '../utils/gameLogic';
import { KardoneGem, GEM_PALETTES } from './KardoneGem';
import { GAME_LOGO_SRC } from './KardoneLogo';
import { VFXCanvas, VFXHandle } from './VFXCanvas';
import { sound } from '../utils/audio';
import { vibrationSystem } from '../utils/vibration';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface GameBoardProps {
  lang: Language;
  mode: GameMode;
  boardSize: number;
  onScoreUpdate: (addScore: number, combo: number) => void;
  onMoveUsed: () => void;
}

interface PointerStartState {
  r: number;
  c: number;
  startX: number;
  startY: number;
  swapped: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  lang,
  boardSize,
  onScoreUpdate,
  onMoveUsed,
}) => {
  const t = TRANSLATIONS[lang];
  const [board, setBoard] = useState<(Gem | null)[][]>(() => createInitialBoard());
  const boardRef = useRef<(Gem | null)[][]>(board);
  boardRef.current = board;

  const [selectedGem, setSelectedGem] = useState<{ r: number; c: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  isProcessingRef.current = isProcessing;

  const [hintPair, setHintPair] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);
  const [shuffleNotice, setShuffleNotice] = useState<boolean>(false);

  // Zero-lag pointer flick state stored in a ref (never causes 60fps re-renders on pointermove!)
  const pointerRef = useRef<PointerStartState | null>(null);

  // Swapping animation state (only 2 tiles animate for 32ms)
  const [animatingSwap, setAnimatingSwap] = useState<{
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    isBouncingBack?: boolean;
  } | null>(null);

  // Direct DOM Shake Ref (zero React re-renders during screen vibration)
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const boardFrameRef = useRef<HTMLDivElement | null>(null);
  const vfxRef = useRef<VFXHandle | null>(null);

  const tileSize = Math.floor((boardSize - 24) / GRID_SIZE);

  // Direct DOM screen vibration transform — zero React state re-renders!
  useEffect(() => {
    const unsubscribe = vibrationSystem.subscribe((x, y, rot) => {
      if (boardFrameRef.current) {
        if (x === 0 && y === 0 && rot === 0) {
          boardFrameRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
        } else {
          boardFrameRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        }
      }
    });
    return unsubscribe;
  }, []);

  // Fast Idle Hint System (3.0s idle in rushed mode)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setHintPair((prev) => (prev ? null : prev));

    idleTimerRef.current = setTimeout(() => {
      if (!isProcessingRef.current) {
        const hint = getHint(boardRef.current);
        if (hint) {
          setHintPair(hint);
        }
      }
    }, 3000);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [board, resetIdleTimer]);

  /**
   * Refill board gravity helper — marks moved and newly spawned gems with isNew=true
   * so they play the 95ms rushed drop-in keyframe animation.
   */
  const applyGravityAndRefill = (currentBoard: (Gem | null)[][]): (Gem | null)[][] => {
    const fallenBoard: (Gem | null)[][] = currentBoard.map((row) =>
      row.map((g) => (g ? { ...g, isNew: false } : null))
    );

    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (fallenBoard[r][c] !== null) {
          if (r !== emptyRow) {
            const movingGem = fallenBoard[r][c]!;
            fallenBoard[emptyRow][c] = {
              ...movingGem,
              row: emptyRow,
              col: c,
              isNew: true,
            };
            fallenBoard[r][c] = null;
          }
          emptyRow--;
        }
      }

      for (let r = emptyRow; r >= 0; r--) {
        fallenBoard[r][c] = {
          id: createGemId(),
          type: getRandomGemType(),
          special: 'none',
          row: r,
          col: c,
          isNew: true,
        };
      }
    }

    return fallenBoard;
  };

  /**
   * Hyper-fast, zero-lag rushed Match-3 cascade loop
   */
  const processMatchesAndCascades = useCallback(
    async (currentBoard: (Gem | null)[][], originR?: number, originC?: number, currentCombo: number = 1) => {
      const matchResult = checkMatches(currentBoard, originR, originC);

      if (matchResult.matchedGems.length === 0) {
        isProcessingRef.current = false;
        setIsProcessing(false);

        if (!hasValidMoves(currentBoard)) {
          setShuffleNotice(true);
          sound.playShuffle();
          setTimeout(() => {
            setBoard((b) => shuffleBoard(b));
            setShuffleNotice(false);
          }, 420);
        }
        return;
      }

      // 1. Trigger Screen Vibration & Sound on every match
      vibrationSystem.triggerMatchVibration(matchResult.maxComboMatch, currentCombo);
      sound.playMatch(currentCombo, matchResult.maxComboMatch);

      // 2. Score Gained with combo multiplier
      const comboMultiplier = Math.max(1, currentCombo);
      const earned = matchResult.score * comboMultiplier;
      onScoreUpdate(earned, comboMultiplier);

      // 3. Trigger VFX for groups & special creations
      matchResult.groups.forEach((grp) => {
        const x = (grp.centerCol + 0.5) * tileSize + 12;
        const y = (grp.centerRow + 0.5) * tileSize + 12;
        const color = GEM_PALETTES[grp.type]?.primary || '#00FF66';

        if (grp.count >= 6 || grp.specialCreated === 'supernova_6') {
          vfxRef.current?.spawnExplosion(x, y, true, '#00FF66');
          vfxRef.current?.spawnScore(x, y, `SUPERNOVA +${earned}!`, '#00FF66', true);
        } else if (grp.count === 5 || grp.specialCreated === 'mega_5') {
          vfxRef.current?.spawnDoubleExplosion(x, y, color);
          vfxRef.current?.spawnScore(x, y, `MEGA GEM +${earned}!`, '#A3E635', true);
        } else if (
          grp.count === 4 ||
          grp.specialCreated === 'blaster_h' ||
          grp.specialCreated === 'blaster_v'
        ) {
          vfxRef.current?.spawnExplosion(x, y, false, '#00FF66');
          vfxRef.current?.spawnScore(x, y, `RECT PRIZE +${earned}`, '#34D399', true);
        } else {
          vfxRef.current?.spawnMatch(x, y, color);
          vfxRef.current?.spawnScore(x, y, `+${earned}`, '#ECFDF5', false);
        }
      });

      // Trigger laser beams for any activated 4-Gem Rectangular Line-Blasters
      matchResult.triggeredBlasters.forEach((b) => {
        const bx = (b.col + 0.5) * tileSize + 12;
        const by = (b.row + 0.5) * tileSize + 12;
        vfxRef.current?.spawnLineBlast(bx, by, b.isHorizontal, boardSize, boardSize);
      });

      // Trigger 5x5 shockwaves for any activated 5-Gem Mega Gems
      matchResult.triggeredMegas.forEach((m) => {
        const mx = (m.col + 0.5) * tileSize + 12;
        const my = (m.row + 0.5) * tileSize + 12;
        vfxRef.current?.spawnDoubleExplosion(mx, my, '#00FF66');
      });

      // Spawn individual particle pops for cleared gems
      matchResult.matchedGems.forEach((g) => {
        const gx = (g.col + 0.5) * tileSize + 12;
        const gy = (g.row + 0.5) * tileSize + 12;
        const pColor = GEM_PALETTES[g.type]?.vfxColor || '#00FF66';
        vfxRef.current?.spawnMatch(gx, gy, pColor);
      });

      // 4. Clear matched gems, forge specials, and immediately apply gravity in one rushed beat!
      const nextBoard: (Gem | null)[][] = currentBoard.map((row) => [...row]);

      matchResult.matchedGems.forEach((g) => {
        nextBoard[g.row][g.col] = null;
      });

      matchResult.groups.forEach((grp) => {
        if (grp.specialCreated && grp.specialCreated !== 'none') {
          nextBoard[grp.centerRow][grp.centerCol] = {
            id: createGemId(),
            type: grp.type,
            special: grp.specialCreated,
            row: grp.centerRow,
            col: grp.centerCol,
            isNew: true,
          };
        }
      });

      const fallenBoard = applyGravityAndRefill(nextBoard);
      boardRef.current = fallenBoard;
      setBoard(fallenBoard);

      // Keep input locked until the whole cascade settles: a swap made mid-cascade was checked against a
      // board that still had pending matches, so gems the player did not match could pop.
      await new Promise((resolve) => setTimeout(resolve, 55));
      processMatchesAndCascades(boardRef.current, undefined, undefined, currentCombo + 1);
    },
    [tileSize, boardSize, onScoreUpdate]
  );

  /**
   * Attempts a swap between two adjacent tiles with ultra-fast rushed response (30ms)
   */
  const attemptSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessingRef.current) return;
    const currentBoard = boardRef.current;

    const g1 = currentBoard[r1]?.[c1];
    const g2 = currentBoard[r2]?.[c2];
    if (!g1 || !g2) return;

    isProcessingRef.current = true;
    setIsProcessing(true);
    setSelectedGem(null);

    // =========================================================================
    // SPECIAL CASE 1: 6-GEM SUPERNOVA SWAP (Clears all gems of target color!)
    // =========================================================================
    if (g1.special === 'supernova_6' || g2.special === 'supernova_6') {
      sound.playExplosion(true);
      vibrationSystem.triggerMatchVibration(6, 2);
      onMoveUsed();

      const novaGem = g1.special === 'supernova_6' ? g1 : g2;
      const otherGem = g1.special === 'supernova_6' ? g2 : g1;
      const newBoard = currentBoard.map((row) => [...row]);

      if (otherGem.special === 'supernova_6') {
        const centerX = boardSize / 2;
        const centerY = boardSize / 2;
        vfxRef.current?.spawnExplosion(centerX, centerY, true, '#00FF66');
        vfxRef.current?.spawnScore(centerX, centerY, 'OMEGA NOVA +6,000!', '#00FF66', true);
        onScoreUpdate(6000, 2);

        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            newBoard[r][c] = null;
          }
        }
      } else {
        const targetColor = otherGem.type;
        const nx = (novaGem.col + 0.5) * tileSize + 12;
        const ny = (novaGem.row + 0.5) * tileSize + 12;
        vfxRef.current?.spawnExplosion(nx, ny, true, '#00FF66');

        let count = 0;
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newBoard[r][c]?.type === targetColor || (r === novaGem.row && c === novaGem.col)) {
              const gx = (c + 0.5) * tileSize + 12;
              const gy = (r + 0.5) * tileSize + 12;
              vfxRef.current?.spawnMatch(gx, gy, GEM_PALETTES[targetColor].primary);
              newBoard[r][c] = null;
              count++;
            }
          }
        }
        const pts = count * 180;
        vfxRef.current?.spawnScore(nx, ny, `SUPERNOVA +${pts}!`, '#00FF66', true);
        onScoreUpdate(pts, 1);
      }

      const fallen = applyGravityAndRefill(newBoard);
      boardRef.current = fallen;
      setBoard(fallen);

      await new Promise((resolve) => setTimeout(resolve, 50));
      processMatchesAndCascades(boardRef.current, undefined, undefined, 2);
      return;
    }

    // =========================================================================
    // SPECIAL CASE 2: 5-GEM MEGA GEM SWAP (Detonates a huge 5x5 area!)
    // =========================================================================
    if (g1.special === 'mega_5' || g2.special === 'mega_5') {
      sound.playExplosion(true);
      vibrationSystem.triggerMatchVibration(5, 1);
      onMoveUsed();

      const megaGem = g1.special === 'mega_5' ? g1 : g2;
      const targetGem = g1.special === 'mega_5' ? g2 : g1;
      const centerR = targetGem.row;
      const centerC = targetGem.col;

      const mx = (centerC + 0.5) * tileSize + 12;
      const my = (centerR + 0.5) * tileSize + 12;
      vfxRef.current?.spawnDoubleExplosion(mx, my, '#A3E635');

      const newBoard = currentBoard.map((row) => [...row]);
      newBoard[megaGem.row][megaGem.col] = null;

      let count = 0;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = centerR + dr;
          const nc = centerC + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newBoard[nr][nc]) {
            const gx = (nc + 0.5) * tileSize + 12;
            const gy = (nr + 0.5) * tileSize + 12;
            vfxRef.current?.spawnMatch(gx, gy, '#00FF66');
            newBoard[nr][nc] = null;
            count++;
          }
        }
      }

      const pts = count * 120 + 350;
      vfxRef.current?.spawnScore(mx, my, `MEGA 5x5 +${pts}!`, '#A3E635', true);
      onScoreUpdate(pts, 1);

      const fallen = applyGravityAndRefill(newBoard);
      boardRef.current = fallen;
      setBoard(fallen);

      await new Promise((resolve) => setTimeout(resolve, 50));
      processMatchesAndCascades(boardRef.current, undefined, undefined, 2);
      return;
    }

    // Standard Swap: Ultra-fast rushed 30ms slide!
    setAnimatingSwap({ r1, c1, r2, c2 });
    sound.playSwap();

    const swappedBoard = currentBoard.map((row) => [...row]);
    swappedBoard[r1][c1] = { ...g2, row: r1, col: c1, isNew: false };
    swappedBoard[r2][c2] = { ...g1, row: r2, col: c2, isNew: false };

    const matchResult = checkMatches(swappedBoard, r2, c2);

    await new Promise((resolve) => setTimeout(resolve, 30));

    if (matchResult.matchedGems.length > 0) {
      boardRef.current = swappedBoard;
      setBoard(swappedBoard);
      setAnimatingSwap(null);
      onMoveUsed();
      processMatchesAndCascades(swappedBoard, r2, c2, 1);
    } else {
      // Snappy invalid bounce-back (45ms)
      sound.playInvalid();
      vibrationSystem.triggerMatchVibration(3, 1);
      setAnimatingSwap({ r1, c1, r2, c2, isBouncingBack: true });

      await new Promise((resolve) => setTimeout(resolve, 45));
      setAnimatingSwap(null);
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  // =========================================================================
  // ZERO-LAG INSTANT FLICK & CLICK HANDLERS
  // =========================================================================
  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    if (isProcessingRef.current) return;
    resetIdleTimer();

    // If a gem is already selected and the user taps an adjacent gem, swap immediately on pointerdown!
    if (selectedGem && isAdjacent(selectedGem.r, selectedGem.c, r, c)) {
      pointerRef.current = null;
      attemptSwap(selectedGem.r, selectedGem.c, r, c);
      return;
    }

    pointerRef.current = {
      r,
      c,
      startX: e.clientX,
      startY: e.clientY,
      swapped: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = pointerRef.current;
    if (!p || p.swapped || isProcessingRef.current) return;

    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Hair-trigger 11px flick threshold: triggers the swap immediately while your finger/mouse is still moving!
    const threshold = Math.max(10, tileSize * 0.17);
    if (Math.max(absDx, absDy) >= threshold) {
      let targetR = p.r;
      let targetC = p.c;

      if (absDx >= absDy) {
        targetC += dx > 0 ? 1 : -1;
      } else {
        targetR += dy > 0 ? 1 : -1;
      }

      if (targetR >= 0 && targetR < GRID_SIZE && targetC >= 0 && targetC < GRID_SIZE) {
        p.swapped = true;
        pointerRef.current = null;
        attemptSwap(p.r, p.c, targetR, targetC);
      }
    }
  };

  const handlePointerUp = (r: number, c: number) => {
    const p = pointerRef.current;
    pointerRef.current = null;
    if (!p || p.swapped || isProcessingRef.current) return;

    // Clean click / tap selection
    if (!selectedGem) {
      setSelectedGem({ r: p.r, c: p.c });
      sound.playSwap();
    } else if (selectedGem.r === p.r && selectedGem.c === p.c) {
      setSelectedGem(null);
    } else if (isAdjacent(selectedGem.r, selectedGem.c, p.r, p.c)) {
      attemptSwap(selectedGem.r, selectedGem.c, p.r, p.c);
    } else {
      setSelectedGem({ r: p.r, c: p.c });
      sound.playSwap();
    }
    void r;
    void c;
  };

  return (
    <div
      ref={boardContainerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        if (pointerRef.current) {
          handlePointerUp(pointerRef.current.r, pointerRef.current.c);
        }
      }}
      className="relative flex flex-col items-center justify-center w-full my-auto select-none touch-none"
    >
      {/* Cyberpunk Black & Neon Green Matrix Board Frame */}
      <div
        ref={boardFrameRef}
        className="relative rounded-2xl p-3 bg-gradient-to-b from-[#071c13]/95 via-[#04100b]/98 to-[#020805] border-2 border-[#00ff66]/45 shadow-[0_0_40px_rgba(0,255,102,0.18),inset_0_0_24px_rgba(0,255,102,0.12)] ring-1 ring-emerald-500/30 will-change-transform"
        style={{
          width: boardSize,
          height: boardSize,
        }}
      >
        {/* Official Game Logo Subtle Center Board Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden rounded-2xl">
          <img
            src={GAME_LOGO_SRC}
            alt=""
            className="w-48 h-48 object-contain opacity-[0.06] mix-blend-lighten select-none pointer-events-none"
          />
        </div>

        {/* Cyberpunk Corner Tech Accents */}
        <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-[#00ff66] rounded-tl-md pointer-events-none" />
        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-[#00ff66] rounded-tr-md pointer-events-none" />
        <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-[#00ff66] rounded-bl-md pointer-events-none" />
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-[#00ff66] rounded-br-md pointer-events-none" />

        {/* Recessed Dark Obsidian Grid Wells */}
        <div
          className="absolute inset-3 grid grid-cols-8 grid-rows-8 gap-1.5 pointer-events-none"
          style={{ width: boardSize - 24, height: boardSize - 24 }}
        >
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-[#030b07]/85 border border-emerald-500/15"
            />
          ))}
        </div>

        {/* Gems Grid with Hair-Trigger Instant Flick-Swap */}
        <div
          className="relative grid grid-cols-8 grid-rows-8 gap-1.5 z-10"
          style={{ width: boardSize - 24, height: boardSize - 24 }}
        >
          {board.map((row, r) =>
            row.map((gem, c) => {
              if (!gem) {
                return (
                  <div
                    key={`empty-${r}-${c}`}
                    style={{ width: tileSize, height: tileSize }}
                  />
                );
              }

              const isSelected = selectedGem?.r === r && selectedGem?.c === c;
              const isHinted =
                (hintPair?.r1 === r && hintPair?.c1 === c) ||
                (hintPair?.r2 === r && hintPair?.c2 === c);

              let transformStr = 'translate3d(0, 0, 0)';
              let zIndexVal = 10;

              if (animatingSwap) {
                const isFirst = animatingSwap.r1 === r && animatingSwap.c1 === c;
                const isSecond = animatingSwap.r2 === r && animatingSwap.c2 === c;

                if (isFirst || isSecond) {
                  const targetR = isFirst ? animatingSwap.r2 : animatingSwap.r1;
                  const targetC = isFirst ? animatingSwap.c2 : animatingSwap.c1;
                  const deltaX = (targetC - c) * (tileSize + 6);
                  const deltaY = (targetR - r) * (tileSize + 6);

                  if (!animatingSwap.isBouncingBack) {
                    transformStr = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.06)`;
                  }
                  zIndexVal = 30;
                }
              }

              return (
                <div
                  key={gem.id}
                  onPointerDown={(e) => handlePointerDown(r, c, e)}
                  className="cursor-pointer flex items-center justify-center touch-none select-none transition-transform duration-30 ease-out will-change-transform"
                  style={{
                    width: tileSize,
                    height: tileSize,
                    transform: transformStr,
                    zIndex: zIndexVal,
                  }}
                >
                  <KardoneGem
                    type={gem.type}
                    special={gem.special}
                    isSelected={isSelected}
                    isHinted={isHinted}
                    isNew={gem.isNew}
                    size={tileSize}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Canvas VFX Layer */}
        <VFXCanvas
          ref={vfxRef}
          width={boardSize}
          height={boardSize}
        />

        {/* Auto-Shuffle Cyberpunk Banner with Game Logo */}
        {shuffleNotice && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#020805]/85 rounded-2xl backdrop-blur-xs animate-in fade-in duration-100 pointer-events-none">
            <div className="px-6 py-4 rounded-2xl bg-gradient-to-b from-[#0a261a] to-[#04120c] border-2 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.4)] text-center flex flex-col items-center gap-2">
              <img
                src={GAME_LOGO_SRC}
                alt="Candy Logo"
                className="w-12 h-12 rounded-xl border border-[#00ff66]/60 object-contain bg-black"
              />
              <div className="text-xl text-[#00ff66] font-black tracking-wider uppercase">
                {t.noMovesTitle}
              </div>
              <div className="text-xs text-emerald-300 font-bold uppercase tracking-widest">
                {t.noMovesSub}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
