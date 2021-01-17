#!/bin/bash
echo Version
read version
rm -rf ./foodblogkitchen-toolkit
mkdir foodblogkitchen-toolkit
mkdir updates
mkdir updates/archives
rsync -ax --exclude node_modules/ --exclude updates/ --exclude foodblogkitchen-toolkit/ --exclude .git --exclude .editorconfig --exclude .DS_Store --exclude readme.md ./ ./foodblogkitchen-toolkit/
zip -r updates/archives/$version.zip foodblogkitchen-toolkit
yes | cp updates/archives/$version.zip updates/archives/latest.zip
rm -rf foodblogkitchen-toolkit