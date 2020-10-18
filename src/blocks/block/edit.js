/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { RichText } from "@wordpress/block-editor";
import {
  TextControl,
  TextareaControl,
  SelectControl,
  Button,
} from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */

var recipeManagerProMigrationDone = false;

export default function Edit(props) {
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!recipeManagerProMigrationDone) {
    const cleanedDefaultData = {};

    Object.keys(props.attributes).forEach((key) => {
      cleanedDefaultData[key] = props.attributes[key].replace(
        "::STORE_DEFAULT_VALUE_HACK",
        ""
      );
    });

    props.setAttributes(cleanedDefaultData);
    recipeManagerProMigrationDone = true;
  }

  const onChangeIngredients = (value) => {
    props.setAttributes({ ingredients: value });
  };

  const onChangePreparationSteps = (value) => {
    props.setAttributes({ preparationSteps: value });
  };

  const ALLOWED_MEDIA_TYPES = ["image"];

  const categoryOptions = [
    __("Breakfast", "recipe-manager-pro"),
    __("Bread", "recipe-manager-pro"),
    __("Appetizers & Snacks", "recipe-manager-pro"),
    __("Salads", "recipe-manager-pro"),
    __("Soups & Stews", "recipe-manager-pro"),
    __("Main Dishes", "recipe-manager-pro"),
    __("Side Dishes", "recipe-manager-pro"),
    __("Desserts", "recipe-manager-pro"),
    __("Drinks", "recipe-manager-pro"),
    __("Sweets", "recipe-manager-pro"),
  ].map((value) => {
    return { label: value, value: value };
  });

  categoryOptions.unshift({
    value: null,
    label: __("Select a category", "recipe-manager-pro"),
    disabled: true,
  });

  const unitOptions = [
    __("Stück", "recipe-manager-pro"),
    __("Gramm", "recipe-manager-pro"),
  ].map((value) => {
    return { label: value, value: value };
  });

  unitOptions.unshift({
    value: null,
    label: __("Select a unit", "recipe-manager-pro"),
    disabled: true,
  });

  const difficultyOptions = [
    __("Simple", "recipe-manager-pro"),
    __("Normal", "recipe-manager-pro"),
    __("Difficult", "recipe-manager-pro"),
  ].map((value) => {
    return { label: value, value: value };
  });

  return (
    <div className={props.className}>
      <div>
        <div className="container">
          <hr />
          <div className="row">
            <div className="col-12">
              <h2>{__("Recipe", "recipe-manager-pro")}</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <TextControl
                label={__("Name", "recipe-manager-pro")}
                value={props.attributes.name}
                placeholder={__("Vegetarian meat soup", "recipe-manager-pro")}
                onChange={(name) => {
                  props.setAttributes({ name });
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <TextareaControl
                label={__("Description", "recipe-manager-pro")}
                placeholder={__(
                  "This delicious vegetarian meal is super easy to make.",
                  "recipe-manager-pro"
                )}
                value={props.attributes.description}
                onChange={(description) => props.setAttributes({ description })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <SelectControl
                label={__("Difficulty", "recipe-manager-pro")}
                value={props.attributes.difficulty}
                options={difficultyOptions}
                onChange={(difficulty) => props.setAttributes({ difficulty })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <TextControl
                label={__("Keywords", "recipe-manager-pro")}
                placeholder={__('e.g. "quick & easy" or "vegetarian"')}
                help={__(
                  "Please separate the keywords with comma.",
                  "recipe-manager-pro"
                )}
                value={props.attributes.keywords}
                onChange={(keywords) => props.setAttributes({ keywords })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <TextControl
                type="number"
                label={__("Prep time", "recipe-manager-pro")}
                value={props.attributes.prepTime}
                placeholder="15"
                onChange={(prepTime) => {
                  props.setAttributes({
                    prepTime,
                    totalTime: props.attributes.cookTime
                      ? "" + (+props.attributes.cookTime + +prepTime)
                      : prepTime,
                  });

                  console.log(props.attributes);
                }}
                help={__("Duration in minutes", "recipe-manager-pro")}
              />
            </div>
            <div className="col-6">
              <TextControl
                type="number"
                label={__("Cook time", "recipe-manager-pro")}
                placeholder="30"
                value={props.attributes.cookTime}
                onChange={(cookTime) => {
                  props.setAttributes({
                    cookTime,
                    totalTime: props.attributes.prepTime
                      ? "" + (+props.attributes.prepTime + +cookTime)
                      : cookTime,
                  });

                  console.log(props.attributes);
                }}
                help={__("Duration in minutes", "recipe-manager-pro")}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <TextControl
                label={__("Yield", "recipe-manager-pro")}
                value={props.attributes.recipeYield}
                placeholder={__(
                  'e.g. "4 portions" or "12 muffins"',
                  "recipe-manager-pro"
                )}
                onChange={(recipeYield) => props.setAttributes({ recipeYield })}
              />
            </div>
            <div className="col-6">
              <TextControl
                label={__("Calories", "recipe-manager-pro")}
                value={props.attributes.calories}
                placeholder={__("450 calories", "recipe-manager-pro")}
                onChange={(calories) => props.setAttributes({ calories })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <TextControl
                label={__("Cuisine", "recipe-manager-pro")}
                value={props.attributes.recipeCuisine}
                placeholder={__(
                  'e.g. "Italian" or "German"',
                  "recipe-manager-pro"
                )}
                onChange={(recipeCuisine) =>
                  props.setAttributes({ recipeCuisine })
                }
              />
            </div>
            <div className="col-6">
              <SelectControl
                label={__("Category", "recipe-manager-pro")}
                value={props.attributes.recipeCategorys}
                options={categoryOptions}
                onChange={(recipeCategory) =>
                  props.setAttributes({ recipeCategory })
                }
              />
            </div>
          </div>

          <hr />

          <div class="row">
            <div class="col-12">
              <h3>{__("Ingredients", "recipe-manager-pro")}</h3>
              <RichText
                tagName="ul"
                multiline="li"
                placeholder={__(
                  "Add the ingredients here...",
                  "recipe-manager-pro"
                )}
                value={props.attributes.ingredients}
                onChange={onChangeIngredients}
              />

              {/* <div class="container">
          <div class="row">
            <div class="col-2">
              <TextControl type="number" placeholder="500" />
            </div>
            <div class="col-3">
              <SelectControl options={unitOptions} />
            </div>
            <div class="col-7">
              <TextControl placeholder={__("Noodles", "recipe-manager-pro")} />
            </div>
          </div>
        </div> */}

              <h3>{__("Steps of preparation", "recipe-manager-pro")}</h3>
              <RichText
                tagName="ol"
                multiline="li"
                placeholder={__(
                  "Add the steps of preparation here...",
                  "recipe-manager-pro"
                )}
                value={props.attributes.preparationSteps}
                onChange={onChangePreparationSteps}
              />
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-12">
              <TextareaControl
                label={__("Notes", "recipe-manager-pro")}
                placeholder={__("Notes", "recipe-manager-pro")}
                value={props.attributes.notes}
                onChange={(notes) => props.setAttributes({ notes })}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              <h3>
                {__("Picture of the finished dish", "recipe-manager-pro")}
              </h3>
              <p>
                {__(
                  "Google recommends 3 pictures in different aspect ratios. You should provide them have a change for a featured snippet in the search results.",
                  "recipe-manager-pro"
                )}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              {props.attributes.image1_1 && (
                <img src={props.attributes.image1_1} />
              )}
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => {
                    if (media) {
                      props.setAttributes({ image1_1: media.url });
                    }
                  }}
                  allowedTypes={ALLOWED_MEDIA_TYPES}
                  value={props.attributes.image1_1}
                  render={({ open }) => (
                    <div>
                      <label>{__("Image (1:1)", "recipe-manager-pro")}</label>
                      <Button onClick={open} isSecondary={true}>
                        {__("Open Media Library", "recipe-manager-pro")}
                      </Button>
                    </div>
                  )}
                />
              </MediaUploadCheck>
            </div>
            <div className="col-4">
              {props.attributes.image4_3 && (
                <img src={props.attributes.image4_3} />
              )}
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => {
                    if (media) {
                      props.setAttributes({ image4_3: media.url });
                    }
                  }}
                  allowedTypes={ALLOWED_MEDIA_TYPES}
                  value={props.attributes.image4_3}
                  render={({ open }) => (
                    <div>
                      <label>{__("Image (4:3)", "recipe-manager-pro")}</label>
                      <Button onClick={open} isSecondary={true}>
                        {__("Open Media Library", "recipe-manager-pro")}
                      </Button>
                    </div>
                  )}
                />
              </MediaUploadCheck>
            </div>
            <div className="col-4">
              {props.attributes.image16_9 && (
                <img src={props.attributes.image16_9} />
              )}
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => {
                    if (media) {
                      props.setAttributes({ image16_9: media.url });
                    }
                  }}
                  allowedTypes={ALLOWED_MEDIA_TYPES}
                  value={props.attributes.image16_9}
                  render={({ open }) => (
                    <div>
                      <label>{__("Image (16:9)", "recipe-manager-pro")}</label>
                      <Button onClick={open} isSecondary={true}>
                        {__("Open Media Library", "recipe-manager-pro")}
                      </Button>
                    </div>
                  )}
                />
              </MediaUploadCheck>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
