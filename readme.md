# Translations

Update *.pot file by running:

`npm run i18n:make-pot`

After that, the translations for the `Recipe Creator` are handled by WordPress.
You can edit them [here](https://translate.wordpress.org/projects/wp-plugins/recipe-creator/).

# Development

## First run

`brew install composer`
`brew install node@16`

`composer install`
`npm install`

`npm run start`

## Update SVG icons

Run `npm run build:fonts`

### Error: Some icons are not visible

Its possible that some icons must be "fixed" before converting to a webfont. For that, use:

`npm run fix:font-svgs`

# Publish a new version

- Update version in `package.json` and run `npm install`
- Update version in `recipe-creator.php`
- Update changelogs in `changelog.txt` and copy the latest changes to the `readme.txt`
- Update version in `readme.txt` (Stable tag)
- Create a new tag on the `main` branch.

=> The release will be created within a github workflow and is pushed to the wordpress plugin directory.