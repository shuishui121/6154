import { useEffect, useCallback } from 'react';
import Game from '@/components/Game';
import MainMenu from '@/components/MainMenu';
import HUD from '@/components/HUD';
import ResultPanel from '@/components/ResultPanel';
import AchievementPanel from '@/components/AchievementPanel';
import PauseMenu from '@/components/PauseMenu';
import TouchControls from '@/components/TouchControls';
import { useGameStore } from '@/store/useGameStore';
import { GAME_CONFIG } from '@/game/utils/constants';

export default function App() {
  const { status, difficulty } = useGameStore();

  const handleAccelerate = useCallback(() => {
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      code: 'ArrowRight',
      bubbles: true,
    });
    document.dispatchEvent(event);
  }, []);

  const handleJump = useCallback(() => {
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      bubbles: true,
    });
    document.dispatchEvent(event);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const currentStatus = useGameStore.getState().status;
        if (currentStatus === 'playing') {
          useGameStore.getState().setStatus('paused');
        } else if (currentStatus === 'paused') {
          useGameStore.getState().setStatus('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showGame = status === 'playing' || status === 'paused' || status === 'gameover';
  const isPlaying = status === 'playing' || status === 'paused' || status === 'gameover';

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      <div
        className="relative bg-sky-300 shadow-2xl overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: GAME_CONFIG.WIDTH,
          maxHeight: GAME_CONFIG.HEIGHT,
          aspectRatio: `${GAME_CONFIG.WIDTH} / ${GAME_CONFIG.HEIGHT}`,
        }}
      >
        {showGame && (
          <Game
            key={difficulty}
            difficulty={difficulty}
            isPlaying={isPlaying}
            status={status}
          />
        )}

        {status === 'menu' && <MainMenu />}

        {status === 'playing' && <HUD />}

        {status === 'paused' && (
          <>
            <HUD />
            <PauseMenu />
          </>
        )}

        {status === 'gameover' && <ResultPanel />}

        {status === 'achievements' && <AchievementPanel />}

        {(status === 'playing' || status === 'paused') && (
          <TouchControls onAccelerate={handleAccelerate} onJump={handleJump} />
        )}
      </div>
    </div>
  );
}
