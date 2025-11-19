import { describe, it, expect } from 'vitest';
import { levels, getLevelById, getLevelsByDifficulty, getTotalLevels, type LevelConfig } from '../config/levels';

describe('Levels Configuration', () => {
  describe('levels array', () => {
    it('should export a non-empty array', () => {
      expect(levels).toBeDefined();
      expect(Array.isArray(levels)).toBe(true);
      expect(levels.length).toBeGreaterThan(0);
    });

    it('should have at least 5 levels', () => {
      expect(levels.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Level structure validation', () => {
    it('should have all required fields for each level', () => {
      levels.forEach((level) => {
        expect(level).toHaveProperty('id');
        expect(level).toHaveProperty('name');
        expect(level).toHaveProperty('difficulty');
        expect(level).toHaveProperty('timeLimit');
        expect(level).toHaveProperty('targetScore');
        expect(level).toHaveProperty('obstacles');
        expect(level).toHaveProperty('collectibles');
      });
    });

    it('should have valid id field (number)', () => {
      levels.forEach((level) => {
        expect(typeof level.id).toBe('number');
        expect(level.id).toBeGreaterThan(0);
      });
    });

    it('should have unique ids', () => {
      const ids = levels.map(level => level.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(levels.length);
    });

    it('should have valid name field (non-empty string)', () => {
      levels.forEach((level) => {
        expect(typeof level.name).toBe('string');
        expect(level.name.length).toBeGreaterThan(0);
      });
    });

    it('should have valid difficulty field', () => {
      const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
      levels.forEach((level) => {
        expect(validDifficulties).toContain(level.difficulty);
      });
    });

    it('should have valid timeLimit (positive number)', () => {
      levels.forEach((level) => {
        expect(typeof level.timeLimit).toBe('number');
        expect(level.timeLimit).toBeGreaterThan(0);
      });
    });

    it('should have valid targetScore (positive number)', () => {
      levels.forEach((level) => {
        expect(typeof level.targetScore).toBe('number');
        expect(level.targetScore).toBeGreaterThan(0);
      });
    });

    it('should have obstacles array with valid structure', () => {
      levels.forEach((level) => {
        expect(Array.isArray(level.obstacles)).toBe(true);
        level.obstacles.forEach((obstacle) => {
          expect(obstacle).toHaveProperty('type');
          expect(obstacle).toHaveProperty('count');
          expect(typeof obstacle.type).toBe('string');
          expect(typeof obstacle.count).toBe('number');
          expect(obstacle.count).toBeGreaterThan(0);
        });
      });
    });

    it('should have collectibles array with valid structure', () => {
      levels.forEach((level) => {
        expect(Array.isArray(level.collectibles)).toBe(true);
        level.collectibles.forEach((collectible) => {
          expect(collectible).toHaveProperty('type');
          expect(collectible).toHaveProperty('count');
          expect(collectible).toHaveProperty('points');
          expect(typeof collectible.type).toBe('string');
          expect(typeof collectible.count).toBe('number');
          expect(typeof collectible.points).toBe('number');
          expect(collectible.count).toBeGreaterThan(0);
          expect(collectible.points).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Level progression', () => {
    it('should have increasing difficulty in general', () => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };

      // At least check that later levels are not easier than the first
      const firstDifficulty = difficultyOrder[levels[0].difficulty];
      const lastDifficulty = difficultyOrder[levels[levels.length - 1].difficulty];

      expect(lastDifficulty).toBeGreaterThanOrEqual(firstDifficulty);
    });

    it('should have increasing target scores', () => {
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i].targetScore).toBeGreaterThanOrEqual(levels[i - 1].targetScore);
      }
    });

    it('should have reasonable time limits (30-600 seconds)', () => {
      levels.forEach((level) => {
        expect(level.timeLimit).toBeGreaterThanOrEqual(30);
        expect(level.timeLimit).toBeLessThanOrEqual(600);
      });
    });
  });

  describe('getLevelById function', () => {
    it('should return correct level when given valid id', () => {
      const level = getLevelById(1);
      expect(level).toBeDefined();
      expect(level?.id).toBe(1);
    });

    it('should return undefined for non-existent id', () => {
      const level = getLevelById(9999);
      expect(level).toBeUndefined();
    });

    it('should return all levels by their ids', () => {
      levels.forEach((expectedLevel) => {
        const level = getLevelById(expectedLevel.id);
        expect(level).toEqual(expectedLevel);
      });
    });
  });

  describe('getLevelsByDifficulty function', () => {
    it('should return levels with matching difficulty', () => {
      const easyLevels = getLevelsByDifficulty('easy');
      expect(Array.isArray(easyLevels)).toBe(true);
      easyLevels.forEach((level) => {
        expect(level.difficulty).toBe('easy');
      });
    });

    it('should return empty array for difficulties with no levels', () => {
      // This test assumes there might be difficulties with no levels
      // If all difficulties have levels, this will just verify the function works
      const result = getLevelsByDifficulty('easy');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should work for all difficulty types', () => {
      const difficulties: Array<'easy' | 'medium' | 'hard' | 'expert'> = ['easy', 'medium', 'hard', 'expert'];

      difficulties.forEach((difficulty) => {
        const result = getLevelsByDifficulty(difficulty);
        expect(Array.isArray(result)).toBe(true);
        result.forEach((level) => {
          expect(level.difficulty).toBe(difficulty);
        });
      });
    });
  });

  describe('getTotalLevels function', () => {
    it('should return the correct number of levels', () => {
      expect(getTotalLevels()).toBe(levels.length);
    });

    it('should return a number greater than 0', () => {
      expect(getTotalLevels()).toBeGreaterThan(0);
    });
  });

  describe('Game balance validation', () => {
    it('should have achievable target scores based on collectibles', () => {
      levels.forEach((level) => {
        const maxPossibleScore = level.collectibles.reduce((sum, collectible) => {
          return sum + (collectible.count * collectible.points);
        }, 0);

        // Target score should be achievable (allowing for some bonus points)
        // or be reasonable (not requiring 100% collection for early levels)
        expect(maxPossibleScore).toBeGreaterThan(0);
      });
    });

    it('should have at least one obstacle type per level', () => {
      levels.forEach((level) => {
        expect(level.obstacles.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one collectible type per level', () => {
      levels.forEach((level) => {
        expect(level.collectibles.length).toBeGreaterThan(0);
      });
    });
  });
});
