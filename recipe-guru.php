<?php

/**
 * Plugin Name:     Recipe Guru
 * Author URI:      https://howtofoodblog.com/
 * Description:     The easy to use recipe plugin for WordPress' Gutenberg editor. Easily create recipes and optimize them for Google & Co automatically.
 * Version:         2.0.0
 * Author:          howtofoodblog.com
 * Text Domain:     recipe-guru
 * Domain Path:     /languages
 */

if (!defined('ABSPATH')) {
	die;
}

require __DIR__ . '/inc/recipe-guru.php';

if (class_exists('RecipeGuru')) {
	$recipeGuru = new RecipeGuru();

	register_activation_hook(__FILE__, array($recipeGuru, 'activate'));

	register_deactivation_hook(__FILE__, array($recipeGuru, 'deactivate'));

	register_uninstall_hook(__FILE__, 'RecipeGuru::uninstall');
}
