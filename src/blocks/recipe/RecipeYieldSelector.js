import { __ } from "@wordpress/i18n";

import {
  SelectControl,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";

export default function RecipeYieldSelector({ props }) {
  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", "recipe-master"),
    },
    {
      value: "piece",
      label: __("piece", "recipe-master"),
    },
    {
      value: "springform-pan",
      label: __("springform pan", "recipe-master"),
    },
    {
      value: "square-baking-pan",
      label: __("square baking pan", "recipe-master"),
    },
    {
      value: "baking-tray",
      label: __("baking tray", "recipe-master"),
    },
  ];

  return (
    <>
      {["square-baking-pan"].indexOf(props.attributes.recipeYieldUnit) !==
      -1 ? (
        <div className="square-baking-pans-x-wrapper">
          <InputControl
            label={__("Results in", "recipe-master")}
            type="number"
            min="0"
            value={props.attributes.recipeYieldWidth}
            placeholder="0"
            onChange={(recipeYieldWidth) => {
              props.setAttributes({ recipeYield: 0, recipeYieldWidth });
            }}
            suffix={__("cm", "recipe-master")}
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
            suffix={__("cm", "recipe-master")}
          />
        </div>
      ) : (
        <InputControl
          label={__("Results in", "recipe-master")}
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
              ? __("cm", "recipe-master")
              : ""
          }
        />
      )}
      <SelectControl
        label={__("Unit", "recipe-master")}
        value={props.attributes.recipeYieldUnit}
        options={recipeYieldUnitOptions}
        onChange={(recipeYieldUnit) => props.setAttributes({ recipeYieldUnit })}
      />
    </>
  );
}
