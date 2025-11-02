@echo off
cd /d "%~dp0"
where node >NUL 2>&1
if errorlevel 1 (
  echo Node.js is required but not found in PATH.
  echo Download: https://nodejs.org/
  pause
  exit /b 1
)
node "%~dp0export-project-md.js"
echo.
echo Done. Output: PROJECT_EXPORT.md
pause
