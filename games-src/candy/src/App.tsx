import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameScreen, GameMode } from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { GameBoard } from './components/GameBoard';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { SodaPopBackground } from './components/SodaPopBackground';
import { CountdownOverlay } from './components/CountdownOverlay';
import { Language, getSavedLanguage, saveLanguage } from './utils/i18n';

const INITIAL_MOVES = 30;
const INITIAL_TIME = 60;

export default function App() {
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [gameMode, setGameMode] = useState<GameMode>('RUSH');
  const [gameSessionId, setGameSessionId] = useState<number>(1);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);

  // Single-level static 30 moves + 60 seconds stats
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(INITIAL_MOVES);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);

  // Shared responsive boardSize so GameHUD is never bigger than GameBoard
  const [boardSize, setBoardSize] = useState<number>(480);

  useEffect(() => {
    const updateSize = () => {
      const availableWidth = window.innerWidth - 20;
      const availableHeight = window.innerHeight - 125;
      const target = Math.min(availableWidth, availableHeight, 520);
      setBoardSize(Math.max(300, Math.floor(target)));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Language = prev === 'en' ? 'fa' : 'en';
      saveLanguage(next);
      return next;
    });
  }, []);

  // Start new single-stage Rush game with 3-2-1-شروع! countdown
  const handleStartGame = useCallback((mode: GameMode = 'RUSH') => {
    setGameMode(mode);
    setScore(0);
    setMovesLeft(INITIAL_MOVES);
    setTimeLeft(INITIAL_TIME);
    setCombo(1);
    setMaxCombo(1);
    setGameSessionId((prev) => prev + 1);
    setIsCountingDown(true);
    setScreen('PLAYING');
  }, []);

  // Simultaneous 60-second static countdown timer (begins right after 3-2-1-شروع! finishes)
  useEffect(() => {
    if (screen === 'PLAYING' && !isCountingDown) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setScreen('GAME_OVER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, isCountingDown]);

  // Score update from board matches
  const handleScoreUpdate = useCallback((gained: number, currentCombo: number) => {
    setScore((prev) => prev + gained);
    setCombo(currentCombo);
    setMaxCombo((prev) => Math.max(prev, currentCombo));
  }, []);

  // Move used (strictly decrements from static 30 moves; ends game when 0 moves left)
  const handleMoveUsed = useCallback(() => {
    setMovesLeft((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => {
          setScreen('GAME_OVER');
        }, 280);
        return 0;
      }
      return next;
    });
  }, []);

  // Report the final score to the host site once the run ends, then signal the game is over.
  useEffect(() => {
    if (screen !== 'GAME_OVER') return;
    window.parent?.postMessage({ type: 'game-result', score }, '*');
    const t = setTimeout(() => window.parent?.postMessage({ type: 'game-done' }, '*'), 3000);
    return () => clearTimeout(t);
  }, [screen]);

  // Keyboard controls: Escape pauses/resumes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCountingDown) {
        if (screen === 'PLAYING') {
          setScreen('PAUSED');
        } else if (screen === 'PAUSED') {
          setScreen('PLAYING');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isCountingDown]);

  const isFa = lang === 'fa';

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-[#020805] text-emerald-50 flex flex-col items-center justify-center font-sans ${
        isFa ? 'font-persian' : ''
      }`}
    >
      {/* Cyberpunk Black & Neon Green Matrix Background */}
      <SodaPopBackground />

      {/* Title Screen View */}
      {screen === 'TITLE' && (
        <TitleScreen
          lang={lang}
          onToggleLang={handleToggleLang}
          onStartGame={handleStartGame}
        />
      )}

      {/* Active Game Playfield */}
      {(screen === 'PLAYING' || screen === 'PAUSED' || screen === 'GAME_OVER') && (
        <div className="relative w-full h-full flex flex-col justify-center items-center gap-2.5 py-2 px-2 z-10">
          {/* Compact Top Cyberpunk Scoreboard (matched to exact boardSize width) */}
          <GameHUD
            lang={lang}
            onToggleLang={handleToggleLang}
            boardSize={boardSize}
            score={score}
            movesLeft={movesLeft}
            timeLeft={timeLeft}
            combo={combo}
            onPause={() => setScreen('PAUSED')}
            onRestart={() => handleStartGame('RUSH')}
          />

          {/* Hyper-Fast Rushed Match-3 Game Board */}
          <div className="flex items-center justify-center">
            <GameBoard
              key={gameSessionId}
              lang={lang}
              mode={gameMode}
              boardSize={boardSize}
              onScoreUpdate={handleScoreUpdate}
              onMoveUsed={handleMoveUsed}
            />
          </div>
        </div>
      )}

      {/* 3 - 2 - 1 - شروع! Start Countdown Overlay */}
      <CountdownOverlay
        isActive={screen === 'PLAYING' && isCountingDown}
        lang={lang}
        onComplete={() => setIsCountingDown(false)}
      />

      {/* Pause Modal */}
      <PauseModal
        lang={lang}
        onToggleLang={handleToggleLang}
        isOpen={screen === 'PAUSED'}
        onResume={() => setScreen('PLAYING')}
        onRestart={() => handleStartGame('RUSH')}
        onQuit={() => {
          setIsCountingDown(false);
          setScreen('TITLE');
        }}
      />

      {/* Game Over Modal ("عالی بازی کردی!") */}
      <GameOverModal
        lang={lang}
        isOpen={screen === 'GAME_OVER'}
        score={score}
        maxCombo={maxCombo}
        movesLeft={movesLeft}
        timeLeft={timeLeft}
        onPlayAgain={() => handleStartGame('RUSH')}
        onMainMenu={() => {
          setIsCountingDown(false);
          setScreen('TITLE');
        }}
      />
    </div>
  );
}
