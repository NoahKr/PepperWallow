:: This script is just so that users can easily click an icon to uninstall the application.

:: change to correct drive (running as admin resets working dir)
%~d0

:: change to correct directory (running as admin resets working dir)
cd %~dp0

@echo off
goto check_Permissions

:check_Permissions
    net session >nul 2>&1
    if %errorLevel% == 0 (
        echo Failure: This script SHOULD NOT be run with administrator permissions. Please rerun it as normal user.
    ) else (
		npm run --no-deprecation pep-uninstall
    )

    pause >nul


