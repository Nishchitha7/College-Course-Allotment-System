@echo off
echo College Course Enrollment System - Frontend
echo ==========================================
echo.
echo Starting frontend server...
echo.
echo Navigate to http://localhost:3000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.
cd client
python -m http.server 3000
pause