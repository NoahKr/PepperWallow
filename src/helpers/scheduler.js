import fs from 'fs';
import {getWindowsUserID, resolveInvisibleCommand} from "./utils.js";
import childProcess from 'child_process';
import * as Config from "./config.js";
import * as Installation from './installation.js'
import moment from "moment";
import {log} from "./log.js";

const BASE_TASK_NAME = 'PepperWallow';

export function install(source) {
    installScheduledTask(source, 'BOOT');
}

export function setTimelyTask(source, timestamp) {
    const interval = Config.changeInterval();
    // If interval is empty, then no timely task should be set
    if (!interval) {
        return;
    }

    const changeAtTimestamp = timestamp + (interval*60*1000)

    installScheduledTask(source, 'TIMELY', changeAtTimestamp)
}

function createScheduledTaskXML(xmlName, action, commandParams = {}) {
    const templateContent = fs.readFileSync(`bin/${xmlName}`, 'utf16le');

    const actionCmd = Installation.createActionCmd(action, 'schtasks');
    const [command, arg] = resolveInvisibleCommand(actionCmd, true);

    let content = templateContent
        .replace('~~COMMAND~~', command)
        .replace('~~ARGUMENTS~~', arg)
        .replaceAll('~~USERID~~', getWindowsUserID());

    for (const replacementKey in commandParams) {
        content = content.replace(replacementKey, commandParams[replacementKey])
    }

    Installation.setBinary(xmlName, content, 'utf16le');
}

function installScheduledTask(source, type, changeAtTimestamp = null) {
    let taskName = `${BASE_TASK_NAME}-${type}`

    // Ensure it doesn't exist yet so next command won't error.
    remove(source, taskName);

    // Create file that we need to import in the next step.
    const xmlName = `PepperWallow-${type}.xml`;

    if ('BOOT' === type) {
        createScheduledTaskXML(xmlName,'boot');
    } else {
        const changeAt = moment.unix(Math.round(changeAtTimestamp/1000)).format("YYYY-MM-DDTHH:mm:ss.SSS000");
        createScheduledTaskXML(xmlName,'next-wallpaper', {
            '~~DATETIME~~': changeAt,
        });
    }

    const importFilePath = Installation.getBinaryPath(xmlName, true);
    let scheduleTaskCommand = `schtasks.exe /Create /XML ${importFilePath} /tn ${taskName}`;

    childProcess.execSync(scheduleTaskCommand);
}

export function uninstall(source) {
    remove(source, 'PepperWallow-BOOT');
    remove(source, 'PepperWallow-TIMELY');
}

function remove(source, taskName) {
    try {
        childProcess.execSync(`schtasks /delete /tn ${taskName} /f >NUL 2>&1`);
    } catch (e) {
        // Ignore, if task doesn't exist yet an error will be thrown, but that's a valid use case.
    }
}