
// TODO log all errors into file!!!

import * as Wallpaper from "./helpers/wallpaper.js";

function main() {
    const args = process.argv.slice(2);
    const firstArg = args[0];

    switch (firstArg) {
        case "next-wallpaper":
            Wallpaper.next();
            break;
        default:
            console.log(`Supplied argument ${firstArg} is not a valid argument.`)
    }

}

main();