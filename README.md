# PepperWallow - Barebones wallpaper manager (for Windows 10)
Allows you to specify a directory from which wallpapers will be set (on all monitors).
The applied wallpapers are shuffled which means that you won't see the same wallpaper twice until all wallpapers in the directory have been shown. 

(Please note that this is a hobby project and is by no means perfect. Code could be cleaner for one thing...)

# Pre-requisites
- [Node](https://nodejs.org/en/download/) (Tested on Node 14, 16.16.0)

# Install
It's imperative that the PepperWallow directory is never renamed/moved after installation, just like most program files apps, if the directory is moved without warning it will misbehave.

1. Clone the project / Or download zip
2. Open the directory in explorer
3. Double-click the install.cmd in the root of the project. (make sure to actually run this from a directory, it won't work if you try this in the zip-viewer)
4. Profit!

# Usage
After running the install script and restarting your wallpaper will be changed at the interval you specified. (And when you logon)

Additionally there are also some actions you can perform manually by right-clicking your desktop.
These actions include:
- "Next Wallpaper" - changes the wallpaper
- "Previous Wallpaper" - changes the wallpaper to the previous wallpaper
- "Show Current Wallpaper" - opens explorer and highlights the currently applied wallpaper.
- "Freeze / Unfreeze" - freezing makes it so your wallpapers do not change, even if any other trigger conditions (like boot or interval) are met. Once you unfreeze the wallpaper will be changed (if the interval condition has been met. It does not check if the boot condition was ever met)
- "Discard" - First moves the current wallpaper to the preconfigured discard directory. Then changes the wallpaper to the next one (essentially a "Next Wallpaper" action).

# Uninstall
1. Open the directory in explorer
2. Double-click the uninstall.cmd in the root of the project.
3. Delete this directory

# Credits
Salt-shaker icons made by https://www.freepik.com via https://www.flaticon.com/

https://github.com/sindresorhus/wallpaper for the wallpaper package which this application heavily relies upon.
