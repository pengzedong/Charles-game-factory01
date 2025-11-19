/**
 * API service layer for backend integration
 *
 * Backend API is deployed on Vercel as serverless functions
 * All endpoints are accessible at /api/* (same domain as frontend)
 */

// API base URL - uses relative path since backend is on same domain (Vercel)
const API_BASE_URL = '/api';

export interface HighscoreEntry {
  id: string;
  playerName: string;
  score: number;
  timestamp: string;
}

export interface HighscoreCreate {
  playerName: string;
  score: number;
}

export interface RoomInfo {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: string[];
  isActive: boolean;
}

export interface RoomCreate {
  name: string;
  maxPlayers?: number;
}

/**
 * Submit high score to backend
 * @param score - Player's final score
 * @param playerName - Optional player name
 */
export async function submitHighscore(
  score: number,
  playerName: string = 'Anonymous'
): Promise<HighscoreEntry> {
  console.log('[API] submitHighscore called:', { score, playerName });

  try {
    const response = await fetch(`${API_BASE_URL}/highscores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, score }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit highscore: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] High score submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error submitting highscore:', error);
    throw error;
  }
}

/**
 * Fetch high scores leaderboard from backend
 * @param limit - Number of entries to fetch
 */
export async function fetchHighscores(limit: number = 10): Promise<HighscoreEntry[]> {
  console.log('[API] fetchHighscores called:', { limit });

  try {
    const response = await fetch(`${API_BASE_URL}/highscores?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch highscores: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] High scores fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error fetching highscores:', error);
    // Return empty array on error to prevent game from crashing
    return [];
  }
}

/**
 * Create a new multiplayer room
 * @param name - Room name
 * @param maxPlayers - Maximum number of players
 */
export async function createRoom(
  name: string = 'New Room',
  maxPlayers: number = 4
): Promise<RoomInfo> {
  console.log('[API] createRoom called:', { name, maxPlayers });

  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, maxPlayers }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create room: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] Room created successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error creating room:', error);
    throw error;
  }
}

/**
 * Join an existing multiplayer room
 * @param roomId - The room ID to join
 * @param playerName - Player's name
 */
export async function joinRoom(roomId: string, playerName: string = 'Player'): Promise<RoomInfo> {
  console.log('[API] joinRoom called:', { roomId, playerName });

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to join room: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] Room joined successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error joining room:', error);
    throw error;
  }
}

/**
 * Leave a multiplayer room
 * @param roomId - The room ID to leave
 * @param playerName - Player's name
 */
export async function leaveRoom(roomId: string, playerName: string): Promise<void> {
  console.log('[API] leaveRoom called:', { roomId, playerName });

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to leave room: ${response.statusText}`);
    }

    console.log('[API] Room left successfully');
  } catch (error) {
    console.error('[API] Error leaving room:', error);
    throw error;
  }
}

/**
 * Fetch room status
 * @param roomId - The room ID to check
 */
export async function getRoomStatus(roomId: string): Promise<RoomInfo> {
  console.log('[API] getRoomStatus called:', { roomId });

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch room status: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] Room status fetched:', data);
    return data;
  } catch (error) {
    console.error('[API] Error fetching room status:', error);
    throw error;
  }
}

/**
 * Get all active rooms
 */
export async function getAllRooms(): Promise<RoomInfo[]> {
  console.log('[API] getAllRooms called');

  try {
    const response = await fetch(`${API_BASE_URL}/rooms?active_only=true`);

    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] Rooms fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('[API] Error fetching rooms:', error);
    return [];
  }
}
