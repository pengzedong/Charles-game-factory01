"""High scores endpoints."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from ..models.scores import HighScore, HighScoreCreate, HighScoreResponse
from ..services.scores_service import ScoresService

router = APIRouter(prefix="/highscores", tags=["scores"])

# Initialize the scores service
scores_service = ScoresService()


@router.get("", response_model=list[HighScore])
async def get_highscores(
    limit: Optional[int] = Query(default=10, ge=1, le=100, description="Maximum number of scores to return")
) -> list[HighScore]:
    """Get high scores sorted by score descending.

    Args:
        limit: Maximum number of scores to return (default: 10, max: 100).

    Returns:
        List of high scores with rankings.
    """
    return scores_service.get_scores(limit=limit)


@router.post("", response_model=HighScoreResponse, status_code=201)
async def create_highscore(score_create: HighScoreCreate) -> HighScoreResponse:
    """Add a new high score.

    Args:
        score_create: The score data including player name and score value.

    Returns:
        Response containing the created high score entry.
    """
    try:
        score = scores_service.add_score(score_create)
        return HighScoreResponse(
            success=True,
            message="High score added successfully",
            data=score
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding score: {str(e)}")


@router.get("/{score_id}", response_model=HighScore)
async def get_highscore(score_id: str) -> HighScore:
    """Get a specific high score by ID.

    Args:
        score_id: The score ID.

    Returns:
        The high score entry.

    Raises:
        HTTPException: If score not found.
    """
    score = scores_service.get_score_by_id(score_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score


@router.get("/top/1", response_model=HighScore)
async def get_top_score() -> HighScore:
    """Get the highest score.

    Returns:
        The top high score entry.

    Raises:
        HTTPException: If no scores exist.
    """
    score = scores_service.get_top_score()
    if not score:
        raise HTTPException(status_code=404, detail="No scores found")
    return score
