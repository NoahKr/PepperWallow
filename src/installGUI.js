import {
    ButtonRole,
    FileMode,
    FlexLayout,
    QCheckBox,
    QFileDialog,
    QLabel,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QSpinBox,
    QWidget,
    WidgetEventTypes
} from "@nodegui/nodegui";
import * as Config from "./helpers/config.js";
import * as Scheduler from "./helpers/scheduler.js";
import * as Registry from "./helpers/registry.js";
import _ from "lodash";
import {log} from "./helpers/log.js";


let settings = {
  wallpaperDir: null,
  intervalChecked: false,
  interval: 1,
  registryNextPrev: false,
  registryShowCurrent: false,
  registryFreeze: false,
  notifications: false,
};

function main() {
    log(`configuration opened`, 'cmd-file');

    loadCurrentConfig();
    global.win = buildWindow();
}

function loadCurrentConfig() {
    settings.wallpaperDir = Config.wallpaperPath();
    settings.interval = Config.changeInterval();

    if (settings.interval) {
        settings.intervalChecked = true;
    } else {
        settings.interval = 1;
    }

    settings.registryNextPrev = Config.registryNextPrev();
    settings.registryShowCurrent = Config.registryShowCurrent();
    settings.registryFreeze = Config.registryFreeze();
    settings.notifications = Config.notifications();
}

function buildWindow() {
    const win = new QMainWindow();

    win.setCentralWidget(buildRootView());
    win.setStyleSheet(
        `
    #root-view {
      padding: 15px 15px 15px 15px;
    }
    #selectDirRow, #intervalRow, #submitBar {
        flex-direction: row;
    }
    #selectDirLabel {
        padding-right: 5px;
    }
    #selectDirButton {
      width: 325px;
    }
    
    #submitBar {
        justify-content: 'flex-end';
    }
  `
    );
    win.setWindowTitle('Pepperwallow configuration')
    win.show();

    return win;
}

function buildRootView() {
    const rootView = new QWidget();
    rootView.setObjectName("root-view");

    const rootLayout = new FlexLayout();
    rootView.setLayout(rootLayout);

    buildRootLayout(rootLayout);


    return rootView
}

function buildRootLayout(rootLayout) {
    const pageTitle = new QLabel();
    pageTitle.setInlineStyle("font-size: 30px; font-weight: bold;");
    pageTitle.setText("Pepperwallow configuration");
    rootLayout.addWidget(pageTitle);

    rootLayout = addSpacer(rootLayout); // Some extra space after title

    rootLayout = buildBasicSection(rootLayout);
    rootLayout = buildRegistrySection(rootLayout);

    rootLayout = addSpacer(rootLayout); // Some extra space before submit bar

    const submitBar = new QWidget();
    const submitLayout = new FlexLayout();
    submitBar.setLayout(submitLayout);
    submitBar.setObjectName('submitBar');

    const cancelButton = new QPushButton();
    cancelButton.setText('Cancel');
    cancelButton.setObjectName('cancelButton');
    cancelButton.addEventListener('clicked', () => {
        process.exit(0)
    })

    const saveButton = new QPushButton();
    saveButton.setText('Save');
    saveButton.setObjectName('saveButton');
    saveButton.addEventListener('clicked', () => save())

    submitLayout.addWidget(cancelButton);
    submitLayout.addWidget(saveButton);

    rootLayout.addWidget(submitBar);
}

