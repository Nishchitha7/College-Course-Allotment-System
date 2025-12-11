@echo off
echo College Course Enrollment System - Setup
echo ========================================
echo.
echo To run this application, you need to have Node.js and MongoDB installed.
echo.
echo 1. Download and install Node.js from: https://nodejs.org/
echo 2. Download and install MongoDB from: https://www.mongodb.com/try/download/community
echo.
echo After installing both, follow these steps:
echo.
echo Step 1: Start MongoDB service
echo    - Open Command Prompt as Administrator
echo    - Run: net start MongoDB
echo    (Or start MongoDB manually if you didn't install it as a service)
echo.
echo Step 2: Install backend dependencies
echo    - Open Command Prompt
echo    - Navigate to the server folder:
echo      cd %~dp0server
echo    - Run: npm install
echo.
echo Step 3: Start the backend server
echo    - In the server folder, run:
echo      npm start
echo    - The server will start on port 5000
echo.
echo Step 4: Serve the frontend files
echo    - Open another Command Prompt
echo    - Navigate to the client folder:
echo      cd %~dp0client
echo    - Serve the files using any HTTP server:
echo      npx http-server -p 3000
echo    - Or if you have Python installed:
echo      python -m http.server 3000
echo.
echo Step 5: Access the application
echo    - Open your browser and go to: http://localhost:3000
echo.
echo For development, you can use nodemon for auto-restart:
echo    - In the server folder, run: npm run dev
echo.
pause