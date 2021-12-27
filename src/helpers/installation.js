import fs from 'fs';
import {getCurrentDirPath} from "./utils.js";

const installationPath = '.installation';
const binariesPath = `${installationPath}/bin`;
const configPath = `${installationPath}`;

export function createActionCmd(action, source) {
    const currentDir = getCurrentDirPath();
    const fileContent = `"C:\\Program Files\\nodejs\\npm.cmd" run ${action} --prefix "${currentDir}" -- ${source}`;

    const posixPath = addBinary(`run-${source}-${action}.cmd`, fileContent);
    return posixPath.replace(/\//g, '\\');
}

export function storeConfig(config) {
    setFileContent(configPath, 'config', config);
}

export function getConfig() {
    return getFileContent(configPath, 'config');
}

export function addBinary(name, content) {
    return setFileContent(binariesPath, name, content);
}

export function getBinaryPathInWinFormat(fileName) {
    const currentDirPath = getCurrentDirPath();
    return `${currentDirPath}/${binariesPath}/${fileName}`.replace(/\//g, '\\');
}

function setFileContent(dirPath, fileName, content) {
    ensureDirExists(dirPath);
    const resolvedPath = `${dirPath}/${fileName}`;

    fs.writeFileSync(resolvedPath, content);

    const currentDirPath = getCurrentDirPath();
    return `${currentDirPath}/${resolvedPath}`;
}

function getFileContent(dirPath, fileName) {
    const filePath = `${dirPath}/${fileName}`;
    if (!fs.existsSync(filePath)) {
        return null;
    }

    return fs.readFileSync(filePath, 'utf-8');
}


function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}