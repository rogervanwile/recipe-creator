<div class="wrap">
  <h1>Recipe Manager Pro</h1>
  <?php settings_errors(); ?>

  <form method="post" action="options.php">
    <?php
    settings_fields('recipe_manager_pro__general');
    do_settings_sections('recipe_manager_pro__general');
    submit_button();
    ?>
  </form>
</div>