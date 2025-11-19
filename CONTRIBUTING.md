# Contributing to Key Dash Adventure

Thank you for your interest in contributing to Key Dash Adventure! This project is designed to be accessible to students, collaborators, and other instructors looking to learn or teach modern web development practices.

## Who This Project Is For

- **Students** learning game development, TypeScript, Python, or full-stack development
- **Instructors** looking for a well-structured example project for teaching
- **Developers** interested in contributing to an open-source educational game
- **Collaborators** wanting to experiment with new game mechanics or features

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Python** 3.10 or higher
- **pip** (Python package manager)
- **Git** for version control

Optional but recommended:
- **Poetry** for Python dependency management
- **Visual Studio Code** or your preferred code editor
- **Browser DevTools** knowledge for debugging

### Setting Up Your Development Environment

1. **Fork and Clone the Repository**

   ```bash
   # Fork the repository on GitHub first, then:
   git clone https://github.com/YOUR-USERNAME/key-dash-adventure.git
   cd key-dash-adventure
   ```

2. **Set Up the Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The game should now be running at `http://localhost:5173`.

3. **Set Up the Backend**

   ```bash
   cd ../backend

   # Option 1: Using pip
   pip install -r requirements.txt

   # Option 2: Using Poetry (recommended)
   poetry install

   # Start the development server
   uvicorn main:app --reload
   ```

   The API should now be running at `http://localhost:8000`.
   You can view the API documentation at `http://localhost:8000/docs`.

4. **Verify Your Setup**

   - Open the game in your browser
   - Check the browser console for errors
   - Try playing a level
   - Check that the backend API is responding

## Development Guidelines

### Code Style and Conventions

#### Frontend (TypeScript/Phaser)

- **TypeScript Style:**
  - Use TypeScript strict mode
  - Prefer `const` over `let`, avoid `var`
  - Use interfaces for object shapes
  - Add type annotations for function parameters and return types
  - Use meaningful variable names (e.g., `playerVelocity`, not `pv`)

- **Phaser Conventions:**
  - Each scene should be in its own file in `src/scenes/`
  - Game state should be managed centrally
  - Use Phaser's built-in event system for communication between components
  - Keep game logic separate from rendering logic where possible

- **File Organization:**
  - Components go in `src/components/`
  - Utilities go in `src/utils/`
  - API calls go in `src/services/api.ts`
  - Configuration in `src/config/`

**Example:**
```typescript
// Good
interface PlayerConfig {
  speed: number;
  jumpHeight: number;
}

function createPlayer(scene: Phaser.Scene, config: PlayerConfig): void {
  // Implementation
}

// Avoid
function cp(s, c) {
  // Implementation
}
```

#### Backend (Python/FastAPI)

- **Python Style:**
  - Follow PEP 8 style guide
  - Use type hints for function parameters and return values
  - Use async/await for I/O operations
  - Keep functions focused and single-purpose
  - Use docstrings for public functions and classes

- **FastAPI Conventions:**
  - Route handlers go in `api/` directory
  - Business logic goes in `services/`
  - Data models go in `models/`
  - Use Pydantic models for request/response validation
  - Include proper error handling and HTTP status codes

- **File Organization:**
  - Group related routes in the same file
  - Use dependency injection for shared resources
  - Keep database logic separate from route handlers

**Example:**
```python
# Good
from typing import List
from fastapi import HTTPException

async def get_highscores(limit: int = 10) -> List[Highscore]:
    """Retrieve top highscores from the database.

    Args:
        limit: Maximum number of scores to return

    Returns:
        List of highscore objects
    """
    if limit < 1:
        raise HTTPException(status_code=400, detail="Limit must be positive")
    return await db.fetch_highscores(limit)

# Avoid
def get_scores(l):
    return db.fetch(l)
```

### Testing Requirements

All contributions should include appropriate tests:

#### Frontend Tests

- Located in `frontend/src/**/*.test.ts`
- Use Vitest for unit tests
- Test game logic separately from Phaser rendering
- Run tests with `npm test`

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoring';

describe('calculateScore', () => {
  it('should calculate correct score with time bonus', () => {
    const result = calculateScore(100, 50, 30);
    expect(result).toBe(180);
  });
});
```

#### Backend Tests

- Located in `backend/tests/`
- Use pytest for testing
- Include unit tests and integration tests
- Run tests with `pytest`

**Example:**
```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_highscores():
    response = client.get("/api/highscores")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### Running Tests Before Submission

**Always run tests before submitting a pull request:**

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest

# For coverage report
pytest --cov
```

## Branching and Pull Request Guidelines

### Branching Strategy

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Branch naming conventions:
   - `feature/` - for new features (e.g., `feature/add-power-ups`)
   - `fix/` - for bug fixes (e.g., `fix/collision-detection`)
   - `docs/` - for documentation updates (e.g., `docs/update-readme`)
   - `refactor/` - for code refactoring (e.g., `refactor/game-state`)

2. **Make Your Changes**

   - Write clean, well-commented code
   - Follow the coding conventions above
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add feature: power-up system"
   ```

   Commit message guidelines:
   - Use the imperative mood ("Add feature" not "Added feature")
   - Be descriptive but concise
   - Reference issue numbers if applicable (e.g., "Fix #123: collision bug")

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

