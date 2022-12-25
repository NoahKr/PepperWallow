:: This script is just so that users can just click an icon to install the application.
:: change to correct drive (running as admin resets working dir)
%~d0
:: change to correct directory (running as admin resets working dir)
cd %~dp0
call npm install
npm run pep-install