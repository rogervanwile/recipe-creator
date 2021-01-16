import { __ } from "@wordpress/i18n";
import {
  TextControl,
  PanelBody,
  PanelRow,
  SelectControl,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import { Fragment, useEffect } from "@wordpress/element";
import ImageUpload from "./ImageUpload";

import "./editor.scss";

var foodblogkitchenToolkitMigrationDone = false;

export default function Edit(props) {
  const updateAttributes = (data) => {
    useEffect(() => {
      props.setAttributes(data);
    });
  }

  // TODO: Migration, remove for live version
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!foodblogkitchenToolkitMigrationDone) {
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

    foodblogkitchenToolkitMigrationDone = true;

    updateAttributes(cleanedDefaultData);
  }

  // TODO: Migration, remove for live version
  if (props.attributes.servings) {
    if (!props.attributes.recipeYield) {
      updateAttributes({
        recipeYield: props.attributes.servings,
        recipeYieldUnit: "servings",
        servings: "",
      });
    } else {
      updateAttributes({ servings: "", recipeYieldUnit: "piece" });
    }
  }

  if (props.attributes.recipeYield && !props.attributes.recipeYieldUnit) {
    updateAttributes({ recipeYieldUnit: "piece" });
  }

  const ALLOWED_MEDIA_TYPES = ["image"];

  const categoryOptions = [
    __("Breakfast", 'foodblogkitchen-toolkit'),
    __("Bread", 'foodblogkitchen-toolkit'),
    __("Appetizers & Snacks", 'foodblogkitchen-toolkit'),
    __("Salads", 'foodblogkitchen-toolkit'),
    __("Soups & Stews", 'foodblogkitchen-toolkit'),
    __("Main Dishes", 'foodblogkitchen-toolkit'),
    __("Side Dishes", 'foodblogkitchen-toolkit'),
    __("Desserts", 'foodblogkitchen-toolkit'),
    __("Drinks", 'foodblogkitchen-toolkit'),
    __("Sweets", 'foodblogkitchen-toolkit'),
  ].map((value) => {
    return { label: value, value: value };
  });

  categoryOptions.unshift({
    value: "",
    label: __("Select a category", 'foodblogkitchen-toolkit'),
  });

  const recipeYieldUnitOptions = [
    {
      value: "servings",
      label: __("servings", 'foodblogkitchen-toolkit'),
    },
    {
      value: "piece",
      label: __("piece", 'foodblogkitchen-toolkit'),
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
          {__("No reviews", 'foodblogkitchen-toolkit')}
        </div>
      );
    }
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody
          title={__("SEO", 'foodblogkitchen-toolkit')}
          className="foodblogkitchen-toolkit--sidebar"
        >
          <PanelRow>
            <p>
              {__(
                "Google and other search engines need more information to present your recipe in the best possible way. You should provide this information as good as possible.",
                'foodblogkitchen-toolkit'
              )}
            </p>
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__("Cuisine", 'foodblogkitchen-toolkit')}
              value={props.attributes.recipeCuisine}
              placeholder={__(
                'e.g. "Italian" or "German"',
                'foodblogkitchen-toolkit'
              )}
              onChange={(recipeCuisine) => {
                props.setAttributes({ recipeCuisine });
              }}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              type="number"
              label={__("Calories", 'foodblogkitchen-toolkit')}
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
            <h4>
              {__("Picture of the finished dish", 'foodblogkitchen-toolkit')}
            </h4>
            <p>
              {__(
                "Depending on the usage Google uses different image formats of your recipe. You can find more information",
                'foodblogkitchen-toolkit'
              )}
              &nbsp;
              <a
                href={__(
                  "https://foodblogkitchen.de/mehr-klicks-durch-optimierte-rezeptbilder/",
                  'foodblogkitchen-toolkit'
                )}
                target="_blank"
              >
                {__("here", 'foodblogkitchen-toolkit')}
              </a>
              .
            </p>
          </PanelRow>
          <PanelRow>
            <ImageUpload
              props={props}
              keyName="image3_2"
              label="3:2"
              className="3-2"
            ></ImageUpload>
          </PanelRow>
          <hr />
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
            <h3>{__("Previews", 'foodblogkitchen-toolkit')}</h3>
            <h4>{__("Featured Snippet", 'foodblogkitchen-toolkit')}</h4>
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
            <h4>{__("Mobile Search Result", 'foodblogkitchen-toolkit')}</h4>
          </PanelRow>

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
                  <header>{__("Rating", 'foodblogkitchen-toolkit')}</header>
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
                  <header>
                    {__("Preparation", 'foodblogkitchen-toolkit')}
                  </header>
                  <p>{props.attributes.totalTime} Min.</p>
                </div>

                {/* <div className="featured-result-preview-mobile--calories-col">
                  <header>{__("Calories", 'foodblogkitchen-toolkit')}</header>
                  <p>{__("Calories", 'foodblogkitchen-toolkit')}: 99</p>
                </div> */}
              </div>
            </section>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div className={"foodblogkitchen-toolkit--block " + props.className}>
        <RichText
          tagName="h2"
          value={props.attributes.name}
          placeholder={__("Title of your recipe", 'foodblogkitchen-toolkit')}
          onChange={(name) => {
            props.setAttributes({ name });
          }}
        />
        <div className="foodblogkitchen-toolkit--recipe-block--intro">
          <div>
            <span
              className={
                "foodblogkitchen-toolkit--recipe-block--difficulty" +
                (props.attributes.difficulty !== "simple" ? " unselected" : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "simple" });
              }}
            >
              {__("simple", 'foodblogkitchen-toolkit')}
            </span>
            <span
              className={
                "foodblogkitchen-toolkit--recipe-block--difficulty" +
                (props.attributes.difficulty !== "moderate"
                  ? " unselected"
                  : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "moderate" });
              }}
            >
              {__("moderate", 'foodblogkitchen-toolkit')}
            </span>
            <span
              className={
                "foodblogkitchen-toolkit--recipe-block--difficulty" +
                (props.attributes.difficulty !== "challenging"
                  ? " unselected"
                  : "")
              }
              onClick={() => {
                props.setAttributes({ difficulty: "challenging" });
              }}
            >
              {__("challenging", 'foodblogkitchen-toolkit')}
            </span>

            <RichText
              tagName="p"
              value={props.attributes.description}
              placeholder={__(
                "Short description of your recipe",
                'foodblogkitchen-toolkit'
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
                      image3_2: media.url,
                      image3_2Id: media.id,
                    });
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={props.attributes.image3_2}
                render={({ open }) => (
                  <div
                    className={
                      "foodblogkitchen-toolkit--recipe-block--main-image" +
                      (props.attributes.image3_2
                        ? ""
                        : " foodblogkitchen-toolkit--empty")
                    }
                    style={{
                      backgroundImage: props.attributes.image3_2
                        ? "url(" + props.attributes.image3_2 + ")"
                        : "",
                    }}
                    onClick={open}
                  ></div>
                )}
              />
            </MediaUploadCheck>
          </div>
        </div>
        <hr />
        <div className="foodblogkitchen-toolkit--recipe-block--timing-list">
          <ul>
            <li>
              <header>{__("Prep time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.prepTime}
                  placeholder="0"
                  onChange={(prepTime) => {
                    updateTime("prepTime", prepTime);
                  }}
                  suffix={__("Minutes", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>
            <li>
              <header>{__("Rest time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.restTime}
                  placeholder="0"
                  onChange={(restTime) => {
                    updateTime("restTime", restTime);
                  }}
                  suffix={__("Minutes", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>
            <li>
              <header>{__("Cook time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                <InputControl
                  type="number"
                  min="0"
                  value={props.attributes.cookTime}
                  placeholder="0"
                  onChange={(cookTime) => {
                    updateTime("cookTime", cookTime);
                  }}
                  suffix={__("Minutes", 'foodblogkitchen-toolkit')}
                />
              </span>
            </li>

            <li>
              <header>{__("Total time", 'foodblogkitchen-toolkit')}:</header>
              <span>
                {props.attributes.totalTime || "0"}{" "}
                {__("Minutes", 'foodblogkitchen-toolkit')}
              </span>
            </li>
          </ul>
        </div>
        <hr />
        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Ingredients", 'foodblogkitchen-toolkit')}</h3>
        </div>
        <div className="foodblogkitchen-toolkit--recipe-block--flex-container">
          <InputControl
            label={__("Results in", 'foodblogkitchen-toolkit')}
            type="number"
            min="0"
            value={props.attributes.recipeYield}
            placeholder="0"
            onChange={(recipeYield) => {
              props.setAttributes({ recipeYield });
            }}
          />

          <SelectControl
            label={__("Unit", 'foodblogkitchen-toolkit')}
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
          className="foodblogkitchen-toolkit--recipe-block--ingredients"
          placeholder={__(
            "Add the ingredients here...",
            'foodblogkitchen-toolkit'
          )}
          value={props.attributes.ingredients}
          onChange={(ingredients) => props.setAttributes({ ingredients })}
        />

        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Steps of preparation", 'foodblogkitchen-toolkit')}</h3>
        </div>

        <RichText
          tagName="ol"
          multiline="li"
          className="foodblogkitchen-toolkit--recipe-block--preparation-steps"
          placeholder={__(
            "Add the steps of preparation here...",
            'foodblogkitchen-toolkit'
          )}
          value={props.attributes.preparationSteps}
          onChange={(preparationSteps) =>
            props.setAttributes({ preparationSteps })
          }
        />

        <hr />

        <div className="foodblogkitchen-toolkit--recipe-block--headline">
          <h3>{__("Notes", 'foodblogkitchen-toolkit')}</h3>
        </div>

        <RichText
          tagName="p"
          value={props.attributes.notes}
          placeholder={__("Additional notes ...", 'foodblogkitchen-toolkit')}
          onChange={(notes) => {
            props.setAttributes({ notes });
          }}
        />

        {/* <section>
          <div className="foodblogkitchen-toolkit--recipe-block--headline">
            <h3>{__("Video", 'foodblogkitchen-toolkit')}</h3>
          </div>
          <TextControl
            label={__("Video-URL", 'foodblogkitchen-toolkit')}
            value={props.attributes.videoUrl}
            type="number"
            onChange={(videoUrl) => props.setAttributes({ videoUrl })}
          />
        </section> */}
      </div>
    </Fragment>
  );
}
