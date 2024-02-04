<?php
if (!defined('ABSPATH')) {
  die();
}

$recipeCreator = new RecipeCreator(); ?>

<div class="wrap">
  <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
  <?php settings_errors(); ?>

  <div id="col-container" class="wp-clearfix">
    <div id="col-left">
      <div class="col-wrap">
        <form method="post" action="options.php" id="recipe-creator--settings-form">
          <input type="hidden" name="recipe_creator__primary_color_contrast" value="<?php echo esc_attr(
                                                                                      get_option("recipe_creator__primary_color_contrast")
                                                                                    ) ?>" />
          <input type="hidden" name="recipe_creator__primary_color_light" value="<?php echo esc_attr(
                                                                                    get_option("recipe_creator__primary_color_light")
                                                                                  ) ?>" />
          <input type="hidden" name="recipe_creator__primary_color_light_contrast" value="<?php echo esc_attr(
                                                                                            get_option("recipe_creator__primary_color_light_contrast")
                                                                                          ) ?>" />
          <input type="hidden" name="recipe_creator__primary_color_dark" value="<?php echo esc_attr(
                                                                                  get_option("recipe_creator__primary_color_dark")
                                                                                ) ?>" />
          <input type="hidden" name="recipe_creator__secondary_color_contrast" value="<?php echo esc_attr(
                                                                                        get_option("recipe_creator__secondary_color_contrast")
                                                                                      ) ?>" />
          <input type="hidden" name="recipe_creator__background_color_contrast" value="<?php echo esc_attr(
                                                                                          get_option("recipe_creator__background_color_contrast")
                                                                                        ) ?>" />

          <?php
          settings_fields("recipe_creator__general");
          do_settings_sections("recipe_creator__general");
          submit_button();
          ?>
        </form>
      </div>
    </div>
    <div id="col-right">
      <div class="col-wrap">
        <?php $recipeCreator->renderRecipeBlockDummy(); ?>
      </div>
    </div>
    <div id="recipe-creator--style-container">
      <?php $this->renderRecipeBlockStyles(); ?>
    </div>
  </div>
</div>