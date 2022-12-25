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
    const [invisibleVbsPath, commandPath] = parseInvisibleCommand(baseCommand);

    const command = 'wscript.exe';
    if (split) {
        return [command, `\"${invisibleVbsPath}\" \"${commandPath}\"`]
    }

    const fullCommand = `${command} \\"${invisibleVbsPath}\\" \\"${commandPath}\\"`;
    return fullCommand;
}

function parseInvisibleCommand(baseCommand) {
    const currentDir = getCurrentDirPath();

    const invisibleVbsPath = escapeForWindowsSubSystem(`${currentDir}\\bin\\invisible.vbs`);
    const commandPath = escapeForWindowsSubSystem(baseCommand);

    return [invisibleVbsPath, commandPath];
}

export function resolveElevatedInvisibleCommand(baseCommand) {
    const [invisibleVbsPath, commandPath] = parseInvisibleCommand(baseCommand);
    const elevationCommand = escapeForWindowsSubSystem(getHelpBinaryPath('elevate.bat'))

    const fullCommand = `${elevationCommand} wscript.exe ${invisibleVbsPath} ${commandPath}`;
    return fullCommand;
}

function escapeForWindowsSubSystem(command) {
    return command.replace(/\\/g, '\\\\\\\\');
}

function getHelpBinaryPath(filename) {
    const currentDir = getCurrentDirPath();
    return `${currentDir}\\bin\\${filename}`
}

export function getWindowsUserID() {
    const result = childProcess.execSync('wmic useraccount where name=\'%username%\' get sid').toString();
    const sid = result.replace('SID', '').replace(/[\n\r\s]*/gi, '');

    return sid;
}