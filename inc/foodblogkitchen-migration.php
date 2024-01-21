<?php

if (!defined("ABSPATH")) {
    die();
}

require __DIR__ . "/../vendor/autoload.php";

class FoodblogkitchenMigration
{
    private $blocksToMigrate = [
        "foodblogkitchen-recipes/block" => "recipe-creator/recipe",
        "foodblogkitchen-recipes/jump-to-recipe" => "recipe-creator/jump-to-recipe"
    ];

    private $metadataToMigrate = [
        'foodblogkitchen_pinterest_image_id' => 'recipe_creator_image_id',
        'foodblogkitchen_pinterest_image_url' => 'recipe_creator_image_url',
    ];

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

        if ((int)get_transient('recipe_creator__migration_pending_faq_blocks') > 0) {
            add_action('admin_notices', [$this, 'showPendingFaqBlocksWarning']);
        }

        if ((int)get_transient('recipe_creator__migration_pending_recipe_blocks') > 0) {
            add_action('admin_notices', [$this, 'showPendingRecipeBlocksWarning']);
        }

        if ((int)get_transient('recipe_creator__migration_pending_faq_blocks') > 0 || (int)get_transient('recipe_creator__migration_pending_recipe_blocks') > 0) {
            add_action('save_post', [$this, "deleteTransientsOnPostSave"]);
        }

        if (
            is_plugin_active('foodblogkitchen-toolkit/foodblogkitchen-toolkit.php') &&
            (int)get_transient('recipe_creator__migration_pending_faq_blocks') === 0 &&
            (int)get_transient('recipe_creator__migration_pending_recipe_blocks') === 0
        ) {
            $this->uninstallFoodblogToolkit();

            update_option('recipe_creator__migration_done', true);
        }
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

    public function showPendingRecipeBlocksWarning()
    {
        ?>
        <div class="notice notice-warning is-dismissible">
            <p><?php
                echo sprintf(
                    __(
                        'You updated from the Foodblog-Toolkit to the Recipe Creator. This means that some blocks have to be migrated automatically. <a href="%s">Start migration</a>',
                        "recipe-creator"
                    ),
                    esc_url($this->getStartMigrationUrl())
                ); ?></p>
        </div>
<?php
    }

    private function getPostIdsWithBlock($blockName)
    {
        $postIds = [];

        $postTypes = $this->getPostTypes();
        foreach ($postTypes as $postType) {
            $posts =  $this->getPostsWithBlockName($postType, $blockName);
            foreach ($posts as $post) {
                array_push($postIds, $post->ID);
            }
        }

        return $postIds;
    }

    private function uninstallFoodblogToolkit()
    {
        deactivate_plugins('foodblogkitchen-toolkit/foodblogkitchen-toolkit.php');
        uninstall_plugin('foodblogkitchen-toolkit/foodblogkitchen-toolkit.php');
    }

    public function getPage()
    {
        if (isset($_GET['migrate']) && $_GET['migrate'] === 'true') {
            $this->runMigration();
        } else {
            $this->showMigrationCandidates();
        }
    }

    private function showMigrationCandidates()
    {
        $this->getAffectedBlocksList();
        $this->getAffectedMetadata();
        $this->getAffectedSettings();
        $this->getAffectedOptions();
        $this->renderSubmitButton();
    }

    private function runMigration()
    {
        $this->migrateBlocks();
        $this->migrateMetadatas();
        $this->migrateSettings();
        $this->migrateOptions();
    }

    private function renderSubmitButton()
    {
        $url = $this->getStartMigrationUrl();
        echo '<a href="' . $url . '" class="button button-primary">Migrate now</a>';
    }

    private function getStartMigrationUrl()
    {
        return add_query_arg('migrate', 'true', admin_url('admin.php?page=recipe_creator_migrations'));
    }

