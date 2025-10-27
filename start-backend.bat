@echo off
echo Starting Nepal Air Watch Backend...
echo.
cd backend
echo Current directory: %CD%
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting backend server...
echo.
call npm run dev

