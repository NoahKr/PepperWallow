import rlp from 'readline';
import path from 'path';
import childProcess from 'child_process';
const __dirname = path.resolve();

const rl = rlp.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function askInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (input) => resolve(input) );
    });
}

export function getCurrentDirPath() {
    return __dirname;
}

export function resolveInvisibleCommand(baseCommand, split = false) {
    const currentDir = getCurrentDirPath();
    const invisibleVbsPath = `${currentDir}\\bin\\invisible.vbs`.replace(/\\/g, '\\\\\\\\');
    const commandPath = baseCommand.replace(/\\/g, '\\\\\\\\');

    const command = 'wscript.exe';
    if (split) {
        return [command, `\"${invisibleVbsPath}\" \"${commandPath}\"`]
    }

    const fullCommand = `${command} \\"${invisibleVbsPath}\\" \\"${commandPath}\\"`;
    return fullCommand;
}

export function getWindowsUserID() {
    const result = childProcess.execSync('wmic useraccount where name=\'%username%\' get sid').toString();
    const sid = result.replace('SID', '').replace(/[\n\r\s]*/gi, '');

    return sid;
}