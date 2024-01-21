<?php

if (!defined("ABSPATH")) {
    die();
}

require __DIR__ . "/../vendor/autoload.php";

class RatingMonitor
{
    private $lowRating = 4.0;

    function __construct()
    {
        add_action("admin_init", [$this, "checkRatings"]);
    }

    public function checkRatings()
    {
        if (!get_transient('recipe_creator__low_rated_posts')) {
            $posts = $this->getPostsWithLowRatings();
            
            set_transient('recipe_creator__low_rated_posts', count($posts), 24 * HOUR_IN_SECONDS);
        }

        $amountOfPostsWithLowRatedRecipes = get_transient('recipe_creator__low_rated_posts');

        if ($amountOfPostsWithLowRatedRecipes) {
            $this->showWarning($amountOfPostsWithLowRatedRecipes);
        }
    }

    private function getPostsWithLowRatings()
    {
        $args = array(
            'post_type' => get_post_types(),
            'posts_per_page' => -1,
            'meta_query' => array(
                array(
                    'key' => 'average_rating',
                    'compare' => 'EXISTS',
                ),
                array(
                    'key' => 'average_rating',
                    'type'    => 'DECIMAL(2,1)',
                    'compare' => '<=',
                    'value' => $this->lowRating,
                ),
            ),
            'post_status' => 'any'
        );


        return  get_posts($args);
    }

    private function showWarning($amountOfAffectedRecipes)
    {
        if (isset($_GET['orderby']) && $_GET['orderby'] === 'average_rating') {
            return;
        }
?>
        <div class="notice notice-info is-dismissible">
            <p>
                <?php echo sprintf(
                    __(
                        'You have %s recipes that are rated worse than %s. Optimize them or adjust the rating so that you rank higher on Google. <a href="%s">Show recipes</a> ',
                        "recipe-creator"
                    ),
                    $amountOfAffectedRecipes,
                    $this->lowRating,
                    esc_url(
                        add_query_arg(["orderby" => "average_rating", "order" => "asc"], admin_url('edit.php'))
                    ),
                ); ?></p>
        </div>
<?php
    }
}
