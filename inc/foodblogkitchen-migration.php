<?php

if (!defined("ABSPATH")) {
    die();
}

require __DIR__ . "/../vendor/autoload.php";

class FoodblogkitchenMigration
{
    private $chunkSize = 1;

    private $settingsToMigrate = [
        'foodblogkitchen_toolkit__primary_color' => 'recipe_creator__primary_color',
        'foodblogkitchen_toolkit__primary_color_contrast' => 'recipe_creator__primary_color_contrast',
        'foodblogkitchen_toolkit__primary_color_light' => 'recipe_creator__primary_color_light',
        'foodblogkitchen_toolkit__primary_color_light_contrast' => 'recipe_creator__primary_color_light_contrast',
        'foodblogkitchen_toolkit__primary_color_dark' => 'recipe_creator__primary_color_dark',
        'foodblogkitchen_toolkit__secondary_color' => 'recipe_creator__secondary_color',
        'foodblogkitchen_toolkit__secondary_color_contrast' => 'recipe_creator__secondary_color_contrast',
        'foodblogkitchen_toolkit__background_color' => 'recipe_creator__background_color',
        'foodblogkitchen_toolkit__background_color_contrast' => 'recipe_creator__background_color_contrast',
        'foodblogkitchen_toolkit__show_box_shadow' => 'recipe_creator__show_box_shadow',
        'foodblogkitchen_toolkit__show_border' => 'recipe_creator__show_border',
        'foodblogkitchen_toolkit__border_radius' => 'recipe_creator__border_radius',
        'foodblogkitchen_toolkit__thumbnail_size' => 'recipe_creator__thumbnail_size',
        'foodblogkitchen_toolkit__show_jump_to_recipe' => 'recipe_creator__show_jump_to_recipe',
        'foodblogkitchen_toolkit__instagram__username' => 'recipe_creator__instagram__username',
        'foodblogkitchen_toolkit__instagram__hashtag' => 'recipe_creator__instagram__hashtag',
    ];

    private $optionsToMigrate = [
        'foodblogkitchen_toolkit__license_key' => 'recipe_creator_pro__license_key',
    ];

    function __construct()
    {
        add_action("admin_init", [$this, "checkMigrationState"]);
        add_action("recipe_creator__pages_registered", [$this, "registerMigrationPage"]);
        add_action('rest_api_init', [$this, "registerMigrationApi"]);
    }

    public function registerMigrationApi()
    {
        register_rest_route('recipe-creator/v1', '/migrate-recipe-blocks/', [
            'methods'   => 'POST',
            'callback'  => [$this, 'chunkMigrateRecipeBlocks'],
            'permission_callback'   => function () {
                return current_user_can('edit_posts') && current_user_can('deactivate_plugins');
            }
        ]);

        register_rest_route('recipe-creator/v1', '/migrate-jump-to-recipe-blocks/', [
            'methods'   => 'POST',
            'callback'  => [$this, 'chunkMigrateJumpToRecipeBlocks'],
            'permission_callback'   => function () {
                return current_user_can('edit_posts') && current_user_can('deactivate_plugins');
            }
        ]);

        register_rest_route('recipe-creator/v1', '/migrate-metadata-pinterest-image-id/', [
            'methods'   => 'POST',
            'callback'  => [$this, 'chunkMigrateMetadataPinterestImageId'],
            'permission_callback'   => function () {
                return current_user_can('edit_posts') && current_user_can('deactivate_plugins');
            }
        ]);

        register_rest_route('recipe-creator/v1', '/migrate-metadata-pinterest-image-url/', [
            'methods'   => 'POST',
            'callback'  => [$this, 'chunkMigrateMetadataPinterestImageUrl'],
            'permission_callback'   => function () {
                return current_user_can('edit_posts') && current_user_can('deactivate_plugins');
            }
        ]);
    }

    public function chunkMigrateRecipeBlocks()
    {
        $migratedPosts = $this->migrateBlock('foodblogkitchen-recipes/block', 'recipe-creator/recipe', $this->chunkSize);
        
        return [
            "migratedPosts" => $migratedPosts,
        ];
    }

    public function chunkMigrateJumpToRecipeBlocks()
    {
        $migratedPosts = $this->migrateBlock('foodblogkitchen-recipes/jump-to-recipe', 'recipe-creator/jump-to-recipe', $this->chunkSize);

        return [
            "migratedPosts" => $migratedPosts,
        ];
    }

    public function chunkMigrateMetadataPinterestImageId()
    {
        $migratedPosts = $this->migrateMetadata('foodblogkitchen_pinterest_image_id', 'recipe_creator_image_id', $this->chunkSize);

        return [
            "migratedPosts" => $migratedPosts,
        ];
    }

