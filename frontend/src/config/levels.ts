/**
 * Level configuration interface
 */
export interface LevelConfig {
  level: number;
  requiredScore: number;
  obstacleSpawnInterval: number; // milliseconds
  obstacleSpeed: number; // pixels per second
  coinSpawnInterval: number; // milliseconds
  coinSpeed: number; // pixels per second
  obstacleSpawnChance: number; // 0-1
  coinSpawnChance: number; // 0-1
}

/**
 * Configuration-driven level definitions
 * Game difficulty increases with each level
 */
export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    requiredScore: 0,
    obstacleSpawnInterval: 2000,
    obstacleSpeed: 100,
    coinSpawnInterval: 3000,
    coinSpeed: 80,
    obstacleSpawnChance: 0.7,
    coinSpawnChance: 0.8,
  },
  {
    level: 2,
    requiredScore: 50,
    obstacleSpawnInterval: 1800,
    obstacleSpeed: 120,
    coinSpawnInterval: 2800,
    coinSpeed: 90,
    obstacleSpawnChance: 0.75,
    coinSpawnChance: 0.75,
  },
  {
    level: 3,
    requiredScore: 150,
    obstacleSpawnInterval: 1600,
    obstacleSpeed: 140,
    coinSpawnInterval: 2600,
    coinSpeed: 100,
    obstacleSpawnChance: 0.8,
    coinSpawnChance: 0.7,
  },
  {
    level: 4,
    requiredScore: 300,
    obstacleSpawnInterval: 1400,
    obstacleSpeed: 160,
    coinSpawnInterval: 2400,
    coinSpeed: 110,
    obstacleSpawnChance: 0.85,
    coinSpawnChance: 0.65,
  },
  {
    level: 5,
    requiredScore: 500,
    obstacleSpawnInterval: 1200,
    obstacleSpeed: 180,
    coinSpawnInterval: 2200,
    coinSpeed: 120,
    obstacleSpawnChance: 0.9,
    coinSpawnChance: 0.6,
  },
  {
    level: 6,
    requiredScore: 750,
    obstacleSpawnInterval: 1000,
    obstacleSpeed: 200,
    coinSpawnInterval: 2000,
    coinSpeed: 130,
    obstacleSpawnChance: 0.92,
    coinSpawnChance: 0.55,
  },
  {
    level: 7,
    requiredScore: 1000,
    obstacleSpawnInterval: 900,
    obstacleSpeed: 220,
    coinSpawnInterval: 1900,
    coinSpeed: 140,
    obstacleSpawnChance: 0.94,
    coinSpawnChance: 0.5,
  },
  {
    level: 8,
    requiredScore: 1500,
    obstacleSpawnInterval: 800,
    obstacleSpeed: 240,
    coinSpawnInterval: 1800,
    coinSpeed: 150,
    obstacleSpawnChance: 0.95,
    coinSpawnChance: 0.45,
  },
];

/**
 * Get level configuration by level number
 */
export function getLevelConfig(level: number): LevelConfig {
  // If level exceeds defined levels, return the last level with increased difficulty
  if (level > LEVELS.length) {
    const lastLevel = LEVELS[LEVELS.length - 1];
    return {
      ...lastLevel,
      level,
      requiredScore: lastLevel.requiredScore + (level - LEVELS.length) * 500,
      obstacleSpawnInterval: Math.max(500, lastLevel.obstacleSpawnInterval - (level - LEVELS.length) * 50),
      obstacleSpeed: lastLevel.obstacleSpeed + (level - LEVELS.length) * 20,
      obstacleSpawnChance: Math.min(0.98, lastLevel.obstacleSpawnChance + (level - LEVELS.length) * 0.01),
    };
  }
  return LEVELS[level - 1];
}

/**
 * Determine which level the player should be on based on score
 */
export function getLevelForScore(score: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].requiredScore) {
      return LEVELS[i].level;
    }
  }
  return 1;
}
