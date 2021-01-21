<?php

/**
 * Plugin Name:     Foodblog-Toolkit
 * Author URI:      https://foodblogkitchen.de/
 * Description:     Toolkit for your Foodblog to optimize your blog for search engines. Including a Recipe block for the Gutenberg editor.
 * Version:         1.3.0
 * Author:          foodblogkitchen.de
 * Text Domain:     foodblogkitchen-toolkit
 * Domain Path:     /languages
 */

if (!defined('ABSPATH')) {
	die;
}

require "vendor/autoload.php";

use LightnCandy\LightnCandy;

class FoodblogkitchenToolkit
{
	private $primaryColorDefault = '#e27a7a';
	private $primaryColorLightDefault = '#f7e9e9';
	private $primaryColorLightContrastDefault = '#000000';
	private $primaryColorDarkDefault = '#d55a5a';
	private $secondaryColorDefault = '#efefef';
	private $secondaryColorContrastDefault = '#000000';
	private $backgroundColorDefault = '#fefcfc';
	private $backgroundColorContrastDefault = '#000000';
	private $showBoxShadowDefault = '1';
	private $showBorderDefault = '1';
	private $borderRadiusDefault = 8;
	private $thumnailSizeDefault = 330;

	public static $licenseServer = 'https://foodblogkitchen.de';
	public static $licenseSecretKey = '5ff5c39a7148a7.10623378';
	public static $licenseProductName = 'Foodblog-Toolkit';

	function __construct()
	{
		add_action('init', array($this, 'addRessources'));
		add_action('init', array($this, 'registerBlock'));
		add_action('init', array($this, 'registerMeta'));
		add_action('init', array($this, 'loadTranslations'));

		add_action('admin_init', array($this, 'registerRecipeBlockSettings'));
		add_action('admin_init', array($this, 'registerPinterestSettings'));
		add_action('admin_menu', array($this, 'registerSettingsPage'));

		add_action('admin_enqueue_scripts', array($this, 'enqueueAdminJs'));

		add_image_size('foodblogkitchen-toolkit--thumbnail', get_option('foodblogkitchen_toolkit__thumbnail_size', $this->thumnailSizeDefault));
		add_image_size('foodblogkitchen-toolkit--pinterest', 1000, 0, false);

		// Frontend-AJAX-Actions
		add_action('wp_ajax_foodblogkitchen_toolkit_set_rating', array($this, 'setRating'));
		add_action('wp_ajax_nopriv_foodblogkitchen_toolkit_set_rating', array($this, 'setRating'));

		// Enable Auto-Update
		// https://rudrastyh.com/wordpress/self-hosted-plugin-update.html
		add_filter('plugins_api', array($this, 'fetchInfo'), 20, 3);
		add_filter('site_transient_update_plugins', array($this, 'pushUpdate'));
		add_action('upgrader_process_complete', array($this, 'afterUpdate'), 10, 2);
	}

	public function fetchInfo($res, $action, $args)
	{
		// do nothing if this is not about getting plugin information
		if ('plugin_information' !== $action) {
			return false;
		}

		// do nothing if it is not our plugin
		if ('foodblogkitchen-toolkit' !== $args->slug) {
			return false;
		}

		// trying to get from cache first
		if (false == $remote = get_transient('foodblogkitchen_toolkit_update')) {
			// info.json is the file with the actual plugin information on your server
			$remote = wp_remote_get('https://updates.foodblogkitchen.de/foodblogkitchen-toolkit/info.json', array(
				'timeout' => 10,
				'headers' => array(
					'Accept' => 'application/json'
				)
			));

			if (!is_wp_error($remote) && isset($remote['response']['code']) && $remote['response']['code'] == 200 && !empty($remote['body'])) {
				set_transient('foodblogkitchen_toolkit_update', $remote, 43200); // 12 hours cache
			}
		}

		if (!is_wp_error($remote) && isset($remote['response']['code']) && $remote['response']['code'] == 200 && !empty($remote['body'])) {
			$remote = json_decode($remote['body']);
			$res = new stdClass();

			$res->name = $remote->name;
			$res->slug = 'foodblogkitchen-toolkit';
			$res->version = $remote->version;
			$res->tested = $remote->tested;
			$res->requires = $remote->requires;
			$res->author = '<a href="https://foodblogkitchen.de">foodblogkitchen.de</a>';
			$res->author_profile = 'https://foodblogkitchen.de';
			$res->download_link = $remote->download_url;
			$res->trunk = $remote->download_url;
			$res->requires_php = $remote->requires_php;
			$res->last_updated = $remote->last_updated;
			$res->sections = array(
				'description' => $remote->sections->description,
				'installation' => $remote->sections->installation,
				'changelog' => $remote->sections->changelog
				// you can add your custom sections (tabs) here
			);

			// in case you want the screenshots tab, use the following HTML format for its content:
			// <ol><li><a href="IMG_URL" target="_blank"><img src="IMG_URL" alt="CAPTION" /></a><p>CAPTION</p></li></ol>
			if (!empty($remote->screenshots)) {
				$res['screenshots'] = $remote->screenshots;
			}

			if (!empty($remote->banners)) {
				$res['banners'] = $remote->banners;
			}
			return $res;
		}

		return false;
	}

