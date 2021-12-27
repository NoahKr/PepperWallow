const rlp = require('readline');
const path = require('path');
const upath = require('upath');
const _ = require('lodash');

const rl = rlp.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (input) => resolve(input) );
    });
}

function ensurePosixPathFormat(givenPath) {
    let unixPath = upath.toUnix(givenPath);
    const isWSL = _.startsWith(__dirname, '/mnt/');

    if (isWSL) {
        const match = unixPath.match(/^(.*):.*$/);
        if (match) {
            const driveLetter = match[1];
            unixPath = unixPath.replace(/^(.*:)/, `/mnt/${driveLetter.toLowerCase()}`)
        }
    }

    return unixPath;
}

module.exports = {
    askInput,
    ensurePosixPathFormat
};