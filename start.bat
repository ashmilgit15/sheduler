@echo off
echo ====================================
echo Lab Exam Scheduler - Startup Script
echo ====================================
echo.

echo Starting Backend Server...
cd backend
start cmd /k "python main.py"
cd ..

echo.
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
cd frontend
start cmd /k "npm start"
cd ..

echo.
echo ====================================
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ====================================
echo.
echo Press any key to exit this window...
pause > nul
