# Migrate from SP-Recipe to Recipe Manager Pro

````
SELECT `ID` FROM wp_isabelleposts WHERE post_content LIKE '%sp_recipe%';
```

```
SELECT * FROM `wp_isabellepostmeta` WHERE `post_id` = 12555 AND `meta_key` LIKE 'sp-recipe-%' AND `meta_value` <> '';
```

`$ wp i18n make-pot .`
```

Icons:

- https://github.com/tabler/tabler-icons

Todos:

- Editor-Ansicht anpassen
- Preview-Texte anpassen
- In der Editor-Block-Sidebar einstellen welche Timings angezeigt weren können
- Übersetzung
- Farben in Plugin-Settings einstellen lassen
- Buy-Button für Calculator
````
