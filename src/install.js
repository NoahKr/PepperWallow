import {askInput, getCurrentDirPath} from "./helpers/utils.js";
import _ from 'lodash';
import fs from 'fs';
import * as Config from './helpers/config.js';
import childProcess from 'child_process';


async function main() {
    console.log('Hello! Welcome to the install script for PepperWallow - a barebones wallpaper manager.');
    console.log('This script will setup the configuration file that PepperWallow uses to function.\n');

    await initConfig();
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
        const change = await askInput(`The wallpaper change interval is currently set to "${current}". Do you want to change this value? (Y/n) `);
        if (_.toLower(change) !== 'y') {
            console.log('Not changing wallpaper change interval');
            return current;
        }
    }

    const enteredInterval = await askInput('Please enter in seconds every how often the wallpapers should change: ');
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
    const agreed = await askInput('PepperWallow will now add registry key so you can change the wallpaper by right-clicking your desktop. Is this okay? (Y/n) ');

    if (_.toLower(agreed) !== 'y') {
        console.log('User did not agree, not setting registry');
        return;
    }

    createRegistryFile();
    installRegistry();
    console.log('Registry key added!\n')
}

function installRegistry() {
    const currentDir = getCurrentDirPath();
    const path = currentDir + '\\' + 'registry.reg';

    childProcess.execSync(`regedit.exe ${path}`);
}

function createRegistryFile() {
    const currentDir = getCurrentDirPath().replace(/\\/g, '\\\\');
    const fileContent = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow]
@="Next wallpaper"
"Icon"="\\"${currentDir}\\\\salt.ico\\""

[HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\PepperWallow\\command]
@="\\"C:\\\\Program Files\\\\nodejs\\\\npm.cmd\\" run next-wallpaper --prefix \\"${currentDir}"

`;

    fs.writeFileSync('./registry.reg', fileContent);
}

function storeConfig(wallpaperPath, changeInterval) {
    Config.set(wallpaperPath, changeInterval);
}

main();