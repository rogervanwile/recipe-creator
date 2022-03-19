import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";

import metadata from "./block.json";

registerBlockType(metadata, {
  // The title and description from the block.json is not translated automatic
  // So I have to redefine it here
  title: __("FAQ", "foodblogkitchen-toolkit"),
  description: __(
    "Answer post related questions in a simple FAQ block.",
    "foodblogkitchen-toolkit"
  ),
  edit: Edit,
  save: Save,
});
