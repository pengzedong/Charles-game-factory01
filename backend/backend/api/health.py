"""Health check endpoints."""
from fastapi import APIRouter
from pydantic import BaseModel

from ..config import settings

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    version: str
    app_name: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "ok",
                "version": "0.1.0",
                "app_name": "Key Dash Adventure API"
            }
        }
    }


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Check API health status.

    Returns:
        Health status information.
    """
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        app_name=settings.app_name
    )
