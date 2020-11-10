# Create Translations

`$ wp i18n make-pot ./ languages/recipe-manager-pro.pot`

Open the file and create a translation.
When done, export mo file
Than do the following stuff

## JavaScript

The translations for the JS files have to be a JSON file.

To convert po to JSON, use this command inside the `languages` folder

`wp i18n make-json languages/recipe-manager-pro-de_DE.po --no-purge`

More Infos: https://developer.wordpress.org/block-editor/developers/internationalization/

# Icons

- https://github.com/tabler/tabler-icons

# Todos

- servings entfernen
- Bild in Vorschau komprimieren
- Frühstück nicht per Default auswählen
- "Süßes" statt "Süßigkeit"
- Plugin umbennenen?

# Develop

`yarn start`
