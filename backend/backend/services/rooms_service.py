"""Service for managing game rooms."""
import json
import os
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from ..config import settings
from ..models.rooms import Room, RoomCreate


class RoomError(Exception):
    """Custom exception for room-related errors."""
    pass


class RoomsService:
    """Service for managing game rooms with pluggable storage."""

    def __init__(self, persist: bool = True):
        """Initialize the rooms service.

        Args:
            persist: Whether to persist rooms to disk.
        """
        self.persist = persist and settings.persist_to_disk
        self._rooms: dict[str, Room] = {}
        self._load_rooms()

    def _ensure_storage_dir(self) -> None:
        """Ensure storage directory exists."""
        if self.persist:
            os.makedirs(settings.storage_dir, exist_ok=True)

    def _load_rooms(self) -> None:
        """Load rooms from disk if persistence is enabled."""
        if not self.persist:
            return

        self._ensure_storage_dir()
        if os.path.exists(settings.rooms_path):
            try:
                with open(settings.rooms_path, "r") as f:
                    data = json.load(f)
                    for item in data:
                        room = Room(**item)
                        self._rooms[room.id] = room
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading rooms: {e}")
                self._rooms = {}

    def _save_rooms(self) -> None:
        """Save rooms to disk if persistence is enabled."""
        if not self.persist:
            return

        self._ensure_storage_dir()
        try:
            data = [room.model_dump(mode="json", by_alias=True) for room in self._rooms.values()]
            with open(settings.rooms_path, "w") as f:
                json.dump(data, f, indent=2, default=str)
        except IOError as e:
            print(f"Error saving rooms: {e}")

    def create_room(self, room_create: RoomCreate) -> Room:
        """Create a new room.

        Args:
            room_create: The room data to create.

        Returns:
            The created Room object.
        """
        room = Room(
            id=str(uuid4()),
            name=room_create.name,
            max_players=room_create.max_players,
            players=[],
            created_at=datetime.now(timezone.utc),
            is_active=True
        )
        self._rooms[room.id] = room
        self._save_rooms()
        return room

    def get_rooms(self, active_only: bool = True) -> list[Room]:
        """Get all rooms.

        Args:
            active_only: If True, only return active rooms.

        Returns:
            List of rooms.
        """
        rooms = list(self._rooms.values())
        if active_only:
            rooms = [r for r in rooms if r.is_active]
        return sorted(rooms, key=lambda x: x.created_at, reverse=True)

    def get_room_by_id(self, room_id: str) -> Optional[Room]:
        """Get a specific room by ID.

        Args:
            room_id: The room ID.

        Returns:
            The Room if found, None otherwise.
        """
        return self._rooms.get(room_id)

    def join_room(self, room_id: str, player_name: str) -> Room:
        """Add a player to a room.

        Args:
            room_id: The room ID to join.
            player_name: The player's name.

        Returns:
            The updated Room object.

        Raises:
            RoomError: If room doesn't exist, is full, inactive, or player already joined.
        """
        room = self.get_room_by_id(room_id)
        if not room:
            raise RoomError(f"Room {room_id} not found")

        if not room.is_active:
            raise RoomError("Room is not active")

        if room.is_full:
            raise RoomError("Room is full")

        if player_name in room.players:
            raise RoomError("Player already in room")

        room.players.append(player_name)
        self._save_rooms()
        return room

    def leave_room(self, room_id: str, player_name: str) -> Room:
        """Remove a player from a room.

        Args:
            room_id: The room ID.
            player_name: The player's name.

        Returns:
            The updated Room object.

        Raises:
            RoomError: If room doesn't exist or player not in room.
        """
        room = self.get_room_by_id(room_id)
        if not room:
            raise RoomError(f"Room {room_id} not found")

        if player_name not in room.players:
            raise RoomError("Player not in room")

        room.players.remove(player_name)
        self._save_rooms()
        return room

    def close_room(self, room_id: str) -> Room:
        """Close a room (mark as inactive).

        Args:
            room_id: The room ID.

        Returns:
            The updated Room object.

        Raises:
            RoomError: If room doesn't exist.
        """
        room = self.get_room_by_id(room_id)
        if not room:
            raise RoomError(f"Room {room_id} not found")

        room.is_active = False
        self._save_rooms()
        return room

    def delete_room(self, room_id: str) -> bool:
        """Delete a room.

        Args:
            room_id: The room ID.

        Returns:
            True if deleted, False if not found.
        """
        if room_id in self._rooms:
            del self._rooms[room_id]
            self._save_rooms()
            return True
        return False

    def clear_all_rooms(self) -> int:
        """Clear all rooms (useful for testing).

        Returns:
            Number of rooms cleared.
        """
        count = len(self._rooms)
        self._rooms.clear()
        self._save_rooms()
        return count