    public function chunkMigrateMetadataPinterestImageUrl()
    {
        $migratedPosts = $this->migrateMetadata('foodblogkitchen_pinterest_image_url', 'recipe_creator_image_url', $this->chunkSize);

        return [
            "migratedPosts" => $migratedPosts,
        ];
    }

    public function checkMigrationState()
    {
        if (get_option('recipe_creator__migration_done', false) === true) {
            return;
        }

        if (get_transient('recipe_creator__migration_pending_faq_blocks') === false) {
            $postIds = $this->getPostIdsWithBlock('foodblogkitchen-recipes/faq');
            set_transient('recipe_creator__migration_pending_faq_blocks', count($postIds), 24 * HOUR_IN_SECONDS);
        }

        if (get_transient('recipe_creator__migration_pending_recipe_blocks') === false) {
            $postIds = $this->getPostIdsWithBlock('foodblogkitchen-recipes/block');
            set_transient('recipe_creator__migration_pending_recipe_blocks', count($postIds), 24 * HOUR_IN_SECONDS);
        }

        if (get_transient('recipe_creator__migration_pending_jump_to_recipe_blocks') === false) {
            $postIds = $this->getPostIdsWithBlock('foodblogkitchen-recipes/jump-to-recipe');
            set_transient('recipe_creator__migration_pending_jump_to_recipe_blocks', count($postIds), 24 * HOUR_IN_SECONDS);
        }

        if (get_transient('recipe_creator__migration_pending_pinterest_image_id_posts') === false) {
            $postIds = $this->getPostIdsWithMetadata('foodblogkitchen_pinterest_image_id');
            set_transient('recipe_creator__migration_pending_pinterest_image_id_posts', count($postIds), 24 * HOUR_IN_SECONDS);
        }

        if (get_transient('recipe_creator__migration_pending_pinterest_image_url_posts') === false) {
            $postIds = $this->getPostIdsWithMetadata('foodblogkitchen_pinterest_image_url');
            set_transient('recipe_creator__migration_pending_pinterest_image_url_posts', count($postIds), 24 * HOUR_IN_SECONDS);
        }

        if ((int)get_transient('recipe_creator__migration_pending_faq_blocks') > 0) {
            add_action('admin_notices', [$this, 'showPendingFaqBlocksWarning']);
        }

        if (
            (!isset($_GET['page']) || $_GET['page'] !== 'recipe_creator_migrations') &&
            (

                (int)get_transient('recipe_creator__migration_pending_recipe_blocks') > 0 ||
                (int)get_transient('recipe_creator__migration_pending_jump_to_recipe_blocks') > 0 ||
                (int)get_transient('recipe_creator__migration_pending_pinterest_image_url_posts') > 0 ||
                (int)get_transient('recipe_creator__migration_pending_pinterest_image_id_posts') > 0
            )
        ) {
            add_action('admin_notices', [$this, 'showPendingMigrationHint']);
        }

        if (
            (int)get_transient('recipe_creator__migration_pending_faq_blocks') > 0 ||
            (int)get_transient('recipe_creator__migration_pending_recipe_blocks') > 0
        ) {
            add_action('save_post', [$this, "deleteTransientsOnPostSave"]);
        }

        if (
            is_plugin_active('foodblogkitchen-toolkit/foodblogkitchen-toolkit.php') &&
            (int)get_transient('recipe_creator__migration_pending_faq_blocks') === 0 &&
            (int)get_transient('recipe_creator__migration_pending_recipe_blocks') === 0 &&
            (int)get_transient('recipe_creator__migration_pending_pinterest_image_url_posts') === 0 &&
            (int)get_transient('recipe_creator__migration_pending_pinterest_image_id_posts') === 0 &&
            get_option('recipe_creator__options_migrated', false) === true
        ) {
            $this->uninstallFoodblogToolkit();

            update_option('recipe_creator__migration_done', true);
        }
    }

    public function registerMigrationPage()
    {
        add_submenu_page(
            "recipe_creator",
            __("Migrations", "recipe-creator"),
            __("Migrations", "recipe-creator"),
            "manage_options",
            "recipe_creator_migrations",
            function () {
                return require_once plugin_dir_path(__FILE__) . "../templates/admin-migrations-page.php";
            },
            100
        );
    }

    public function deleteTransientsOnPostSave($post_id)
    {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        delete_transient('recipe_creator__migration_pending_faq_blocks');
        delete_transient('recipe_creator__migration_pending_recipe_blocks');
    }

