<?php

if (!defined('ABSPATH')) {
    die;
}

require __DIR__ . "/../vendor/autoload.php";

use LightnCandy\LightnCandy;

class FoodblogkitchenToolkit
{
    private $primaryColorDefault = '#e27a7a';
    private $primaryColorContrastDefault = '#ffffff';
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

        add_filter('the_content', array($this, 'handleContent'), 1);

        add_action('admin_notices', array($this, 'showReleaseInfo'));
    }

    public function showReleaseInfo()
    {
        $currentVersion = $this->getPluginVersion();
        $lastVersionWithHint = get_option('foodblogkitchen_toolkit__release_info_shown', '0.0.1');

        if (version_compare($currentVersion, $lastVersionWithHint, '>')) {
            update_option('foodblogkitchen_toolkit__release_info_shown', $currentVersion);
?>
            <div class="notice notice-info is-dismissible">
                <p>
                    <?php
                    echo sprintf(
                        __('We\'ve updated the <strong>Foodblog-Toolkit</strong>. Check out the <a href="%s">release notes</a> to see which new features you can use now.', 'foodblogkitchen-toolkit'),
                        esc_url(get_admin_url(get_current_network_id(), 'admin.php?page=foodblogkitchen_toolkit_release_notes'))
                    );
                    ?></p>
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
                if (has_block('foodblogkitchen-recipes/block')) {
                    // If there is no "jump to recipe" block inside the content
                    // and the option "foodblogkitchen_toolkit__show_jump_to_recipe"
                    // is set to true, I prepend the "jump to recipe" block to the content
                    if (get_option('foodblogkitchen_toolkit__show_jump_to_recipe', true) && !has_block('foodblogkitchen-toolkit/jump-to-recipe')) {
                        $content = "<!-- wp:foodblogkitchen-toolkit/jump-to-recipe /-->\n\n" . $content;
                    }
                }

                if (has_block('foodblogkitchen-toolkit/faq')) {
                    // The LD-JSON for FAQ blocks must be combined into one
                    // So lets check if there are FAQ blocks on this page

                    $faqBlocks = [];
                    $blocks = parse_blocks($content);

                    foreach ($blocks as $block) {
                        if ($block['blockName'] === 'foodblogkitchen-toolkit/faq') {
                            $faqBlocks[] = $block;
                        }
                    }

                    if (count($faqBlocks) > 0) {
                        $lsJson = [
                            "@context" => "https://schema.org/",
                            "@type" => "FAQPage",
                            "mainEntity" => []
                        ];

                        foreach ($faqBlocks as $block) {
                            if (isset($block['attrs']['question']) && isset($block['attrs']['answer'])) {
                                $lsJson['mainEntity'][] = [
                                    "@type" => "Question",
                                    "name" => $block["attrs"]['question'],
                                    "acceptedAnswer" => [
                                        "@type" => "Answer",
                                        "text" => $block["attrs"]['answer']
                                    ]
                                ];
                            }
                        }

                        echo '<script type="application/ld+json">' . json_encode($lsJson) . '</script>';
                    }
                }
            }
        }

        return $content;
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

            $currentVersion = $this->getPluginVersion();

            // your installed plugin version should be on the line below! You can obtain it dynamically of course 
            if ($remote && version_compare($currentVersion, $remote->version, '<') && version_compare($remote->requires, get_bloginfo('version'), '<')) {
                $res = new stdClass();
                $res->slug = 'foodblogkitchen-toolkit';
                $res->plugin = 'foodblogkitchen-toolkit/foodblogkitchen-toolkit.php';
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
        if (!function_exists('get_plugin_data')) {
            require_once(ABSPATH . 'wp-admin/includes/plugin.php');
        }
        $plugin_data = get_plugin_data(plugin_dir_path(__FILE__) . '../foodblogkitchen-toolkit.php');
        return $plugin_data['Version'];
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

        wp_enqueue_script(
            'foodblogkitchen-toolkit-settings-js',
            plugins_url('build/admin.js', dirname(__FILE__)),
            array('jquery', 'wp-color-picker', 'iris'),
            '',
            true
        );

        wp_enqueue_style(
            'foodblogkitchen-toolkit-settings-admin-css',
            plugins_url('build/admin.css', dirname(__FILE__)),
            array(),
            '',
            'all'
        );
    }

    public function registerSettingsPage()
    {
        add_menu_page(
            __('Foodblog-Toolkit', 'foodblogkitchen-toolkit'),
            __('Foodblog-Toolkit', 'foodblogkitchen-toolkit'),
            'manage_options',
            'foodblogkitchen_toolkit',
            function () {
                return require_once(plugin_dir_path(__FILE__) . '../templates/admin-index-page.php');
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
                return require_once(plugin_dir_path(__FILE__) . '../templates/admin-index-page.php');
            }
        );


        add_submenu_page(
            'foodblogkitchen_toolkit',
            __('Pinterest', 'foodblogkitchen-toolkit'),
            __("Pinterest", 'foodblogkitchen-toolkit'),
            'manage_options',
            'foodblogkitchen_toolkit_pinterest',
            function () {
                return require_once(plugin_dir_path(__FILE__) . '../templates/admin-pinterest-page.php');
            }
        );

        add_submenu_page(
            'foodblogkitchen_toolkit',
            __('Release notes', 'foodblogkitchen-toolkit'),
            __("Release notes", 'foodblogkitchen-toolkit'),
            'manage_options',
            'foodblogkitchen_toolkit_release_notes',
            function () {
                return require_once(plugin_dir_path(__FILE__) . '../templates/admin-release-notes-page.php');
            }
        );

        add_submenu_page(
            'foodblogkitchen_toolkit',
            __('License', 'foodblogkitchen-toolkit'),
            __("License", 'foodblogkitchen-toolkit'),
            'manage_options',
            'foodblogkitchen_toolkit_license',
            function () {
                return require_once(plugin_dir_path(__FILE__) . '../templates/admin-license-page.php');
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

    private function renderTextInput($name, $defaultValue)
    {
        $value = esc_attr(get_option($name, $defaultValue));
        echo '<input type="text" name="' . $name . '" value="' . $value . '" />';
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
            'foodblogkitchen_toolkit__primary_color_contrast',
            array(
                "default" => $this->primaryColorContrastDefault
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

        register_setting(
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__show_jump_to_recipe',
            array(
                "default" => true
            )
        );

        register_setting(
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__instagram__username',
            array(
                "default" => ''
            )
        );

        register_setting(
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__instagram__hashtag',
            array(
                "default" => ''
            )
        );

        // Sections
        add_settings_section(
            'foodblogkitchen_toolkit__general',
            __('General settings', 'foodblogkitchen-toolkit'),
            function () {
                echo '<p>' . __("Configure how the recipe block should behave on your blog posts.", 'foodblogkitchen-toolkit') . '</p>';
            },
            'foodblogkitchen_toolkit__general'
        );
        add_settings_section(
            'foodblogkitchen_toolkit__instagram',
            __('Instagram', 'foodblogkitchen-toolkit'),
            function () {
                echo '<p>' . __("Provide informations about your instagram profile and we show a call to action below your recipe.", 'foodblogkitchen-toolkit') . '</p>';
            },
            'foodblogkitchen_toolkit__general'
        );
        add_settings_section(
            'foodblogkitchen_toolkit__visual',
            __('Visual settings', 'foodblogkitchen-toolkit'),
            function () {
                echo '<p>' . __("Configure how the recipe block should look for your visitors.", 'foodblogkitchen-toolkit') . '</p>';
            },
            'foodblogkitchen_toolkit__general'
        );

        // Fields
        add_settings_field(
            'foodblogkitchen_toolkit__show_jump_to_recipe',
            __('Jump to recipe', 'foodblogkitchen-toolkit'),
            function () {
                $this->renderCheckboxInput('foodblogkitchen_toolkit__show_jump_to_recipe', true, __('Add a "Jump to recipe" button on every page with the recipe block.', 'foodblogkitchen-toolkit'));
            },
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__general',
            array(
                'label_for' => 'foodblogkitchen_toolkit__show_jump_to_recipe'
            )
        );

        add_settings_field(
            'foodblogkitchen_toolkit__instagram__username',
            __('Your username', 'foodblogkitchen-toolkit'),
            function () {
                $this->renderTextInput('foodblogkitchen_toolkit__instagram__username', '');
            },
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__instagram',
            array(
                'label_for' => 'foodblogkitchen_toolkit__instagram__username'
            )
        );

        add_settings_field(
            'foodblogkitchen_toolkit__instagram__hashtag',
            __('Hashtag', 'foodblogkitchen-toolkit'),
            function () {
                $this->renderTextInput('foodblogkitchen_toolkit__instagram__hashtag', '');
            },
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__instagram',
            array(
                'label_for' => 'foodblogkitchen_toolkit__instagram__hashtag'
            )
        );

        add_settings_field(
            'foodblogkitchen_toolkit__primary_color',
            __('Primary color', 'foodblogkitchen-toolkit'),
            function () {
                $this->renderColorPickerInput('foodblogkitchen_toolkit__primary_color', $this->primaryColorDefault);
            },
            'foodblogkitchen_toolkit__general',
            'foodblogkitchen_toolkit__visual',
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
            'foodblogkitchen_toolkit__visual',
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
            'foodblogkitchen_toolkit__visual',
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
            'foodblogkitchen_toolkit__visual',
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
            'foodblogkitchen_toolkit__visual',
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
            'foodblogkitchen_toolkit__visual',
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
                $this->renderCheckboxInput('foodblogkitchen_toolkit__pinterest_image_overlay__enabled', false, __('Show Pinterest share icon on post images. This only affects images on posts created with Gutenberg.', 'foodblogkitchen-toolkit'));
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
        load_plugin_textdomain('foodblogkitchen-toolkit', FALSE, dirname(plugin_basename(__FILE__), 2) . '/languages');
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


    public function activate()
    {
    }

    public function deactivate()
    {
    }

    static public function uninstall()
    {
        // Remove the license key
        FoodblogkitchenToolkit::unregisterLicense();
    }

    public function addRessources()
    {
        // editor.js

        $editorAsset = require(plugin_dir_path(__FILE__) . "../build/editor.asset.php");

        wp_register_script(
            'foodblogkitchen-toolkit-recipe-block-editor-script',
            plugins_url('build/editor.js', dirname(__FILE__)),
            $editorAsset['dependencies'],
            $editorAsset['version']
        );

        wp_register_style(
            'foodblogkitchen-toolkit-recipe-block-editor-style',
            plugins_url('build/editor.css', dirname(__FILE__)),
            array(),
            $editorAsset['version']
        );

        wp_enqueue_style(
            'foodblogkitchen-toolkit-recipe-block',
            plugins_url('build/style-editor.css', dirname(__FILE__)),
            array(),
            $editorAsset['version']
        );

        // Add some variables for the editor script
        $license = get_option('foodblogkitchen_toolkit__license_key', '');
        wp_localize_script('foodblogkitchen-toolkit-recipe-block-editor-script', 'foodblogkitchenToolkitAdditionalData', [
            "hasValidLicense" => !empty($license),
            "licensePage" => get_admin_url(get_current_network_id(), 'admin.php?page=foodblogkitchen_toolkit_license')
        ]);

        wp_set_script_translations('foodblogkitchen-toolkit-recipe-block-editor-script', 'foodblogkitchen-toolkit', dirname(plugin_dir_path(__FILE__), 1) . '/languages/');

        // frontend.js

        $frontendAsset = require(plugin_dir_path(__FILE__) . "../build/frontend.asset.php");

        wp_register_script(
            'foodblogkitchen-toolkit-recipe-block',
            plugins_url('build/frontend.js', dirname(__FILE__)),
            $frontendAsset['dependencies'],
            $frontendAsset['version']
        );

        wp_register_style(
            'foodblogkitchen-toolkit-recipe-block',
            plugins_url('build/style-index.css', dirname(__FILE__)),
            array(),
            $frontendAsset['version']
        );

        // pinterest-image-overlay.js

        // TODO: Include only when images are on the page
        if (get_option('foodblogkitchen_toolkit__pinterest_image_overlay__enabled', false)) {
            $pinterestImageOverlayAsset = require(plugin_dir_path(__FILE__) . "../build/pinterest-image-overlay.asset.php");

            wp_enqueue_script(
                'foodblogkitchen-toolkit-pinterest-image-overlay',
                plugins_url('build/pinterest-image-overlay.js', dirname(__FILE__)),
                $pinterestImageOverlayAsset['dependencies'],
                $pinterestImageOverlayAsset['version'],
            );

            wp_enqueue_style(
                'foodblogkitchen-toolkit-pinterest-image-overlay',
                plugins_url('build/pinterest-image-overlay.css', dirname(__FILE__)),
                array(),
                $pinterestImageOverlayAsset['version'],
            );
        }
    }

    public function registerBlock()
    {
        // Jump to recipe

        register_block_type('foodblogkitchen-toolkit/jump-to-recipe', array(
            'editor_script' => 'foodblogkitchen-toolkit-jump-to-recipe-block-editor-script',
            'editor_style'  => 'foodblogkitchen-toolkit-jump-to-recipe-block-editor-style',
            'script'        => 'foodblogkitchen-toolkit-recipe-block',
            'style'         => 'foodblogkitchen-toolkit-recipe-block',
            'attributes' => array(),
            'render_callback' => array($this, 'renderJumpToRecipeBlock'),
        ));

        // Recipe block

        register_block_type('foodblogkitchen-recipes/block', array(
            'editor_script' => 'foodblogkitchen-toolkit-recipe-block-editor-script',
            'editor_style'  => 'foodblogkitchen-toolkit-recipe-block-editor-style',
            'script'        => 'foodblogkitchen-toolkit-recipe-block',
            'style'         => 'foodblogkitchen-toolkit-recipe-block',
            'attributes' => array(
                // deprecated
                'ingredients' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                // deprecated
                'preparationSteps' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'utensils' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'ingredientsGroups' => array(
                    'type' => 'array',
                    'default' => [
                        [
                            "title" => "",
                            "list" => ""
                        ]
                    ]
                ),
                'preparationStepsGroups' => array(
                    'type' => 'array',
                    'default' => [
                        [
                            "title" => "",
                            "list" => ""
                        ]
                    ]
                ),
                'name' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'description' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'difficulty' => array(
                    'type' => 'string'
                ),
                'notes' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'prepTime' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'restTime' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'cookTime' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'bakingTime' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'totalTime' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'recipeYield' => array(
                    'type' => 'string',
                    'default' => '0'
                ),
                'recipeYieldUnit' => array(
                    'type' => 'string',
                    'default' => 'servings'
                ),
                'videoUrl' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'videoIframeUrl' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'calories' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'recipeCuisine' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'image1_1' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'image1_1Id' => array(
                    'type' => 'number'
                ),
                'image3_2' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'image3_2Id' => array(
                    'type' => 'number'
                ),
                'image4_3' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'image4_3Id' => array(
                    'type' => 'number',
                ),
                'image16_9' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'image16_9Id' => array(
                    'type' => 'number',
                ),
                'videoUrl' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'content' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'className' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'align' => array(
                    'type' => 'string',
                    'default' => 'center'
                ),
            ),
            'render_callback' => array($this, 'renderRecipeBlock'),
        ));


        // FAQ

        register_block_type('foodblogkitchen-toolkit/faq', array(
            'editor_script' => 'foodblogkitchen-toolkit-faq-block-editor',
            'editor_style'  => 'foodblogkitchen-toolkit-faq-block-editor',
            'script'        => 'foodblogkitchen-toolkit-faq-block',
            'style'         => 'foodblogkitchen-toolkit-faq-block',
            'attributes' => array(
                'question' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'answer' => array(
                    'type' => 'string',
                    'default' => ''
                ),
            ),
            'render_callback' => array($this, 'renderFAQBlock'),
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

    public static function getStyleBlockTemplate()
    {
        return file_get_contents(plugin_dir_path(__FILE__) . '../src/blocks/block/style-block.hbs');
    }

    public static function getRecipeBlockStylesRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . '../src/blocks/block/style-block.hbs',
            plugin_dir_path(__FILE__) . '../build/recipe-block-styles-renderer.php',
            [
                'encode' => function ($context, $options) {
                    return urlencode($context);
                },
                'shade' => function ($color, $shade, $options) {
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
        return $renderer(array(
            "options" => $options,
            "svgs" => $svgs
        ));
    }

    private static function shadeColor($color, $shade)
    {
        $num = base_convert(substr($color, 1), 16, 10);
        $amt = round(2.55 * $shade);
        $r = ($num >> 16) + $amt;
        $b = ($num >> 8 & 0x00ff) + $amt;
        $g = ($num & 0x0000ff) + $amt;

        return '#' . substr(base_convert(0x1000000 + ($r < 255 ? ($r < 1 ? 0 : $r) : 255) * 0x10000 + ($b < 255 ? ($b < 1 ? 0 : $b) : 255) * 0x100 + ($g < 255 ? ($g < 1 ? 0 : $g) : 255), 10, 16), 1);
    }

    public static function getRecipeBlockRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . '../src/blocks/block/block.hbs',
            plugin_dir_path(__FILE__) . '../build/recipe-block-renderer.php',
            [
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
                'ifOneOfThem' => function ($arg1, $arg2, $options) {
                    if ((isset($arg1) && !empty($arg1)) || (isset($arg2) && !empty($arg2))) {
                        return $options['fn']();
                    } else {
                        return $options['inverse']();
                    }
                },
                'encode' => function ($context, $options) {
                    return urlencode($context);
                },
                'shade' => function ($color, $shade, $options) {
                    return self::shadeColor($color, $shade);
                },
                'ifMoreOrEqual' => function ($arg1, $arg2, $options) {
                    if ($arg1 >= $arg2) {
                        return $options['fn']();
                    } else {
                        return $options['inverse']();
                    }
                },
                'isEven' => function ($conditional, $options) {
                    if ($conditional % 2 === 0) {
                        return $options['fn']();
                    } else {
                        return $options['inverse']();
                    }
                }
            ],
            [
                "styleBlock" =>  plugin_dir_path(__FILE__) . '../src/blocks/block/style-block.hbs'
            ]
        );
    }

    public static function getJumpToRecipeBlockRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . '../src/blocks/jump-to-recipe/template.hbs',
            plugin_dir_path(__FILE__) . '../build/jump-to-recipe-block-renderer.php',
        );
    }

    public static function getFAQBlockRenderer()
    {
        return self::getRenderer(
            plugin_dir_path(__FILE__) . '../src/blocks/faq/template.hbs',
            plugin_dir_path(__FILE__) . '../build/faq-block-renderer.php',
            [
                'toJSON' => function ($context, $options) {
                    return json_encode($context);
                }
            ]
        );
    }

    private static function getRenderer($templatePath, $rendererPath, $handlebarsHelper = [], $handlebarsPartialPaths = [])
    {
        if (!file_exists($rendererPath) || (WP_DEBUG && file_exists($templatePath))) {
            $template = file_get_contents($templatePath);

            $handlebarsPartials = array_map(function ($path) {
                return  file_get_contents($path);
            }, $handlebarsPartialPaths);

            $phpStr = LightnCandy::compile($template, array(
                'flags' => LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_ERROR_EXCEPTION,
                "helpers" => $handlebarsHelper,
                "partials" => $handlebarsPartials
            ));

            // Save the compiled PHP code into a php file
            file_put_contents($rendererPath, '<?php ' . $phpStr . '?>');
        }

        // Get the render function from the php file
        return include($rendererPath);
    }

    public function getDummyData()
    {
        return array(
            "translations" => $this->getRecipeBlockTranslations(),
            "recipeYield" => 2,
            "recipeYieldUnit" => "servings",
            "recipeYieldUnitFormatted" => __("servings", 'foodblogkitchen-toolkit'),
            "difficulty" => __('simple', 'foodblogkitchen-toolkit'),
            'prepTime' => 0,
            'cookTime' => 5,
            'name' => __("Banana shake", 'foodblogkitchen-toolkit'),
            "description" => __("You have bananas left over again and don't know what to do with them? How about a delicious shake?", 'foodblogkitchen-toolkit'),
            'totalTime' => 5,
            "ingredientsGroups" => array(
                array(
                    "title" => "",
                    "items" => array(
                        array(
                            "amount" => 500,
                            "unit" => "ml",
                            "ingredient" => __("milk", 'foodblogkitchen-toolkit')
                        ),
                        array(
                            "amount" => 1,
                            "unit" => "",
                            "ingredient" => __("banana", 'foodblogkitchen-toolkit')
                        ),
                        array(
                            "amount" => 1,
                            "unit" => "TL",
                            "ingredient" => __("sugar", 'foodblogkitchen-toolkit')
                        ),
                        array(
                            "amount" => 0,
                            "unit" => "",
                            "ingredient" => __("cinnamon", 'foodblogkitchen-toolkit')
                        )
                    )
                )
            ),
            "utensils" => '<li>' . join("</li><li>", [
                __("Knife", 'foodblogkitchen-toolkit'),
                __("Blender", 'foodblogkitchen-toolkit'),
            ]) . '</li>',
            "preparationStepsGroups" => array(
                array(
                    "title" => "",
                    "list" => '<li>' . join("</li><li>", [
                        __("Peel banana.", 'foodblogkitchen-toolkit'),
                        __("Put all the ingredients in the blender and mix everything for 30 seconds.", 'foodblogkitchen-toolkit'),
                        __("Pour into a glass and enjoy.", 'foodblogkitchen-toolkit'),
                    ]) . '</li>'
                )
            ),
            "averageRating" => 4.5,
            "thumbnail" => plugins_url('../assets/banana-shake-4_3.png', __FILE__),
            "notes" => __("The milkshake becomes particularly creamy with UHT milk.", 'foodblogkitchen-toolkit'),
            "instagramUsername" => get_option('foodblogkitchen_toolkit__instagram__username', ''),
            "instagramHashtag" => get_option('foodblogkitchen_toolkit__instagram__hashtag', '')

        );
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
            "prepTime" => __('Prep time', 'foodblogkitchen-toolkit'),
            "restTime" => __('Rest time', 'foodblogkitchen-toolkit'),
            "cookTime" => __('Cook time', 'foodblogkitchen-toolkit'),
            "bakingTime" => __('Baking time', 'foodblogkitchen-toolkit'),
            "totalTime" => __('Total time', 'foodblogkitchen-toolkit'),
            "yield" => __('yields', 'foodblogkitchen-toolkit'),
            "ingredients" => __('Ingredients', 'foodblogkitchen-toolkit'),
            "utensils" => __('Utensils', 'foodblogkitchen-toolkit'),
            "preparationSteps" => __('Steps of preparation', 'foodblogkitchen-toolkit'),
            "print" => __('Print', 'foodblogkitchen-toolkit'),
            "pinIt" => __('Pin it', 'foodblogkitchen-toolkit'),
            "yourRating" => __('Your rating', 'foodblogkitchen-toolkit'),
            "averageRating" => __('Average rating', 'foodblogkitchen-toolkit'),
            "notes" => __('Notes', 'foodblogkitchen-toolkit'),
            "feedback" => __('How do you like the recipe?', 'foodblogkitchen-toolkit'),
            "servings" => __('servings', 'foodblogkitchen-toolkit'),
            "video" => __('Video', 'foodblogkitchen-toolkit'),
            "instagramHeadline" => __('You tried this recipe?', 'foodblogkitchen-toolkit'),
            "instagramThenLink" => __('Then link', 'foodblogkitchen-toolkit'),
            "instagramOnInstagram" => __('on Instagram', 'foodblogkitchen-toolkit'),
            "instagramOrUseHashtag" => __('on Instagram or use the hashtag', 'foodblogkitchen-toolkit'),
        ];
    }

    public function renderRecipeBlock($attributes, $context)
    {
        $attributes['translations'] = $this->getRecipeBlockTranslations();

        $attributes['postId'] = get_the_ID();
        $attributes['ajaxUrl'] = admin_url('admin-ajax.php');
        $attributes['nonce'] =  wp_create_nonce('foodblogkitchen-toolkit');

        $averageRating = get_post_meta(get_the_ID(), 'average_rating', true) ?: 0;
        $ratingCount = get_post_meta(get_the_ID(), 'rating_count', true) ?: 0;

        $attributes['recipeYield'] = isset($attributes['recipeYield']) ? intval($attributes['recipeYield']) : 1;

        $attributes['prepTime'] = floatval($attributes['prepTime']);
        $attributes['restTime'] = floatval($attributes['restTime']);
        $attributes['cookTime'] = floatval($attributes['cookTime']);
        $attributes['bakingTime'] = floatval($attributes['bakingTime']);
        $attributes['totalTime'] = floatval($attributes['totalTime']);

        if (isset($attributes['difficulty']) && !empty($attributes['difficulty'])) {
            $attributes['difficulty'] = __($attributes['difficulty'], 'foodblogkitchen-toolkit');
        }

        switch ($attributes['recipeYieldUnit']) {
            case 'piece':
                $attributes['recipeYieldUnitFormatted'] = __('piece', 'foodblogkitchen-toolkit');
                break;
            case 'springform-pan':
                $attributes['recipeYieldUnitFormatted'] = __('cm springform pan', 'foodblogkitchen-toolkit');
                break;
            case 'servings':
            default:
                $attributes['recipeYieldUnitFormatted'] = __('servings', 'foodblogkitchen-toolkit');
                break;
        }

        // In version 1.4.0 I added the possibility to split ingredient lists
        // So we have to migrate the old list (ingredients) to the new structure
        // of ingredientsGroups.

        if (isset($attributes['ingredients']) && !empty($attributes['ingredients'])) {
            $attributes['ingredientsGroups'] = [
                [
                    "title" => "",
                    "list" => $attributes['ingredients']
                ]
            ];
            unset($attributes["ingredients"]);
        }

        // In version 1.5.0 I added the possibility to split preparation step lists
        // So we have to migrate the old list (preparationSteps) to the new structure
        // of preparationStepsGroups.

        if (isset($attributes['preparationSteps']) && !empty($attributes['preparationSteps'])) {
            $attributes['preparationStepsGroups'] = [
                [
                    "title" => "",
                    "list" => $attributes['preparationSteps']
                ]
            ];
            unset($attributes["preparationSteps"]);
        }

        $attributes['ingredientsGroups'] = $this->prepareIngredientsForRenderer($attributes['ingredientsGroups']);

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
            "recipeIngredient" => $this->prepareIngredientsForJsonLd($attributes['ingredientsGroups']),
            "recipeInstructions" => $this->preparePreparationStepsForJsonLd($attributes['preparationStepsGroups']),
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

        // Instagram-CTA
        $attributes['instagramUsername'] = get_option('foodblogkitchen_toolkit__instagram__username', '');
        $attributes['instagramHashtag'] = get_option('foodblogkitchen_toolkit__instagram__hashtag', '');

        $renderer = self::getRecipeBlockRenderer();
        return $renderer($attributes);
    }

    private function prepareIngredientsForRenderer($ingredientsGroups)
    {
        return array_map(function ($group) {
            $group['items'] = $this->extractIngredients($group['list']);
            return $group;
        }, $ingredientsGroups);
    }

    private function prepareIngredientsForJsonLd($ingredientsGroups)
    {
        // In JSON LD the ingredients must be a flat array
        $flatIngredients = [];

        foreach ($ingredientsGroups as $group) {
            if (isset($group['items']) && count($group['items']) > 0) {
                foreach ($group['items'] as $item) {
                    $flatIngredients[] = trim((isset($item['amount']) ? $item['amount'] : '') . ' ' . (isset($item['unit']) ? $item['unit'] : '') . ' ' . (isset($item['ingredient']) ? strip_tags($item['ingredient']) : ''));
                }
            }
        }

        return $flatIngredients;
    }

    private function preparePreparationStepsForJsonLd($preparationStepsGroup)
    {
        if (!isset($preparationStepsGroup)) {
            return '';
        }

        // In JSON LD the preparation steps groups must be a flat array
        $flat = [];

        foreach ($preparationStepsGroup as $group) {
            if (isset($group['list'])) {
                $itemsList = array_map(function ($item) {
                    return [
                        "@type" => "HowToStep",
                        "text" => strip_tags($item)
                    ];
                }, explode('\n', str_replace('li><li', 'li>\n<li', $group['list'])));

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
        $attributes['translations'] = array(
            "jumpToRecipe" => __('Jump to recipe', 'foodblogkitchen-toolkit')
        );
        $attributes['options'] = $this->getStyleOptions();
        return $renderer($attributes);
    }

    public function renderFAQBlock($attributes, $context)
    {
        $renderer = self::getFAQBlockRenderer();
        return $renderer($attributes);
    }

    private function getStyleOptions()
    {
        return array(
            "primaryColor" => get_option('foodblogkitchen_toolkit__primary_color', $this->primaryColorDefault),
            "primaryColorContrast" => get_option('foodblogkitchen_toolkit__primary_color_contrast', $this->primaryColorContrastDefault),
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
            "starHalfFilled" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="url(#half_grad)" stroke="' . $colors['primaryColor'] . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="half_grad"><stop offset="50%" stop-color="' . $colors['primaryColor'] . '"/><stop offset="50%" stop-color="transparent" stop-opacity="1" /></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'),
            "starHighlighted" => $this->base64EncodeImage('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' . $colors['primaryColorDark'] . '" stroke="' . $colors['primaryColorDark'] . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'),
            "instagram" => $this->base64EncodeImage('<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="' . $colors['primaryColorContrast'] . '"> <title>IG Logo</title><g fill-rule="evenodd"><path d="M18 0c-4.889 0-5.501.02-7.421.108C8.663.196 7.354.5 6.209.945a8.823 8.823 0 0 0-3.188 2.076A8.83 8.83 0 0 0 .945 6.209C.5 7.354.195 8.663.108 10.58.021 12.499 0 13.11 0 18s.02 5.501.108 7.421c.088 1.916.392 3.225.837 4.37a8.823 8.823 0 0 0 2.076 3.188c1 1 2.005 1.616 3.188 2.076 1.145.445 2.454.75 4.37.837 1.92.087 2.532.108 7.421.108s5.501-.02 7.421-.108c1.916-.088 3.225-.392 4.37-.837a8.824 8.824 0 0 0 3.188-2.076c1-1 1.616-2.005 2.076-3.188.445-1.145.75-2.454.837-4.37.087-1.92.108-2.532.108-7.421s-.02-5.501-.108-7.421c-.088-1.916-.392-3.225-.837-4.37a8.824 8.824 0 0 0-2.076-3.188A8.83 8.83 0 0 0 29.791.945C28.646.5 27.337.195 25.42.108 23.501.021 22.89 0 18 0zm0 3.243c4.806 0 5.376.019 7.274.105 1.755.08 2.708.373 3.342.62.84.326 1.44.717 2.07 1.346.63.63 1.02 1.23 1.346 2.07.247.634.54 1.587.62 3.342.086 1.898.105 2.468.105 7.274s-.019 5.376-.105 7.274c-.08 1.755-.373 2.708-.62 3.342a5.576 5.576 0 0 1-1.346 2.07c-.63.63-1.23 1.02-2.07 1.346-.634.247-1.587.54-3.342.62-1.898.086-2.467.105-7.274.105s-5.376-.019-7.274-.105c-1.755-.08-2.708-.373-3.342-.62a5.576 5.576 0 0 1-2.07-1.346 5.577 5.577 0 0 1-1.346-2.07c-.247-.634-.54-1.587-.62-3.342-.086-1.898-.105-2.468-.105-7.274s.019-5.376.105-7.274c.08-1.755.373-2.708.62-3.342.326-.84.717-1.44 1.346-2.07.63-.63 1.23-1.02 2.07-1.346.634-.247 1.587-.54 3.342-.62 1.898-.086 2.468-.105 7.274-.105z"/><path d="M18 24.006a6.006 6.006 0 1 1 0-12.012 6.006 6.006 0 0 1 0 12.012zm0-15.258a9.252 9.252 0 1 0 0 18.504 9.252 9.252 0 0 0 0-18.504zm11.944-.168a2.187 2.187 0 1 1-4.374 0 2.187 2.187 0 0 1 4.374 0"/></g></svg>'),
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

    public static function registerLicense($licenseKey)
    {

        // API query parameters
        $api_params = array(
            'slm_action' => 'slm_activate',
            'secret_key' => self::$licenseSecretKey,
            'license_key' => $licenseKey,
            'registered_domain' => $_SERVER['SERVER_NAME'],
            'item_reference' => urlencode(FoodblogkitchenToolkit::$licenseProductName),
        );

        // Send query to the license manager server
        $query = esc_url_raw(add_query_arg($api_params, FoodblogkitchenToolkit::$licenseServer));
        $response = wp_remote_get($query, array('timeout' => 20, 'sslverify' => false));

        // Check for error in the response
        if (is_wp_error($response)) {
            return array(
                "status" => "error",
                "message" => __("There was an error while activating the license. Please try again later.", 'foodblogkitchen-toolkit')
            );
        }

        // License data.
        $license_data = json_decode(wp_remote_retrieve_body($response));

        if ($license_data->result == 'success') {
            //Success was returned for the license activation
            //Save the license key in the options table
            update_option('foodblogkitchen_toolkit__license_key', $licenseKey);

            return array(
                "status" => "success",
                "message" => __("Your license has been successfully activated. You can now use the recipe block in the editor.", 'foodblogkitchen-toolkit')
            );
        ?>
<?php
        } else {
            //Show error to the user. Probably entered incorrect license key.

            return array(
                "status" => "error",
                "message" => __("There was an error while activating the license. Please check your input. If you can't find an error, please contact our support.", 'foodblogkitchen-toolkit')
                    . ((isset($license_data->message) && !empty($license_data->message)) ? $license_data->message : '')

            );
        }
    }

    public static function unregisterLicense()
    {
        $licenseKey = get_option('foodblogkitchen_toolkit__license_key', '');

        if (!empty($licenseKey)) {

            // API query parameters
            $api_params = array(
                'slm_action' => 'slm_deactivate',
                'secret_key' => FoodblogkitchenToolkit::$licenseSecretKey,
                'license_key' => $licenseKey,
                'registered_domain' => $_SERVER['SERVER_NAME'],
                'item_reference' => urlencode(FoodblogkitchenToolkit::$licenseProductName),
            );

            // Send query to the license manager server
            $query = esc_url_raw(add_query_arg($api_params, FoodblogkitchenToolkit::$licenseServer));
            $response = wp_remote_get($query, array('timeout' => 20, 'sslverify' => false));

            // Check for error in the response
            if (is_wp_error($response)) {
                return array(
                    "status" => "error",
                    "message" => __("There was an error while deactivating the license. Please try again later.", 'foodblogkitchen-toolkit')
                );
            } else {
                // License data.
                $license_data = json_decode(wp_remote_retrieve_body($response));

                if ($license_data->result == 'success') {
                    //Success was returned for the license activation
                    //Remove the license key from the options table.
                    delete_option('foodblogkitchen_toolkit__license_key');

                    return array(
                        "status" => "success",
                        "message" => __("The license has been successfully deactivated.", 'foodblogkitchen-toolkit')
                    );
                } else {
                    if (isset($license_data->error_code) && $license_data->error_code === 80) {
                        delete_option('foodblogkitchen_toolkit__license_key');
                    }

                    //Show error to the user. Probably entered incorrect license key.

                    return array(
                        "status" => "error",
                        "message" => __("There was an error while deactivating the license.", 'foodblogkitchen-toolkit') . $license_data->message
                    );
                }
            }
        }
    }
}
