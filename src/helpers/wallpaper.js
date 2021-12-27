import {getWallpaper, setWallpaper} from 'wallpaper';
import * as Config from './config.js';
import fs from 'fs';
import _ from 'lodash';

async function current() {
    return await getWallpaper();
}

export async function next() {
    const [path, fileName] = resolveNextWallpaper();

    await setWallpaper(path);
    Config.updateUsedWallpapers(fileName);
}

function resolveNextWallpaper() {
    const used = Config.usedWallpapers();
    const allInDirectory = listDirectory();

    const unused = _.xor(allInDirectory, used);
    const chosenWallpaper = unused[Math.floor(Math.random()*unused.length)];

    // TODO test what happens if they're all used;
    const chosenWallpaperPath = Config.wallpaperPath() + '\\' + chosenWallpaper;
    return [chosenWallpaperPath, chosenWallpaper];
}

function listDirectory() {
    return fs.readdirSync(Config.wallpaperPath());
}

