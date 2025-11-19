"""Pytest configuration and fixtures."""
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.services.scores_service import ScoresService
from backend.services.rooms_service import RoomsService


@pytest.fixture
def client() -> TestClient:
    """Create a test client for the FastAPI app.

    Returns:
        TestClient instance.
    """
    return TestClient(app)


@pytest.fixture
def scores_service() -> ScoresService:
    """Create a scores service with in-memory storage for testing.

    Returns:
        ScoresService instance with persistence disabled.
    """
    service = ScoresService(persist=False)
    yield service
    # Cleanup
    service.clear_all_scores()


@pytest.fixture
def rooms_service() -> RoomsService:
    """Create a rooms service with in-memory storage for testing.

    Returns:
        RoomsService instance with persistence disabled.
    """
    service = RoomsService(persist=False)
    yield service
    # Cleanup
    service.clear_all_rooms()
