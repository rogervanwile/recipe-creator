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
- Plugin umbennenen?
- Steps in JSONLD mal angucken was da so drin steht
- Zahlenfelder gehen nicht richtig
- Currently WordPress core only supports one static handler link to the uninstall hook using register_uninstall_hook() or by adding the uninstall.php file to your plugin's directory. Since Freemius tracks the uninstall event, if you'll use any of those two methods in your plugin, the uninstall data will not be sent, including the feedback from the user (oh no!). If you are using the uninstall.php file, move its logic to a function and delete the file. The point is to have the uninstall logic in a function. One you have that ready, simply hook it to Freemius uninstall action that will be executed after the uninstall event is reported to the server. Use it as following:



# Develop

`yarn start`

