/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import {
  TextControl,
  TextareaControl,
  SelectControl,
  Button,
  // RadioGroup,
  // Radio
} from "@wordpress/components";

import { __experimentalInputControl as InputControl } from "@wordpress/components";

import {
  __experimentalRadio as Radio,
  __experimentalRadioGroup as RadioGroup,
} from "@wordpress/components";

import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";

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
  console.log("props", props);

  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!recipeManagerProMigrationDone) {
    const cleanedDefaultData = {};

    Object.keys(props.attributes).forEach((key) => {
      if (typeof props.attributes[key] === "string") {
        cleanedDefaultData[key] = props.attributes[key].replace(
          "::STORE_DEFAULT_VALUE_HACK",
          ""
        );
      }
    });

    props.setAttributes(cleanedDefaultData);
    recipeManagerProMigrationDone = true;
  }

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

  function updateTime(settingKey, value) {
    let prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    let restTime = parseInt(props.attributes.restTime, 10) || 0;
    let cookTime = parseInt(props.attributes.cookTime, 10) || 0;

    const update = {};

    const intValue = parseInt(value, 10);

    if (!isNaN(intValue)) {
      switch (settingKey) {
        case "prepTime":
          prepTime = intValue;
          update["prepTime"] = prepTime;
          break;
        case "restTime":
          restTime = intValue;
          update["restTime"] = restTime;
          break;
        case "cookTime":
          cookTime = intValue;
          update["cookTime"] = cookTime;
          break;
      }

      update["totalTime"] = prepTime + restTime + cookTime;

      props.setAttributes(update);
    }
  }

  function getRatedStarsWidth(averageRating) {
    if (averageRating) {
      return (65 / 5) * averageRating;
    } else {
      return 0;
    }
  }

  function getRatingElement() {
    if (props.data.meta.rating_count) {
      return (
        <div className="features-snipped-preview--rating">
          {props.data.meta.average_rating}&nbsp;
          <span className="features-snipped-preview--stars">
            <span
              className="features-snipped-preview--stars--rated"
              style={{
                width:
                  getRatedStarsWidth(props.data.meta.average_rating) + "px",
              }}
            ></span>
          </span>
          &nbsp;({props.data.meta.rating_count})
        </div>
      );
    } else {
      return (
        <div className="features-snipped-preview--rating">
          Keine Rezensionen
        </div>
      );
    }
  }

  return (
    <div className={"recipe-manager-pro--block " + props.className}>
      <RichText
        tagName="h2"
        value={props.attributes.name}
        placeholder={__("Title of your recipe", "recipe-manager-pro")}
        onChange={(name) => {
          props.setAttributes({ name });
        }}
      />
      <div className="recipe-manager-pro--block--intro">
        <div>
          <RadioGroup
            onChange={(difficulty) => props.setAttributes({ difficulty })}
            checked={props.attributes.difficulty}
          >
            <Radio value={__("Simple", "recipe-manager-pro")}>
              {__("Simple", "recipe-manager-pro")}
            </Radio>
            <Radio value={__("Moderate", "recipe-manager-pro")}>
              {__("Moderate", "recipe-manager-pro")}
            </Radio>
            <Radio value={__("Challenging", "recipe-manager-pro")}>
              {__("Challenging", "recipe-manager-pro")}
            </Radio>
          </RadioGroup>

          <RichText
            tagName="p"
            value={props.attributes.description}
            placeholder={__(
              "Short description of your recipe",
              "recipe-manager-pro"
            )}
            onChange={(description) => {
              props.setAttributes({ description });
            }}
          />
        </div>
        <div>
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
                <img
                  src={props.attributes.image4_3}
                  className="img-fluid mb-4 d-block mx-auto"
                  onClick={open}
                />
              )}
            />
          </MediaUploadCheck>
        </div>
      </div>
      <hr />
      <div className="recipe-manager-pro--block--timing-list">
        <ul>
          <li>
            <header>{__("Prep time", "recipe-manager-pro")}:</header>
            <span>
              <InputControl
                type="number"
                min="0"
                value={props.attributes.prepTime}
                placeholder={__("15", "recipe-manager-pro")}
                onChange={(prepTime) => {
                  updateTime("prepTime", prepTime);
                }}
                suffix={__("Minutes", "recipe-manager-pro")}
              />
            </span>
          </li>

          <li>
            <header>{__("Rest time", "recipe-manager-pro")}:</header>
            <span>
              <InputControl
                type="number"
                min="0"
                value={props.attributes.restTime}
                placeholder={__("15", "recipe-manager-pro")}
                onChange={(restTime) => {
                  updateTime("restTime", restTime);
                }}
                suffix={__("Minutes", "recipe-manager-pro")}
              />
            </span>
          </li>

          <li>
            <header>{__("Cook time", "recipe-manager-pro")}:</header>
            <span>
              <InputControl
                type="number"
                min="0"
                value={props.attributes.cookTime}
                placeholder={__("15", "recipe-manager-pro")}
                onChange={(cookTime) => {
                  updateTime("cookTime", cookTime);
                }}
                suffix={__("Minutes", "recipe-manager-pro")}
              />
            </span>
          </li>

          <li>
            <header>{__("Total time", "recipe-manager-pro")}:</header>
            <span>
              {props.attributes.totalTime} {__("Minutes", "recipe-manager-pro")}
            </span>
          </li>
        </ul>
      </div>
      <hr />
      <div className="recipe-manager-pro--block--headline">
        <h3>{__("Ingredients", "recipe-manager-pro")}</h3>
      </div>
      <div className="recipe-manager-pro--block--flex-container">
        <InputControl
          label={__("Yield", "recipe-manager-pro")}
          type="number"
          min="0"
          value={props.attributes.recipeYield}
          placeholder={__("4", "recipe-manager-pro")}
          onChange={(recipeYield) => {
            props.setAttributes({ recipeYield });
          }}
          suffix={__("piece", "recipe-manager-pro")}
        />
        <InputControl
          type="number"
          label={__("Servings", "recipe-manager-pro")}
          min="0"
          value={props.attributes.servings}
          placeholder={__("4", "recipe-manager-pro")}
          onChange={(servings) => {
            props.setAttributes({ servings });
          }}
          suffix={__("servings", "recipe-manager-pro")}
        />
      </div>

      <RichText
        tagName="ul"
        multiline="li"
        className="recipe-manager-pro--block--ingredients"
        placeholder={__("Add the ingredients here...", "recipe-manager-pro")}
        value={props.attributes.ingredients}
        onChange={(ingredients) => props.setAttributes({ ingredients })}
      />

      <div className="recipe-manager-pro--block--headline">
        <h3>{__("Steps of preparation", "recipe-manager-pro")}</h3>
      </div>

      <RichText
        tagName="ol"
        multiline="li"
        className="recipe-manager-pro--block--preparation-steps"
        placeholder={__(
          "Add the steps of preparation here...",
          "recipe-manager-pro"
        )}
        value={props.attributes.preparationSteps}
        onChange={(preparationSteps) =>
          props.setAttributes({ preparationSteps })
        }
      />

      <hr />

      <div className="recipe-manager-pro--block--headline">
        <h3>{__("Notes", "recipe-manager-pro")}</h3>
      </div>

      <RichText
        tagName="p"
        value={props.attributes.notes}
        placeholder={__("Additional notes ...", "recipe-manager-pro")}
        onChange={(notes) => {
          props.setAttributes({ notes });
        }}
      />

      <section>
        <div className="recipe-manager-pro--block--headline">
          <h3>{__("Video", "recipe-manager-pro")}</h3>
        </div>
        <TextControl
          label={__("Video-URL", "recipe-manager-pro")}
          value={props.attributes.videoUrl}
          type="number"
          onChange={(videoUrl) => props.setAttributes({ videoUrl })}
        />
      </section>

      <section className="seo-section">
        <div className="recipe-manager-pro--block--headline">
          <h3>{__("SEO", "recipe-manager-pro")}</h3>
        </div>

        <p>
          {__(
            "Google and other search enginges needs some more informations to process your recipe. These informations are not visible to your user, but will have impact on the ranking of your recipe in search engines. So we recommend to provide all these informations.",
            "recipe-manager-pro"
          )}
        </p>

        <div className="recipe-manager-pro--block--flex-container">
          <TextControl
            label={__("Cuisine", "recipe-manager-pro")}
            value={props.attributes.recipeCuisine}
            placeholder={__('e.g. "Italian" or "German"', "recipe-manager-pro")}
            onChange={(recipeCuisine) => {
              props.setAttributes({ recipeCuisine });
            }}
          />

          <SelectControl
            label={__("Category", "recipe-manager-pro")}
            value={props.attributes.recipeCategorys}
            options={categoryOptions}
            onChange={(recipeCategory) =>
              props.setAttributes({ recipeCategory })
            }
          />

          <TextControl
            label={__("Keywords", "recipe-manager-pro")}
            value={props.attributes.keywords}
            placeholder={__("quick & easy, vegetarian", "recipe-manager-pro")}
            onChange={(keywords) => {
              props.setAttributes({ keywords });
            }}
          />
        </div>

        <div>
          <h4>{__("Picture of the finished dish", "recipe-manager-pro")}</h4>
          <p>
            {__(
              "You should add 3 pictures in different aspect ratios to this recipe to have a change for a more prominent display in the Google search results. The 16:9 or sometimes the 4:3 aspect ratio is used for the featured snipped. If you provide a square image, Google sometimes display it in your search result.",
              "recipe-manager-pro"
            )}
          </p>
        </div>

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
              <div
                className="image-preview image-preview-1-1"
                style={{
                  backgroundImage: "url(" + props.attributes.image1_1 + ")",
                }}
                onClick={open}
              >
                {!props.attributes.image1_1 ? (
                  <span className="aspect-ratio">1:1</span>
                ) : (
                  ""
                )}
              </div>
            )}
          />
        </MediaUploadCheck>

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
              <div
                className="image-preview image-preview-4-3"
                style={{
                  backgroundImage: "url(" + props.attributes.image4_3 + ")",
                }}
                onClick={open}
              >
                {!props.attributes.image4_3 ? (
                  <span className="aspect-ratio">4:3</span>
                ) : (
                  ""
                )}
              </div>
            )}
          />
        </MediaUploadCheck>

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
              <div
                className="image-preview image-preview-16-9"
                style={{
                  backgroundImage: "url(" + props.attributes.image16_9 + ")",
                }}
                onClick={open}
              >
                {!props.attributes.image16_9 ? (
                  <span className="aspect-ratio">16:9</span>
                ) : (
                  ""
                )}
              </div>
            )}
          />
        </MediaUploadCheck>

        <h5>{__("Previews", "recipe-manager-pro")}</h5>

        <section className="features-snipped-preview">
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
                <div
                  className="features-snipped-preview--image-wrapper features-snipped-preview--43"
                  onClick={open}
                >
                  <div
                    className="features-snipped-preview--image"
                    style={{
                      backgroundImage: "url(" + props.attributes.image4_3 + ")",
                    }}
                  ></div>
                </div>
              )}
            />
          </MediaUploadCheck>
          <div className="features-snipped-preview--title">
            {props.attributes.name}
          </div>
          <div className="features-snipped-preview--blog-title">
            {props.data.title}
          </div>

          {getRatingElement()}
          <div className="features-snipped-preview--total-time">
            {props.attributes.totalTime} Min.
          </div>
        </section>

        <section className="features-snipped-preview">
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
                <div
                  className="features-snipped-preview--image-wrapper"
                  onClick={open}
                >
                  <div
                    className="features-snipped-preview--image"
                    style={{
                      backgroundImage:
                        "url(" + props.attributes.image16_9 + ")",
                    }}
                  ></div>
                </div>
              )}
            />
          </MediaUploadCheck>
          <div className="features-snipped-preview--title">
            {props.attributes.name}
          </div>
          <div className="features-snipped-preview--blog-title">
            {props.data.title}
          </div>
          {getRatingElement()}
          <div className="features-snipped-preview--total-time">
            {props.attributes.totalTime} Min.
          </div>
        </section>
        <div>
          <section className="features-result-preview">
            {/* <div className="features-result-preview--url">
              www.chefkoch.de
              <span className="features-result-preview--breadcrumb">
                › ... › Kategorien › Menüart › Dessert
              </span>
            </div> */}
            <h3 className="features-result-preview--headline">
              {props.attributes.name}
            </h3>
            <div className="features-result-preview--image-text">
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
                    <div
                      className="features-result-preview--image"
                      onClick={open}
                      style={{
                        backgroundImage:
                          "url(" + props.attributes.image1_1 + ")",
                      }}
                    ></div>
                  )}
                ></MediaUpload>
              </MediaUploadCheck>
              <div className="features-result-preview--text">
                <div className="features-result-preview--extract">
                  <span className="features-result-preview--date">
                    {props.data.publishDate} —
                  </span>
                  &nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Morbi nec lectus gravida, sollicitudin velit sed, consectetur
                  quam.
                </div>

                <div className="features-result-preview--meta">
                  <span className="features-snipped-preview--stars">
                    <span
                      className="features-snipped-preview--stars--rated"
                      style={{
                        width:
                          getRatedStarsWidth(props.data.meta.average_rating) +
                          "px",
                      }}
                    ></span>
                  </span>
                  <span>&nbsp;Bewertung: {props.data.meta.average_rating}</span>{" "}
                  · &lrm;
                  <span>{props.data.meta.rating_count} Ergebnisse</span> · &lrm;
                  <span>{props.attributes.totalTime} Min.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
