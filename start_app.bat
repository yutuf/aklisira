@echo off
echo ===========================================
echo   Seat Optimizer - Summit Edition Launcher
echo ===========================================
echo.
echo [1/2] Installing dependencies (this may take a minute)...
call npm install
echo.
echo [2/2] Starting Development Server...
echo.
echo Open http://localhost:3000 in your browser when ready.
echo.
call npm run dev
pause
