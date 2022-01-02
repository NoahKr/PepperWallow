import * as Installation from './installation.js';

export function set(wallpaperPath, changeInterval, usedWallpapers = []) {
    Installation.storeConfig(JSON.stringify({wallpaperPath, changeInterval, usedWallpapers, nextWallpapers: []}));
}

function update(newConfig) {
    Installation.storeConfig(JSON.stringify(newConfig));
}

function get() {
    const configContent = Installation.getConfig();

    if (!configContent) {
        return {
            wallpaperPath: null,
            changeInterval: null,
            usedWallpapers: [],
            nextWallpapers: []
        }
    }

    return JSON.parse(configContent);
}

export function wallpaperPath() {
    return get().wallpaperPath
}

export function changeInterval() {
    return get().changeInterval
}

export function usedWallpapers() {
    return get().usedWallpapers;
}

export function shiftNextWallpaper() {
    const config = get();

    console.log('nextWallpapers', config.nextWallpapers);
    const next = config.nextWallpapers.shift();
    console.log('next', next);
    update(config);

    return next;
}


export function updateUsedWallpapers(usedWallpaper) {
    const config = get();

    // Only update if not already set.
    if (config.usedWallpapers.indexOf(usedWallpaper) === -1) {
        config.usedWallpapers.push(usedWallpaper);
        update(config);
    }
}

export function addNextWallpaper(usedWallpaper) {
    const config = get();

    config.nextWallpapers.unshift(usedWallpaper);
    update(config);
}

export function clearUsedWallpapers() {
    const config = get();

    config.usedWallpapers = [];
    update(config);
}