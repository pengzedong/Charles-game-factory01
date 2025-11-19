"""Tests for game rooms endpoints."""
from fastapi.testclient import TestClient


def test_get_empty_rooms(client: TestClient) -> None:
    """Test getting rooms when none exist.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.get("/api/rooms")

    assert response.status_code == 200
    assert response.json() == []


def test_create_room(client: TestClient) -> None:
    """Test creating a new room.

    Args:
        client: FastAPI test client fixture.
    """
    room_data = {
        "name": "Room 1",
        "max_players": 4
    }

    response = client.post("/api/rooms", json=room_data)

    assert response.status_code == 201

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["name"] == "Room 1"
    assert data["data"]["maxPlayers"] == 4
    assert "id" in data["data"]
    assert data["data"]["players"] == []
    assert data["data"]["isActive"] is True


def test_create_room_default_max_players(client: TestClient) -> None:
    """Test creating a room with default max players.

    Args:
        client: FastAPI test client fixture.
    """
    room_data = {"name": "Default Room"}

    response = client.post("/api/rooms", json=room_data)

    assert response.status_code == 201

    data = response.json()
    assert data["data"]["maxPlayers"] == 4  # Default value


def test_get_rooms(client: TestClient) -> None:
    """Test getting all rooms.

    Args:
        client: FastAPI test client fixture.
    """
    # Create multiple rooms
    room_names = ["Room 1", "Room 2", "Room 3"]
    for name in room_names:
        client.post("/api/rooms", json={"name": name})

    response = client.get("/api/rooms")

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 3


def test_get_room_by_id(client: TestClient) -> None:
    """Test getting a specific room by ID.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room
    create_response = client.post("/api/rooms", json={"name": "Test Room"})
    room_id = create_response.json()["data"]["id"]

    # Get the room
    response = client.get(f"/api/rooms/{room_id}")

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == room_id
    assert data["name"] == "Test Room"


def test_get_nonexistent_room(client: TestClient) -> None:
    """Test getting a room that doesn't exist.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.get("/api/rooms/nonexistent-id")

    assert response.status_code == 404


def test_join_room(client: TestClient) -> None:
    """Test joining a room.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room
    create_response = client.post("/api/rooms", json={"name": "Test Room", "max_players": 4})
    room_id = create_response.json()["data"]["id"]

    # Join the room
    join_data = {"playerName": "Alice"}
    response = client.post(f"/api/rooms/{room_id}/join", json=join_data)

    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "Alice" in data["data"]["players"]
    assert len(data["data"]["players"]) == 1


def test_join_room_multiple_players(client: TestClient) -> None:
    """Test multiple players joining a room.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room
    create_response = client.post("/api/rooms", json={"name": "Test Room", "max_players": 4})
    room_id = create_response.json()["data"]["id"]

    # Join with multiple players
    players = ["Alice", "Bob", "Charlie"]
    for player in players:
        response = client.post(f"/api/rooms/{room_id}/join", json={"playerName": player})
        assert response.status_code == 200

    # Check room state
    response = client.get(f"/api/rooms/{room_id}")
    data = response.json()
    assert len(data["players"]) == 3
    assert all(player in data["players"] for player in players)


def test_join_full_room(client: TestClient) -> None:
    """Test joining a room that is full.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room with max 2 players
    create_response = client.post("/api/rooms", json={"name": "Small Room", "max_players": 2})
    room_id = create_response.json()["data"]["id"]

    # Fill the room
    client.post(f"/api/rooms/{room_id}/join", json={"playerName": "Alice"})
    client.post(f"/api/rooms/{room_id}/join", json={"playerName": "Bob"})

    # Try to join when full
    response = client.post(f"/api/rooms/{room_id}/join", json={"playerName": "Charlie"})

    assert response.status_code == 400
    assert "full" in response.json()["detail"].lower()


def test_join_room_duplicate_player(client: TestClient) -> None:
    """Test that a player cannot join the same room twice.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room
    create_response = client.post("/api/rooms", json={"name": "Test Room"})
    room_id = create_response.json()["data"]["id"]

    # Join the room
    client.post(f"/api/rooms/{room_id}/join", json={"playerName": "Alice"})

    # Try to join again
    response = client.post(f"/api/rooms/{room_id}/join", json={"playerName": "Alice"})

    assert response.status_code == 400
    assert "already" in response.json()["detail"].lower()


def test_join_nonexistent_room(client: TestClient) -> None:
    """Test joining a room that doesn't exist.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.post("/api/rooms/nonexistent-id/join", json={"playerName": "Alice"})

    assert response.status_code == 400


def test_leave_room(client: TestClient) -> None:
    """Test leaving a room.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room and join
    create_response = client.post("/api/rooms", json={"name": "Test Room"})
    room_id = create_response.json()["data"]["id"]
    client.post(f"/api/rooms/{room_id}/join", json={"playerName": "Alice"})

    # Leave the room
    response = client.post(f"/api/rooms/{room_id}/leave", json={"playerName": "Alice"})

    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "Alice" not in data["data"]["players"]


def test_delete_room(client: TestClient) -> None:
    """Test deleting a room.

    Args:
        client: FastAPI test client fixture.
    """
    # Create a room
    create_response = client.post("/api/rooms", json={"name": "Test Room"})
    room_id = create_response.json()["data"]["id"]

    # Delete the room
    response = client.delete(f"/api/rooms/{room_id}")

    assert response.status_code == 200
    assert response.json()["success"] is True

    # Verify it's deleted
    get_response = client.get(f"/api/rooms/{room_id}")
    assert get_response.status_code == 404


def test_create_room_validation(client: TestClient) -> None:
    """Test room creation validation.

    Args:
        client: FastAPI test client fixture.
    """
    # Test empty name
    response = client.post("/api/rooms", json={"name": ""})
    assert response.status_code == 422

    # Test invalid max_players (too low)
    response = client.post("/api/rooms", json={"name": "Test", "max_players": 1})
    assert response.status_code == 422

    # Test invalid max_players (too high)
    response = client.post("/api/rooms", json={"name": "Test", "max_players": 20})
    assert response.status_code == 422
