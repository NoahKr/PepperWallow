import * as Wallpaper from "./helpers/wallpaper.js";
import {logError} from "./helpers/log.js";

async function main() {
    let source;
    try {
        const args = process.argv.slice(2);
        const action = args[0];
        source = args[1];

        switch (action) {
            case "next-wallpaper":
                await Wallpaper.next(source);
                break;
            case "show-current":
                await Wallpaper.showCurrent(source);
                break;
            default:
                console.log(`Supplied action ${action} is not a valid action.`)
        }
    } catch (e) {
        logError(e, source);
    }

    process.exit(0);
}

main();