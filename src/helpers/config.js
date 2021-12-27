import fs from 'fs';
const configPath = './.config';

export function set(wallpaperPath, changeInterval, usedWallpapers = []) {
    fs.writeFileSync(configPath, JSON.stringify({wallpaperPath, changeInterval, usedWallpapers}))
}

function update(newConfig) {
    fs.writeFileSync(configPath, JSON.stringify(newConfig))
}

function get() {
    return JSON.parse(fs.readFileSync(configPath));
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