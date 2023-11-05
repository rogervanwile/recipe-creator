<?php
$foodblogkitchenToolkit = new RecipePluginForWP();
?>

<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>
  <?php settings_errors(); ?>

  <div id="col-container" class="wp-clearfix">
    <div id="col-left">
      <div class="col-wrap">
        <form method="post" action="options.php" id="recipe-plugin-for-wp--settings-form">
          <input type="hidden" name="foodblogkitchen_toolkit__primary_color_contrast" value="<?= esc_attr(get_option('foodblogkitchen_toolkit__primary_color_contrast')); ?>" />
          <input type="hidden" name="foodblogkitchen_toolkit__primary_color_light" value="<?= esc_attr(get_option('foodblogkitchen_toolkit__primary_color_light')); ?>" />
          <input type="hidden" name="foodblogkitchen_toolkit__primary_color_light_contrast" value="<?= esc_attr(get_option('foodblogkitchen_toolkit__primary_color_light_contrast')); ?>" />
          <input type="hidden" name="foodblogkitchen_toolkit__primary_color_dark" value="<?= esc_attr(get_option('foodblogkitchen_toolkit__primary_color_dark')); ?>" />
          <input type="hidden" name="foodblogkitchen_toolkit__secondary_color_contrast" value="<?= esc_attr(get_option('foodblogkitchen_toolkit__secondary_color_contrast')); ?>" />
          <input type="hidden" name="foodblogkitchen_toolkit__background_color_contrast" value="<?= esc_attr(get_option('foodblogkitchen_toolkit__background_color_contrast')); ?>" />

          <?php
          settings_fields('foodblogkitchen_toolkit__general');
          do_settings_sections('foodblogkitchen_toolkit__general');
          submit_button();
          ?>
        </form>
      </div>
    </div>
    <div id="col-right">
      <div class="col-wrap">
        <?php
        echo $foodblogkitchenToolkit->renderRecipeBlockDummy();
        ?>
      </div>
    </div>
    <div id="recipe-plugin-for-wp--style-container">
      <?php
      echo $foodblogkitchenToolkit->renderRecipeBlockStyles();
      ?>
    </div>
  </div>
  <script type="text/template" id="recipe-plugin-for-wp--style-block-template">
    <?php echo RecipePluginForWP::getStyleBlockTemplate(); ?>
  </script>
</div>