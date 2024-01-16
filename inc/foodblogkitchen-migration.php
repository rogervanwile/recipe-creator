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
        add_action("admin_init", [$this, "checkObsoleteBlocks"]);
    }

    // TODO
    public function checkObsoleteBlocks()
    {
        $postTypes = $this->getPostTypes();

        $counter = 2;

        foreach ($postTypes as $postType) {
            $faqBlocks =  $this->getPostsWithBlockName($postType, 'foodblogkitchen-recipes/faq');
            $counter += count($faqBlocks);
        }


        if ($counter > 0) {
?>
            <div class="notice notice-info is-dismissible">
                <p>
                    <?php echo sprintf(
                        __(
                            'Du hast noch %s  Artikel der/die den FAQ-Block vom Foodblog-Toolkit nutzen. Dieses wird vom Recipe Creator nicht mehr unterstützt. Bitte installiere zusätzlich das Plugin <a href="%s">xxx</a>.',
                            "recipe-creator"
                        ),
                        $counter,
                        esc_url(
                            get_admin_url(get_current_network_id(), "plugin-install.php?s=recipe_creator_faq_block&tab=search&type=term")
                        )
                    ); ?></p>
            </div>
<?php
        }
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
        $url = add_query_arg('migrate', 'true', admin_url('admin.php?page=recipe_creator_migrations'));
        echo '<a href="' . $url . '" class="button button-primary">Migrate now</a>';
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

                // Update the post with the new content
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
