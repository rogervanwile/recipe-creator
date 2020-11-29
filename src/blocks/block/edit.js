import { __ } from "@wordpress/i18n";

import {
  TextControl,
  PanelBody,
  PanelRow,
  SelectControl,
  CheckboxControl,
  FormFileUpload,
  Button,
  __experimentalInputControl as InputControl,
  __experimentalRadio as Radio,
  __experimentalRadioGroup as RadioGroup,
} from "@wordpress/components";

import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";

import { Fragment } from "@wordpress/element";

import "./editor.scss";

import ImageUpload from "./ImageUpload";

var foodblogKitchenRecipesMigrationDone = false;

export default function Edit(props) {
  // TODO: Migration, remove for live version
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!foodblogKitchenRecipesMigrationDone) {
    const cleanedDefaultData = {};

    Object.keys(props.attributes).forEach((key) => {
      if (
        typeof props.attributes[key] === "string" &&
        props.attributes[key].indexOf("::STORE_DEFAULT_VALUE_HACK") !== -1
      ) {
        cleanedDefaultData[key] = props.attributes[key].replace(
          "::STORE_DEFAULT_VALUE_HACK",
          ""
        );
      } else if (
        typeof props.attributes[key] === "string" &&
        props.attributes[key].indexOf("::STORE_DEFAULT_VALUE_NUMBER_HACK") !==
          -1
      ) {
        cleanedDefaultData[key] = parseInt(
          props.attributes[key].replace(
            "::STORE_DEFAULT_VALUE_NUMBER_HACK",
            ""
          ),
          10
        );
      } else {
        cleanedDefaultData[key] = props.attributes[key];
      }
    });

    foodblogKitchenRecipesMigrationDone = true;

    props.setAttributes(cleanedDefaultData);
  }

  // TODO: Migration, remove for live version
  if (props.attributes.servings) {
    if (!props.attributes.recipeYield) {
      props.setAttributes({
        recipeYield: props.attributes.servings,
        recipeYieldUnit: "servings",
        servings: "",
      });
    } else {
      props.setAttributes({ servings: "", recipeYieldUnit: "piece" });
    }
  }

  if (props.attributes.recipeYield && !props.attributes.recipeYieldUnit) {
    props.setAttributes({ recipeYieldUnit: "piece" });
  }

  const ALLOWED_MEDIA_TYPES = ["image"];

  const categoryOptions = [
    __("Breakfast", "foodblogkitchen-recipes"),
    __("Bread", "foodblogkitchen-recipes"),
    __("Appetizers & Snacks", "foodblogkitchen-recipes"),
    __("Salads", "foodblogkitchen-recipes"),
    __("Soups & Stews", "foodblogkitchen-recipes"),
    __("Main Dishes", "foodblogkitchen-recipes"),
    __("Side Dishes", "foodblogkitchen-recipes"),
    __("Desserts", "foodblogkitchen-recipes"),
    __("Drinks", "foodblogkitchen-recipes"),
    __("Sweets", "foodblogkitchen-recipes"),
  ].map((value) => {
    return { label: value, value: value };
  });

  categoryOptions.unshift({
    value: "",
    label: __("Select a category", "foodblogkitchen-recipes"),
  });

  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", "foodblogkitchen-recipes"),
    },
    {
      value: "piece",
      label: __("piece", "foodblogkitchen-recipes"),
    },
  ];

  function updateTime(settingKey, value, update = {}) {
    let prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    let restTime = parseInt(props.attributes.restTime, 10) || 0;
    let cookTime = parseInt(props.attributes.cookTime, 10) || 0;

    const intValue = parseInt(value, 10);

    if (!isNaN(intValue)) {
      switch (settingKey) {
        case "prepTime":
          prepTime = intValue;
          update["prepTime"] = "" + prepTime;
          break;
        case "restTime":
          restTime = intValue;
          update["restTime"] = "" + restTime;
          break;
        case "cookTime":
          cookTime = intValue;
          update["cookTime"] = "" + cookTime;
          break;
      }

      update["totalTime"] = "" + (prepTime + restTime + cookTime);

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
        <div className="featured-snipped-preview--rating">
          {props.data.meta.average_rating}&nbsp;
          <span className="featured-snipped-preview--stars">
            <span
              className="featured-snipped-preview--stars--rated"
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
        <div className="featured-snipped-preview--rating">
          {__("No reviews", "foodblogkitchen-recipes")}
        </div>
      );
    }
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody
          title={__("SEO", "foodblogkitchen-recipes")}
          className="foodblogkitchen-recipes--sidebar"
        >
          <PanelRow>
            <p>
              {__(
                "Google and other search engines need more information to present your recipe in the best possible way. You should provide this information as good as possible.",
                "foodblogkitchen-recipes"
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__("Cuisine", "foodblogkitchen-recipes")}
              value={props.attributes.recipeCuisine}
              placeholder={__(
                'e.g. "Italian" or "German"',
                "foodblogkitchen-recipes"
              )}
              onChange={(recipeCuisine) => {
                props.setAttributes({ recipeCuisine });
              }}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              type="number"
              label={__("Calories", "foodblogkitchen-recipes")}
              value={props.attributes.calories}
              description={__("Calories per serving or piece")}
              suffix="kcal"
              onChange={(calories) => {
                props.setAttributes({ calories });
              }}
            />
          </PanelRow>

          <hr />

          <PanelRow>
            <h4>{__("Picture of the finished dish", "foodblogkitchen-recipes")}</h4>
            <p>
              {__(
                "Depending on the usage Google uses different image formats of your recipe.",
                "foodblogkitchen-recipes"
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image1_1"
              label="1:1"
              className="1-1"
            ></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image4_3"
              label="4:3"
              className="4-3"
            ></ImageUpload>
          </PanelRow>
          <hr />
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image16_9"
              label="16:9"
              className="16-9"
            ></ImageUpload>
          </PanelRow>

          <hr />

          <PanelRow>
            <h3>{__("Previews", "foodblogkitchen-recipes")}</h3>
            <h4>{__("Featured Snippet", "foodblogkitchen-recipes")}</h4>
          </PanelRow>

          <PanelRow>
            <section className="featured-snipped-preview">
              <div className="featured-snipped-preview--image-wrapper">
                <div
                  className="featured-snipped-preview--image"
                  style={{
                    backgroundImage: "url(" + props.attributes.image16_9 + ")",
                  }}
                ></div>
              </div>
              <div className="featured-snipped-preview--title">
                {props.attributes.name}
              </div>
              <div className="featured-snipped-preview--blog-title">
                {props.data.title}
              </div>
              {getRatingElement()}
              <div className="featured-snipped-preview--total-time">
                {props.attributes.totalTime} Min.
              </div>
            </section>
          </PanelRow>

          <PanelRow>
            <h4>{__("Mobile Search Result", "foodblogkitchen-recipes")}</h4>
          </PanelRow>

          {/* <PanelRow>
            <section className="featured-result-preview-desktop">
              <h3 className="featured-result-preview-desktop--headline">
                {props.attributes.name}
              </h3>
              <div className="featured-result-preview-desktop--image-text">
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => {
                      if (media) {
                        props.setAttributes({
                          image1_1: media.url,
                          image1_1Id: media.id,
                        });
                      }
                    }}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    value={props.attributes.image1_1}
                    render={({ open }) => (
                      <div
                        className="featured-result-preview-desktop--image"
                        onClick={open}
                        style={{
                          backgroundImage:
                            "url(" + props.attributes.image1_1 + ")",
                        }}
                      ></div>
                    )}
                  ></MediaUpload>
                </MediaUploadCheck>
                <div className="featured-result-preview-desktop--text">
                  <div className="featured-result-preview-desktop--extract">
                    <span className="featured-result-preview-desktop--date">
                      {props.data.publishDate} —
                    </span>
                    &nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Morbi nec lectus gravida, sollicitudin velit sed,
                    consectetur quam.
                  </div>

                  <div className="featured-result-preview-desktop--meta">
                    <span className="featured-snipped-preview--stars">
                      <span
                        className="featured-snipped-preview--stars--rated"
                        style={{
                          width:
                            getRatedStarsWidth(props.data.meta.average_rating) +
                            "px",
                        }}
                      ></span>
                    </span>
                    <span>
                      &nbsp;{__("Rating", "foodblogkitchen-recipes")}:{" "}
                      {props.data.meta.average_rating}
                    </span>{" "}
                    · &lrm;
                    <span>
                      {props.data.meta.rating_count}{" "}
                      {__("reviews", "foodblogkitchen-recipes")}
                    </span>{" "}
                    · &lrm;
                    <span>{props.attributes.totalTime} Min.</span>
                  </div>
                </div>
              </div>
            </section>
          </PanelRow> */}

          <PanelRow>
            <section className="featured-result-preview-mobile">
              <header className="featured-result-preview-mobile--header">
                <span className="featured-result-preview-mobile--breadcrumb">
                  www.domain.com
                </span>
                <h3 className="featured-result-preview-mobile--headline">
                  {props.attributes.name}
                </h3>
              </header>
              <div className="featured-result-preview-mobile--image-text">
                <div
                  className="featured-result-preview-mobile--image"
                  style={{
                    backgroundImage: "url(" + props.attributes.image1_1 + ")",
                  }}
                ></div>
                <div className="featured-result-preview-mobile--text">
                  <div className="featured-result-preview-mobile--extract">
                    {/* <span className="featured-result-preview-mobile--date">
                      {props.data.publishDate} —
                    </span> */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi nec lectus gravida, sollicitudin velit sed,
                    consectetur quam.
                  </div>
                </div>
              </div>

              <div className="featured-result-preview-mobile--footer">
                <div className="featured-result-preview-mobile--rating-col">
                  <header>{__("Rating", "foodblogkitchen-recipes")}</header>
                  <p>
                    <span>{props.data.meta.average_rating}</span>
                    <span className="featured-snipped-preview--stars">
                      <span
                        className="featured-snipped-preview--stars--rated"
                        style={{
                          width:
                            getRatedStarsWidth(props.data.meta.average_rating) +
                            "px",
                        }}
                      ></span>
                    </span>
                    <span>({props.data.meta.rating_count})</span>{" "}
                  </p>
                </div>

                <div className="featured-result-preview-mobile--time-col">
                  <header>{__("Preparation", "foodblogkitchen-recipes")}</header>
                  <p>{props.attributes.totalTime} Min.</p>
                </div>

                {/* <div className="featured-result-preview-mobile--calories-col">
                  <header>{__("Calories", "foodblogkitchen-recipes")}</header>
                  <p>{__("Calories", "foodblogkitchen-recipes")}: 99</p>
                </div> */}
              </div>
            </section>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div className={"foodblogkitchen-recipes--block " + props.className}>
        <RichText
          tagName="h2"
          value={props.attributes.name}
          placeholder={__("Title of your recipe", "foodblogkitchen-recipes")}
          onChange={(name) => {
            props.setAttributes({ name });
          }}
        />
        <div className="foodblogkitchen-recipes--block--intro">
          <div>
            <span
              className={
                "foodblogkitchen-recipes--block--difficulty" +
                (props.attributes.difficulty !== "simple" ? " unselected" : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "simple" });
              }}
            >
              {__("simple", "foodblogkitchen-recipes")}
            </span>
            <span
              className={
                "foodblogkitchen-recipes--block--difficulty" +
                (props.attributes.difficulty !== "moderate"
                  ? " unselected"
                  : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "moderate" });
              }}
            >
              {__("moderate", "foodblogkitchen-recipes")}
            </span>
            <span
              className={
                "foodblogkitchen-recipes--block--difficulty" +
                (props.attributes.difficulty !== "challenging"
                  ? " unselected"
                  : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "challenging" });
              }}
            >
              {__("challenging", "foodblogkitchen-recipes")}
            </span>

            <RichText
              tagName="p"
              value={props.attributes.description}
              placeholder={__(
                "Short description of your recipe",
                "foodblogkitchen-recipes"
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
                    props.setAttributes({
                      image4_3: media.url,
                      image4_3Id: media.id,
                    });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.image4_3}
                render={({ open }) => (
                  <div
                    className="foodblogkitchen-recipes--block--main-image"
                    style={{
                      backgroundImage: "url(" + props.attributes.image4_3 + ")",
                    }}
                    onClick={open}
                  ></div>
                )}
              />
            </MediaUploadCheck>
          </div>
        </div>
        <hr />
        <div className="foodblogkitchen-recipes--block--timing-list">
          <ul>
            <li>
              <header>{__("Prep time", "foodblogkitchen-recipes")}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.prepTime}
                  placeholder="0"
                  onChange={(prepTime) => {
                    updateTime("prepTime", prepTime);
                  }}
                  suffix={__("Minutes", "foodblogkitchen-recipes")}
                />
              </span>
            </li>
            <li>
              <header>{__("Rest time", "foodblogkitchen-recipes")}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.restTime}
                  placeholder="0"
                  onChange={(restTime) => {
                    updateTime("restTime", restTime);
                  }}
                  suffix={__("Minutes", "foodblogkitchen-recipes")}
                />
              </span>
            </li>
            <li>
              <header>{__("Cook time", "foodblogkitchen-recipes")}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.cookTime}
                  placeholder="0"
                  onChange={(cookTime) => {
                    updateTime("cookTime", cookTime);
                  }}
                  suffix={__("Minutes", "foodblogkitchen-recipes")}
                />
              </span>
            </li>

            <li>
              <header>{__("Total time", "foodblogkitchen-recipes")}:</header>
              <span>
                {props.attributes.totalTime}{" "}
                {__("Minutes", "foodblogkitchen-recipes")}
              </span>
            </li>
          </ul>
        </div>
        <hr />
        <div className="foodblogkitchen-recipes--block--headline">
          <h3>{__("Ingredients", "foodblogkitchen-recipes")}</h3>
        </div>
        <div className="foodblogkitchen-recipes--block--flex-container">
          <TextControl
            label={__("Results in", "foodblogkitchen-recipes")}
            type="number"
            min="0"
            value={props.attributes.recipeYield}
            placeholder="0"
            onChange={(recipeYield) => {
              props.setAttributes({ recipeYield });
            }}
          />

          <SelectControl
            label={__("Unit", "foodblogkitchen-recipes")}
            value={props.attributes.recipeYieldUnit}
            options={recipeYieldUnitOptions}
            onChange={(recipeYieldUnit) =>
              props.setAttributes({ recipeYieldUnit })
            }
          />
        </div>

        <RichText
          tagName="ul"
          multiline="li"
          className="foodblogkitchen-recipes--block--ingredients"
          placeholder={__("Add the ingredients here...", "foodblogkitchen-recipes")}
          value={props.attributes.ingredients}
          onChange={(ingredients) => props.setAttributes({ ingredients })}
        />

        <div className="foodblogkitchen-recipes--block--headline">
          <h3>{__("Steps of preparation", "foodblogkitchen-recipes")}</h3>
        </div>

        <RichText
          tagName="ol"
          multiline="li"
          className="foodblogkitchen-recipes--block--preparation-steps"
          placeholder={__(
            "Add the steps of preparation here...",
            "foodblogkitchen-recipes"
          )}
          value={props.attributes.preparationSteps}
          onChange={(preparationSteps) =>
            props.setAttributes({ preparationSteps })
          }
        />

        <hr />

        <div className="foodblogkitchen-recipes--block--headline">
          <h3>{__("Notes", "foodblogkitchen-recipes")}</h3>
        </div>

        <RichText
          tagName="p"
          value={props.attributes.notes}
          placeholder={__("Additional notes ...", "foodblogkitchen-recipes")}
          onChange={(notes) => {
            props.setAttributes({ notes });
          }}
        />

        {/* <section>
          <div className="foodblogkitchen-recipes--block--headline">
            <h3>{__("Video", "foodblogkitchen-recipes")}</h3>
          </div>
          <TextControl
            label={__("Video-URL", "foodblogkitchen-recipes")}
            value={props.attributes.videoUrl}
            type="number"
            onChange={(videoUrl) => props.setAttributes({ videoUrl })}
          />
        </section> */}
      </div>
    </Fragment>
  );
}
