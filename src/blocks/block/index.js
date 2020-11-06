/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { withSelect } from "@wordpress/data";
import { date } from "@wordpress/date";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

/**
 * Internal dependencies
 */
import Edit from "./edit";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

registerBlockType("recipe-manager-pro/block", {
  /**
   * This is the display title for your block, which can be translated with `i18n` functions.
   * The block inserter will show this name.
   */
  title: __("Recipe Block", "recipe-manager-pro"),

  /**
   * This is a short description for your block, can be translated with `i18n` functions.
   * It will be shown in the Block Tab in the Settings Sidebar.
   */
  description: __(
    "Manage recipes and optimize them automatically for Google Featured Snippets.",
    "recipe-manager-pro"
  ),

  /**
   * Blocks are grouped into categories to help users browse and discover them.
   * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
   */
  category: "formatting",

  /**
   * An icon property should be specified to make it easier to identify a block.
   * These can be any of WordPress’ Dashicons, or a custom svg element.
   */
  icon: "carrot",

  /**
   * Optional block extended support features.
   */
  supports: {
    // Removes support for an HTML mode.
    html: false,
    align: ["center", "wide", "full"],
  },

  /**
   * @see ./edit.js
   */
  edit: withSelect((select) => {
    const site = select("core").getSite();
    const publishDate = wp.date.format(
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

  /**
   * @see ./save.js
   */
  save: (props) => {
    return props;
  },
});
