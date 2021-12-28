import {askInput} from "./helpers/utils.js";
import * as Registry from "./helpers/registry.js"
import * as Config from './helpers/config.js';
import * as Scheduler from './helpers/scheduler.js';

import _ from 'lodash';
import fs from 'fs';

async function main() {
    console.log('Hello! Welcome to the install script for PepperWallow - a barebones wallpaper manager.');
    console.log('This script will setup PepperWallow.\n');

    await initConfig();
    initScheduledTasks();
    await initRegistry();

    console.log('Installation finished!');
    process.exit(0);
}

async function initConfig() {
    const wallpaperPath = await initWallpaperDirectory();
    const interval = await initWallpaperChangeInterval();

    Config.set(wallpaperPath, interval);
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

    const agreed = await askInput(`Entered interval is every "${enteredInterval}" minute(s). Is this okay? (Y/n) `);
    if (_.toLower(agreed) !== 'y') {
        return await initWallpaperChangeInterval();
    }

    return interval;
}

function initScheduledTasks() {
    Scheduler.install();
    console.log('Scheduled tasks set!\n')
}

async function initRegistry() {
    const agreed = await askInput('PepperWallow can set registry keys so you can manually perform actions like changing the wallpaper by right-clicking your desktop. Install registry keys? (Y/n) ');

    if (_.toLower(agreed) !== 'y') {
        console.log('User did not agree, not setting registry');
        return;
    }

    Registry.createAndInstall('next-wallpaper', 'Next Wallpaper');
    Registry.createAndInstall('show-current', 'Show Current Wallpaper');
    console.log('Registry keys set!\n')
}


main();