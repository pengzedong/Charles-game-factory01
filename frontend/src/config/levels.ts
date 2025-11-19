/**
 * Level configuration for Key Dash Adventure
 */

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number; // seconds
  targetScore: number;
  obstacles: {
    type: string;
    count: number;
  }[];
  collectibles: {
    type: string;
    count: number;
    points: number;
  }[];
}

export const levels: LevelConfig[] = [
  {
    id: 1,
    name: 'Tutorial Valley',
    difficulty: 'easy',
    timeLimit: 60,
    targetScore: 100,
    obstacles: [
      { type: 'rock', count: 5 },
      { type: 'pit', count: 2 }
    ],
    collectibles: [
      { type: 'coin', count: 10, points: 10 },
      { type: 'gem', count: 2, points: 25 }
    ]
  },
  {
    id: 2,
    name: 'Forest Path',
    difficulty: 'easy',
    timeLimit: 90,
    targetScore: 200,
    obstacles: [
      { type: 'rock', count: 8 },
      { type: 'pit', count: 4 },
      { type: 'tree', count: 3 }
    ],
    collectibles: [
      { type: 'coin', count: 15, points: 10 },
      { type: 'gem', count: 4, points: 25 }
    ]
  },
  {
    id: 3,
    name: 'Mountain Climb',
    difficulty: 'medium',
    timeLimit: 120,
    targetScore: 350,
    obstacles: [
      { type: 'rock', count: 12 },
      { type: 'pit', count: 6 },
      { type: 'spike', count: 4 }
    ],
    collectibles: [
      { type: 'coin', count: 20, points: 10 },
      { type: 'gem', count: 6, points: 25 },
      { type: 'star', count: 1, points: 100 }
    ]
  },
  {
    id: 4,
    name: 'Desert Dash',
    difficulty: 'medium',
    timeLimit: 150,
    targetScore: 500,
    obstacles: [
      { type: 'cactus', count: 10 },
      { type: 'pit', count: 8 },
      { type: 'spike', count: 6 }
    ],
    collectibles: [
      { type: 'coin', count: 25, points: 10 },
      { type: 'gem', count: 8, points: 25 },
      { type: 'star', count: 2, points: 100 }
    ]
  },
  {
    id: 5,
    name: 'Lava Cavern',
    difficulty: 'hard',
    timeLimit: 180,
    targetScore: 750,
    obstacles: [
      { type: 'lava', count: 15 },
      { type: 'pit', count: 10 },
      { type: 'spike', count: 8 },
      { type: 'boulder', count: 5 }
    ],
    collectibles: [
      { type: 'coin', count: 30, points: 10 },
      { type: 'gem', count: 12, points: 25 },
      { type: 'star', count: 3, points: 100 }
    ]
  },
  {
    id: 6,
    name: 'Ice Palace',
    difficulty: 'hard',
    timeLimit: 200,
    targetScore: 1000,
    obstacles: [
      { type: 'ice-spike', count: 20 },
      { type: 'pit', count: 12 },
      { type: 'frozen-block', count: 10 }
    ],
    collectibles: [
      { type: 'coin', count: 35, points: 10 },
      { type: 'gem', count: 15, points: 25 },
      { type: 'star', count: 4, points: 100 }
    ]
  },
  {
    id: 7,
    name: 'Final Gauntlet',
    difficulty: 'expert',
    timeLimit: 240,
    targetScore: 1500,
    obstacles: [
      { type: 'mixed', count: 30 },
      { type: 'pit', count: 15 },
      { type: 'spike', count: 12 },
      { type: 'moving-platform', count: 8 }
    ],
    collectibles: [
      { type: 'coin', count: 50, points: 10 },
      { type: 'gem', count: 20, points: 25 },
      { type: 'star', count: 5, points: 100 }
    ]
  }
];

/**
 * Get level by ID
 */
export function getLevelById(id: number): LevelConfig | undefined {
  return levels.find(level => level.id === id);
}

/**
 * Get levels by difficulty
 */
export function getLevelsByDifficulty(difficulty: LevelConfig['difficulty']): LevelConfig[] {
  return levels.filter(level => level.difficulty === difficulty);
}

/**
 * Get total number of levels
 */
export function getTotalLevels(): number {
  return levels.length;
}
