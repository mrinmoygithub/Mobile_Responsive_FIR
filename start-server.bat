@echo off
title FIR Documents - Local Server
color 0A

echo.
echo ========================================
echo   FIR Documents - Local Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Python detected
    echo [INFO] Starting server on http://localhost:8080
    echo [INFO] Press CTRL+C to stop the server
    echo.
    echo ========================================
    echo.
    python server.py
    goto :end
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Node.js detected
    echo [INFO] Installing http-server (if not already installed)...
    npm install -g http-server >nul 2>&1
    echo [INFO] Starting server on http://localhost:8080
    echo [INFO] Press CTRL+C to stop the server
    echo.
    echo ========================================
    echo.
    start http://localhost:8080/index.html
    http-server -p 8080 -o /index.html
    goto :end
)

echo [ERROR] Neither Python nor Node.js is installed!
echo.
echo Please install one of the following:
echo.
echo Option 1: Python 3.x
echo   Download from: https://www.python.org/downloads/
echo   Make sure to check "Add Python to PATH" during installation
echo.
echo Option 2: Node.js
echo   Download from: https://nodejs.org/
echo.
echo After installation, run this script again.
echo.
pause

:end
