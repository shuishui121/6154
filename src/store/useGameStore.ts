import { create } from 'zustand';
import type { Difficulty } from '@/game/utils/constants';
import { DIFFICULTY_CONFIG } from '@/game/utils/constants';
import { loadGameData, updateHighScore } from '@/utils/storage';

type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover' | 'achievements';

interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  currentHeight: number;
  score: number;
  combo: number;
  maxHeightReached: number;
  isNewRecord: boolean;
  newlyUnlockedAchievements: string[];
  runSpeed: number;
  isInJumpZone: boolean;
  perfectTiming: boolean;
  maxSpeedReached: boolean;

  setStatus: (status: GameStatus) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  endGame: (finalHeight: number) => void;
  resetGame: () => void;
  incrementHeight: () => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setRunSpeed: (speed: number) => void;
  setCurrentHeight: (height: number) => void;
  setIsInJumpZone: (value: boolean) => void;
  setPerfectTiming: (value: boolean) => void;
  setMaxSpeedReached: (value: boolean) => void;
  addNewlyUnlockedAchievement: (id: string) => void;
  clearNewlyUnlockedAchievements: () => void;
  getHighScore: () => number;
}

export const useGameStore = create<GameState>((set, get) => {
  const initialData = loadGameData();

  return {
    status: 'menu',
    difficulty: initialData.settings.difficulty,
    currentHeight: DIFFICULTY_CONFIG[initialData.settings.difficulty].initialHeight,
    score: 0,
    combo: 0,
    maxHeightReached: 0,
    isNewRecord: false,
    newlyUnlockedAchievements: [],
    runSpeed: 0,
    isInJumpZone: false,
    perfectTiming: false,
    maxSpeedReached: false,

    setStatus: (status) => set({ status }),

    setDifficulty: (difficulty) => {
      set({
        difficulty,
        currentHeight: DIFFICULTY_CONFIG[difficulty].initialHeight,
      });
    },

    startGame: () => {
      const { difficulty } = get();
      set({
        status: 'playing',
        currentHeight: DIFFICULTY_CONFIG[difficulty].initialHeight,
        score: 0,
        combo: 0,
        maxHeightReached: 0,
        isNewRecord: false,
        newlyUnlockedAchievements: [],
        runSpeed: 0,
        isInJumpZone: false,
        perfectTiming: false,
        maxSpeedReached: false,
      });
    },

    endGame: (finalHeight) => {
      const { difficulty } = get();
      const isNewRecord = updateHighScore(difficulty, finalHeight);
      set({
        status: 'gameover',
        maxHeightReached: finalHeight,
        isNewRecord,
      });
    },

    resetGame: () => {
      const { difficulty } = get();
      set({
        status: 'menu',
        currentHeight: DIFFICULTY_CONFIG[difficulty].initialHeight,
        score: 0,
        combo: 0,
        maxHeightReached: 0,
        isNewRecord: false,
        newlyUnlockedAchievements: [],
        runSpeed: 0,
        isInJumpZone: false,
        perfectTiming: false,
        maxSpeedReached: false,
      });
    },

    incrementHeight: () => {
      const { difficulty, currentHeight, score, combo } = get();
      const config = DIFFICULTY_CONFIG[difficulty];
      const newHeight = Math.round((currentHeight + config.heightStep) * 100) / 100;
      const newScore = score + Math.floor(newHeight * 100 * (1 + combo * 0.1));
      set({
        currentHeight: newHeight,
        score: newScore,
      });
    },

    incrementCombo: () => {
      set((state) => ({ combo: state.combo + 1 }));
    },

    resetCombo: () => {
      set({ combo: 0 });
    },

    setRunSpeed: (speed) => set({ runSpeed: speed }),

    setCurrentHeight: (height) => set({ currentHeight: height }),

    setIsInJumpZone: (value) => set({ isInJumpZone: value }),

    setPerfectTiming: (value) => set({ perfectTiming: value }),

    setMaxSpeedReached: (value) => set({ maxSpeedReached: value }),

    addNewlyUnlockedAchievement: (id) => {
      set((state) => ({
        newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, id],
      }));
    },

    clearNewlyUnlockedAchievements: () => {
      set({ newlyUnlockedAchievements: [] });
    },

    getHighScore: () => {
      const data = loadGameData();
      return data.highScores[get().difficulty];
    },
  };
});
