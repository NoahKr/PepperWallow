:: This script is just so that users can just click an icon to install the application.

:: change to correct drive (running as admin resets working dir)
%~d0

:: change to correct directory (running as admin resets working dir)
cd %~dp0

@echo off
goto check_Permissions

:check_Permissions
    net session >nul 2>&1
    if %errorLevel% == 0 (
        echo Installing dependencies...
		call npm install
        echo Launching configuration GUI...
		npm run pep-install
    ) else (
        echo Failure: This script requires administrator permissions. Please rerun it as administrator.
    )

    pause >nul