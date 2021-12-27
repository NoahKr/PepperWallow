import * as Wallpaper from "./helpers/wallpaper.js";
import {logError} from "./helpers/log.js";

async function main() {
    try {
        const args = process.argv.slice(2);
        const command = args[0];
        const source = args[1];

        switch (command) {
            case "next-wallpaper":
                await Wallpaper.next(source);
                break;
            case "show-current":
                await Wallpaper.showCurrent(source);
                break;
            default:
                console.log(`Supplied argument ${firstArg} is not a valid argument.`)
        }
    } catch (e) {
        logError(e, source);
    }

    process.exit(0);
}

main();