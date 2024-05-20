<style>
    .recipe-creator.recipe-creator {
        --background: <?php echo esc_attr(get_option("recipe_creator__background_color", $this->backgroundColorDefault)); ?>;
        --background-contrast: <?php echo esc_attr(get_option(
                                    "recipe_creator__background_color_contrast",
                                    $this->backgroundColorContrastDefault
                                )); ?>;
        --secondary: <?php echo esc_attr(get_option("recipe_creator__secondary_color", $this->secondaryColorDefault)); ?>;
        --secondary-contrast: <?php echo esc_attr(get_option(
                                    "recipe_creator__secondary_color_contrast",
                                    $this->secondaryColorContrastDefault
                                )); ?>;
        --primary: <?php echo esc_attr(get_option("recipe_creator__primary_color", $this->primaryColorDefault)); ?>;
        --primary-contrast: <?php echo esc_attr(get_option(
                                "recipe_creator__primary_color_contrast",
                                $this->primaryColorContrastDefault
                            )); ?>;
        --primary-light: <?php echo esc_attr(get_option(
                                "recipe_creator__primary_color_light",
                                $this->primaryColorLightDefault
                            )); ?>;
        --primary-light-contrast: <?php echo esc_attr(get_option(
                                        "recipe_creator__primary_color_light_contrast",
                                        $this->primaryColorLightContrastDefault
                                    )); ?>;
        --primary-dark: <?php echo esc_attr(get_option(
                            "recipe_creator__primary_color_dark",
                            $this->primaryColorDarkDefault
                        )); ?>;
        --border-radius: <?php echo esc_attr(get_option("recipe_creator__border_radius", $this->borderRadiusDefault)); ?>px;

        <?php if (get_option("recipe_creator__show_box_shadow", $this->showBoxShadowDefault) === "1") { ?>--box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        <?php } else { ?>--box-shadow: none;
        <?php } ?><?php if (get_option("recipe_creator__show_border", $this->showBorderDefault) === "1") { ?>--border: 1px solid <?php echo esc_attr(get_option("recipe_creator__primary_color", $this->primaryColorDefault)); ?>;
        <?php  } else { ?>--border: 0px;
        <?php } ?>
    }
</style>