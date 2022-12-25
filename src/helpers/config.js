import * as Installation from './installation.js';

export function set(wallpaperPath, changeInterval = null, registryNextPrev = false, registryShowCurrent = false, registryFreeze = false, notifications = false) {

    // TODO do not clear used and next wallpapers
    const usedWallpapersVal = usedWallpapers();
    const nextWallpapersVal = nextWallpapers();
    const wallpaperChangedAtVal = wallpaperChangedAt();
    let frozenVal = isFrozen();

    // Else you can get stuck ;p
    if (!registryFreeze) {
        frozenVal = false;
    }

    Installation.storeConfig(JSON.stringify({
        wallpaperPath,
        changeInterval,
        registryNextPrev,
        registryShowCurrent,
        registryFreeze,
        notifications,
        usedWallpapers: usedWallpapersVal,
        nextWallpapers: nextWallpapersVal,
        wallpaperChangedAt: wallpaperChangedAtVal,
        frozen: frozenVal
    }));
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
            registryNextPrev: false,
            registryShowCurrent: false,
            registryFreeze: false,
            notifications: false,
            usedWallpapers: [],
            nextWallpapers: [],
            wallpaperChangedAt: null,
            frozen: false
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

export function registryNextPrev() {
    return get().registryNextPrev
}

export function registryShowCurrent() {
    return get().registryShowCurrent
}

export function registryFreeze() {
    return get().registryFreeze
}

export function notifications() {
    return get().notifications
}

export function usedWallpapers() {
    return get().usedWallpapers;
}

export function nextWallpapers() {
    return get().nextWallpapers;
}

export function wallpaperChangedAt() {
    return get().wallpaperChangedAt;
}

export function isFrozen() {
    return get().frozen;
}

export function shiftNextWallpaper() {
    const config = get();

    const next = config.nextWallpapers.shift();
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

export function setWallpaperChangedAt(timestamp) {
    const config = get();

    config.wallpaperChangedAt = timestamp;
    update(config);
}


export function clearUsedWallpapers() {
    const config = get();

    config.usedWallpapers = [];
    update(config);
}

export function setFrozen(frozen) {
    const config = get();

    config.frozen = frozen;
    update(config);
}