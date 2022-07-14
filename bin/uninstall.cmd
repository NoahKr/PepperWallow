:: This script is just so that users can easily click an icon to uninstall the application.
:: change to correct drive (running as admin resets working dir)
%~d0
:: change to correct directory (running as admin resets working dir)
cd %~dp0
npm run --no-deprecation pep-uninstall