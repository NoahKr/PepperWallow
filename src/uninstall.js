import * as Installation from "./helpers/installation.js"
import * as Registry from "./helpers/registry.js"
import * as Scheduler from './helpers/scheduler.js';
import {askInput} from "./helpers/utils.js";
import {log} from "./helpers/log.js";

import _ from "lodash";

async function main() {
    const agreed = await askInput(`This will completely uninstall the PepperWallow application. Proceed? (Y/n) `);
    if (_.toLower(agreed) !== 'y') {
        process.exit(0);
        return;
    }

    Scheduler.uninstall('cmd-file');
    Registry.uninstall();
    Installation.uninstall();

    log(`application uninstalled`, 'cmd-file');
    console.log('Uninstall complete. You can now safely close this console and remove the directory');
}


main();