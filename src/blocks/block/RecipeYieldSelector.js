import { __ } from "@wordpress/i18n";

import {
  SelectControl,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";

export default function RecipeYieldSelector({ props }) {
  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", "recipe-plugin-for-wp"),
    },
    {
      value: "piece",
      label: __("piece", "recipe-plugin-for-wp"),
    },
    {
      value: "springform-pan",
      label: __("springform pan", "recipe-plugin-for-wp"),
    },
    {
      value: "square-baking-pan",
      label: __("square baking pan", "recipe-plugin-for-wp"),
    },
    {
      value: "baking-tray",
      label: __("baking tray", "recipe-plugin-for-wp"),
    },
  ];

  return (
    <>
      {["square-baking-pan"].indexOf(props.attributes.recipeYieldUnit) !==
      -1 ? (
        <div className="square-baking-pans-x-wrapper">
          <InputControl
            label={__("Results in", "recipe-plugin-for-wp")}
            type="number"
            min="0"
            value={props.attributes.recipeYieldWidth}
            placeholder="0"
            onChange={(recipeYieldWidth) => {
              props.setAttributes({ recipeYield: 0, recipeYieldWidth });
            }}
            suffix={__("cm", "recipe-plugin-for-wp")}
          />
          <span className="square-baking-pans-x">x</span>
          <InputControl
            label=""
            type="number"
            min="0"
            value={props.attributes.recipeYieldHeight}
            placeholder="0"
            onChange={(recipeYieldHeight) => {
              props.setAttributes({ recipeYield: 0, recipeYieldHeight });
            }}
            suffix={__("cm", "recipe-plugin-for-wp")}
          />
        </div>
      ) : (
        <InputControl
          label={__("Results in", "recipe-plugin-for-wp")}
          type="number"
          min="0"
          value={props.attributes.recipeYield}
          placeholder="0"
          onChange={(recipeYield) => {
            props.setAttributes({
              recipeYield,
              recipeYieldWidth: 0,
              recipeYieldHeight: 0,
            });
          }}
          suffix={
            props.attributes.recipeYieldUnit === "springform-pan"
              ? __("cm", "recipe-plugin-for-wp")
              : ""
          }
        />
      )}
      <SelectControl
        label={__("Unit", "recipe-plugin-for-wp")}
        value={props.attributes.recipeYieldUnit}
        options={recipeYieldUnitOptions}
        onChange={(recipeYieldUnit) => props.setAttributes({ recipeYieldUnit })}
      />
    </>
  );
}
