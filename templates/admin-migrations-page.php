<div class="wrap recipe-creator--migrations">
    <h1><?php echo get_admin_page_title(); ?></h1>

    <div class="notice notice-success" style="display: none">
        <p>All migrations have been successfully completed. You can now deactivate and uninstall the Foodblog Toolkit.</p>
    </div>

    <div>
        <li style="display: flex; gap: 4px">
            We will upgrade <span class="total" data-key="recipe_block"><?= count($this->getPostIdsWithBlock('foodblogkitchen-recipes/block')); ?></span> posts with recipe blocks.
            <span class="spinner" data-key="recipe_block" style="float: none; margin: 0;"></span>
            <span class="dashicons dashicons-yes" data-key="recipe_block" style="display: none"></span>
            <span class="state-text" data-key="recipe_block"></span>
        </li>
        <li style="display: flex; gap: 4px">
            We will upgrade <span class="total" data-key="jump_to_recipe_block"><?= count($this->getPostIdsWithBlock('foodblogkitchen-recipes/jump-to-recipe')); ?></span> posts with jump to recipe blocks.
            <span class="spinner" data-key="jump_to_recipe_block" style="float: none; margin: 0;"></span>
            <span class="dashicons dashicons-yes" data-key="jump_to_recipe_block" style="display: none"></span>
            <span class="state-text" data-key="jump_to_recipe_block"></span>
        </li>
        <li style="display: flex; gap: 4px">
            We will upgrade <span class="total" data-key="pinterest_image_id"><?= count($this->getPostIdsWithMetadata('foodblogkitchen_pinterest_image_id')); ?></span> posts with metadata (pinterest_image_id).
            <span class="spinner" data-key="pinterest_image_id" style="float: none; margin: 0;"></span>
            <span class="dashicons dashicons-yes" data-key="pinterest_image_id" style="display: none"></span>
            <span class="state-text" data-key="pinterest_image_id"></span>
        </li>
        <li style="display: flex; gap: 4px">
            We will upgrade <span class="total" data-key="pinterest_image_url"><?= count($this->getPostIdsWithMetadata('foodblogkitchen_pinterest_image_url')); ?></span> posts with metadata (pinterest_image_url).
            <span class="spinner" data-key="pinterest_image_url" style="float: none; margin: 0;"></span>
            <span class="dashicons dashicons-yes" data-key="pinterest_image_url" style="display: none"></span>
            <span class="state-text" data-key="pinterest_image_url"></span>
        </li>
    </div>

    <button id="recipe-creator--start-migration-button" class="button button-primary">Start migration</button>

    <script>
        (() => {
            var button = document.querySelector('#recipe-creator--start-migration-button');
            var migratedPosts = 0;

            async function doMigration(url, key) {
                const total = +document.querySelector('.total[data-key="' + key + '"]').innerText.trim();

                updateStateIndicator(key, true, '0 / ' + total);

                let totalMigratedPosts = 0;
                let migratedPosts = 0;

                do {
                    migratedPosts = await migrateNextChunk(url, key);
                    totalMigratedPosts += migratedPosts;
                    updateStateIndicator(key, true, `${totalMigratedPosts} / ${total}`);
                } while (totalMigratedPosts <= total && migratedPosts > 0);

                updateStateIndicator(key, false);
            }

            function migrateNextChunk(url, key) {
                return new Promise((resolve, reject) => {

                    jQuery.ajax({
                        type: 'POST',
                        url: url,
                        headers: {
                            'X-WP-Nonce': "<?= wp_create_nonce('wp_rest'); ?>"
                        },
                        dataType: 'json',
                        success: function(response) {
                            return resolve(+response.migratedPosts || 0);
                        },
                        error: function(error) {
                            console.error('Error: ', error);
                            return reject();
                        }
                    });
                });
            }

            function updateStateIndicator(key, inProgress = false, message = '') {
                console.log('updateStateIndicator', key, inProgress, message);

                const progressIndicator = document.querySelector('.spinner[data-key="' + key + '"]');
                const checkmark = document.querySelector('.dashicons-yes[data-key="' + key + '"]');

                if (inProgress) {
                    progressIndicator.classList.add('is-active');
                    progressIndicator.style.display = 'inline';
                } else {
                    progressIndicator.classList.remove('is-active');
                    progressIndicator.style.display = 'none';
                    checkmark.style.display = 'inline';
                }

                const stateText = document.querySelector('.state-text[data-key="' + key + '"]');
                stateText.innerText = message;
            }

            button.addEventListener('click', async () => {
                button.setAttribute("disabled", true);

                await doMigration("<?= rest_url("recipe-creator/v1/migrate-recipe-blocks") ?>", "recipe_block");
                await doMigration("<?= rest_url("recipe-creator/v1/migrate-jump-to-recipe-blocks") ?>", "jump_to_recipe_block");
                await doMigration("<?= rest_url("recipe-creator/v1/migrate-metadata-pinterest-image-id") ?>", "pinterest_image_id");
                await doMigration("<?= rest_url("recipe-creator/v1/migrate-metadata-pinterest-image-url") ?>", "pinterest_image_url");

                document.querySelector('.notice-success').style.display = 'block';
            });
        })();
    </script>
</div>