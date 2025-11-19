"""
Vercel Serverless Function Entry Point for FastAPI Backend

This file wraps the FastAPI application to work as a Vercel serverless function.
All API routes from the backend are accessible at /api/*
"""

import sys
import os
from pathlib import Path

# Add the project root to Python path so we can import the backend module
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from mangum import Mangum
from backend.backend.main import app

# Mangum is an adapter for running ASGI applications (like FastAPI)
# in AWS Lambda and other FaaS platforms, including Vercel
# lifespan="off" disables lifespan events which don't work in serverless
handler = Mangum(app, lifespan="off")
