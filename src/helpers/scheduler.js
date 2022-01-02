import fs from 'fs';
import {getWindowsUserID, resolveInvisibleCommand} from "./utils.js";
import childProcess from 'child_process';
import * as Config from "./config.js";
import * as Installation from './installation.js'

export function install() {
    const interval = Config.changeInterval();
    installScheduledTask('PepperWallow', interval);
}

function createScheduledTaskXML(interval) {
    const templateContent = fs.readFileSync('bin/PepperWallow.xml', 'utf16le');

    const actionCmd = Installation.createActionCmd('next-wallpaper', 'schtasks');
    const [command, arg] = resolveInvisibleCommand(actionCmd, true);

    const content = templateContent
        .replace('~~MINUTES~~', interval)
        .replace('~~COMMAND~~', command)
        .replace('~~ARGUMENTS~~', arg)
        .replace('~~USERID~~', getWindowsUserID());

    Installation.setBinary('PepperWallow.xml', content, 'utf16le');
}

function installScheduledTask(taskName, interval) {

    // Ensure it doesn't exist yet so next command won't error.
    remove(taskName);

    // Create file that we need to import in the next step.
    createScheduledTaskXML(interval);

    const importFilePath = Installation.getBinaryPath('PepperWallow.xml', true);
    let scheduleTaskCommand = `schtasks.exe /Create /XML ${importFilePath} /tn ${taskName}`;

    childProcess.execSync(scheduleTaskCommand);
}

export function uninstall() {
    remove('PepperWallow');
}

function remove(taskName, ignoreOnError) {
    try {
        childProcess.execSync(`schtasks /delete /tn ${taskName} /f >NUL 2>&1`);
    } catch (e) {
        // Ignore, if task doesn't exist yet an error will be thrown, but that's a valid use case.
    }
}