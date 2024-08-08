<div class="recipe-creator recipe-creator--block recipe-creator--recipe-block <?php if (!empty($attributes['align'])) { ?> align<?php echo esc_attr($attributes['align']); ?><?php } ?>" id="recipe-creator--recipe">
    <section class="recipe-creator--block--inner">
        <div class="recipe-creator--recipe-block--title">
            <?php if (!empty($attributes['name'])) { ?>
                <h2><?php echo esc_html($attributes['name']); ?></h2>
            <?php } ?>
        </div>

        <div class="recipe-creator--recipe-block--intro">
            <?php if (!empty($attributes['averageRating'])) { ?>
                <div class="recipe-creator--recipe-block--rating recipe-creator--recipe-block--rating--small">
                    <ol>
                        <li class="recipe-creator--recipe-block--star selected" data-rating="1"></li>
                        <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 2) { ?>selected<?php } else if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 1.5) { ?>half-selected<?php } ?>" data-rating="2"></li>
                        <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 3) { ?>selected<?php } else if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 2.5) { ?>half-selected<?php } ?>" data-rating="3"></li>
                        <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 4) { ?>selected<?php } else if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 3.5) { ?>half-selected<?php } ?>" data-rating="4"></li>
                        <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 5) { ?>selected<?php } else if (!empty($attributes['averageRating']) && (float)$attributes['averageRating'] >= 4.5) { ?>half-selected<?php } ?>" data-rating="5"></li>
                    </ol>
                </div>
            <?php } ?>

            <?php if (!empty($attributes['description'])) { ?>
                <p><?php echo wp_kses_data($attributes['description']); ?></p>
            <?php } ?>

            <?php if (!empty($attributes['difficulty'])) { ?>
                <span class="recipe-creator--recipe-block--difficulty"><?php echo esc_html($attributes['difficulty']); ?></span>
            <?php } ?>
        </div>

        <?php if (!empty($attributes['thumbnail'])) { ?>
            <div class="recipe-creator--recipe-block--thumbnail" style="background-image: url('<?php echo esc_attr($attributes['thumbnail']); ?>') !important;" title="<?php if (!empty($attributes['name'])) {
                                                                                                                                                                            echo esc_attr($attributes['name']);
                                                                                                                                                                        } ?>"></div>
        <?php } ?>

        <?php if (!empty($attributes['totalTime'])) { ?>
            <section class="recipe-creator--recipe-block--timings">
                <ul>
                    <?php if (!empty($attributes['prepTime'])) { ?>
                        <li>
                            <header><?php echo esc_html(__("Prep time", "recipe-creator")); ?>:</header>
                            <span><?php echo esc_html($this->formatDuration($attributes['prepTime'])); ?></span>
                        </li>
                    <?php } ?>

                    <?php if (!empty($attributes['restTime'])) { ?>
                        <li>
                            <header><?php echo esc_html(__("Rest time", "recipe-creator")); ?>:</header>
                            <span><?php echo esc_html($this->formatDuration($attributes['restTime'])); ?></span>
                        </li>
                    <?php } ?>

                    <?php if (!empty($attributes['cookTime'])) { ?>
                        <li>
                            <header><?php echo esc_html(__("Cook time", "recipe-creator")); ?>:</header>
                            <span><?php echo esc_html($this->formatDuration($attributes['cookTime'])); ?></span>
                        </li>
                    <?php } ?>

                    <?php if (!empty($attributes['bakingTime'])) { ?>
                        <li>
                            <header><?php echo esc_html(__("Baking time", "recipe-creator")); ?>:</header>
                            <span><?php echo esc_html($this->formatDuration($attributes['bakingTime'])); ?></span>
                        </li>
                    <?php } ?>

                    <?php if (!empty($attributes['totalTime'])) { ?>
                        <li>
                            <header><?php echo esc_html(__("Total time", "recipe-creator")); ?>:</header>
                            <span><?php echo esc_html($this->formatDuration($attributes['totalTime'])); ?></span>
                        </li>
                    <?php } ?>
                </ul>
            </section>
        <?php } ?>

        <?php if (!empty($attributes['ingredientsGroups']) && count($attributes['ingredientsGroups']) > 0) { ?>
            <section class="recipe-creator--recipe-block--ingredients">
                <div class="recipe-creator--recipe-block--headline">
                    <h3><?php echo esc_html(__("Ingredients", "recipe-creator")); ?></h3>

                    <?php if (!empty($attributes['recipeYieldFormatted']) && !empty($attributes['recipeYieldUnitFormatted'])) { ?>
                        <div class="recipe-creator--recipe-block--servings-editor">
                            <span disabled="disabled">
                                <span class="recipe-servings"><?php echo esc_html($attributes['recipeYieldFormatted']); ?></span>
                                <?php echo esc_html($attributes['recipeYieldUnitFormatted']); ?>
                            </span>
                        </div>
                    <?php } ?>
                </div>

                <table class="recipe-creator--recipe-block--ingredients-table" <?php if (!empty($attributes['recipeYield'])) { ?>data-recipe-yield="<?php echo esc_attr($attributes['recipeYield']); ?>" <?php } ?> <?php if (!empty($attributes['recipeYieldWidth'])) { ?>data-recipe-yield-width="<?php echo esc_attr($attributes['recipeYieldWidth']); ?>" <?php } ?> <?php if (!empty($attributes['recipeYieldHeight'])) { ?>data-recipe-yield-height="<?php echo esc_attr($attributes['recipeYieldHeight']); ?>" <?php } ?> <?php if (!empty($attributes['recipeYieldUnit'])) { ?>data-recipe-yield-unit="<?php echo esc_attr($attributes['recipeYieldUnit']); ?>" <?php } ?>>
                    <tbody>
                        <?php foreach ($attributes['ingredientsGroups'] as $ingredientsGroup) { ?>
                            <?php if (!empty($ingredientsGroup['title'])) { ?>
                                <tr class="recipe-creator--recipe-block--group-title">
                                    <th colspan="2"><?php echo esc_html($ingredientsGroup['title']); ?></th>
                                </tr>
                            <?php } ?>

                            <?php if (!empty($ingredientsGroup['items']) && count($ingredientsGroup['items']) > 0) { ?>
                                <?php $count = 0; ?>
                                <?php foreach ($ingredientsGroup['items'] as $item) { ?>
                                    <tr class="recipe-creator--recipe-block--ingredients-item">
                                        <td class="recipe-creator--recipe-block--amount" <?php if (!empty($item['amount'])) { ?>data-recipe-amount="<?php echo esc_attr($item['amount']); ?>" <?php } ?> <?php if (!empty($item['format'])) { ?>data-recipe-format="<?php echo esc_attr($item['format']); ?>" <?php } ?> <?php if (!empty($item['unit'])) { ?>data-recipe-unit="<?php echo esc_attr($item['unit']); ?>" <?php } ?>>
                                            <?php if (!empty($item['amount'])) {
                                                echo esc_html($item['amount']);
                                            } ?>
                                            <?php if (!empty($item['unit'])) {
                                                echo esc_html($item['unit']);
                                            } ?>
                                        </td>
                                        <td class="recipe-creator--recipe-block--ingredient">
                                            <?php if (!empty($item['ingredient'])) {
                                                echo wp_kses_data($item['ingredient']);
                                            } ?>
                                    </tr>
                                <?php } ?>
                            <?php } ?>
                        <?php } ?>
                    </tbody>
                </table>
            </section>
        <?php } ?>

        <?php if (!empty($attributes['utensils']) && count($attributes['utensils']) > 0) { ?>
            <section class="recipe-creator--recipe-block--utensils">
                <div class="recipe-creator--recipe-block--headline">
                    <h3><?php echo esc_html(__("Utensils", "recipe-creator")); ?></h3>
                </div>
                <ul>
                    <?php foreach ($attributes['utensils'] as $utensil) { ?>
                        <li><?php echo wp_kses_post($utensil) ?></li>
                    <?php } ?>
                </ul>
            </section>
        <?php } ?>

        <?php if (!empty($attributes['preparationStepsGroups']) && count($attributes['preparationStepsGroups']) > 0) { ?>
            <div class="recipe-creator--recipe-block--preparation-steps">
                <div class="recipe-creator--recipe-block--headline">
                    <h3><?php echo esc_html(__("Steps of preparation", "recipe-creator")); ?></h3>
                </div>


                <?php foreach ($attributes['preparationStepsGroups'] as $preparationStepsGroup) { ?>
                    <?php if (!empty($preparationStepsGroup['title'])) { ?>
                        <h4><?php echo esc_html($preparationStepsGroup['title']); ?></h4>
                    <?php } ?>
                    <?php if (!empty($preparationStepsGroup['list'])) { ?>
                        <ol>
                            <?php foreach ($preparationStepsGroup['list'] as $item) { ?>
                                <li><?php echo wp_kses_post($item) ?></li>
                            <?php } ?>
                        </ol>
                    <?php } ?>
                <?php } ?>
            </div>
        <?php } ?>

        <?php if (!empty($attributes['videoIframeUrl']) && !is_admin()) { ?>
            <section class="recipe-creator--recipe-block--video">
                <header class="recipe-creator--recipe-block--headline">
                    <h3><?php echo esc_html(__("Video", "recipe-creator")); ?></h3>
                </header>
                <div class="recipe-creator--recipe-block--video-wrapper">
                    <iframe src="<?php echo esc_url($attributes['videoIframeUrl']); ?>" frameborder="0" allowfullscreen></iframe>
                </div>
            </section>
        <?php } ?>

        <?php if (!empty($attributes['notes'])) { ?>
            <section class="recipe-creator--recipe-block--notes">
                <header class="recipe-creator--recipe-block--headline">
                    <h3><?php echo esc_html(__("Notes", "recipe-creator")); ?></h3>
                </header>
                <p><?php echo wp_kses_post($attributes['notes']); ?></p>
            </section>
        <?php } ?>

        <section class="recipe-creator--recipe-block--user-rating">
            <header class="recipe-creator--recipe-block--headline">
                <h3><?php echo esc_html(__("How do you like the recipe?", "recipe-creator")); ?></h3>
            </header>
            <div class="recipe-creator--recipe-block--rating recipe-creator--recipe-block--interactive" data-post-id="<?php echo esc_attr(get_the_ID()); ?>" <?php if (!empty($attributes['ajaxUrl'])) { ?>data-save-url="<?php echo esc_url($attributes['ajaxUrl']); ?>" <?php } ?> <?php if (!empty($attributes['nonce'])) { ?>data-nonce="<?php echo esc_attr($attributes['nonce']); ?>"><?php } ?>>
                <ol>
                    <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['userRating'])) { ?>selected<?php } ?>" data-rating="1">1</li>
                    <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 2) { ?> selected<?php } else if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 1.5) { ?> half-selected<?php } ?>" data-rating="2">2</li>
                    <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 3) { ?> selected<?php } else if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 2.5) { ?> half-selected<?php } ?>" data-rating="3">3</li>
                    <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 4) { ?> selected<?php } else if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 3.5) { ?> half-selected<?php } ?>" data-rating="4">4</li>
                    <li class="recipe-creator--recipe-block--star <?php if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 5) { ?> selected<?php } else if (!empty($attributes['userRating']) && (float)$attributes['userRating'] >= 4.5) { ?> half-selected<?php } ?>" data-rating="5">5</li>
                </ol>
            </div>
        </section>

        <section class="recipe-creator--recipe-block--save-and-share">
            <ul class="recipe-creator--recipe-block--share-buttons">
                <?php if (!empty($attributes['pinterestPinItUrl'])) { ?>
                    <li>
                        <a href="<?php echo esc_url($attributes['pinterestPinItUrl']); ?>" target="_blank" class="recipe-creator--recipe-block--share-on-pinterest"><?php echo esc_html(__("Pin it", "recipe-creator")); ?></a>
                    </li>
                <?php } ?>
            </ul>
        </section>

        <?php if (!empty($attributes['instagramUsername']) || !empty($attributes['instagramHashtag'])) { ?>
            <section class="recipe-creator--recipe-block--call-to-action">
                <div class="recipe-creator--recipe-block--call-to-action--icon"></div>
                <div class="recipe-creator--recipe-block--call-to-action--text">
                    <h3><?php echo esc_html(__("You tried this recipe?", "recipe-creator")); ?></h3>
                    <?php if (!empty($attributes['instagramUsername'])) { ?>
                        <?php if (!empty($attributes['instagramHashtag'])) { ?>
                            <p>
                                <?php echo esc_html(__("Then link", "recipe-creator")); ?>
                                <a href="https://www.instagram.com/<?php echo esc_attr($attributes['instagramUsername']); ?>/" target="_blank" rel="nofollow noopener">@<?php echo esc_html($attributes['instagramUsername']); ?></a>
                                <?php echo esc_html(__("on Instagram or use the hashtag", "recipe-creator")); ?>
                                <a href="https://www.instagram.com/explore/tags/<?php echo esc_attr($attributes['instagramHashtag']); ?>/" target="_blank" rel="nofollow noopener">#<?php echo esc_html($attributes['instagramHashtag']); ?></a>.
                            </p>
                        <?php } else { ?>
                            <p>
                                <?php echo esc_html(__("Then link", "recipe-creator")); ?>
                                <a href="https://www.instagram.com/<?php echo esc_attr($attributes['instagramUsername']); ?>/" target="_blank" rel="nofollow noopener">@<?php echo esc_html($attributes['instagramUsername']); ?></a>
                                <?php echo esc_html(__("on Instagram", "recipe-creator")); ?>.
                            </p>
                        <?php } ?>
                    <?php } else { ?>
                        <p>
                            <?php echo esc_html(__("Then link", "recipe-creator")); ?>
                            <a href="https://www.instagram.com/explore/tags/<?php echo esc_attr($attributes['instagramHashtag']); ?>/" target="_blank" rel="nofollow noopener">#<?php echo esc_html($attributes['instagramHashtag']); ?></a>
                            <?php echo esc_html(__("on Instagram", "recipe-creator")); ?>.
                        </p>
                    <?php } ?>
                </div>
            </section>
        <?php } ?>
    </section>
</div>