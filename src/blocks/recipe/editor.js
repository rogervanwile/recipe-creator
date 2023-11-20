import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { withSelect } from "@wordpress/data";
import { format } from "@wordpress/date";

import Edit from "./edit";

import "./editor.scss";

import metadata from "./block.json";

registerBlockType(metadata, {
  // The title and description from the block.json is not translated automatic
  // So I have to redefine it here
  title: __("Recipe", "recipe-creator"),
  description: __("Add a recipe and optimize it easily for search engines.", "recipe-creator"),
  edit: withSelect((select) => {
    const site = select("core").getSite();

    const publishDate = format("d.m.Y", wp.data.select("core/editor").getEditedPostAttribute("date"));

    return {
      data: {
        site: site || {},
        publishDate: publishDate,
        meta: select("core/editor").getEditedPostAttribute("meta"),
      },
    };
  })(Edit),
  save: (props) => {
    return props;
  },
});
