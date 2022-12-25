import * as Wallpaper from "./helpers/wallpaper.js";
import {logError} from "./helpers/log.js";
import * as Notification from "./helpers/notifcation.js";

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
            case "toggle-freeze":
                await Wallpaper.toggleFreeze(source);
                break;
            default:
                console.log(`Supplied action ${action} is not a valid action.`)
        }

        // Small delay in exit to give enough time to display notification
        setTimeout(() => process.exit(0), 5000)
    } catch (e) {
        logError(e, source);
        Notification.notify(source, "PepperWallow encountered an error, see log for more details", true)

        // Small delay in exit to give enough time to display notification
        setTimeout(() => process.exit(0), 5000)
    }

}

main();