import rlp from 'readline';

import path from 'path';

const __dirname = path.resolve();

import childProcess from 'child_process';

const rl = rlp.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function askInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (input) => resolve(input) );
    });
}

export function getCurrentDirPath() {
    return __dirname;
}

// export function exec() {
//     return new Promise(async resolve => {
//         childProcess.exec(command, (err, stout, stderr) {
//             if (err) {
//                 reject(stderr);
//             } else {
//                 resolve(stdout)
//             }
//         });
//     });
// }