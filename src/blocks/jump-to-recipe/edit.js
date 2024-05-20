import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

export default function Edit(props) {
  return (
    <Fragment>
      <div className="wp-block recipe-creator recipe-creator--block--jump-to-recipe">
        <a href="#recipe-creator--recipe" className="recipe-creator--block--jump-to-recipe--link">
          {__("Jump to recipe", "recipe-creator")}
        </a>
      </div>
    </Fragment>
  );
}
