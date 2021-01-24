import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";

import "./style.scss";

registerBlockType("foodblogkitchen-toolkit/jump-to-recipe", {
    title: __("Jump to recipe", 'foodblogkitchen-toolkit'),
    description: __(
        "Add a quick link which jumps to the recipe in the page.",
        'foodblogkitchen-toolkit'
    ),
    category: "formatting",
    icon: "button",
    supports: {
        // Removes support for an HTML mode.
        html: false,
        align: ["center", "wide", "full"],
    },
    edit: Edit,
    save: Save
});
