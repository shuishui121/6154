import { STORAGE_KEY, Difficulty, ACHIEVEMENTS } from '@/game/utils/constants';

export interface GameStorageData {
  highScores: {
    easy: number;
    normal: number;
    hard: number;
  };
  achievements: {
    [id: string]: {
      unlocked: boolean;
      unlockedAt: number;
    };
  };
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: Difficulty;
  };
  totalJumps: number;
  totalPlayTime: number;
  bestCombo: number;
  heightsCleared: {
    easy: number[];
    normal: number[];
    hard: number[];
  };
}

const defaultData: GameStorageData = {
  highScores: {
    easy: 0,
    normal: 0,
    hard: 0,
  },
  achievements: {},
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal',
  },
  totalJumps: 0,
  totalPlayTime: 0,
  bestCombo: 0,
  heightsCleared: {
    easy: [],
    normal: [],
    hard: [],
  },
};

export function loadGameData(): GameStorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...defaultData, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load game data:', e);
  }
  return { ...defaultData };
}

export function saveGameData(data: GameStorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game data:', e);
  }
}

export function updateHighScore(difficulty: Difficulty, height: number): boolean {
  const data = loadGameData();
  if (height > data.highScores[difficulty]) {
    data.highScores[difficulty] = height;
    saveGameData(data);
    return true;
  }
  return false;
}

export function addClearedHeight(difficulty: Difficulty, height: number): void {
  const data = loadGameData();
  if (!data.heightsCleared[difficulty].includes(height)) {
    data.heightsCleared[difficulty].push(height);
    saveGameData(data);
  }
}

export function unlockAchievement(id: string): boolean {
  const data = loadGameData();
  if (!data.achievements[id]?.unlocked) {
    data.achievements[id] = {
      unlocked: true,
      unlockedAt: Date.now(),
    };
    saveGameData(data);
    return true;
  }
  return false;
}

export function isAchievementUnlocked(id: string): boolean {
  const data = loadGameData();
  return data.achievements[id]?.unlocked ?? false;
}

export function getUnlockedAchievements(): string[] {
  const data = loadGameData();
  return Object.entries(data.achievements)
    .filter(([, value]) => value.unlocked)
    .map(([id]) => id);
}

export function incrementTotalJumps(): void {
  const data = loadGameData();
  data.totalJumps += 1;
  saveGameData(data);
}

export function updateBestCombo(combo: number): boolean {
  const data = loadGameData();
  if (combo > data.bestCombo) {
    data.bestCombo = combo;
    saveGameData(data);
    return true;
  }
  return false;
}

export function checkAllDifficultiesCleared(height: number): boolean {
  const data = loadGameData();
  return (
    data.highScores.easy >= height &&
    data.highScores.normal >= height &&
    data.highScores.hard >= height
  );
}

export function getAchievementsWithStatus() {
  const data = loadGameData();
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: data.achievements[a.id]?.unlocked ?? false,
    unlockedAt: data.achievements[a.id]?.unlockedAt,
  }));
}
