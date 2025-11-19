# Architecture Documentation

This document provides a comprehensive overview of the Key Dash Adventure technical architecture, covering both frontend and backend systems, their interactions, and deployment strategies.

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Flow](#data-flow)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment Architecture](#deployment-architecture)
- [Future Scalability](#future-scalability)

## High-Level Overview

Key Dash Adventure is a full-stack web application consisting of two main components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Frontend (Phaser)                     │  │
│  │  - Game rendering and logic                           │  │
│  │  - User input handling                                │  │
│  │  - State management                                   │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (fetch/axios)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - RESTful API endpoints                              │  │
│  │  - Highscore management                               │  │
│  │  - Room/session management                            │  │
│  │  - (Future) Database persistence                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **Phaser 3** - HTML5 game framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework

**Backend:**
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **pytest** - Testing framework

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── scenes/              # Game scenes
│   │   ├── BootScene.ts     # Asset loading
│   │   ├── MenuScene.ts     # Main menu
│   │   ├── GameScene.ts     # Main gameplay
│   │   └── GameOverScene.ts # End game results
│   │
│   ├── services/            # External service integrations
│   │   └── api.ts           # Backend API client
│   │
│   ├── config/              # Configuration files
│   │   ├── game.ts          # Phaser game config
│   │   └── levels.ts        # Level definitions
│   │
│   ├── models/              # TypeScript interfaces/types
│   │   ├── GameState.ts     # Game state types
│   │   └── Events.ts        # Event type definitions
│   │
│   ├── utils/               # Utility functions
│   │   └── helpers.ts       # Common helper functions
│   │
│   └── main.ts              # Application entry point
│
├── public/                  # Static assets
│   ├── sprites/             # Character and object sprites
│   ├── sounds/              # Sound effects and music
│   └── maps/                # Tilemap JSON files
│
├── tests/                   # Unit and integration tests
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

### Scene Architecture

Phaser uses a scene-based architecture. Each scene represents a distinct state of the application:

#### 1. BootScene

**Purpose:** Load all game assets (sprites, sounds, maps)

```typescript
class BootScene extends Phaser.Scene {
  preload() {
    // Load all assets
    this.load.image('player', 'sprites/player.png');
    this.load.audio('coin', 'sounds/coin.mp3');
    // ...
  }

  create() {
    // Switch to menu when loading completes
    this.scene.start('MenuScene');
  }
}
```

**Responsibilities:**
- Asset loading with progress tracking
- Initial game configuration
- Transition to MenuScene

#### 2. MenuScene

**Purpose:** Main menu and game settings

```typescript
class MenuScene extends Phaser.Scene {
  create() {
    // Display title, buttons
    // Handle user interaction
    // Start game or show options
  }
}
```

**Responsibilities:**
- Display game title and branding
- Level selection (if implemented)
- Settings configuration
- Transition to GameScene

#### 3. GameScene

**Purpose:** Main gameplay logic and rendering

```typescript
class GameScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private enemies: Phaser.Physics.Arcade.Group;
  private coins: Phaser.Physics.Arcade.Group;
  private gameState: GameState;

  create() {
    // Initialize game world
    this.setupPlayer();
    this.setupEnemies();
    this.setupCoins();
    this.setupCollisions();
  }

  update(time: number, delta: number) {
    // Game loop
    this.handleInput();
    this.updatePlayer(delta);
    this.updateEnemies(delta);
    this.checkWinCondition();
  }
}
```

**Responsibilities:**
- Player movement and controls
- Enemy AI and behavior
- Collision detection and physics
- Score tracking and timer
- Win/lose condition checking
- Transition to GameOverScene

**Key Systems:**

**a) Player Controls**
```typescript
handleInput() {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    this.player.setVelocityX(160);
  }

  if (cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }
}
```

**b) Collision Detection**
```typescript
setupCollisions() {
  this.physics.add.overlap(
    this.player,
    this.coins,
    this.collectCoin,
    null,
    this
  );

  this.physics.add.collider(
    this.player,
    this.enemies,
    this.hitEnemy,
    null,
    this
  );
}
```

