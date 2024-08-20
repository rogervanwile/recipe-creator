<?php

if (!defined("ABSPATH")) {
    die();
}

class RecipeCreator
{
    private $primaryColorDefault = "#e27a7a";
    private $primaryColorContrastDefault = "#ffffff";
    private $primaryColorLightDefault = "#f7e9e9";
    private $primaryColorLightContrastDefault = "#000000";
    private $primaryColorDarkDefault = "#d55a5a";
    private $secondaryColorDefault = "#efefef";
    private $secondaryColorContrastDefault = "#000000";
    private $backgroundColorDefault = "#fefcfc";
    private $backgroundColorContrastDefault = "#000000";
    private $showBoxShadowDefault = "1";
    private $showBorderDefault = "1";
    private $borderRadiusDefault = 8;
    private $thumnailSizeDefault = 330;

    function __construct()
    {
        add_action("init", [$this, "registerBlocks"]);
        add_action("init", [$this, "registerMeta"]);
        add_action("init", [$this, "loadTranslations"]);

        add_action("admin_init", [$this, "registerRecipeBlockSettings"]);
        add_action("admin_init", [$this, "checkMigrations"]);
        add_action("admin_menu", [$this, "registerSettingsPage"], 10);

        add_action("admin_enqueue_scripts", [$this, "enqueueAdminJs"]);

        add_image_size(
            "recipe-creator--thumbnail",
            get_option("recipe_creator__thumbnail_size", $this->thumnailSizeDefault)
        );
        add_image_size("recipe-creator--pinterest", 1000, 0, false);
        add_image_size("recipe-creator--schema", 600, 600, false);

        // Frontend-AJAX-Actions
        add_action("wp_ajax_recipe_creator_set_rating", [$this, "setRating"]);
        add_action("wp_ajax_nopriv_recipe_creator_set_rating", [$this, "setRating"]);

        add_filter("the_content", [$this, "handleContent"], 1);

        add_action('manage_posts_columns', [$this, "registerPostColumns"]);
        add_action('manage_posts_custom_column', [$this, "renderPostColumn"], 10, 2);
        add_filter('manage_edit-post_sortable_columns', [$this, "registerSortableColumns"]);
        add_action('pre_get_posts', [$this, 'handlePostSorting']);
    }

    public function checkMigrations()
    {
        require __DIR__ . "/migration-handler.php";

        $migrationHandler = new MigrationHandler();
        if ($migrationHandler->migrationNeeded()) {
            $success = $migrationHandler->runMigrations();

            if ($success === true) {
                add_action("admin_notices", function () {
                    $this->showAdminHint(
                        __("The Recipe Creator plugin has been successfully updated.", "recipe-creator"),
                        "success"
                    );
                });
            }
        }
    }

    public function showAdminHint($text, $type = "error")
    {
?>
        <div class="notice notice-<?php echo esc_attr($type); ?>">
            <p>
                <?php echo wp_kses($text, ["strong" => [], "a" => ["href" => []]]); ?>
            </p>
        </div>
<?php
    }


    public function registerPostColumns(array $columns): array
    {
        $columns['recipe-creator__average_rating'] = __('Average rating', 'recipe-creator');
        $columns['recipe-creator__rating_count'] = __('Ratings', 'recipe-creator');
        return $columns;
    }

    public function renderPostColumn(string $column_id, int $post_id)
    {
        $post_type = get_post_type();
        if ($post_type != 'post') {
            return;
        }

        if ($column_id !== 'recipe-creator__average_rating' &&  $column_id !== 'recipe-creator__rating_count') {
            return;
        }

        switch ($column_id) {
            case 'recipe-creator__average_rating':
                $averageRating = get_post_meta($post_id, 'recipe_creator__average_rating', true);
                if (isset($averageRating) && $averageRating !== '') {
                    echo '<span class="recipe-creator--rating">' . esc_html($averageRating) . '&nbsp;<span class="dashicons dashicons-star-filled"></span></span>';
                } else {
                    echo '-';
                }
                break;
            case 'recipe-creator__rating_count':
                $ratingCount = get_post_meta($post_id, 'recipe_creator__rating_count', true);
                if (isset($ratingCount) && $ratingCount !== '') {
                    echo esc_html(get_post_meta($post_id, 'recipe_creator__rating_count', true));
                } else {
                    echo '-';
                }
                break;
        }
    }

    public function registerSortableColumns($columns)
    {
        $columns['recipe-creator__average_rating'] = 'recipe_creator__average_rating';
        $columns['recipe-creator__rating_count']  = 'recipe_creator__rating_count';
        return $columns;
    }

