import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";

import { withSelect } from "@wordpress/data";
import { format } from "@wordpress/date";

import "./style.scss";

import Edit from "./edit";

registerBlockType("recipe-manager-pro/block", {
  title: __("Recipe Block", "recipe-manager-pro"),
  description: __(
    "Manage recipes and optimize them automatically for Google Featured Snippets.",
    "recipe-manager-pro"
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
