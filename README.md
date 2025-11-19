# Key Dash Adventure

A small HTML5 game built for teaching and demonstration purposes, showcasing modern web development practices with a fun, interactive gameplay experience.

## Overview

**Key Dash Adventure** is a browser-based action game where players navigate through challenging levels, collect coins, avoid enemies, and race against time. This project serves as an educational resource for learning:

- Frontend game development with **Phaser** and **TypeScript**
- Backend API development with **FastAPI**
- Modern deployment practices (Vercel for frontend, PaaS for backend)
- CI/CD workflows with GitHub Actions
- Monorepo project structure

### Tech Stack

**Frontend:**
- Vite + TypeScript
- Phaser 3 game framework
- Deployed on Vercel

**Backend:**
- FastAPI (Python)
- RESTful API for highscores and multiplayer rooms
- Can be deployed on Render or similar PaaS platforms

## Monorepo Structure

```
key-dash-adventure/
├── frontend/           # Phaser game (Vite + TypeScript)
│   ├── src/
│   │   ├── scenes/    # Game scenes (Boot, Menu, Game, GameOver)
│   │   ├── services/  # API client and utilities
│   │   └── config/    # Game configuration and level data
│   ├── public/        # Static assets (sprites, sounds)
│   └── dist/          # Build output
│
├── backend/           # FastAPI service
│   ├── api/          # Route handlers
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   └── tests/        # Backend test suite
│
├── docs/             # Additional documentation
│   ├── architecture.md   # Technical architecture details
│   └── future-work.md    # Enhancement ideas and roadmap
│
├── .github/
│   └── workflows/    # CI/CD pipeline definitions
│
├── README.md         # This file
└── CONTRIBUTING.md   # Contribution guidelines
```

## Quick Start for Developers

### Prerequisites

- **Node.js** (v18+ recommended) and npm
- **Python** 3.10+
- **Git**

### Clone the Repository

```bash
git clone https://github.com/yourusername/key-dash-adventure.git
cd key-dash-adventure
```

### Running the Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

The game will be available at `http://localhost:5173` (or the port Vite assigns).

**Frontend Commands:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run frontend tests

### Running the Backend Locally

**Option 1: Using pip**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Option 2: Using Poetry** (if configured)

```bash
cd backend
poetry install
poetry run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

**Backend Commands:**
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run backend test suite
- `pytest --cov` - Run tests with coverage report

### Running Tests

**Frontend tests:**
```bash
cd frontend
npm test
```

**Backend tests:**
```bash
cd backend
pytest
```

## Deployment

### 🚀 One-Click Deployment to Vercel (Recommended)

**Both frontend AND backend deploy together on Vercel!** No need for separate services.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Quick Deploy Steps:

1. **Push to GitHub** (if not already done)
2. **Go to [vercel.com/new](https://vercel.com/new)**
3. **Import your repository**
4. **Click Deploy** - That's it!

Vercel will automatically:
- ✅ Build the frontend (Vite + Phaser)
- ✅ Deploy backend as serverless functions (FastAPI)
- ✅ Set up HTTPS with custom domain
- ✅ Configure global CDN
- ✅ Enable automatic deployments on push

**Your game will be live at:** `https://your-project.vercel.app`

**API endpoints will be at:** `https://your-project.vercel.app/api/*`

#### Why Vercel for Everything?

- Single platform for frontend + backend
- No CORS issues (same domain)
- Automatic HTTPS and CDN
- Generous free tier
- Zero configuration needed

📖 **Detailed deployment guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete instructions, troubleshooting, and advanced configuration.

## Features

### Current Gameplay Features
- Multiple challenging levels with increasing difficulty
- Coin collection and scoring system
- Enemy AI with patrol patterns
- Time-based challenges
- Highscore tracking (via backend API)
- Multiplayer room support (backend infrastructure)

### Technical Features
- Responsive game design
- RESTful API for persistent data
- Automated testing (frontend & backend)
- CI/CD pipeline with GitHub Actions
- Type-safe development with TypeScript
- Modern Python with FastAPI async patterns

## Learning Objectives

This project is designed to teach:

1. **Game Development:** Phaser framework, game loops, sprites, collision detection
2. **Full-Stack Development:** Connecting frontend UI to backend APIs
3. **Modern JavaScript/TypeScript:** ES6+, async/await, modules, type safety
4. **Backend Development:** REST APIs, request validation, error handling
5. **DevOps:** CI/CD, automated testing, deployment strategies
6. **Project Structure:** Monorepo organization, separation of concerns

## Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute to this project
- [docs/architecture.md](./docs/architecture.md) - Technical architecture details
- [docs/future-work.md](./docs/future-work.md) - Roadmap and enhancement ideas

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built with:
- [Phaser 3](https://phaser.io/) - Game framework
- [Vite](https://vitejs.dev/) - Frontend build tool
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check the [CONTRIBUTING.md](./CONTRIBUTING.md) guide
- Review the [docs/](./docs/) directory for technical details

---

**Happy coding and have fun playing!** 🎮
