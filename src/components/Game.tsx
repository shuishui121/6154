import { useEffect, useRef, useCallback } from 'react';
import Phaser from 'phaser';
import { GameScene } from '@/game/scenes/GameScene';
import { GAME_CONFIG } from '@/game/utils/constants';
import type { Difficulty } from '@/game/utils/constants';
import { useGameStore } from '@/store/useGameStore';
import {
  checkHeightAchievements,
  checkComboAchievements,
  checkFirstJump,
  checkPerfectTiming,
  checkSpeedDemon,
} from '@/utils/achievements';

interface GameProps {
  difficulty: Difficulty;
  isPlaying: boolean;
}

export default function Game({ difficulty, isPlaying }: GameProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameSceneRef = useRef<GameScene | null>(null);
  const hasFirstJumped = useRef(false);
  const isInitialized = useRef(false);

  const {
    setRunSpeed,
    setIsInJumpZone,
    setPerfectTiming,
    setMaxSpeedReached,
    addNewlyUnlockedAchievement,
    endGame,
    incrementCombo,
    incrementHeight,
    resetCombo,
    setCurrentHeight,
  } = useGameStore();

  const handleSpeedUpdate = useCallback(
    (speed: number, maxSpeed: number) => {
      const percent = (speed / maxSpeed) * 100;
      setRunSpeed(percent);

      if (speed >= maxSpeed * 0.99) {
        const result = checkSpeedDemon();
        result.newlyUnlocked.forEach((id) => {
          addNewlyUnlockedAchievement(id);
        });
        setMaxSpeedReached(true);
      }
    },
    [setRunSpeed, setMaxSpeedReached, addNewlyUnlockedAchievement]
  );

  const handleJumpZoneEnter = useCallback(
    (inZone: boolean) => {
      setIsInJumpZone(inZone);
    },
    [setIsInJumpZone]
  );

  const handleHeightUpdate = useCallback(
    (height: number) => {
      setCurrentHeight(height);
    },
    [setCurrentHeight]
  );

  const handleGameOver = useCallback(
    (finalHeight: number, perfect: boolean, maxSpeed: boolean) => {
      if (perfect) {
        const result = checkPerfectTiming();
        result.newlyUnlocked.forEach((id) => {
          addNewlyUnlockedAchievement(id);
        });
      }

      const heightResult = checkHeightAchievements(finalHeight, difficulty);
      heightResult.newlyUnlocked.forEach((id) => {
        addNewlyUnlockedAchievement(id);
      });

      endGame(finalHeight);
    },
    [endGame, addNewlyUnlockedAchievement, difficulty]
  );

  const handleSuccess = useCallback(
    (height: number, combo: number, perfect: boolean) => {
      if (!hasFirstJumped.current) {
        hasFirstJumped.current = true;
        const result = checkFirstJump();
        result.newlyUnlocked.forEach((id) => {
          addNewlyUnlockedAchievement(id);
        });
      }

      incrementCombo();
      incrementHeight();

      if (perfect) {
        const result = checkPerfectTiming();
        result.newlyUnlocked.forEach((id) => {
          addNewlyUnlockedAchievement(id);
        });
        setPerfectTiming(true);
      }

      const heightResult = checkHeightAchievements(height, difficulty);
      heightResult.newlyUnlocked.forEach((id) => {
        addNewlyUnlockedAchievement(id);
      });

      const comboResult = checkComboAchievements(combo);
      comboResult.newlyUnlocked.forEach((id) => {
        addNewlyUnlockedAchievement(id);
      });
    },
    [
      incrementCombo,
      incrementHeight,
      setPerfectTiming,
      addNewlyUnlockedAchievement,
      difficulty,
    ]
  );

  const initGame = useCallback(() => {
    if (!gameContainerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      parent: gameContainerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 900 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [GameScene],
      backgroundColor: '#87CEEB',
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      const scene = game.scene.getScene('GameScene') as GameScene;
      gameSceneRef.current = scene;

      scene.setCallbacks({
        onHeightUpdate: handleHeightUpdate,
        onSpeedUpdate: handleSpeedUpdate,
        onJumpZoneEnter: handleJumpZoneEnter,
        onGameOver: handleGameOver,
        onSuccess: handleSuccess,
      });

      scene.scene.start('GameScene', { difficulty });
      isInitialized.current = true;
    });
  }, [difficulty, handleHeightUpdate, handleSpeedUpdate, handleJumpZoneEnter, handleGameOver, handleSuccess]);

  useEffect(() => {
    if (isPlaying && !isInitialized.current) {
      initGame();
    }

    return () => {
      if (gameRef.current && !isPlaying) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        gameSceneRef.current = null;
        isInitialized.current = false;
      }
    };
  }, [isPlaying, initGame]);

  useEffect(() => {
    if (gameSceneRef.current && isInitialized.current) {
      gameSceneRef.current.setDifficulty(difficulty);
    }
  }, [difficulty]);

  const restartGame = useCallback(() => {
    hasFirstJumped.current = false;
    resetCombo();
    if (gameSceneRef.current) {
      gameSceneRef.current.restartGame();
    }
  }, [resetCombo]);

  useEffect(() => {
    (window as any).__restartGame = restartGame;
    return () => {
      delete (window as any).__restartGame;
    };
  }, [restartGame]);

  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        gameSceneRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ maxWidth: GAME_CONFIG.WIDTH, maxHeight: GAME_CONFIG.HEIGHT }}
    />
  );
}