	public function pushUpdate($transient)
	{
		if (empty($transient->checked)) {
			return $transient;
		}

		// trying to get from cache first, to disable cache comment 10,20,21,22,24
		if (false == $remote = get_transient('foodblogkitchen_toolkit_upgrade')) {

			// info.json is the file with the actual plugin information on your server
			$remote = wp_remote_get('https://updates.foodblogkitchen.de/foodblogkitchen-toolkit/info.json', array(
				'timeout' => 10,
				'headers' => array(
					'Accept' => 'application/json'
				)
			));

			if (!is_wp_error($remote) && isset($remote['response']['code']) && $remote['response']['code'] == 200 && !empty($remote['body'])) {
				set_transient('foodblogkitchen_toolkit_upgrade', $remote, 43200); // 12 hours cache
			}
		}

		if (isset($remote) && !is_wp_error($remote)) {
			$remote = json_decode($remote['body']);

			if (!function_exists('get_plugin_data')) {
				require_once(ABSPATH . 'wp-admin/includes/plugin.php');
			}
			$plugin_data = get_plugin_data(__FILE__);
			$plugin_version = $plugin_data['Version'];

			// your installed plugin version should be on the line below! You can obtain it dynamically of course 
			if ($remote && version_compare($plugin_version, $remote->version, '<') && version_compare($remote->requires, get_bloginfo('version'), '<')) {
				$res = new stdClass();
				$res->slug = 'foodblogkitchen-toolkit';
				$res->plugin = 'foodblogkitchen-toolkit/foodblogkitchen-toolkit.php'; // it could be just foodblogkitchen-toolkit.php if your plugin doesn't have its own directory
				$res->new_version = $remote->version;
				$res->tested = $remote->tested;
				$res->package = $remote->download_url;
				$transient->response[$res->plugin] = $res;
				//$transient->checked[$res->plugin] = $remote->version;
			}
		}
		return $transient;
	}

	public function afterUpdate($upgrader_object, $options)
	{
		if ($options['action'] == 'update' && $options['type'] === 'plugin') {
			// just clean the cache when new plugin version is installed
			delete_transient('foodblogkitchen_toolkit_upgrade');
		}
	}

	public function enqueueAdminJs()
	{
		// Enable Color Picker for Settings Page
		wp_enqueue_style('wp-color-picker');
		wp_enqueue_style('iris');

		wp_enqueue_script('foodblogkitchen-toolkit-settings-js',   plugins_url('build/admin.js', __FILE__), array('jquery', 'wp-color-picker', 'iris'), '', true);

		wp_enqueue_style('foodblogkitchen-toolkit-settings-admin-css',   plugins_url('build/admin.css', __FILE__), array(), '', 'all');

		echo $this->renderStyleBlockTemplate();
	}

	public function registerSettingsPage()
	{
		add_menu_page(
			__('Foodblog-Toolkit', 'foodblogkitchen-toolkit'),
			__('Foodblog-Toolkit', 'foodblogkitchen-toolkit'),
			'manage_options',
			'foodblogkitchen_toolkit',
			function () {
				return require_once(plugin_dir_path(__FILE__) . 'templates/admin-index-page.php');
			},
			'dashicons-carrot',
			100
		);

		add_submenu_page(
			'foodblogkitchen_toolkit',
			__('Recipe Block', 'foodblogkitchen-toolkit'),
			__("Recipe Block", 'foodblogkitchen-toolkit'),
			'manage_options',
			'foodblogkitchen_toolkit',
			function () {
				return require_once(plugin_dir_path(__FILE__) . 'templates/admin-index-page.php');
			}
		);

		add_submenu_page(
			'foodblogkitchen_toolkit',
			__('Pinterest', 'foodblogkitchen-toolkit'),
			__("Pinterest", 'foodblogkitchen-toolkit'),
			'manage_options',
			'foodblogkitchen_toolkit_pinterest',
			function () {
				return require_once(plugin_dir_path(__FILE__) . 'templates/admin-pinterest-page.php');
			}
		);

		add_submenu_page(
			'foodblogkitchen_toolkit',
			__('License', 'foodblogkitchen-toolkit'),
			__("License", 'foodblogkitchen-toolkit'),
			'manage_options',
			'foodblogkitchen_toolkit_license',
			function () {
				return require_once(plugin_dir_path(__FILE__) . 'templates/admin-license-page.php');
			}
		);
	}

	private function renderColorPickerInput($name, $defaultValue)
	{
		$value = esc_attr(get_option($name, $defaultValue));
		echo '<input type="text" class="foodblogkitchen-toolkit--color-picker" name="' . $name . '" value="' . $value . '" data-default-value="' .  $defaultValue . '" />';
	}

	private function renderNumberInput($name, $defaultValue)
	{
		$value = esc_attr(get_option($name, $defaultValue));
		echo '<input type="number" name="' . $name . '" value="' . $value . '" />';
	}

	private function renderCheckboxInput($name, $defaultValue, $text)
	{
		$value = esc_attr(get_option($name, $defaultValue));
		echo '<label><input type="checkbox" name="' . $name . '" value="1" ' . (isset($value) && $value === '1' ? 'checked="checked"' : '') . ' /> ' . $text . '</label>';
	}

	private function renderHiddenInput($name, $defaultValue)
	{
		$value = esc_attr(get_option($name, $defaultValue));
		echo '<input type="hidden" name="' . $name . '" value="' . $value . '" />';
	}

