# Update Translations-Template file (POT)

`$ wp i18n make-pot ./ languages/foodblogkitchen-recipes.pot`

- Open `foodblogkitchen-recipes-de_DE.po` in Poedit
- Click "Katalog" > "Aus POT-Datei aktualisieren"
- Select the `foodblogkitchen-recipes.pot`
- Update the translations
- Save the file and click "Datei" > "MO-Datei erstellen"

The translations for the JS files have to be a JSON file.

`wp i18n make-json languages/foodblogkitchen-recipes-de_DE.po --no-purge`

More Infos: https://developer.wordpress.org/block-editor/developers/internationalization/

# Todos

- Zahlenfelder gehen manchmal nicht richtig
- DEFAULT-Hack ausbauen oder gucken warum es beim 2. mal kommt
- Setup Autoupdate

# Development

`yarn start`
