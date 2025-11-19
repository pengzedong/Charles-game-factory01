"""Service for managing high scores."""
import json
import os
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from ..config import settings
from ..models.scores import HighScore, HighScoreCreate


class ScoresService:
    """Service for managing high scores with pluggable storage."""

    def __init__(self, persist: bool = True):
        """Initialize the scores service.

        Args:
            persist: Whether to persist scores to disk.
        """
        self.persist = persist and settings.persist_to_disk
        self._scores: dict[str, HighScore] = {}
        self._load_scores()

    def _ensure_storage_dir(self) -> None:
        """Ensure storage directory exists."""
        if self.persist:
            os.makedirs(settings.storage_dir, exist_ok=True)

    def _load_scores(self) -> None:
        """Load scores from disk if persistence is enabled."""
        if not self.persist:
            return

        self._ensure_storage_dir()
        if os.path.exists(settings.scores_path):
            try:
                with open(settings.scores_path, "r") as f:
                    data = json.load(f)
                    for item in data:
                        score = HighScore(**item)
                        self._scores[score.id] = score
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading scores: {e}")
                self._scores = {}

    def _save_scores(self) -> None:
        """Save scores to disk if persistence is enabled."""
        if not self.persist:
            return

        self._ensure_storage_dir()
        try:
            data = [score.model_dump(mode="json", by_alias=True) for score in self._scores.values()]
            with open(settings.scores_path, "w") as f:
                json.dump(data, f, indent=2, default=str)
        except IOError as e:
            print(f"Error saving scores: {e}")

    def add_score(self, score_create: HighScoreCreate) -> HighScore:
        """Add a new high score.

        Args:
            score_create: The score data to add.

        Returns:
            The created HighScore object.
        """
        score = HighScore(
            id=str(uuid4()),
            player_name=score_create.player_name,
            score=score_create.score,
            timestamp=datetime.now(timezone.utc)
        )
        self._scores[score.id] = score
        self._save_scores()
        return score

    def get_scores(self, limit: Optional[int] = None) -> list[HighScore]:
        """Get all high scores sorted by score descending.

        Args:
            limit: Maximum number of scores to return.

        Returns:
            List of high scores with ranks assigned.
        """
        sorted_scores = sorted(
            self._scores.values(),
            key=lambda x: (-x.score, x.timestamp)
        )

        # Assign ranks
        for rank, score in enumerate(sorted_scores, start=1):
            score.rank = rank

        if limit:
            return sorted_scores[:limit]
        return sorted_scores

    def get_score_by_id(self, score_id: str) -> Optional[HighScore]:
        """Get a specific score by ID.

        Args:
            score_id: The score ID.

        Returns:
            The HighScore if found, None otherwise.
        """
        return self._scores.get(score_id)

    def get_top_score(self) -> Optional[HighScore]:
        """Get the highest score.

        Returns:
            The top HighScore if any exist, None otherwise.
        """
        scores = self.get_scores(limit=1)
        return scores[0] if scores else None

    def clear_all_scores(self) -> int:
        """Clear all scores (useful for testing).

        Returns:
            Number of scores cleared.
        """
        count = len(self._scores)
        self._scores.clear()
        self._save_scores()
        return count
