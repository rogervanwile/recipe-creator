import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

export default function Edit(props) {
  return (
    <Fragment>
      <div className="wp-block recipe-master--block--jump-to-recipe">
        <a
          href="#recipe-master--recipe"
          className="recipe-master--block--jump-to-recipe--link"
        >
          {__("Jump to recipe", "recipe-master")}
        </a>
      </div>
    </Fragment>
  );
}
