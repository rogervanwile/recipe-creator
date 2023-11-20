<?php
$Parsedown = new Parsedown(); ?>
<div class="wrap recipe-creator--release-notes">
  <h1><?php echo get_admin_page_title(); ?></h1>
  <?php
  $userLocale = get_user_locale();

  if (in_array($userLocale, ["de_DE", "de_AT", "de_CH"])) {
      $changelog = file_get_contents(plugin_dir_path(__FILE__) . "../changelog-de_DE.md");
  } else {
      $changelog = file_get_contents(plugin_dir_path(__FILE__) . "../changelog.md");
  }

  // Replace some Placeholder in the markdown file
  $changelog = str_replace(
      ["##RECIPE_BLOCK_SETTINGS_LINK##", "##ASSETS_PATH##"],
      [
          get_admin_url(get_current_network_id(), "admin.php?page=recipe_plugin_for_wp"),
          plugin_dir_url(__FILE__) . "../assets",
      ],
      $changelog
  );

  echo $Parsedown->text($changelog);
  ?>
</div>