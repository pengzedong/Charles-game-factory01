# Key Dash Adventure - Frontend

A fast-paced HTML5 mini game built with Phaser 3, TypeScript, and Vite.

## Overview

**Key Dash Adventure** is a browser-based arcade game where players control a character avoiding falling obstacles while collecting coins. The game features progressive difficulty levels, a high score system with localStorage persistence, and smooth gameplay mechanics.

## Tech Stack

- **Framework**: [Phaser 3](https://phaser.io/) - HTML5 game framework
- **Language**: TypeScript
- **Build Tool**: Vite
- **Deployment**: Static site (Vercel-ready)

## Features

- **Responsive Controls**: Arrow keys or WASD movement
- **Progressive Difficulty**: 8+ levels with increasing challenge
- **Score System**: Real-time scoring with persistent high scores
- **Pause Functionality**: Press P or ESC to pause/resume
- **Sound Effects**: Coin collection, collisions, and game events
- **Clean Architecture**: Modular, maintainable codebase
- **Future-Ready**: API service layer prepared for backend integration

## Project Structure

```
frontend/
├── public/
│   └── assets/          # Game assets (images, audio)
├── src/
│   ├── config/          # Level configurations
│   ├── core/            # Game state and event system
│   ├── objects/         # Game entities (Player, Obstacle, Coin)
│   ├── scenes/          # Phaser scenes (Boot, Menu, Game, GameOver)
│   ├── services/        # API service stubs
│   ├── ui/              # HUD and UI components
│   └── main.ts          # Game initialization
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The game will be available at `http://localhost:3000`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment on Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

### Option 3: vercel.json Configuration

Create a `vercel.json` in the repository root:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install"
}
```

## Gameplay

### Objective
Survive as long as possible while collecting coins and avoiding obstacles.

### Controls
- **Movement**: Arrow Keys or WASD
- **Pause**: P or ESC
- **Start/Restart**: ENTER
- **Menu**: M (from Game Over screen)

### Scoring
- Each coin collected: +10 points
- Score determines level progression
- High scores are saved automatically

### Levels
The game features 8 predefined levels with escalating difficulty:
- Faster obstacle speeds
- More frequent spawns
- Higher spawn probabilities
- Reduced coin availability

## Architecture Highlights

### State Management
- **GameState.ts**: Centralized singleton for game state
- **Events.ts**: Event bus for decoupled communication

### Configuration-Driven
- **levels.ts**: All level parameters defined in config
- Easy to balance and extend

### Future-Ready API Layer
- **services/api.ts**: Stub functions for:
  - High score submission
  - Leaderboards
  - Multiplayer rooms
  - Ready for backend integration

### Modular Objects
- Each game entity (Player, Obstacle, Coin) is a self-contained class
- Easy to extend with new behaviors

## Customization

### Adjusting Difficulty
Edit `src/config/levels.ts` to modify:
- Spawn intervals
- Movement speeds
- Spawn chances
- Score thresholds

### Replacing Assets
Replace placeholder files in `public/assets/`:
- Images: 64x64 PNG with transparency
- Audio: WAV or MP3, keep under 100KB

### Adding New Features
The architecture supports easy extension:
- Add new game objects in `src/objects/`
- Create new scenes in `src/scenes/`
- Extend GameState for new properties
- Add events in `src/core/Events.ts`

## Troubleshooting

### Assets Not Loading
- Ensure asset files exist in `public/assets/`
- Check browser console for 404 errors
- Verify file names match exactly

### TypeScript Errors
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
- Ensure all imports use correct paths
- Check for missing dependencies
- Verify Node.js version (v18+)

## Performance Tips

- The game runs at 60 FPS by default
- Physics is optimized for arcade-style gameplay
- Asset loading is handled in BootScene
- Sprites are destroyed when off-screen

## Contributing

When adding features:
1. Follow the existing architecture patterns
2. Keep scenes focused and modular
3. Use the event bus for cross-component communication
4. Update level configs instead of hard-coding values

## License

This project is part of the Key Dash Adventure game factory monorepo.

## Next Steps

- [ ] Replace placeholder assets with custom artwork
- [ ] Add more visual effects and particle systems
- [ ] Implement power-ups and special abilities
- [ ] Connect to backend API for global leaderboards
- [ ] Add multiplayer support using the API layer
- [ ] Create additional game modes

---

Built with ❤️ using Phaser 3, TypeScript, and Vite
