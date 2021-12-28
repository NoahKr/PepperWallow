import {resolveInvisibleCommand} from "./utils.js";
import childProcess from 'child_process';
import * as Config from "./config.js";
import * as Installation from './installation.js'

export function install() {
    const interval = Config.changeInterval();
    installScheduledTask('PepperWallow-interval', 'interval', interval);
    installScheduledTask('PepperWallow-logon', 'logon')
}

function installScheduledTask(taskName, mode, interval = null) {
    const actionCmd = Installation.createActionCmd('next-wallpaper', 'schtasks');

    // Ensure it doesn't exist yet so next command won't error.
    try {
        remove();
    } catch (e) {
        // Ignore, if task doesn't exist yet an error will be thrown, but that's a valid use case.
    }


    const command = resolveInvisibleCommand(actionCmd);
    let scheduleTaskCommand;
    if ('interval' === mode) {
        scheduleTaskCommand = `schtasks /create /sc MINUTE /mo ${interval} /tn ${taskName} /tr "${command}"`;
    } else {
        scheduleTaskCommand = `schtasks /create /sc ONLOGON /tn ${taskName} /tr "${command}"`;
    }

    childProcess.execSync(scheduleTaskCommand);
}

export function uninstall() {
    remove('PepperWallow-interval');
    remove('PepperWallow-logon');
}

function remove(taskName) {
    childProcess.execSync(`schtasks /delete /tn ${taskName} /f >NUL 2>&1`);
}