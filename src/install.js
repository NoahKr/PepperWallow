const {askInput, ensurePosixPathFormat} = require("./helpers/utils");
const _ = require('lodash');
const fs = require('fs');

async function main() {
    console.log('Hello! Welcome to the install script for PepperWallow - a barebones wallpaper manager.');
    console.log('This script will setup the configuration file that PepperWallow uses to function.\n');

    await initConfig();

    console.log('Configuration has been set up!')
}

async function initConfig() {
    // TODO allow modifying of config, rather than replacing it
    const wallpaperPath = await initWallpaperDirectory();
    const interval = await initWallpaperChangeInterval();

    await storeConfig(wallpaperPath, interval);
}

async function initWallpaperDirectory() {
    const enteredPath = await askInput('Please enter the path to the directory the wallpapers you want to use are in: ');
    const posixPath = ensurePosixPathFormat(enteredPath);

    if (!posixPath || 0 ===_.trim(posixPath).length) {
        console.log(`Entered path "${enteredPath}" is invalid, please try again.`);
        return await initWallpaperDirectory();
    }

    if (!fs.existsSync(posixPath)) {
        console.log(`Entered path "${enteredPath}" does not exist, please try again.`);
        return await initWallpaperDirectory();
    }

    if (!fs.lstatSync(posixPath).isDirectory()) {
        console.log(`Entered path "${enteredPath}" is not a directory, please try again.`);
        return await initWallpaperDirectory();
    }

    const agreed = await askInput(`Entered path is "${enteredPath}". Is this okay? (Y/n) `);
    if (_.toLower(agreed) !== 'y') {
        return await initWallpaperDirectory();
    }

    return posixPath;
}

async function initWallpaperChangeInterval() {
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

async function storeConfig(wallpaperPath, changeInterval) {
    fs.writeFileSync('./.config', JSON.stringify({wallpaperPath, changeInterval}))
}

main();