import {getCurrentDirPath, resolveInvisibleCommand} from "./utils.js";
import childProcess from 'child_process';
import * as Installation from "./installation.js";

export function createAndInstall(action, text) {
    createRegistryFile(action, text);
    installRegistry(action);
}

function createRegistryFile(action, text) {
    const actionCmd = Installation.createActionCmd(action, 'registry');
    const command = resolveInvisibleCommand(actionCmd);
    const currentDir = getCurrentDirPath().replace(/\\/g, '\\\\\\\\');

    const fileContent = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow-${action}]
@="${text}"
"Icon"="\\"${currentDir}\\\\assets\\\\salt.ico\\""

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow-${action}\\command]
@="${command}"

`;

    Installation.setBinary(`registry-${action}.reg`, fileContent);
}

function installRegistry(action) {
    const binaryPath = Installation.getBinaryPath(`registry-${action}.reg`, true).replace(/\\/g, '\\\\');
    const command = `regedit.exe /s ${binaryPath}`;
    console.log('install reg command', command)

    childProcess.execSync(command);
}

export function uninstall() {
    uninstallRegistry('next-wallpaper');
    uninstallRegistry('show-current');
}

function uninstallRegistry(action) {
    const registryName = `registry-${action}.reg`;

    const binary = Installation.getBinary(registryName);
    const replaced = binary.replace(/\[/g, '[-');

    Installation.setBinary(registryName, replaced);
    installRegistry(action);
}