### Opening a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template with:
   - **Description:** What does this PR do?
   - **Motivation:** Why is this change needed?
   - **Testing:** How did you test this?
   - **Screenshots:** If applicable (for UI changes)
   - **Related Issues:** Link any related issues

**Pull Request Checklist:**
- [ ] Code follows project style guidelines
- [ ] Tests have been added/updated
- [ ] All tests pass (`npm test` and `pytest`)
- [ ] Documentation has been updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] No console errors or warnings
- [ ] Changes have been tested locally

### Code Review Process

- Maintainers will review your PR and may request changes
- Address feedback by pushing new commits to your branch
- Once approved, your PR will be merged
- Your contribution will be acknowledged in release notes

## Suggested Areas for Contribution

We welcome contributions in many areas! Here are some ideas:

### 1. New Levels and Game Mechanics

- Design new level layouts with increasing difficulty
- Create new enemy types with different behaviors
- Add power-ups (speed boost, invincibility, extra time)
- Implement special obstacles (moving platforms, teleporters)
- Add new collectibles beyond coins

**Good for:** Beginners to intermediate developers
**Files to look at:** `frontend/src/config/levels.ts`, `frontend/src/scenes/Game.ts`

### 2. Improved UI/UX

- Enhance the main menu with better graphics
- Add a level selection screen
- Implement a pause menu
- Create better visual feedback for game events
- Add particle effects for coins and enemies
- Improve mobile responsiveness

**Good for:** Frontend developers, designers
**Files to look at:** `frontend/src/scenes/Menu.ts`, `frontend/src/scenes/GameOver.ts`

### 3. Backend Persistence (Database Integration)

- Integrate PostgreSQL or MongoDB
- Implement user accounts and authentication
- Add persistent highscore storage
- Create user profiles with stats and achievements
- Implement room-based multiplayer sessions

**Good for:** Backend developers
**Files to look at:** `backend/services/`, `backend/models/`

### 4. Multiplayer Features

- Implement real-time multiplayer with WebSockets
- Add competitive modes (race to finish)
- Create cooperative gameplay
- Implement spectator mode
- Add chat functionality in multiplayer rooms

**Good for:** Advanced developers
**Files to look at:** `backend/api/rooms.py`

### 5. Visual and Audio Polish

- Create custom sprite sheets
- Add animations (character movement, coin spin)
- Implement background music
- Add sound effects (jump, coin collect, enemy hit)
- Create particle systems for visual effects

**Good for:** Artists, game designers
**Files to look at:** `frontend/public/`, `frontend/src/scenes/`

### 6. Testing and Quality Assurance

- Increase test coverage
- Add end-to-end tests
- Improve error handling
- Add performance monitoring
- Write integration tests for frontend-backend communication

**Good for:** QA engineers, developers focused on quality
**Files to look at:** `frontend/src/**/*.test.ts`, `backend/tests/`

### 7. Documentation

- Improve code comments
- Create video tutorials
- Write blog posts about the architecture
- Translate documentation to other languages
- Create diagrams and visual guides

**Good for:** Technical writers, educators
**Files to look at:** `docs/`, `README.md`, `CONTRIBUTING.md`

## Teaching Use Cases

This project is designed to be used in educational settings:

### For Instructors

- Use as a reference implementation for software engineering courses
- Assign specific features as student projects
- Demonstrate CI/CD and deployment practices
- Teach testing methodologies with real-world examples

### Suggested Assignments for Students

1. **Beginner:** Add a new level with custom layout
2. **Intermediate:** Implement a new power-up system
3. **Advanced:** Add real-time multiplayer functionality
4. **Full-stack:** Create user accounts with persistent data

### Course Project Ideas

- **Week 1-2:** Set up development environment, understand codebase
- **Week 3-4:** Implement a new game mechanic
- **Week 5-6:** Add backend persistence and testing
- **Week 7-8:** Deploy to production and present

## Getting Help

If you need help:

1. **Check the Documentation:**
   - [README.md](./README.md) - Project overview
   - [docs/architecture.md](./docs/architecture.md) - Technical details
   - [docs/future-work.md](./docs/future-work.md) - Ideas and roadmap

2. **Search Existing Issues:**
   - Someone may have already encountered your problem

3. **Ask Questions:**
   - Open a GitHub issue with the `question` label
   - Be specific about what you're trying to do
   - Include error messages and steps to reproduce

4. **Join the Community:**
   - Participate in discussions
   - Help others with their contributions
   - Share your ideas and feedback

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Recognition

All contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to Key Dash Adventure! Your efforts help make this a better learning resource for everyone.

---

**Questions?** Open an issue or reach out to the maintainers.
