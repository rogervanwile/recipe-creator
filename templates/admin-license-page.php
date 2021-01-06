<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>

  <?php

  /*** License activate button was clicked ***/
  if (isset($_REQUEST['activate_license'])) {
    $license_key = $_REQUEST['foodblogkitchen_recipes__license_key'];

    // API query parameters
    $api_params = array(
      'slm_action' => 'slm_activate',
      'secret_key' => FoodblogKitchenRecipes::$licenseSecretKey,
      'license_key' => $license_key,
      'registered_domain' => $_SERVER['SERVER_NAME'],
      'item_reference' => urlencode(FoodblogKitchenRecipes::$licenseProductName),
    );

    // Send query to the license manager server
    $query = esc_url_raw(add_query_arg($api_params, FoodblogKitchenRecipes::$licenseServer));
    $response = wp_remote_get($query, array('timeout' => 20, 'sslverify' => false));

    // Check for error in the response
    if (is_wp_error($response)) {
  ?>
      <div class="error">
        <p><?= __("There was an error while activating the license. Please try again later.", "foodblogkitchen-recipes"); ?></p>
      </div>
    <?php
    }

    // License data.
    $license_data = json_decode(wp_remote_retrieve_body($response));

    if ($license_data->result == 'success') { //Success was returned for the license activation
      //Save the license key in the options table
      update_option('foodblogkitchen_recipes__license_key', $license_key);
    ?>
      <div class="updated">
        <p><?= __("Your license has been successfully activated. You can now use the recipes block in the editor.", "foodblogkitchen-recipes"); ?></p>
      </div>
    <?php
    } else {
      //Show error to the user. Probably entered incorrect license key.

    ?>
      <div class="updated">
        <p><?= __("There was an error while activating the license. Please check your input. If you can't find an error, please contact our support.", "foodblogkitchen-recipes"); ?></p>
        <?php if (isset($license_data->message) && !empty($license_data->message)) { ?>
          <p><?= $license_data->message; ?></p>
        <?php } ?>
      </div>
    <?php
    }
  }
  /*** End of license activation ***/

  /*** License activate button was clicked ***/
  if (isset($_REQUEST['deactivate_license'])) {
    $license_key = $_REQUEST['foodblogkitchen_recipes__license_key'];

    // API query parameters
    $api_params = array(
      'slm_action' => 'slm_deactivate',
      'secret_key' => FoodblogKitchenRecipes::$licenseSecretKey,
      'license_key' => $license_key,
      'registered_domain' => $_SERVER['SERVER_NAME'],
      'item_reference' => urlencode(FoodblogKitchenRecipes::$licenseProductName),
    );

    // Send query to the license manager server
    $query = esc_url_raw(add_query_arg($api_params, FoodblogKitchenRecipes::$licenseServer));
    $response = wp_remote_get($query, array('timeout' => 20, 'sslverify' => false));

    // Check for error in the response
    if (is_wp_error($response)) {
    ?>
      <div class="error">
        <p><?= __("There was an error while deactivating the license. Please try again later.", "foodblogkitchen-recipes"); ?></p>
      </div>
      <?php
    } else {
      // License data.
      $license_data = json_decode(wp_remote_retrieve_body($response));

      if ($license_data->result == 'success') {
        //Success was returned for the license activation
        //Remove the license key from the options table.
        delete_option('foodblogkitchen_recipes__license_key');

      ?>
        <div class="updated">
          <p><?= __("The license has been successfully deactivated.", "foodblogkitchen-recipes"); ?></p>
        </div>
      <?php
      } else {
        //Show error to the user. Probably entered incorrect license key.
      ?>
        <div class="updated">
          <p><?= __("There was an error while deactivating the license. ", "foodblogkitchen-recipes"); ?> <?= $license_data->message; ?></p>
        </div>
  <?php
      }
    }
  }

  $licenseKey = get_option('foodblogkitchen_recipes__license_key', '');

  ?>
  <p><?= __("Please enter the license key for this product to activate it. You were given a license key when you purchased this item.", "foodblogkitchen-recipes"); ?></p>
  <form action="" method="post">
    <table class="form-table">
      <tr>
        <th style="width:100px;"><label for="foodblogkitchen_recipes__license_key"><?= __("License Key", "foodblogkitchen-recipes"); ?></label></th>
        <td><input class="regular-text" type="text" id="foodblogkitchen_recipes__license_key" name="foodblogkitchen_recipes__license_key" value="<?php echo $licenseKey; ?>"></td>
      </tr>
    </table>
    <p class="submit">
      <?php if (!empty($licenseKey)) { ?>
        <input type="submit" name="deactivate_license" value="<?= __("Deactivate", "foodblogkitchen-recipes"); ?>" class="button" />
      <?php } else { ?>
        <input type="submit" name="activate_license" value="<?= __("Activate", "foodblogkitchen-recipes"); ?>" class="button-primary" />
      <?php } ?>
    </p>
  </form>
</div>