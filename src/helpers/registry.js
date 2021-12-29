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

    // Key is prefixed with 000_ so it appears above other contextMenu items
    const fileContent = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\DesktopBackground\\Shell\\000_PepperWallow-${action}]
@="${text}"
"Icon"="\\"${currentDir}\\\\assets\\\\salt.ico\\""
"Position"="Bottom"

[HKEY_CLASSES_ROOT\\DesktopBackground\\Shell\\000_PepperWallow-${action}\\command]
@="${command}"

`;

    Installation.setBinary(`registry-${action}.reg`, fileContent);
}

function installRegistry(action) {
    const binaryPath = Installation.getBinaryPath(`registry-${action}.reg`, true).replace(/\\/g, '\\\\');
    const command = `regedit.exe /s ${binaryPath}`;

    childProcess.execSync(command);
}

export function uninstall() {
    uninstallRegistry('next-wallpaper');
    uninstallRegistry('show-current');
}

function uninstallRegistry(action) {
    const registryName = `registry-${action}.reg`;

    const binary = Installation.getBinary(registryName);
    if (!binary) {
        return; // Registry doesn't exist. Maybe it was never installed.
    }

    const replaced = binary.replace(/\[/g, '[-');

    Installation.setBinary(registryName, replaced);
    installRegistry(action);
}

