<?php
$recipePluginForWP = new RecipeMaster();
?>

<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>
  <?php settings_errors(); ?>

  <div id="col-container" class="wp-clearfix">
    <div id="col-left">
      <div class="col-wrap">
        <form method="post" action="options.php" id="recipe-master--settings-form">
          <input type="hidden" name="recipe_plugin_for_wp__primary_color_contrast" value="<?= esc_attr(get_option('recipe_plugin_for_wp__primary_color_contrast')); ?>" />
          <input type="hidden" name="recipe_plugin_for_wp__primary_color_light" value="<?= esc_attr(get_option('recipe_plugin_for_wp__primary_color_light')); ?>" />
          <input type="hidden" name="recipe_plugin_for_wp__primary_color_light_contrast" value="<?= esc_attr(get_option('recipe_plugin_for_wp__primary_color_light_contrast')); ?>" />
          <input type="hidden" name="recipe_plugin_for_wp__primary_color_dark" value="<?= esc_attr(get_option('recipe_plugin_for_wp__primary_color_dark')); ?>" />
          <input type="hidden" name="recipe_plugin_for_wp__secondary_color_contrast" value="<?= esc_attr(get_option('recipe_plugin_for_wp__secondary_color_contrast')); ?>" />
          <input type="hidden" name="recipe_plugin_for_wp__background_color_contrast" value="<?= esc_attr(get_option('recipe_plugin_for_wp__background_color_contrast')); ?>" />

          <?php
          settings_fields('recipe_plugin_for_wp__general');
          do_settings_sections('recipe_plugin_for_wp__general');
          submit_button();
          ?>
        </form>
      </div>
    </div>
    <div id="col-right">
      <div class="col-wrap">
        <?php
        echo $recipePluginForWP->renderRecipeBlockDummy();
        ?>
      </div>
    </div>
    <div id="recipe-master--style-container">
      <?php
      echo $recipePluginForWP->renderRecipeBlockStyles();
      ?>
    </div>
  </div>
  <script type="text/template" id="recipe-master--style-block-template">
    <?php echo RecipeMaster::getStyleBlockTemplate(); ?>
  </script>
</div>