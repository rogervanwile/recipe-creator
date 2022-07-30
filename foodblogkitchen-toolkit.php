<?php

/**
 * Plugin Name:     Foodblog-Toolkit
 * Author URI:      https://www.foodblogr.com/
 * Description:     Toolkit for your Foodblog to optimize your blog for search engines. Including a Recipe block for the Gutenberg editor.
 * Version:         1.8.0
 * Author:          foodblogr.com
 * Text Domain:     foodblogkitchen-toolkit
 * Domain Path:     /languages
 */

if (!defined('ABSPATH')) {
	die;
}

require __DIR__ . '/inc/foodblogkitchen-toolkit.php';

if (class_exists('FoodblogkitchenToolkit')) {
	$foodblogkitchenToolkit = new FoodblogkitchenToolkit();

	register_activation_hook(__FILE__, array($foodblogkitchenToolkit, 'activate'));

	register_deactivation_hook(__FILE__, array($foodblogkitchenToolkit, 'deactivate'));

	register_uninstall_hook(__FILE__, 'FoodblogkitchenToolkit::uninstall');
}
