"""Tests for high scores endpoints."""
from fastapi.testclient import TestClient


def test_get_empty_highscores(client: TestClient) -> None:
    """Test getting high scores when none exist.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.get("/api/highscores")

    assert response.status_code == 200
    assert response.json() == []


def test_create_highscore(client: TestClient) -> None:
    """Test creating a new high score.

    Args:
        client: FastAPI test client fixture.
    """
    score_data = {
        "playerName": "Alice",
        "score": 12345
    }

    response = client.post("/api/highscores", json=score_data)

    assert response.status_code == 201

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["playerName"] == "Alice"
    assert data["data"]["score"] == 12345
    assert "id" in data["data"]
    assert "timestamp" in data["data"]


def test_get_highscores_sorted(client: TestClient) -> None:
    """Test that high scores are returned sorted by score descending.

    Args:
        client: FastAPI test client fixture.
    """
    # Add multiple scores
    scores = [
        {"playerName": "Alice", "score": 100},
        {"playerName": "Bob", "score": 500},
        {"playerName": "Charlie", "score": 300},
    ]

    for score in scores:
        client.post("/api/highscores", json=score)

    response = client.get("/api/highscores")

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 3
    assert data[0]["score"] == 500  # Bob
    assert data[0]["rank"] == 1
    assert data[1]["score"] == 300  # Charlie
    assert data[1]["rank"] == 2
    assert data[2]["score"] == 100  # Alice
    assert data[2]["rank"] == 3


def test_get_highscores_with_limit(client: TestClient) -> None:
    """Test getting high scores with limit parameter.

    Args:
        client: FastAPI test client fixture.
    """
    # Add multiple scores
    for i in range(5):
        client.post("/api/highscores", json={"playerName": f"Player{i}", "score": i * 100})

    response = client.get("/api/highscores?limit=3")

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 3


def test_get_top_score(client: TestClient) -> None:
    """Test getting the top score.

    Args:
        client: FastAPI test client fixture.
    """
    # Add multiple scores
    scores = [
        {"playerName": "Alice", "score": 100},
        {"playerName": "Bob", "score": 500},
        {"playerName": "Charlie", "score": 300},
    ]

    for score in scores:
        client.post("/api/highscores", json=score)

    response = client.get("/api/highscores/top/1")

    assert response.status_code == 200

    data = response.json()
    assert data["playerName"] == "Bob"
    assert data["score"] == 500


def test_get_top_score_empty(client: TestClient) -> None:
    """Test getting top score when no scores exist.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.get("/api/highscores/top/1")

    assert response.status_code == 404


def test_create_highscore_validation(client: TestClient) -> None:
    """Test high score validation.

    Args:
        client: FastAPI test client fixture.
    """
    # Test negative score
    response = client.post("/api/highscores", json={"playerName": "Test", "score": -1})
    assert response.status_code == 422

    # Test empty player name
    response = client.post("/api/highscores", json={"playerName": "", "score": 100})
    assert response.status_code == 422

    # Test missing fields
    response = client.post("/api/highscores", json={"playerName": "Test"})
    assert response.status_code == 422
