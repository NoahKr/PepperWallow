import {
    QMainWindow,
    QWidget,
    QLabel,
    FlexLayout, FileMode, QPushButton, QCheckBox
} from "@nodegui/nodegui";
import { QFileDialog } from "@nodegui/nodegui";

function main() {
    global.win = buildWindow();
}

function buildWindow() {
    const win = new QMainWindow();



    win.setCentralWidget(buildRootView());
    win.setStyleSheet(
        `
    #root-view {
      padding: 15px 15px 15px 15px;
    }
    #selectDirRow {
        flex-direction: row;
    }
    #selectDirLabel {
        padding-right: 5px;
    }
  `
    );

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

    // TODO save button at the end.
}

function buildBasicSection(rootLayout) {
    rootLayout = addSectionHeader(rootLayout, 'Basic settings', 'Basic settings required for the app to function. These are required')


    const selectDirRow = new QWidget();
    const selectDirLayout = new FlexLayout();
    selectDirRow.setLayout(selectDirLayout);
    selectDirRow.setObjectName('selectDirRow');

    const selectDirLabel = new QLabel();
    selectDirLabel.setText('Wallpaper directory:');
    selectDirLabel.setObjectName('selectDirLabel');

    const selectDirButton = new QPushButton();
    selectDirButton.addEventListener('clicked', () => selectFile());
    selectDirButton.setText('Select');

    selectDirLayout.addWidget(selectDirLabel);
    selectDirLayout.addWidget(selectDirButton);

    const checkbox = new QCheckBox();
    checkbox.setText("Change wallpaper on boot");
    checkbox.setChecked(true); // Always checked
    checkbox.setDisabled(true);

    const intervalCheckbox = new QCheckBox();
    intervalCheckbox.setText("Change wallpaper on interval");
    intervalCheckbox.addEventListener('clicked', (checked) => {
        // todo show input field
    });

    rootLayout.addWidget(selectDirRow);
    rootLayout.addWidget(checkbox);
    rootLayout.addWidget(intervalCheckbox);

    return rootLayout;
}

// TODO disable if directory not set
function buildRegistrySection(rootLayout) {
    rootLayout = addSectionHeader(rootLayout, 'Registry keys', 'todo change')

    const checkbox = new QCheckBox();
    checkbox.setText("Enabled");
    checkbox.addEventListener('clicked', (checked) => {
        // todo add to actionList to enable / disable registry

        console.log('was checked', checked);
    });

    rootLayout.addWidget(checkbox);
    return rootLayout;
}

function addSectionHeader(layout, titleText, descriptionText) {
    layout = addSpacer(layout);

    const title = new QLabel();
    title.setInlineStyle("font-size: 24px; font-weight: bold;");
    title.setText(titleText);

    const description = new QLabel();
    description.setInlineStyle("font-size: 14px");
    description.setText(descriptionText);

    layout.addWidget(title);
    layout.addWidget(description);
    return layout;
}

function addSpacer(layout, space = 15) {
    // empty label to enter padding as padding style does not work properly
    const spacer = new QLabel();
    spacer.setInlineStyle(`font-size: ${space}px;`);
    layout.addWidget(spacer);

    return layout;
}

function selectFile() {
    const fileDialog = new QFileDialog();
    fileDialog.setFileMode(FileMode.Directory);
    fileDialog.exec();

    const selectedFiles = fileDialog.selectedFiles();
    console.log(selectedFiles);

    // todo add to actionList to change dir

    return selectedFiles
}

main();