**c) Game State Management**
```typescript
interface GameState {
  score: number;
  coinsCollected: number;
  timeRemaining: number;
  level: number;
  playerLives: number;
}
```

#### 4. GameOverScene

**Purpose:** Display results and handle score submission

```typescript
class GameOverScene extends Phaser.Scene {
  async create(data: { score: number; won: boolean }) {
    // Display final score
    // Submit to backend API
    const response = await api.submitHighscore(data.score);
    // Show highscore table
    // Offer replay or menu options
  }
}
```

**Responsibilities:**
- Display final score and statistics
- Submit highscore to backend
- Show leaderboard
- Replay or return to menu options

### Core Modules

#### GameState Management

Centralized state management for game data:

```typescript
class GameStateManager {
  private state: GameState;

  updateScore(points: number): void {
    this.state.score += points;
    this.emit('score-updated', this.state.score);
  }

  resetState(): void {
    this.state = {
      score: 0,
      coinsCollected: 0,
      timeRemaining: 60,
      level: 1,
      playerLives: 3
    };
  }
}
```

#### Event System

Custom event system for decoupled communication:

```typescript
enum GameEvents {
  COIN_COLLECTED = 'coin-collected',
  ENEMY_HIT = 'enemy-hit',
  LEVEL_COMPLETE = 'level-complete',
  GAME_OVER = 'game-over'
}

// Emit event
this.events.emit(GameEvents.COIN_COLLECTED, { value: 10 });

// Listen to event
this.events.on(GameEvents.COIN_COLLECTED, (data) => {
  this.updateScore(data.value);
});
```

### Config-Based Levels

Levels are defined in configuration files for easy modification:

```typescript
// config/levels.ts
export const levels = [
  {
    id: 1,
    name: 'Getting Started',
    timeLimit: 60,
    playerStart: { x: 50, y: 400 },
    coins: [
      { x: 200, y: 300, value: 10 },
      { x: 400, y: 200, value: 20 }
    ],
    enemies: [
      { x: 300, y: 400, type: 'patrol', range: 100 }
    ],
    winCondition: {
      coinsRequired: 10,
      timeBonus: true
    }
  },
  // Additional levels...
];
```

### Services Layer: API Client

The `services/api.ts` module abstracts all backend communication:

```typescript
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async getHighscores(limit: number = 10): Promise<Highscore[]> {
    const response = await fetch(`${API_BASE_URL}/api/highscores?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch highscores');
    }
    return response.json();
  },

  async submitHighscore(score: number, playerName: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/highscores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, playerName })
    });
    if (!response.ok) {
      throw new Error('Failed to submit highscore');
    }
  },

  async createRoom(roomName: string): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roomName })
    });
    return response.json();
  }
};
```

**Benefits:**
- Single source of truth for API calls
- Easy to mock for testing
- Centralized error handling
- Environment-based configuration

## Backend Architecture

### Directory Structure

```
backend/
├── api/                     # API route handlers
│   ├── __init__.py
│   ├── highscores.py        # Highscore endpoints
│   └── rooms.py             # Room/session endpoints
│
├── services/                # Business logic layer
│   ├── __init__.py
│   ├── highscore_service.py # Highscore management
│   └── room_service.py      # Room management
│
├── models/                  # Data models
│   ├── __init__.py
│   ├── highscore.py         # Highscore model
│   └── room.py              # Room model
│
├── tests/                   # Test suite
│   ├── test_highscores.py
│   └── test_rooms.py
│
├── main.py                  # FastAPI app entry point
└── requirements.txt         # Python dependencies
```

### Application Structure

#### main.py - Application Entry Point

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import highscores, rooms

app = FastAPI(
    title="Key Dash Adventure API",
    description="Backend API for highscores and multiplayer rooms",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(highscores.router, prefix="/api/highscores", tags=["highscores"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["rooms"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### API Endpoints

#### Highscores API

```python
# api/highscores.py
from fastapi import APIRouter, HTTPException, Query
from models.highscore import Highscore, HighscoreCreate
from services.highscore_service import HighscoreService

