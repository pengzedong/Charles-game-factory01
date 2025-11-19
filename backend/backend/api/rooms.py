"""Game rooms endpoints."""
from fastapi import APIRouter, HTTPException, Query

from ..models.rooms import Room, RoomCreate, RoomJoin, RoomResponse
from ..services.rooms_service import RoomsService, RoomError

router = APIRouter(prefix="/rooms", tags=["rooms"])

# Initialize the rooms service
rooms_service = RoomsService()


@router.get("", response_model=list[Room])
async def get_rooms(
    active_only: bool = Query(default=True, description="Only return active rooms")
) -> list[Room]:
    """Get all game rooms.

    Args:
        active_only: If True, only return active rooms (default: True).

    Returns:
        List of rooms.
    """
    return rooms_service.get_rooms(active_only=active_only)


@router.post("", response_model=RoomResponse, status_code=201)
async def create_room(room_create: RoomCreate) -> RoomResponse:
    """Create a new game room.

    Args:
        room_create: The room data including name and max players.

    Returns:
        Response containing the created room.
    """
    try:
        room = rooms_service.create_room(room_create)
        return RoomResponse(
            success=True,
            message="Room created successfully",
            data=room
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating room: {str(e)}")


@router.get("/{room_id}", response_model=Room)
async def get_room(room_id: str) -> Room:
    """Get a specific room by ID.

    Args:
        room_id: The room ID.

    Returns:
        The room data.

    Raises:
        HTTPException: If room not found.
    """
    room = rooms_service.get_room_by_id(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.post("/{room_id}/join", response_model=RoomResponse)
async def join_room(room_id: str, join_data: RoomJoin) -> RoomResponse:
    """Join a game room.

    Args:
        room_id: The room ID to join.
        join_data: Player information including name.

    Returns:
        Response containing the updated room.

    Raises:
        HTTPException: If room is full, inactive, not found, or player already joined.
    """
    try:
        room = rooms_service.join_room(room_id, join_data.player_name)
        return RoomResponse(
            success=True,
            message=f"Player {join_data.player_name} joined room successfully",
            data=room
        )
    except RoomError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error joining room: {str(e)}")


@router.post("/{room_id}/leave", response_model=RoomResponse)
async def leave_room(room_id: str, leave_data: RoomJoin) -> RoomResponse:
    """Leave a game room.

    Args:
        room_id: The room ID to leave.
        leave_data: Player information including name.

    Returns:
        Response containing the updated room.

    Raises:
        HTTPException: If room not found or player not in room.
    """
    try:
        room = rooms_service.leave_room(room_id, leave_data.player_name)
        return RoomResponse(
            success=True,
            message=f"Player {leave_data.player_name} left room successfully",
            data=room
        )
    except RoomError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leaving room: {str(e)}")


@router.delete("/{room_id}", response_model=RoomResponse)
async def delete_room(room_id: str) -> RoomResponse:
    """Delete a room.

    Args:
        room_id: The room ID to delete.

    Returns:
        Response confirming deletion.

    Raises:
        HTTPException: If room not found.
    """
    deleted = rooms_service.delete_room(room_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Room not found")

    return RoomResponse(
        success=True,
        message="Room deleted successfully",
        data=None
    )
