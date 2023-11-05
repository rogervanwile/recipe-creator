import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

export default function Edit(props) {
  return (
    <Fragment>
      <div className="wp-block recipe-plugin-for-wp--block--jump-to-recipe">
        <a
          href="#recipe-plugin-for-wp--recipe"
          className="recipe-plugin-for-wp--block--jump-to-recipe--link"
        >
          {__("Jump to recipe", "recipe-plugin-for-wp")}
        </a>
      </div>
    </Fragment>
  );
}
