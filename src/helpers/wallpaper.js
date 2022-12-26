import {getWallpaper, setWallpaper} from 'wallpaper';
import * as Config from './config.js';
import fs from 'fs';
import _ from 'lodash';
import {log} from "./log.js";
import childProcess from 'child_process';
import * as Scheduler from "./scheduler.js";
import * as Registry from "./registry.js";
import * as Notification from "./notifcation.js";

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

export async function next(source, force = false, unfreeze = false) {
    const now = Date.now();

    if (Config.isFrozen() && source !== 'registry') {
        log(`next wallpaper action skipped. Wallpapers are frozen. Unfreeze to change wallpaper`, source);
        return;
    }

    // Registry action ignore these time checks. Unless force is given (so boot will always change wallpaper)
    const interval = Config.changeInterval();

    // Do not change wallpaper on unfreeze if it's only changed at boot
    if (unfreeze && !interval) {
        return;
    }

    if (unfreeze || (source !== 'registry' && !force && interval)) {
        if (Config.wallpaperChangedAt()) {

            // 1 minute leniency if via shtasks
            let leniancy = 0
            if (source !== 'registry') {
                leniancy = 60*1000
            }

            const changeIntervalInMilliSeconds = interval*60*1000;
            const canSetWallpaperFrom = Config.wallpaperChangedAt() + changeIntervalInMilliSeconds - leniancy;

            if (now < canSetWallpaperFrom) {
                log(`next wallpaper action skipped. Now: ${now}. Wallpaper last set at: ${Config.wallpaperChangedAt()}. Can be set again at ${canSetWallpaperFrom}`, source);
                return;
            }
            // else wallpaper has been set longer ago then the designated time.
        }
        // else wallpaper has never been set. Free to set
    }

    const [path, fileName] = resolveNextWallpaper(source);

    await setWallpaper(path);
    Config.updateUsedWallpapers(fileName);
    Config.setWallpaperChangedAt(now);
    Scheduler.setTimelyTask(source, now);

    let nextWallpaperTime = 'boot';
    if (interval) {
        const nextWallpaperTimestamp = now + (interval*60*1000);
        const nextWallpaperDate = new Date(nextWallpaperTimestamp)

        let hours = nextWallpaperDate.getHours();
        if (`${hours}`.length < 2) {
            hours = "0" + hours
        }

        let minutes = nextWallpaperDate.getMinutes();
        if (`${minutes}`.length < 2) {
            minutes = "0" + minutes
        }

        nextWallpaperTime = hours + ":" + minutes;
    }

    log(`set to next wallpaper: ${fileName} - next change is at ${nextWallpaperTime}`, source);
    Notification.notify(source, `Set (next) wallpaper: ${fileName} - next change is at ${nextWallpaperTime}`)
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
    const now = Date.now();

    const currentPath = await current();
    const currentFileName = resolveFileNameFromPath(currentPath);

    const [previousPath, fileName] = await resolvePreviousWallpaper(currentFileName);
    if (!previousPath) {
        log(`attempted to set to previous wallpaper, but no previous wallpaper found`, source);
        Notification.notify(source, `No previous wallpaper found`)
        return;
    }

    await setWallpaper(previousPath);
    Config.addNextWallpaper(currentFileName);
    Config.setWallpaperChangedAt();
    Scheduler.setTimelyTask(source, now);

    log(`set to previous wallpaper: ${fileName}`, source);
    Notification.notify(source, `Set (previous) wallpaper: ${fileName}`)
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

export async function toggleFreeze(source) {
    const wasFrozen = Config.isFrozen();
    const newFrozen = !wasFrozen
    Config.setFrozen(newFrozen);

    if (newFrozen) {
        Registry.createAndInstall('toggle-freeze', 'Unfreeze');
        log(`Froze wallpapers`, source);

        Notification.notify(source, "Wallpapers frozen")
    } else {
        Registry.createAndInstall('toggle-freeze', 'Freeze');
        log(`Unfroze wallpapers - attempting to set next wallpaper`, source);
        Notification.notify(source, "Wallpapers unfrozen")

        await next(source, false, true);
    }

}


