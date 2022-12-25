import {getCurrentDirPath} from "./utils.js";
import {logError} from "./log.js";
import notifier from 'node-notifier';

export function notify(source, text, error = false) {
    try {
        const iconPath = getCurrentDirPath() + '\\assets\\salt.ico'
        console.log('iconPath', iconPath);

        notifier.notify({
            appID: 'PepperWallow',
            title: error ? 'Error' : 'Info',
            message: text,

            icon: iconPath,
            timeout: 5 // dismiss automatically after 5 seconds
        });
    } catch (e) {
        logError(e, source);

        // Do not throw, notifications are less important
    }
}