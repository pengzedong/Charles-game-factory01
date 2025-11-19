import { eventBus, GameEvents } from './Events';

/**
 * GameState - Centralised state container for score, level and session flags
 */
export class GameState {
  private static instance: GameState | null = null;

  private score = 0;
  private level = 1;
  private bestScoreValue = 0;
  private paused = false;
  private hasGameEnded = false;
  private readonly BEST_SCORE_KEY = 'key-dash-adventure-best-score';

  constructor(registerAsSingleton = true) {
    this.loadBestScore();

    if (registerAsSingleton) {
      GameState.instance = this;
    }
  }

  /**
   * Access the shared singleton instance that gameplay scenes consume
   */
  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  /**
   * Initialize a fresh run without touching best score persistence
   */
  initialize(startingLevel: number = 1): void {
    this.score = 0;
    this.level = startingLevel;
    this.paused = false;
    this.hasGameEnded = false;
  }

  /**
   * Reset the runtime state and optionally wipe the persisted best score
   */
  reset(options: { clearBestScore?: boolean } = {}): void {
    this.initialize();

    if (options.clearBestScore) {
      this.bestScoreValue = 0;
      try {
        localStorage.removeItem(this.BEST_SCORE_KEY);
      } catch (error) {
        console.warn('Failed to clear best score from localStorage', error);
      }
    }
  }

  /**
   * Current score helpers (method for backwards compatibility + getter for new API)
   */
  getScore(): number {
    return this.score;
  }

  get currentScore(): number {
    return this.score;
  }

  /**
   * Level helpers
   */
  getLevel(): number {
    return this.level;
  }

  get currentLevel(): number {
    return this.level;
  }

  /**
   * Best score helpers (method + property)
   */
  getBestScore(): number {
    return this.bestScoreValue;
  }

  get bestScore(): number {
    return this.bestScoreValue;
  }

  /**
   * Update routines
   */
  addScore(points: number): void {
    this.score += points;
    this.updateBestScoreFromCurrent();
    eventBus.emit(GameEvents.SCORE_CHANGED, this.score);
  }

  updateScore(points: number): void {
    this.addScore(points);
  }

  setScore(score: number): void {
    this.score = score;
    this.updateBestScoreFromCurrent();
    eventBus.emit(GameEvents.SCORE_CHANGED, this.score);
  }

  nextLevel(): void {
    this.setLevel(this.level + 1);
  }

  setLevel(level: number): void {
    this.level = level;
    eventBus.emit(GameEvents.LEVEL_CHANGED, this.level);
  }

  /**
   * Pause helpers used by the GameScene
   */
  togglePause(): void {
    this.paused = !this.paused;
    eventBus.emit(this.paused ? GameEvents.GAME_PAUSED : GameEvents.GAME_RESUMED);
  }

  get isPaused(): boolean {
    return this.paused;
  }

  /**
   * Game over handler ensures best score persistence and single emission
   */
  gameOver(): void {
    if (this.hasGameEnded) {
      return;
    }

    this.hasGameEnded = true;
    this.paused = true;
    this.updateBestScoreFromCurrent();
    eventBus.emit(GameEvents.GAME_OVER, {
      score: this.score,
      bestScore: this.bestScoreValue,
    });
  }

  /**
   * Load best score from localStorage
   */
  private loadBestScore(): void {
    try {
      const stored = localStorage.getItem(this.BEST_SCORE_KEY);
      const parsed = stored ? parseInt(stored, 10) : 0;
      this.bestScoreValue = isNaN(parsed) ? 0 : parsed;
    } catch (error) {
      console.warn('Failed to load best score from localStorage', error);
      this.bestScoreValue = 0;
    }
  }

  /**
   * Save best score to localStorage
   */
  private saveBestScore(): void {
    try {
      localStorage.setItem(this.BEST_SCORE_KEY, this.bestScoreValue.toString());
    } catch (error) {
      console.warn('Failed to save best score to localStorage', error);
    }
  }

  private updateBestScoreFromCurrent(): void {
    if (this.score > this.bestScoreValue) {
      this.bestScoreValue = this.score;
      this.saveBestScore();
    }
  }
}
