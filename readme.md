# Update Translations-Template file (POT)

`npm run i18n:make-pot`

- Open `recipe-creator-de_DE.po` in Poedit
- Click "Katalog" > "Aus POT-Datei aktualisieren"
- Select the `recipe-creator.pot`
- Update the translations
- Save the file and click "Datei" > "MO-Datei erstellen"

The translations for the JS files have to be a JSON file.

`npm run i18n:make-json`

More Infos: https://developer.wordpress.org/block-editor/developers/internationalization/

# Development

## First run

`brew install composer`
`brew install node@16`

`composer install`
`npm install`

`npm run start`

## Changes in Handlebar-Templates

If you change the handlebar templates, you must recompile them for usage in the plugin. Just run:

`npm run build`

## Update SVG icons

Run `npm run build:fonts`

### Error: Some icons are not visible

Its possible that some icons must be "fixed" before converting to a webfont. For that, use:

`npm run fix:font-svgs`

# Publish a new version

- Update version in `package.json` and run `npm install`
- Update version in `recipe-creator.php`
- Update version in `readme.txt` (Stable tag)
- Update changelogs in `changelog.txt` and copy the latest changes to the `readme.txt`
- Create a new tag on the `main` branch.

=> The release will be created within a github workflow and is pushed to the wordpress plugin directory.

# Run tests - outdated

`$ npm run test:start`

- Publish (or copy via FTP)

(You need sshpass): `brew install hudochenkov/sshpass/sshpass`

`$ ./build-tools/publish-latest.sh`

# Testing

This plugin is using https://cypress.io for integration tests.
It is orchestrated with https://github.com/bigbite/wp-cypress.

## Running tests

```
npm run install
npm run test:start
npm run test:stop
```
