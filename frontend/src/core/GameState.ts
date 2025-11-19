import { eventBus, GameEvents } from './Events';

/**
 * Central game state manager
 * Handles score, level, and persistent high score
 */
export class GameState {
  private static instance: GameState;

  private _currentScore: number = 0;
  private _bestScore: number = 0;
  private _currentLevel: number = 1;
  private _isPaused: boolean = false;

  private readonly BEST_SCORE_KEY = 'key-dash-adventure-best-score';

  private constructor() {
    this.loadBestScore();
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  // Score management
  get currentScore(): number {
    return this._currentScore;
  }

  get bestScore(): number {
    return this._bestScore;
  }

  get currentLevel(): number {
    return this._currentLevel;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  addScore(points: number): void {
    this._currentScore += points;
    eventBus.emit(GameEvents.SCORE_CHANGED, this._currentScore);
  }

  setScore(score: number): void {
    this._currentScore = score;
    eventBus.emit(GameEvents.SCORE_CHANGED, this._currentScore);
  }

  advanceLevel(): void {
    this._currentLevel += 1;
    eventBus.emit(GameEvents.LEVEL_CHANGED, this._currentLevel);
  }

  setLevel(level: number): void {
    this._currentLevel = level;
    eventBus.emit(GameEvents.LEVEL_CHANGED, this._currentLevel);
  }

  setPaused(paused: boolean): void {
    this._isPaused = paused;
    if (paused) {
      eventBus.emit(GameEvents.GAME_PAUSED);
    } else {
      eventBus.emit(GameEvents.GAME_RESUMED);
    }
  }

  togglePause(): void {
    this.setPaused(!this._isPaused);
  }

  gameOver(): void {
    // Update best score if current score is higher
    if (this._currentScore > this._bestScore) {
      this._bestScore = this._currentScore;
      this.saveBestScore();
    }
    eventBus.emit(GameEvents.GAME_OVER, {
      score: this._currentScore,
      level: this._currentLevel,
      bestScore: this._bestScore,
    });
  }

  reset(): void {
    this._currentScore = 0;
    this._currentLevel = 1;
    this._isPaused = false;
  }

  // LocalStorage operations
  private loadBestScore(): void {
    const saved = localStorage.getItem(this.BEST_SCORE_KEY);
    this._bestScore = saved ? parseInt(saved, 10) : 0;
  }

  private saveBestScore(): void {
    localStorage.setItem(this.BEST_SCORE_KEY, this._bestScore.toString());
  }

  // For debugging or reset
  clearBestScore(): void {
    this._bestScore = 0;
    localStorage.removeItem(this.BEST_SCORE_KEY);
  }
}
