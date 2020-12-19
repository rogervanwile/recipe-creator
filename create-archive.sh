#!/bin/bash
echo Version
read version
rm -rf ./foodblogkitchen-recipes
mkdir foodblogkitchen-recipes
mkdir updates
mkdir updates/archives
rsync -ax --exclude node_modules/ --exclude updates/ --exclude foodblogkitchen-recipes/ --exclude .git --exclude .editorconfig --exclude .DS_Store --exclude readme.md ./ ./foodblogkitchen-recipes/
zip -r updates/archives/$version.zip foodblogkitchen-recipes
rm -rf foodblogkitchen-recipes

# Upload to the server
scp ./updates/archives/$version.zip u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-recipes/archives/
scp ./updates/info.json u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-recipes/