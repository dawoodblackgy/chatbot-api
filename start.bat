@echo off
echo Installing dependencies...
call npm install > log.txt 2>&1

echo Starting server...
call node server.js >> log.txt 2>&1

echo.
echo Process finished. Please check log.txt for any errors.
pause
