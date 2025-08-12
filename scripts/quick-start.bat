@echo off
REM Reddit CHI Dashboard - Quick Start Script (Windows)
REM This script sets up the development environment and starts the dashboard

echo 🚀 Reddit CHI Dashboard - Quick Start
echo =====================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20.x or later.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 20 (
    echo ❌ Node.js version is too old. Please install Node.js 20.x or later.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

REM Check if data files exist
if not exist "data\insights.json" (
    echo ⚠️  Warning: data\insights.json not found
    echo    Run: npm run convert-insights
)

REM Start development server
echo 🌐 Starting development server...
echo    Dashboard will be available at: http://localhost:3000
echo    Press Ctrl+C to stop the server
echo.

npm run dev 