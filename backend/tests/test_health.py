"""Tests for health check endpoints."""
from fastapi.testclient import TestClient


def test_health_check(client: TestClient) -> None:
    """Test that GET /api/health returns status 200 and correct data.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "version" in data
    assert "app_name" in data
    assert data["app_name"] == "Key Dash Adventure API"


def test_root_endpoint(client: TestClient) -> None:
    """Test that the root endpoint returns welcome message.

    Args:
        client: FastAPI test client fixture.
    """
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "docs" in data
    assert "health" in data
    assert data["health"] == "/api/health"
