/**
 * Game event constants for the event system
 */
export const GameEvents = {
  SCORE_CHANGED: 'score-changed',
  LEVEL_CHANGED: 'level-changed',
  GAME_OVER: 'game-over',
  GAME_PAUSED: 'game-paused',
  GAME_RESUMED: 'game-resumed',
  COIN_COLLECTED: 'coin-collected',
  PLAYER_HIT: 'player-hit',
} as const;

export type GameEventType = typeof GameEvents[keyof typeof GameEvents];

/**
 * Simple event bus for game-wide communication
 */
class EventBus {
  private listeners: Map<string, Array<(data?: any) => void>> = new Map();

  on(event: string, callback: (data?: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data?: any) => void): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
