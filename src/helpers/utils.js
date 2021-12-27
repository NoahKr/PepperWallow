import rlp from 'readline';
import upath from 'upath';
import _ from 'lodash';

import path from 'path';
const __dirname = path.resolve();

const rl = rlp.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function askInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (input) => resolve(input) );
    });
}

// export function toPosixFormat(givenPath) {
//     let unixPath = upath.toUnix(givenPath);
//     const isWSL = _.startsWith(__dirname, '/mnt/');
//
//     if (isWSL) {
//         const match = unixPath.match(/^(.*):.*$/);
//         if (match) {
//             const driveLetter = match[1];
//             unixPath = unixPath.replace(/^(.*:)/, `/mnt/${driveLetter.toLowerCase()}`)
//         }
//     }
//
//     return unixPath;
// }

export function toWinFormat() {

}