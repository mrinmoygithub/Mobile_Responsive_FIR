@echo off
echo Starting FIR Documents Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python detected. Starting server on port 8080...
    echo.
    python server.py
) else (
    echo Python not found. Trying Node.js...
    echo.
    
    REM Check if Node.js is installed
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Node.js detected. Installing http-server...
        echo.
        npm install -g http-server >nul 2>&1
        echo Starting server on port 8080...
        echo.
        start http://localhost:8080/index.html
        http-server -p 8080 -o
    ) else (
        echo ERROR: Neither Python nor Node.js is installed!
        echo.
        echo Please install one of the following:
        echo 1. Python 3.x from https://www.python.org/downloads/
        echo 2. Node.js from https://nodejs.org/
        echo.
        pause
    )
)
