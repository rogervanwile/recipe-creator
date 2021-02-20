const readline = require("readline");
const fs = require('fs');
const path = require('path');
const child_process = require("child_process");
const showdown = require('showdown');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function copyFileSync(source: string, target: string, newFileName: string | null = null) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, newFileName ? newFileName : path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source: string, target: string) {
    var files = [];

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    // Check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file: string) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

rl.on("close", function () {
    process.exit(0);
});

rl.question("What is the new version? ", function (version: string) {
    // Remove existing release folder to start clean

    if (fs.existsSync('./foodblogkitchen-toolkit/')) {
        fs.rmdirSync('./foodblogkitchen-toolkit/', {
            force: true,
            recursive: true
        });
    }

    // Copy files and folders into the release folder

    const foldersToCopy: string[] = [
        './assets',
        './build',
        './inc',
        './languages',
        './templates',
        './vendor',
        './src' // TODO: Remove in the next release
    ];

    const filesToCopy: string[] = [
        './foodblogkitchen-toolkit.php',
        './index.php',
        './screenshot-1.png',
        './screenshot-2.png',
        './readme.txt',
        './uninstall.php'
    ];

    foldersToCopy.forEach(folder => {
        copyFolderRecursiveSync(folder, './foodblogkitchen-toolkit');
    });

    filesToCopy.forEach(file => {
        copyFileSync(file, './foodblogkitchen-toolkit');
    });

    // Duplicate the de_DE translation files for de_AT and de_CH
    // Read all files in the translations folder and check, if it is a german file
    fs.readdirSync('./languages').forEach((file: string) => {
        if (file.indexOf('de_DE') !== -1) {
            // Its a german file
            const atFileName = file.replace('de_DE', 'de_AT');
            const chFileName = file.replace('de_DE', 'de_CH');

            copyFileSync('./languages/' + file, './foodblogkitchen-toolkit/languages/', atFileName);
            copyFileSync('./languages/' + file, './foodblogkitchen-toolkit/languages/', chFileName);
        }
    })

    rl.close();
    return;

    // Create the Zip file

    child_process.execSync(`zip -r ./updates/archives/${version}.zip ./foodblogkitchen-toolkit`);

    // Copy the zip as latest

    child_process.execSync(`yes | cp ./updates/archives/${version}.zip ./updates/archives/latest.zip`);

    // Remove the temporary release folder
    fs.rmdirSync('./foodblogkitchen-toolkit/', {
        force: true,
        recursive: true
    });

    // Update the info.json

    const currentTime = (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const converter = new showdown.Converter();
    converter.setOption('noHeaderId', true);
    converter.setOption('headerLevelStart', 3);
    const changelogMarkdown = fs.readFileSync('./changelog.md', 'utf8');

    const changelogHtml = converter.makeHtml(changelogMarkdown);

    const infoJson = {
        "version": version,
        "download_url": `https://updates.foodblogkitchen.de/foodblogkitchen-toolkit/archives/${version}.zip`,
        "requires": "5.5.0",
        "tested": "5.6.0",
        "requires_php": "7.4",
        "last_updated": currentTime,
        "sections": {
            "description": "Toolkit for your Foodblog to optimize your blog for search engines. Including a Recipe block for the Gutenberg editor.",
            "installation": "Upload the plugin to your blog, activate it, that's it!",
            "changelog": changelogHtml
        }
    };

    fs.writeFileSync('./updates/info.json', JSON.stringify(infoJson, null, 2));

    rl.close();
});