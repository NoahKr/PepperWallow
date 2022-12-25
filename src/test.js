import * as Wallpaper from "./helpers/wallpaper.js";
import {logError} from "./helpers/log.js";
import * as Notification from "./helpers/notifcation.js";

async function main() {
    Notification.notify('test', "PepperWallow encountered an error, see log for more details", true)
}

main();