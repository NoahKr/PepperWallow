import rlp from 'readline';
import path from 'path';
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

export function resolveInvisibleCommand(baseCommand) {
    const currentDir = getCurrentDirPath();
    const invisibleVbsPath = `${currentDir}\\bin\\invisible.vbs`.replace(/\\/g, '\\\\\\\\');
    const commandPath = baseCommand.replace(/\\/g, '\\\\\\\\');

    const fullCommand = `wscript.exe \\"${invisibleVbsPath}\\" \\"${commandPath}\\"`;

    return fullCommand;
}