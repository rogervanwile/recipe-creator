import { __ } from "@wordpress/i18n";


import {
    SelectControl,
    __experimentalInputControl as InputControl,
} from "@wordpress/components";

export default function RecipeYieldSelector({ props }) {
    const recipeYieldUnitOptions = [
        {
            value: "servings",
            label: __("servings", 'foodblogkitchen-toolkit'),
        },
        {
            value: "piece",
            label: __("piece", 'foodblogkitchen-toolkit'),
        },
        {
            value: "springform-pan",
            label: __("springform pan", 'foodblogkitchen-toolkit'),
        },
    ];

    return <>
        <InputControl
            label={__("Results in", 'foodblogkitchen-toolkit')}
            type="number"
            min="0"
            value={props.attributes.recipeYield}
            placeholder="0"
            onChange={(recipeYield) => {
                props.setAttributes({ recipeYield });
            }}

            suffix={props.attributes.recipeYieldUnit === 'springform-pan' ? __("cm", 'foodblogkitchen-toolkit') : ''}
        />

        <SelectControl
            label={__("Unit", 'foodblogkitchen-toolkit')}
            value={props.attributes.recipeYieldUnit}
            options={recipeYieldUnitOptions}
            onChange={(recipeYieldUnit) =>
                props.setAttributes({ recipeYieldUnit })
            }
        />
    </>
}