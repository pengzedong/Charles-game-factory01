# Vercel Serverless Functions

This directory contains the entry point for Vercel serverless functions.

## What is this?

The `index.py` file in this directory wraps the FastAPI backend application (`backend/backend/main.py`) to run as a Vercel serverless function.

## How it works

1. Vercel detects Python files in the `/api` directory
2. Each file becomes a serverless function endpoint
3. `mangum` adapter converts ASGI (FastAPI) to serverless format
4. All backend routes are accessible at `/api/*`

## Example

**Backend route:** `/highscores` (defined in `backend/backend/api/scores.py`)
**Deployed URL:** `https://your-app.vercel.app/api/highscores`

## Technical Details

- **Runtime:** Python 3.9
- **Adapter:** Mangum (ASGI to AWS Lambda/Vercel)
- **Backend:** FastAPI application
- **Cold start:** ~500ms (first request after idle)
- **Warm requests:** <50ms

## Local Development

For local development, use uvicorn directly from the backend directory:

```bash
cd backend
uvicorn backend.main:app --reload
```

This runs the full ASGI server, which is faster for development.

## Deployment

No manual configuration needed! Vercel automatically:
1. Detects this directory
2. Reads `requirements.txt` in project root
3. Installs Python dependencies
4. Deploys as serverless functions

See [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for details.
