import {resolveInvisibleCommand} from "./utils.js";
import childProcess from 'child_process';
import * as Config from "./config.js";
import * as Installation from './installation.js'

export function install() {
    const actionCmd = Installation.createActionCmd('next-wallpaper', 'schtasks');

    // Ensure it doesn't exist yet so next command won't error.
    try {
        childProcess.execSync("schtasks /delete /tn PepperWallow /f >NUL 2>&1");
    } catch (e) {
        // Ignore, if task doesn't exist yet an error will be thrown, but that's a valid use case.
    }

    const interval = Config.changeInterval();

    const command = resolveInvisibleCommand(actionCmd);
    const scheduleTaskCommand = `schtasks /create /sc MINUTE /mo ${interval} /tn PepperWallow /tr "${command}"`;
    childProcess.execSync(scheduleTaskCommand);
}