    public function handlePostSorting($query)
    {
        if (!is_admin() || !$query->is_main_query()) {
            return;
        }

        if ($query->get('post_type') !== 'post') {
            return;
        }

        $orderby = $query->get('orderby');

        if ($orderby === 'recipe_creator__average_rating') {
            $query->set('meta_key', 'recipe_creator__average_rating');
            $query->set('orderby', 'meta_value_num');
        } else if ($orderby === 'recipe_creator__rating_count') {
            $query->set('meta_key', 'recipe_creator__rating_count');
            $query->set('orderby', 'meta_value_num');
        }
    }

    public function handleContent($content)
    {
        // Check if we're inside the main loop in a single Post.
        if (is_singular() && in_the_loop() && is_main_query()) {
            if (has_blocks()) {
                // Does the contentThe $content contains the recipe block
                if (has_block("recipe-creator/recipe")) {
                    // If there is no "jump to recipe" block inside the content
                    // and the option "recipe_creator__show_jump_to_recipe"
                    // is set to true, I prepend the "jump to recipe" block to the content
                    if (
                        get_option("recipe_creator__show_jump_to_recipe", true) &&
                        !has_block("recipe-creator/jump-to-recipe")
                    ) {
                        $content = "<!-- wp:recipe-creator/jump-to-recipe /-->\n\n" . $content;
                    }

                    $this->addRecipeBlockConfig();
                }
            }
        }

        return $content;
    }

    private function addRecipeBlockConfig()
    {
        $wp_styles = wp_styles();
        $recipeBlockStyle = $wp_styles->registered["recipe-creator-recipe-style"];

        wp_localize_script("recipe-creator-recipe-view-script", "recipeCreatorConfig", [
            "recipeBlockStyleUrl" => $recipeBlockStyle->src,
            "ajaxUrl" => admin_url("admin-ajax.php"),
            "nonce" => wp_create_nonce("recipe-creator"),
        ]);
    }

    public function enqueueAdminJs($hook_suffix)
    {
        if ($hook_suffix === 'toplevel_page_recipe_creator') {
            // Enable Color Picker for Settings Page
            wp_enqueue_style("wp-color-picker");
            wp_enqueue_style("iris");

            wp_enqueue_style("recipe-creator-recipe-style");

            $adminAsset = require plugin_dir_path(__FILE__) . "../build/admin.asset.php";

            wp_enqueue_script(
                "recipe-creator-settings-js",
                plugins_url("build/admin.js", dirname(__FILE__)),
                ["wp-color-picker", ...$adminAsset["dependencies"]],
                $adminAsset["version"],
                true
            );

            wp_enqueue_style(
                "recipe-creator-settings-css",
                plugins_url("build/admin.css", dirname(__FILE__)),
                $adminAsset["dependencies"],
                $adminAsset["version"],
                "all"
            );
        }
    }

    public function registerSettingsPage()
    {
        add_menu_page(
            __("Recipe Creator", "recipe-creator"),
            __("Recipe Creator", "recipe-creator"),
            "manage_options",
            "recipe_creator",
            function () {
                return require_once plugin_dir_path(__FILE__) . "../pages/admin-index-page.php";
            },
            "dashicons-carrot",
            100
        );

        add_submenu_page(
            "recipe_creator",
            __("Recipe Block", "recipe-creator"),
            __("Recipe Block", "recipe-creator"),
            "manage_options",
            "recipe_creator",
            function () {
                return require_once plugin_dir_path(__FILE__) . "../pages/admin-index-page.php";
            },
            10
        );

        do_action("recipe_creator__pages_registered");
    }

