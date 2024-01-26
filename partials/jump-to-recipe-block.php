<div class="recipe-creator--block--jump-to-recipe">
    <a href="#recipe-creator--recipe" class="recipe-creator--block--jump-to-recipe--link">
        <?php echo esc_html(__("Jump to recipe", "recipe-creator")); ?>
    </a>
    <style>
        .recipe-creator--block--jump-to-recipe {
            --primary: <?php echo esc_attr($this->getStyleOptions()['primaryColor']); ?>;
            --primary-contrast: <?php echo esc_attr($this->getStyleOptions()['primaryColorContrast']); ?>;
        }
    </style>
</div>