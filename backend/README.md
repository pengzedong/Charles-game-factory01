# Key Dash Adventure - Backend API

A FastAPI-based backend server for the Key Dash Adventure game, providing high score tracking and multiplayer room management.

## Features

- **Health Checks**: Monitor API status and version
- **High Score Management**: Track and retrieve player scores
- **Room-Based Sessions**: Support for multiplayer game rooms
- **Clean Architecture**: Separation of concerns with models, services, and API layers
- **Flexible Storage**: In-memory or file-based storage (easily swappable for database)
- **Comprehensive Testing**: Full test coverage with pytest

## Project Structure

```
backend/
├── pyproject.toml          # Poetry dependencies and project metadata
├── README.md               # This file
├── backend/
│   ├── __init__.py
│   ├── main.py            # FastAPI application entry point
│   ├── config.py          # Configuration management
│   ├── models/            # Pydantic data models
│   │   ├── scores.py      # High score models
│   │   └── rooms.py       # Room models
│   ├── services/          # Business logic layer
│   │   ├── scores_service.py
│   │   └── rooms_service.py
│   └── api/               # API route handlers
│       ├── health.py      # Health check endpoints
│       ├── scores.py      # High score endpoints
│       └── rooms.py       # Room endpoints
└── tests/                 # Test suite
    ├── conftest.py        # Pytest fixtures
    ├── test_health.py
    ├── test_scores.py
    └── test_rooms.py
```

## Prerequisites

- Python 3.9 or higher
- Poetry (recommended) or pip

## Installation

### Using Poetry (Recommended)

1. Install Poetry if you haven't already:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
cd backend
poetry install
```

### Using pip

```bash
cd backend
pip install -e .
```

## Running the Application

### Development Mode (with auto-reload)

Using Poetry:
```bash
poetry run uvicorn backend.main:app --reload
```

Or activate the virtual environment first:
```bash
poetry shell
uvicorn backend.main:app --reload
```

Using pip:
```bash
python -m uvicorn backend.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

### Production Mode

```bash
poetry run uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## Configuration

The application can be configured via environment variables. Create a `.env` file in the `backend/` directory:

```env
# App settings
APP_NAME=Key Dash Adventure API
APP_VERSION=0.1.0
ENVIRONMENT=development

# API settings
API_PREFIX=/api
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Storage settings
PERSIST_TO_DISK=true
STORAGE_DIR=data
SCORES_FILE=highscores.json
ROOMS_FILE=rooms.json

# Server settings
HOST=0.0.0.0
PORT=8000
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### High Scores
- `GET /api/highscores` - Get all high scores (sorted by score)
  - Query params: `limit` (default: 10, max: 100)
- `POST /api/highscores` - Add a new high score
  - Body: `{"playerName": "Alice", "score": 12345}`
- `GET /api/highscores/{score_id}` - Get a specific score
- `GET /api/highscores/top/1` - Get the top score

### Rooms
- `GET /api/rooms` - Get all rooms
  - Query params: `active_only` (default: true)
- `POST /api/rooms` - Create a new room
  - Body: `{"name": "Room 1", "max_players": 4}`
- `GET /api/rooms/{room_id}` - Get a specific room
- `POST /api/rooms/{room_id}/join` - Join a room
  - Body: `{"playerName": "Bob"}`
- `POST /api/rooms/{room_id}/leave` - Leave a room
  - Body: `{"playerName": "Bob"}`
- `DELETE /api/rooms/{room_id}` - Delete a room

## Running Tests

Run all tests:
```bash
poetry run pytest
```

Run with coverage:
```bash
poetry run pytest --cov=backend --cov-report=html
```

Run specific test file:
```bash
poetry run pytest tests/test_health.py
```

Run with verbose output:
```bash
poetry run pytest -v
```

## Development

### Code Style

This project follows Python best practices:
- Type hints for better code clarity
- Pydantic models for data validation
- Clean separation of concerns
- Comprehensive docstrings

### Adding New Endpoints

1. Create models in `backend/models/`
2. Implement business logic in `backend/services/`
3. Add route handlers in `backend/api/`
4. Include router in `backend/main.py`
5. Write tests in `tests/`

### Storage Layer

The current implementation uses in-memory storage with optional file persistence. To replace with a database:

1. Create a new service class implementing the same interface
2. Update the service initialization in API route handlers
3. No changes needed to models or API layers

Example database integration:
```python
# backend/services/db_scores_service.py
class DBScoresService:
    def __init__(self, db_connection):
        self.db = db_connection

    async def add_score(self, score_create: HighScoreCreate) -> HighScore:
        # Database implementation
        pass
```

## Deployment

### Render/Heroku/Railway

1. Set environment variables in the platform dashboard
2. Use the following start command:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

### Docker

Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev

COPY . .

CMD ["poetry", "run", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t key-dash-backend .
docker run -p 8000:8000 key-dash-backend
```

## Troubleshooting

### Port already in use
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Poetry not found
```bash
# Add Poetry to PATH (Linux/Mac)
export PATH="$HOME/.local/bin:$PATH"
```

### Import errors
Make sure you're in the correct directory and have activated the virtual environment:
```bash
poetry shell
# or
source $(poetry env info --path)/bin/activate
```

## License

See the main project LICENSE file.
