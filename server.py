#!/usr/bin/env python3
"""
Simple HTTP Server for FIR Documents Project
Run this script to start a local server on port 8080
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers if needed
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    # Change to the directory where this script is located
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"\n{'='*60}")
            print(f"  FIR Documents Server")
            print(f"{'='*60}")
            print(f"\nServer running on: http://localhost:{PORT}")
            print(f"Press CTRL+C to stop the server\n")
            print(f"{'='*60}\n")
            
            # Auto-open browser
            webbrowser.open(f'http://localhost:{PORT}/index.html')
            
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\nERROR: Port {PORT} is already in use!")
            print(f"Please close the application using port {PORT} or use a different port.\n")
        else:
            print(f"\nERROR: {e}\n")
    except KeyboardInterrupt:
        print(f"\n\nServer stopped by user.")
        print("Goodbye!\n")
