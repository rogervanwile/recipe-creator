#!/bin/bash
echo Version
read version
rm -rf ./foodblogkitchen-toolkit
mkdir foodblogkitchen-toolkit
mkdir updates
mkdir updates/archives
rsync -ax --exclude node_modules/ --exclude updates/ --exclude foodblogkitchen-toolkit/ --exclude .git --exclude .editorconfig --exclude .DS_Store --exclude readme.md ./ ./foodblogkitchen-toolkit/
zip -r updates/archives/$version.zip foodblogkitchen-toolkit
rm -rf foodblogkitchen-toolkit

# Upload to the server
scp ./updates/archives/$version.zip u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-toolkit/archives/
scp ./updates/info.json u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-toolkit/