function buildBasicSection(rootLayout) {
    rootLayout = addSectionHeader(rootLayout, 'Basic settings', 'Basic settings required for the app to function')

    const selectDirRow = new QWidget();
    const selectDirLayout = new FlexLayout();
    selectDirRow.setLayout(selectDirLayout);
    selectDirRow.setObjectName('selectDirRow');

    const selectDirLabel = new QLabel();
    selectDirLabel.setText('Wallpaper directory:');
    selectDirLabel.setObjectName('selectDirLabel');

    const selectDirButton = new QPushButton();
    selectDirButton.setObjectName('selectDirButton');
    selectDirButton.addEventListener('clicked', () => selectFile(selectDirButton));
    setSelectDirButtonText(selectDirButton)

    selectDirLayout.addWidget(selectDirLabel);
    selectDirLayout.addWidget(selectDirButton);

    const checkbox = new QCheckBox();
    checkbox.setText("Change wallpaper on boot");
    checkbox.setChecked(true); // Always checked
    checkbox.setDisabled(true);

    const intervalRow = new QWidget();
    const intervalLayout = new FlexLayout();
    intervalRow.setLayout(intervalLayout);
    intervalRow.setObjectName('intervalRow');

    const intervalLabel1 = new QLabel();
    intervalLabel1.setText('- change every ');

    const intervalNumberField = new QSpinBox();
    intervalNumberField.setMinimum(1); // every min
    intervalNumberField.setMaximum((23*60) + 59); // every 23:59
    intervalNumberField.setValue(settings.interval);
    intervalNumberField.addEventListener(WidgetEventTypes.KeyRelease, () => {
        const text =  intervalNumberField.text();
        settings.interval = parseInt(text);
    });
    intervalNumberField.addEventListener(WidgetEventTypes.MouseButtonRelease, () => {
        const text =  intervalNumberField.text();
        settings.interval = parseInt(text);
    });

    const intervalLabel2 = new QLabel();
    intervalLabel2.setText(' minute(s)');

    intervalChecked(intervalLabel1, intervalNumberField, intervalLabel2);

    const intervalCheckbox = new QCheckBox();
    intervalCheckbox.setText("Change wallpaper on interval");
    intervalCheckbox.addEventListener('clicked', (checked) => {
        settings.intervalChecked = checked;
        intervalChecked(intervalLabel1, intervalNumberField, intervalLabel2);
    });
    intervalCheckbox.setChecked(settings.intervalChecked);

    intervalLayout.addWidget(intervalCheckbox);
    intervalLayout.addWidget(intervalLabel1);
    intervalLayout.addWidget(intervalNumberField);
    intervalLayout.addWidget(intervalLabel2);

    const showNotificationsCheckbox = new QCheckBox();
    showNotificationsCheckbox.setText("Show notifications (on wallpaper change, freeze, error, etc.)");
    showNotificationsCheckbox.addEventListener('clicked', (checked) => {
        settings.notifications = checked;
    });
    showNotificationsCheckbox.setChecked(settings.notifications);

    rootLayout.addWidget(selectDirRow);
    rootLayout.addWidget(checkbox);
    rootLayout.addWidget(intervalRow);
    rootLayout.addWidget(showNotificationsCheckbox);

    return rootLayout;
}

function selectFile(selectDirButton) {
    const fileDialog = new QFileDialog();
    fileDialog.setFileMode(FileMode.Directory);
    fileDialog.exec();

    const selectedFiles = fileDialog.selectedFiles();
    settings.wallpaperDir = _.get(selectedFiles, '0');

    setSelectDirButtonText(selectDirButton)

    return selectedFiles
}

function setSelectDirButtonText(selectDirButton) {
    let text = 'Select';

    const wallpaperDir = settings.wallpaperDir;
    if (wallpaperDir) {
        text = wallpaperDir;

        // TODO test
        if (wallpaperDir.length > 40) {
            text= '...' + wallpaperDir.substring(wallpaperDir.length - 40);
        }
    }
    selectDirButton.setText(text, 0);
}

function intervalChecked(intervalLabel1, intervalNumberField, intervalLabel2) {
    const checked = settings.intervalChecked;

    intervalLabel1.setHidden(!checked)
    intervalNumberField.setHidden(!checked)
    intervalLabel2.setHidden(!checked)
}

