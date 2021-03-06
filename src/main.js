import * as Wallpaper from "./helpers/wallpaper.js";
import {logError} from "./helpers/log.js";

async function main() {
    let source;
    try {
        const args = process.argv.slice(2);
        const action = args[0];
        source = args[1];

        switch (action) {
            case "boot":
                await Wallpaper.next(source, true);
                break;
            case "next-wallpaper":
                await Wallpaper.next(source);
                break;
            case "show-current":
                await Wallpaper.showCurrent(source);
                break;
            case "previous-wallpaper":
                await Wallpaper.previous(source);
                break;
            default:
                console.log(`Supplied action ${action} is not a valid action.`)
        }
    } catch (e) {
        logError(e, source);
    }

}

main();