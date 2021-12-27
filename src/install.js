import {askInput, getCurrentDirPath} from "./helpers/utils.js";
import {createAndInstallRegistry} from "./helpers/registry.js"
import * as Config from './helpers/config.js';

import _ from 'lodash';
import fs from 'fs';
import childProcess from 'child_process';

// TODO clean up this file with all the escapes etc.
// TODO move all the working files (.cmd .reg) to separate directory

async function main() {
    console.log('Hello! Welcome to the install script for PepperWallow - a barebones wallpaper manager.');
    console.log('This script will setup the configuration file that PepperWallow uses to function.\n');

    await initConfig();
    installScheduledTask();
    await initRegistry();

    console.log('Installation finished!');
    process.exit(0);
}

async function initConfig() {
    // TODO allow modifying of config, rather than replacing it
    const wallpaperPath = await initWallpaperDirectory();
    const interval = await initWallpaperChangeInterval();

    storeConfig(wallpaperPath, interval);
    console.log('Configuration set!\n');
}

async function initWallpaperDirectory() {
    const current = Config.wallpaperPath();
    if (current) {
        const change = await askInput(`The wallpaper directory is currently set to "${current}". Do you want to change this value? (Y/n) `);
        if (_.toLower(change) !== 'y') {
            console.log('Not changing wallpaper directory');
            return current;
        }
    }

    const enteredPath = await askInput('Please enter the path to the directory the wallpapers you want to use are in: ');

    if (!enteredPath || 0 ===_.trim(enteredPath).length) {
        console.log(`Entered path "${enteredPath}" is invalid, please try again.`);
        return await initWallpaperDirectory();
    }

    if (!fs.existsSync(enteredPath)) {
        console.log(`Entered path "${enteredPath}" does not exist, please try again.`);
        return await initWallpaperDirectory();
    }

    if (!fs.lstatSync(enteredPath).isDirectory()) {
        console.log(`Entered path "${enteredPath}" is not a directory, please try again.`);
        return await initWallpaperDirectory();
    }

    const agreed = await askInput(`Entered path is "${enteredPath}". Is this okay? (Y/n) `);
    if (_.toLower(agreed) !== 'y') {
        return await initWallpaperDirectory();
    }

    return enteredPath;
}

async function initWallpaperChangeInterval() {
    const current = Config.changeInterval();
    if (current) {
        const change = await askInput(`The wallpaper change interval is currently set to "${current}" (minutes). Do you want to change this value? (Y/n) `);
        if (_.toLower(change) !== 'y') {
            console.log('Not changing wallpaper change interval');
            return current;
        }
    }

    const enteredInterval = await askInput('Please enter in minutes every how often the wallpapers should change: ');
    const interval = _.parseInt(enteredInterval);

    if (!_.isInteger(interval)) {
        console.log(`Entered interval "${enteredInterval}" is not an integer, please try again.`);
        return await initWallpaperChangeInterval();
    }

    if (interval <= 0) {
        console.log('Interval should be higher than 0.');
        return await initWallpaperChangeInterval();
    }

    const agreed = await askInput(`Entered interval is "${enteredInterval}" seconds. Is this okay? (Y/n) `);
    if (_.toLower(agreed) !== 'y') {
        return await initWallpaperChangeInterval();
    }

    return interval;
}

async function initRegistry() {
    const agreed = await askInput('PepperWallow will now add registry keys so you can do actions like changing the wallpaper by right-clicking your desktop. Is this okay? (Y/n) ');

    if (_.toLower(agreed) !== 'y') {
        console.log('User did not agree, not setting registry');
        return;
    }

    createAndInstallRegistry('next-wallpaper', 'Next Wallpaper');
    createAndInstallRegistry('show-current', 'Show Current Wallpaper');
    console.log('Registry key added!\n')
}

function installRegistry() {
    const currentDir = getCurrentDirPath();
    const path = currentDir + '\\' + 'registry.reg';

    childProcess.execSync(`regedit.exe ${path}`);
}

function createRunCmd(source) {
    const currentDir = getCurrentDirPath();
    const fileContent = `"C:\\Program Files\\nodejs\\npm.cmd" run next-wallpaper --prefix "${currentDir}" -- ${source}`;

    fs.writeFileSync(`./run-${source}.cmd`, fileContent);
}

function installScheduledTask() {
    console.log('Creating scheduled task.');
    createRunCmd('schtasks');

    const currentDir = getCurrentDirPath().replace(/\\/g, '\\\\\\\\');

    // Ensure it doesn't exist yet so next command won't error.
    try {
        childProcess.execSync("schtasks /delete /tn PepperWallow /f >NUL 2>&1");
    } catch (e) {
        // Ignore, if task doesn't exist yet an error will be thrown, but that's a valid use case.
    }

    const interval = Config.changeInterval();

    const command = `wscript.exe \\"${currentDir}\\\\\\\\invisible.vbs\\" \\"${currentDir}\\\\\\\\run-schtasks.cmd\\"`;
    const scheduleTaskCommand = `schtasks /create /sc MINUTE /mo ${interval} /tn PepperWallow /tr "${command}"`;
    childProcess.execSync(scheduleTaskCommand);

    console.log('Scheduled task created!\n');
}

function createRegistryFile() {
    createRunCmd('registry');

    const currentDir = getCurrentDirPath().replace(/\\/g, '\\\\\\\\');
    const command = `wscript.exe \\"${currentDir}\\\\\\\\invisible.vbs\\" \\"${currentDir}\\\\\\\\run-registry.cmd\\"`;

    const fileContent = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow]
@="Next wallpaper"
"Icon"="\\"${currentDir}\\\\salt.ico\\""

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow\\command]
@="${command}"

`;

    fs.writeFileSync('./registry.reg', fileContent);
}

function storeConfig(wallpaperPath, changeInterval) {
    Config.set(wallpaperPath, changeInterval);
}

main();