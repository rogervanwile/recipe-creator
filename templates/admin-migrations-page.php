<?php
$foodblogkitchenMigrations = new FoodblogkitchenMigration();
?>

<div class="wrap recipe-creator--migrations">
    <h1><?php echo get_admin_page_title(); ?></h1>
    <?php
    $foodblogkitchenMigrations->getPage();
    ?>
</div>