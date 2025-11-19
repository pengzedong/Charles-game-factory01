/**
 * API service layer for backend integration
 * Currently implemented as stubs for future development
 */

export interface HighscoreEntry {
  id: string;
  playerName: string;
  score: number;
  level: number;
  timestamp: string;
}

export interface RoomInfo {
  roomId: string;
  playerCount: number;
  status: 'waiting' | 'playing' | 'finished';
}

/**
 * Submit high score to backend
 * @param score - Player's final score
 * @param level - Level reached
 * @param playerName - Optional player name
 */
export async function submitHighscore(
  score: number,
  level: number,
  playerName: string = 'Anonymous'
): Promise<void> {
  console.log('[API] submitHighscore called:', { score, level, playerName });

  // TODO: Implement actual API call
  // Example:
  // const response = await fetch('/api/highscores', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ score, level, playerName }),
  // });
  // return response.json();

  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('[API] High score submitted successfully (mocked)');
}

/**
 * Fetch high scores leaderboard from backend
 * @param limit - Number of entries to fetch
 */
export async function fetchHighscores(limit: number = 10): Promise<HighscoreEntry[]> {
  console.log('[API] fetchHighscores called:', { limit });

  // TODO: Implement actual API call
  // Example:
  // const response = await fetch(`/api/highscores?limit=${limit}`);
  // return response.json();

  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Return mock data
  const mockData: HighscoreEntry[] = [
    {
      id: '1',
      playerName: 'ProGamer',
      score: 1250,
      level: 8,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      playerName: 'SpeedRunner',
      score: 980,
      level: 7,
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      playerName: 'CoinMaster',
      score: 750,
      level: 6,
      timestamp: new Date().toISOString(),
    },
  ];

  console.log('[API] High scores fetched successfully (mocked):', mockData);
  return mockData;
}

/**
 * Create a new multiplayer room
 */
export async function createRoom(): Promise<RoomInfo> {
  console.log('[API] createRoom called');

  // TODO: Implement actual API call

  await new Promise(resolve => setTimeout(resolve, 300));

  const mockRoom: RoomInfo = {
    roomId: 'room-' + Math.random().toString(36).substr(2, 9),
    playerCount: 1,
    status: 'waiting',
  };

  console.log('[API] Room created successfully (mocked):', mockRoom);
  return mockRoom;
}

/**
 * Join an existing multiplayer room
 * @param roomId - The room ID to join
 */
export async function joinRoom(roomId: string): Promise<RoomInfo> {
  console.log('[API] joinRoom called:', { roomId });

  // TODO: Implement actual API call
  // Example:
  // const response = await fetch(`/api/rooms/${roomId}/join`, {
  //   method: 'POST',
  // });
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 300));

  const mockRoom: RoomInfo = {
    roomId,
    playerCount: 2,
    status: 'waiting',
  };

  console.log('[API] Room joined successfully (mocked):', mockRoom);
  return mockRoom;
}

/**
 * Leave a multiplayer room
 * @param roomId - The room ID to leave
 */
export async function leaveRoom(roomId: string): Promise<void> {
  console.log('[API] leaveRoom called:', { roomId });

  // TODO: Implement actual API call

  await new Promise(resolve => setTimeout(resolve, 200));

  console.log('[API] Room left successfully (mocked)');
}

/**
 * Fetch room status
 * @param roomId - The room ID to check
 */
export async function getRoomStatus(roomId: string): Promise<RoomInfo> {
  console.log('[API] getRoomStatus called:', { roomId });

  // TODO: Implement actual API call

  await new Promise(resolve => setTimeout(resolve, 200));

  const mockRoom: RoomInfo = {
    roomId,
    playerCount: 2,
    status: 'playing',
  };

  console.log('[API] Room status fetched (mocked):', mockRoom);
  return mockRoom;
}
