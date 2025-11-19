import { describe, it, expect } from 'vitest';
import {
  levels,
  getLevelById,
  getLevelsByDifficulty,
  getTotalLevels,
  getLevelConfig,
  getLevelForScore,
  type LevelConfig,
} from '../config/levels';

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
        expect(level).toHaveProperty('scoreThreshold');
        expect(level).toHaveProperty('obstacleSpawnInterval');
        expect(level).toHaveProperty('obstacleSpawnChance');
        expect(level).toHaveProperty('obstacleSpeed');
        expect(level).toHaveProperty('coinSpawnInterval');
        expect(level).toHaveProperty('coinSpawnChance');
        expect(level).toHaveProperty('coinSpeed');
      });
    });

    it('should have valid numeric values for spawn settings', () => {
      levels.forEach((level) => {
        expect(typeof level.obstacleSpawnInterval).toBe('number');
        expect(typeof level.obstacleSpeed).toBe('number');
        expect(typeof level.coinSpawnInterval).toBe('number');
        expect(typeof level.coinSpeed).toBe('number');
        expect(level.obstacleSpawnInterval).toBeGreaterThan(0);
        expect(level.coinSpawnInterval).toBeGreaterThan(0);
        expect(level.obstacleSpeed).toBeGreaterThan(0);
        expect(level.coinSpeed).toBeGreaterThan(0);
      });
    });

    it('should keep spawn chances between 0 and 1', () => {
      levels.forEach((level) => {
        expect(level.obstacleSpawnChance).toBeGreaterThan(0);
        expect(level.obstacleSpawnChance).toBeLessThanOrEqual(1);
        expect(level.coinSpawnChance).toBeGreaterThan(0);
        expect(level.coinSpawnChance).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Level progression', () => {
    it('should have increasing difficulty in general', () => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 } as const;
      const firstDifficulty = difficultyOrder[levels[0].difficulty];
      const lastDifficulty = difficultyOrder[levels[levels.length - 1].difficulty];

      expect(lastDifficulty).toBeGreaterThanOrEqual(firstDifficulty);
    });

    it('should have increasing score thresholds', () => {
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i].scoreThreshold).toBeGreaterThan(levels[i - 1].scoreThreshold);
      }
    });

    it('should gradually reduce spawn intervals to increase pressure', () => {
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i].obstacleSpawnInterval).toBeLessThanOrEqual(levels[i - 1].obstacleSpawnInterval);
      }
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

    it('should work for all difficulty types', () => {
      const difficulties: Array<LevelConfig['difficulty']> = ['easy', 'medium', 'hard', 'expert'];

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

  describe('Helper exports', () => {
    it('should return a valid config for any level id', () => {
      for (let levelNumber = 1; levelNumber <= levels.length; levelNumber++) {
        const config = getLevelConfig(levelNumber);
        expect(config.id).toBe(levelNumber);
      }
    });

    it('should clamp config requests beyond range to nearest level', () => {
      const low = getLevelConfig(-10);
      const high = getLevelConfig(999);
      expect(low.id).toBe(levels[0].id);
      expect(high.id).toBe(levels[levels.length - 1].id);
    });

    it('should map scores to expected level ids', () => {
      const firstLevel = levels[0];
      const lastLevel = levels[levels.length - 1];
      expect(getLevelForScore(firstLevel.scoreThreshold).toString()).toBe(firstLevel.id.toString());
      expect(getLevelForScore(lastLevel.scoreThreshold + 1000).toString()).toBe(lastLevel.id.toString());
    });
  });
});
