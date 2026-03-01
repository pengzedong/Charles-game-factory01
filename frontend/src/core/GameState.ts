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

  // Combo system
  private comboStreak = 0;
  private comboMultiplierValue = 1;

  constructor(registerAsSingleton = true) {
    this.loadBestScore();

    if (registerAsSingleton) {
      GameState.instance = this;
    }
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  initialize(startingLevel: number = 1): void {
    this.score = 0;
    this.level = startingLevel;
    this.paused = false;
    this.hasGameEnded = false;
    this.comboStreak = 0;
    this.comboMultiplierValue = 1;
  }

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

  getScore(): number {
    return this.score;
  }

  get currentScore(): number {
    return this.score;
  }

  getLevel(): number {
    return this.level;
  }

  get currentLevel(): number {
    return this.level;
  }

  getBestScore(): number {
    return this.bestScoreValue;
  }

  get bestScore(): number {
    return this.bestScoreValue;
  }

  get comboMultiplier(): number {
    return this.comboMultiplierValue;
  }

  get combo(): number {
    return this.comboStreak;
  }

  /**
   * Increment combo streak on coin collection
   */
  incrementCombo(): void {
    this.comboStreak++;
    // Multiplier: 1x, 1.5x, 2x, 2.5x, 3x (caps at 3x)
    this.comboMultiplierValue = Math.min(1 + Math.floor(this.comboStreak / 3) * 0.5, 3);
    eventBus.emit(GameEvents.COMBO_CHANGED, {
      streak: this.comboStreak,
      multiplier: this.comboMultiplierValue,
    });
  }

  /**
   * Reset combo on hit
   */
  resetCombo(): void {
    this.comboStreak = 0;
    this.comboMultiplierValue = 1;
    eventBus.emit(GameEvents.COMBO_CHANGED, {
      streak: 0,
      multiplier: 1,
    });
  }

  addScore(points: number): void {
    const actualPoints = Math.floor(points * this.comboMultiplierValue);
    this.score += actualPoints;
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

  togglePause(): void {
    this.paused = !this.paused;
    eventBus.emit(this.paused ? GameEvents.GAME_PAUSED : GameEvents.GAME_RESUMED);
  }

  get isPaused(): boolean {
    return this.paused;
  }

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