    private function getAffectedBlocksList()
    {
        $postTypes = $this->getPostTypes();

        echo '<h2>Blocks to migrate</h2>';
        echo '<ul>';

        foreach ($postTypes as $postType) {
            foreach ($this->blocksToMigrate as $oldBlockName => $newBlockName) {
                $affectedPosts = $this->getPostsWithBlockName($postType, $oldBlockName);
                echo '<li>' . count($affectedPosts) . ' outdated ' . $oldBlockName . ' blocks in ' . $postType . '</li>';
            }
        }

        echo '</ul>';
    }

    private function getAffectedMetadata()
    {
        $postTypes = $this->getPostTypes();

        echo '<h2>Metadata to migrate</h2>';
        echo '<ul>';

        foreach ($postTypes as $postType) {
            foreach ($this->metadataToMigrate as $oldMetadata => $newMetadata) {
                $affectedPosts = $this->getPostsWithMetadata($postType, $oldMetadata);
                echo '<li>' . count($affectedPosts) . ' outdated ' . $oldMetadata . ' metadata in ' . $postType . '</li>';
            }
        }

        echo '</ul>';
    }

    private function getAffectedSettings()
    {
        echo '<h2>Settings to migrate</h2>';
        echo '<ul>';

        foreach ($this->settingsToMigrate as $oldSettingName => $newSettingName) {
            $oldSettingValue = get_option($oldSettingName);
            echo '<li>Migrate ' . $oldSettingName . ' to  ' . $newSettingName . ': ' . $oldSettingValue . '</li>';
        }

        echo '</ul>';
    }

    private function getAffectedOptions()
    {
        echo '<h2>Options to migrate</h2>';
        echo '<ul>';

        foreach ($this->optionsToMigrate as $oldOptionName => $newOptionName) {
            $oldValue = get_option($oldOptionName);
            echo '<li>Migrate ' . $oldOptionName . ' to  ' . $newOptionName . ': ' . $oldValue . '</li>';
        }

        echo '</ul>';
    }

    private function getPostsWithBlockName($postType, $blockName)
    {
        $args = array(
            'post_type' => $postType,
            'posts_per_page' => -1,
            's' => $blockName,
            'post_status' => 'any'
        );

        return  get_posts($args);
    }

    private function getPostsWithMetadata($postType, $metadata)
    {
        $args = array(
            'post_type' => $postType,
            'posts_per_page' => -1,
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


    private function getPostTypes()
    {
        return get_post_types(array('public' => true));
    }

    private function migrateBlocks()
    {
        foreach ($this->blocksToMigrate as $oldBlockName => $newBlockName) {
            $this->migrateBlock($oldBlockName, $newBlockName);
        }
    }

    private function migrateBlock($oldBlockName, $newBlockName)
    {
        $postTypes = $this->getPostTypes();
        $counter = 0;

        foreach ($postTypes as $postType) {
            $posts = $this->getPostsWithBlockName($postType, $oldBlockName);

            foreach ($posts as $post) {
                $content = $post->post_content;
                $post->post_content = str_replace($oldBlockName, $newBlockName, $content);

                wp_update_post($post);

                $counter++;
            }
        }

        echo '<p>Migrated ' . $counter . ' posts from ' . $oldBlockName . ' to ' . $newBlockName . '</p>';
    }

    private function migrateMetadatas()
    {
        foreach ($this->metadataToMigrate as $oldMetadata => $newMetadata) {
            $this->migrateMetadata($oldMetadata, $newMetadata);
        }
    }

    private function migrateMetadata($oldMetadata, $newMetadata)
    {
        $postTypes = $this->getPostTypes();
        $counter = 0;

        foreach ($postTypes as $postType) {
            $posts = $this->getPostsWithMetadata($postType, $oldMetadata);

            foreach ($posts as $post) {
                $oldValue = get_post_meta($post->id, $oldMetadata);
                update_post_meta($post->id, $newMetadata, $oldValue);
                $counter++;
            }
        }

        echo '<p>Migrated ' . $counter . ' posts metadata (' . $oldMetadata . ')</p>';
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
        $value = get_option($oldOptionName);
        update_option($newOptionName, $value);
        echo '<p>Migrate ' . $oldOptionName . ' to  ' . $newOptionName . '.</p>';
    }
}
