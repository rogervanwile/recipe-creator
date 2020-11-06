<?php

/**
 * Plugin Name:     Recipe Manager Pro
 * Description:     Manage recipes and optimize them automatically for Google Featured Snippets.
 * Version:         0.0.1
 * Author:          Oliver Wagner
 * Text Domain:     recipe-manager-pro
 * Domain Path:     /languages
 */

// API-KEY
// https://fdc.nal.usda.gov/
// 2iwJE712Dw0XdRX1W37lKEVpiitkbZObX9qBtCNW
// Example: https://api.nal.usda.gov/fdc/v1/foods/search?api_key=2iwJE712Dw0XdRX1W37lKEVpiitkbZObX9qBtCNW&query=Cheddar%20Cheese

if (!defined('ABSPATH')) {
	die;
}

require "vendor/autoload.php";


use LightnCandy\LightnCandy;

class RecipeManagerPro
{
	function __construct()
	{
		// add_action('admin_enqueue_scripts', array($this, 'enqueue'));
		// add_action('wp_enqueue_scripts', array($this, 'enqueue'));

		add_action('init', array($this, 'addRessources'));
		add_action('init', array($this, 'registerBlock'));
		add_action('init', array($this, 'registerMeta'));

		// Frontend-AJAX-Actions
		add_action('wp_ajax_recipe_manager_pro_set_rating', array($this, 'setRating'));
		add_action('wp_ajax_nopriv_recipe_manager_pro_set_rating', array($this, 'setRating'));
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
				case 'sp-recipe-keywords':
					$recipe['keywords'] = $value[0];
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
				case 'sp-recipe-category':
					$recipe['recipeCategory'] = $value[0];
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

	private function getPropertyFromRecipe($recipe, $property)
	{
		if (isset($recipe) && isset($recipe[$property])) {
			return $recipe[$property];
		} else {
			return null;
		}
	}

	public function addRessources()
	{
		$dir = dirname(__FILE__);

		$script_asset_path = "$dir/build/index.asset.php";
		if (!file_exists($script_asset_path)) {
			throw new Error(
				'You need to run `npm start` or `npm run build` for the "recipe-manager-pro/block" block first.'
			);
		}
		$script_asset = require($script_asset_path);

		wp_register_script(
			'recipe-manager-pro-block-editor',
			plugins_url('build/index.js', __FILE__),
			$script_asset['dependencies'],
			$script_asset['version']
		);
		wp_set_script_translations('recipe-manager-pro-block-editor', 'block');

		$editor_css = 'build/index.css';
		wp_register_style(
			'recipe-manager-pro-block-editor',
			plugins_url($editor_css, __FILE__),
			array()
			// filemtime("$dir/$editor_css")
		);

		$frontend_js = 'build/frontend.js';
		wp_register_script(
			'recipe-manager-pro-block',
			plugins_url($frontend_js, __FILE__),
			array()
			// filemtime("$dir/$frontend_js")
		);

		$style_css = 'build/style-index.css';
		wp_register_style(
			'recipe-manager-pro-block',
			plugins_url($style_css, __FILE__),
			array(),
			filemtime("$dir/$style_css")
		);
	}

	public function registerBlock()
	{
		$recipe = $this->getRecipeFromSP();

		// The value of a property is not stored in the database if it is the default value
		// So I add a suffix on the default which is removed in "edit.js" and so it is possible
		// to store the migrated data.
		// Workaround for https://github.com/WordPress/gutenberg/issues/7342

		register_block_type('recipe-manager-pro/block', array(
			'editor_script' => 'recipe-manager-pro-block-editor',
			'editor_style'  => 'recipe-manager-pro-block-editor',
			'script'        => 'recipe-manager-pro-block',
			'style'         => 'recipe-manager-pro-block',
			'attributes' => array(
				'ingredients' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'ingredients') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'ingredientsArray' => array(
					'type' => 'array',
				),
				'preparationSteps' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'preparationSteps') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'name' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'name') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'description' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'description') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'difficulty' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'difficulty') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'notes' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'notes') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'keywords' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'keywords') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'prepTime' => array(
					'type' => 'number',
					'default' => $this->getPropertyFromRecipe($recipe, 'prepTime') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'prepTimeUnit' => array(
					'type' => 'string',
					'default' => ($this->getPropertyFromRecipe($recipe, 'prepTimeUnit') ?: 'Min') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'restTime' => array(
					'type' => 'number',
					'default' => $this->getPropertyFromRecipe($recipe, 'restTime') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'restTimeUnit' => array(
					'type' => 'string',
					'default' => ($this->getPropertyFromRecipe($recipe, 'restTimeUnit') ?: 'Min') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'cookTime' => array(
					'type' => 'number',
					'default' => $this->getPropertyFromRecipe($recipe, 'cookTime') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'cookTimeUnit' => array(
					'type' => 'string',
					'default' => ($this->getPropertyFromRecipe($recipe, 'cookTimeUnit') ?: 'Min') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'totalTime' => array(
					'type' => 'number',
					'default' => $this->getPropertyFromRecipe($recipe, 'totalTime') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'totalTimeUnit' => array(
					'type' => 'string',
					'default' => ($this->getPropertyFromRecipe($recipe, 'totalTimeUnit') ?: 'Min') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'recipeYield' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'recipeYield') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'servings' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'servings') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'calories' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'calories') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'recipeCategory' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'recipeCategory') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'recipeCuisine' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'recipeCuisine') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'image1_1' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image1_1') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'image4_3' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image4_3') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'image16_9' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'image16_9') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'videoUrl' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'videoUrl') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'content' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'content') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'className' => array(
					'type' => 'string',
					'default' => $this->getPropertyFromRecipe($recipe, 'className') . '::STORE_DEFAULT_VALUE_HACK'
				),
				'align' => array(
					'type' => 'string',
					'default' => 'wide'
				),
			),
			'render_callback' => array($this, 'renderBlock'),
		));
	}

	public function setRating()
	{
		if (!check_ajax_referer('recipe-manager-pro')) {
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
			return strip_tags($item);
		}, $ingredientsArray);

		$ingredientsArray = array_map(function ($item) {
			preg_match('/^ *([0-9,.\/]*)? *(gramm|milliliter|g|ml)? *(.*)$/i', $item, $matches);
			return [
				"amount" => $matches[1],
				"unit" => $matches[2],
				"ingredient" => $matches[3],
			];
		}, $ingredientsArray);

		return $ingredientsArray;
	}

	public function renderBlock($attributes, $context)
	{
		// Return the frontend output for our block
		$dir = dirname(__FILE__);
		$template = file_get_contents($dir . '/block.hbs');

		$phpStr = LightnCandy::compile($template, array(
			'flags' => LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_ERROR_EXCEPTION,
			'helpers' => array(
				'formatDuration' => function ($context, $options) {
					if (isset($context) && $context !== '') {
						$minutes = intval($context);

						if ($minutes < 60) {
							return $minutes . ' ' . __('minutes', 'recipe-manager-pro');
						} else {
							$hours = floor($minutes / 60);
							$rest = $minutes % 60;

							return $hours . ' ' . __('hours', 'recipe-manager-pro') . ($rest > 0 ? ', ' . $rest . ' ' . __('minutes', 'recipe-manager-pro') : '');
						}
					}

					return '';
				},
				'toJSON' => function ($context, $options) {
					return json_encode($context);
				},
				'ifMoreOrEqual' => function ($arg1, $arg2, $options) {
					if ($arg1 >= $arg2) {
						return $options['fn']();
					} else {
						return $options['inverse']();
					}
				}
			)
		));

		// Save the compiled PHP code into a php file
		file_put_contents('./render.php', '<?php ' . $phpStr . '?>');

		// Get the render function from the php file
		$renderer = include('render.php');



		$attributes['translations'] = [
			"prepTime" => __('Prep time', 'recipe-manager-pro'),
			"restTime" => __('Rest time', 'recipe-manager-pro'),
			"cookTime" => __('Cook time', 'recipe-manager-pro'),
			"totalTime" => __('Total time', 'recipe-manager-pro'),
			"yield" => __('Servings', 'recipe-manager-pro'),
			"ingredients" => __('Ingredients', 'recipe-manager-pro'),
			"preparationSteps" => __('Steps of preparation', 'recipe-manager-pro'),
			"yourRating" => __('Your rating', 'recipe-manager-pro'),
			"averageRating" => __('Average rating', 'recipe-manager-pro'),
			"notes" => __('Notes', 'recipe-manager-pro'),
			"feedback" => __('How do you like the recipe?', 'recipe-manager-pro'),
			"servings" => __('servings', 'recipe-manager-pro')
		];

		$attributes['postId'] = get_the_ID();
		$attributes['ajaxUrl'] = admin_url('admin-ajax.php');
		$attributes['nonce'] =  wp_create_nonce('recipe-manager-pro');

		$averageRating = get_post_meta(get_the_ID(), 'average_rating', true) ?: 0;
		$ratingCount = get_post_meta(get_the_ID(), 'rating_count', true) ?: 0;

		$attributes['servings'] = isset($attributes['servings']) ? intval($attributes['servings']) : 1;

		$attributes['ingredients'] = array_map(function ($item) use ($attributes) {
			if (isset($item['amount'])) {
				$item['baseAmount'] = intval($item['amount']) / $attributes['servings'];
			}

			if ($item['unit']) {
				if (preg_match("/^(g|ml)$/i", $item['unit'])) {
					$item['baseUnit'] = $item['unit'];
				} else if (preg_match("/^(kilo|kilogramm|kg)$/i", $item['unit'])) {
					$item['baseUnit'] = $item['g'];
					if (isset($item['baseAmount'])) {
						$item['baseAmount'] = $item['baseAmount'] / 1000;
					}
				} else if (preg_match("/^(liter)$/i", $item['unit'])) {
					$item['baseUnit'] = $item['ml'];
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

		$attributes['ldJson'] = [
			"@context" => "https://schema.org/",
			"@type" => "Recipe",
			"name" => isset($attributes['name']) ? $attributes['name'] : '',
			"image" => [
				isset($attributes['image1_1']) ? $attributes['image1_1'] : '',
				isset($attributes['image4_3']) ? $attributes['image4_3'] : '',
				isset($attributes['image16_9']) ? $attributes['image16_9'] : ''
			],
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
			"keywords" => isset($attributes['keywords']) ? $attributes['keywords'] : '',
			"recipeYield" => isset($attributes['recipeYield']) ? $attributes['recipeYield'] : '',
			"recipeCategory" => isset($attributes['recipeCategory']) ? $attributes['recipeCategory'] : '',
			"nutrition" => isset($attributes['calories']) ? [
				"@type" => "NutritionInformation",
				"calories" => $attributes['calories']
			] : '',
			"recipeIngredient" =>
			isset($attributes['ingredients']) ?
				array_map(function ($item) {
					return trim($item['amount'] . ' ' . $item['unit'] . ' ' . $item['ingredient']);
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

		return $renderer($attributes);
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

if (class_exists('RecipeManagerPro')) {
	$recipeManagerPro = new RecipeManagerPro();

	register_activation_hook(__FILE__, array($recipeManagerPro, 'activate'));

	register_deactivation_hook(__FILE__, array($recipeManagerPro, 'deactivate'));
}
