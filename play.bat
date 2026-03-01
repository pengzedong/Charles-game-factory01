@echo off
echo 🎮 Key Dash Adventure - One-Click Launcher
echo ==========================================

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo 📦 Installing dependencies (first time only)...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starting game server...
echo 📍 Game will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

call npm run dev
