# PepperWallow - Barebones wallpaper manager (for Windows 10)
Allows you to specify a directory from which wallpapers will be set (on all monitors).
The applied wallpapers are shuffled which means that you won't see the same wallpaper twice until all wallpapers in the directory have been shown. 

(Please note that this is a hobby project and is by no means perfect. Code could be cleaner for one thing...)

# Pre-requisites
- [Node](https://nodejs.org/en/download/) (Tested on Node 14, 16.16.0)

# Install
1. Clone the project
2. Open the directory in explorer
3. Double-click the install.cmd in the root of the project.
4. Answer the prompts.
5. Profit!

Please note that you need to restart your pc before the wallpaper will change automatically.

# Usage
After running the install script and restarting your wallpaper will be changed at the interval you specified. (And when you logon)

Additionally there are also some actions you can perform manually by right-clicking your desktop.
These actions include:
- "Next Wallpaper" - changes the wallpaper
- "Previous Wallpaper" - changes the wallpaper to the previous wallpaper
- "Show Current Wallpaper" - opens explorer and highlights the currently applied wallpaper.

# Uninstall
1. Double-click the uninstall.cmd in the root of the project.
2. Delete this directory

# Credits
Salt-shaker icons made by https://www.freepik.com via https://www.flaticon.com/

https://github.com/sindresorhus/wallpaper for the wallpaper package which this application heavily relies upon.
