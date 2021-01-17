# Update Translations-Template file (POT)

`$ wp i18n make-pot ./ languages/foodblogkitchen-toolkit.pot`

- Open `foodblogkitchen-toolkit-de_DE.po` in Poedit
- Click "Katalog" > "Aus POT-Datei aktualisieren"
- Select the `foodblogkitchen-toolkit.pot`
- Update the translations
- Save the file and click "Datei" > "MO-Datei erstellen"

The translations for the JS files have to be a JSON file.

`wp i18n make-json languages/foodblogkitchen-toolkit-de_DE.po --no-purge`

More Infos: https://developer.wordpress.org/block-editor/developers/internationalization/

# Todos

- Zahlenfelder gehen manchmal nicht richtig
- DEFAULT-Hack ausbauen oder gucken warum es beim 2. mal kommt
- Setup Autoupdate

# Development

`yarn start`

# Publish a new version

- Update version in `package.json`
- Update version in `foodblogkitchen-toolkit.php`
- Update `/updates/info.json`

`$ ./create-archive.sh`
`$ ./publish-latest.sh`
