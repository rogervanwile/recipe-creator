import { __ } from "@wordpress/i18n";

import {
  SelectControl,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";

export default function RecipeYieldSelector({ props }) {
  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", "foodblogkitchen-toolkit"),
    },
    {
      value: "piece",
      label: __("piece", "foodblogkitchen-toolkit"),
    },
    {
      value: "springform-pan",
      label: __("springform pan", "foodblogkitchen-toolkit"),
    },
    {
      value: "square-baking-pan",
      label: __("square baking pan", "foodblogkitchen-toolkit"),
    },
    {
      value: "baking-tray",
      label: __("baking tray", "foodblogkitchen-toolkit"),
    },
  ];

  return (
    <>
      {["square-baking-pan"].indexOf(props.attributes.recipeYieldUnit) !==
      -1 ? (
        <div className="square-baking-pans-x-wrapper">
          <InputControl
            label={__("Results in", "foodblogkitchen-toolkit")}
            type="number"
            min="0"
            value={props.attributes.recipeYieldWidth}
            placeholder="0"
            onChange={(recipeYieldWidth) => {
              props.setAttributes({ recipeYield: 0, recipeYieldWidth });
            }}
            suffix={__("cm", "foodblogkitchen-toolkit")}
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
            suffix={__("cm", "foodblogkitchen-toolkit")}
          />
        </div>
      ) : (
        <InputControl
          label={__("Results in", "foodblogkitchen-toolkit")}
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
              ? __("cm", "foodblogkitchen-toolkit")
              : ""
          }
        />
      )}
      <SelectControl
        label={__("Unit", "foodblogkitchen-toolkit")}
        value={props.attributes.recipeYieldUnit}
        options={recipeYieldUnitOptions}
        onChange={(recipeYieldUnit) => props.setAttributes({ recipeYieldUnit })}
      />
    </>
  );
}
