import fs from 'fs';
import {getCurrentDirPath} from "./utils.js";
import childProcess from 'child_process';

export function createAndInstallRegistry(action, text) {
    createRegistryFile(action, text);
    installRegistry(action);
}

function createRegistryFile(action, text) {

    createRunCmd(action, 'registry');
    const currentDir = getCurrentDirPath().replace(/\\/g, '\\\\\\\\');
    const command = `wscript.exe \\"${currentDir}\\\\\\\\invisible.vbs\\" \\"${currentDir}\\\\\\\\run-registry-${action}.cmd\\"`;

    const fileContent = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow-${action}]
@="${text}"
"Icon"="\\"${currentDir}\\\\salt.ico\\""

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow-${action}\\command]
@="${command}"

`;

    fs.writeFileSync(`./registry-${action}.reg`, fileContent);
}

function installRegistry(action) {
    const currentDir = getCurrentDirPath();
    const path = `${currentDir}\\registry-${action}.reg`;

    childProcess.execSync(`regedit.exe ${path}`);
}

function createRunCmd(action, source) {
    const currentDir = getCurrentDirPath();
    const fileContent = `"C:\\Program Files\\nodejs\\npm.cmd" run ${action} --prefix "${currentDir}" -- ${source}`;

    fs.writeFileSync(`./run-${source}-${action}.cmd`, fileContent);
}