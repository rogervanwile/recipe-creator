<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>
  <?php settings_errors(); ?>
  <form method="post" action="options.php">
    <?php
    settings_fields('foodblogkitchen_toolkit__pinterest');
    do_settings_sections('foodblogkitchen_toolkit__pinterest');
    submit_button();
    ?>
  </form>
</div>