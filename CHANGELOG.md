# 1.0.1
- Changed: made registry and shtasks installs no longer need administrative access, 
  this way without the UAC popup a more smooth user experience is provided
- Removed: elevation logic

# 1.0.0
- Added: GUI installer which includes more configurability
- Added: freeze / unfreeze registry function
- Added: desktop notifications

# 0.2.0
- Added: `previous wallpaper` action that sets the wallpaper to the wallpaper before the current one.
When the wallpaper is then changed later on the original current wallpaper will be set again.
This works via a stack so changing the wallpaper to the previous multiple times and then setting it to the 'next' one multiple times should work correctly.
- Fixed: scheduled tasks behaved a little unexpectedly. Since the interval and logon tasks were seperate the interval
task could change a wallpaper within less time than the specified interval from boot. E.g. you have an interval of 6 hours.
The wallpaper could change in 2 hours after boot, this is because when the interval task was set it basically tries performs the action every 6 hours from the time it was created.
So let's say the task is installed at 13:00, and you boot up your pc on the next day at 6. You would expect your wallpaper to change at 12 but instead it changes at 7.
Since that is the next interval that the task performs at (13-19-1-7-13-etc.).
Fixed this by creating a task that starts at logon and then runs at logon and every x minutes.

# 0.1.2
- Fixed: `show current wallpaper` action would give an error in the log, even though the command worked.
This is due to an error in node-windows implementation. Unable to fix so I just put a try catch around the command execution.¯\_(ツ)_/¯
https://github.com/nodejs/node/issues/23098

# 0.1.1
- Fixed: readme still described the dialog rather than the explorer highlight for the `show current wallpaper` action.

# 0.1.0
- Fixed: PepperWallow contextMenu actions where shown in any directory, not just on the desktop
- Changed: Made appear contextMenu items (registry keys) at the very bottom of the list (but before personalize etc.)
- Changed: The `show current wallpaper` action now highlights the file in explorer rather than displaying the path in a message.

# 0.0.1
- Initial