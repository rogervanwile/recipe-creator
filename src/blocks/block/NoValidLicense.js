import { __ } from "@wordpress/i18n";

import "./editor.scss";

export default function NoValidLicense() {
  return (
    <div class="wp-block components-placeholder is-large">
      <div class="components-placeholder__label">{__("You have not activated the license yet", "foodblogkitchen-recipes")}</div>
      <div class="components-placeholder__instructions">{__("Please enter a valid license key in the settings of the recipe plugin. You have received this key by email with your purchase.", "foodblogkitchen-recipes")}</div>
      <div class="components-placeholder__instructions">{__("If you can no longer find your license key, please contact us at ", "foodblogkitchen-recipes")}<a href="mailto:support@foodblogkitchen.de">support@foodblogkitchen.de</a>.</div>
      <a href={foodblogkitchenRecipesAdditionalData.licensePage} class="components-button is-primary">{__("Go to settings", "foodblogkitchen-recipes")}</a>
    </div>
  );
}
