import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";

import { withSelect } from "@wordpress/data";
import { format } from "@wordpress/date";

import "./style.scss";

import Edit from "./edit";

registerBlockType("foodblogkitchen-recipes/block", {
  title: __("Recipe", "foodblogkitchen-recipes"),
  description: __(
    "Create recipes and optimize them easily for search engines.",
    "foodblogkitchen-recipes"
  ),
  category: "formatting",
  icon: "carrot",
  supports: {
    // Removes support for an HTML mode.
    html: false,
    align: ["center", "wide", "full"],
  },
  edit: withSelect((select) => {
    const site = select("core").getSite();
    const publishDate = format(
      "d.m.Y",
      wp.data.select("core/editor").getEditedPostAttribute("date")
    );

    return {
      data: {
        title: site ? site.title : null,
        publishDate: publishDate,
        meta: select("core/editor").getEditedPostAttribute("meta"),
      },
    };
  })(Edit),

  save: (props) => {
    return props;
  },
});
