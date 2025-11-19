"""
Tests for score endpoints
"""
import pytest
from fastapi.testclient import TestClient


def test_create_score(client: TestClient, sample_score):
    """Test creating a new score"""
    response = client.post("/api/scores", json=sample_score)

    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert "timestamp" in data
    assert data["player_name"] == sample_score["player_name"]
    assert data["score"] == sample_score["score"]
    assert data["level"] == sample_score["level"]


def test_create_multiple_scores(client: TestClient):
    """Test creating multiple scores"""
    scores = [
        {"player_name": "Player1", "score": 500, "level": 3},
        {"player_name": "Player2", "score": 1000, "level": 5},
        {"player_name": "Player3", "score": 750, "level": 4}
    ]

    for score_data in scores:
        response = client.post("/api/scores", json=score_data)
        assert response.status_code == 200


def test_get_scores_empty(client: TestClient):
    """Test getting scores when none exist"""
    response = client.get("/api/scores")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_scores_returns_list(client: TestClient, sample_score):
    """Test that GET scores returns a list"""
    # Create a score first
    client.post("/api/scores", json=sample_score)

    response = client.get("/api/scores")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_scores_sorted_descending(client: TestClient):
    """Test that scores are sorted by score in descending order"""
    scores = [
        {"player_name": "Player1", "score": 500, "level": 3},
        {"player_name": "Player2", "score": 1500, "level": 7},
        {"player_name": "Player3", "score": 1000, "level": 5},
        {"player_name": "Player4", "score": 2000, "level": 10},
        {"player_name": "Player5", "score": 750, "level": 4}
    ]

    # Create all scores
    for score_data in scores:
        client.post("/api/scores", json=score_data)

    # Get scores
    response = client.get("/api/scores")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 5

    # Verify they are sorted in descending order
    assert data[0]["score"] == 2000
    assert data[1]["score"] == 1500
    assert data[2]["score"] == 1000
    assert data[3]["score"] == 750
    assert data[4]["score"] == 500

    # Verify the order is strictly descending
    for i in range(len(data) - 1):
        assert data[i]["score"] >= data[i + 1]["score"]


def test_get_scores_with_limit(client: TestClient):
    """Test that limit parameter works correctly"""
    # Create 15 scores
    for i in range(15):
        score_data = {
            "player_name": f"Player{i}",
            "score": (i + 1) * 100,
            "level": i + 1
        }
        client.post("/api/scores", json=score_data)

    # Get top 5 scores
    response = client.get("/api/scores?limit=5")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 5

    # Default limit is 10
    response = client.get("/api/scores")
    data = response.json()
    assert len(data) == 10


def test_score_has_required_fields(client: TestClient, sample_score):
    """Test that created score has all required fields"""
    response = client.post("/api/scores", json=sample_score)
    data = response.json()

    required_fields = ["id", "player_name", "score", "level", "timestamp"]
    for field in required_fields:
        assert field in data


def test_score_validation(client: TestClient):
    """Test that score validation works"""
    # Missing required field
    invalid_score = {
        "player_name": "TestPlayer",
        "score": 1000
        # Missing 'level'
    }

    response = client.post("/api/scores", json=invalid_score)
    assert response.status_code == 422  # Validation error


def test_clear_scores(client: TestClient, sample_score):
    """Test clearing all scores"""
    # Create some scores
    client.post("/api/scores", json=sample_score)
    client.post("/api/scores", json=sample_score)

    # Verify scores exist
    response = client.get("/api/scores")
    assert len(response.json()) == 2

    # Clear scores
    response = client.delete("/api/scores")
    assert response.status_code == 200

    # Verify scores are cleared
    response = client.get("/api/scores")
    assert len(response.json()) == 0
