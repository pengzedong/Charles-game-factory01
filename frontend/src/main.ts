/**
 * Main entry point for Key Dash Adventure
 */
import { GameState } from './core/GameState';
import { getTotalLevels } from './config/levels';

console.log('Key Dash Adventure');
console.log(`Total levels: ${getTotalLevels()}`);

// Initialize game state singleton
const gameState = GameState.getInstance();
gameState.initialize();

console.log('Game initialized');
