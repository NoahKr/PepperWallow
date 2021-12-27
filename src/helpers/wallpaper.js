import {getWallpaper, setWallpaper} from 'wallpaper';
import * as Config from './config.js';
import fs from 'fs';
import _ from 'lodash';
import {log} from "./log.js";
import childProcess from 'child_process';

async function current() {
    return await getWallpaper();
}

export async function showCurrent(source) {
    const path = await current();
    const message = `The currently shown wallpaper is: ${path}`;
    childProcess.execSync(`msg %username% ${message}`);

    log(`shown current wallpaper (${path})`, source);
}

export async function next(source) {
    const [path, fileName] = resolveNextWallpaper(source);

    await setWallpaper(path);
    Config.updateUsedWallpapers(fileName);

    log(`set wallpaper to ${fileName}`, source);
}

function resolveNextWallpaper(source, attempt = 0) {
    const used = Config.usedWallpapers();
    const allInDirectory = listDirectory();

    const unused = _.xor(allInDirectory, used);
    const chosenWallpaper = unused[Math.floor(Math.random()*unused.length)];

    if (!chosenWallpaper) {
        if (attempt < 3) {
            Config.clearUsedWallpapers();

            log(`All wallpapers in directory have been shown, starting from top`, source);
            return resolveNextWallpaper(source, attempt+1);
        }

        throw new Error('Attempts to resolve next wallpapers exceeded retryCount. Is the directory empty?')
    }

    const chosenWallpaperPath = Config.wallpaperPath() + '\\' + chosenWallpaper;
    return [chosenWallpaperPath, chosenWallpaper];
}

function listDirectory() {
    return fs.readdirSync(Config.wallpaperPath());
}

