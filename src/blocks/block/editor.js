import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { withSelect } from "@wordpress/data";
import { format } from "@wordpress/date";

import Edit from "./edit";
import NoValidLicense from "./NoValidLicense";

import "./editor.scss";

import metadata from "./block.json";

registerBlockType(metadata, {
  // The title and description from the block.json is not translated automatic
  // So I have to redefine it here
  title: __("Recipe", "foodblogkitchen-toolkit"),
  description: __(
    "Add a recipe and optimize it easily for search engines.",
    "foodblogkitchen-toolkit"
  ),
  edit: !!foodblogkitchenToolkitAdditionalData?.hasValidLicense
    ? withSelect((select) => {
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
      })(Edit)
    : NoValidLicense,
  save: (props) => {
    return props;
  },
});
