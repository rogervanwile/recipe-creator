<?php

define("ABSPATH", "let-me-in");
define("WP_DEBUG", true);

require __DIR__ . '/../inc/recipe-plugin-for-wp.php';

/**
 * Precompile handlebars templates
 */

// plugin_dir_path is a wordpress method which is used in the renderer
function plugin_dir_path($file)
{
    return dirname($file) . '/';
}

RecipePluginForWP::getRecipeBlockRenderer();
RecipePluginForWP::getRecipeBlockStylesRenderer();
RecipePluginForWP::getJumpToRecipeBlockRenderer();
RecipePluginForWP::getFAQBlockRenderer();
