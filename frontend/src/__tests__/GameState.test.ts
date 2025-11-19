import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameState } from '../core/GameState';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    gameState = new GameState();
  });

  describe('Initialization', () => {
    it('should initialize with score 0 and level 1', () => {
      gameState.initialize();
      expect(gameState.getScore()).toBe(0);
      expect(gameState.getLevel()).toBe(1);
    });

    it('should initialize with a custom starting level', () => {
      gameState.initialize(3);
      expect(gameState.getScore()).toBe(0);
      expect(gameState.getLevel()).toBe(3);
    });

    it('should load best score from localStorage if available', () => {
      localStorage.setItem('key-dash-adventure-best-score', '500');
      const newGameState = new GameState();
      expect(newGameState.getBestScore()).toBe(500);
    });

    it('should initialize best score to 0 if localStorage is empty', () => {
      expect(gameState.getBestScore()).toBe(0);
    });
  });

  describe('Score Management', () => {
    it('should update score correctly', () => {
      gameState.updateScore(100);
      expect(gameState.getScore()).toBe(100);

      gameState.updateScore(50);
      expect(gameState.getScore()).toBe(150);
    });

    it('should allow negative score updates', () => {
      gameState.setScore(100);
      gameState.updateScore(-30);
      expect(gameState.getScore()).toBe(70);
    });

    it('should set score directly', () => {
      gameState.setScore(250);
      expect(gameState.getScore()).toBe(250);
    });

    it('should track cumulative score updates', () => {
      gameState.updateScore(10);
      gameState.updateScore(20);
      gameState.updateScore(30);
      expect(gameState.getScore()).toBe(60);
    });
  });

  describe('Best Score Persistence', () => {
    it('should update best score when current score exceeds it', () => {
      gameState.updateScore(100);
      expect(gameState.getBestScore()).toBe(100);

      gameState.updateScore(50);
      expect(gameState.getBestScore()).toBe(150);
    });

    it('should not update best score when current score is lower', () => {
      gameState.setScore(200);
      expect(gameState.getBestScore()).toBe(200);

      // Create a new game with lower score
      gameState.initialize();
      gameState.setScore(100);
      expect(gameState.getBestScore()).toBe(200);
    });

    it('should persist best score to localStorage', () => {
      gameState.updateScore(300);

      const storedValue = localStorage.getItem('key-dash-adventure-best-score');
      expect(storedValue).toBe('300');
    });

    it('should load persisted best score on new instance', () => {
      gameState.updateScore(450);

      // Create a new instance
      const newGameState = new GameState();
      expect(newGameState.getBestScore()).toBe(450);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw, just log a warning
      expect(() => {
        gameState.updateScore(100);
      }).not.toThrow();

      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Level Management', () => {
    it('should start at level 1', () => {
      gameState.initialize();
      expect(gameState.getLevel()).toBe(1);
    });

    it('should advance to next level', () => {
      gameState.initialize();
      gameState.nextLevel();
      expect(gameState.getLevel()).toBe(2);

      gameState.nextLevel();
      expect(gameState.getLevel()).toBe(3);
    });

    it('should set level directly', () => {
      gameState.setLevel(5);
      expect(gameState.getLevel()).toBe(5);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset score/level but keep best score by default', () => {
      gameState.setScore(500);
      gameState.setLevel(5);

      gameState.reset();

      expect(gameState.getScore()).toBe(0);
      expect(gameState.getLevel()).toBe(1);
      expect(gameState.getBestScore()).toBe(500);
    });

    it('should clear best score from localStorage when requested', () => {
      gameState.updateScore(300);
      expect(localStorage.getItem('key-dash-adventure-best-score')).toBe('300');

      gameState.reset({ clearBestScore: true });

      expect(localStorage.getItem('key-dash-adventure-best-score')).toBeNull();
      expect(gameState.getBestScore()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large scores', () => {
      const largeScore = 999999999;
      gameState.setScore(largeScore);
      expect(gameState.getScore()).toBe(largeScore);
      expect(gameState.getBestScore()).toBe(largeScore);
    });

    it('should handle zero score updates', () => {
      gameState.setScore(100);
      gameState.updateScore(0);
      expect(gameState.getScore()).toBe(100);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('key-dash-adventure-best-score', 'invalid-number');

      const newGameState = new GameState();
      // Should handle NaN gracefully - parseInt returns NaN for invalid strings
      expect(isNaN(newGameState.getBestScore()) || newGameState.getBestScore() === 0).toBe(true);
    });
  });
});
