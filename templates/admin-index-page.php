<?php
$recipeGuru = new RecipeGuru();
?>

<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>
  <?php settings_errors(); ?>

  <div id="col-container" class="wp-clearfix">
    <div id="col-left">
      <div class="col-wrap">
        <form method="post" action="options.php" id="recipe-guru--settings-form">
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
        echo $recipeGuru->renderRecipeBlockDummy();
        ?>
      </div>
    </div>
    <div id="recipe-guru--style-container">
      <?php
      echo $recipeGuru->renderRecipeBlockStyles();
      ?>
    </div>
  </div>
  <script type="text/template" id="recipe-guru--style-block-template">
    <?php echo RecipeGuru::getStyleBlockTemplate(); ?>
  </script>
</div>