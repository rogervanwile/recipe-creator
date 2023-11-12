import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

export default function Edit(props) {
  return (
    <Fragment>
      <div className="wp-block recipe-guru--block--jump-to-recipe">
        <a
          href="#recipe-guru--recipe"
          className="recipe-guru--block--jump-to-recipe--link"
        >
          {__("Jump to recipe", "recipe-guru")}
        </a>
      </div>
    </Fragment>
  );
}
