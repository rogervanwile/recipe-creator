import { __ } from "@wordpress/i18n";

// import "./editor.scss";

export default function NoValidLicense() {
  return (
    <div className="wp-block components-placeholder is-large">
      <div className="components-placeholder__label">
        {__(
          "You have not activated the license yet",
          "recipe-plugin-for-wp"
        )}
      </div>
      <div className="components-placeholder__instructions">
        {__(
          "Please enter a valid license key in the settings of the recipe plugin. You have received this key by email with your purchase.",
          "recipe-plugin-for-wp"
        )}
      </div>
      <div className="components-placeholder__instructions">
        {__(
          "If you can no longer find your license key, please contact us at ",
          "recipe-plugin-for-wp"
        )}
        <a href="mailto:support@howtofoodblog.com">
          support@howtofoodblog.com
        </a>
        .
      </div>
      <a
        href={recipePluginForWPAdditionalData?.licensePage}
        className="components-button is-primary"
      >
        {__("Go to settings", "recipe-plugin-for-wp")}
      </a>
    </div>
  );
}
