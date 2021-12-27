import fs from 'fs';

export function log(message, source) {
    const prefix = new Date().toISOString();

    fs.appendFileSync('./.log', `[${source}] ${prefix}: ${message}\n`);
}

export function logError(error, source) {
    log(error.message, source);
}

export function createLogFile() {

}