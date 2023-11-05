<?php

/**
 * Plugin Name:     Recipe Plugin for WP
 * Author URI:      https://howtofoodblog.com/
 * Description:     The easy to use recipe plugin for WordPress' Gutenberg editor. Easily create recipes and optimize them for Google & Co.
 * Version:         2.0.0
 * Author:          howtofoodblog.com
 * Text Domain:     recipe-plugin-for-wp
 * Domain Path:     /languages
 */

if (!defined('ABSPATH')) {
	die;
}

require __DIR__ . '/inc/recipe-plugin-for-wp.php';

if (class_exists('RecipePluginForWP')) {
	$recipePluginForWP = new RecipePluginForWP();

	register_activation_hook(__FILE__, array($recipePluginForWP, 'activate'));

	register_deactivation_hook(__FILE__, array($recipePluginForWP, 'deactivate'));

	register_uninstall_hook(__FILE__, 'RecipePluginForWP::uninstall');
}