    public function showPendingFaqBlocksWarning()
    {
        $postIds = $this->getPostIdsWithBlock('foodblogkitchen-recipes/faq');

        if (count($postIds) > 0) {
?>
            <div class="notice notice-warning is-dismissible">
                <p>
                    <?php echo sprintf(
                        __(
                            'The following articles still use the FAQ block from the Foodblog-Toolkit, which is removed. Please replace these with another FAQ block, for example <a href="%s" target="_blank">%s</a>: ',
                            "recipe-creator"
                        ),
                        esc_url(
                            get_admin_url(get_current_network_id(), "plugin-install.php?s=faq-block&tab=search&type=term")
                        ),
                        __("FAQ Block von Jordy Meow", "recipe-creator")
                    ); ?></p>
                <ul style="list-style: disc; margin-left: 1em;">
                    <?php foreach ($postIds as $pageId) { ?>
                        <li><a href="<? echo get_edit_post_link($pageId); ?>"><?= get_the_title($pageId); ?></a></li>
                    <?php } ?>
                </ul>
            </div>
        <?php
        }
    }

    public function showPendingMigrationHint()
    {
        ?>
        <div class="notice notice-warning is-dismissible">
            <p><?php
                echo sprintf(
                    __(
                        'You updated from the Foodblog-Toolkit to the Recipe Creator. This means that some blocks and settings have to be migrated automatically. <a href="%s">Go to migration page</a>',
                    ),
                    esc_url($this->getMigrationPageUrl())
                ); ?></p>
        </div>
<?php
    }

    public function getPostIdsWithBlock($blockName, $chunkSize = -1)
    {
        $postIds = [];

        $posts =  $this->getPostsWithBlockName($blockName, $chunkSize);
        foreach ($posts as $post) {
            array_push($postIds, $post->ID);
        }

        return $postIds;
    }

    public function getPostIdsWithMetadata($metadata, $chunkSize = -1)
    {
        $postIds = [];

        $posts =  $this->getPostsWithMetadata($metadata, $chunkSize);
        foreach ($posts as $post) {
            array_push($postIds, $post->ID);
        }

        return $postIds;
    }

    private function uninstallFoodblogToolkit()
    {
        deactivate_plugins('foodblogkitchen-toolkit/foodblogkitchen-toolkit.php');
        uninstall_plugin('foodblogkitchen-toolkit/foodblogkitchen-toolkit.php');
    }

    public function activate()
    {
        $this->migrateSettings();
        $this->migrateOptions();

        update_option('recipe_creator__options_migrated', true);
    }

    private function getMigrationPageUrl()
    {
        return get_admin_url(get_current_network_id(), "admin.php?page=recipe_creator_migrations");
    }

    private function getPostsWithBlockName($blockName, $chunkSize)
    {
        $args = array(
            'post_type' => $this->getPostTypes(),
            'posts_per_page' => $chunkSize,
            's' => $blockName,
            'post_status' => 'any',
            'search_columns' => array('post_content')
        );

        return  get_posts($args);
    }

    private function getPostsWithMetadata($metadata, $chunkSize = -1)
    {
        $args = array(
            'post_type' => $this->getPostTypes(),
            'posts_per_page' => $chunkSize,
            'meta_query' => array(
                array(
                    'key' => $metadata,
                    'compare' => 'EXISTS',
                ),
            ),
            'post_status' => 'any'
        );

        return  get_posts($args);
    }


    public function getPostTypes()
    {
        return ['post', 'page'];
    }

    private function migrateBlock($oldBlockName, $newBlockName, $chunkSize)
    {
        remove_action('save_post', [$this, "deleteTransientsOnPostSave"]);

        $posts = $this->getPostsWithBlockName($oldBlockName, $chunkSize);

        foreach ($posts as $post) {
            $content = $post->post_content;
            $post->post_content = str_replace($oldBlockName, $newBlockName, $content);

            wp_update_post($post, true, false);
        }

        add_action('save_post', [$this, "deleteTransientsOnPostSave"]);

        return count($posts);
    }

    private function migrateMetadata($oldMetadata, $newMetadata, $chunkSize)
    {
        remove_action('save_post', [$this, "deleteTransientsOnPostSave"]);

        $posts = $this->getPostsWithMetadata($oldMetadata, $chunkSize);

        foreach ($posts as $post) {
            $oldValue = get_post_meta($post->ID, $oldMetadata);
            update_post_meta($post->ID, $newMetadata, $oldValue);
            delete_post_meta($post->ID, $oldMetadata);
        }

        add_action('save_post', [$this, "deleteTransientsOnPostSave"]);

        return count($posts);
    }

    private function migrateSettings()
    {
        foreach ($this->settingsToMigrate as $oldSettingName => $newSettingName) {
            $this->migrateOption($oldSettingName, $newSettingName);
        }
    }

    private function migrateOptions()
    {
        foreach ($this->optionsToMigrate as $oldOptionName => $newOptionName) {
            $this->migrateOption($oldOptionName, $newOptionName);
        }
    }

    private function migrateOption($oldOptionName, $newOptionName)
    {
        $value = get_option($oldOptionName, 'NOT_SET');
        if ($value !== 'NOT_SET') {
            update_option($newOptionName, $value);
        }
    }
}
