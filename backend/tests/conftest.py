"""
Pytest configuration and fixtures for backend tests
"""
import pytest
from fastapi.testclient import TestClient
from main import app, scores_db, rooms_db


@pytest.fixture
def client():
    """
    Create a test client for the FastAPI application
    This fixture is automatically available to all tests
    """
    return TestClient(app)


@pytest.fixture(autouse=True)
def clear_data():
    """
    Automatically clear in-memory databases before each test
    This ensures tests are isolated and don't affect each other
    """
    scores_db.clear()
    rooms_db.clear()
    yield
    # Cleanup after test
    scores_db.clear()
    rooms_db.clear()


@pytest.fixture
def sample_score():
    """
    Provide sample score data for testing
    """
    return {
        "player_name": "TestPlayer",
        "score": 1000,
        "level": 5
    }


@pytest.fixture
def sample_room():
    """
    Provide sample room data for testing
    """
    return {
        "room_name": "Test Room",
        "max_players": 4
    }
