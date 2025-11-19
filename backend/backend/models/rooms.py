"""Pydantic models for game rooms."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class RoomCreate(BaseModel):
    """Model for creating a new room."""

    name: str = Field(..., min_length=1, max_length=100)
    max_players: int = Field(default=4, ge=2, le=10)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate and clean room name."""
        return v.strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Room 1",
                "max_players": 4
            }
        }
    }


class RoomJoin(BaseModel):
    """Model for joining a room."""

    player_name: str = Field(..., alias="playerName", min_length=1, max_length=50)

    @field_validator("player_name")
    @classmethod
    def validate_player_name(cls, v: str) -> str:
        """Validate and clean player name."""
        return v.strip()

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "playerName": "Bob"
            }
        }
    }


class Room(BaseModel):
    """Model for a game room."""

    id: str
    name: str
    max_players: int = Field(alias="maxPlayers")
    players: list[str] = Field(default_factory=list)
    created_at: datetime = Field(alias="createdAt")
    is_active: bool = Field(default=True, alias="isActive")

    @property
    def player_count(self) -> int:
        """Get current player count."""
        return len(self.players)

    @property
    def is_full(self) -> bool:
        """Check if room is full."""
        return self.player_count >= self.max_players

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "Room 1",
                "maxPlayers": 4,
                "players": ["Alice", "Bob"],
                "createdAt": "2024-01-01T12:00:00Z",
                "isActive": True
            }
        }
    }


class RoomResponse(BaseModel):
    """Response model for room operations."""

    success: bool
    message: str
    data: Optional[Room] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "Room created successfully",
                "data": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "Room 1",
                    "maxPlayers": 4,
                    "players": [],
                    "createdAt": "2024-01-01T12:00:00Z",
                    "isActive": True
                }
            }
        }
    }
