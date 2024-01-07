<?php

if (!defined("ABSPATH")) {
    die();
}

require __DIR__ . "/../vendor/autoload.php";

use LightnCandy\LightnCandy;

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
        add_action("admin_menu", [$this, "registerSettingsPage"]);

        add_action("admin_enqueue_scripts", [$this, "enqueueAdminJs"]);

        add_image_size(
            "recipe-creator--thumbnail",
            get_option("recipe_plugin_for_wp__thumbnail_size", $this->thumnailSizeDefault)
        );
        add_image_size("recipe-creator--pinterest", 1000, 0, false);

        // Frontend-AJAX-Actions
        add_action("wp_ajax_recipe_plugin_for_wp_set_rating", [$this, "setRating"]);
        add_action("wp_ajax_nopriv_recipe_plugin_for_wp_set_rating", [$this, "setRating"]);

        // Enable Auto-Update
        // https://rudrastyh.com/wordpress/self-hosted-plugin-update.html
        add_filter("plugins_api", [$this, "fetchInfo"], 20, 3);
        add_filter("site_transient_update_plugins", [$this, "pushUpdate"]);
        add_action("upgrader_process_complete", [$this, "afterUpdate"], 10, 2);

        add_filter("the_content", [$this, "handleContent"], 1);

        add_action("admin_notices", [$this, "showReleaseInfo"]);

        add_action('manage_posts_columns', [$this, "registerPostColumns"]);
        add_action('manage_posts_custom_column', [$this, "renderPostColumn"], 10, 2);
        add_filter('manage_edit-post_sortable_columns', [$this, "registerSortableColumns"]);
    }

    public function registerPostColumns(array $columns): array
    {
        $columns['recipe-creator_average_rating'] = __('Average rating', 'recipe-creator');
        $columns['recipe-creator_rating_count'] = __('Ratings', 'recipe-creator');
        return $columns;
    }

    public function renderPostColumn(string $column_id, int $post_id)
    {
        $post_type = get_post_type();
        if ($post_type != 'post') {
            return;
        }

        if ($column_id !== 'recipe-creator_average_rating' &&  $column_id !== 'recipe-creator_rating_count') {
            return;
        }

        switch ($column_id) {
            case 'recipe-creator_average_rating':
                $averageRating = get_post_meta($post_id, 'average_rating', true);
                if (isset($averageRating) && $averageRating !== '') {
                    echo '<span class="recipe-creator--rating">' . esc_html($averageRating) . '&nbsp;<span class="dashicons dashicons-star-filled"></span></span>';
                } else {
                    echo '-';
                }
                break;
            case 'recipe-creator_rating_count':
                $ratingCount = get_post_meta($post_id, 'rating_count', true);
                if (isset($ratingCount) && $ratingCount !== '') {
                    echo esc_html(get_post_meta($post_id, 'rating_count', true));
                } else {
                    echo '-';
                }
                break;
        }
    }

    public function registerSortableColumns($columns)
    {
        $columns['recipe-creator_average_rating'] = __('Average rating', 'recipe-creator');
        $columns['recipe-creator_rating_count'] = __('Rating count', 'recipe-creator');
        return $columns;
    }

    public function showReleaseInfo()
    {
        $currentVersion = $this->getPluginVersion();
        $lastVersionWithHint = get_option("recipe_plugin_for_wp__release_info_shown", "0.0.1");

        if (version_compare($currentVersion, $lastVersionWithHint, ">")) {
            update_option("recipe_plugin_for_wp__release_info_shown", $currentVersion); ?>
            <div class="notice notice-info is-dismissible">
                <p>
                    <?php echo sprintf(
                        /* translators: %s: link to release notes */
                        __(
                            'We\'ve updated the <strong>Recipe Creator</strong> plugin. Check out the <a href="%s">release notes</a> to see which new features you can use now.',
                            "recipe-creator"
                        ),
                        esc_url(
                            get_admin_url(get_current_network_id(), "admin.php?page=recipe_plugin_for_wp_release_notes")
                        )
                    ); ?></p>
            </div>
<?php
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
                    // and the option "recipe_plugin_for_wp__show_jump_to_recipe"
                    // is set to true, I prepend the "jump to recipe" block to the content
                    if (
                        get_option("recipe_plugin_for_wp__show_jump_to_recipe", true) &&
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
        wp_localize_script("recipe-creator-recipe-view-script", "recipeCreatorConfig", [
            "ajaxUrl" => admin_url("admin-ajax.php"),
            "nonce" => wp_create_nonce("recipe-creator"),
        ]);
    }

    public function fetchInfo($res, $action, $args)
    {
        // do nothing if this is not about getting plugin information
        if ("plugin_information" !== $action) {
            return $res;
        }

        // do nothing if it is not our plugin
        if ("recipe-creator" !== $args->slug) {
            return $res;
        }

        // trying to get from cache first
        if (false == ($remote = get_transient("recipe_plugin_for_wp_update"))) {
            // info.json is the file with the actual plugin information on your server
            $remote = wp_remote_get("https://updates.recipe-creator.de/recipe-creator/info.json", [
                "timeout" => 10,
                "headers" => [
                    "Accept" => "application/json",
                ],
            ]);

            if (
                !is_wp_error($remote) &&
                isset($remote["response"]["code"]) &&
                $remote["response"]["code"] == 200 &&
                !empty($remote["body"])
            ) {
                set_transient("recipe_plugin_for_wp_update", $remote, 43200); // 12 hours cache
            }
        }

        if (
            !is_wp_error($remote) &&
            isset($remote["response"]["code"]) &&
            $remote["response"]["code"] == 200 &&
            !empty($remote["body"])
        ) {
            $remote = json_decode($remote["body"]);
            $res = new stdClass();

            $res->name = $remote->name;
            $res->slug = "recipe-creator";
            $res->version = $remote->version;
            $res->tested = $remote->tested;
            $res->requires = $remote->requires;
            $res->author = '<a href="https://www.recipe-creator.de">recipe-creator.de</a>';
            $res->author_profile = "https://www.recipe-creator.de";
            $res->download_link = $remote->download_url;
            $res->trunk = $remote->download_url;
            $res->requires_php = $remote->requires_php;
            $res->last_updated = $remote->last_updated;
            $res->sections = [
                "description" => $remote->sections->description,
                "installation" => $remote->sections->installation,
                "changelog" => $remote->sections->changelog,
                // you can add your custom sections (tabs) here
            ];

            // in case you want the screenshots tab, use the following HTML format for its content:
            // <ol><li><a href="IMG_URL" target="_blank"><img src="IMG_URL" alt="CAPTION" /></a><p>CAPTION</p></li></ol>
            if (!empty($remote->screenshots)) {
                $res["screenshots"] = $remote->screenshots;
            }

            if (!empty($remote->banners)) {
                $res["banners"] = $remote->banners;
            }
            return $res;
        }

        return $res;
    }

    public function pushUpdate($transient)
    {
        if (empty($transient->checked)) {
            return $transient;
        }

        // trying to get from cache first, to disable cache comment 10,20,21,22,24
        if (false == ($remote = get_transient("recipe_plugin_for_wp_upgrade"))) {
            // info.json is the file with the actual plugin information on your server
            $remote = wp_remote_get("https://updates.recipe-creator.de/recipe-creator/info.json", [
                "timeout" => 10,
                "headers" => [
                    "Accept" => "application/json",
                ],
            ]);

            if (
                !is_wp_error($remote) &&
                isset($remote["response"]["code"]) &&
                $remote["response"]["code"] == 200 &&
                !empty($remote["body"])
            ) {
                set_transient("recipe_plugin_for_wp_upgrade", $remote, 43200); // 12 hours cache
            }
        }

        if (isset($remote) && !is_wp_error($remote)) {
            $remote = json_decode($remote["body"]);

            $currentVersion = $this->getPluginVersion();

            // your installed plugin version should be on the line below! You can obtain it dynamically of course
            if (
                $remote &&
                version_compare($currentVersion, $remote->version, "<") &&
                version_compare($remote->requires, get_bloginfo("version"), "<")
            ) {
                $res = new stdClass();
                $res->slug = "recipe-creator";
                $res->plugin = "recipe-creator/recipe-creator.php";
                $res->new_version = $remote->version;
                $res->tested = $remote->tested;
                $res->package = $remote->download_url;
                $transient->response[$res->plugin] = $res;
                //$transient->checked[$res->plugin] = $remote->version;
            }
        }
        return $transient;
    }

    private function getPluginVersion()
    {
        if (!function_exists("get_plugin_data")) {
            require_once ABSPATH . "wp-admin/includes/plugin.php";
        }
        $plugin_data = get_plugin_data(plugin_dir_path(__FILE__) . "../recipe-creator.php");
        return $plugin_data["Version"];
    }

    public function afterUpdate($upgrader_object, $options)
    {
        if ($options["action"] == "update" && $options["type"] === "plugin") {
            // just clean the cache when new plugin version is installed
            delete_transient("recipe_plugin_for_wp_upgrade");
        }
    }

    public function enqueueAdminJs()
    {
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

    public function registerSettingsPage()
    {
        add_menu_page(
            __("Recipe Creator", "recipe-creator"),
            __("Recipe Creator", "recipe-creator"),
            "manage_options",
            "recipe_plugin_for_wp",
            function () {
                return require_once plugin_dir_path(__FILE__) . "../templates/admin-index-page.php";
            },
            "dashicons-carrot",
            100
        );

        add_submenu_page(
            "recipe_plugin_for_wp",
            __("Recipe Block", "recipe-creator"),
            __("Recipe Block", "recipe-creator"),
            "manage_options",
            "recipe_plugin_for_wp",
            function () {
                return require_once plugin_dir_path(__FILE__) . "../templates/admin-index-page.php";
            },
            10
        );

        add_submenu_page(
            "recipe_plugin_for_wp",
            __("Release notes", "recipe-creator"),
            __("Release notes", "recipe-creator"),
            "manage_options",
            "recipe_plugin_for_wp_release_notes",
            function () {
                return require_once plugin_dir_path(__FILE__) . "../templates/admin-release-notes-page.php";
            },
            20
        );

        do_action("wp_recipe_pro__register_page");
    }

    private function renderColorPickerInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="text" class="recipe-creator--color-picker" name="' .
            $name .
            '" value="' .
            $value .
            '" data-default-value="' .
            $defaultValue .
            '" />';
    }

    private function renderNumberInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="number" name="' . $name . '" value="' . $value . '" />';
    }

    private function renderTextInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="text" name="' . $name . '" value="' . $value . '" />';
    }

    private function renderCheckboxInput($name, $defaultValue, $text)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<label><input type="checkbox" name="' .
            $name .
            '" value="1" ' .
            (isset($value) && $value === "1" ? 'checked="checked"' : "") .
            " /> " .
            $text .
            "</label>";
    }

    public function registerRecipeBlockSettings()
    {
        // Settings
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__primary_color", [
            "default" => $this->primaryColorDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__primary_color_contrast", [
            "default" => $this->primaryColorContrastDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__primary_color_light", [
            "default" => $this->primaryColorLightDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__primary_color_light_contrast", [
            "default" => $this->primaryColorLightContrastDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__primary_color_dark", [
            "default" => $this->primaryColorDarkDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__secondary_color", [
            "default" => $this->secondaryColorDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__secondary_color_contrast", [
            "default" => $this->secondaryColorContrastDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__background_color", [
            "default" => $this->backgroundColorDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__background_color_contrast", [
            "default" => $this->backgroundColorContrastDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__show_box_shadow", [
            "default" => $this->showBoxShadowDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__show_border", [
            "default" => $this->showBorderDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__border_radius", [
            "default" => $this->borderRadiusDefault,
        ]);
        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__thumbnail_size", [
            "default" => $this->thumnailSizeDefault,
        ]);

        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__show_jump_to_recipe", [
            "default" => true,
        ]);

        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__instagram__username", [
            "default" => "",
        ]);

        register_setting("recipe_plugin_for_wp__general", "recipe_plugin_for_wp__instagram__hashtag", [
            "default" => "",
        ]);

        // Sections
        add_settings_section(
            "recipe_plugin_for_wp__general",
            __("General settings", "recipe-creator"),
            function () {
                echo "<p>" .
                    __("Configure how the recipe block should behave on your blog posts.", "recipe-creator") .
                    "</p>";
            },
            "recipe_plugin_for_wp__general"
        );
        add_settings_section(
            "recipe_plugin_for_wp__instagram",
            __("Instagram", "recipe-creator"),
            function () {
                echo "<p>" .
                    __(
                        "Provide informations about your instagram profile and we show a call to action below your recipe.",
                        "recipe-creator"
                    ) .
                    "</p>";
            },
            "recipe_plugin_for_wp__general"
        );
        add_settings_section(
            "recipe_plugin_for_wp__visual",
            __("Visual settings", "recipe-creator"),
            function () {
                echo "<p>" .
                    __("Configure how the recipe block should look for your visitors.", "recipe-creator") .
                    "</p>";
            },
            "recipe_plugin_for_wp__general"
        );

        // Fields
        add_settings_field(
            "recipe_plugin_for_wp__show_jump_to_recipe",
            __("Jump to recipe", "recipe-creator"),
            function () {
                $this->renderCheckboxInput(
                    "recipe_plugin_for_wp__show_jump_to_recipe",
                    true,
                    __('Add a "Jump to recipe" button on every page with the recipe block.', "recipe-creator")
                );
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__general",
            [
                "label_for" => "recipe_plugin_for_wp__show_jump_to_recipe",
            ]
        );

        add_settings_field(
            "recipe_plugin_for_wp__instagram__username",
            __("Your username", "recipe-creator"),
            function () {
                $this->renderTextInput("recipe_plugin_for_wp__instagram__username", "");
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__instagram",
            [
                "label_for" => "recipe_plugin_for_wp__instagram__username",
            ]
        );

        add_settings_field(
            "recipe_plugin_for_wp__instagram__hashtag",
            __("Hashtag", "recipe-creator"),
            function () {
                $this->renderTextInput("recipe_plugin_for_wp__instagram__hashtag", "");
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__instagram",
            [
                "label_for" => "recipe_plugin_for_wp__instagram__hashtag",
            ]
        );

        add_settings_field(
            "recipe_plugin_for_wp__primary_color",
            __("Primary color", "recipe-creator"),
            function () {
                $this->renderColorPickerInput("recipe_plugin_for_wp__primary_color", $this->primaryColorDefault);
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__primary_color",
            ]
        );
        add_settings_field(
            "recipe_plugin_for_wp__secondary_color",
            __("Secondary color", "recipe-creator"),
            function () {
                $this->renderColorPickerInput("recipe_plugin_for_wp__secondary_color", $this->secondaryColorDefault);
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__secondary_color",
            ]
        );
        add_settings_field(
            "recipe_plugin_for_wp__background_color",
            __("Background color", "recipe-creator"),
            function () {
                $this->renderColorPickerInput("recipe_plugin_for_wp__background_color", $this->backgroundColorDefault);
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__background_color",
            ]
        );

        add_settings_field(
            "recipe_plugin_for_wp__show_border",
            __("Border", "recipe-creator"),
            function () {
                $this->renderCheckboxInput(
                    "recipe_plugin_for_wp__show_border",
                    $this->showBorderDefault,
                    __("Show border", "recipe-creator")
                );
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__show_border",
            ]
        );
        add_settings_field(
            "recipe_plugin_for_wp__show_box_shadow",
            __("Box shadow", "recipe-creator"),
            function () {
                $this->renderCheckboxInput(
                    "recipe_plugin_for_wp__show_box_shadow",
                    $this->showBoxShadowDefault,
                    __("Show box shadow", "recipe-creator")
                );
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__show_box_shadow",
            ]
        );
        add_settings_field(
            "recipe_plugin_for_wp__border_radius",
            __("Border radius", "recipe-creator"),
            function () {
                $this->renderNumberInput("recipe_plugin_for_wp__border_radius", $this->borderRadiusDefault);
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__border_radius",
            ]
        );
        add_settings_field(
            "recipe_plugin_for_wp__thumbnail_size",
            __("Image width", "recipe-creator"),
            function () {
                $this->renderNumberInput("recipe_plugin_for_wp__thumbnail_size", $this->thumnailSizeDefault);
            },
            "recipe_plugin_for_wp__general",
            "recipe_plugin_for_wp__visual",
            [
                "label_for" => "recipe_plugin_for_wp__thumbnail_size",
            ]
        );
    }

    public function loadTranslations()
    {
        load_plugin_textdomain("recipe-creator", false, dirname(plugin_basename(__FILE__), 2) . "/languages");
    }

    public function registerMeta()
    {
        register_meta("post", "recipe_plugin_for_wp_image_id", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "recipe_plugin_for_wp_image_url", [
            "show_in_rest" => true,
            "type" => "string",
            "single" => true,
        ]);
        register_meta("post", "rating_1_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "rating_2_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "rating_3_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "rating_4_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "rating_5_votes", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "rating_count", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
        register_meta("post", "average_rating", [
            "show_in_rest" => true,
            "type" => "number",
            "single" => true,
        ]);
    }

    public function activate()
    {
    }

    public function deactivate()
    {
    }

    public static function uninstall()
    {
    }

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

            $amountOfRating1Votes = intval(get_post_meta($postId, "rating_1_votes", true)) ?: 0;
            $amountOfRating2Votes = intval(get_post_meta($postId, "rating_2_votes", true)) ?: 0;
            $amountOfRating3Votes = intval(get_post_meta($postId, "rating_3_votes", true)) ?: 0;
            $amountOfRating4Votes = intval(get_post_meta($postId, "rating_4_votes", true)) ?: 0;
            $amountOfRating5Votes = intval(get_post_meta($postId, "rating_5_votes", true)) ?: 0;

            switch ($rating) {
                case 1:
                    $amountOfRating1Votes++;
                    update_post_meta($postId, "rating_1_votes", $amountOfRating1Votes);
                    break;
                case 2:
                    $amountOfRating2Votes++;
                    update_post_meta($postId, "rating_2_votes", $amountOfRating2Votes);
                    break;
                case 3:
                    $amountOfRating3Votes++;
                    update_post_meta($postId, "rating_3_votes", $amountOfRating3Votes);
                    break;
                case 4:
                    $amountOfRating4Votes++;
                    update_post_meta($postId, "rating_4_votes", $amountOfRating4Votes);
                    break;
                case 5:
                    $amountOfRating5Votes++;
                    update_post_meta($postId, "rating_5_votes", $amountOfRating5Votes);
                    break;
            }

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

            update_post_meta($postId, "rating_count", $totalAmount);
            update_post_meta($postId, "average_rating", $averageRating);

            wp_send_json_success([
                "averageRating" => $averageRating,
            ]);
            wp_die();
        }
    }

    private function extractIngredients($ingredientsHtml)
    {
        $ingredientsArray = explode("</li><li>", $ingredientsHtml);
        $ingredientsArray = array_map(function ($item) {
            $result = str_replace(["<li>", "</li>"], "", $item);
            return $result;
        }, $ingredientsArray);

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
        }, $ingredientsArray);

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

    public static function getStyleBlockTemplate()
    {
        return file_get_contents(plugin_dir_path(__FILE__) . "../src/blocks/recipe/style-block.hbs");
    }

    public static function getRecipeBlockStylesRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . "../src/blocks/recipe/style-block.hbs",
            plugin_dir_path(__FILE__) . "../build/recipe-block-styles-renderer.php",
            [
                "encode" => function ($context, $options) {
                    return urlencode($context);
                },
                "shade" => function ($color, $shade, $options) {
                    return self::shadeColor($color, $shade);
                },
            ]
        );
    }

    public function renderRecipeBlockStyles()
    {
        $options = $this->getStyleOptions();
        $svgs = $this->getSvgs($options);

        $renderer = self::getRecipeBlockStylesRenderer();
        return $renderer([
            "options" => $options,
            "svgs" => $svgs,
        ]);
    }

    private static function shadeColor($color, $shade)
    {
        $num = base_convert(substr($color, 1), 16, 10);
        $amt = round(2.55 * $shade);
        $r = ($num >> 16) + $amt;
        $b = (($num >> 8) & 0x00ff) + $amt;
        $g = ($num & 0x0000ff) + $amt;

        return "#" .
            substr(
                base_convert(
                    0x1000000 +
                        ($r < 255 ? ($r < 1 ? 0 : $r) : 255) * 0x10000 +
                        ($b < 255 ? ($b < 1 ? 0 : $b) : 255) * 0x100 +
                        ($g < 255 ? ($g < 1 ? 0 : $g) : 255),
                    10,
                    16
                ),
                1
            );
    }

    public static function getRecipeBlockRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . "../src/blocks/recipe/block.hbs",
            plugin_dir_path(__FILE__) . "../build/recipe-block-renderer.php",
            [
                "formatDuration" => function ($context, $options) {
                    if (isset($context) && $context !== "") {
                        $minutes = intval($context);

                        if ($minutes < 60) {
                            return $minutes . " " . __("minutes", "recipe-creator");
                        } else {
                            $hours = floor($minutes / 60);
                            $rest = $minutes % 60;

                            return $hours .
                                " " .
                                __("hours", "recipe-creator") .
                                ($rest > 0 ? " " . $rest . " " . __("minutes", "recipe-creator") : "");
                        }
                    }

                    return "";
                },
                "toJSON" => function ($context, $options) {
                    return json_encode($context);
                },
                "ifOneOfThem" => function ($arg1, $arg2, $options) {
                    if ((isset($arg1) && !empty($arg1)) || (isset($arg2) && !empty($arg2))) {
                        return $options["fn"]();
                    } else {
                        return $options["inverse"]();
                    }
                },
                "encode" => function ($context, $options) {
                    return urlencode($context);
                },
                "shade" => function ($color, $shade, $options) {
                    return self::shadeColor($color, $shade);
                },
                "ifMoreOrEqual" => function ($arg1, $arg2, $options) {
                    if ($arg1 >= $arg2) {
                        return $options["fn"]();
                    } else {
                        return $options["inverse"]();
                    }
                },
                "isEven" => function ($conditional, $options) {
                    if ($conditional % 2 === 0) {
                        return $options["fn"]();
                    } else {
                        return $options["inverse"]();
                    }
                },
            ],
            [
                "styleBlock" => plugin_dir_path(__FILE__) . "../src/blocks/recipe/style-block.hbs",
            ]
        );
    }

    public static function getJumpToRecipeBlockRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . "../src/blocks/jump-to-recipe/template.hbs",
            plugin_dir_path(__FILE__) . "../build/jump-to-recipe-block-renderer.php"
        );
    }

    private static function getRenderer(
        $templatePath,
        $rendererPath,
        $handlebarsHelper = [],
        $handlebarsPartialPaths = []
    ) {
        if (!file_exists($rendererPath) || (WP_DEBUG && file_exists($templatePath))) {
            $template = file_get_contents($templatePath);

            $handlebarsPartials = array_map(function ($path) {
                return file_get_contents($path);
            }, $handlebarsPartialPaths);

            $phpStr = LightnCandy::compile($template, [
                "flags" => LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_ERROR_EXCEPTION,
                "helpers" => $handlebarsHelper,
                "partials" => $handlebarsPartials,
            ]);

            // Save the compiled PHP code into a php file
            file_put_contents($rendererPath, "<?php " . $phpStr . "?>");
        }

        // Get the render function from the php file
        return include $rendererPath;
    }

    public function getDummyData()
    {
        return [
            "translations" => $this->getRecipeBlockTranslations(),
            "recipeYield" => 2,
            "recipeYieldUnit" => "servings",
            "recipeYieldUnitFormatted" => __("servings", "recipe-creator"),
            "difficulty" => __("simple", "recipe-creator"),
            "prepTime" => 0,
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
                    "items" => [
                        [
                            "amount" => 500,
                            "unit" => "ml",
                            "ingredient" => __("milk", "recipe-creator"),
                        ],
                        [
                            "amount" => 1,
                            "unit" => "",
                            "ingredient" => __("banana", "recipe-creator"),
                        ],
                        [
                            "amount" => 1,
                            "unit" => "TL",
                            "ingredient" => __("sugar", "recipe-creator"),
                        ],
                        [
                            "amount" => 0,
                            "unit" => "",
                            "ingredient" => __("cinnamon", "recipe-creator"),
                        ],
                    ],
                ],
            ],
            "utensils" =>
            "<li>" . join("</li><li>", [__("Knife", "recipe-creator"), __("Blender", "recipe-creator")]) . "</li>",
            "preparationStepsGroups" => [
                [
                    "title" => "",
                    "list" =>
                    "<li>" .
                        join("</li><li>", [
                            __("Peel banana.", "recipe-creator"),
                            __(
                                "Put all the ingredients in the blender and mix everything for 30 seconds.",
                                "recipe-creator"
                            ),
                            __("Pour into a glass and enjoy.", "recipe-creator"),
                        ]) .
                        "</li>",
                ],
            ],
            "averageRating" => 4.5,
            "thumbnail" => plugins_url("../assets/banana-shake-4_3.png", __FILE__),
            "notes" => __("The milkshake becomes particularly creamy with UHT milk.", "recipe-creator"),
            "instagramUsername" => get_option("recipe_plugin_for_wp__instagram__username", ""),
            "instagramHashtag" => get_option("recipe_plugin_for_wp__instagram__hashtag", ""),
        ];
    }

    public function renderRecipeBlockDummy()
    {
        $dummyData = $this->getDummyData();

        $renderer = self::getRecipeBlockRenderer();

        return $renderer($dummyData);
    }

    private function getRecipeBlockTranslations()
    {
        return [
            "prepTime" => __("Prep time", "recipe-creator"),
            "restTime" => __("Rest time", "recipe-creator"),
            "cookTime" => __("Cook time", "recipe-creator"),
            "bakingTime" => __("Baking time", "recipe-creator"),
            "totalTime" => __("Total time", "recipe-creator"),
            "yield" => __("yields", "recipe-creator"),
            "ingredients" => __("Ingredients", "recipe-creator"),
            "utensils" => __("Utensils", "recipe-creator"),
            "preparationSteps" => __("Steps of preparation", "recipe-creator"),
            "print" => __("Print", "recipe-creator"),
            "pinIt" => __("Pin it", "recipe-creator"),
            "yourRating" => __("Your rating", "recipe-creator"),
            "averageRating" => __("Average rating", "recipe-creator"),
            "notes" => __("Notes", "recipe-creator"),
            "feedback" => __("How do you like the recipe?", "recipe-creator"),
            "servings" => __("servings", "recipe-creator"),
            "video" => __("Video", "recipe-creator"),
            "instagramHeadline" => __("You tried this recipe?", "recipe-creator"),
            "instagramThenLink" => __("Then link", "recipe-creator"),
            "instagramOnInstagram" => __("on Instagram", "recipe-creator"),
            "instagramOrUseHashtag" => __("on Instagram or use the hashtag", "recipe-creator"),
        ];
    }

    public function renderRecipeBlock($attributes, $context)
    {
        wp_enqueue_script("recipe-creator--recipe-view-script");

        $attributes["translations"] = $this->getRecipeBlockTranslations();

        $attributes["postId"] = get_the_ID();

        $averageRating = get_post_meta(get_the_ID(), "average_rating", true) ?: 0;
        $ratingCount = get_post_meta(get_the_ID(), "rating_count", true) ?: 0;

        $recipeYield = isset($attributes["recipeYield"]) ? intval($attributes["recipeYield"]) : 1;
        $recipeYieldWidth = isset($attributes["recipeYieldWidth"]) ? intval($attributes["recipeYieldWidth"]) : 0;
        $recipeYieldHeight = isset($attributes["recipeYieldHeight"]) ? intval($attributes["recipeYieldHeight"]) : 0;

        $attributes["prepTime"] = isset($attributes["prepTime"]) ? floatval($attributes["prepTime"]) : 0;
        $attributes["restTime"] = isset($attributes["restTime"]) ? floatval($attributes["restTime"]) : 0;
        $attributes["cookTime"] = isset($attributes["cookTime"]) ? floatval($attributes["cookTime"]) : 0;
        $attributes["bakingTime"] = isset($attributes["bakingTime"]) ? floatval($attributes["bakingTime"]) : 0;
        $attributes["totalTime"] = isset($attributes["totalTime"]) ? floatval($attributes["totalTime"]) : 0;

        if (isset($attributes["difficulty"]) && !empty($attributes["difficulty"])) {
            $attributes["difficulty"] = __($attributes["difficulty"], "recipe-creator");
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

        // In version 1.4.0 I added the possibility to split ingredient lists
        // So we have to migrate the old list (ingredients) to the new structure
        // of ingredientsGroups.

        if (isset($attributes["ingredients"]) && !empty($attributes["ingredients"])) {
            $attributes["ingredientsGroups"] = [
                [
                    "title" => "",
                    "list" => $attributes["ingredients"],
                ],
            ];
            unset($attributes["ingredients"]);
        }

        // In version 1.5.0 I added the possibility to split preparation step lists
        // So we have to migrate the old list (preparationSteps) to the new structure
        // of preparationStepsGroups.

        if (isset($attributes["preparationSteps"]) && !empty($attributes["preparationSteps"])) {
            $attributes["preparationStepsGroups"] = [
                [
                    "title" => "",
                    "list" => $attributes["preparationSteps"],
                ],
            ];
            unset($attributes["preparationSteps"]);
        }

        $attributes["ingredientsGroups"] = $this->prepareIngredientsForRenderer($attributes["ingredientsGroups"]);

        $attributes["averageRating"] = $averageRating;

        $keywords = get_the_tags();

        if ($keywords !== false && count($keywords) > 0) {
            $keywordsString = implode(
                ", ",
                array_map(function ($tag) {
                    return $tag->name;
                }, $keywords)
            );
        } else {
            $keywordsString = "";
        }

        $categories = get_the_category();
        if ($categories !== false && count($categories) > 0) {
            $category = array_map(function ($category) {
                return $category->name;
            }, $categories)[0];
        } else {
            $category = "";
        }

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

        $images = [];

        if (isset($attributes["image16_9"]) && !empty($attributes["image16_9"])) {
            $images[] = $attributes["image16_9"];
        }
        if (isset($attributes["image3_2"]) && !empty($attributes["image3_2"])) {
            $images[] = $attributes["image3_2"];
        }
        if (isset($attributes["image4_3"]) && !empty($attributes["image4_3"])) {
            $images[] = $attributes["image4_3"];
        }
        if (isset($attributes["image1_1"]) && !empty($attributes["image1_1"])) {
            $images[] = $attributes["image1_1"];
        }
        if (isset($attributes["thumbnail"]) && !empty($attributes["thumbnail"])) {
            $images[] = $attributes["thumbnail"];
        }

        $description = isset($attributes["description"]) ? $attributes["description"] : "";

        // Process the pinterest image

        $pinterestImageId = get_post_meta(get_the_ID(), "recipe_plugin_for_wp_image_id", true) ?: null;
        $currentUrl =
            (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on" ? "https" : "http") .
            "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

        if ($pinterestImageId !== null) {
            $pinterestImageUrl = wp_get_attachment_image_src($pinterestImageId, "recipe-creator--pinterest");
            if ($pinterestImageUrl) {
                $attributes["pinterestPinItUrl"] =
                    "https://www.pinterest.com/pin/create/button/" .
                    "?url=" .
                    urlencode($currentUrl) .
                    "&media=" .
                    urlencode($pinterestImageUrl[0]) .
                    "&description=" .
                    urlencode($description);
            }
        }

        $attributes["ldJson"] = [
            "@context" => "https://schema.org/",
            "@type" => "Recipe",
            "name" => isset($attributes["name"]) ? $attributes["name"] : "",
            "image" => $images,
            "author" => [
                "@type" => "Person",
                "name" => get_the_author_meta("display_name"),
            ],
            "datePublished" => get_the_date("Y-m-d"), // "2018-03-10",
            "description" => $description,
            "recipeCuisine" => isset($attributes["recipeCuisine"]) ? $attributes["recipeCuisine"] : "",
            "prepTime" => isset($attributes["prepTime"])
                ? $this->toIso8601Duration(intval($attributes["prepTime"]) * 60)
                : "",
            "cookTime" => $this->getCooktimeForSchema($attributes),
            "totalTime" => isset($attributes["totalTime"])
                ? $this->toIso8601Duration(intval($attributes["totalTime"]) * 60)
                : "",
            "keywords" => $keywordsString,
            "recipeYield" => isset($attributes["recipeYield"])
                ? $attributes["recipeYield"] .
                (isset($attributes["recipeYieldUnit"])
                    ? " " . $this->getRecipeYieldUnitFormatted($attributes["recipeYieldUnit"], $recipeYield ?: 1)
                    : "")
                : "",
            "recipeCategory" => $category,
            "nutrition" =>
            isset($attributes["calories"]) && !empty($attributes["calories"])
                ? [
                    "@type" => "NutritionInformation",
                    "calories" => $attributes["calories"],
                ]
                : "",
            "recipeIngredient" => $this->prepareIngredientsForJsonLd($attributes["ingredientsGroups"]),
            "recipeInstructions" => $this->preparePreparationStepsForJsonLd($attributes["preparationStepsGroups"]),
        ];

        if ($averageRating > 0 && $ratingCount > 0) {
            $attributes["ldJson"]["aggregateRating"] = [
                "@type" => "AggregateRating",
                "ratingValue" => "$averageRating",
                "ratingCount" => "$ratingCount",
            ];
        }

        if (isset($attributes["videoIframeUrl"]) && !empty($attributes["videoIframeUrl"])) {
            $attributes["ldJson"]["video"] = [
                "@type" => "VideoObject",
                "description" => $attributes["description"],
                "name" => isset($attributes["name"]) ? $attributes["name"] : "",
                "thumbnailUrl" => $attributes["thumbnail"],
                "uploadDate" => get_the_date("Y-m-d"),
                "embedUrl" => $attributes["videoIframeUrl"],
            ];
        }

        // Remove empty strings from ldJon
        $attributes["ldJson"] = array_filter($attributes["ldJson"]);

        $attributes["options"] = $this->getStyleOptions();
        $attributes["svgs"] = $this->getSvgs($attributes["options"]);

        // Instagram-CTA
        $attributes["instagramUsername"] = get_option("recipe_plugin_for_wp__instagram__username", "");
        $attributes["instagramHashtag"] = get_option("recipe_plugin_for_wp__instagram__hashtag", "");

        $renderer = self::getRecipeBlockRenderer();
        return $renderer($attributes);
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
                            (isset($item["ingredient"]) ? strip_tags($item["ingredient"]) : "")
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
                        "text" => strip_tags($item),
                    ];
                }, explode('\n', str_replace("li><li", 'li>\n<li', $group["list"])));

                foreach ($itemsList as $howToStep) {
                    $flat[] = $howToStep;
                }
            }
        }

        return $flat;
    }

    public function renderJumpToRecipeBlock($attributes, $context)
    {
        $renderer = self::getJumpToRecipeBlockRenderer();
        $attributes["translations"] = [
            "jumpToRecipe" => __("Jump to recipe", "recipe-creator"),
        ];
        $attributes["options"] = $this->getStyleOptions();
        return $renderer($attributes);
    }

    private function getStyleOptions()
    {
        return [
            "primaryColor" => get_option("recipe_plugin_for_wp__primary_color", $this->primaryColorDefault),
            "primaryColorContrast" => get_option(
                "recipe_plugin_for_wp__primary_color_contrast",
                $this->primaryColorContrastDefault
            ),
            "primaryColorLight" => get_option(
                "recipe_plugin_for_wp__primary_color_light",
                $this->primaryColorLightDefault
            ),
            "primaryColorLightContrast" => get_option(
                "recipe_plugin_for_wp__primary_color_light_contrast",
                $this->primaryColorLightContrastDefault
            ),
            "primaryColorDark" => get_option(
                "recipe_plugin_for_wp__primary_color_dark",
                $this->primaryColorDarkDefault
            ),
            "secondaryColor" => get_option("recipe_plugin_for_wp__secondary_color", $this->secondaryColorDefault),
            "secondaryColorContrast" => get_option(
                "recipe_plugin_for_wp__secondary_color_contrast",
                $this->secondaryColorContrastDefault
            ),
            "backgroundColor" => get_option("recipe_plugin_for_wp__background_color", $this->backgroundColorDefault),
            "backgroundColorContrast" => get_option(
                "recipe_plugin_for_wp__background_color_contrast",
                $this->backgroundColorContrastDefault
            ),
            "showBorder" => get_option("recipe_plugin_for_wp__show_border", $this->showBorderDefault),
            "showBoxShadow" => get_option("recipe_plugin_for_wp__show_box_shadow", $this->showBoxShadowDefault),
            "borderRadius" => get_option("recipe_plugin_for_wp__border_radius", $this->borderRadiusDefault),
        ];
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

    private function getSvgs($colors)
    {
        return [
            "clock" => $this->base64EncodeImage(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="' .
                    $colors["backgroundColorContrast"] .
                    '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>'
            ),
            "star" => $this->base64EncodeImage(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' .
                    $colors["primaryColor"] .
                    '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
            ),
            "starFilled" => $this->base64EncodeImage(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' .
                    $colors["primaryColor"] .
                    '" stroke="' .
                    $colors["primaryColor"] .
                    '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
            ),
            "starHalfFilled" => $this->base64EncodeImage(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="url(#half_grad)" stroke="' .
                    $colors["primaryColor"] .
                    '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="half_grad"><stop offset="50%" stop-color="' .
                    $colors["primaryColor"] .
                    '"/><stop offset="50%" stop-color="transparent" stop-opacity="1" /></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
            ),
            "starHighlighted" => $this->base64EncodeImage(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' .
                    $colors["primaryColorDark"] .
                    '" stroke="' .
                    $colors["primaryColorDark"] .
                    '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
            ),
            "instagram" => $this->base64EncodeImage(
                '<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="' .
                    $colors["primaryColorContrast"] .
                    '"> <title>IG Logo</title><g fill-rule="evenodd"><path d="M18 0c-4.889 0-5.501.02-7.421.108C8.663.196 7.354.5 6.209.945a8.823 8.823 0 0 0-3.188 2.076A8.83 8.83 0 0 0 .945 6.209C.5 7.354.195 8.663.108 10.58.021 12.499 0 13.11 0 18s.02 5.501.108 7.421c.088 1.916.392 3.225.837 4.37a8.823 8.823 0 0 0 2.076 3.188c1 1 2.005 1.616 3.188 2.076 1.145.445 2.454.75 4.37.837 1.92.087 2.532.108 7.421.108s5.501-.02 7.421-.108c1.916-.088 3.225-.392 4.37-.837a8.824 8.824 0 0 0 3.188-2.076c1-1 1.616-2.005 2.076-3.188.445-1.145.75-2.454.837-4.37.087-1.92.108-2.532.108-7.421s-.02-5.501-.108-7.421c-.088-1.916-.392-3.225-.837-4.37a8.824 8.824 0 0 0-2.076-3.188A8.83 8.83 0 0 0 29.791.945C28.646.5 27.337.195 25.42.108 23.501.021 22.89 0 18 0zm0 3.243c4.806 0 5.376.019 7.274.105 1.755.08 2.708.373 3.342.62.84.326 1.44.717 2.07 1.346.63.63 1.02 1.23 1.346 2.07.247.634.54 1.587.62 3.342.086 1.898.105 2.468.105 7.274s-.019 5.376-.105 7.274c-.08 1.755-.373 2.708-.62 3.342a5.576 5.576 0 0 1-1.346 2.07c-.63.63-1.23 1.02-2.07 1.346-.634.247-1.587.54-3.342.62-1.898.086-2.467.105-7.274.105s-5.376-.019-7.274-.105c-1.755-.08-2.708-.373-3.342-.62a5.576 5.576 0 0 1-2.07-1.346 5.577 5.577 0 0 1-1.346-2.07c-.247-.634-.54-1.587-.62-3.342-.086-1.898-.105-2.468-.105-7.274s.019-5.376.105-7.274c.08-1.755.373-2.708.62-3.342.326-.84.717-1.44 1.346-2.07.63-.63 1.23-1.02 2.07-1.346.634-.247 1.587-.54 3.342-.62 1.898-.086 2.468-.105 7.274-.105z"/><path d="M18 24.006a6.006 6.006 0 1 1 0-12.012 6.006 6.006 0 0 1 0 12.012zm0-15.258a9.252 9.252 0 1 0 0 18.504 9.252 9.252 0 0 0 0-18.504zm11.944-.168a2.187 2.187 0 1 1-4.374 0 2.187 2.187 0 0 1 4.374 0"/></g></svg>'
            ),
        ];
    }

    private function base64EncodeImage($svg)
    {
        $base64_image = "data:image/svg+xml;base64," . base64_encode($this->unescape(rawurlencode($svg)));
        return $base64_image;
    }

    private function unescape($str)
    {
        $ret = "";
        $len = strlen($str);
        for ($i = 0; $i < $len; $i++) {
            if ($str[$i] == "%" && $str[$i + 1] == "u") {
                $val = hexdec(substr($str, $i + 2, 4));
                if ($val < 0x7f) {
                    $ret .= chr($val);
                } elseif ($val < 0x800) {
                    $ret .= chr(0xc0 | ($val >> 6)) . chr(0x80 | ($val & 0x3f));
                } else {
                    $ret .= chr(0xe0 | ($val >> 12)) . chr(0x80 | (($val >> 6) & 0x3f)) . chr(0x80 | ($val & 0x3f));
                }
                $i += 5;
            } elseif ($str[$i] == "%") {
                $ret .= urldecode(substr($str, $i, 3));
                $i += 2;
            } else {
                $ret .= $str[$i];
            }
        }
        return $ret;
    }
}
