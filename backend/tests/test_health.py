"""
Tests for health check endpoint
"""
import pytest
from fastapi.testclient import TestClient


def test_health_check_returns_200(client: TestClient):
    """Test that health endpoint returns status 200"""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_check_returns_json(client: TestClient):
    """Test that health endpoint returns JSON response"""
    response = client.get("/health")
    assert response.headers["content-type"] == "application/json"


def test_health_check_has_status_ok(client: TestClient):
    """Test that health endpoint returns status: ok"""
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"


def test_health_check_has_timestamp(client: TestClient):
    """Test that health endpoint includes a timestamp"""
    response = client.get("/health")
    data = response.json()
    assert "timestamp" in data
    assert isinstance(data["timestamp"], str)
    assert len(data["timestamp"]) > 0


def test_health_check_response_structure(client: TestClient):
    """Test the complete response structure of health endpoint"""
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()
    assert "status" in data
    assert "timestamp" in data
    assert data["status"] == "ok"
