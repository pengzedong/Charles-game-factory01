"""Pydantic models for high scores."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class HighScoreCreate(BaseModel):
    """Model for creating a new high score entry."""

    player_name: str = Field(..., alias="playerName", min_length=1, max_length=50)
    score: int = Field(..., ge=0)

    @field_validator("player_name")
    @classmethod
    def validate_player_name(cls, v: str) -> str:
        """Validate and clean player name."""
        return v.strip()

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "playerName": "Alice",
                "score": 12345
            }
        }
    }


class HighScore(BaseModel):
    """Model for a high score entry with metadata."""

    id: str
    player_name: str = Field(..., alias="playerName")
    score: int
    timestamp: datetime
    rank: Optional[int] = None

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "playerName": "Alice",
                "score": 12345,
                "timestamp": "2024-01-01T12:00:00Z",
                "rank": 1
            }
        }
    }


class HighScoreResponse(BaseModel):
    """Response model for high score operations."""

    success: bool
    message: str
    data: Optional[HighScore] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "High score added successfully",
                "data": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "playerName": "Alice",
                    "score": 12345,
                    "timestamp": "2024-01-01T12:00:00Z",
                    "rank": 1
                }
            }
        }
    }