router = APIRouter()
service = HighscoreService()

@router.get("/", response_model=list[Highscore])
async def get_highscores(limit: int = Query(10, ge=1, le=100)):
    """Retrieve top highscores."""
    return await service.get_top_scores(limit)

@router.post("/", status_code=201)
async def submit_highscore(highscore: HighscoreCreate):
    """Submit a new highscore."""
    return await service.add_score(highscore)

@router.get("/{player_name}", response_model=Highscore)
async def get_player_best(player_name: str):
    """Get a player's best score."""
    score = await service.get_player_best(player_name)
    if not score:
        raise HTTPException(status_code=404, detail="Player not found")
    return score
```

#### Rooms API

```python
# api/rooms.py
from fastapi import APIRouter, HTTPException
from models.room import Room, RoomCreate
from services.room_service import RoomService

router = APIRouter()
service = RoomService()

@router.post("/", response_model=Room, status_code=201)
async def create_room(room: RoomCreate):
    """Create a new multiplayer room."""
    return await service.create_room(room)

@router.get("/{room_id}", response_model=Room)
async def get_room(room_id: str):
    """Get room details."""
    room = await service.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.post("/{room_id}/join")
async def join_room(room_id: str, player_name: str):
    """Join an existing room."""
    return await service.add_player(room_id, player_name)
```

### Data Models (Pydantic)

```python
# models/highscore.py
from pydantic import BaseModel, Field
from datetime import datetime

class HighscoreCreate(BaseModel):
    player_name: str = Field(..., min_length=1, max_length=50)
    score: int = Field(..., ge=0)

class Highscore(BaseModel):
    id: str
    player_name: str
    score: int
    achieved_at: datetime

    class Config:
        orm_mode = True  # For future database integration
```

### Service Layer

The service layer contains business logic, separated from HTTP handling:

```python
# services/highscore_service.py
from typing import List
from models.highscore import Highscore, HighscoreCreate
from datetime import datetime
import uuid

class HighscoreService:
    def __init__(self):
        # In-memory storage (replace with database in future)
        self.scores: List[Highscore] = []

    async def get_top_scores(self, limit: int) -> List[Highscore]:
        """Get top N highscores, sorted by score descending."""
        sorted_scores = sorted(
            self.scores,
            key=lambda s: s.score,
            reverse=True
        )
        return sorted_scores[:limit]

    async def add_score(self, score_data: HighscoreCreate) -> Highscore:
        """Add a new highscore."""
        highscore = Highscore(
            id=str(uuid.uuid4()),
            player_name=score_data.player_name,
            score=score_data.score,
            achieved_at=datetime.utcnow()
        )
        self.scores.append(highscore)
        return highscore

    async def get_player_best(self, player_name: str) -> Highscore | None:
        """Get a player's best score."""
        player_scores = [
            s for s in self.scores
            if s.player_name == player_name
        ]
        if not player_scores:
            return None
        return max(player_scores, key=lambda s: s.score)
```

### Database Integration (Future)

The current implementation uses in-memory storage. To integrate a real database:

```python
# Example with SQLAlchemy (PostgreSQL)
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class HighscoreDB(Base):
    __tablename__ = "highscores"

    id = Column(String, primary_key=True)
    player_name = Column(String(50), nullable=False)
    score = Column(Integer, nullable=False)
    achieved_at = Column(DateTime, nullable=False)

# Service layer would use database session
class HighscoreService:
    def __init__(self, db_session):
        self.db = db_session

    async def get_top_scores(self, limit: int):
        return self.db.query(HighscoreDB)\
            .order_by(HighscoreDB.score.desc())\
            .limit(limit)\
            .all()