	public function registerRecipeBlockSettings()
	{
		// Settings
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__primary_color',
			array(
				"default" => $this->primaryColorDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__primary_color_light',
			array(
				"default" => $this->primaryColorLightDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__primary_color_light_contrast',
			array(
				"default" => $this->primaryColorLightContrastDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__primary_color_dark',
			array(
				"default" => $this->primaryColorDarkDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__secondary_color',
			array(
				"default" => $this->secondaryColorDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__secondary_color_contrast',
			array(
				"default" => $this->secondaryColorContrastDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__background_color',
			array(
				"default" => $this->backgroundColorDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__background_color_contrast',
			array(
				"default" => $this->backgroundColorContrastDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__show_box_shadow',
			array(
				"default" => $this->showBoxShadowDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__show_border',
			array(
				"default" => $this->showBorderDefault
			)
		);
		register_setting(
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__border_radius',
			array(
				"default" => $this->borderRadiusDefault
			)
		);

		// Sections
		add_settings_section(
			'foodblogkitchen_toolkit__general',
			__('General settings', 'foodblogkitchen-toolkit'),
			function () {
				echo '<p>' . __("Configure how the recipe block should look for your visitors.", 'foodblogkitchen-toolkit') . '</p>';
			},
			'foodblogkitchen_toolkit__general'
		);

		// Fields
		add_settings_field(
			'foodblogkitchen_toolkit__primary_color',
			__('Primary color', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderColorPickerInput('foodblogkitchen_toolkit__primary_color', $this->primaryColorDefault);
			},
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__general',
			array(
				'label_for' => 'foodblogkitchen_toolkit__primary_color'
			)
		);
		add_settings_field(
			'foodblogkitchen_toolkit__secondary_color',
			__('Secondary color', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderColorPickerInput('foodblogkitchen_toolkit__secondary_color', $this->secondaryColorDefault);
			},
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__general',
			array(
				'label_for' => 'foodblogkitchen_toolkit__secondary_color'
			)
		);
		add_settings_field(
			'foodblogkitchen_toolkit__background_color',
			__('Background color', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderColorPickerInput('foodblogkitchen_toolkit__background_color', $this->backgroundColorDefault);
			},
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__general',
			array(
				'label_for' => 'foodblogkitchen_toolkit__background_color'
			)
		);

		add_settings_field(
			'foodblogkitchen_toolkit__show_border',
			__('Border', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderCheckboxInput('foodblogkitchen_toolkit__show_border', $this->showBorderDefault, __('Show border', 'foodblogkitchen-toolkit'));
			},
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__general',
			array(
				'label_for' => 'foodblogkitchen_toolkit__show_border'
			)
		);
		add_settings_field(
			'foodblogkitchen_toolkit__show_box_shadow',
			__('Box shadow', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderCheckboxInput('foodblogkitchen_toolkit__show_box_shadow', $this->showBoxShadowDefault, __('Show box shadow', 'foodblogkitchen-toolkit'));
			},
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__general',
			array(
				'label_for' => 'foodblogkitchen_toolkit__show_box_shadow'
			)
		);
		add_settings_field(
			'foodblogkitchen_toolkit__border_radius',
			__('Border radius', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderNumberInput('foodblogkitchen_toolkit__border_radius', $this->borderRadiusDefault);
			},
			'foodblogkitchen_toolkit__general',
			'foodblogkitchen_toolkit__general',
			array(
				'label_for' => 'foodblogkitchen_toolkit__border_radius'
			)
		);
	}

	public function registerPinterestSettings()
	{
		// Settings
		register_setting(
			'foodblogkitchen_toolkit__pinterest',
			'foodblogkitchen_toolkit__pinterest_image_overlay__enabled',
			array(
				"default" => false
			)
		);

		// Sections
		add_settings_section(
			'foodblogkitchen_toolkit__pinterest',
			'',
			// __('General settings', 'foodblogkitchen-toolkit'),
			function () {
				echo '<p>' . __("Configure the implementation of pinterest in your blog.", 'foodblogkitchen-toolkit') . '</p>';
			},
			'foodblogkitchen_toolkit__pinterest'
		);

		// Fields
		add_settings_field(
			'foodblogkitchen_toolkit__pinterest_image_overlay__enabled',
			__('Image overlay', 'foodblogkitchen-toolkit'),
			function () {
				$this->renderCheckboxInput('foodblogkitchen_toolkit__pinterest_image_overlay__enabled', false, __('Show Pinterest share icon over images', 'foodblogkitchen-toolkit'));
			},
			'foodblogkitchen_toolkit__pinterest',
			'foodblogkitchen_toolkit__pinterest',
			array(
				'label_for' => 'foodblogkitchen_toolkit__pinterest_image_overlay__enabled'
			)
		);
	}

	public function loadTranslations()
	{
		load_plugin_textdomain('foodblogkitchen-toolkit', FALSE, basename(dirname(__FILE__)) . '/languages/');
	}

	public function registerMeta()
	{
		register_meta('post', 'foodblogkitchen_pinterest_image_id', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'foodblogkitchen_pinterest_image_url', array(
			'show_in_rest' => true,
			'type' => 'string',
			'single' => true,
		));
		register_meta('post', 'rating_1_votes', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'rating_2_votes', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'rating_3_votes', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'rating_4_votes', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'rating_5_votes', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'rating_count', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
		register_meta('post', 'average_rating', array(
			'show_in_rest' => true,
			'type' => 'number',
			'single' => true,
		));
	}

	public function getRecipeFromSP()
	{
		global $pagenow;

		if (($pagenow == 'post.php') || (get_post_type() == 'post')) {

			$postId = $_GET['post'];

			if ($postId) {
				$postMeta = get_post_meta($postId);
				return $this->extractRecipeFromMeta($postMeta);
			}
		}

		return null;
	}

	private function extractRecipeFromMeta($meta)
	{
		$recipe = [];

		foreach ($meta as $key => $value) {

			switch ($key) {
				case 'sp-recipe-title':
					$recipe['name'] = $value[0];
					break;
				case 'sp-recipe-description':
					$recipe['description'] = $value[0];
					break;
				case 'sp-recipe-servings':
					$recipe['recipeYield'] = $value[0];
					break;
				case 'sp-recipe-time-prep':
					$recipe['prepTime'] = strval(intval($value[0]));
					break;
				case 'sp-recipe-time':
					$recipe['cookTime'] = strval(intval($value[0]));
					break;
				case 'sp-recipe-time-total':
					$recipe['totalTime'] = strval(intval($value[0]));
					break;
				case 'sp-recipe-cuisine':
					$recipe['recipeCuisine'] = $value[0];
					break;
				case 'sp-recipe-ingredients':
					$recipe['ingredients'] = $this->arrayToLi(array_map('trim', explode(PHP_EOL, $value[0])));
					break;
				case 'sp-recipe-method':
					$recipe['preparationSteps'] = $this->arrayToLi(array_map('trim', explode(PHP_EOL, $value[0])));
					break;
				case 'sp-recipe-calories':
					$recipe['calories'] = $value[0];
					break;
				case 'sp-recipe-notes':
					$recipe['notes'] = $value[0];
					break;
			}
		}

		return $recipe;
	}

	private function arrayToLi($array)
	{
		return '<li>' . implode('</li><li>', $array) . '</li>';
	}

	public function activate()
	{
		flush_rewrite_rules();
	}

	public function deactivate()
	{
		flush_rewrite_rules();
	}

	private function getPropertyFromRecipe($recipe, $property, $type = 'string')
	{

		if (isset($recipe) && isset($recipe[$property])) {
			if ($type === 'string') {
				return $recipe[$property] .  '::STORE_DEFAULT_VALUE_HACK';
			} else {
				return intval($recipe[$property]) . '::STORE_DEFAULT_VALUE_NUMBER_HACK';
			}
		} else {
			if ($type === 'string') {
				return '';
			} else {
				return 0;
			}
		}
	}

	public function addRessources()
	{
		$dir = dirname(__FILE__);

		// editor.js

		$editorAsset = require("$dir/build/editor.asset.php");

		wp_register_script(
			'foodblogkitchen-toolkit-recipe-block-editor',
			plugins_url('build/editor.js', __FILE__),
			$editorAsset['dependencies'],
			$editorAsset['version']
		);

		wp_register_style(
			'foodblogkitchen-toolkit-recipe-block-editor',
			plugins_url('build/editor.css', __FILE__),
			array(),
			$editorAsset['version']
		);

		wp_enqueue_style(
			'foodblogkitchen-toolkit-recipe-block',
			plugins_url('build/style-editor.css', __FILE__),
			array(),
			$editorAsset['version']
		);

		// Add some variables for the editor script
		$license = get_option('foodblogkitchen_toolkit__license_key', '');
		wp_localize_script('foodblogkitchen-toolkit-recipe-block-editor', 'foodblogkitchenToolkitAdditionalData', [
			"hasValidLicense" => !empty($license),
			"licensePage" => get_admin_url(get_current_network_id(), 'admin.php?page=foodblogkitchen_toolkit_license')
		]);

		wp_set_script_translations('foodblogkitchen-toolkit-recipe-block-editor', 'foodblogkitchen-toolkit', plugin_dir_path(__FILE__) . 'languages');

		// frontend.js

		$frontendAsset = require("$dir/build/frontend.asset.php");

		wp_register_script(
			'foodblogkitchen-toolkit-recipe-block',
			plugins_url('build/frontend.js', __FILE__),
			$frontendAsset['dependencies'],
			$frontendAsset['version']
		);

		wp_register_style(
			'foodblogkitchen-toolkit-recipe-block',
			plugins_url('build/style-index.css', __FILE__),
			array(),
			$frontendAsset['version']
		);

		// pinterest-image-overlay.js

		// TODO: Include only when images are on the page
		if (get_option('foodblogkitchen_toolkit__pinterest_image_overlay__enabled', false)) {
			$pinterestImageOverlayAsset = require("$dir/build/pinterest-image-overlay.asset.php");

			wp_enqueue_script(
				'foodblogkitchen-toolkit-pinterest-image-overlay',
				plugins_url('build/pinterest-image-overlay.js', __FILE__),
				$pinterestImageOverlayAsset['dependencies'],
				$pinterestImageOverlayAsset['version'],
			);

			wp_enqueue_style(
				'foodblogkitchen-toolkit-pinterest-image-overlay',
				plugins_url('build/pinterest-image-overlay.css', __FILE__),
				array(),
				$pinterestImageOverlayAsset['version'],
			);
		}
	}

	public function registerBlock()
	{
		$recipe = $this->getRecipeFromSP();
		// $recipe = null;

		// The value of a property is not stored in the database if it is the default value
		// So I add a suffix on the default which is removed in "edit.js" and so it is possible
		// to store the migrated data.
		// Workaround for https://github.com/WordPress/gutenberg/issues/7342

		register_block_type('foodblogkitchen-recipes/block', array(
			'editor_script' => 'foodblogkitchen-toolkit-recipe-block-editor',
			'editor_style'  => 'foodblogkitchen-toolkit-recipe-block-editor',
			'script'        => 'foodblogkitchen-toolkit-recipe-block',
			'style'         => 'foodblogkitchen-toolkit-recipe-block',
			'attributes' => array(
				'ingredients' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'ingredients')
				),
				'preparationSteps' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'preparationSteps')
				),
				'name' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'name')
				),
				'description' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'description')
				),
				'difficulty' => array(
					'type' => 'string'
				),
				'notes' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'notes')
				),
				'prepTime' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'prepTime')
				),
				'restTime' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'restTime')
				),
				'cookTime' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'cookTime')
				),
				'bakingTime' => array(
					'type' => 'string',
					'default' => ''
				),
				'totalTime' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'totalTime')
				),
				'recipeYield' => array(
					'type' => 'string',
					'default' => '0'
				),
				'recipeYieldUnit' => array(
					'type' => 'string',
					'default' => ''
				),
				'videoUrl' => array(
					'type' => 'string',
					'default' => ''
				),
				'videoIframeUrl' => array(
					'type' => 'string',
					'default' => ''
				),
				// DEPRECATED, löschen wenn Isas Blog durch ist 
				'servings' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'recipeYield')
				),
				'calories' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'calories')
				),
				'recipeCuisine' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'recipeCuisine')
				),
				'image1_1' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image1_1')
				),
				'image1_1Id' => array(
					'type' => 'number'
				),
				'image3_2' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image3_2')
				),
				'image3_2Id' => array(
					'type' => 'number'
				),
				'image4_3' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image4_3')
				),
				'image4_3Id' => array(
					'type' => 'number',
				),
				'image16_9' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image16_9')
				),
				'image16_9Id' => array(
					'type' => 'number',
				),
				'videoUrl' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'videoUrl')
				),
				'content' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'content')
				),
				'className' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'className')
				),
				'align' => array(
					'type' => 'string',
					'default' => 'center'
				),
			),
			'render_callback' => array($this, 'renderBlock'),
		));
	}

	public function setRating()
	{
		if (!check_ajax_referer('foodblogkitchen-toolkit')) {
			wp_send_json_error();
			wp_die();
		} else {
			$postId = intval(sanitize_text_field($_POST['postId']));
			$rating = intval(sanitize_text_field($_POST['rating']));

			$amountOfRating1Votes = intval(get_post_meta($postId, 'rating_1_votes', true)) ?: 0;
			$amountOfRating2Votes = intval(get_post_meta($postId, 'rating_2_votes', true)) ?: 0;
			$amountOfRating3Votes = intval(get_post_meta($postId, 'rating_3_votes', true)) ?: 0;
			$amountOfRating4Votes = intval(get_post_meta($postId, 'rating_4_votes', true)) ?: 0;
			$amountOfRating5Votes = intval(get_post_meta($postId, 'rating_5_votes', true)) ?: 0;

			switch ($rating) {
				case 1:
					$amountOfRating1Votes++;
					update_post_meta($postId, 'rating_1_votes', $amountOfRating1Votes);
					break;
				case 2:
					$amountOfRating2Votes++;
					update_post_meta($postId, 'rating_2_votes', $amountOfRating2Votes);
					break;
				case 3:
					$amountOfRating3Votes++;
					update_post_meta($postId, 'rating_3_votes', $amountOfRating3Votes);
					break;
				case 4:
					$amountOfRating4Votes++;
					update_post_meta($postId, 'rating_4_votes', $amountOfRating4Votes);
					break;
				case 5:
					$amountOfRating5Votes++;
					update_post_meta($postId, 'rating_5_votes', $amountOfRating5Votes);
					break;
			}

			$totalAmount = $amountOfRating1Votes + $amountOfRating2Votes + $amountOfRating3Votes + $amountOfRating4Votes + $amountOfRating5Votes;
			$totalRating = ($amountOfRating1Votes * 1) +
				($amountOfRating2Votes * 2) +
				($amountOfRating3Votes * 3) +
				($amountOfRating4Votes * 4) +
				($amountOfRating5Votes * 5);
			$averageRating = round($totalRating / $totalAmount, 1);

			update_post_meta($postId, 'rating_count', $totalAmount);
			update_post_meta($postId, 'average_rating', $averageRating);

			wp_send_json_success([
				"averageRating" => $averageRating
			]);
			wp_die();
		}
	}



	private function extractIngredients($ingredientsHtml)
	{
		$ingredientsArray = explode('</li><li>', $ingredientsHtml);
		$ingredientsArray = array_map(function ($item) {
			$result = str_replace(['<li>', '</li>'], '', $item);
			return $result;
			// return strip_tags($item);
		}, $ingredientsArray);

		$ingredientsArray = array_map(function ($item) {
			preg_match('/^ *([0-9,.\/]*)? *(gramm|milliliter|kg|g|ml|tl|el|l)? (.*)$/i', $item, $matches);
			if (count($matches) >= 3) {
				return [
					"amount" => str_replace(',', '.', $matches[1]),
					"unit" => $matches[2],
					"ingredient" => $matches[3],
				];
			} else {
				return [
					"ingredient" => $item,
				];
			}
		}, $ingredientsArray);

		return $ingredientsArray;
	}

	public function getStyleBlockTemplate()
	{
		$dir = dirname(__FILE__);
		return file_get_contents($dir . '/src/blocks/block/style-block.hbs');
	}

	private function getStyleBlockRenderer()
	{
		if (!file_exists(plugin_dir_path(__FILE__) . '/build/style-block-template.php') || WP_DEBUG) {
			$dir = dirname(__FILE__);
			$template = file_get_contents($dir . '/src/blocks/block/style-block.hbs');

			$phpStr = LightnCandy::compile($template, array(
				'flags' => LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_ERROR_EXCEPTION,
				'helpers' => array(
					'encode' => function ($context, $options) {
						return urlencode($context);
					},
					'shade' => function ($color, $shade, $options) {
						return $this->shadeColor($color, $shade);
					},
				)
			));

			// Save the compiled PHP code into a php file
			file_put_contents(plugin_dir_path(__FILE__) . '/build/style-block-template.php', '<?php ' . $phpStr . '?>');
		}

		// Get the render function from the php file
		return include(plugin_dir_path(__FILE__) . '/build/style-block-template.php');
	}

	public function renderStyleBlockTemplate()
	{
		$options = $this->getStyleOptions();
		$svgs = $this->getSvgs($options);
		$renderer = $this->getStyleBlockRenderer();
		return $renderer(array(
			"options" => $options,
			"svgs" => $svgs
		));
	}

	private function shadeColor($color, $shade)
	{
		$num = base_convert(substr($color, 1), 16, 10);
		$amt = round(2.55 * $shade);
		$r = ($num >> 16) + $amt;
		$b = ($num >> 8 & 0x00ff) + $amt;
		$g = ($num & 0x0000ff) + $amt;

		return '#' . substr(base_convert(0x1000000 + ($r < 255 ? ($r < 1 ? 0 : $r) : 255) * 0x10000 + ($b < 255 ? ($b < 1 ? 0 : $b) : 255) * 0x100 + ($g < 255 ? ($g < 1 ? 0 : $g) : 255), 10, 16), 1);
	}

	private function getTemplateRenderer()
	{
		if (!file_exists(plugin_dir_path(__FILE__) . '/build/block-template.php') || WP_DEBUG) {
			$dir = dirname(__FILE__);
			$template = file_get_contents($dir . '/src/blocks/block/block.hbs');
			$styleBlockTemplate = $this->getStyleBlockTemplate();

			$phpStr = LightnCandy::compile($template, array(
				'flags' => LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_ERROR_EXCEPTION,
				'helpers' => array(
					'formatDuration' => function ($context, $options) {
						if (isset($context) && $context !== '') {
							$minutes = intval($context);

							if ($minutes < 60) {
								return $minutes . ' ' . __('minutes', 'foodblogkitchen-toolkit');
							} else {
								$hours = floor($minutes / 60);
								$rest = $minutes % 60;

								return $hours . ' ' . __('hours', 'foodblogkitchen-toolkit') . ($rest > 0 ? ' ' . $rest . ' ' . __('minutes', 'foodblogkitchen-toolkit') : '');
							}
						}

						return '';
					},
					'toJSON' => function ($context, $options) {
						return json_encode($context);
					},
					'encode' => function ($context, $options) {
						return urlencode($context);
					},
					'shade' => function ($color, $shade, $options) {
						return $this->shadeColor($color, $shade);
					},
					'ifMoreOrEqual' => function ($arg1, $arg2, $options) {
						if ($arg1 >= $arg2) {
							return $options['fn']();
						} else {
							return $options['inverse']();
						}
					}
				),
				"partials" => array(
					"styleBlock" => $styleBlockTemplate
				)
			));

			// Save the compiled PHP code into a php file
			file_put_contents(plugin_dir_path(__FILE__) . '/build/block-template.php', '<?php ' . $phpStr . '?>');
		}

		// Get the render function from the php file
		return include(plugin_dir_path(__FILE__) . '/build/block-template.php');
	}

	private function renderTemplate($data)
	{
		$renderer = $this->getTemplateRenderer();
		return $renderer($data);
	}

	public function getDummyData()
	{
		return array(
			"translations" => $this->getTemplateTranslations(),
			"recipeYield" => 2,
			"recipeYieldUnit" => __("servings", 'foodblogkitchen-toolkit'),
			"difficulty" => __('simple', 'foodblogkitchen-toolkit'),
			'prepTime' => 0,
			'cookTime' => 5,
			'name' => __("Banana shake", 'foodblogkitchen-toolkit'),
			"description" => __("You have bananas left over again and don't know what to do with them? How about a delicious shake?", 'foodblogkitchen-toolkit'),
			'totalTime' => 5,
			"ingredients" => array(
				array(
					"baseUnit" => "ml",
					"baseAmount" => 250,
					"amount" => 500,
					"unit" => "ml",
					"ingredient" => __("milk", 'foodblogkitchen-toolkit')
				),
				array(
					"baseUnit" => "",
					"baseAmount" => 0.5,
					"amount" => 1,
					"unit" => "",
					"ingredient" => __("banana", 'foodblogkitchen-toolkit')
				),
				array(
					"baseUnit" => "TL",
					"baseAmount" => 0.5,
					"amount" => 1,
					"unit" => "TL",
					"ingredient" => __("sugar", 'foodblogkitchen-toolkit')
				),
				array(
					"baseUnit" => "",
					"baseAmount" => 0,
					"amount" => 0,
					"unit" => "",
					"ingredient" => __("cinnamon", 'foodblogkitchen-toolkit')
				),
			),
			"preparationSteps" => '<li>' . join("</li><li>", [
				__("Peel banana.", 'foodblogkitchen-toolkit'),
				__("Put all the ingredients in the blender and mix everything for 30 seconds.", 'foodblogkitchen-toolkit'),
				__("Pour into a glass and enjoy.", 'foodblogkitchen-toolkit'),
			]) . '</li>',
			"averageRating" => 4.5,
			"thumbnail" => plugins_url('assets/banana-shake-4_3.png', __FILE__),
			"notes" => __("The milkshake becomes particularly creamy with UHT milk.", 'foodblogkitchen-toolkit')
		);
	}

	public function renderDummyTemplate()
	{
		$dummyData = $this->getDummyData();

		$renderer = $this->getTemplateRenderer();

		return $renderer($dummyData);
	}

	private function getTemplateTranslations()
	{
		return [
			"prepTime" => __('Prep time', 'foodblogkitchen-toolkit'),
			"restTime" => __('Rest time', 'foodblogkitchen-toolkit'),
			"cookTime" => __('Cook time', 'foodblogkitchen-toolkit'),
			"bakingTime" => __('Baking time', 'foodblogkitchen-toolkit'),
			"totalTime" => __('Total time', 'foodblogkitchen-toolkit'),
			"yield" => __('yields', 'foodblogkitchen-toolkit'),
			"ingredients" => __('Ingredients', 'foodblogkitchen-toolkit'),
			"preparationSteps" => __('Steps of preparation', 'foodblogkitchen-toolkit'),
			"print" => __('Print', 'foodblogkitchen-toolkit'),
			"pinIt" => __('Pin it', 'foodblogkitchen-toolkit'),
			"yourRating" => __('Your rating', 'foodblogkitchen-toolkit'),
			"averageRating" => __('Average rating', 'foodblogkitchen-toolkit'),
			"notes" => __('Notes', 'foodblogkitchen-toolkit'),
			"feedback" => __('How do you like the recipe?', 'foodblogkitchen-toolkit'),
			"servings" => __('servings', 'foodblogkitchen-toolkit'),
			"video" => __('Video', 'foodblogkitchen-toolkit'),
		];
	}

	public function renderBlock($attributes, $context)
	{
		$attributes['translations'] = $this->getTemplateTranslations();

		$attributes['postId'] = get_the_ID();
		$attributes['ajaxUrl'] = admin_url('admin-ajax.php');
		$attributes['nonce'] =  wp_create_nonce('foodblogkitchen-toolkit');

		$averageRating = get_post_meta(get_the_ID(), 'average_rating', true) ?: 0;
		$ratingCount = get_post_meta(get_the_ID(), 'rating_count', true) ?: 0;

		$attributes['servings'] = isset($attributes['servings']) ? intval($attributes['servings']) : 0;
		$attributes['recipeYield'] = isset($attributes['recipeYield']) ? intval($attributes['recipeYield']) : 0;

		$attributes['prepTime'] = floatval($attributes['prepTime']);
		$attributes['restTime'] = floatval($attributes['restTime']);
		$attributes['cookTime'] = floatval($attributes['cookTime']);
		$attributes['bakingTime'] = floatval($attributes['bakingTime']);
		$attributes['totalTime'] = floatval($attributes['totalTime']);

		if (isset($attributes['difficulty']) && !empty($attributes['difficulty'])) {
			$attributes['difficulty'] = __($attributes['difficulty'], 'foodblogkitchen-toolkit');
		}

		if (isset($attributes['recipeYieldUnit']) && !empty($attributes['recipeYieldUnit'])) {
			$attributes['recipeYieldUnit'] = __($attributes['recipeYieldUnit'], 'foodblogkitchen-toolkit');
		}

		$attributes['ingredients'] = array_map(function ($item) use ($attributes) {
			$baseItemsAmount = $attributes['servings'] ?: $attributes['recipeYield'];

			if (isset($item['amount']) && $baseItemsAmount !== 0) {
				$item['baseAmount'] = floatval($item['amount']) / $baseItemsAmount;
			}

			if (isset($item['unit'])) {
				if (preg_match("/^(g|ml)$/i", $item['unit'])) {
					$item['baseUnit'] = $item['unit'];
				} else if (preg_match("/^(kilo|kilogramm|kg)$/i", $item['unit'])) {
					$item['baseUnit'] = 'g';
					if (isset($item['baseAmount'])) {
						$item['baseAmount'] = $item['baseAmount'];
					}
				} else if (preg_match("/^(liter)$/i", $item['unit'])) {
					$item['baseUnit'] = 'ml';
					if (isset($item['baseAmount'])) {
						$item['baseAmount'] = $item['baseAmount'] / 1000;
					}
				} else {
					$item['baseUnit'] = $item['unit'];
				}
			}

			return $item;
		}, $this->extractIngredients($attributes['ingredients']));

		$attributes['averageRating'] = $averageRating;

		$keywords = get_the_tags();

		if ($keywords !== false && count($keywords) > 0) {
			$keywordsString = implode(', ', array_map(function ($tag) {
				return $tag->name;
			}, $keywords));
		} else {
			$keywordsString = '';
		}

		$categories = get_the_category();
		if ($categories !== false && count($categories) > 0) {
			$category = array_map(function ($category) {
				return $category->name;
			}, $categories)[0];
		} else {
			$category = '';
		}

		$thumbnailImageCandidates = ["image3_2", "image4_3", "image16_9", "image1_1"];

		foreach ($thumbnailImageCandidates as $imageCandidate) {
			if (isset($attributes[$imageCandidate . 'Id'])) {
				$image = wp_get_attachment_image_src($attributes[$imageCandidate . 'Id'], 'foodblogkitchen-toolkit--thumbnail');

				if ($image) {
					$attributes['thumbnail'] = $image[0];
					break;
				}
			}

			if (!isset($attributes['thumbnail']) && isset($attributes[$imageCandidate])) {
				$attributes['thumbnail'] = $attributes[$imageCandidate];
			}
		}

		$images = [];

		if (isset($attributes['image1_1']) && !empty($attributes['image1_1'])) {
			$images[] = $attributes['image1_1'];
		}
		if (isset($attributes['image3_2']) && !empty($attributes['image3_2'])) {
			$images[] = $attributes['image3_2'];
		}
		if (isset($attributes['image4_3']) && !empty($attributes['image4_3'])) {
			$images[] = $attributes['image4_3'];
		}
		if (isset($attributes['image16_9']) && !empty($attributes['image16_9'])) {
			$images[] = $attributes['image16_9'];
		}

		$description = isset($attributes['description']) ? $attributes['description'] : '';

		// Process the pinterest image

		$pinterestImageId = get_post_meta(get_the_ID(), 'foodblogkitchen_pinterest_image_id', true) ?: null;
		$currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

		if ($pinterestImageId !== null) {
			$pinterestImageUrl = wp_get_attachment_image_src($pinterestImageId, 'foodblogkitchen-toolkit--pinterest');
			if ($pinterestImageUrl) {
				$attributes['pinterestPinItUrl'] = 'https://www.pinterest.com/pin/create/button/' .
					'?url=' . urlencode($currentUrl) .
					'&media=' . urlencode($pinterestImageUrl[0]) .
					'&description=' . urlencode($description);
			}
		}


		$attributes['ldJson'] = [
			"@context" => "https://schema.org/",
			"@type" => "Recipe",
			"name" => isset($attributes['name']) ? $attributes['name'] : '',
			"image" => $images,
			"author" => [
				"@type" => "Person",
				"name" => get_the_author_meta('display_name')
			],
			"datePublished" => get_the_date("Y-m-d"), // "2018-03-10",
			"description" => $description,
			"recipeCuisine" => isset($attributes['recipeCuisine']) ? $attributes['recipeCuisine'] : '',
			"prepTime" => isset($attributes['prepTime']) ? $this->toIso8601Duration(intval($attributes['prepTime']) * 60) : '',
			"cookTime" => $this->getCooktimeForSchema($attributes),
			"totalTime" => isset($attributes['totalTime']) ? $this->toIso8601Duration(intval($attributes['totalTime']) * 60) : '',
			"keywords" => $keywordsString,
			"recipeYield" => isset($attributes['recipeYield']) ? $attributes['recipeYield'] . (isset($attributes['recipeYieldUnit']) ? ' ' . $attributes['recipeYieldUnit'] : '') : '',
			"recipeCategory" => $category,
			"nutrition" => (isset($attributes['calories']) && !empty($attributes['calories'])) ? [
				"@type" => "NutritionInformation",
				"calories" => $attributes['calories']
			] : '',
			"recipeIngredient" =>
			isset($attributes['ingredients']) ?
				array_map(function ($item) {
					return trim((isset($item['amount']) ? $item['amount'] : '') . ' ' . (isset($item['unit']) ? $item['unit'] : '') . ' ' . (isset($item['ingredient']) ? strip_tags($item['ingredient']) : ''));
				}, $attributes['ingredients']) : '',
			"recipeInstructions" =>
			isset($attributes['preparationSteps']) ?
				array_map(function ($item) {
					return [
						"@type" => "HowToStep",
						"text" => strip_tags($item)
					];
				}, explode('\n', str_replace('li><li', 'li>\n<li', $attributes['preparationSteps']))) : '',
		];

		if ($averageRating > 0 && $ratingCount > 0) {
			$attributes['ldJson']["aggregateRating"] = [
				"@type" => "AggregateRating",
				"ratingValue" => "$averageRating",
				"ratingCount" => "$ratingCount"
			];
		}

		if (isset($attributes['videoIframeUrl']) && !empty($attributes['videoIframeUrl'])) {
			$attributes['ldJson']['video'] = [
				"@type" => "VideoObject",
				"description" => $attributes['description'],
				"name" => isset($attributes['name']) ? $attributes['name'] : '',
				"thumbnailUrl" => $attributes['thumbnail'],
				"uploadDate" => get_the_date('Y-m-d'),
				'embedUrl' => $attributes['videoIframeUrl']
			];
		}

		// Remove empty strings from ldJon
		$attributes['ldJson'] = array_filter($attributes['ldJson']);

		$attributes['options'] = $this->getStyleOptions();
		$attributes['svgs'] = $this->getSvgs($attributes['options']);

		return $this->renderTemplate($attributes);
	}

	private function getStyleOptions()
	{
		return array(
			"primaryColor" => get_option('foodblogkitchen_toolkit__primary_color', $this->primaryColorDefault),
			"primaryColorLight" => get_option('foodblogkitchen_toolkit__primary_color_light', $this->primaryColorLightDefault),
			"primaryColorLightContrast" => get_option('foodblogkitchen_toolkit__primary_color_light_contrast', $this->primaryColorLightContrastDefault),
			"primaryColorDark" => get_option('foodblogkitchen_toolkit__primary_color_dark', $this->primaryColorDarkDefault),
			"secondaryColor" => get_option('foodblogkitchen_toolkit__secondary_color', $this->secondaryColorDefault),
			"secondaryColorContrast" => get_option('foodblogkitchen_toolkit__secondary_color_contrast', $this->secondaryColorContrastDefault),
			"backgroundColor" => get_option('foodblogkitchen_toolkit__background_color', $this->backgroundColorDefault),
			"backgroundColorContrast" => get_option('foodblogkitchen_toolkit__background_color_contrast', $this->backgroundColorContrastDefault),
			"showBorder" => get_option('foodblogkitchen_toolkit__show_border', $this->showBorderDefault),
			"showBoxShadow" => get_option('foodblogkitchen_toolkit__show_box_shadow', $this->showBoxShadowDefault),
			"borderRadius" => get_option('foodblogkitchen_toolkit__border_radius', $this->borderRadiusDefault),
		);
	}

	private function toIso8601Duration($seconds)
	{
		$days = floor($seconds / 86400);
		$seconds = $seconds % 86400;

		$hours = floor($seconds / 3600);
		$seconds = $seconds % 3600;

		$minutes = floor($seconds / 60);
		$seconds = $seconds % 60;

		return sprintf('P%dDT%dH%dM%dS', $days, $hours, $minutes, $seconds);
	}

	// Schema.org has only cookTime, so I calculate cook time and baking time together
	private function getCooktimeForSchema($attributes)
	{
		$cookTime = isset($attributes['cookTime']) ? intval($attributes['cookTime']) : 0;
		$bakingTime = isset($attributes['bakingTime']) ? intval($attributes['bakingTime']) : 0;

		return $this->toIso8601Duration(($cookTime + $bakingTime) * 60);
	}

	private function getSvgs($colors)
	{
		return array(
			"clock" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="' . $colors['backgroundColorContrast'] . '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>'),
			"star" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' . $colors['primaryColor'] . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'),
			"starFilled" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' . $colors['primaryColor'] . '" stroke="' . $colors['primaryColor'] . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'),
			"starHalfFilled" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="url(%23half_grad)" stroke="' . $colors['primaryColor'] . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="half_grad"><stop offset="50%" stop-color="' . $colors['primaryColor'] . '"/><stop offset="50%" stop-color="transparent" stop-opacity="1" /></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'),
			"starHighlighted" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' . $colors['primaryColorDark'] . '" stroke="' . $colors['primaryColorDark'] . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'),
		);
	}

	private function base64EncodeImage($svg)
	{
		$base64_image = 'data:image/svg+xml;base64,' . base64_encode($this->unescape(rawurlencode($svg)));
		return $base64_image;
	}

	private function unescape($str)
	{
		$ret = '';
		$len = strlen($str);
		for ($i = 0; $i < $len; $i++) {
			if ($str[$i] == '%' && $str[$i + 1] == 'u') {
				$val = hexdec(substr($str, $i + 2, 4));
				if ($val < 0x7f)
					$ret .= chr($val);
				else if ($val < 0x800)
					$ret .= chr(0xc0 | ($val >> 6)) . chr(0x80 | ($val & 0x3f));
				else
					$ret .= chr(0xe0 | ($val >> 12)) . chr(0x80 | (($val >> 6) & 0x3f)) . chr(0x80 | ($val & 0x3f));
				$i += 5;
			} else if ($str[$i] == '%') {
				$ret .= urldecode(substr($str, $i, 3));
				$i += 2;
			} else
				$ret .= $str[$i];
		}
		return $ret;
	}
}

if (class_exists('FoodblogkitchenToolkit')) {
	$foodblogkitchenToolkit = new FoodblogkitchenToolkit();

	register_activation_hook(__FILE__, array($foodblogkitchenToolkit, 'activate'));

	register_deactivation_hook(__FILE__, array($foodblogkitchenToolkit, 'deactivate'));
}
