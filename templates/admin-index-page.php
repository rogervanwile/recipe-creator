<?php
$recipeManagerPro = new RecipeManagerPro();
?>

<div class="wrap">
  <h1>Recipe Manager Pro</h1>
  <?php settings_errors(); ?>

  <div id="col-container" class="wp-clearfix">
    <div id="col-left">
      <div class="col-wrap">
        <form method="post" action="options.php" id="recipe-manager-pro--settings-form">
          <input type="hidden" name="recipe_manager_pro__primary_color_light" value="<?= esc_attr(get_option('recipe_manager_pro__primary_color_light')); ?>" />
          <input type="hidden" name="recipe_manager_pro__primary_color_light_contrast" value="<?= esc_attr(get_option('recipe_manager_pro__primary_color_light_contrast')); ?>" />
          <input type="hidden" name="recipe_manager_pro__primary_color_dark" value="<?= esc_attr(get_option('recipe_manager_pro__primary_color_dark')); ?>" />
          <input type="hidden" name="recipe_manager_pro__secondary_color_contrast" value="<?= esc_attr(get_option('recipe_manager_pro__secondary_color_contrast')); ?>" />
          <input type="hidden" name="recipe_manager_pro__background_color_contrast" value="<?= esc_attr(get_option('recipe_manager_pro__background_color_contrast')); ?>" />

          <?php
          settings_fields('recipe_manager_pro__general');
          do_settings_sections('recipe_manager_pro__general');
          submit_button();
          ?>
        </form>
      </div>
    </div>
    <div id="col-right">
      <div class="col-wrap">
        <?php
        echo $recipeManagerPro->renderDummyTemplate();
        ?>
      </div>
    </div>
    <div id="recipe-manager-pro--style-container">
      <?php
      echo $recipeManagerPro->renderStyleBlockTemplate();
      ?>
    </div>
  </div>
  <script type="text/template" id="recipe-manager-pro--style-block-template">
    <?php echo $recipeManagerPro->getStyleBlockTemplate(); ?>
  </script>
</div>