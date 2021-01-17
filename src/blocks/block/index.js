import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";

import { withSelect } from "@wordpress/data";
import { format } from "@wordpress/date";

import "./style.scss";

import Edit from "./edit";
import NoValidLicense from "./NoValidLicense";

registerBlockType("foodblogkitchen-recipes/block", {
  title: __("Recipe", 'foodblogkitchen-toolkit'),
  description: __(
    "Add a recipe and optimize it easily for search engines.",
    'foodblogkitchen-toolkit'
  ),
  category: "formatting",
  icon: "carrot",
  supports: {
    // Removes support for an HTML mode.
    html: false,
    align: ["center", "wide", "full"],
  },
  edit: (
    !!foodblogkitchenToolkitAdditionalData.hasValidLicense ? withSelect((select) => {
      const site = select("core").getSite();

      const publishDate = format(
        "d.m.Y",
        wp.data.select("core/editor").getEditedPostAttribute("date")
      );

      return {
        data: {
          site: site || {},
          publishDate: publishDate,
          meta: select("core/editor").getEditedPostAttribute("meta"),
        },
      };
    })(Edit) : NoValidLicense),

  save: (props) => {
    return props;
  },
});
