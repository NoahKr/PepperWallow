import fs from 'fs';
import {getWindowsUserID, resolveInvisibleCommand} from "./utils.js";
import childProcess from 'child_process';
import * as Config from "./config.js";
import * as Installation from './installation.js'
import moment from "moment";

const BASE_TASK_NAME = 'PepperWallow';

export function install() {
    installScheduledTask('BOOT');
}

export function setTimelyTask(timestamp) {
    const interval = Config.changeInterval();
    const changeAtTimestamp = timestamp + (interval*60*1000)

    installScheduledTask('TIMELY', changeAtTimestamp)
}

function createScheduledTaskXML(xmlName, action, commandParams = {}) {
    const templateContent = fs.readFileSync(`bin/${xmlName}`, 'utf16le');

    const actionCmd = Installation.createActionCmd(action, 'schtasks');
    const [command, arg] = resolveInvisibleCommand(actionCmd, true);

    let content = templateContent
        .replace('~~COMMAND~~', command)
        .replace('~~ARGUMENTS~~', arg)
        .replace('~~USERID~~', getWindowsUserID());

    for (const replacementKey in commandParams) {
        content = content.replace(replacementKey, commandParams[replacementKey])
    }

    Installation.setBinary(xmlName, content, 'utf16le');
}

function installScheduledTask(type, changeAtTimestamp = null) {
    let taskName = `${BASE_TASK_NAME}-${type}`

    // Ensure it doesn't exist yet so next command won't error.
    remove(taskName);

    // Create file that we need to import in the next step.
    const xmlName = `PepperWallow-${type}.xml`;

    if ('BOOT' === type) {
        createScheduledTaskXML(xmlName,'boot');
    } else {
        console.log('timestamp', changeAtTimestamp)
        // 2022-07-14T11:05:00.3764333
        const changeAt = moment.unix(changeAtTimestamp).format("YYYY-MM-DDTHH:mm:ss.SSS000");
        console.log('formatted changeAt', changeAt);

        createScheduledTaskXML(xmlName,'next-wallpaper', {
            '~~DATETIME~~': changeAt,
        });
    }

    const importFilePath = Installation.getBinaryPath(xmlName, true);
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