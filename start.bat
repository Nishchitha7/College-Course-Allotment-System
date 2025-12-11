@echo off
echo College Course Enrollment System - Startup
echo ==========================================
echo.
echo Starting the application...
echo.
echo NOTE: Make sure you have:
echo  - Node.js installed
echo  - MongoDB running
echo  - Backend dependencies installed (npm install in server folder)
echo.
echo If you haven't set up the environment yet, please run setup.bat first.
echo.
echo Starting backend server...
cd server
start "Backend Server" cmd /k "npm start"
timeout /t 5 >nul
echo.
echo Starting frontend server...
cd ../client
start "Frontend Server" cmd /k "npx http-server -p 3000"
echo.
echo Application should now be accessible at: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul