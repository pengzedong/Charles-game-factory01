"""
Tests for multiplayer room endpoints
"""
import pytest
from fastapi.testclient import TestClient


def test_create_room(client: TestClient, sample_room):
    """Test creating a new room"""
    response = client.post("/api/rooms", json=sample_room)

    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert data["room_name"] == sample_room["room_name"]
    assert data["max_players"] == sample_room["max_players"]
    assert data["players"] == []
    assert data["status"] == "waiting"
    assert "created_at" in data


def test_get_rooms_empty(client: TestClient):
    """Test getting rooms when none exist"""
    response = client.get("/api/rooms")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_rooms(client: TestClient, sample_room):
    """Test getting all rooms"""
    # Create some rooms
    client.post("/api/rooms", json=sample_room)
    client.post("/api/rooms", json={"room_name": "Room 2", "max_players": 2})

    response = client.get("/api/rooms")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_room_by_id(client: TestClient, sample_room):
    """Test getting a specific room by ID"""
    # Create a room
    create_response = client.post("/api/rooms", json=sample_room)
    room_id = create_response.json()["id"]

    # Get the room
    response = client.get(f"/api/rooms/{room_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == room_id
    assert data["room_name"] == sample_room["room_name"]


def test_get_nonexistent_room(client: TestClient):
    """Test getting a room that doesn't exist"""
    response = client.get("/api/rooms/nonexistent-id")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_join_room(client: TestClient, sample_room):
    """Test joining a room"""
    # Create a room
    create_response = client.post("/api/rooms", json=sample_room)
    room_id = create_response.json()["id"]

    # Join the room
    player_data = {"player_name": "Player1"}
    response = client.post(f"/api/rooms/{room_id}/join", json=player_data)

    assert response.status_code == 200
    data = response.json()
    assert "Player1" in data["players"]
    assert len(data["players"]) == 1


def test_join_room_multiple_players(client: TestClient, sample_room):
    """Test multiple players joining a room"""
    # Create a room
    create_response = client.post("/api/rooms", json=sample_room)
    room_id = create_response.json()["id"]

    # Multiple players join
    players = ["Player1", "Player2", "Player3"]
    for player_name in players:
        player_data = {"player_name": player_name}
        response = client.post(f"/api/rooms/{room_id}/join", json=player_data)
        assert response.status_code == 200

    # Verify all players are in the room
    response = client.get(f"/api/rooms/{room_id}")
    data = response.json()
    assert len(data["players"]) == 3
    for player in players:
        assert player in data["players"]


def test_join_full_room(client: TestClient):
    """Test that joining a full room fails"""
    # Create a room with max 2 players
    room_data = {"room_name": "Small Room", "max_players": 2}
    create_response = client.post("/api/rooms", json=room_data)
    room_id = create_response.json()["id"]

    # Fill the room
    client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player1"})
    client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player2"})

    # Try to join full room
    response = client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player3"})

    assert response.status_code == 400
    assert "full" in response.json()["detail"].lower()


def test_join_room_duplicate_player(client: TestClient, sample_room):
    """Test that the same player cannot join twice"""
    # Create a room
    create_response = client.post("/api/rooms", json=sample_room)
    room_id = create_response.json()["id"]

    # Join once
    player_data = {"player_name": "Player1"}
    response = client.post(f"/api/rooms/{room_id}/join", json=player_data)
    assert response.status_code == 200

    # Try to join again
    response = client.post(f"/api/rooms/{room_id}/join", json=player_data)

    assert response.status_code == 400
    assert "already" in response.json()["detail"].lower()


def test_room_status_changes_when_full(client: TestClient):
    """Test that room status changes to 'playing' when full"""
    # Create a room with max 2 players
    room_data = {"room_name": "Small Room", "max_players": 2}
    create_response = client.post("/api/rooms", json=room_data)
    room_id = create_response.json()["id"]

    # Initially status should be 'waiting'
    response = client.get(f"/api/rooms/{room_id}")
    assert response.json()["status"] == "waiting"

    # Add first player
    client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player1"})
    response = client.get(f"/api/rooms/{room_id}")
    assert response.json()["status"] == "waiting"

    # Add second player (room becomes full)
    client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player2"})
    response = client.get(f"/api/rooms/{room_id}")
    assert response.json()["status"] == "playing"


def test_join_nonexistent_room(client: TestClient):
    """Test joining a room that doesn't exist"""
    response = client.post("/api/rooms/nonexistent-id/join", json={"player_name": "Player1"})

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_delete_room(client: TestClient, sample_room):
    """Test deleting a room"""
    # Create a room
    create_response = client.post("/api/rooms", json=sample_room)
    room_id = create_response.json()["id"]

    # Delete the room
    response = client.delete(f"/api/rooms/{room_id}")
    assert response.status_code == 200

    # Verify room is deleted
    response = client.get(f"/api/rooms/{room_id}")
    assert response.status_code == 404


def test_clear_rooms(client: TestClient, sample_room):
    """Test clearing all rooms"""
    # Create some rooms
    client.post("/api/rooms", json=sample_room)
    client.post("/api/rooms", json=sample_room)

    # Verify rooms exist
    response = client.get("/api/rooms")
    assert len(response.json()) == 2

    # Clear rooms
    response = client.delete("/api/rooms")
    assert response.status_code == 200

    # Verify rooms are cleared
    response = client.get("/api/rooms")
    assert len(response.json()) == 0


def test_room_state_consistency(client: TestClient, sample_room):
    """Test that room state remains consistent through operations"""
    # Create a room
    create_response = client.post("/api/rooms", json=sample_room)
    room_id = create_response.json()["id"]

    # Add players
    client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player1"})
    client.post(f"/api/rooms/{room_id}/join", json={"player_name": "Player2"})

    # Get room state
    response = client.get(f"/api/rooms/{room_id}")
    room_data = response.json()

    # Verify consistency
    assert room_data["id"] == room_id
    assert room_data["room_name"] == sample_room["room_name"]
    assert len(room_data["players"]) == 2
    assert "Player1" in room_data["players"]
    assert "Player2" in room_data["players"]
    assert room_data["max_players"] == sample_room["max_players"]

    # State should be consistent in list view too
    response = client.get("/api/rooms")
    all_rooms = response.json()
    matching_room = next(r for r in all_rooms if r["id"] == room_id)
    assert matching_room == room_data
