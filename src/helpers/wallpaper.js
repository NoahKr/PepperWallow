import {getWallpaper, setWallpaper} from 'wallpaper';
import * as Config from './config.js';
import fs from 'fs';
import _ from 'lodash';
import {log} from "./log.js";

async function current() {
    return await getWallpaper();
}

export async function next(source) {
    const [path, fileName] = resolveNextWallpaper();

    await setWallpaper(path);
    Config.updateUsedWallpapers(fileName);

    log(`set wallpaper to ${fileName}`, source);
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

