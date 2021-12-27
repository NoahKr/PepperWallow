import * as Installation from './installation.js';

export function set(wallpaperPath, changeInterval, usedWallpapers = []) {
    Installation.storeConfig(JSON.stringify({wallpaperPath, changeInterval, usedWallpapers}));
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
            usedWallpapers: null
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

export function updateUsedWallpapers(usedWallpaper) {
    const config = get();

    config.usedWallpapers.push(usedWallpaper);
    update(config);
}

export function clearUsedWallpapers() {
    const config = get();

    config.usedWallpapers = [];
    update(config);
}