import { registerBlockType } from "@wordpress/blocks";

import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";

import "./style.scss";

registerBlockType("foodblogkitchen-toolkit/faq", {
    title: __("FAQ", 'foodblogkitchen-toolkit'),
    description: __(
        "Answer post related questions in a simple FAQ block.",
        'foodblogkitchen-toolkit'
    ),
    category: "formatting",
    icon: "format-chat",
    supports: {
        // Removes support for an HTML mode.
        html: false,
        align: ["center", "wide", "full"],
    },
    edit: Edit,
    save: Save
});
