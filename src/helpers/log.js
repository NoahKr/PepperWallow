import fs from 'fs';

export function log(message, source) {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    fs.appendFileSync('./.log', `[${source}] ${localISOTime}: ${message}\n`);
}

export function logError(error, source) {
    log(error.stack, source);
}