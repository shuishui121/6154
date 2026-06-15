import { useEffect, useCallback } from 'react';

interface TouchControlsProps {
  onAccelerate: () => void;
  onJump: () => void;
}

export default function TouchControls({
  onAccelerate,
  onJump,
}: TouchControlsProps) {
  const handleAccelerate = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      onAccelerate();
    },
    [onAccelerate]
  );

  const handleJump = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      onJump();
    },
    [onJump]
  );

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (!isMobile) {
      const gameContainer = document.getElementById('game-container');
      if (gameContainer) {
        gameContainer.style.display = 'none';
      }
    }
  }, []);

  return (
    <div
      id="game-container"
      className="absolute bottom-0 left-0 right-0 h-32 md:hidden z-30"
    >
      <div className="flex h-full">
        <button
          onTouchStart={handleAccelerate}
          onMouseDown={handleAccelerate}
          className="flex-1 bg-gradient-to-t from-green-500/80 to-green-400/40 active:from-green-600/90 active:to-green-500/50 flex flex-col items-center justify-center text-white font-bold text-lg border-r border-white/20"
        >
          <span className="text-3xl mb-1">💨</span>
          <span>加速</span>
          <span className="text-xs text-white/70 mt-1">连按加速</span>
        </button>
        <button
          onTouchStart={handleJump}
          onMouseDown={handleJump}
          className="flex-1 bg-gradient-to-t from-orange-500/80 to-orange-400/40 active:from-orange-600/90 active:to-orange-500/50 flex flex-col items-center justify-center text-white font-bold text-lg"
        >
          <span className="text-3xl mb-1">🦘</span>
          <span>跳跃</span>
          <span className="text-xs text-white/70 mt-1">点击起跳</span>
        </button>
      </div>
    </div>
  );
}
