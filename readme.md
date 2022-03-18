# Update Translations-Template file (POT)

`$ wp i18n make-pot ./ languages/foodblogkitchen-toolkit.pot`

- Open `foodblogkitchen-toolkit-de_DE.po` in Poedit
- Click "Katalog" > "Aus POT-Datei aktualisieren"
- Select the `foodblogkitchen-toolkit.pot`
- Update the translations
- Save the file and click "Datei" > "MO-Datei erstellen"

The translations for the JS files have to be a JSON file.

`rm -rf languages/*.json || true && wp i18n make-json languages/foodblogkitchen-toolkit-de_DE.po --no-purge`

More Infos: https://developer.wordpress.org/block-editor/developers/internationalization/

# Development

`yarn start`

# Publish a new version

- `yarn build`
- Update version in `package.json`
- Update version in `foodblogkitchen-toolkit.php`
- Update `changelog.md`

`$ yarn create-release`

- Run tests

`$ ./build-tools/publish-latest.sh`

# Testing

This plugin is using https://cypress.io for integration tests.
It is orchestrated with https://github.com/bigbite/wp-cypress.

## Running tests

```
yarn install
yarn test:start
yarn test:stop
```

