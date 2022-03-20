import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

export default function Edit(props) {
  return (
    <Fragment>
      <div className="wp-block foodblogkitchen-toolkit--block--jump-to-recipe">
        <a
          href="#foodblogkitchen-toolkit--recipe"
          className="foodblogkitchen-toolkit--block--jump-to-recipe--link"
        >
          {__("Jump to recipe", "foodblogkitchen-toolkit")}
        </a>
      </div>
    </Fragment>
  );
}
