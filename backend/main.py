"""
Main FastAPI application for Key Dash Adventure backend
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import uuid

app = FastAPI(title="Key Dash Adventure API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory data stores (replace with database in production)
scores_db: List[Dict] = []
rooms_db: Dict[str, Dict] = {}


# Models
class ScoreCreate(BaseModel):
    player_name: str
    score: int
    level: int


class Score(ScoreCreate):
    id: str
    timestamp: str


class RoomCreate(BaseModel):
    room_name: str
    max_players: int = 4


class Room(BaseModel):
    id: str
    room_name: str
    max_players: int
    players: List[str]
    created_at: str
    status: str  # 'waiting', 'playing', 'finished'


class PlayerJoin(BaseModel):
    player_name: str


# Health endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


# Score endpoints
@app.post("/api/scores", response_model=Score)
async def create_score(score_data: ScoreCreate):
    """Create a new score entry"""
    score = {
        "id": str(uuid.uuid4()),
        "player_name": score_data.player_name,
        "score": score_data.score,
        "level": score_data.level,
        "timestamp": datetime.utcnow().isoformat()
    }
    scores_db.append(score)
    return score


@app.get("/api/scores", response_model=List[Score])
async def get_scores(limit: int = 10):
    """Get top scores, sorted by score descending"""
    sorted_scores = sorted(scores_db, key=lambda x: x["score"], reverse=True)
    return sorted_scores[:limit]


@app.delete("/api/scores")
async def clear_scores():
    """Clear all scores (for testing)"""
    scores_db.clear()
    return {"message": "All scores cleared"}


# Room endpoints
@app.post("/api/rooms", response_model=Room)
async def create_room(room_data: RoomCreate):
    """Create a new multiplayer room"""
    room_id = str(uuid.uuid4())
    room = {
        "id": room_id,
        "room_name": room_data.room_name,
        "max_players": room_data.max_players,
        "players": [],
        "created_at": datetime.utcnow().isoformat(),
        "status": "waiting"
    }
    rooms_db[room_id] = room
    return room


@app.get("/api/rooms", response_model=List[Room])
async def get_rooms():
    """Get all available rooms"""
    return list(rooms_db.values())


@app.get("/api/rooms/{room_id}", response_model=Room)
async def get_room(room_id: str):
    """Get a specific room by ID"""
    if room_id not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")
    return rooms_db[room_id]


@app.post("/api/rooms/{room_id}/join", response_model=Room)
async def join_room(room_id: str, player_data: PlayerJoin):
    """Join a multiplayer room"""
    if room_id not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")

    room = rooms_db[room_id]

    if len(room["players"]) >= room["max_players"]:
        raise HTTPException(status_code=400, detail="Room is full")

    if player_data.player_name in room["players"]:
        raise HTTPException(status_code=400, detail="Player already in room")

    room["players"].append(player_data.player_name)

    # Update room status if full
    if len(room["players"]) >= room["max_players"]:
        room["status"] = "playing"

    return room


@app.delete("/api/rooms/{room_id}")
async def delete_room(room_id: str):
    """Delete a room"""
    if room_id not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")

    del rooms_db[room_id]
    return {"message": "Room deleted"}


@app.delete("/api/rooms")
async def clear_rooms():
    """Clear all rooms (for testing)"""
    rooms_db.clear()
    return {"message": "All rooms cleared"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
