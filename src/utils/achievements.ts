import { ACHIEVEMENTS } from '@/game/utils/constants';
import {
  unlockAchievement,
  isAchievementUnlocked,
  checkAllDifficultiesCleared,
  addClearedHeight,
  updateBestCombo,
  incrementTotalJumps,
} from './storage';
import type { Difficulty } from '@/game/utils/constants';

export interface AchievementCheckResult {
  newlyUnlocked: string[];
}

export function checkHeightAchievements(
  height: number,
  difficulty: Difficulty
): AchievementCheckResult {
  const newlyUnlocked: string[] = [];

  addClearedHeight(difficulty, height);

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.condition.type === 'height') {
      if (
        height >= achievement.condition.value &&
        !isAchievementUnlocked(achievement.id)
      ) {
        if (unlockAchievement(achievement.id)) {
          newlyUnlocked.push(achievement.id);
        }
      }
    }
  }

  if (height >= 1.5 && checkAllDifficultiesCleared(1.5)) {
    if (!isAchievementUnlocked('all_difficulties')) {
      if (unlockAchievement('all_difficulties')) {
        newlyUnlocked.push('all_difficulties');
      }
    }
  }

  return { newlyUnlocked };
}

export function checkComboAchievements(combo: number): AchievementCheckResult {
  const newlyUnlocked: string[] = [];

  updateBestCombo(combo);

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.condition.type === 'combo') {
      if (
        combo >= achievement.condition.value &&
        !isAchievementUnlocked(achievement.id)
      ) {
        if (unlockAchievement(achievement.id)) {
          newlyUnlocked.push(achievement.id);
        }
      }
    }
  }

  return { newlyUnlocked };
}

export function checkFirstJump(): AchievementCheckResult {
  const newlyUnlocked: string[] = [];
  incrementTotalJumps();

  if (!isAchievementUnlocked('first_jump')) {
    if (unlockAchievement('first_jump')) {
      newlyUnlocked.push('first_jump');
    }
  }

  return { newlyUnlocked };
}

export function checkPerfectTiming(): AchievementCheckResult {
  const newlyUnlocked: string[] = [];

  if (!isAchievementUnlocked('perfect_timing')) {
    if (unlockAchievement('perfect_timing')) {
      newlyUnlocked.push('perfect_timing');
    }
  }

  return { newlyUnlocked };
}

export function checkSpeedDemon(): AchievementCheckResult {
  const newlyUnlocked: string[] = [];

  if (!isAchievementUnlocked('speed_demon')) {
    if (unlockAchievement('speed_demon')) {
      newlyUnlocked.push('speed_demon');
    }
  }

  return { newlyUnlocked };
}

export function getAchievementById(id: string) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
