<?php

/**
 * Plugin Name:     Recipe Creator
 * Author URI:      https://howtofoodblog.com/
 * Description:     The easy to use recipe plugin for WordPress' Gutenberg editor. Easily create recipes and optimize them for Google & Co automatically.
 * Version:         2.0.0
 * Author:          howtofoodblog.com
 * Text Domain:     recipe-creator
 * Domain Path:     /languages
 */

if (!defined("ABSPATH")) {
    die();
}

require __DIR__ . "/inc/recipe-creator.php";

if (class_exists("RecipeCreator")) {
    $recipeCreator = new RecipeCreator();

    register_activation_hook(__FILE__, [$recipeCreator, "activate"]);

    register_deactivation_hook(__FILE__, [$recipeCreator, "deactivate"]);

    register_uninstall_hook(__FILE__, "RecipeCreator::uninstall");
}
