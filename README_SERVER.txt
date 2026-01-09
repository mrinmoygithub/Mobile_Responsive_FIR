===============================================
  FIR Documents - Local Server Setup Guide
===============================================

ISSUE: Port 6000 is blocked by Chrome (ERR_UNSAFE_PORT)
SOLUTION: Use a safe port like 8080

QUICK START:
------------
1. Double-click "start-server.bat"
2. The server will start on http://localhost:8080
3. Your browser will open automatically

MANUAL OPTIONS:
---------------

Option 1: Python (Recommended)
  1. Make sure Python 3 is installed
  2. Open terminal/command prompt in this folder
  3. Run: python server.py
  4. Open browser: http://localhost:8080/index.html

Option 2: Node.js
  1. Make sure Node.js is installed
  2. Install http-server: npm install -g http-server
  3. Run: http-server -p 8080 -o
  4. Browser will open automatically

Option 3: VS Code Live Server
  1. Install "Live Server" extension in VS Code
  2. Right-click on index.html
  3. Select "Open with Live Server"
  4. Server runs on port 5500 (or similar)

SAFE PORTS (Use these instead of 6000):
- 3000, 4000, 5000, 5500, 8000, 8080, 8888

BLOCKED PORTS (Avoid these):
- 6000, 6001, etc. (X11 ports)

TROUBLESHOOTING:
----------------
- Port already in use? Close other applications or use a different port
- Python not found? Install Python and add it to PATH
- Node.js not found? Install Node.js from nodejs.org
- Still having issues? Use VS Code Live Server extension

===============================================
