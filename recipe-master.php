<?php

/**
 * Plugin Name:     Recipe Master
 * Author URI:      https://howtofoodblog.com/
 * Description:     The easy to use recipe plugin for WordPress' Gutenberg editor. Easily create recipes and optimize them for Google & Co automatically.
 * Version:         2.0.0
 * Author:          howtofoodblog.com
 * Text Domain:     recipe-master
 * Domain Path:     /languages
 */

if (!defined('ABSPATH')) {
	die;
}

require __DIR__ . '/inc/recipe-master.php';

if (class_exists('RecipeMaster')) {
	$recipePluginForWP = new RecipeMaster();

	register_activation_hook(__FILE__, array($recipePluginForWP, 'activate'));

	register_deactivation_hook(__FILE__, array($recipePluginForWP, 'deactivate'));

	register_uninstall_hook(__FILE__, 'RecipeMaster::uninstall');
}
