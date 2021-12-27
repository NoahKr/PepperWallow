# PepperWallow - Barebones wallpaper manager
Allows you to specify a directory from which wallpapers will be set (on all monitors).
The applied wallpapers are shuffled which means that you won't see the same wallpaper twice until all wallpapers in the directory have been shown. 

(Please note that this is a hobby project and is by no means perfect. Code could be cleaner for one thing...)

# Pre-requisites
- [Node](https://nodejs.org/en/download/) (Tested on Node 14)

# Install
1. Clone the project
2. Navigate to the directory
3. Open it in a command line utility (I personally use powershell)
4. execute `npm install` to install the dependencies.
4. execute `npm run pep-install` and answer the prompts.
5. Profit!

# Usage
After running the install script your wallpaper will be changed at the interval you specified.

Additionally there are also some actions you can perform manually by right-clicking your desktop.
These actions include:
- "Next Wallpaper" - changes the wallpaper
- "Show Current Wallpaper" - shows a dialog that tells you the path to the currently applied wallpaper.

# Uninstall
1. `npm run pep-uninstall`
2. Delete this directory

# Credits
Salt-shaker icons made by https://www.freepik.com via https://www.flaticon.com/

https://github.com/sindresorhus/wallpaper for the wallpaper package which this application heavily relies upon.
