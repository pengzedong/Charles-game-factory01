"""
Vercel Serverless Function Entry Point for FastAPI Backend

This file wraps the FastAPI application to work as a Vercel serverless function.
All API routes from the backend are accessible at /api/*
"""

from backend.backend.main import app
from mangum import Mangum

# Mangum is an adapter for running ASGI applications (like FastAPI)
# in AWS Lambda and other FaaS platforms, including Vercel
handler = Mangum(app, lifespan="off")
