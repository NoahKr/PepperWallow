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
    try {
        childProcess.execSync(`explorer.exe /select,"${path}"`);
    } catch (e) {
        // Ignore, bug in windows causes exit code 1 in Node.
        // https://github.com/nodejs/node/issues/23098
    }

    log(`shown current wallpaper (${path})`, source);
}

export async function next(source) {
    // TODO check if there is a nextStack

    const [path, fileName] = resolveNextWallpaper(source);

    await setWallpaper(path);
    Config.updateUsedWallpapers(fileName);

    log(`set to next wallpaper: ${fileName}`, source);
}

function resolveNextWallpaper(source, attempt = 0) {
    const next = Config.shiftNextWallpaper();
    if (next) {
        // If a wallpaper is set in the next stack, use that instead.
        // This is so when going previous and next wallpaper that the next one is not different from before.
        return [resolvePathFromFileName(next), next];
    }

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

export async function previous(source) {
    const currentPath = await current();
    const currentFileName = resolveFileNameFromPath(currentPath);

    const [previousPath, fileName] = await resolvePreviousWallpaper(currentFileName);
    if (!previousPath) {
        log(`attempted to set to previous wallpaper, but no previous wallpaper found`, source);
        return;
    }

    await setWallpaper(previousPath);
    Config.addNextWallpaper(currentFileName);
    log(`set to previous wallpaper: ${fileName}`, source);
}

async function resolvePreviousWallpaper(currentFileName) {
    const used = Config.usedWallpapers();

    const currentIndex = used.indexOf(currentFileName);
    if (currentIndex < 0) {
        // There is no wallpaper before this one, could be that this is the first of the stack, or that this tool has not set a wallpaper yet.
        return [];
    }

    const previousFileName = _.get(used, [currentIndex-1]);
    const previousPath = resolvePathFromFileName(previousFileName);

    return [previousPath, previousFileName];
}

function resolveFileNameFromPath(path) {
    return _.last(_.split(path, '\\'));
}

function resolvePathFromFileName(fileName) {
    if (!fileName) {
        return;
    }

    const basePath = Config.wallpaperPath();
    return `${basePath}\\${fileName}`;
}

