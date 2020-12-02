<?php

/**
 * Plugin Name:     Recipes | foodblogkitchen
 * Description:     Recipe block for the Gutenberg editor to easily include recipes and automatically optimize them for search engines.
 * Version:         0.1.0
 * Author:          foodblogkitchen.com
 * Text Domain:     foodblogkitchen-recipes
 * Domain Path:     /languages
 */

if (!defined('ABSPATH')) {
	die;
}

require "vendor/autoload.php";

use LightnCandy\LightnCandy;

class FoodblogKitchenRecipes
{
	private $primaryColorDefault = '#e27a7a';
	private $primaryColorLightDefault = '#f7e9e9';
	private $primaryColorLightContrastDefault = '#000000';
	private $primaryColorDarkDefault = '#d55a5a';
	private $secondaryColorDefault = '#efefef';
	private $secondaryColorContrastDefault = '#000000';
	private $backgroundColorDefault = '#fefcfc';
	private $backgroundColorContrastDefault = '#000000';
	private $thumnailSizeDefault = 330;

	function __construct()
	{
		add_action('init', array($this, 'addRessources'));
		add_action('init', array($this, 'registerBlock'));
		add_action('init', array($this, 'registerMeta'));
		add_action('init', array($this, 'loadTranslations'));

		add_action('admin_init', array($this, 'registerSettings'));
		add_action('admin_menu', array($this, 'registerSettingsPage'));

		add_action('admin_enqueue_scripts', array($this, 'enqueueAdminJs'));

		add_image_size('foodblogkitchen-recipes--thumbnail', get_option('foodblogkitchen_recipes__thumbnail_size', $this->thumnailSizeDefault));

		// Frontend-AJAX-Actions
		add_action('wp_ajax_foodblogkitchen_recipes_set_rating', array($this, 'setRating'));
		add_action('wp_ajax_nopriv_foodblogkitchen_recipes_set_rating', array($this, 'setRating'));

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
		if ('foodblogkitchen-recipes' !== $args->slug) {
			return false;
		}

		// trying to get from cache first
		if (false == $remote = get_transient('foodblogkitchen_recipes_update')) {
			// info.json is the file with the actual plugin information on your server
			$remote = wp_remote_get('https://foodblogkitchen.com/plugin-updates/foodblogkitchen-recipes.json', array(
				'timeout' => 10,
				'headers' => array(
					'Accept' => 'application/json'
				)
			));

			if (!is_wp_error($remote) && isset($remote['response']['code']) && $remote['response']['code'] == 200 && !empty($remote['body'])) {
				set_transient('foodblogkitchen_recipes_update', $remote, 43200); // 12 hours cache
			}
		}

		if (!is_wp_error($remote) && isset($remote['response']['code']) && $remote['response']['code'] == 200 && !empty($remote['body'])) {

			$remote = json_decode($remote['body']);
			$res = new stdClass();

			$res->name = $remote->name;
			$res->slug = 'foodblogkitchen-recipes';
			$res->version = $remote->version;
			$res->tested = $remote->tested;
			$res->requires = $remote->requires;
			$res->author = '<a href="https://rudrastyh.com">Misha Rudrastyh</a>';
			$res->author_profile = 'https://profiles.wordpress.org/rudrastyh';
			$res->download_link = $remote->download_url;
			$res->trunk = $remote->download_url;
			$res->requires_php = '5.3'; // TODO
			$res->last_updated = $remote->last_updated;
			$res->sections = array(
				'description' => $remote->sections->description,
				'installation' => $remote->sections->installation,
				'changelog' => $remote->sections->changelog
				// you can add your custom sections (tabs) here
			);

			// in case you want the screenshots tab, use the following HTML format for its content:
			// <ol><li><a href="IMG_URL" target="_blank"><img src="IMG_URL" alt="CAPTION" /></a><p>CAPTION</p></li></ol>
			if (!empty($remote->sections->screenshots)) {
				$res->sections['screenshots'] = $remote->sections->screenshots;
			}

			$res->banners = array(
				'low' => 'https://YOUR_WEBSITE/banner-772x250.jpg',
				'high' => 'https://YOUR_WEBSITE/banner-1544x500.jpg'
			);
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
		if (false == $remote = get_transient('foodblogkitchen_recipes_upgrade')) {

			// info.json is the file with the actual plugin information on your server
			$remote = wp_remote_get('https://codingyourideas.de/plugin-updates/foodblogkitchen-recipes.json', array(
				'timeout' => 10,
				'headers' => array(
					'Accept' => 'application/json'
				)
			));

			if (!is_wp_error($remote) && isset($remote['response']['code']) && $remote['response']['code'] == 200 && !empty($remote['body'])) {
				set_transient('foodblogkitchen_recipes_upgrade', $remote, 43200); // 12 hours cache
			}
		}

		if ($remote) {

			$remote = json_decode($remote['body']);

			// your installed plugin version should be on the line below! You can obtain it dynamically of course 
			if ($remote && version_compare('1.0', $remote->version, '<') && version_compare($remote->requires, get_bloginfo('version'), '<')) {
				$res = new stdClass();
				$res->slug = 'foodblogkitchen-recipes';
				$res->plugin = 'foodblogkitchen-recipes/foodblogkitchen-recipes.php'; // it could be just foodblogkitchen-recipes.php if your plugin doesn't have its own directory
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
			delete_transient('foodblogkitchen_recipes_upgrade');
		}
	}

	public function enqueueAdminJs()
	{
		// Enable Color Picker for Settings Page
		wp_enqueue_style('wp-color-picker');
		wp_enqueue_style('iris');


		wp_enqueue_script('foodblogkitchen-recipes-settings-js', 	plugins_url('build/admin.js', __FILE__), array('jquery', 'wp-color-picker', 'iris'), '', true);

		wp_enqueue_style('foodblogkitchen-recipes-settings-admin-css', 	plugins_url('build/admin.css', __FILE__), array(), '', 'all');

		echo $this->renderStyleBlockTemplate();
	}

	public function registerSettingsPage()
	{
		add_menu_page(
			__("foodblogkitchen", "foodblogkitchen-recipes"),
			__('foodblogkitchen', "foodblogkitchen-recipes"),
			'manage_options',
			'foodblogkitchen_recipes',
			function () {
				return require_once(plugin_dir_path(__FILE__) . 'templates/admin-index-page.php');
			},
			'dashicons-carrot',
			100
		);

		add_submenu_page(
			'foodblogkitchen_recipes',
			__('Recipes', "foodblogkitchen-recipes"),
			__("Settings", "foodblogkitchen-recipes"),
			'manage_options',
			'foodblogkitchen_recipes',
			function () {
				return require_once(plugin_dir_path(__FILE__) . 'templates/admin-index-page.php');
			}
		);
	}

	private function renderColorPickerInput($name, $defaultValue)
	{
		$value = esc_attr(get_option($name, $defaultValue));
		echo '<input type="text" class="foodblogkitchen-recipes--color-picker" name="' . $name . '" value="' . $value . '" data-default-value="' .  $defaultValue . '" />';
	}

	private function renderHiddenInput($name, $defaultValue)
	{
		$value = esc_attr(get_option($name, $defaultValue));
		echo '<input type="hidden" name="' . $name . '" value="' . $value . '" />';
	}

	public function registerSettings()
	{
		// Settings
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__primary_color',
			array(
				"default" => $this->primaryColorDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__primary_color_light',
			array(
				"default" => $this->primaryColorLightDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__primary_color_light_contrast',
			array(
				"default" => $this->primaryColorLightContrastDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__primary_color_dark',
			array(
				"default" => $this->primaryColorDarkDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__secondary_color',
			array(
				"default" => $this->secondaryColorDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__secondary_color_contrast',
			array(
				"default" => $this->secondaryColorContrastDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__background_color',
			array(
				"default" => $this->backgroundColorDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__background_color_contrast',
			array(
				"default" => $this->backgroundColorContrastDefault
			)
		);
		register_setting(
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__thumbnail_size',
			array(
				"default" => $this->thumnailSizeDefault
			)
		);

		// Sections
		add_settings_section(
			'foodblogkitchen_recipes__general',
			__('General settings', "foodblogkitchen-recipes"),
			function () {
				echo '<p>' . __("Configure how the recipe block should look for your visitors.", "foodblogkitchen-recipes") . '</p>';
			},
			'foodblogkitchen_recipes__general'
		);

		// Fields
		add_settings_field(
			'foodblogkitchen_recipes__primary_color',
			__('Primary color', 'foodblogkitchen-recipes'),
			function () {
				$this->renderColorPickerInput('foodblogkitchen_recipes__primary_color', $this->primaryColorDefault);
			},
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__general',
			array(
				'label_for' => 'foodblogkitchen_recipes__primary_color'
			)
		);
		// add_settings_field(
		// 	'foodblogkitchen_recipes__primary_color_light',
		// 	null,
		// 	function () {
		// 		$this->renderHiddenInput('foodblogkitchen_recipes__primary_color_light', $this->primaryColorLightDefault);
		// 	},
		// 	'foodblogkitchen_recipes__general',
		// 	'foodblogkitchen_recipes__general',
		// 	array(
		// 		'label_for' => 'foodblogkitchen_recipes__primary_color_light'
		// 	)
		// );
		// add_settings_field(
		// 	'foodblogkitchen_recipes__primary_color_light_contrast',
		// 	__('Primary color (light)', 'foodblogkitchen-recipes'),
		// 	function () {
		// 		$this->renderHiddenInput('foodblogkitchen_recipes__primary_color_light_contrast', $this->primaryColorLightContrastDefault);
		// 	},
		// 	'foodblogkitchen_recipes__general',
		// 	'foodblogkitchen_recipes__general',
		// 	array(
		// 		'label_for' => 'foodblogkitchen_recipes__primary_color_light_contrast'
		// 	)
		// );
		// add_settings_field(
		// 	'foodblogkitchen_recipes__primary_color_dark',
		// 	__('Primary color (dark)', 'foodblogkitchen-recipes'),
		// 	function () {
		// 		$this->renderHiddenInput('foodblogkitchen_recipes__primary_color_dark', $this->primaryColorDarkDefault);
		// 	},
		// 	'foodblogkitchen_recipes__general',
		// 	'foodblogkitchen_recipes__general',
		// 	array(
		// 		'label_for' => 'foodblogkitchen_recipes__primary_color_dark'
		// 	)
		// );
		add_settings_field(
			'foodblogkitchen_recipes__secondary_color',
			__('Secondary color', 'foodblogkitchen-recipes'),
			function () {
				$this->renderColorPickerInput('foodblogkitchen_recipes__secondary_color', $this->secondaryColorDefault);
			},
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__general',
			array(
				'label_for' => 'foodblogkitchen_recipes__secondary_color'
			)
		);
		// add_settings_field(
		// 	'foodblogkitchen_recipes__secondary_color_contrast',
		// 	__('Secondary color', 'foodblogkitchen-recipes'),
		// 	function () {
		// 		$this->renderHiddenInput('foodblogkitchen_recipes__secondary_color_contrast', $this->secondaryColorContrastDefault);
		// 	},
		// 	'foodblogkitchen_recipes__general',
		// 	'foodblogkitchen_recipes__general',
		// 	array(
		// 		'label_for' => 'foodblogkitchen_recipes__secondary_color_contrast'
		// 	)
		// );
		add_settings_field(
			'foodblogkitchen_recipes__background_color',
			__('Background color', 'foodblogkitchen-recipes'),
			function () {
				$this->renderColorPickerInput('foodblogkitchen_recipes__background_color', $this->backgroundColorDefault);
			},
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__general',
			array(
				'label_for' => 'foodblogkitchen_recipes__background_color'
			)
		);
		// add_settings_field(
		// 	'foodblogkitchen_recipes__background_color_contrast',
		// 	__('Background color', 'foodblogkitchen-recipes'),
		// 	function () {
		// 		$this->renderHiddenInput('foodblogkitchen_recipes__background_color_contrast', $this->backgroundColorContrastDefault);
		// 	},
		// 	'foodblogkitchen_recipes__general',
		// 	'foodblogkitchen_recipes__general',
		// 	array(
		// 		'label_for' => 'foodblogkitchen_recipes__background_color_contrast'
		// 	)
		// );
		add_settings_field(
			'foodblogkitchen_recipes__thumbnail_size',
			__('Thumbnail size', 'foodblogkitchen-recipes'),
			function () {
				$value = esc_attr(get_option('foodblogkitchen_recipes__thumbnail_size'));
				echo '<input type="number" name="foodblogkitchen_recipes__thumbnail_size" value="' . $value . '" />';
				echo '<p class="description">';
				/* translators: %s is replaced with link to the plugin  */
				printf(__("If you change this value, you must recreate your thumbnails.<br /> This can be done with the great plugin %s.", 'foodblogkitchen-recipes'), '<a href="https://wordpress.org/plugins/regenerate-thumbnails/" target="_blank">Regenerate Thumbnails</a>');
				echo '</p>';
			},
			'foodblogkitchen_recipes__general',
			'foodblogkitchen_recipes__general',
			array(
				'label_for' => 'foodblogkitchen_recipes__thumbnail_size'
			)
		);
	}

	public function loadTranslations()
	{
		load_plugin_textdomain('foodblogkitchen-recipes', FALSE, basename(dirname(__FILE__)) . '/languages/');
	}

	public function registerMeta()
	{
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

		$script_asset_path = "$dir/build/index.asset.php";
		if (!file_exists($script_asset_path)) {
			throw new Error(
				'You need to run `npm start` or `npm run build` for the "foodblogkitchen-recipes/block" block first.'
			);
		}
		$script_asset = require($script_asset_path);

		wp_register_script(
			'foodblogkitchen-recipes-block-editor',
			plugins_url('build/index.js', __FILE__),
			$script_asset['dependencies'],
			$script_asset['version']
		);
		wp_set_script_translations('foodblogkitchen-recipes-block-editor', 'foodblogkitchen-recipes', plugin_dir_path(__FILE__) . 'languages');

		$editor_css = 'build/index.css';
		wp_register_style(
			'foodblogkitchen-recipes-block-editor',
			plugins_url($editor_css, __FILE__),
			array(),
			filemtime("$dir/$editor_css")
		);

		$frontend_js = 'build/frontend.js';
		wp_register_script(
			'foodblogkitchen-recipes-block',
			plugins_url($frontend_js, __FILE__),
			array(),
			filemtime("$dir/$frontend_js")
		);

		$style_css = 'build/style-index.css';
		wp_register_style(
			'foodblogkitchen-recipes-block',
			plugins_url($style_css, __FILE__),
			array(),
			filemtime("$dir/$style_css")
		);
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
			'editor_script' => 'foodblogkitchen-recipes-block-editor',
			'editor_style'  => 'foodblogkitchen-recipes-block-editor',
			'script'        => 'foodblogkitchen-recipes-block',
			'style'         => 'foodblogkitchen-recipes-block',
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
		if (!check_ajax_referer('foodblogkitchen-recipes')) {
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
		$renderer = $this->getStyleBlockRenderer();
		return $renderer(array(
			"options" => $options
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
								return $minutes . ' ' . __('minutes', 'foodblogkitchen-recipes');
							} else {
								$hours = floor($minutes / 60);
								$rest = $minutes % 60;

								return $hours . ' ' . __('hours', 'foodblogkitchen-recipes') . ($rest > 0 ? ' ' . $rest . ' ' . __('minutes', 'foodblogkitchen-recipes') : '');
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
			"recipeYield" => 10,
			"recipeYieldUnit" => __("piece", 'foodblogkitchen-recipes'),
			"difficulty" => __('simple', 'foodblogkitchen-recipes'),
			'prepTime' => 15,
			'cookTime' => 30,
			'name' => __("Crêpes", 'foodblogkitchen-recipes'),
			'totalTime' => 105,
			"ingredients" => array(
				array(
					"baseUnit" => "g",
					"baseAmount" => 25,
					"amount" => 250,
					"unit" => "g",
					"ingredient" => __("Flour", "foodblogkitchen-recipes")
				),
				array(
					"baseUnit" => "g",
					"baseAmount" => 5,
					"amount" => 50,
					"unit" => "g",
					"ingredient" => __("Butter", "foodblogkitchen-recipes")
				),
				array(
					"baseUnit" => "ml",
					"baseAmount" => 50,
					"amount" => 500,
					"unit" => "ml",
					"ingredient" => __("Milk", "foodblogkitchen-recipes")
				),
				array(
					"baseUnit" => "",
					"baseAmount" => 0.4,
					"amount" => 4,
					"unit" => "",
					"ingredient" => __("Eggs", "foodblogkitchen-recipes")
				),
			),
			"preparationSteps" => '<li>Step 1</li><li>Step 2</li>',
			"averageRating" => 4.5,
			"description" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu ex fermentum, porta est in, congue ligula.",
			// TODO: Besserer Placeholder
			"thumbnail" => "https://placehold.it/300x200",
			"notes" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu ex fermentum, porta est in, congue ligula. Donec tristique massa id condimentum porttitor. Morbi quis neque eu libero volutpat dictum. Aenean nec enim sed massa aliquet congue. Duis sed aliquam odio. Aenean ut lorem pharetra, suscipit odio ac, blandit nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam vel massa justo. Sed laoreet tempus urna id convallis. Curabitur in felis in metus sollicitudin tristique."
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
			"prepTime" => __('Prep time', 'foodblogkitchen-recipes'),
			"restTime" => __('Rest time', 'foodblogkitchen-recipes'),
			"cookTime" => __('Cook time', 'foodblogkitchen-recipes'),
			"totalTime" => __('Total time', 'foodblogkitchen-recipes'),
			"yield" => __('yields', 'foodblogkitchen-recipes'),
			"ingredients" => __('Ingredients', 'foodblogkitchen-recipes'),
			"preparationSteps" => __('Steps of preparation', 'foodblogkitchen-recipes'),
			"yourRating" => __('Your rating', 'foodblogkitchen-recipes'),
			"averageRating" => __('Average rating', 'foodblogkitchen-recipes'),
			"notes" => __('Notes', 'foodblogkitchen-recipes'),
			"feedback" => __('How do you like the recipe?', 'foodblogkitchen-recipes'),
			"servings" => __('servings', 'foodblogkitchen-recipes')
		];
	}

	public function renderBlock($attributes, $context)
	{
		$attributes['translations'] = $this->getTemplateTranslations();

		$attributes['postId'] = get_the_ID();
		$attributes['ajaxUrl'] = admin_url('admin-ajax.php');
		$attributes['nonce'] =  wp_create_nonce('foodblogkitchen-recipes');

		$averageRating = get_post_meta(get_the_ID(), 'average_rating', true) ?: 0;
		$ratingCount = get_post_meta(get_the_ID(), 'rating_count', true) ?: 0;

		$attributes['servings'] = isset($attributes['servings']) ? intval($attributes['servings']) : 0;
		$attributes['recipeYield'] = isset($attributes['recipeYield']) ? intval($attributes['recipeYield']) : 0;

		$attributes['prepTime'] = floatval($attributes['prepTime']);
		$attributes['restTime'] = floatval($attributes['restTime']);
		$attributes['cookTime'] = floatval($attributes['cookTime']);
		$attributes['totalTime'] = floatval($attributes['totalTime']);

		if (isset($attributes['difficulty']) && !empty($attributes['difficulty'])) {
			$attributes['difficulty'] = __($attributes['difficulty'], 'foodblogkitchen-recipes');
		}

		if (isset($attributes['recipeYieldUnit']) && !empty($attributes['recipeYieldUnit'])) {
			$attributes['recipeYieldUnit'] = __($attributes['recipeYieldUnit'], 'foodblogkitchen-recipes');
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

		if (isset($attributes['image4_3Id'])) {
			$image = wp_get_attachment_image_src($attributes['image4_3Id'], 'foodblogkitchen-recipes--thumbnail');

			if ($image) {
				$attributes['thumbnail'] = $image[0];
			}
		}

		if (!isset($attributes['thumbnail'])) {
			$attributes['thumbnail'] = $attributes['image4_3'];
		}

		$images = [];

		if (isset($attributes['image1_1']) && !empty($attributes['image1_1'])) {
			$images[] = $attributes['image1_1'];
		}
		if (isset($attributes['image4_3']) && !empty($attributes['image4_3'])) {
			$images[] = $attributes['image4_3'];
		}
		if (isset($attributes['image16_9']) && !empty($attributes['image16_9'])) {
			$images[] = $attributes['image16_9'];
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
			"description" => isset($attributes['description']) ? $attributes['description'] : '',
			"recipeCuisine" => isset($attributes['recipeCuisine']) ? $attributes['recipeCuisine'] : '',
			"prepTime" => isset($attributes['prepTime']) ? $this->toIso8601Duration(intval($attributes['prepTime']) * 60) : '',
			"cookTime" => isset($attributes['cookTime']) ? $this->toIso8601Duration(intval($attributes['cookTime']) * 60) : '',
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
			// "video" => [
			// 	"@type" => "VideoObject",
			// 	"name" => "How to make a Party Coffee Cake",
			// 	"description" => "This is how you make a Party Coffee Cake.",
			// 	"thumbnailUrl" => [
			// 		"https://example.com/photos/1x1/photo.jpg",
			// 		"https://example.com/photos/4x3/photo.jpg",
			// 		"https://example.com/photos/16x9/photo.jpg"
			// 	],
			// 	"contentUrl" => "http://www.example.com/video123.mp4",
			// 	"embedUrl" => "http://www.example.com/videoplayer?video=123",
			// 	"uploadDate" => "2018-02-05T08:00:00+08:00",
			// 	"duration" => "PT1M33S",
			// 	"interactionStatistic" => [
			// 		"@type" => "InteractionCounter",
			// 		"interactionType" => ["@type" => "http://schema.org/WatchAction"],
			// 		"userInteractionCount" => 2347
			// 	],
			// 	"expires" => "2019-02-05T08:00:00+08:00"
			// ]
		];

		if ($averageRating > 0 && $ratingCount > 0) {
			$attributes['ldJson']["aggregateRating"] = [
				"@type" => "AggregateRating",
				"ratingValue" => "$averageRating",
				"ratingCount" => "$ratingCount"
			];
		}

		// Remove empty strings from ldJon
		$attributes['ldJson'] = array_filter($attributes['ldJson']);

		$attributes['options'] = $this->getStyleOptions();

		return $this->renderTemplate($attributes);
	}

	private function getStyleOptions()
	{
		return array(
			"primaryColor" => get_option('foodblogkitchen_recipes__primary_color', $this->primaryColorDefault),
			"primaryColorLight" => get_option('foodblogkitchen_recipes__primary_color_light', $this->primaryColorLightDefault),
			"primaryColorLightContrast" => get_option('foodblogkitchen_recipes__primary_color_light_contrast', $this->primaryColorLightContrastDefault),
			"primaryColorDark" => get_option('foodblogkitchen_recipes__primary_color_dark', $this->primaryColorDarkDefault),
			"secondaryColor" => get_option('foodblogkitchen_recipes__secondary_color', $this->secondaryColorDefault),
			"secondaryColorContrast" => get_option('foodblogkitchen_recipes__secondary_color_contrast', $this->secondaryColorContrastDefault),
			"backgroundColor" => get_option('foodblogkitchen_recipes__background_color', $this->backgroundColorDefault),
			"backgroundColorContrast" => get_option('foodblogkitchen_recipes__background_color_contrast', $this->backgroundColorContrastDefault),
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
}

if (class_exists('FoodblogKitchenRecipes')) {
	$foodblogKitchenRecipes = new FoodblogKitchenRecipes();

	register_activation_hook(__FILE__, array($foodblogKitchenRecipes, 'activate'));

	register_deactivation_hook(__FILE__, array($foodblogKitchenRecipes, 'deactivate'));
}
