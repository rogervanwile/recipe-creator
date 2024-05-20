<div class="recipe-creator recipe-creator--block--jump-to-recipe">
    <a href="#recipe-creator--recipe" class="recipe-creator--block--jump-to-recipe--link">
        <?php echo esc_html(__("Jump to recipe", "recipe-creator")); ?>
    </a>
    <style>
        .recipe-creator--block--jump-to-recipe {
            --primary: <?php echo esc_attr(get_option("recipe_creator__primary_color", $this->primaryColorDefault)); ?>;
            --primary-contrast: <?php echo esc_attr(get_option(
                                    "recipe_creator__primary_color_contrast",
                                    $this->primaryColorContrastDefault
                                )); ?>;

        }
    </style>
</div>