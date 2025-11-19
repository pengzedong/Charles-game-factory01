"""Configuration management for the backend API."""
import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App metadata
    app_name: str = "Key Dash Adventure API"
    app_version: str = "0.1.0"
    environment: Literal["development", "staging", "production"] = "development"

    # API settings
    api_prefix: str = "/api"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Storage settings
    persist_to_disk: bool = True
    storage_dir: str = "data"
    scores_file: str = "highscores.json"
    rooms_file: str = "rooms.json"

    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    @property
    def scores_path(self) -> str:
        """Get full path to scores storage file."""
        return os.path.join(self.storage_dir, self.scores_file)

    @property
    def rooms_path(self) -> str:
        """Get full path to rooms storage file."""
        return os.path.join(self.storage_dir, self.rooms_file)


# Global settings instance
settings = Settings()
