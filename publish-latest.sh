#!/bin/bash
echo Version
read version

# Upload to the server
scp ./updates/archives/$version.zip u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-toolkit/archives/
scp ./updates/archives/latest.zip u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-toolkit/archives/
scp ./updates/info.json u102897981@access850832273.webspace-data.io:updates/foodblogkitchen-toolkit/