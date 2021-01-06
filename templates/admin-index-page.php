<?php
$foodblogKitchenRecipes = new FoodblogKitchenRecipes();
?>

<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>
  <?php settings_errors(); ?>

  <div id="col-container" class="wp-clearfix">
    <div id="col-left">
      <div class="col-wrap">
        <form method="post" action="options.php" id="foodblogkitchen-recipes--settings-form">
          <input type="hidden" name="foodblogkitchen_recipes__primary_color_light" value="<?= esc_attr(get_option('foodblogkitchen_recipes__primary_color_light')); ?>" />
          <input type="hidden" name="foodblogkitchen_recipes__primary_color_light_contrast" value="<?= esc_attr(get_option('foodblogkitchen_recipes__primary_color_light_contrast')); ?>" />
          <input type="hidden" name="foodblogkitchen_recipes__primary_color_dark" value="<?= esc_attr(get_option('foodblogkitchen_recipes__primary_color_dark')); ?>" />
          <input type="hidden" name="foodblogkitchen_recipes__secondary_color_contrast" value="<?= esc_attr(get_option('foodblogkitchen_recipes__secondary_color_contrast')); ?>" />
          <input type="hidden" name="foodblogkitchen_recipes__background_color_contrast" value="<?= esc_attr(get_option('foodblogkitchen_recipes__background_color_contrast')); ?>" />

          <?php
          settings_fields('foodblogkitchen_recipes__general');
          do_settings_sections('foodblogkitchen_recipes__general');
          submit_button();
          ?>
        </form>
      </div>
    </div>
    <div id="col-right">
      <div class="col-wrap">
        <?php
        echo $foodblogKitchenRecipes->renderDummyTemplate();
        ?>
      </div>
    </div>
    <div id="foodblogkitchen-recipes--style-container">
      <?php
      echo $foodblogKitchenRecipes->renderStyleBlockTemplate();
      ?>
    </div>
  </div>
  <script type="text/template" id="foodblogkitchen-recipes--style-block-template">
    <?php echo $foodblogKitchenRecipes->getStyleBlockTemplate(); ?>
  </script>
</div>