<div class="wrap">
  <h1><?php echo get_admin_page_title(); ?></h1>

  <?php

  if (isset($_REQUEST['activate_license'])) {
    $result = FoodblogkitchenToolkit::registerLicense($_REQUEST['foodblogkitchen_toolkit__license_key']);
  }

  if (isset($_REQUEST['deactivate_license'])) {
    $result = FoodblogkitchenToolkit::unregisterLicense();
  }

  $licenseKey = get_option('foodblogkitchen_toolkit__license_key', '');

  if (isset($result) && is_array($result)) {
    switch ($result['status']) {
      case "error":
      ?>
        <div class="error">
          <p><?= $result['message'] ?></p>
        </div>
      <?php
        break;
      default:
      ?>
        <div class="updated">
          <p><?= $result['message'] ?></p>
        </div>
  <?php
    }
  }

  ?>

  <p><?= __("Please enter the license key for this product to activate it. You were given a license key when you purchased this item.", 'foodblogkitchen-toolkit'); ?></p>
  <form action="" method="post">
    <table class="form-table">
      <tr>
        <th style="width:100px;"><label for="foodblogkitchen_toolkit__license_key"><?= __("License Key", 'foodblogkitchen-toolkit'); ?></label></th>
        <td><input class="regular-text" type="text" id="foodblogkitchen_toolkit__license_key" name="foodblogkitchen_toolkit__license_key" value="<?php echo $licenseKey; ?>"></td>
      </tr>
    </table>
    <p class="submit">
      <?php if (!empty($licenseKey)) { ?>
        <input type="submit" name="deactivate_license" value="<?= __("Deactivate", 'foodblogkitchen-toolkit'); ?>" class="button" />
      <?php } else { ?>
        <input type="submit" name="activate_license" value="<?= __("Activate", 'foodblogkitchen-toolkit'); ?>" class="button-primary" />
      <?php } ?>
    </p>
  </form>
</div>