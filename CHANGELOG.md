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