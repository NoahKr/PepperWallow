
// TODO log all errors into file!!!

import * as Wallpaper from "./helpers/wallpaper.js";

async function main() {
    const args = process.argv.slice(2);
    const firstArg = args[0];

    switch (firstArg) {
        case "next-wallpaper":
            await Wallpaper.next();
            break;
        default:
            console.log(`Supplied argument ${firstArg} is not a valid argument.`)
    }

    process.exit(0);
}

main();