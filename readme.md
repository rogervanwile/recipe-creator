# Update Translations-Template file (POT)

`npm run i18n:make-pot`

- Open `foodblogkitchen-toolkit-de_DE.po` in Poedit
- Click "Katalog" > "Aus POT-Datei aktualisieren"
- Select the `foodblogkitchen-toolkit.pot`
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

# Publish a new version

- `npm run build`
- Update version in `package.json`
- Update version in `foodblogkitchen-toolkit.php`
- Update `changelog.md` and `changelod-de_DE.md`
- Update latest wp version ("tested") in `build-tools/create-release.ts`

`$ npm run create-release`

- Run tests

`$ npm run test:start`

- Publish (or copy via FTP)

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
