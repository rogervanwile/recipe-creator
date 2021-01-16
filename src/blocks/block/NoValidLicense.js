import { __ } from "@wordpress/i18n";

import "./editor.scss";

export default function NoValidLicense() {
  return (
    <div className="wp-block components-placeholder is-large">
      <div className="components-placeholder__label">{__("You have not activated the license yet", 'foodblogkitchen-toolkit')}</div>
      <div className="components-placeholder__instructions">{__("Please enter a valid license key in the settings of the recipe plugin. You have received this key by email with your purchase.", 'foodblogkitchen-toolkit')}</div>
      <div className="components-placeholder__instructions">{__("If you can no longer find your license key, please contact us at ", 'foodblogkitchen-toolkit')}<a href="mailto:support@foodblogkitchen.de">support@foodblogkitchen.de</a>.</div>
      <a href={foodblogkitchenToolkitAdditionalData.licensePage} className="components-button is-primary">{__("Go to settings", 'foodblogkitchen-toolkit')}</a>
    </div>
  );
}
