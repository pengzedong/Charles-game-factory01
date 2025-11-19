/**
 * GameState - Manages the game state including score, level, and persistence
 */
export class GameState {
  private score: number = 0;
  private level: number = 1;
  private bestScore: number = 0;
  private readonly BEST_SCORE_KEY = 'key-dash-adventure-best-score';

  constructor() {
    this.loadBestScore();
  }

  /**
   * Initialize or reset the game state
   */
  initialize(startingLevel: number = 1): void {
    this.score = 0;
    this.level = startingLevel;
    this.loadBestScore();
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get current level
   */
  getLevel(): number {
    return this.level;
  }

  /**
   * Get best score
   */
  getBestScore(): number {
    return this.bestScore;
  }

  /**
   * Update score and check if it's a new best
   */
  updateScore(points: number): void {
    this.score += points;

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveBestScore();
    }
  }

  /**
   * Set score directly (for testing or special cases)
   */
  setScore(score: number): void {
    this.score = score;

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveBestScore();
    }
  }

  /**
   * Advance to next level
   */
  nextLevel(): void {
    this.level++;
  }

  /**
   * Set level directly
   */
  setLevel(level: number): void {
    this.level = level;
  }

  /**
   * Load best score from localStorage
   */
  private loadBestScore(): void {
    try {
      const stored = localStorage.getItem(this.BEST_SCORE_KEY);
      this.bestScore = stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.warn('Failed to load best score from localStorage', error);
      this.bestScore = 0;
    }
  }

  /**
   * Save best score to localStorage
   */
  private saveBestScore(): void {
    try {
      localStorage.setItem(this.BEST_SCORE_KEY, this.bestScore.toString());
    } catch (error) {
      console.warn('Failed to save best score to localStorage', error);
    }
  }

  /**
   * Reset all state including best score
   */
  reset(): void {
    this.score = 0;
    this.level = 1;
    this.bestScore = 0;
    try {
      localStorage.removeItem(this.BEST_SCORE_KEY);
    } catch (error) {
      console.warn('Failed to clear best score from localStorage', error);
    }
  }
}
