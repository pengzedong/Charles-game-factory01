/**
 * Main entry point for Key Dash Adventure
 */
import { GameState } from './core/GameState';
import { levels, getTotalLevels } from './config/levels';

console.log('Key Dash Adventure');
console.log(`Total levels: ${getTotalLevels()}`);

// Initialize game state
const gameState = new GameState();
gameState.initialize();

console.log('Game initialized');
