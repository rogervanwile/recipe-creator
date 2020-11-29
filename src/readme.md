# Update Translations-Template file (POT)

`$ wp i18n make-pot ./ languages/recipe-manager-pro.pot`

- Open `recipe-manager-pro-de_DE.po` in Poedit
- Click "Katalog" > "Aus POT-Datei aktualisieren"
- Select the `recipe-manager-pro.pot`
- Update the translations
- Save the file and click "Datei" > "MO-Datei erstellen"

The translations for the JS files have to be a JSON file.

`wp i18n make-json languages/recipe-manager-pro-de_DE.po --no-purge`

More Infos: https://developer.wordpress.org/block-editor/developers/internationalization/

# Todos

- Plugin umbennenen?
- Zahlenfelder gehen nicht richtig

# Development

`yarn start`