```

## Data Flow

### Submitting a Highscore

```
┌──────────────┐
│  GameOver    │
│   Scene      │
└──────┬───────┘
       │ User completes game
       │
       ▼
┌──────────────────────────────────┐
│ api.submitHighscore(score, name) │
└──────┬───────────────────────────┘
       │ HTTP POST /api/highscores
       │ { score: 1000, playerName: "Alice" }
       ▼
┌────────────────────────────┐
│  FastAPI Backend           │
│  - Validate request        │
│  - Create Highscore object │
│  - Store in database       │
│  - Return response         │
└──────┬─────────────────────┘
       │ 201 Created
       │ { id: "...", score: 1000, ... }
       ▼
┌──────────────┐
│  Frontend    │
│  Update UI   │
└──────────────┘
```

### Loading Highscores

```
┌──────────────┐
│  GameOver    │
│   Scene      │
└──────┬───────┘
       │ Scene created
       │
       ▼
┌────────────────────────┐
│ api.getHighscores(10)  │
└──────┬─────────────────┘
       │ HTTP GET /api/highscores?limit=10
       ▼
┌────────────────────────────┐
│  FastAPI Backend           │
│  - Fetch top 10 scores     │
│  - Sort by score DESC      │
│  - Return array            │
└──────┬─────────────────────┘
       │ 200 OK
       │ [{ score: 1000, ... }, ...]
       ▼
┌──────────────┐
│  Frontend    │
│  Render list │
└──────────────┘
```

## CI/CD Pipeline

### GitHub Actions Workflow

Located in `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm test
      - name: Build
        run: |
          cd frontend
          npm run build

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov
```

**Pipeline stages:**
1. **Checkout:** Pull latest code
2. **Setup:** Install Node.js and Python
3. **Install:** Install dependencies
4. **Test:** Run test suites
5. **Build:** Create production builds
6. **Deploy:** (Optional) Deploy to staging/production

## Deployment Architecture

### Frontend Deployment (Vercel)

```
Developer Push
     │
     ▼
GitHub Repository
     │
     ▼
Vercel (automatic)
     │
     ├─ Install dependencies (npm ci)
     ├─ Build (npm run build)
     ├─ Optimize assets
     └─ Deploy to CDN
          │
          ▼
    Global CDN Edge Nodes
          │
          ▼
      End Users
```

**Environment Variables:**
- `VITE_API_URL` - Backend API endpoint

### Backend Deployment (Render / PaaS)

```
Developer Push
     │
     ▼
GitHub Repository
     │
     ▼
Render / PaaS
     │
     ├─ Install dependencies (pip install)
     ├─ Start uvicorn server
     └─ Health check (/health)
          │
          ▼
   Load Balancer (if configured)
          │
          ▼
     API Consumers
```

**Environment Variables:**
- `DATABASE_URL` - Database connection string (when implemented)
- `CORS_ORIGINS` - Allowed frontend origins
- `SECRET_KEY` - For JWT or session management (future)

## Future Scalability

### Potential Enhancements

1. **Database Layer**
   - PostgreSQL for persistent storage
   - Redis for caching and session management
   - Database migrations with Alembic

2. **WebSocket Integration**
   - Real-time multiplayer with Socket.IO or FastAPI WebSockets
   - Live leaderboard updates
   - Chat functionality

3. **Microservices**
   - Separate services for highscores, rooms, user management
   - API Gateway for routing
   - Service mesh for inter-service communication

4. **Caching Strategy**
   - CDN caching for static assets
   - Redis caching for frequently accessed data
   - Browser caching with proper cache headers

5. **Authentication & Authorization**
   - JWT-based authentication
   - OAuth integration (Google, GitHub)
   - Role-based access control

6. **Monitoring & Logging**
   - Application performance monitoring (APM)
   - Error tracking (Sentry)
   - Structured logging
   - Analytics and metrics

---

This architecture is designed to be simple enough for educational purposes while being extensible for real-world production use cases.
