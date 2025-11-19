export interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  scoreThreshold: number;
  obstacleSpawnInterval: number;
  obstacleSpawnChance: number;
  obstacleSpeed: number;
  coinSpawnInterval: number;
  coinSpawnChance: number;
  coinSpeed: number;
}

const levelConfigs: LevelConfig[] = [
  {
    id: 1,
    name: 'Neon District',
    difficulty: 'easy',
    scoreThreshold: 0,
    obstacleSpawnInterval: 1500,
    obstacleSpawnChance: 0.4,
    obstacleSpeed: 150,
    coinSpawnInterval: 1000,
    coinSpawnChance: 0.9,
    coinSpeed: 120,
  },
  {
    id: 2,
    name: 'Arcade Alley',
    difficulty: 'easy',
    scoreThreshold: 150,
    obstacleSpawnInterval: 1300,
    obstacleSpawnChance: 0.5,
    obstacleSpeed: 175,
    coinSpawnInterval: 1000,
    coinSpawnChance: 0.8,
    coinSpeed: 140,
  },
  {
    id: 3,
    name: 'Cyber Garden',
    difficulty: 'medium',
    scoreThreshold: 350,
    obstacleSpawnInterval: 1100,
    obstacleSpawnChance: 0.55,
    obstacleSpeed: 200,
    coinSpawnInterval: 900,
    coinSpawnChance: 0.75,
    coinSpeed: 165,
  },
  {
    id: 4,
    name: 'Pixel Bridge',
    difficulty: 'medium',
    scoreThreshold: 650,
    obstacleSpawnInterval: 950,
    obstacleSpawnChance: 0.6,
    obstacleSpeed: 225,
    coinSpawnInterval: 850,
    coinSpawnChance: 0.7,
    coinSpeed: 190,
  },
  {
    id: 5,
    name: 'Synthwave Desert',
    difficulty: 'hard',
    scoreThreshold: 950,
    obstacleSpawnInterval: 850,
    obstacleSpawnChance: 0.65,
    obstacleSpeed: 250,
    coinSpawnInterval: 800,
    coinSpawnChance: 0.65,
    coinSpeed: 210,
  },
  {
    id: 6,
    name: 'Frozen Grid',
    difficulty: 'hard',
    scoreThreshold: 1300,
    obstacleSpawnInterval: 750,
    obstacleSpawnChance: 0.7,
    obstacleSpeed: 275,
    coinSpawnInterval: 750,
    coinSpawnChance: 0.6,
    coinSpeed: 225,
  },
  {
    id: 7,
    name: 'Final Gauntlet',
    difficulty: 'expert',
    scoreThreshold: 1700,
    obstacleSpawnInterval: 650,
    obstacleSpawnChance: 0.75,
    obstacleSpeed: 300,
    coinSpawnInterval: 700,
    coinSpawnChance: 0.55,
    coinSpeed: 240,
  },
];

export const levels = levelConfigs;

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 1) {
    return levelConfigs[0];
  }

  if (level >= levelConfigs.length) {
    return levelConfigs[levelConfigs.length - 1];
  }

  return levelConfigs[level - 1];
}

export function getLevelForScore(score: number): number {
  const sorted = [...levelConfigs].sort((a, b) => a.scoreThreshold - b.scoreThreshold);

  let currentLevel = sorted[0].id;

  for (const config of sorted) {
    if (score >= config.scoreThreshold) {
      currentLevel = config.id;
    } else {
      break;
    }
  }

  return currentLevel;
}

export function getLevelById(id: number): LevelConfig | undefined {
  return levelConfigs.find(level => level.id === id);
}

export function getLevelsByDifficulty(difficulty: LevelConfig['difficulty']): LevelConfig[] {
  return levelConfigs.filter(level => level.difficulty === difficulty);
}

export function getTotalLevels(): number {
  return levelConfigs.length;
}
