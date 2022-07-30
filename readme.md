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

`npm run start`

# Publish a new version

- `npm run build`
- Update version in `package.json`
- Update version in `foodblogkitchen-toolkit.php`
- Update `changelog.md`

`$ npm run create-release`

- Run tests

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
