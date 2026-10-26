import { useEffect, useRef, useState, useCallback } from 'react';
import { ArkanoidEngine } from './game/engine';
import { GameMetrics, GameState, GameSettings } from './game/types';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { StatusModals } from './components/StatusModals';
import { GuideModal } from './components/GuideModal';
import { SettingsModal } from './components/SettingsModal';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { soundManager } from './game/audio';
import { loadSavedSettings, saveSettings } from './game/settings';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ArkanoidEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('title');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(loadSavedSettings);

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<GameMetrics>({
    score: 0,
    highScore: 0,
    lives: 3,
    level: 1,
    bricksDestroyed: 0,
    combo: 0,
    highestCombo: 0,
    ballsInPlay: 1,
    activePowerUp: null,
    powerUpTimeLeft: 0,
  });

  // Initialize engine once
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new ArkanoidEngine(canvasRef.current);
    engine.updateSettings(settings);
    engineRef.current = engine;

    setIsMuted(soundManager.getMuted());

    // Connect callbacks
    engine.onStateChange = (newState) => {
      setGameState(newState);
      if (newState === 'gameover' || newState === 'victory') {
        window.parent?.postMessage({ type: 'game-result', percent: engine.progress() }, '*');
      }
    };

    engine.onMetricsUpdate = (newMetrics) => {
      setMetrics({ ...newMetrics });
    };

    // Auto-start check from query string
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      engine.startRun(0);
    } else {
      document.body.dataset.state = 'title';
    }

    // Keyboard global start listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Enter' || e.code === 'Space') && engineRef.current?.state === 'title') {
        engineRef.current.startRun(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
    };
  }, []);

  const handleStart = useCallback(() => {
    engineRef.current?.startRun(0);
  }, []);

  const handlePause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const handleRestart = useCallback(() => {
    engineRef.current?.retry();
  }, []);

  const handleNextLevel = useCallback(() => {
    engineRef.current?.nextLevel();
  }, []);

  const handleToTitle = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.state = 'title';
      document.body.dataset.state = 'title';
      setGameState('title');
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleToggleLang = useCallback(() => {
    setLang(prev => (prev === 'fa' ? 'en' : 'fa'));
  }, []);

  const handleToggleScanlines = useCallback(() => {
    setSettings(prev => {
      const next = { ...prev, scanlines: !prev.scanlines };
      saveSettings(next);
      engineRef.current?.updateSettings(next);
      return next;
    });
  }, []);

  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    engineRef.current?.updateSettings(newSettings);
  }, []);

  const handleOpenGuide = useCallback(() => {
    if (engineRef.current?.state === 'playing') {
      engineRef.current.pause();
    }
    setIsGuideOpen(true);
  }, []);

  const handleOpenSettings = useCallback(() => {
    if (engineRef.current?.state === 'playing') {
      engineRef.current.pause();
    }
    setIsSettingsOpen(true);
  }, []);

  const handleOpenDiagnostics = useCallback(() => {
    if (engineRef.current?.state === 'playing') {
      engineRef.current.pause();
    }
    setIsDiagnosticsOpen(true);
  }, []);

  const handleAutoRecover = useCallback(() => {
    engineRef.current?.autoRecoverEntities();
  }, []);

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden bg-slate-950 ${lang === 'fa' ? 'font-vazir' : 'font-sans'}`}
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Isolated Canvas Mount */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          data-testid="game-canvas"
          className="w-full h-full block cursor-crosshair touch-none"
        />
      </div>

      {/* CRT Scanline Overlay Effect */}
      {settings.scanlines && (
        <div className="absolute inset-0 pointer-events-none z-10 scanlines opacity-60" />
      )}

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={handleStart}
          highScore={metrics.highScore}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          lang={lang}
          onToggleLang={handleToggleLang}
          scanlines={settings.scanlines}
          onToggleScanlines={handleToggleScanlines}
          onOpenGuide={handleOpenGuide}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {/* Gameplay In-Game HUD */}
      {gameState === 'playing' && (
        <GameHUD
          metrics={metrics}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onPause={handlePause}
          lang={lang}
          scanlines={settings.scanlines}
          onToggleScanlines={handleToggleScanlines}
          onOpenGuide={handleOpenGuide}
          onOpenSettings={handleOpenSettings}
          onOpenDiagnostics={handleOpenDiagnostics}
        />
      )}

      {/* Status Modals: Paused, Victory, Game Over */}
      <StatusModals
        state={gameState}
        metrics={metrics}
        onResume={handleResume}
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
        onToTitle={handleToTitle}
        lang={lang}
        onOpenGuide={handleOpenGuide}
        onOpenSettings={handleOpenSettings}
      />

      {/* Comprehensive Game Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />

      {/* Visual Settings & Background Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        lang={lang}
      />

      {/* Realtime System Diagnostics & Anti-Freeze Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        metrics={metrics}
        onAutoRecover={handleAutoRecover}
        lang={lang}
      />
    </div>
  );
}