    private function renderColorPickerInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="text" class="recipe-creator--color-picker" name="' .
            esc_attr($name) .
            '" value="' .
            esc_attr($value) .
            '" data-default-value="' .
            esc_attr($defaultValue) .
            '" />';
    }

    private function renderNumberInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="number" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" />';
    }

    private function renderTextInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="text" name="' . esc_attr($name) . '" value="' .  esc_attr($value) . '" />';
    }

    private function renderCheckboxInput($name, $defaultValue, $text)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<label><input type="checkbox" name="' .
            esc_attr($name) .
            '" value="1" ' .
            esc_attr(isset($value) && $value === "1" ? 'checked="checked"' : "") .
            " /> " .
            esc_html($text) .
            "</label>";
    }

    public function registerRecipeBlockSettings()
    {
        // Settings
        register_setting("recipe_creator__general", "recipe_creator__primary_color", [
            "default" => $this->primaryColorDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__primary_color_contrast", [
            "default" => $this->primaryColorContrastDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__primary_color_light", [
            "default" => $this->primaryColorLightDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__primary_color_light_contrast", [
            "default" => $this->primaryColorLightContrastDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__primary_color_dark", [
            "default" => $this->primaryColorDarkDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__secondary_color", [
            "default" => $this->secondaryColorDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__secondary_color_contrast", [
            "default" => $this->secondaryColorContrastDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__background_color", [
            "default" => $this->backgroundColorDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__background_color_contrast", [
            "default" => $this->backgroundColorContrastDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__show_box_shadow", [
            "default" => $this->showBoxShadowDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__show_border", [
            "default" => $this->showBorderDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__border_radius", [
            "default" => $this->borderRadiusDefault,
        ]);
        register_setting("recipe_creator__general", "recipe_creator__thumbnail_size", [
            "default" => $this->thumnailSizeDefault,
        ]);

        register_setting("recipe_creator__general", "recipe_creator__show_jump_to_recipe", [
            "default" => true,
        ]);

        register_setting("recipe_creator__general", "recipe_creator__instagram__username", [
            "default" => "",
        ]);

        register_setting("recipe_creator__general", "recipe_creator__instagram__hashtag", [
            "default" => "",
        ]);

        // Sections
        add_settings_section(
            "recipe_creator__general",
            __("General settings", "recipe-creator"),
            function () {
                echo "<p>" .
                    esc_html__("Configure how the recipe block should behave on your blog posts.", "recipe-creator") .
                    "</p>";
            },
            "recipe_creator__general"
        );
        add_settings_section(
            "recipe_creator__instagram",
            __("Instagram", "recipe-creator"),
            function () {
                echo "<p>" .
                    esc_html__(
                        "Provide informations about your instagram profile and we show a call to action below your recipe.",
                        "recipe-creator"
                    ) .
                    "</p>";
            },
            "recipe_creator__general"
        );
        add_settings_section(
            "recipe_creator__visual",
            __("Visual settings", "recipe-creator"),
            function () {
                echo "<p>" .
                    esc_html__("Configure how the recipe block should look for your visitors.", "recipe-creator") .
                    "</p>";
            },
            "recipe_creator__general"
        );

        // Fields
        add_settings_field(
            "recipe_creator__show_jump_to_recipe",
            __("Jump to recipe", "recipe-creator"),
            function () {
                $this->renderCheckboxInput(
                    "recipe_creator__show_jump_to_recipe",
                    true,
                    __('Add a "Jump to recipe" button on every page with the recipe block.', "recipe-creator")
                );
            },
            "recipe_creator__general",
            "recipe_creator__general",
            [
                "label_for" => "recipe_creator__show_jump_to_recipe",
            ]
        );

        add_settings_field(
            "recipe_creator__instagram__username",
            __("Your username", "recipe-creator"),
            function () {
                $this->renderTextInput("recipe_creator__instagram__username", "");
            },
            "recipe_creator__general",
            "recipe_creator__instagram",
            [
                "label_for" => "recipe_creator__instagram__username",
            ]
        );

        add_settings_field(
            "recipe_creator__instagram__hashtag",
            __("Hashtag", "recipe-creator"),
            function () {
                $this->renderTextInput("recipe_creator__instagram__hashtag", "");
            },
            "recipe_creator__general",
            "recipe_creator__instagram",
            [
                "label_for" => "recipe_creator__instagram__hashtag",
            ]
        );

        add_settings_field(
            "recipe_creator__primary_color",
            __("Primary color", "recipe-creator"),
            function () {
                $this->renderColorPickerInput("recipe_creator__primary_color", $this->primaryColorDefault);
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__primary_color",
            ]
        );
        add_settings_field(
            "recipe_creator__secondary_color",
            __("Secondary color", "recipe-creator"),
            function () {
                $this->renderColorPickerInput("recipe_creator__secondary_color", $this->secondaryColorDefault);
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__secondary_color",
            ]
        );
        add_settings_field(
            "recipe_creator__background_color",
            __("Background color", "recipe-creator"),
            function () {
                $this->renderColorPickerInput("recipe_creator__background_color", $this->backgroundColorDefault);
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__background_color",
            ]
        );

        add_settings_field(
            "recipe_creator__show_border",
            __("Border", "recipe-creator"),
            function () {
                $this->renderCheckboxInput(
                    "recipe_creator__show_border",
                    $this->showBorderDefault,
                    __("Show border", "recipe-creator")
                );
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__show_border",
            ]
        );
        add_settings_field(
            "recipe_creator__show_box_shadow",
            __("Box shadow", "recipe-creator"),
            function () {
                $this->renderCheckboxInput(
                    "recipe_creator__show_box_shadow",
                    $this->showBoxShadowDefault,
                    __("Show box shadow", "recipe-creator")
                );
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__show_box_shadow",
            ]
        );
        add_settings_field(
            "recipe_creator__border_radius",
            __("Border radius", "recipe-creator"),
            function () {
                $this->renderNumberInput("recipe_creator__border_radius", $this->borderRadiusDefault);
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__border_radius",
            ]
        );
        add_settings_field(
            "recipe_creator__thumbnail_size",
            __("Image width", "recipe-creator"),
            function () {
                $this->renderNumberInput("recipe_creator__thumbnail_size", $this->thumnailSizeDefault);
            },
            "recipe_creator__general",
            "recipe_creator__visual",
            [
                "label_for" => "recipe_creator__thumbnail_size",
            ]
        );
    }

    public function loadTranslations()
    {
        load_plugin_textdomain("recipe-creator", false, dirname(plugin_basename(__FILE__), 2) . "/languages");
    }

    public function registerMeta()
    {
        register_meta("post", "recipe_creator__rating_1_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_creator__rating_2_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_creator__rating_3_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_creator__rating_4_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_creator__rating_5_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_creator__rating_count", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_creator__average_rating", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
    }

    public function activate() {}

    public function deactivate() {}

    public static function uninstall() {}

    public function registerBlocks()
    {
        // Jump to recipe
        register_block_type(realpath(__DIR__ . "/../build/blocks/jump-to-recipe"), [
            "render_callback" => [$this, "renderJumpToRecipeBlock"],
        ]);

        // Recipe block
        register_block_type(realpath(__DIR__ . "/../build/blocks/recipe"), [
            "render_callback" => [$this, "renderRecipeBlock"],
        ]);

        wp_set_script_translations(
            "recipe-creator-recipe-editor-script",
            "recipe-creator",
            dirname(plugin_dir_path(__FILE__), 1) . "/languages/"
        );
        wp_set_script_translations(
            "recipe-creator-jump-to-recipe-editor-script",
            "recipe-creator",
            dirname(plugin_dir_path(__FILE__), 1) . "/languages/"
        );
    }

    public function setRating()
    {
        if (!check_ajax_referer("recipe-creator")) {
            wp_send_json_error();
            wp_die();
        } else {
            $postId = intval(sanitize_text_field($_POST["postId"]));
            $rating = intval(sanitize_text_field($_POST["rating"]));

            $this->saveRating($postId, $rating);
            $this->updateRating($postId);

            $averageRating  = $this->getAverageRating($postId);

            wp_send_json_success([
                "averageRating" => $averageRating,
            ]);
            wp_die();
        }
    }

    private function saveRating($postId, $rating)
    {
        switch ($rating) {
            case 1:
                $amountOfRating1Votes = intval(get_post_meta($postId, "recipe_creator__rating_1_votes", true)) ?: 0;
                $amountOfRating1Votes++;
                update_post_meta($postId, "recipe_creator__rating_1_votes", $amountOfRating1Votes);
                break;
            case 2:
                $amountOfRating2Votes = intval(get_post_meta($postId, "recipe_creator__rating_2_votes", true)) ?: 0;
                $amountOfRating2Votes++;
                update_post_meta($postId, "recipe_creator__rating_2_votes", $amountOfRating2Votes);
                break;
            case 3:
                $amountOfRating3Votes = intval(get_post_meta($postId, "recipe_creator__rating_3_votes", true)) ?: 0;
                $amountOfRating3Votes++;
                update_post_meta($postId, "recipe_creator__rating_3_votes", $amountOfRating3Votes);
                break;
            case 4:
                $amountOfRating4Votes = intval(get_post_meta($postId, "recipe_creator__rating_4_votes", true)) ?: 0;
                $amountOfRating4Votes++;
                update_post_meta($postId, "recipe_creator__rating_4_votes", $amountOfRating4Votes);
                break;
            case 5:
                $amountOfRating5Votes = intval(get_post_meta($postId, "recipe_creator__rating_5_votes", true)) ?: 0;
                $amountOfRating5Votes++;
                update_post_meta($postId, "recipe_creator__rating_5_votes", $amountOfRating5Votes);
                break;
        }
    }

    private function updateRating($postId)
    {
        $amountOfRating1Votes = intval(get_post_meta($postId, "recipe_creator__rating_1_votes", true)) ?: 0;
        $amountOfRating2Votes = intval(get_post_meta($postId, "recipe_creator__rating_2_votes", true)) ?: 0;
        $amountOfRating3Votes = intval(get_post_meta($postId, "recipe_creator__rating_3_votes", true)) ?: 0;
        $amountOfRating4Votes = intval(get_post_meta($postId, "recipe_creator__rating_4_votes", true)) ?: 0;
        $amountOfRating5Votes = intval(get_post_meta($postId, "recipe_creator__rating_5_votes", true)) ?: 0;

        $totalAmount =
            $amountOfRating1Votes +
            $amountOfRating2Votes +
            $amountOfRating3Votes +
            $amountOfRating4Votes +
            $amountOfRating5Votes;
        $totalRating =
            $amountOfRating1Votes * 1 +
            $amountOfRating2Votes * 2 +
            $amountOfRating3Votes * 3 +
            $amountOfRating4Votes * 4 +
            $amountOfRating5Votes * 5;

        $averageRating = round($totalRating / $totalAmount, 1);

        update_post_meta($postId, "recipe_creator__rating_count", $totalAmount);
        update_post_meta($postId, "recipe_creator__average_rating", $averageRating);
    }

    function getAverageRating($postId)
    {
        return get_post_meta($postId, "recipe_creator__average_rating", true);
    }

    private function extractIngredients($ingredients)
    {
        $ingredientsArray = array_map(function ($item) {
            preg_match('/^ *([0-9,.\/-]*)? *(gramm|milliliter|kg|g|ml|tl|el|l)? (.*)$/i', $item, $matches);
            if (count($matches) >= 3) {
                return [
                    "amount" => $this->getAmount($matches[1]),
                    "unit" => $matches[2],
                    "ingredient" => $matches[3],
                    "format" => $this->getFormat($matches[1])
                ];
            } else {
                return [
                    "ingredient" => $item,
                ];
            }
        }, $ingredients);

        return $ingredientsArray;
    }

    private function getFormat($rawAmount)
    {
        if (str_contains($rawAmount, '/')) {
            return 'fraction';
        }

        return 'decimal';
    }

    private function getAmount($rawAmount)
    {
        return str_replace(',', '.', $rawAmount);
    }

    private function getRecipeBlockStyles()
    {
        ob_start();
        include(__DIR__ . '/../partials/recipe-block-styles.php');
        return ob_get_clean();
    }

    public function renderRecipeBlockStyles()
    {
        $html = $this->getRecipeBlockStyles();
        echo wp_kses($html, ["style" => []]);
    }

    public function getRecipeBlockSchema($attributes)
    {
        ob_start();
        include(__DIR__ . '/../partials/recipe-block-schema.php');
        return ob_get_clean();
    }

    public function renderRecipeBlockSchema($attributes)
    {
        $html = $this->getRecipeBlockSchema($attributes);
        echo wp_kses($html, ["script" => ["type" => "application/ld+json"]]);
    }

    public function getDummyData()
    {
        return [
            "recipeYield" => 2,
            "recipeYieldUnit" => "servings",
            "difficulty" => __("simple", "recipe-creator"),
            "prepTime" => 5,
            "cookTime" => 5,
            "name" => __("Banana shake", "recipe-creator"),
            "description" => __(
                "You have bananas left over again and don't know what to do with them? How about a delicious shake?",
                "recipe-creator"
            ),
            "totalTime" => 5,
            "ingredientsGroups" => [
                [
                    "title" => "",
                    "list" => [
                        "500ml " . __("milk", "recipe-creator"),
                        "1 " .  __("banana", "recipe-creator"),
                        "1 TL " . __("sugar", "recipe-creator"),
                        __("cinnamon", "recipe-creator"),
                    ],
                ],
            ],
            "utensils" => [__("Knife", "recipe-creator"), __("Blender", "recipe-creator")],
            "preparationStepsGroups" => [
                [
                    "title" => "",
                    "list" =>
                    [
                        __("Peel banana.", "recipe-creator"),
                        __(
                            "Put all the ingredients in the blender and mix everything for 30 seconds.",
                            "recipe-creator"
                        ),
                        __("Pour into a glass and enjoy.", "recipe-creator"),
                    ],
                ],
            ],
            "averageRating" => 4.5,
            "thumbnail" => plugins_url("../assets/banana-shake-4_3.png", __FILE__),
            "notes" => __("The milkshake becomes particularly creamy with UHT milk.", "recipe-creator"),
            "instagramUsername" => get_option("recipe_creator__instagram__username", ""),
            "instagramHashtag" => get_option("recipe_creator__instagram__hashtag", ""),
        ];
    }

    public function renderRecipeBlockDummy()
    {
        $rawAttributes = $this->getDummyData();
        $attributes = $this->prepareRecipeBlockAttributes($rawAttributes);
        $attributes['averageRating'] = 4.5;
        echo wp_kses_post($this->getRecipeBlock($attributes));
    }

    public function renderRecipeBlock($rawAttributes)
    {
        wp_enqueue_script("recipe-creator--recipe-view-script");

        $attributes = $this->prepareRecipeBlockAttributes($rawAttributes);

        $attributes["averageRating"] = get_post_meta(get_the_ID(), "recipe_creator__average_rating", true) ?: 0;
        $attributes["ratingCount"] = get_post_meta(get_the_ID(), "recipe_creator__rating_count", true) ?: 0;

        $attributes["keywords"] = get_the_tags();
        $attributes["categories"] = get_the_category();

        // Recursive remove empty strings in array
        $attributes  = $this->filterEmptyStrings($attributes);

        $attributes["ldJson"] = $this->getSchemaFromRecipeAttributes($attributes);

        $attributes = apply_filters('recipe_creator__recipe_block__before_rendering', $attributes);

        // Remove empty values from $attributes
        $attributes["ldJson"] = array_filter($attributes["ldJson"], function ($value) {
            return !empty($value);
        });

        $recipeBlock = $this->getRecipeBlock($attributes);
        $schema =  $this->getRecipeBlockSchema($attributes);
        $styles = $this->getRecipeBlockStyles();

        return $recipeBlock . $schema . $styles;
    }

    private function filterEmptyStrings($haystack)
    {
        foreach ($haystack as $key => $value) {
            if (is_array($value)) {
                $haystack[$key] = $this->filterEmptyStrings($haystack[$key]);
            }

            if (is_string($haystack[$key]) && trim($haystack[$key]) === '') {
                unset($haystack[$key]);
            }
        }

        return $haystack;
    }

    private function prepareRecipeBlockAttributes($attributes)
    {

        $recipeYield = isset($attributes["recipeYield"]) ? intval($attributes["recipeYield"]) : 1;
        $recipeYieldWidth = isset($attributes["recipeYieldWidth"]) ? intval($attributes["recipeYieldWidth"]) : 0;
        $recipeYieldHeight = isset($attributes["recipeYieldHeight"]) ? intval($attributes["recipeYieldHeight"]) : 0;

        $attributes["prepTime"] = isset($attributes["prepTime"]) ? floatval($attributes["prepTime"]) : 0;
        $attributes["restTime"] = isset($attributes["restTime"]) ? floatval($attributes["restTime"]) : 0;
        $attributes["cookTime"] = isset($attributes["cookTime"]) ? floatval($attributes["cookTime"]) : 0;
        $attributes["bakingTime"] = isset($attributes["bakingTime"]) ? floatval($attributes["bakingTime"]) : 0;
        $attributes["totalTime"] = isset($attributes["totalTime"]) ? floatval($attributes["totalTime"]) : 0;

        if (!empty($attributes["difficulty"])) {
            switch ($attributes["difficulty"]) {
                case 'simple';
                    $attributes["difficulty"] = __('simple', "recipe-creator");
                    break;
                case 'moderate';
                    $attributes["difficulty"] = __('moderate', "recipe-creator");
                    break;
                case 'challenging';
                    $attributes["difficulty"] = __('challenging', "recipe-creator");
                    break;
            }
        }

        $attributes["recipeYieldUnitFormatted"] = $this->getRecipeYieldUnitFormatted(
            $attributes["recipeYieldUnit"],
            $recipeYield ?: 1
        );
        $attributes["recipeYieldFormatted"] = $this->getRecipeYieldFormatted(
            $attributes["recipeYieldUnit"],
            $recipeYield,
            $recipeYieldWidth,
            $recipeYieldHeight
        );

        switch ($attributes["recipeYieldUnit"]) {
            case "piece":
                $attributes["recipeYield"] = $recipeYield;
                break;
            case "springform-pan":
                $attributes["recipeYield"] = $recipeYield;
                break;
            case "square-baking-pan":
                $attributes["recipeYield"] = null;
                $attributes["recipeYieldWidth"] = $recipeYieldWidth;
                $attributes["recipeYieldHeight"] = $recipeYieldHeight;
                break;
            case "baking-tray":
                $attributes["recipeYield"] = $recipeYield;
                break;
            case "servings":
            default:
                $attributes["recipeYield"] = $recipeYield;
                break;
        }

        $attributes["ingredientsGroups"] = $this->prepareIngredientsForRenderer($attributes["ingredientsGroups"]);
        $thumbnailImageCandidates = ["image3_2", "image4_3", "image16_9", "image1_1"];

        foreach ($thumbnailImageCandidates as $imageCandidate) {
            if (isset($attributes[$imageCandidate . "Id"])) {
                $image = wp_get_attachment_image_src($attributes[$imageCandidate . "Id"], "recipe-creator--thumbnail");

                if ($image) {
                    $attributes["thumbnail"] = $image[0];
                    break;
                }
            }

            if (!isset($attributes["thumbnail"]) && isset($attributes[$imageCandidate])) {
                $attributes["thumbnail"] = $attributes[$imageCandidate];
            }
        }

        if ((!isset($attributes["thumbnail"]) || $attributes["thumbnail"] === "") && has_post_thumbnail(get_the_ID())) {
            $postThumbnail = get_the_post_thumbnail_url(get_the_ID(), "recipe-creator--thumbnail");
            $attributes["thumbnail"] = $postThumbnail;
        }

        $description = !empty($attributes["description"]) ? $attributes["description"] : "";

        // Process the pinterest image
        if (!empty($attributes["pinterestImageId"])) {
            $pinterestImageId = (int)$attributes['pinterestImageId'];
            if ($pinterestImageId !== null) {
                $pinterestImageUrl = wp_get_attachment_image_src($pinterestImageId, "recipe-creator--pinterest");
                if ($pinterestImageUrl) {
                    $attributes["pinterestPinItUrl"] = esc_url(
                        "https://www.pinterest.com/pin/create/button/" .
                            "?url=" .
                            urlencode(get_permalink()) .
                            "&media=" .
                            urlencode($pinterestImageUrl[0]) .
                            "&description=" .
                            urlencode($description)
                    );
                }
            }
        }

        // Instagram-CTA
        $attributes["instagramUsername"] = get_option("recipe_creator__instagram__username", "");
        $attributes["instagramHashtag"] = get_option("recipe_creator__instagram__hashtag", "");

        return $attributes;
    }

    private function getSchemaFromRecipeAttributes($attributes)
    {
        $images = [];

        $imagesOrder = ["image16_9", "image3_2", "image4_3", "image1_1", "thumbnail"];

        foreach ($imagesOrder as $imageOrder) {
            if (!empty($attributes[$imageOrder])) {
                if (!empty($attributes[$imageOrder . "Id"])) {
                    $attachment = wp_get_attachment_image_src($attributes[$imageOrder . "Id"], "recipe-creator--schema");
                    if ($attachment) {
                        $images[] = $attachment[0];
                    }
                } else {
                    $images[] = $attributes[$imageOrder];
                }
            }
        }

        $keywordsString = '';
        if (!empty($attributes["keywords"]) && count($attributes["keywords"]) > 0) {
            $keywordsString = implode(
                ", ",
                array_map(function ($tag) {
                    return $tag->name;
                }, $attributes["keywords"])
            );
        }

        $category = "";
        if (!empty($attributes["categories"]) && count($attributes["categories"]) > 0) {
            $category = array_map(function ($category) {
                return $category->name;
            }, $attributes["categories"])[0];
        }

        $schema = [
            "@context" => "https://schema.org/",
            "@type" => "Recipe",
            "name" => isset($attributes["name"]) ? $attributes["name"] : "",
            "image" => $images,
            "author" => [
                "@type" => "Person",
                "name" => get_the_author_meta("display_name"),
            ],
            "datePublished" => get_the_date("Y-m-d"), // "2018-03-10",
            "description" => !empty($attributes["description"]) ? $attributes["description"] : "",
            "recipeCuisine" => isset($attributes["recipeCuisine"]) ? $attributes["recipeCuisine"] : "",
            "prepTime" => isset($attributes["prepTime"])
                ? $this->toIso8601Duration(intval($attributes["prepTime"]) * 60)
                : "",
            "cookTime" => $this->getCooktimeForSchema($attributes),
            "totalTime" => isset($attributes["totalTime"])
                ? $this->toIso8601Duration(intval($attributes["totalTime"]) * 60)
                : "",
            "keywords" => $keywordsString,
            "recipeYield" => $this->getRecipeYieldForSchema($attributes),
            "recipeCategory" => $category,
            "recipeIngredient" => $this->prepareIngredientsForJsonLd($attributes["ingredientsGroups"]),
            "recipeInstructions" => $this->preparePreparationStepsForJsonLd($attributes["preparationStepsGroups"]),
        ];

        if (!empty($attributes["averageRating"]) && !empty($attributes["ratingCount"]) && $attributes["averageRating"] > 0 && $attributes["ratingCount"] > 0) {
            $schema["aggregateRating"] = [
                "@type" => "AggregateRating",
                "ratingValue" => "" . $attributes["averageRating"],
                "ratingCount" => "" . $attributes["ratingCount"],
            ];
        }

        if (!empty($attributes["videoIframeUrl"])) {
            $schema["video"] = [
                "@type" => "VideoObject",
                "description" => $attributes["description"],
                "name" => isset($attributes["name"]) ? $attributes["name"] : "",
                "thumbnailUrl" => $attributes["thumbnail"],
                "uploadDate" => get_the_date("Y-m-d"),
                "embedUrl" => $attributes["videoIframeUrl"],
            ];
        }

        return $schema;
    }

    private function getRecipeYieldForSchema($attributes)
    {
        if (isset($attributes["recipeYieldFormatted"])) {
            if (isset($attributes["recipeYieldUnitFormatted"])) {
                return $attributes["recipeYieldFormatted"] . " " . $attributes["recipeYieldUnitFormatted"];
            }
            return $attributes["recipeYieldFormatted"];
        }

        return "";
    }

    private function getRecipeBlock($attributes)
    {
        ob_start();
        include(__DIR__ . '/../partials/recipe-block.php');
        return ob_get_clean();
    }

    private function getRecipeYieldUnitFormatted($unit, $amount)
    {
        switch ($unit) {
            case "piece":
                if ($amount === 1) {
                    return __("piece", "recipe-creator");
                } else {
                    return __("pieces", "recipe-creator");
                }
            case "springform-pan":
                return __("springform pan", "recipe-creator");
            case "springform-pan":
                return __("springform pan", "recipe-creator");
            case "square-baking-pan":
                return __("square baking pan", "recipe-creator");
            case "baking-tray":
                if ($amount === 1) {
                    return __("baking tray", "recipe-creator");
                } else {
                    return __("baking trays", "recipe-creator");
                }
            case "servings":
            default:
                if ($amount === 1) {
                    return __("serving", "recipe-creator");
                } else {
                    return __("servings", "recipe-creator");
                }
        }
    }

    private function getRecipeYieldFormatted($unit, $recipeYield, $recipeYieldWidth, $recipeYieldHeight)
    {
        switch ($unit) {
            case "piece":
                return $recipeYield;
                break;
            case "springform-pan":
                return $recipeYield . " cm";
                break;
            case "square-baking-pan":
                return $recipeYieldWidth . " x " . $recipeYieldHeight . " cm";
                break;
            case "baking-tray":
                return $recipeYield;
                break;
            case "servings":
            default:
                return $recipeYield;
                break;
        }
    }

    private function prepareIngredientsForRenderer($ingredientsGroups)
    {
        return array_map(function ($group) {
            $group["items"] = $this->extractIngredients($group["list"]);
            return $group;
        }, $ingredientsGroups);
    }

    private function prepareIngredientsForJsonLd($ingredientsGroups)
    {
        // In JSON LD the ingredients must be a flat array
        $flatIngredients = [];

        foreach ($ingredientsGroups as $group) {
            if (isset($group["items"]) && count($group["items"]) > 0) {
                foreach ($group["items"] as $item) {
                    $flatIngredients[] = trim(
                        (isset($item["amount"]) ? $item["amount"] : "") .
                            " " .
                            (isset($item["unit"]) ? $item["unit"] : "") .
                            " " .
                            (isset($item["ingredient"]) ? wp_strip_all_tags($item["ingredient"]) : "")
                    );
                }
            }
        }

        return $flatIngredients;
    }

    private function preparePreparationStepsForJsonLd($preparationStepsGroup)
    {
        if (!isset($preparationStepsGroup)) {
            return "";
        }

        // In JSON LD the preparation steps groups must be a flat array
        $flat = [];

        foreach ($preparationStepsGroup as $group) {
            if (isset($group["list"])) {
                $itemsList = array_map(function ($item) {
                    return [
                        "@type" => "HowToStep",
                        "text" => wp_strip_all_tags($item),
                    ];
                }, $group["list"]);

                foreach ($itemsList as $howToStep) {
                    $flat[] = $howToStep;
                }
            }
        }

        return $flat;
    }

    public function renderJumpToRecipeBlock()
    {
        ob_start();
        include(__DIR__ . '/../partials/jump-to-recipe-block.php');
        return ob_get_clean();
    }

    private function toIso8601Duration($seconds)
    {
        $days = floor($seconds / 86400);
        $seconds = $seconds % 86400;

        $hours = floor($seconds / 3600);
        $seconds = $seconds % 3600;

        $minutes = floor($seconds / 60);
        $seconds = $seconds % 60;

        return sprintf("P%dDT%dH%dM%dS", $days, $hours, $minutes, $seconds);
    }

    // Schema.org has only cookTime, so I calculate cook time and baking time together
    private function getCooktimeForSchema($attributes)
    {
        $cookTime = isset($attributes["cookTime"]) ? intval($attributes["cookTime"]) : 0;
        $bakingTime = isset($attributes["bakingTime"]) ? intval($attributes["bakingTime"]) : 0;

        return $this->toIso8601Duration(($cookTime + $bakingTime) * 60);
    }

    public function formatDuration($duration)
    {
        if (isset($duration) && $duration !== '') {
            $minutes = intval($duration);

            if ($minutes < 60) {
                return $minutes . ' ' . __('minutes', 'recipe-creator');
            } else {
                $hours = floor($minutes / 60);
                $rest = $minutes % 60;

                return $hours . ' ' . __('hours', 'recipe-creator') . ($rest > 0 ? ' ' . $rest . ' ' . __('minutes', 'recipe-creator') : '');
            }
        }

        return '';
    }
}
