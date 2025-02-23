@echo off

:: Get the script's directory
set SCRIPT_DIR=%~dp0

:: Detect virtual environment in the same directory as the script
set VENV_DIR=
for %%V in (venv .venv env .env) do (
    if exist "%SCRIPT_DIR%%%V\Scripts\activate" set VENV_DIR=%%V
)

if "%VENV_DIR%"=="" (
    echo No virtual environment found!
    exit /b 1
)

:: Open a new terminal for Flask
start cmd /k "cd /d %SCRIPT_DIR%flask-backend && call %SCRIPT_DIR%%VENV_DIR%\Scripts\activate && flask run"

:: Open a new terminal for React
start cmd /k "cd /d %SCRIPT_DIR%react-frontend\birdo && npm start"

exit