// TODO disable if directory not set
function buildRegistrySection(rootLayout) {
    rootLayout = addSectionHeader(rootLayout, 'Registry keys', 'Registry keys add context menu items to your desktop so you can manually perform actions')

    const nextPrevCheckbox = new QCheckBox();
    nextPrevCheckbox.setText("Next / Previous wallpaper");
    nextPrevCheckbox.addEventListener('clicked', (checked) => {
        settings.registryNextPrev = checked;
    });
    nextPrevCheckbox.setChecked(settings.registryNextPrev);

    const showCurrentCheckbox = new QCheckBox();
    showCurrentCheckbox.setText("Show current wallpaper");
    showCurrentCheckbox.addEventListener('clicked', (checked) => {
        settings.registryShowCurrent = checked;
    });
    showCurrentCheckbox.setChecked(settings.registryShowCurrent);

    const freezeCheckbox = new QCheckBox();
    freezeCheckbox.setText("Freeze / Unfreeze (beta)");
    freezeCheckbox.addEventListener('clicked', (checked) => {
        settings.registryFreeze = checked;
    });
    freezeCheckbox.setChecked(settings.registryFreeze);

    rootLayout.addWidget(nextPrevCheckbox);
    rootLayout.addWidget(showCurrentCheckbox);
    rootLayout.addWidget(freezeCheckbox);
    return rootLayout;
}

function addSectionHeader(layout, titleText, descriptionText) {
    layout = addSpacer(layout);

    const title = new QLabel();
    title.setInlineStyle("font-size: 24px; font-weight: bold;");
    title.setText(titleText);

    const description = new QLabel();
    description.setInlineStyle("font-size: 11px");
    description.setText(descriptionText);

    layout.addWidget(title);
    layout.addWidget(description);

    layout = addSpacer(layout);

    return layout;
}

function addSpacer(layout, space = 15) {
    // empty label to enter padding as padding style does not work properly
    const spacer = new QLabel();
    spacer.setInlineStyle(`font-size: ${space}px;`);
    layout.addWidget(spacer);

    return layout;
}

function showAlert(text, cb) {
    const messageBox = new QMessageBox();
    messageBox.setText(text);
    messageBox.setWindowTitle('Warning');

    const accept = new QPushButton();
    accept.setText('Dismiss');
    if (cb) {
        accept.addEventListener('clicked', () => cb());
    }

    messageBox.addButton(accept, ButtonRole.AcceptRole);
    messageBox.exec();
}

function save() {

    if (!validate()) {
        return;
    }

    // Always uninstall these as they might have changed
    Scheduler.uninstall('cmd-file');
    Registry.uninstall();

    const interval = settings.intervalChecked ? settings.interval : null;
    Config.set(settings.wallpaperDir, interval, settings.registryNextPrev, settings.registryShowCurrent, settings.registryFreeze, settings.notifications);
    Scheduler.install('cmd-file'); // Only installs boot by default. Interval is installed when wallpaper is first changed

    const now = Date.now();
    let changeWallpaperAt = 'boot'

    // If change interval selected add first scheduled task right now
    if (interval) {
        const date = new Date(now + (interval*60*1000))

        let hours = date.getHours();
        if (hours.length < 2) {
            hours = "0" + hours
        }

        let minutes = date.getMinutes();
        if (minutes.length < 2) {
            minutes = "0" + minutes
        }

        changeWallpaperAt = hours + ":" + minutes;
        Scheduler.setTimelyTask('cmd-file', now);
    }

    if (settings.registryNextPrev) {
        Registry.createAndInstall('next-wallpaper', 'Next Wallpaper');
        Registry.createAndInstall('previous-wallpaper', 'Previous Wallpaper');
    }
    if (settings.registryShowCurrent) {
        Registry.createAndInstall('show-current', 'Show Current Wallpaper');
    }

    // TODO check if currently frozen
    if (settings.registryFreeze) {
        if (Config.isFrozen()) {
            Registry.createAndInstall('toggle-freeze', 'Unfreeze');
        } else {
            Registry.createAndInstall('toggle-freeze', 'Freeze');
        }
    }

    log(`application installed/configured, settings: ${JSON.stringify(settings)}`, 'cmd-file');
    showAlert(`Settings saved! Next wallpaper change will happen at ${changeWallpaperAt}`, () => process.exit(0))
}

function validate() {
    if (!settings.wallpaperDir) {
        showAlert('No wallpaper directory has been selected')
        return false;
    }

    if (!settings.interval && settings.intervalChecked) {
        showAlert('Interval checkbox checked but no value specified')
        return false;
    }

    return true;
}

main();


