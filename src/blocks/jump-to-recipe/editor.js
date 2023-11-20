import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";

import metadata from "./block.json";

registerBlockType(metadata, {
  // The title and description from the block.json is not translated automatic
  // So I have to redefine it here
  title: __("Jump to recipe", "recipe-creator"),
  description: __("Jump to recipe", "Add a quick link which jumps to the recipe in the page."),
  edit: Edit,
  save: Save,
});
