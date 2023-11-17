#!/bin/bash
echo Version
read version

source .env

# Upload to the server
sshpass -p $FTP_PASSWORD scp ./updates/archives/$version.zip $FTP_USER@$FTP_SERVER:updates/recipe-creator/archives/
sshpass -p $FTP_PASSWORD scp ./updates/archives/latest.zip $FTP_USER@$FTP_SERVER:updates/recipe-creator/archives/
sshpass -p $FTP_PASSWORD scp ./updates/info.json $FTP_USER@$FTP_SERVER:updates/recipe-creator/