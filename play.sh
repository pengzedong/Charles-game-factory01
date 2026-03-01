#!/bin/bash

echo "🎮 Key Dash Adventure - One-Click Launcher"
echo "=========================================="

cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "🚀 Starting game server..."
echo "📍 Game will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Start dev server
npm run dev
